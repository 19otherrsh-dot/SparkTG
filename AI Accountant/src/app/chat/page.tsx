'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';

// ── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  agent?: string;
  agentEmoji?: string;
  richContent?: React.ReactNode;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  date: string;
  active?: boolean;
}

// ── Conversations Sidebar Data ───────────────────────────────────────────────

const conversations: Conversation[] = [
  { id: '1', title: 'GST Filing Query', date: 'Today', active: true },
  { id: '2', title: 'Runway Analysis', date: 'Today' },
  { id: '3', title: 'Vendor Payment Review', date: 'Yesterday' },
  { id: '4', title: 'TDS Compliance Check', date: 'Yesterday' },
  { id: '5', title: 'Monthly P&L Review', date: 'Jun 17' },
  { id: '6', title: 'Payroll Processing', date: 'Jun 15' },
];

// ── Suggested Prompts ────────────────────────────────────────────────────────

const suggestedPrompts = [
  'What\'s my runway?',
  'How much GST do I owe?',
  'Show me burn rate trends',
  'Prepare investor update',
];

// ── Rich Content Components ──────────────────────────────────────────────────

function RunwayCard() {
  return (
    <div className="my-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-xs text-slate-400">Current Cash Balance</p>
          <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-lg font-bold text-emerald-400">
            ₹1.24 Cr
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Monthly Burn Rate</p>
          <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-lg font-bold text-amber-400">
            ₹8.67 L
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-slate-400">Runway</p>
          <p className="mt-1 font-[family-name:var(--font-jetbrains)] text-lg font-bold text-indigo-400">
            14.3 months
          </p>
          <p className="text-[10px] text-slate-500">until September 2027</p>
        </div>
      </div>
    </div>
  );
}

