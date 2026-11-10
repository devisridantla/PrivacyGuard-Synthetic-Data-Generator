import React, { useState } from 'react';
import { Database, X, Check, Copy, AlertTriangle, ShieldCheck, ExternalLink, RefreshCw } from 'lucide-react';
import { testSupabaseConnection } from '../services/api';

export default function SupabaseModal({ isOpen, onClose, dbStatus }) {
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async (e) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseKey) {
      setTestResult({ success: false, message: 'Please provide both Supabase Project URL and API Key.' });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(supabaseUrl, supabaseKey);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: err.message || 'Connection test failed.' });
    } finally {
      setTesting(false);
    }
  };

  const copySqlSchema = () => {
    const sql = `-- PrivacyGuard Supabase Schema
CREATE TABLE IF NOT EXISTS dataset_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_name TEXT NOT NULL,
    category TEXT NOT NULL,
    record_count INTEGER NOT NULL,
    columns JSONB NOT NULL,
    format TEXT DEFAULT 'json',
    privacy_score NUMERIC(5, 2) DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS export_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_id UUID REFERENCES dataset_metadata(id) ON DELETE CASCADE,
    dataset_name TEXT NOT NULL,
    export_format TEXT NOT NULL,
    records_exported INTEGER NOT NULL,
    exported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`;
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-950/40">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Supabase Cloud Database</h3>
              <p className="text-xs text-slate-400">Manage persistent dataset metadata & export logging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Current Status Card */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Active Storage Engine</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`w-2.5 h-2.5 rounded-full ${dbStatus?.supabase_connected ? 'bg-emerald-400 animate-pulse' : 'bg-indigo-400'}`}></span>
                <span className="text-sm font-semibold text-white">
                  {dbStatus?.supabase_connected ? 'Supabase Cloud (Connected)' : 'Local SQLite Fallback (Active & Zero-Config)'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {dbStatus?.supabase_connected 
                  ? 'Datasets are automatically synced to your Supabase tables.' 
                  : 'Metadata is safely stored in local embedded SQLite (privacyguard.db) without configuration.'}
              </p>
            </div>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs text-center font-mono">
              Zero PII Policy
            </div>
          </div>

          {/* Test Connection Form */}
          <form onSubmit={handleTestConnection} className="space-y-4">
            <h4 className="text-sm font-semibold text-slate-200">Connect Your Supabase Project</h4>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Supabase Project URL
              </label>
              <input
                type="url"
                placeholder="https://xyzprojectid.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Supabase Anon / Service Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="submit"
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-50"
              >
                {testing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                <span>{testing ? 'Verifying...' : 'Test Connection'}</span>
              </button>

              <span className="text-xs text-slate-400">
                You can also configure via <code className="text-purple-300 font-mono">backend/.env</code>
              </span>
            </div>

            {testResult && (
              <div className={`p-3.5 rounded-lg text-xs border ${
                testResult.success
                  ? testResult.warning 
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}>
                <p className="font-semibold">{testResult.success ? 'Connection Validated' : 'Connection Failed'}</p>
                <p className="mt-0.5">{testResult.message}</p>
              </div>
            )}
          </form>

          {/* SQL Schema helper */}
          <div className="border-t border-slate-800 pt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Supabase SQL Schema (Run in SQL Editor)</span>
              <button
                onClick={copySqlSchema}
                className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL' : 'Copy Schema SQL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 overflow-x-auto max-h-36 border border-slate-800">
{`CREATE TABLE IF NOT EXISTS dataset_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_name TEXT NOT NULL,
    category TEXT NOT NULL,
    record_count INTEGER NOT NULL,
    columns JSONB NOT NULL,
    format TEXT DEFAULT 'json',
    privacy_score NUMERIC(5, 2) DEFAULT 100.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);`}
            </pre>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict zero-PII storage policy verified</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

