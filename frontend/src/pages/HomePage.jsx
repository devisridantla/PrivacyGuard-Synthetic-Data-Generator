import React, { useState } from 'react';
import { 
  Shield, Sparkles, Database, FileSpreadsheet, Lock, ArrowRight, 
  CheckCircle2, Download, Cpu, Layers, BarChart3, Users, Zap, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage({ onNavigate, onQuickGenerate, generating }) {
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleQuickSubmit = (e) => {
    e.preventDefault();
    if (quickPrompt.trim()) {
      onQuickGenerate({
        prompt: quickPrompt,
        isPromptMode: true
      });
    }
  };

  const sampleTemplates = [
    {
      title: "100 Indian Engineering Students",
      desc: "Full names, roll numbers (CSE/ECE/IT), @example.com emails, Indian addresses, CGPA, and departments.",
      count: 100,
      category: "Indian Students",
      icon: Users,
      badge: "Popular College Template",
      columns: ["Name", "Email", "Roll Number", "Department", "Phone Number", "Address", "Age", "CGPA"]
    },
    {
      title: "50 Medical Patient Records",
      desc: "Patient IDs, blood groups, departments (Cardiology, Neurology), admission status, and fictional contacts.",
      count: 50,
      category: "Healthcare / Medical",
      icon: Shield,
      badge: "HIPAA Test Safe",
      columns: ["Patient ID", "Name", "Age", "Gender", "Blood Group", "Department", "Status", "Contact"]
    },
    {
      title: "200 E-Commerce Shoppers",
      desc: "Customer IDs, loyalty tiers, total spend (INR), Indian cities, order volumes, and synthetic contact info.",
      count: 200,
      category: "E-Commerce Customers",
      icon: Layers,
      badge: "Business Analytics",
      columns: ["Customer ID", "Name", "Email", "Phone", "City", "Loyalty Tier", "Total Orders", "Total Spend (INR)"]
    }
  ];

  return (
    <div className="space-y-16 py-6">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950/60 to-purple-950/40 border border-purple-500/20 p-8 sm:p-12 lg:p-16 shadow-2xl shadow-purple-950/30">
        
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>AI-Driven Privacy-Safe Synthetic Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
            <span className="text-white">Zero Real PII</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Synthesize Realistic Data.<br />
            <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Protect Human Privacy.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
            PrivacyGuard generates high-fidelity, completely fictional datasets for software engineering, 
            academic research, and college hackathons — ensuring complete compliance with the 
            India DPDP Act 2023 and GDPR Art. 89 without leaking real people's identities.
          </p>

          {/* Natural Language Prompt Search Bar */}
          <form onSubmit={handleQuickSubmit} className="mt-8 relative max-w-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-slate-950/90 border border-purple-500/30 shadow-xl focus-within:border-purple-400 transition-colors">
              <div className="flex items-center gap-3 w-full px-3 py-2">
                <Cpu className="w-5 h-5 text-purple-400 shrink-0" />
                <input
                  type="text"
                  value={quickPrompt}
                  onChange={(e) => setQuickPrompt(e.target.value)}
                  placeholder="e.g., 'Generate 100 Indian student records with roll number, department, and address'"
                  className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={generating}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm shrink-0 flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Generate AI</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick CTA Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onNavigate('generate')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-950 font-bold text-sm hover:bg-slate-100 transition-all shadow-lg shadow-white/10"
            >
              <span>Configure Custom Dataset</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => onNavigate('privacy')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-all"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Explore Privacy Guarantees</span>
            </button>
          </div>

          {/* Live Trust Metrics */}
          <div className="mt-12 pt-8 border-t border-purple-500/15 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <div className="text-2xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400">Synthetic Guarantee</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-purple-400">0 PII</div>
              <div className="text-xs text-slate-400">Real Data Exposed</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-indigo-300">RFC 2606</div>
              <div className="text-xs text-slate-400">Reserved Test Domains</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-emerald-400">3 Formats</div>
              <div className="text-xs text-slate-400">Excel, CSV & JSON</div>
            </div>
          </div>

        </div>
      </section>

      {/* One-Click Dataset Templates */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Quick-Start Templates</h2>
            <p className="text-sm text-slate-400">Launch instant synthetic datasets with one click.</p>
          </div>
          <button
            onClick={() => onNavigate('generate')}
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1"
          >
            <span>Open Custom Builder</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sampleTemplates.map((tmpl, idx) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 p-6 flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-950/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                      {tmpl.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{tmpl.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{tmpl.desc}</p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {tmpl.columns.slice(0, 4).map((c, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {c}
                      </span>
                    ))}
                    {tmpl.columns.length > 4 && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 text-slate-500 border border-slate-800">
                        +{tmpl.columns.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <button
                  disabled={generating}
                  onClick={() => onQuickGenerate({
                    dataset_name: tmpl.title.replace(/\s+/g, '_'),
                    record_count: tmpl.count,
                    category: tmpl.category,
                    columns: tmpl.columns
                  })}
                  className="w-full py-2.5 px-4 rounded-xl bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 font-semibold text-xs transition-all flex items-center justify-center gap-2 group-hover:shadow-md group-hover:shadow-purple-600/30 disabled:opacity-50"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Generate {tmpl.count} Records</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-purple-400 font-semibold">Engine Architecture</span>
          <h2 className="text-3xl font-extrabold text-white mt-2">Engineered for Academic & Enterprise Rigor</h2>
          <p className="text-sm text-slate-400 mt-3">
            Every synthetic row is generated with statistical consistency, realistic Indian distributions, and strict privacy boundary validation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Realistic Indian Demographics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Curated authentic Indian names, genuine addresses across major cities (Bengaluru, Hyderabad, Mumbai, Delhi), 
              realistic departmental roll numbers (CSE, ECE, EEE, IT), and bell-curved GPA metrics.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Mathematical Privacy Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Never exposes real Aadhaar, PAN, phone numbers, or commercial email providers. Strictly uses IETF RFC 2606 
              reserved domains like <code className="text-purple-300 font-mono">@example.com</code> and fictional telecom ranges.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800/90 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Production-Ready Exports</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant multi-format downloads in Excel (.xlsx with custom-styled headers and compliance certificate), 
              CSV (.csv with synthetic header tags), and structured JSON (.json) for immediate ingestion.
            </p>
          </div>

        </div>
      </section>

      {/* Workflow Step-by-Step */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">How PrivacyGuard Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold text-slate-700">01</span>
            <h4 className="text-sm font-bold text-white mt-2">Configure Schema</h4>
            <p className="text-xs text-slate-400 mt-1">Select record count (10 to 1000), choose fields, or add custom columns.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold text-purple-700/80">02</span>
            <h4 className="text-sm font-bold text-white mt-2">AI Synthesis Engine</h4>
            <p className="text-xs text-slate-400 mt-1">NumPy & Pandas dynamically generate high-fidelity fictional records.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold text-indigo-700/80">03</span>
            <h4 className="text-sm font-bold text-white mt-2">Privacy & PII Audit</h4>
            <p className="text-xs text-slate-400 mt-1">Automated scanner checks reserved domains and calculates 100% safety score.</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 relative">
            <span className="text-3xl font-extrabold text-emerald-700/80">04</span>
            <h4 className="text-sm font-bold text-white mt-2">Instant Download</h4>
            <p className="text-xs text-slate-400 mt-1">Export formatted Excel, CSV, or JSON with metadata certificate attached.</p>
          </div>

        </div>
      </section>

    </div>
  );
}

