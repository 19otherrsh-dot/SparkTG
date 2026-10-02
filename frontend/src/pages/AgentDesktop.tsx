import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Phone, MessageSquare, User, Mic, MicOff, PhoneOff, Pause, Play, Hash, Mail, Send, Check, Wifi, WifiOff, Zap } from 'lucide-react';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import './pages.css';

interface Interaction {
  id: string;
  type: 'voice' | 'chat' | 'email';
  customerName: string;
  customerNumber: string;
  status: 'active' | 'waiting' | 'wrap-up';
  duration: string;
  intent?: string;
  action?: string;
  tags?: string[];
  timestamp?: string;
}

interface ChatMsg {
  id: string;
  sender: 'customer' | 'agent';
  text: string;
  time: string;
}

const ChatInterface: React.FC<{
  interaction: Interaction;
  chatInput: string;
  setChatInput: (v: string) => void;
  onEnd: () => void;
}> = ({ interaction, chatInput, setChatInput, onEnd }) => {
  const { socket } = useSocket();
  const { apiFetch } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  // Fetch initial messages for the interaction
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await apiFetch(`http://localhost:3001/api/chat/${interaction.id}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };
    fetchMessages();
  }, [interaction.id]);

  // Listen for incoming messages on this socket
  useEffect(() => {
    if (!socket) return;
    const handleReceive = (msg: ChatMsg & { interactionId: string }) => {
      if (msg.interactionId === interaction.id) {
        setMessages(prev => {
          // avoid duplicates just in case
          if (prev.find(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    };
    socket.on('chat:receive_message', handleReceive);
    return () => {
      socket.off('chat:receive_message', handleReceive);
    };
  }, [socket, interaction.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!chatInput.trim() || !socket) return;
    
    // Emit to backend
    socket.emit('chat:send_message', {
      interactionId: interaction.id,
      text: chatInput
    });
    
    setChatInput('');
  };

  return (
    <div className="chat-interface">
      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`chat-bubble ${msg.sender}`}>
            <div className="bubble-avatar">
              {msg.sender === 'customer' ? (interaction.customerName?.charAt(0) || 'C') : 'A'}
            </div>
            <div className="bubble-content">
              <div className="bubble-text">{msg.text}</div>
              <div className="bubble-time">{msg.time}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input-area">
        <input
          type="text"
          className="text-input full-width"
          placeholder={`Type a ${interaction.type} message...`}
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="btn btn-primary" style={{ padding: '8px 12px' }} onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};


export const AgentDesktop: React.FC = () => {
  const { socket, isConnected } = useSocket();
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [activeInteractionId, setActiveInteractionId] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  // Listen for seed interactions (sent on first connect)
  useEffect(() => {
    if (!socket) return;

    const handleSeed = (seeds: Interaction[]) => {
      setInteractions(seeds);
      if (seeds.length > 0) setActiveInteractionId(seeds[0].id);
    };

    const handleIncoming = (interaction: Interaction) => {
      setInteractions(prev => {
        // Avoid duplicates
        if (prev.find(i => i.id === interaction.id)) return prev;
        return [interaction, ...prev];
      });
      // Show a toast notification
      setNotification(`New ${interaction.type}: ${interaction.customerName}`);
      setTimeout(() => setNotification(null), 4000);
    };

    socket.on('seed_interactions', handleSeed);
    socket.on('incoming_interaction', handleIncoming);

    return () => {
      socket.off('seed_interactions', handleSeed);
      socket.off('incoming_interaction', handleIncoming);
    };
  }, [socket]);

  const activeInteraction = interactions.find(i => i.id === activeInteractionId) || interactions[0] || null;
  const activeCount = interactions.filter(i => i.status === 'active' || i.status === 'waiting').length;

  const handleEndInteraction = useCallback((id: string) => {
    setInteractions(prev => prev.filter(i => i.id !== id));
    if (activeInteractionId === id) {
      setActiveInteractionId(interactions.find(i => i.id !== id)?.id || null);
    }
    socket?.emit('agent:end_interaction', id);
  }, [activeInteractionId, interactions, socket]);

  const handleAcceptInteraction = useCallback((id: string) => {
    setInteractions(prev => prev.map(i => i.id === id ? { ...i, status: 'active' as const } : i));
    setActiveInteractionId(id);
    socket?.emit('agent:accept_interaction', id);
  }, [socket]);

  const renderInboxItem = (interaction: Interaction) => {
    const Icon = interaction.type === 'voice' ? Phone : interaction.type === 'chat' ? MessageSquare : Mail;
    const isActive = activeInteractionId === interaction.id;
    const isWaiting = interaction.status === 'waiting';
    return (
      <div 
        key={interaction.id} 
        className={`inbox-item ${isActive ? 'active' : ''} ${isWaiting ? 'waiting' : ''}`}
        onClick={() => {
          if (isWaiting) {
            handleAcceptInteraction(interaction.id);
          } else {
            setActiveInteractionId(interaction.id);
          }
        }}
      >
        <div className="item-icon">
          <Icon size={16} />
        </div>
        <div className="item-details">
          <span className="item-name">{interaction.customerName}</span>
          <span className="item-status">
            {isWaiting ? (
              <span className="pulse-dot" style={{ color: 'var(--warning-500)' }}>● Incoming</span>
            ) : (
              <>{interaction.status} • {interaction.duration}</>
            )}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="agent-desktop animate-fade-in">
      {/* Live connection indicator */}
      <div className={`ws-status ${isConnected ? 'connected' : 'disconnected'}`}>
        {isConnected ? <Wifi size={14} /> : <WifiOff size={14} />}
        <span>{isConnected ? 'Live' : 'Disconnected'}</span>
      </div>

      {/* Toast notification for incoming interactions */}
      {notification && (
        <div className="toast-notification animate-slide-up">
          <Zap size={16} />
          <span>{notification}</span>
        </div>
      )}

      <div className="desktop-grid omnichannel">
        
        {/* Column 1: Omnichannel Inbox */}
        <div className="inbox-panel glass">
          <h3 className="sidebar-title mb-4" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Inbox</span>
            <span className="badge badge-warning">{activeCount} Active</span>
          </h3>
          <div className="inbox-list">
            {interactions.length === 0 ? (
              <div className="empty-inbox">
                <Phone size={32} style={{ opacity: 0.3 }} />
                <p className="text-muted text-sm mt-4">No active interactions.<br/>Waiting for incoming...</p>
              </div>
            ) : (
              interactions.map(renderInboxItem)
            )}
          </div>
        </div>

        {/* Column 2: Active Interaction Panel */}
        <div className="interaction-panel glass">
          {!activeInteraction ? (
            <div className="empty-panel">
              <MessageSquare size={48} style={{ opacity: 0.2 }} />
              <p className="text-muted mt-4">Select an interaction from the inbox</p>
            </div>
          ) : (
            <>
              <div className="panel-header">
                <div className={`interaction-badge ${activeInteraction.type === 'voice' ? 'call' : ''}`} style={activeInteraction.type !== 'voice' ? { backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)' } : {}}>
                  {activeInteraction.type === 'voice' && <Phone size={16} />}
                  {activeInteraction.type === 'chat' && <MessageSquare size={16} />}
                  {activeInteraction.type === 'email' && <Mail size={16} />}
                  <span style={{ marginLeft: '6px' }}>{activeInteraction.type.charAt(0).toUpperCase() + activeInteraction.type.slice(1)}</span>
                </div>
                <div className="interaction-timer">{activeInteraction.duration}</div>
              </div>
              
              <div className="customer-info">
                <div className="customer-avatar">
                  <User size={32} />
                </div>
                <div className="customer-details">
                  <h2>{activeInteraction.customerName}</h2>
                  <p className="customer-number">{activeInteraction.customerNumber}</p>
                  <div className="customer-tags">
                    {(activeInteraction.tags || ['Premium Customer', 'Delhi/NCR']).map((tag, i) => (
                      <span key={i} className={`tag ${i === 0 ? 'premium' : ''}`}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="ai-assist-box">
                <h3 className="assist-title">Spark AI Assistant</h3>
                <div className="assist-content">
                  <p><strong>Intent detected:</strong> {activeInteraction.intent || 'Analyzing...'}</p>
                  <p><strong>Suggested Action:</strong> {activeInteraction.action || 'Awaiting context...'}</p>
                </div>
              </div>

              {activeInteraction.type === 'voice' && (
                <div className="call-controls">
                  <button className={`control-btn ${isMuted ? 'active danger' : ''}`} onClick={() => setIsMuted(!isMuted)}>
                    {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    <span>Mute</span>
                  </button>
                  <button className="control-btn bg-danger text-white hover-danger" onClick={() => handleEndInteraction(activeInteraction.id)}>
                    <PhoneOff size={24} />
                    <span>End Call</span>
                  </button>
                  <button className={`control-btn ${isOnHold ? 'active warning' : ''}`} onClick={() => setIsOnHold(!isOnHold)}>
                    {isOnHold ? <Play size={24} /> : <Pause size={24} />}
                    <span>Hold</span>
                  </button>
                  <button className="control-btn">
                    <Hash size={24} />
                    <span>Dialpad</span>
                  </button>
                </div>
              )}

              {(activeInteraction.type === 'chat' || activeInteraction.type === 'email') && (
                <ChatInterface
                  interaction={activeInteraction}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  onEnd={() => handleEndInteraction(activeInteraction.id)}
                />
              )}
            </>
          )}
        </div>

        {/* Column 3: CRM / Screen Pop Panel */}
        <div className="crm-panel glass">
          <div className="panel-tabs">
            <button className="tab active">CRM Profile</button>
            <button className="tab">History</button>
            <button className="tab">Knowledge</button>
          </div>
          
          <div className="crm-content">
            {!activeInteraction ? (
              <div className="empty-panel" style={{ padding: '40px 20px' }}>
                <User size={40} style={{ opacity: 0.15 }} />
                <p className="text-muted mt-4" style={{ fontSize: '0.85rem' }}>Select an interaction to view customer profile</p>
              </div>
            ) : (
              <>
                {/* Customer Profile */}
                <div className="crm-section">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-100)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{activeInteraction.customerName}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{activeInteraction.customerNumber}</div>
                    </div>
                  </div>
                  {activeInteraction.tags && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                      {activeInteraction.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* AI Suggestions */}
                {activeInteraction.intent && (
                  <div className="crm-section">
                    <h3><Zap size={14} /> AI Assistant</h3>
                    <div className="suggestion-card">
                      <strong>Intent Detected:</strong>
                      <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>{activeInteraction.intent}</p>
                    </div>
                    {activeInteraction.action && (
                      <div className="suggestion-card" style={{ marginTop: '8px' }}>
                        <strong>Suggested Action:</strong>
                        <p style={{ fontSize: '0.85rem', margin: '4px 0' }}>{activeInteraction.action}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Tickets */}
                <div className="crm-section">
                  <h3>Recent Tickets</h3>
                  <div className="ticket-list">
                    <div className="ticket-item">
                      <div className="ticket-header">
                        <span className="ticket-id">#T-4921</span>
                        <span className="ticket-status closed">Closed</span>
                      </div>
                      <p className="ticket-subject">Internet connectivity dropping frequently</p>
                      <span className="ticket-date">12 May 2026</span>
                    </div>
                    <div className="ticket-item">
                      <div className="ticket-header">
                        <span className="ticket-id">#T-5102</span>
                        <span className="ticket-status open">Open</span>
                      </div>
                      <p className="ticket-subject">Clarification on latest invoice charges</p>
                      <span className="ticket-date">Today, 09:15 AM</span>
                    </div>
                  </div>
                </div>

                {/* Wrap-Up — Only shown when interaction is active */}
                {activeInteraction.status === 'active' && (
                  <div className="crm-section mt-6">
                    <h3>Interaction Wrap-Up</h3>
                    <form className="disposition-form">
                      <div className="form-group">
                        <label>Disposition</label>
                        <select className="select-input full-width">
                          <option>Issue Resolved</option>
                          <option>Escalated to Tier 2</option>
                          <option>Follow-up Required</option>
                          <option>No Answer / Dropped</option>
                        </select>
                      </div>
                      <div className="form-group mt-4">
                        <label>Notes</label>
                        <textarea className="textarea-input full-width" rows={3} placeholder="Add interaction notes here... (AI will auto-fill post call)"></textarea>
                      </div>
                      <button type="button" className="btn btn-primary mt-4 full-width">
                        <Check size={16} /> Complete & Next
                      </button>
                    </form>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
