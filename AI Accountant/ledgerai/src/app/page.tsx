"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-indigo-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-emerald-500/10 rounded-full blur-[120px] mix-blend-screen opacity-50 animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className={`relative z-10 text-center max-w-5xl mx-auto transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            LedgerAI v1.0 is live
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8">
            Every Business Gets an <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">
              AI CFO
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            LedgerAI replaces your entire finance department with intelligent AI agents. Bookkeeping, tax, compliance, payroll — all automated, 24/7.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/dashboard" 
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] hover:shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)] flex items-center gap-2"
            >
              Enter Dashboard
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="relative z-20 -mt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/10 shadow-2xl">
          <div className="text-center px-4">
            <div className="text-4xl font-mono font-bold text-white mb-2">95%</div>
            <div className="text-slate-400 font-medium">Automation Rate</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-mono font-bold text-white mb-2">80%</div>
            <div className="text-slate-400 font-medium">Cost Reduction</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-mono font-bold text-white mb-2">99.9%</div>
            <div className="text-slate-400 font-medium">Tax Accuracy</div>
          </div>
          <div className="text-center px-4">
            <div className="text-4xl font-mono font-bold text-white mb-2">24/7</div>
            <div className="text-slate-400 font-medium">Availability</div>
          </div>
        </div>
      </section>

      {/* AI Agents Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Meet Your AI Finance Team</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Seven specialized agents working together to run your financial operations on autopilot.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "📚", name: "Bookkeeper Agent", desc: "Auto-categorizes and reconciles every transaction" },
            { icon: "🧾", name: "Tax Agent", desc: "GST, TDS, and tax optimization on autopilot" },
            { icon: "🛡️", name: "Compliance Agent", desc: "Never miss a filing deadline again" },
            { icon: "👥", name: "Payroll Agent", desc: "Salary processing, payslips, PF & ESI" },
            { icon: "🔍", name: "Audit Agent", desc: "Audit-ready books, always" },
            { icon: "🧠", name: "CFO Agent", desc: "Strategic insights and cash flow forecasting" },
            { icon: "🚀", name: "Fundraising Agent", desc: "Investor updates and data room management" },
            { icon: "🎤", name: "Voice Agent", desc: "Ask questions, get instant answers" },
          ].map((agent, i) => (
            <div key={i} className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:-translate-y-2 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                {agent.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{agent.name}</h3>
              <p className="text-slate-400">{agent.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold mb-16 text-center">Traditional vs AI-Powered</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-900/50 rounded-3xl p-8 border border-white/5 opacity-75">
              <h3 className="text-2xl font-bold text-slate-400 mb-8 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm">🏢</span>
                Traditional Firm
              </h3>
              <ul className="space-y-6">
                <li className="flex items-center justify-between text-slate-500">
                  <span>Response Time</span>
                  <span className="font-mono">2-5 Days</span>
                </li>
                <li className="flex items-center justify-between text-slate-500">
                  <span>Reporting</span>
                  <span className="font-mono">Delayed (Monthly)</span>
                </li>
                <li className="flex items-center justify-between text-slate-500">
                  <span>Cost Structure</span>
                  <span className="font-mono">High Hourly Rates</span>
                </li>
                <li className="flex items-center justify-between text-slate-500">
                  <span>Availability</span>
                  <span className="font-mono">Business Hours</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-indigo-950/30 rounded-3xl p-8 border border-indigo-500/30 relative overflow-hidden shadow-[0_0_50px_-12px_rgba(99,102,241,0.2)]">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full"></div>
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3 relative z-10">
                <span className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm shadow-[0_0_15px_rgba(99,102,241,0.5)]">✨</span>
                LedgerAI
              </h3>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-center justify-between text-white">
                  <span>Response Time</span>
                  <span className="font-mono text-emerald-400 font-bold">Instant</span>
                </li>
                <li className="flex items-center justify-between text-white">
                  <span>Reporting</span>
                  <span className="font-mono text-emerald-400 font-bold">Real-time</span>
                </li>
                <li className="flex items-center justify-between text-white">
                  <span>Cost Structure</span>
                  <span className="font-mono text-emerald-400 font-bold">80% Lower</span>
                </li>
                <li className="flex items-center justify-between text-white">
                  <span>Availability</span>
                  <span className="font-mono text-emerald-400 font-bold">24/7/365</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">Scale your finance team at a fraction of the cost.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Starter */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-medium text-slate-300 mb-2">Starter</h3>
            <div className="text-4xl font-bold text-white mb-6">₹2,999<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-sm text-slate-400 mb-8 h-10">Up to 100 transactions per month.</p>
            <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Basic bookkeeping</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> GST filing</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Email support</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">Get Started</button>
          </div>
          
          {/* Growth */}
          <div className="bg-indigo-900/20 border border-indigo-500/50 rounded-3xl p-8 flex flex-col relative transform scale-105 shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-medium text-indigo-300 mb-2">Growth</h3>
            <div className="text-4xl font-bold text-white mb-6">₹9,999<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-sm text-indigo-200/70 mb-8 h-10">Up to 1,000 transactions per month.</p>
            <ul className="space-y-4 mb-8 flex-grow text-white text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> All Starter features</li>
              <li className="flex items-center gap-3 font-semibold text-indigo-300"><span className="text-emerald-400 font-normal">✓</span> AI CFO included</li>
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> All 7 AI Agents</li>
              <li className="flex items-center gap-3"><span className="text-emerald-400">✓</span> Priority support</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 transition-colors font-semibold shadow-lg">Get Started</button>
          </div>
          
          {/* Scale */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-medium text-slate-300 mb-2">Scale</h3>
            <div className="text-4xl font-bold text-white mb-6">₹49,999<span className="text-lg text-slate-500 font-normal">/mo</span></div>
            <p className="text-sm text-slate-400 mb-8 h-10">Unlimited transactions for scaling startups.</p>
            <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Unlimited transactions</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Dedicated human reviewer</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Custom integrations</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Phone support</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">Contact Sales</button>
          </div>
          
          {/* Enterprise */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-medium text-slate-300 mb-2">Enterprise</h3>
            <div className="text-4xl font-bold text-white mb-6">Custom</div>
            <p className="text-sm text-slate-400 mb-8 h-10">For complex, multi-entity organizations.</p>
            <ul className="space-y-4 mb-8 flex-grow text-slate-300 text-sm">
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Everything in Scale</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Multi-entity support</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> Full API access</li>
              <li className="flex items-center gap-3"><span className="text-emerald-500">✓</span> 99.99% SLA guarantee</li>
            </ul>
            <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors font-medium">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 max-w-7xl mx-auto px-4 text-center border-t border-white/5">
        <h3 className="text-xl font-semibold text-slate-400 mb-8">Connects With Your Existing Tools</h3>
        <div className="flex flex-wrap justify-center gap-4 opacity-70">
          {['Tally', 'Zoho Books', 'QuickBooks', 'Razorpay', 'Stripe', 'HDFC Bank', 'WhatsApp', 'Slack', 'Gmail'].map((tool) => (
            <div key={tool} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium">
              {tool}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#06080d] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-emerald-500"></div>
            <span className="text-xl font-bold text-white tracking-tight">LedgerAI</span>
          </div>
          <div className="text-slate-500 text-sm">
            © 2026 LedgerAI. All rights reserved.
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              Enter Dashboard →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
