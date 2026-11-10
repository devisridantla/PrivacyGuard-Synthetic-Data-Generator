import React from 'react';
import { Shield, Lock, FileCode, ExternalLink, Heart } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 text-xs py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-base text-white">Privacy<span className="text-purple-400">Guard</span></span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                v1.0.0
              </span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              PrivacyGuard is an AI-powered synthetic data generator engineered to produce statistically authentic, 
              completely fictional datasets for academic research, software benchmarking, AI model training, and privacy compliance.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-1">
              <span>GDPR Art. 89 Compliant</span>
              <span>•</span>
              <span>India DPDP Act 2023 Non-Personal</span>
              <span>•</span>
              <span>IETF RFC 2606</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Navigation</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-purple-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('generate')} className="hover:text-purple-400 transition-colors">
                  Dataset Generator Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('preview')} className="hover:text-purple-400 transition-colors">
                  Dataset Preview & Exports
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('analytics')} className="hover:text-purple-400 transition-colors">
                  Analytics & Visualizations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy')} className="hover:text-purple-400 transition-colors">
                  Privacy & Compliance Deep Dive
                </button>
              </li>
            </ul>
          </div>

          {/* Standards & Ethics */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">Privacy Standards</h4>
            <ul className="space-y-2 text-slate-400">
              <li className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-400" />
                <span>Zero Actual PII Ingestion</span>
              </li>
              <li className="flex items-center gap-1.5">
                <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                <span>Reserved Fictional Domains</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Synthetic Watermarking</span>
              </li>
              <li className="pt-2">
                <a 
                  href="http://localhost:8000/docs" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-mono text-[11px]"
                >
                  <span>FastAPI Swagger Docs</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p className="text-center sm:text-left">
            © 2026 PrivacyGuard. All names, addresses, contacts, and identities generated are algorithmic computer fabrications. 
            Any resemblance to actual living persons is purely coincidental.
          </p>
          <div className="flex items-center gap-1 text-slate-400 shrink-0">
            <span>Built for academic excellence & privacy research</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

