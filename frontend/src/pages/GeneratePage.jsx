import React, { useState } from 'react';
import { 
  Database, Sparkles, Plus, Trash2, Check, RefreshCw, FileText, 
  Layers, Shield, Cpu, HelpCircle, ArrowRight, Zap 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GeneratePage({ onGenerateDataset, onAIGenerate, generating }) {
  const [activeTab, setActiveTab] = useState('config'); // 'config' or 'ai'

  // Configuration Form State
  const [datasetName, setDatasetName] = useState('Indian_Students_Batch_2026');
  const [recordCount, setRecordCount] = useState(50);
  const [customCountInput, setCustomCountInput] = useState('');
  const [category, setCategory] = useState('Indian Students');
  const [selectedFormat, setSelectedFormat] = useState('json');

  // Available Columns for Indian Students
  const studentColumns = [
    { id: 'Name', label: 'Name', required: true, desc: 'Fictional Indian full name' },
    { id: 'Email', label: 'Email', required: true, desc: 'user001@example.com (RFC 2606)' },
    { id: 'Roll Number', label: 'Roll Number', required: true, desc: 'e.g. CSE2026042, IT2026014' },
    { id: 'Phone Number', label: 'Phone Number', required: false, desc: 'Fictional Indian mobile prefix' },
    { id: 'Address', label: 'Address', required: false, desc: 'Fictional Indian residential address' },
    { id: 'Age', label: 'Age', required: false, desc: 'Integer (18 - 25 years)' },
    { id: 'Department', label: 'Department', required: false, desc: 'CSE, ECE, EEE, IT, Mech, Civil' },
    { id: 'Semester', label: 'Semester', required: false, desc: 'Semester 1 to 8' },
    { id: 'CGPA', label: 'CGPA', required: false, desc: 'Academic score (5.5 - 9.95)' },
    { id: 'Attendance (%)', label: 'Attendance (%)', required: false, desc: 'Attendance rate (65% - 99%)' },
    { id: 'Blood Group', label: 'Blood Group', required: false, desc: 'A+, B+, O+, AB+, etc.' },
    { id: 'Hostel Resident', label: 'Hostel Resident', required: false, desc: 'Yes / No flag' },
  ];

  const [selectedColumns, setSelectedColumns] = useState([
    'Name', 'Email', 'Roll Number', 'Phone Number', 'Address', 'Age', 'Department', 'CGPA'
  ]);

  // Custom Columns State
  const [customColumns, setCustomColumns] = useState([]);
  const [newColName, setNewColName] = useState('');
  const [newColType, setNewColType] = useState('text');
  const [newColOptions, setNewColOptions] = useState('');

  // AI Prompt State
  const [aiPrompt, setAiPrompt] = useState(
    'Generate 100 synthetic student records with name, email, roll number, department, and address'
  );

  const predefinedPrompts = [
    'Generate 100 synthetic student records with name, email, roll number, department, and address',
    'Generate 50 final year CSE students with CGPA, attendance, and roll number',
    'Generate 200 Indian engineering students with full address, phone number, and age',
    'Generate 75 medical patient records with patient ID, blood group, department, and status',
    'Generate 150 e-commerce customers with total spend, city, and loyalty tier'
  ];

  const handleToggleColumn = (colId) => {
    if (selectedColumns.includes(colId)) {
      if (selectedColumns.length <= 1) return; // Prevent 0 columns
      setSelectedColumns(selectedColumns.filter(c => c !== colId));
    } else {
      setSelectedColumns([...selectedColumns, colId]);
    }
  };

  const handleSelectAllColumns = () => {
    setSelectedColumns(studentColumns.map(c => c.id));
  };

  const handleSelectCoreColumns = () => {
    setSelectedColumns(['Name', 'Email', 'Roll Number', 'Phone Number', 'Address', 'Age', 'Department']);
  };

  const handleAddCustomColumn = (e) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    setCustomColumns([
      ...customColumns,
      {
        name: newColName.trim(),
        type: newColType,
        options: newColOptions.trim()
      }
    ]);
    setNewColName('');
    setNewColOptions('');
  };

  const handleRemoveCustomColumn = (idx) => {
    setCustomColumns(customColumns.filter((_, i) => i !== idx));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const finalCount = customCountInput ? parseInt(customCountInput, 10) : recordCount;
    if (isNaN(finalCount) || finalCount < 1) return;

    onGenerateDataset({
      dataset_name: datasetName.trim() || 'Synthetic_Dataset',
      record_count: finalCount,
      category,
      columns: selectedColumns,
      custom_columns: customColumns,
      format: selectedFormat
    });
  };

  const handleAISubmit = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    onAIGenerate(aiPrompt.trim());
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Dataset Configuration</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
              Generator Studio
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Configure schemas or instruct the AI assistant to dynamically create realistic, zero-PII synthetic data.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('config')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'config'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Interactive Studio</span>
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            <span>AI Assistant Mode</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: INTERACTIVE CONFIGURATION STUDIO ================= */}
      {activeTab === 'config' && (
        <form onSubmit={handleFormSubmit} className="space-y-8">
          
          {/* Section 1: Basic Parameters */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 space-y-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">1</span>
              <span>Dataset Identification & Volume</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dataset Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Dataset Name
                </label>
                <input
                  type="text"
                  value={datasetName}
                  onChange={(e) => setDatasetName(e.target.value)}
                  placeholder="e.g. Indian_Students_Batch_2026"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-medium"
                />
                <p className="text-[11px] text-slate-500 mt-1">This will be used as the filename for exports (.xlsx, .csv, .json).</p>
              </div>

              {/* Data Category */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                  Data Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="Indian Students">Indian Students (Colleges & Universities)</option>
                  <option value="Healthcare / Medical">Healthcare / Medical Patients</option>
                  <option value="E-Commerce Customers">E-Commerce Customers & Orders</option>
                  <option value="Corporate / HR">Corporate Employees / HR</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">Controls demographic models, address schemas, and identifier logic.</p>
              </div>

            </div>

            {/* Record Count Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Number of Records to Generate
              </label>
              
              <div className="flex flex-wrap items-center gap-3">
                {[10, 50, 100, 500, 1000].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => {
                      setRecordCount(cnt);
                      setCustomCountInput('');
                    }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      recordCount === cnt && !customCountInput
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30 border border-purple-500'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cnt} Records
                  </button>
                ))}

                {/* Custom count input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="5000"
                    placeholder="Custom count..."
                    value={customCountInput}
                    onChange={(e) => {
                      setCustomCountInput(e.target.value);
                      if (e.target.value) setRecordCount(parseInt(e.target.value, 10));
                    }}
                    className="w-32 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-xs text-slate-500">(max 5,000)</span>
                </div>
              </div>
            </div>

            {/* Target Export Format */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Default Export Format
              </label>
              <div className="grid grid-cols-3 gap-3 max-w-md">
                {[
                  { id: 'xlsx', label: 'Excel (.xlsx)', desc: 'With styling & audit certificate' },
                  { id: 'csv', label: 'CSV (.csv)', desc: 'Standard data science format' },
                  { id: 'json', label: 'JSON (.json)', desc: 'Structured web payload' }
                ].map(fmt => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setSelectedFormat(fmt.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedFormat === fmt.id
                        ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold text-white">{fmt.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{fmt.desc}</div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Section 2: Required Columns Selection */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">2</span>
                  <span>Required Columns ({selectedColumns.length} Selected)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Select standard fields to include in your synthetic schema.</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectCoreColumns}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Core Indian Fields
                </button>
                <button
                  type="button"
                  onClick={handleSelectAllColumns}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                >
                  Select All
                </button>
              </div>
            </div>

            {/* Column Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {studentColumns.map((col) => {
                const isSelected = selectedColumns.includes(col.id);
                return (
                  <div
                    key={col.id}
                    onClick={() => handleToggleColumn(col.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-purple-600/15 border-purple-500/50 shadow-sm shadow-purple-950/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                      isSelected ? 'bg-purple-600 border-purple-500 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{col.label}</span>
                        {col.required && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">Default</span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{col.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Section 3: Custom Columns Builder */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs flex items-center justify-center font-bold">3</span>
                <span>Custom Columns Builder (Optional)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Add non-standard columns tailored to your project requirements.</p>
            </div>

            {/* Add Custom Column Form */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Column Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Scholarship Type, Hackathon Score"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Data Type</label>
                  <select
                    value={newColType}
                    onChange={(e) => setNewColType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="text">Text / String</option>
                    <option value="number">Numeric (Random integer)</option>
                    <option value="choice">Choice / Enumeration</option>
                    <option value="boolean">Boolean (True / False)</option>
                    <option value="id">Fictional ID (PREFIX-XXXX)</option>
                    <option value="date">Date (YYYY-MM-DD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    {newColType === 'choice' ? 'Options (comma-separated)' : 'Options / Notes (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder={newColType === 'choice' ? 'Full, Merit, None' : 'Optional constraints'}
                    value={newColOptions}
                    onChange={(e) => setNewColOptions(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleAddCustomColumn}
                  disabled={!newColName.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white transition-colors disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
              </div>
            </div>

            {/* Added Custom Columns List */}
            {customColumns.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Added Custom Columns:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {customColumns.map((col, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                      <div>
                        <span className="font-bold text-white">{col.name}</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 uppercase font-mono">
                          {col.type}
                        </span>
                        {col.options && (
                          <p className="text-[10px] text-slate-400 mt-0.5">Choices: {col.options}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomColumn(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Submit Button Bar */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Ready for Generation</h4>
                <p className="text-xs text-slate-400">
                  {customCountInput ? customCountInput : recordCount} {category} records • {selectedColumns.length + customColumns.length} columns • 100% Synthetic
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Records...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Dataset Now</span>
                </>
              )}
            </button>
          </div>

        </form>
      )}

      {/* ================= TAB 2: AI ASSISTANT STUDIO ================= */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          
          <div className="rounded-2xl bg-slate-900/60 border border-purple-500/20 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">AI Assistant Prompt Studio</h2>
                <p className="text-xs text-slate-400">
                  Instruct the AI assistant in plain English. The engine interprets target counts, categories, and field requests.
                </p>
              </div>
            </div>

            {/* Prompt Form */}
            <form onSubmit={handleAISubmit} className="space-y-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Natural Language Instructions
              </label>
              
              <div className="relative">
                <textarea
                  rows={4}
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Generate 100 synthetic student records with name, email, roll number, department, and address."
                  className="w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono leading-relaxed resize-none shadow-inner"
                />
              </div>

              {/* Predefined prompt suggestion pills */}
              <div>
                <span className="text-xs font-semibold text-slate-400 mb-2 block">Quick Prompt Suggestions:</span>
                <div className="flex flex-wrap gap-2">
                  {predefinedPrompts.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(p)}
                      className="text-left text-xs px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-purple-950/40 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/40 transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={generating || !aiPrompt.trim()}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>AI Parsing & Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Parse Prompt & Generate</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

          {/* Information Banner */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 flex items-start gap-3">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Strict Privacy Sandboxing:</strong> Prompts are processed locally and securely. 
              No private datasets are uploaded to third-party endpoints. All generated emails strictly use standard test domains (@example.com).
            </p>
          </div>

        </div>
      )}

    </div>
  );
}