function GSTTable() {
  const rows = [
    { label: 'Output GST (Collected)', value: '₹7,65,000', color: 'text-emerald-400' },
    { label: 'Input GST (Paid)', value: '₹4,45,000', color: 'text-amber-400' },
    { label: 'Net GST Payable', value: '₹3,20,000', color: 'text-rose-400' },
    { label: 'Due Date', value: 'July 20, 2026', color: 'text-indigo-400' },
  ];
  return (
    <div className="my-3 overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-white/5 last:border-b-0">
              <td className="px-4 py-2.5 text-slate-400">{r.label}</td>
              <td className={`px-4 py-2.5 text-right font-[family-name:var(--font-jetbrains)] font-semibold ${r.color}`}>
                {r.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpensesList() {
  const items = [
    { rank: 1, name: 'Salaries & Benefits', amount: '₹18,50,000', pct: '45.2%' },
    { rank: 2, name: 'AWS + Infrastructure', amount: '₹4,80,000', pct: '11.7%' },
    { rank: 3, name: 'Marketing & Ads', amount: '₹3,85,000', pct: '9.4%' },
    { rank: 4, name: 'Rent & Utilities', amount: '₹2,20,000', pct: '5.4%' },
    { rank: 5, name: 'Professional Services', amount: '₹1,95,000', pct: '4.8%' },
  ];
  return (
    <div className="my-3 space-y-2">
      {items.map((item) => (
        <div
          key={item.rank}
          className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-2.5"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-400">
              {item.rank}
            </span>
            <span className="text-sm text-slate-300">{item.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-[family-name:var(--font-jetbrains)] text-sm font-semibold text-slate-200">
              {item.amount}
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-slate-400">
              {item.pct}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm">
        🤖
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 animate-[bounce_1.4s_ease-in-out_infinite] rounded-full bg-indigo-400" />
          <span className="inline-block h-2 w-2 animate-[bounce_1.4s_ease-in-out_0.2s_infinite] rounded-full bg-indigo-400" />
          <span className="inline-block h-2 w-2 animate-[bounce_1.4s_ease-in-out_0.4s_infinite] rounded-full bg-indigo-400" />
        </div>
      </div>
    </div>
  );
}

// ── Initial Demo Messages ────────────────────────────────────────────────────

function buildInitialMessages(): Message[] {
  return [
    {
      id: 'msg-1',
      role: 'user',
      content: "What's my current runway?",
      timestamp: new Date('2026-06-20T09:12:00'),
    },
    {
      id: 'msg-2',
      role: 'ai',
      agent: 'CFO Agent',
      agentEmoji: '🧠',
      content: '',
      richContent: (
        <div>
          <p className="mb-1 text-slate-300">
            Based on your current financials, here&apos;s your runway analysis:
          </p>
          <RunwayCard />
          <p className="mt-2 text-sm text-slate-300">
            Your runway has improved by{' '}
            <span className="font-semibold text-emerald-400">0.8 months</span> since last month due
            to a <span className="font-semibold text-emerald-400">12.3% increase</span> in revenue.
          </p>
          <p className="mt-2 text-sm text-amber-300/90">
            💡 <span className="font-medium">Recommendation:</span> Consider reducing marketing spend
            by 15% to extend runway to 16+ months.
          </p>
        </div>
      ),
      timestamp: new Date('2026-06-20T09:12:04'),
    },
    {
      id: 'msg-3',
      role: 'user',
      content: 'How much GST do I owe this month?',
      timestamp: new Date('2026-06-20T09:14:00'),
    },
    {
      id: 'msg-4',
      role: 'ai',
      agent: 'Tax Agent',
      agentEmoji: '🧾',
      content: '',
      richContent: (
        <div>
          <p className="mb-1 text-slate-300">
            Here&apos;s your GST summary for <span className="font-semibold text-indigo-400">July 2026</span>:
          </p>
          <GSTTable />
          <p className="mt-2 text-sm text-emerald-400">
            ✅ All invoices matched. ITC claim is fully compliant.
          </p>
          <p className="mt-1 text-sm text-amber-400">
            ⚠️ Reminder: GSTR-1 filing due by{' '}
            <span className="font-semibold">July 11, 2026</span>.
          </p>
        </div>
      ),
      timestamp: new Date('2026-06-20T09:14:05'),
    },
    {
      id: 'msg-5',
      role: 'user',
      content: 'Show me top expenses this month',
      timestamp: new Date('2026-06-20T09:18:00'),
    },
    {
      id: 'msg-6',
      role: 'ai',
      agent: 'Bookkeeper Agent',
      agentEmoji: '📚',
      content: '',
      richContent: (
        <div>
          <p className="mb-1 text-slate-300">
            Here are your top 5 expenses for <span className="font-semibold text-indigo-400">June 2026</span>:
          </p>
          <ExpensesList />
          <p className="mt-2 text-sm text-slate-300">
            Total expenses:{' '}
            <span className="font-[family-name:var(--font-jetbrains)] font-semibold text-slate-100">
              ₹40,90,000
            </span>
            . This is{' '}
            <span className="font-semibold text-emerald-400">3.2% lower</span> than May.
          </p>
        </div>
      ),
      timestamp: new Date('2026-06-20T09:18:06'),
    },
  ];
}

// ── Main Chat Page ───────────────────────────────────────────────────────────

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(buildInitialMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversation, setActiveConversation] = useState('1');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  const handleSend = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isTyping) return;

      const userMsg: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      setTimeout(() => {
        const aiMsg: Message = {
          id: `msg-${Date.now()}-ai`,
          role: 'ai',
          agent: 'LedgerAI',
          agentEmoji: '🤖',
          content:
            "I'm currently in demo mode. In production, I'll connect to your financial data to answer any question in real-time!",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }, 1500);
    },
    [input, isTyping],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showSuggestions = messages.length <= 6;

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <DashboardLayout title="AI Chat">
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* ── Mobile Sidebar Overlay ─────────────────────────────────────── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar ────────────────────────────────────────────────────── */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 bg-slate-950/95
            backdrop-blur-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex h-full flex-col p-4">
            {/* New Chat Button */}
            <button
              onClick={() => {
                setMessages([]);
                setActiveConversation('');
                setSidebarOpen(false);
              }}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm font-medium text-indigo-400 transition-all hover:border-indigo-500/50 hover:bg-indigo-500/20"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New Chat
            </button>

            {/* Conversation List */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {conversations.map((conv) => {
                const isActive = conv.id === activeConversation;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveConversation(conv.id);
                      if (conv.id === '1') {
                        setMessages(buildInitialMessages());
                      }
                      setSidebarOpen(false);
                    }}
                    className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                      isActive
                        ? 'border border-white/10 bg-white/10 text-white'
                        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <span className="truncate">{conv.title}</span>
                    <span className="ml-2 flex-shrink-0 text-[10px] text-slate-500">
                      {conv.date}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div className="mt-4 border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  SA
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-200">SparkTG Admin</p>
                  <p className="text-[10px] text-slate-500">Pro Plan</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Chat Area ─────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="flex items-center gap-3 border-b border-white/10 bg-slate-900/50 px-4 py-3 backdrop-blur-sm lg:px-6">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm">
              🤖
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">LedgerAI Assistant</h2>
              <p className="text-[11px] text-emerald-400">● Online — 6 agents active</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
            <div className="mx-auto max-w-3xl space-y-6">
              {/* Welcome header if no messages */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-3xl">
                    🤖
                  </div>
                  <h2 className="text-xl font-semibold text-white">How can I help you today?</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Ask me anything about your finances, taxes, compliance, or business metrics.
                  </p>
                </div>
              )}

              {/* Message Bubbles */}
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === 'user' ? (
                    /* ── User Message ─────────────────────────────────── */
                    <div className="flex justify-end">
                      <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-indigo-600 px-4 py-3 text-sm text-white shadow-lg shadow-indigo-600/20">
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    /* ── AI Message ───────────────────────────────────── */
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-sm">
                        {msg.agentEmoji ?? '🤖'}
                      </div>
                      <div className="max-w-[85%]">
                        <div className="mb-1 flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-400">
                            {msg.agent ?? 'LedgerAI'}
                          </span>
                          <span className="text-[10px] text-slate-600">
                            {msg.timestamp.toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <GlassCard className="rounded-2xl rounded-tl-sm border-white/10 px-4 py-3">
                          {msg.richContent ? (
                            msg.richContent
                          ) : (
                            <p className="text-sm leading-relaxed text-slate-300">{msg.content}</p>
                          )}
                        </GlassCard>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && <TypingIndicator />}

              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* ── Suggested Prompts ───────────────────────────────────────── */}
          {showSuggestions && !isTyping && (
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-2 px-4 pb-3">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300 transition-all hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* ── Input Bar ──────────────────────────────────────────────── */}
          <div className="border-t border-white/10 bg-slate-900/60 px-4 py-3 backdrop-blur-xl lg:px-8">
            <div className="mx-auto max-w-3xl">
              <GlassCard className="flex items-center gap-2 rounded-2xl border-white/10 px-3 py-2">
                {/* Microphone */}
                <button className="flex-shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M12 15a3 3 0 003-3V5a3 3 0 00-6 0v7a3 3 0 003 3z"
                    />
                  </svg>
                </button>

                {/* Text Input */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your AI accountant anything..."
                  disabled={isTyping}
                  className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-white placeholder-slate-500 outline-none disabled:opacity-50"
                />

                {/* Send Button */}
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isTyping}
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 disabled:opacity-40 disabled:shadow-none"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </GlassCard>

              {/* Disclaimer */}
              <p className="mt-2 text-center text-[10px] text-slate-600">
                LedgerAI may produce inaccurate information. Always verify critical financial data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
