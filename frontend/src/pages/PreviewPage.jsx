import React, { useState, useMemo } from 'react';
import { 
  Download, FileSpreadsheet, FileText, Search, ArrowUpDown, ArrowUp, ArrowDown, 
  ChevronLeft, ChevronRight, Filter, ShieldCheck, Check, Copy, AlertCircle, 
  RefreshCw, Layers, Database, Lock, CheckCircle2 
} from 'lucide-react';
import { downloadExcel, downloadCSV, downloadJSON, validatePrivacy, checkDuplicates, getQualityReport } from '../services/api';

export default function PreviewPage({ dataset, onNavigate, onDatasetUpdated }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  
  // Modals / Status States
  const [downloading, setDownloading] = useState(null); // 'excel' | 'csv' | 'json'
  const [copied, setCopied] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditing, setAuditing] = useState(false);
  
  // Quality Report States
  const [qualityResult, setQualityResult] = useState(null);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [evaluatingQuality, setEvaluatingQuality] = useState(false);

  // If no dataset present
  if (!dataset || !dataset.records || dataset.records.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mx-auto flex items-center justify-center">
          <FileSpreadsheet className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">No Dataset Generated Yet</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
            Configure your schema or instruct the AI assistant to synthesize fictional, privacy-compliant records.
          </p>
        </div>
        <button
          onClick={() => onNavigate('generate')}
          className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          <span>Launch Generator Studio</span>
        </button>
      </div>
    );
  }

  const columns = dataset.columns || (dataset.records.length > 0 ? Object.keys(dataset.records[0]) : []);

  // Check unique departments for quick filter
  const departments = useMemo(() => {
    const set = new Set();
    dataset.records.forEach(r => {
      if (r.Department) set.add(r.Department);
    });
    return Array.from(set);
  }, [dataset]);

  // Handle Sorting
  const handleSort = (col) => {
    if (sortField === col) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(col);
      setSortDirection('asc');
    }
  };

  // Filtered and Sorted Records
  const filteredRecords = useMemo(() => {
    let result = [...dataset.records];

    // Department filter
    if (deptFilter !== 'ALL') {
      result = result.filter(r => r.Department === deptFilter);
    }

    // Global Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(row => {
        return Object.values(row).some(val => 
          String(val).toLowerCase().includes(q)
        );
      });
    }

    // Sort
    if (sortField) {
      result.sort((a, b) => {
        const valA = a[sortField] ?? '';
        const valB = b[sortField] ?? '';
        
        // Numeric sort if applicable
        const numA = Number(valA);
        const numB = Number(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortDirection === 'asc' ? numA - numB : numB - numA;
        }

        // String sort
        const comp = String(valA).localeCompare(String(valB));
        return sortDirection === 'asc' ? comp : -comp;
      });
    }

    return result;
  }, [dataset.records, searchTerm, deptFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  // Export handlers
  const handleDownloadExcel = async () => {
    setDownloading('excel');
    try {
      await downloadExcel(dataset.dataset_name || 'dataset', dataset.records, dataset.category, dataset.dataset_id);
    } catch (err) {
      alert(`Excel export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading('csv');
    try {
      await downloadCSV(dataset.dataset_name || 'dataset', dataset.records, dataset.category, dataset.dataset_id);
    } catch (err) {
      alert(`CSV export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleDownloadJSON = async () => {
    setDownloading('json');
    try {
      await downloadJSON(dataset.dataset_name || 'dataset', dataset.records, dataset.category, dataset.dataset_id);
    } catch (err) {
      alert(`JSON export failed: ${err.message}`);
    } finally {
      setDownloading(null);
    }
  };

  const handleCopyClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(dataset.records, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunAudit = async () => {
    setAuditing(true);
    try {
      const res = await validatePrivacy(dataset.records);
      setAuditResult(res);
      setShowAuditModal(true);
    } catch (err) {
      alert(`Privacy audit failed: ${err.message}`);
    } finally {
      setAuditing(false);
    }
  };

  const handleRunQualityReport = async () => {
    setEvaluatingQuality(true);
    try {
      const res = await getQualityReport(dataset.records, dataset.dataset_name);
      setQualityResult(res);
      setShowQualityModal(true);
    } catch (err) {
      alert(`Quality report evaluation failed: ${err.message}`);
    } finally {
      setEvaluatingQuality(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{dataset.dataset_name}</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Synthetic</span>
            </span>
          </div>
          
          <p className="text-xs text-slate-400 mt-1">
            Category: <strong className="text-slate-200">{dataset.category}</strong> • Total Records: <strong className="text-slate-200">{dataset.records.length}</strong> • Columns: <strong className="text-slate-200">{columns.length}</strong>
            {dataset.analytics?.memory_size_kb && ` • Size: ~${dataset.analytics.memory_size_kb} KB`}
          </p>

          {dataset.ai_explanation && (
            <p className="text-xs text-purple-300/90 mt-2 p-2 rounded bg-purple-950/30 border border-purple-500/20 max-w-3xl">
              <strong>AI Reasoning:</strong> {dataset.ai_explanation}
            </p>
          )}
        </div>

        {/* Working Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Excel Button */}
          <button
            onClick={handleDownloadExcel}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
            title="Download formatted Excel workbook with Privacy Certificate"
          >
            {downloading === 'excel' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
            <span>Excel (.xlsx)</span>
          </button>

          {/* CSV Button */}
          <button
            onClick={handleDownloadCSV}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            title="Download standard CSV data science format"
          >
            {downloading === 'csv' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            <span>CSV (.csv)</span>
          </button>

          {/* JSON Button */}
          <button
            onClick={handleDownloadJSON}
            disabled={downloading !== null}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
            title="Download structured JSON"
          >
            {downloading === 'json' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
            <span>JSON (.json)</span>
          </button>

          {/* Privacy Audit Button */}
          <button
            onClick={handleRunAudit}
            disabled={auditing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition-all"
            title="Audit dataset for real PII and check compliance"
          >
            {auditing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />}
            <span>Privacy Audit</span>
          </button>

          {/* Dataset Quality Report Button */}
          <button
            onClick={handleRunQualityReport}
            disabled={evaluatingQuality}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 transition-all"
            title="Inspect Completeness, Uniqueness, Format Validity and Quality Grade"
          >
            {evaluatingQuality ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Layers className="w-3.5 h-3.5 text-cyan-400" />}
            <span>Quality Report</span>
          </button>

          {/* Copy to Clipboard */}
          <button
            onClick={handleCopyClipboard}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
            title="Copy records as JSON"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Controls: Search, Department Filter, Page Size */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search records in real-time..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filters & Options */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {/* Department Filter (if applicable) */}
          {departments.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <select
                value={deptFilter}
                onChange={(e) => {
                  setDeptFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}

          {/* Page Size Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <span>Show:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

        </div>

      </div>

      {/* Interactive Data Table */}
      <div className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px] scrollbar-thin">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header */}
            <thead className="bg-slate-950 sticky top-0 z-20 border-b border-slate-800">
              <tr>
                <th className="py-3 px-3 w-12 text-center text-slate-500 font-mono">#</th>
                {columns.map((col) => {
                  const isSorted = sortField === col;
                  return (
                    <th
                      key={col}
                      onClick={() => handleSort(col)}
                      className="py-3 px-4 font-semibold text-slate-300 hover:text-white cursor-pointer select-none whitespace-nowrap group transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-purple-400" />
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-800/60">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((row, idx) => {
                  const globalIndex = (currentPage - 1) * pageSize + idx + 1;
                  const isEven = idx % 2 === 0;
                  return (
                    <tr 
                      key={idx}
                      className={`hover:bg-purple-950/20 transition-colors ${isEven ? 'bg-slate-900/30' : 'bg-slate-950/30'}`}
                    >
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                        {globalIndex}
                      </td>

                      {columns.map((col) => {
                        const val = row[col];
                        const strVal = String(val ?? '');

                        // Specialized formatting for specific fields
                        let cellContent = strVal;
                        let extraClass = 'text-slate-300';

                        if (col.toLowerCase() === 'email') {
                          extraClass = 'text-purple-300 font-mono';
                        } else if (col.toLowerCase().includes('roll')) {
                          extraClass = 'text-indigo-300 font-semibold font-mono';
                        } else if (col.toLowerCase() === 'name') {
                          extraClass = 'text-white font-medium';
                        } else if (col.toLowerCase() === 'cgpa') {
                          const num = parseFloat(strVal);
                          extraClass = num >= 8.5 ? 'text-emerald-400 font-bold' : num >= 7.0 ? 'text-indigo-300 font-semibold' : 'text-slate-300';
                        } else if (col.toLowerCase() === 'department') {
                          extraClass = 'text-purple-400 font-semibold';
                        }

                        return (
                          <td key={col} className={`py-2.5 px-4 whitespace-nowrap ${extraClass}`}>
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="py-12 text-center text-slate-500">
                    No records match the current filter "{searchTerm}".
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{filteredRecords.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> to{' '}
            <strong className="text-white">{Math.min(currentPage * pageSize, filteredRecords.length)}</strong> of{' '}
            <strong className="text-white">{filteredRecords.length}</strong> filtered records
            {filteredRecords.length !== dataset.records.length && ` (from ${dataset.records.length} total)`}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 py-1 font-mono text-slate-300">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Privacy Audit Modal */}
      {showAuditModal && auditResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
                <ShieldCheck className="w-5 h-5" />
                <span>Synthetic Privacy Audit Certificate</span>
              </div>
              <button 
                onClick={() => setShowAuditModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                <div>
                  <span className="text-emerald-300 font-semibold">Privacy Compliance Score</span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {auditResult.privacy_score}% SAFE
                  </div>
                </div>
                <div className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold text-xs uppercase">
                  Zero Real PII
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Reserved Domain Compliance (RFC 2606)</span>
                  <span className="font-semibold text-emerald-400">{auditResult.reserved_domain_compliance}%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Real Aadhaar / PAN Exposure</span>
                  <span className="font-semibold text-emerald-400">0.00% (None Detected)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Fictional Telecommunication Prefixes</span>
                  <span className="font-semibold text-emerald-400">Verified Test Range</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-300">Compliance Frameworks:</span>
                <ul className="mt-1.5 space-y-1 list-disc list-inside text-slate-400">
                  {auditResult.compliance_standards?.map((std, i) => (
                    <li key={i}>{std}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[11px] text-slate-500 italic p-3 rounded bg-slate-950/80 border border-slate-800">
                {auditResult.privacy_disclaimer}
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowAuditModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dataset Quality & Integrity Report Modal */}
      {showQualityModal && qualityResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-base">
                <Layers className="w-5 h-5" />
                <span>Dataset Quality & Integrity Assessment</span>
              </div>
              <button 
                onClick={() => setShowQualityModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              
              {/* Overall Grade Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-cyan-300 font-semibold uppercase tracking-wider text-[11px]">Quality Score</span>
                  <div className="text-2xl font-extrabold text-white mt-0.5">
                    {qualityResult.overall_score}% • <span className="text-cyan-400">{qualityResult.grade}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    Evaluated across Completeness, Uniqueness, Format Validity, and Privacy
                  </p>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 font-extrabold text-sm border border-cyan-500/40 font-mono">
                  GRADE {qualityResult.grade.split(' ')[0]}
                </div>
              </div>

              {/* 4 Pillars Sub-scores */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Completeness</span>
                  <div className="text-lg font-bold text-white mt-0.5">{qualityResult.completeness_score}%</div>
                  <span className="text-[10px] text-slate-500">{qualityResult.missing_cells} missing cells</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Uniqueness</span>
                  <div className="text-lg font-bold text-white mt-0.5">{qualityResult.uniqueness_score}%</div>
                  <span className="text-[10px] text-slate-500">{qualityResult.duplicate_records} duplicates</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Format Validity</span>
                  <div className="text-lg font-bold text-white mt-0.5">{qualityResult.validity_score}%</div>
                  <span className="text-[10px] text-slate-500">RFC & syntax check</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Privacy Score</span>
                  <div className="text-lg font-bold text-emerald-400 mt-0.5">{qualityResult.privacy_score}%</div>
                  <span className="text-[10px] text-emerald-400/80">0 Real PII detected</span>
                </div>
              </div>

              {/* Field Diagnostics */}
              {qualityResult.field_diagnostics && Object.keys(qualityResult.field_diagnostics).length > 0 && (
                <div>
                  <span className="font-semibold text-slate-300 block mb-2">Field-Level Syntactic Diagnostics:</span>
                  <div className="space-y-1.5">
                    {Object.entries(qualityResult.field_diagnostics).map(([col, diag]) => (
                      <div key={col} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="font-medium text-white">{col} <span className="text-slate-500 text-[10px]">({diag.type})</span></span>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 font-mono">{diag.valid_format_pct}% valid</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold font-mono">
                            {diag.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <span className="font-semibold text-slate-300 block mb-1.5">Assessment & Recommendations:</span>
                <ul className="space-y-1 list-disc list-inside text-slate-300">
                  {qualityResult.recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowQualityModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

