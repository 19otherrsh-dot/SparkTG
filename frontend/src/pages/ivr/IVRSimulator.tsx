import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneOff, Delete, Check } from 'lucide-react';
import type { Node, Edge } from 'reactflow';

interface SimulatorProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

interface LogEntry {
  id: string;
  type: 'system' | 'user';
  text: string;
}

export const IVRSimulator: React.FC<SimulatorProps> = ({ nodes, edges, onClose }) => {
  const [status, setStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [inputBuffer, setInputBuffer] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);
  const [collectConfig, setCollectConfig] = useState({ varName: 'user_dtmf', max: 1 });
  const screenRef = useRef<HTMLDivElement>(null);

  const addLog = (type: 'system' | 'user', text: string) => {
    setLogs(prev => [...prev, { id: Date.now().toString() + Math.random(), type, text }]);
  };

  // Scroll to bottom when logs update
  useEffect(() => {
    if (screenRef.current) {
      screenRef.current.scrollTop = screenRef.current.scrollHeight;
    }
  }, [logs]);

  // Initial call setup
  useEffect(() => {
    if (nodes.length === 0) {
      addLog('system', 'Error: No nodes in workflow');
      setStatus('ended');
      return;
    }

    const timer = setTimeout(() => {
      setStatus('connected');
      addLog('system', 'Call connected');
      
      // Find root node (node not present as any edge target)
      const targetIds = new Set(edges.map(e => e.target));
      let root = nodes.find(n => !targetIds.has(n.id));
      if (!root) root = nodes[0]; // fallback
      
      setCurrentNodeId(root.id);
    }, 1500);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line

  // Engine: Process current node
  useEffect(() => {
    if (status !== 'connected' || !currentNodeId) return;

    const node = nodes.find(n => n.id === currentNodeId);
    if (!node) {
      addLog('system', 'Call ended: Node not found');
      setStatus('ended');
      return;
    }

    const processNode = async () => {
      let nextNodeId: string | null = null;
      let waitMs = 1000;

      switch (node.type) {
        case 'playPrompt':
          addLog('system', `Playing prompt: "${node.data.promptName || 'unknown_prompt'}"`);
          // Find next node
          const edge = edges.find(e => e.source === node.id);
          nextNodeId = edge ? edge.target : null;
          break;

        case 'collectInput':
          addLog('system', 'Waiting for input...');
          setCollectConfig({ 
            varName: node.data.variableName || 'user_dtmf', 
            max: node.data.maxDigits || 1 
          });
          setIsCollecting(true);
          return; // Pause engine here

        case 'branch':
          const varName = node.data.variableName || 'user_dtmf';
          const val = variables[varName];
          addLog('system', `Branching on ${varName} = '${val}'`);
          
          // Find edge matching the value
          let branchEdge = edges.find(e => e.source === node.id && e.sourceHandle === val);
          if (!branchEdge) {
             branchEdge = edges.find(e => e.source === node.id && e.sourceHandle === 'default');
          }
          nextNodeId = branchEdge ? branchEdge.target : null;
          break;

        case 'transfer':
          addLog('system', `Transferring to: ${node.data.destination || 'Unknown'}`);
          waitMs = 2000;
          break; // Ends call

        case 'httpRequest':
          addLog('system', `HTTP ${node.data.method || 'GET'} ${node.data.url || 'localhost'}`);
          const httpEdge = edges.find(e => e.source === node.id);
          nextNodeId = httpEdge ? httpEdge.target : null;
          break;

        case 'hangup':
          addLog('system', `Hangup: ${node.data.reason || 'Normal Clearing'}`);
          break; // Ends call

        default:
          addLog('system', `Unknown node type: ${node.type}`);
      }

      // Transition
      setTimeout(() => {
        if (nextNodeId) {
          setCurrentNodeId(nextNodeId);
        } else {
          addLog('system', 'Call ended by remote party');
          setStatus('ended');
        }
      }, waitMs);
    };

    processNode();
  }, [currentNodeId, status]); // eslint-disable-line

  const handleKeypad = (digit: string) => {
    if (status !== 'connected') return;
    
    if (isCollecting) {
      if (inputBuffer.length < collectConfig.max) {
        setInputBuffer(prev => prev + digit);
      }
    }
  };

  const handleSubmitInput = () => {
    if (!isCollecting || !inputBuffer) return;
    
    addLog('user', `Entered: ${inputBuffer}`);
    setVariables(prev => ({ ...prev, [collectConfig.varName]: inputBuffer }));
    setInputBuffer('');
    setIsCollecting(false);

    // Find next node and proceed
    const edge = edges.find(e => e.source === currentNodeId);
    if (edge) {
      setTimeout(() => setCurrentNodeId(edge.target), 500);
    } else {
      setTimeout(() => {
        addLog('system', 'Call ended (no next node after input)');
        setStatus('ended');
      }, 500);
    }
  };

  const handleEndCall = () => {
    addLog('system', 'Call ended by user');
    setStatus('ended');
  };

  return (
    <div className="simulator-overlay" onClick={onClose}>
      <div className="simulator-phone animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="phone-notch"></div>
        
        <div className="phone-header">
          <h3>Test Call Simulator</h3>
          <div className={`phone-status ${status === 'ended' ? 'ended' : ''}`}>
            {status === 'ringing' && <><Phone size={12} className="spin-slow" /> Ringing...</>}
            {status === 'connected' && <><Phone size={12} /> Connected - 00:00</>}
            {status === 'ended' && <><PhoneOff size={12} /> Call Ended</>}
          </div>
        </div>

        <div className="phone-screen" ref={screenRef}>
          {logs.map(log => (
            <div key={log.id} className={`log-entry ${log.type}`}>
              {log.text}
            </div>
          ))}
          {isCollecting && (
            <div className="log-entry system" style={{ opacity: 0.8, display: 'flex', justifyContent: 'space-between' }}>
              <span>Type {collectConfig.max} digit(s)</span>
              <span style={{ fontWeight: 'bold' }}>{inputBuffer.padEnd(collectConfig.max, '_')}</span>
            </div>
          )}
        </div>

        <div className="phone-keypad-container">
          <div className="phone-keypad">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
              <button 
                key={key} 
                className="keypad-btn"
                onClick={() => handleKeypad(key)}
                disabled={status === 'ended'}
              >
                {key}
                <span className="keypad-sub">
                  {key === '1' ? '' : key === '2' ? 'ABC' : key === '3' ? 'DEF' : key === '4' ? 'GHI' : key === '5' ? 'JKL' : key === '6' ? 'MNO' : key === '7' ? 'PQRS' : key === '8' ? 'TUV' : key === '9' ? 'WXYZ' : ''}
                </span>
              </button>
            ))}
          </div>

          <div className="phone-controls">
            {status !== 'ended' && (
              <button className="control-btn end" onClick={handleEndCall} title="End Call">
                <PhoneOff size={24} />
              </button>
            )}
            {isCollecting && (
              <button 
                className="control-btn submit" 
                onClick={handleSubmitInput} 
                disabled={!inputBuffer}
                title="Submit Input"
              >
                <Check size={24} />
              </button>
            )}
            {status === 'ended' && (
              <button className="btn bg-bg-hover text-text-primary" onClick={onClose} style={{ width: '100%', marginTop: '10px' }}>
                Close Simulator
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
