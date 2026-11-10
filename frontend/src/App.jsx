import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivacyWarningBanner from './components/PrivacyWarningBanner';
import SupabaseModal from './components/SupabaseModal';
import NotificationToast from './components/NotificationToast';

import HomePage from './pages/HomePage';
import GeneratePage from './pages/GeneratePage';
import PreviewPage from './pages/PreviewPage';
import AnalyticsPage from './pages/AnalyticsPage';
import PrivacyPage from './pages/PrivacyPage';

import { checkBackendHealth, generateDataset, generateWithAI } from './services/api';
import confetti from 'canvas-confetti';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentDataset, setCurrentDataset] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);
  const [dbStatus, setDbStatus] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Check health and initialize initial demo dataset
  useEffect(() => {
    checkHealth();
    // Pre-generate a starter Indian Student dataset on first boot
    initDefaultDataset();
  }, []);

  const checkHealth = async () => {
    try {
      const health = await checkBackendHealth();
      if (health.status === 'healthy') {
        setBackendOnline(true);
        setDbStatus(health.database);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  const initDefaultDataset = async () => {
    try {
      const res = await generateDataset({
        dataset_name: 'Indian_Engineering_Students_2026',
        record_count: 50,
        category: 'Indian Students',
        columns: ['Name', 'Email', 'Roll Number', 'Phone Number', 'Address', 'Age', 'Department', 'CGPA'],
        format: 'json'
      });
      setCurrentDataset(res);
    } catch (err) {
      console.warn('Initial dataset preload skipped:', err.message);
    }
  };

  // Generation Handler from Studio Form
  const handleGenerateDataset = async (config) => {
    setGenerating(true);
    try {
      const res = await generateDataset(config);
      setCurrentDataset(res);
      
      // Visual celebration
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      setToast({
        type: 'success',
        title: 'Dataset Generated Successfully!',
        message: `Synthesized ${res.record_count} fictional records with 100% Privacy Compliance Score.`
      });

      // Switch to preview tab
      setActivePage('preview');
    } catch (err) {
      setToast({
        type: 'error',
        title: 'Generation Failed',
        message: err.message || 'Check if FastAPI backend is running on http://localhost:8000.'
      });
    } finally {
      setGenerating(false);
    }
  };

  // Generation Handler from AI Prompt
  const handleAIGenerate = async (prompt) => {
    setGenerating(true);
    try {
      const res = await generateWithAI(prompt);
      setCurrentDataset(res);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 }
      });

      setToast({
        type: 'success',
        title: 'AI Synthesis Complete!',
        message: `Parsed prompt and generated ${res.record_count} records with columns: ${res.columns.slice(0, 3).join(', ')}...`
      });

      setActivePage('preview');
    } catch (err) {
      setToast({
        type: 'error',
        title: 'AI Generation Failed',
        message: err.message || 'Failed to process AI prompt.'
      });
    } finally {
      setGenerating(false);
    }
  };

  // Quick generator from Home Page cards
  const handleQuickGenerate = (payload) => {
    if (payload.isPromptMode) {
      handleAIGenerate(payload.prompt);
    } else {
      handleGenerateDataset({
        dataset_name: payload.dataset_name,
        record_count: payload.record_count,
        category: payload.category,
        columns: payload.columns
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Privacy Warning Banner */}
      <PrivacyWarningBanner />

      {/* Main Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        recordCount={currentDataset?.records?.length || 0}
        backendOnline={backendOnline}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {activePage === 'home' && (
          <HomePage
            onNavigate={setActivePage}
            onQuickGenerate={handleQuickGenerate}
            generating={generating}
          />
        )}

        {activePage === 'generate' && (
          <GeneratePage
            onGenerateDataset={handleGenerateDataset}
            onAIGenerate={handleAIGenerate}
            generating={generating}
          />
        )}

        {activePage === 'preview' && (
          <PreviewPage
            dataset={currentDataset}
            onNavigate={setActivePage}
            onDatasetUpdated={setCurrentDataset}
          />
        )}

        {activePage === 'analytics' && (
          <AnalyticsPage
            dataset={currentDataset}
            onNavigate={setActivePage}
          />
        )}

        {activePage === 'privacy' && (
          <PrivacyPage />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setActivePage} />

      {/* Supabase Configuration Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
        dbStatus={dbStatus}
      />

      {/* Notification Toast */}
      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />

    </div>
  );
}
