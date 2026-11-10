import React from 'react';
import { Shield, Sparkles, Database, FileSpreadsheet, BarChart3, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Navbar({ activePage, setActivePage, recordCount = 0, backendOnline = true, onOpenSupabaseModal }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Sparkles },
    { id: 'generate', label: 'Generate Dataset', icon: Database },
    { id: 'preview', label: 'Dataset Preview', icon: FileSpreadsheet, badge: recordCount > 0 ? `${recordCount}` : null },
    { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-indigo-950/60 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            onClick={() => setActivePage('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">Privacy<span className="text-purple-400">Guard</span></span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                  AI Synthetic
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Zero-PII Data Engine</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 relative ${
                    isActive
                      ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-500 text-white">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls: Backend Status & Supabase Settings */}
          <div className="flex items-center gap-3">
            {/* Backend Connectivity Status */}
            <div 
              title={backendOnline ? "FastAPI Backend is Online" : "FastAPI Backend Offline on port 8000"}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                backendOnline 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/25'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`}></span>
              <span className="hidden sm:inline">{backendOnline ? 'API Online' : 'API Offline'}</span>
            </div>

            {/* Supabase Integration Button */}
            <button
              onClick={onOpenSupabaseModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60 hover:border-purple-500/40 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden lg:inline">Supabase</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800/80">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`p-2 rounded-lg relative ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-slate-400 hover:text-white'}`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

