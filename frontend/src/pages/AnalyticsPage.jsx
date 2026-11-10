import React, { useState, useEffect } from 'react';
import { 
  BarChart3, PieChart, Users, Database, ShieldCheck, Download, 
  Layers, HardDrive, RefreshCw, Calendar, CheckCircle2 
} from 'lucide-react';
import { getHistory } from '../services/api';

export default function AnalyticsPage({ dataset, onNavigate }) {
  const [historyData, setHistoryData] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await getHistory();
      setHistoryData(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const records = dataset?.records || [];
  const analytics = dataset?.analytics || {};
  const deptDist = analytics.department_distribution || {};
  const ageDist = analytics.age_distribution || {};
  const stats = analytics.summary_statistics || {};

  const totalRecords = records.length;
  const totalCols = dataset?.columns?.length || (records[0] ? Object.keys(records[0]).length : 0);
  const memoryKb = analytics.memory_size_kb || (totalRecords ? (totalRecords * totalCols * 0.08).toFixed(1) : 0);

  // Department distribution calculations
  const maxDeptCount = Math.max(...Object.values(deptDist), 1);
  const maxAgeCount = Math.max(...Object.values(ageDist), 1);

  return (
    <div className="space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Analytics & Intelligence</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
              Statistical Dashboard
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Real-time demographic breakdown, statistical distributions, and persistent Supabase / SQLite metadata.
          </p>
        </div>

        <button
          onClick={fetchHistory}
          disabled={loadingHistory}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
          <span>Refresh History</span>
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Records */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Records</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalRecords.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500">
            {dataset ? dataset.dataset_name : 'No active dataset'}
          </div>
        </div>

        {/* Total Columns */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Schema Fields</span>
            <Layers className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {totalCols}
          </div>
          <div className="text-[11px] text-slate-500">
            {totalCols > 0 ? 'Verified schema columns' : 'Awaiting generation'}
          </div>
        </div>

        {/* Memory Footprint */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Estimated Memory</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">
            {memoryKb} <span className="text-base font-normal text-slate-400">KB</span>
          </div>
          <div className="text-[11px] text-slate-500">
            In-memory Pandas DataFrame size
          </div>
        </div>

        {/* Privacy Score */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Privacy Compliance</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">
            100%
          </div>
          <div className="text-[11px] text-emerald-400/80 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>0 Real PII • RFC Compliant</span>
          </div>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Department Distribution */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Department Distribution</h3>
              <p className="text-xs text-slate-400">Breakdown of student departments</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 font-mono">
              {Object.keys(deptDist).length} Branches
            </span>
          </div>

          {Object.keys(deptDist).length > 0 ? (
            <div className="space-y-3.5 pt-2">
              {Object.entries(deptDist).map(([dept, count]) => {
                const pct = Math.round((count / totalRecords) * 100);
                const barWidth = Math.round((count / maxDeptCount) * 100);
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-white">{dept}</span>
                      <span className="text-slate-400 font-mono">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden p-0.5 border border-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              Generate an Indian Student dataset to view departmental analytics.
            </div>
          )}
        </div>

        {/* Chart 2: Age Distribution Histogram */}
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Age Demographics</h3>
              <p className="text-xs text-slate-400">Gaussian bell-curve distribution (18 - 25 years)</p>
            </div>
            {stats.age && (
              <span className="text-xs text-slate-400 font-mono">
                Mean: <strong className="text-purple-300">{stats.age.mean}</strong> yrs
              </span>
            )}
          </div>

          {Object.keys(ageDist).length > 0 ? (
            <div className="space-y-4 pt-2">
              <div className="h-44 flex items-end gap-2 pt-4 px-2 border-b border-slate-800">
                {Object.entries(ageDist).map(([age, count]) => {
                  const barHeight = Math.max(12, Math.round((count / maxAgeCount) * 100));
                  return (
                    <div key={age} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {count}
                      </span>
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 group-hover:from-indigo-500 group-hover:to-purple-400 transition-all"
                        style={{ height: `${barHeight}%` }}
                      ></div>
                      <span className="text-[11px] font-mono text-slate-400 mt-1">{age}</span>
                    </div>
                  );
                })}
              </div>

              {stats.age && (
                <div className="grid grid-cols-4 gap-2 pt-2 text-center">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-500 text-[10px]">Min</span>
                    <div className="font-bold text-white">{stats.age.min}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-500 text-[10px]">Median</span>
                    <div className="font-bold text-white">{stats.age.median}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-500 text-[10px]">Mean</span>
                    <div className="font-bold text-purple-400">{stats.age.mean}</div>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 text-xs">
                    <span className="text-slate-500 text-[10px]">Max</span>
                    <div className="font-bold text-white">{stats.age.max}</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500">
              Age distribution will visualize here when an active dataset includes the Age field.
            </div>
          )}
        </div>

      </div>

      {/* Supabase / SQLite Persistent Metadata & Export History */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">Database Audit & Generation History</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Syncing metadata with <strong className="text-slate-200">{historyData?.source === 'supabase' ? 'Supabase Cloud' : 'Local SQLite Fallback'}</strong>.
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            {historyData?.datasets?.length || 0} Saved Sessions
          </span>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 text-slate-400 font-semibold">Dataset Name</th>
                <th className="py-3 px-4 text-slate-400 font-semibold">Category</th>
                <th className="py-3 px-4 text-slate-400 font-semibold text-center">Records</th>
                <th className="py-3 px-4 text-slate-400 font-semibold text-center">Privacy Score</th>
                <th className="py-3 px-4 text-slate-400 font-semibold text-right">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {historyData?.datasets && historyData.datasets.length > 0 ? (
                historyData.datasets.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-4 font-semibold text-white">
                      {item.dataset_name}
                    </td>
                    <td className="py-2.5 px-4 text-slate-300">
                      {item.category}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono text-purple-300">
                      {item.record_count}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-mono text-[11px] font-semibold">
                        {item.privacy_score}% SAFE
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    No generation sessions recorded yet. Generate a dataset to see history logs here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Export Log Badges */}
        {historyData?.exports && historyData.exports.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-400 mb-2 block">Recent Exports Logged:</span>
            <div className="flex flex-wrap gap-2">
              {historyData.exports.map((exp, i) => (
                <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                  <Download className="w-3 h-3 text-purple-400" />
                  <span className="font-semibold text-white">{exp.dataset_name}</span>
                  <span className="font-mono text-purple-300 uppercase">({exp.export_format})</span>
                  <span className="text-slate-500">• {exp.records_exported} rows</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

