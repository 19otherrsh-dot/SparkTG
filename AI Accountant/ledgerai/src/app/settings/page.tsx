"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import GlassCard from "@/components/ui/GlassCard";
import StatusBadge from "@/components/ui/StatusBadge";
import { useState } from "react";

export default function SettingsPage() {
  const [agents, setAgents] = useState([
    { id: "bookkeeper", name: "Bookkeeper Agent", desc: "Auto-categorizes transactions", active: true },
    { id: "tax", name: "Tax Agent", desc: "GST & TDS calculations", active: true },
    { id: "compliance", name: "Compliance Agent", desc: "Tracks deadlines & ROC", active: true },
    { id: "payroll", name: "Payroll Agent", desc: "Salary & payslips", active: true },
    { id: "audit", name: "Audit Agent", desc: "Audit readiness", active: true },
    { id: "cfo", name: "CFO Agent", desc: "Insights & forecasting", active: true },
    { id: "fundraising", name: "Fundraising Agent", desc: "Investor updates", active: true }
  ]);

  const [notifications, setNotifications] = useState({
    email: true,
    whatsapp: true,
    slack: false,
    sms: true
  });

  const toggleAgent = (id: string) => {
    setAgents(agents.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  const integrations = [
    { name: "Tally", icon: "📊", connected: true },
    { name: "Razorpay", icon: "💳", connected: true },
    { name: "HDFC Bank", icon: "🏦", connected: true },
    { name: "Zoho Books", icon: "📚", connected: false },
    { name: "Stripe", icon: "💵", connected: false },
    { name: "WhatsApp", icon: "💬", connected: true },
    { name: "Gmail", icon: "📧", connected: true },
    { name: "Slack", icon: "📱", connected: false },
    { name: "GST Portal", icon: "🏛️", connected: true }
  ];

  return (
    <DashboardLayout title="Settings & Integrations">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
        
        {/* Business Profile */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Business Profile</h2>
          <GlassCard padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Company Name</label>
                <input type="text" readOnly value="Acme Technologies Pvt Ltd" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Industry</label>
                <input type="text" readOnly value="Technology / SaaS" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">GSTIN</label>
                <input type="text" readOnly value="29ABCDE1234F1Z5" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">PAN</label>
                <input type="text" readOnly value="ABCDE1234F" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-400">Registered Address</label>
                <input type="text" readOnly value="123 Startup Hub, Koramangala, Bengaluru, Karnataka 560034" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none" />
              </div>
            </div>
          </GlassCard>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Integrations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((app, i) => (
              <GlassCard key={i} hover={true} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">
                      {app.icon}
                    </div>
                    <span className="font-semibold text-white">{app.name}</span>
                  </div>
                  {app.connected && <StatusBadge status="active" label="Connected" size="sm" />}
                </div>
                <div className="mt-auto pt-4 border-t border-white/10">
                  {app.connected ? (
                    <button className="text-sm text-rose-400 hover:text-rose-300 font-medium transition-colors">Disconnect</button>
                  ) : (
                    <button className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">Connect Integration</button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Agent Configuration */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">AI Agents</h2>
            <GlassCard className="divide-y divide-white/10">
              {agents.map((agent) => (
                <div key={agent.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-white">{agent.name}</h3>
                    <p className="text-sm text-slate-400">{agent.desc}</p>
                  </div>
                  <button 
                    onClick={() => toggleAgent(agent.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${agent.active ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${agent.active ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </GlassCard>
          </section>

          {/* Notifications */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            <GlassCard className="divide-y divide-white/10">
              <div className="py-4 first:pt-0 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Email Notifications</h3>
                  <p className="text-sm text-slate-400">Daily summaries and alerts</p>
                </div>
                <button 
                  onClick={() => setNotifications({...notifications, email: !notifications.email})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.email ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.email ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">WhatsApp Alerts</h3>
                  <p className="text-sm text-slate-400">Urgent deadline reminders</p>
                </div>
                <button 
                  onClick={() => setNotifications({...notifications, whatsapp: !notifications.whatsapp})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.whatsapp ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.whatsapp ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">Slack Integration</h3>
                  <p className="text-sm text-slate-400">Agent activity feed to a channel</p>
                </div>
                <button 
                  onClick={() => setNotifications({...notifications, slack: !notifications.slack})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.slack ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.slack ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              <div className="py-4 last:pb-0 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">SMS (Critical Only)</h3>
                  <p className="text-sm text-slate-400">Tax notices and severe alerts</p>
                </div>
                <button 
                  onClick={() => setNotifications({...notifications, sms: !notifications.sms})}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${notifications.sms ? 'bg-indigo-500' : 'bg-slate-700'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </GlassCard>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
