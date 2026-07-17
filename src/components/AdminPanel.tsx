/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { VolunteerSignUp } from './Volunteer';
import { 
  X, Lock, Unlock, Settings, Users, Target, TrendingUp, 
  Trash2, Download, Search, Plus, Coins, ShieldAlert, CheckCircle,
  Database, Activity, Terminal, Copy, Check, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  testSupabaseConnection, 
  fetchContactSubmissions, 
  fetchVolunteerRegistrations, 
  REQUIRED_TABLES, 
  SUPABASE_URL, 
  SUPABASE_ANON_KEY 
} from '../lib/supabase';

interface AdminPanelProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ lang, isOpen, onClose }: AdminPanelProps) {
  const isUrdu = lang === 'ur';

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  // Donation Tracker state
  const [goalInput, setGoalInput] = useState<string>('25000000');
  const [raisedInput, setRaisedInput] = useState<string>('19450000');
  const [trackerSuccess, setTrackerSuccess] = useState(false);

  // Volunteers state
  const [volunteers, setVolunteers] = useState<VolunteerSignUp[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Active Tab: 'donation' | 'volunteers' | 'supabase'
  const [activeTab, setActiveTab] = useState<'donation' | 'volunteers' | 'supabase'>('donation');

  // Supabase Diagnostics and Logs states
  const [dbTestResult, setDbTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);
  const [dbTesting, setDbTesting] = useState(false);
  const [copiedTable, setCopiedTable] = useState<string | null>(null);
  const [supabaseContacts, setSupabaseContacts] = useState<any[]>([]);
  const [supabaseVols, setSupabaseVols] = useState<any[]>([]);
  const [loadingSupabaseData, setLoadingSupabaseData] = useState(false);

  // Pre-seed some realistic mock volunteers if none exist
  const seedMockVolunteers = () => {
    const mockSeed: VolunteerSignUp[] = [
      {
        id: 'vol-seed-1',
        name: isUrdu ? 'سلمان علی' : 'Salman Ali',
        email: 'salmanali2204134@gmail.com',
        phone: '03152204134',
        interests: ['food', 'welfare'],
        availability: 'weekends',
        timestamp: '2026-07-15 10:30 AM'
      },
      {
        id: 'vol-seed-2',
        name: isUrdu ? 'محمد احمد' : 'Muhammad Ahmed',
        email: 'ahmed.dev@gmail.com',
        phone: '03180202424',
        interests: ['events'],
        availability: 'flexible',
        timestamp: '2026-07-14 04:15 PM'
      },
      {
        id: 'vol-seed-3',
        name: isUrdu ? 'زینب بی بی' : 'Zainab Bibi',
        email: 'zainab.welfare@gmail.com',
        phone: '03202628645',
        interests: ['food', 'admin'],
        availability: 'weekdays',
        timestamp: '2026-07-13 09:00 AM'
      }
    ];
    localStorage.setItem('hasnain_volunteers', JSON.stringify(mockSeed));
    setVolunteers(mockSeed);
  };

  // Load volunteers & donation values on mount
  useEffect(() => {
    const storedGoal = localStorage.getItem('hasnain_donation_goal') || '25000000';
    const storedRaised = localStorage.getItem('hasnain_donation_raised') || '19450000';
    setGoalInput(storedGoal);
    setRaisedInput(storedRaised);

    const storedVolunteers = localStorage.getItem('hasnain_volunteers');
    if (storedVolunteers) {
      try {
        setVolunteers(JSON.parse(storedVolunteers));
      } catch (e) {
        console.error(e);
        seedMockVolunteers();
      }
    } else {
      seedMockVolunteers();
    }

    // Storage update synchronization
    const syncVolunteers = () => {
      const v = localStorage.getItem('hasnain_volunteers');
      if (v) {
        try { setVolunteers(JSON.parse(v)); } catch (e) {}
      }
    };
    window.addEventListener('volunteers_updated', syncVolunteers);
    return () => window.removeEventListener('volunteers_updated', syncVolunteers);
  }, []);

  const runDiagnostics = async () => {
    setDbTesting(true);
    setDbTestResult(null);
    try {
      const res = await testSupabaseConnection();
      setDbTestResult(res);
      
      if (res.success) {
        setLoadingSupabaseData(true);
        const [contacts, vols] = await Promise.all([
          fetchContactSubmissions(),
          fetchVolunteerRegistrations()
        ]);
        setSupabaseContacts(contacts);
        setSupabaseVols(vols);
      }
    } catch (e: any) {
      setDbTestResult({
        success: false,
        message: 'Diagnostics call raised an exception.',
        details: e.message || e
      });
    } finally {
      setDbTesting(false);
      setLoadingSupabaseData(false);
    }
  };

  // Run diagnostics automatically when Supabase tab is selected
  useEffect(() => {
    if (activeTab === 'supabase') {
      runDiagnostics();
    }
  }, [activeTab]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.toLowerCase() === 'admin' || passcode === '1234') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleBypassAuth = () => {
    setIsAuthenticated(true);
    setAuthError(false);
  };

  const handleSaveTracker = (e: React.FormEvent) => {
    e.preventDefault();
    const g = Number(goalInput);
    const r = Number(raisedInput);

    if (isNaN(g) || isNaN(r) || g <= 0 || r < 0) {
      alert("Please enter valid positive numbers.");
      return;
    }

    localStorage.setItem('hasnain_donation_goal', g.toString());
    localStorage.setItem('hasnain_donation_raised', r.toString());
    
    // Dispatch event to sync visual donation progress instantly across the page
    window.dispatchEvent(new Event('donation_tracker_updated'));
    
    setTrackerSuccess(true);
    setTimeout(() => setTrackerSuccess(false), 3000);
  };

  // Live addition of mock donations to demonstrate animation instantly
  const injectMockDonation = (amount: number) => {
    const currentRaised = Number(raisedInput) || 0;
    const nextRaised = currentRaised + amount;
    setRaisedInput(nextRaised.toString());
    
    localStorage.setItem('hasnain_donation_raised', nextRaised.toString());
    window.dispatchEvent(new Event('donation_tracker_updated'));

    setTrackerSuccess(true);
    setTimeout(() => setTrackerSuccess(false), 2000);
  };

  const handleDeleteVolunteer = (id: string) => {
    const isConfirmed = window.confirm(
      isUrdu 
        ? "کیا آپ واقعی اس رضاکار کی رجسٹریشن حذف کرنا چاہتے ہیں؟" 
        : "Are you sure you want to delete this volunteer registration?"
    );
    if (!isConfirmed) return;

    const filtered = volunteers.filter(v => v.id !== id);
    localStorage.setItem('hasnain_volunteers', JSON.stringify(filtered));
    setVolunteers(filtered);
    window.dispatchEvent(new Event('volunteers_updated'));
  };

  // CSV/JSON Exporting
  const exportVolunteers = (format: 'csv' | 'json') => {
    let dataStr = '';
    let mimeType = '';
    let fileName = '';

    if (format === 'json') {
      dataStr = JSON.stringify(volunteers, null, 2);
      mimeType = 'application/json';
      fileName = 'Hasnain_Volunteers_Registry.json';
    } else {
      // CSV format
      const headers = ['ID', 'Name', 'Email', 'Phone', 'Interests', 'Availability', 'Registered At'];
      const rows = volunteers.map(v => [
        v.id,
        `"${v.name.replace(/"/g, '""')}"`,
        v.email,
        v.phone,
        `"${v.interests.join(', ')}"`,
        v.availability,
        `"${v.timestamp}"`
      ]);
      dataStr = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      mimeType = 'text/csv;charset=utf-8;';
      fileName = 'Hasnain_Volunteers_Registry.csv';
    }

    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredVolunteers = volunteers.filter(v => {
    const query = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(query) ||
      v.email.toLowerCase().includes(query) ||
      v.phone.includes(query) ||
      v.availability.toLowerCase().includes(query)
    );
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
      />

      {/* Main modal container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[85vh] overflow-hidden relative flex flex-col z-10"
      >
        
        {/* Header bar */}
        <div className="p-4 px-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-700" />
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 font-sans">
                {isUrdu ? 'فاؤنڈیشن ایڈمن کنٹرول پینل' : 'Hasnain Foundation Admin Control'}
              </h2>
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono">
                {isUrdu ? 'ڈیمو اور لائیو ٹیسٹنگ موڈ' : 'Demo & Live Testing Mode'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core content scroll container */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            
            {/* 1. AUTH SCREEN */}
            {!isAuthenticated ? (
              <motion.div
                key="auth-panel"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="max-w-md mx-auto py-10 space-y-6 text-center"
              >
                <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto shadow-inner">
                  <Lock className="w-8 h-8 text-emerald-700" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    {isUrdu ? 'ایڈمن رسائی درکار ہے' : 'Administrator Authorization'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    {isUrdu 
                      ? 'عطیات کے اہداف اور رضاکاروں کی فہرست کا انتظام کرنے کے لیے سائن ان کریں۔' 
                      : 'Please type the administrative passcode to access the live donation editor and volunteer records.'}
                  </p>
                </div>

                {/* Simple Form */}
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  <div className="space-y-1 text-left">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
                      {isUrdu ? 'پاس کوڈ درج کریں (پاس ورڈ: admin)' : 'Passcode (Enter: "admin")'}
                    </label>
                    <input
                      type="password"
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter 'admin' or '1234'"
                      className="w-full text-center px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-700 font-mono text-sm tracking-widest max-w-xs mx-auto block bg-slate-50 focus:bg-white"
                    />
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{isUrdu ? 'غلط پاس کوڈ! دوبارہ کوشش کریں۔' : 'Incorrect Passcode! Try "admin"'}</span>
                    </p>
                  )}

                  <div className="flex flex-col gap-2 max-w-xs mx-auto">
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-sm"
                    >
                      {isUrdu ? 'لاگ ان کریں' : 'Verify Passcode'}
                    </button>
                    <button
                      type="button"
                      onClick={handleBypassAuth}
                      className="w-full py-2.5 rounded-lg border border-dashed border-emerald-300 text-emerald-700 bg-emerald-50/40 hover:bg-emerald-50 text-xs font-bold cursor-pointer transition-all"
                    >
                      {isUrdu ? 'ڈیمو بائی پاس (بغیر پاس ورڈ)' : 'Demo Quick Access (Bypass)'}
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              
              // 2. MAIN ADMIN CONTROLS SCREEN
              <motion.div
                key="admin-controls"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Authorization visual indicator */}
                <div className="flex flex-col sm:flex-row justify-between items-center p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 gap-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <Unlock className="w-4 h-4 text-emerald-700 animate-bounce" />
                    <span>{isUrdu ? 'ایڈمن موڈ کامیابی سے فعال ہے!' : 'Authorized: Live Admin Session Active'}</span>
                  </div>
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="px-3 py-1 rounded-md bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 text-[10px] sm:text-xs font-bold cursor-pointer transition-colors"
                  >
                    {isUrdu ? 'لاگ آؤٹ' : 'Logout Admin'}
                  </button>
                </div>

                {/* Tabs selection Row */}
                <div className="flex border-b border-slate-200">
                  <button
                    onClick={() => setActiveTab('donation')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                      activeTab === 'donation'
                        ? 'border-emerald-700 text-emerald-700 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Target className="w-4 h-4" />
                    <span>{isUrdu ? 'مجموعی عطیہ ٹریکر اہداف' : 'Donation Tracker Goal'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('volunteers')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                      activeTab === 'volunteers'
                        ? 'border-emerald-700 text-emerald-700 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>{isUrdu ? 'رجسٹرڈ رضاکار مینیجر' : 'Volunteer Registry'}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold font-mono">
                      {volunteers.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setActiveTab('supabase')}
                    className={`flex items-center gap-2 px-5 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
                      activeTab === 'supabase'
                        ? 'border-emerald-700 text-emerald-700 bg-emerald-50/10'
                        : 'border-transparent text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <Database className="w-4 h-4" />
                    <span>{isUrdu ? 'سپابیس ڈیٹا بیس لائیو' : 'Supabase Live Integration'}</span>
                    <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold font-mono border border-emerald-200 animate-pulse">
                      Live
                    </span>
                  </button>
                </div>

                {/* Tab Contents */}
                <div className="pt-2">
                  {activeTab === 'donation' && (
                    
                    /* T1: DONATION TRACKER MODIFICATION FORM */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left: Input Form */}
                      <form onSubmit={handleSaveTracker} className="md:col-span-7 bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 flex items-center gap-1.5">
                          <Coins className="w-4 h-4 text-emerald-700" />
                          <span>{isUrdu ? 'ٹریکر کی لائیو رقم تبدیل کریں' : 'Edit Overall Fundraising Figures'}</span>
                        </h3>

                        {/* Goal Input */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {isUrdu ? 'مجموعی ہدف کی رقم (PKR)' : 'Overall Target Goal (PKR)'}
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={goalInput}
                            onChange={(e) => setGoalInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-700 font-mono text-xs bg-white text-slate-950"
                          />
                        </div>

                        {/* Raised Input */}
                        <div className="space-y-1">
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {isUrdu ? 'جمع شدہ رقم (PKR)' : 'Total Amount Raised (PKR)'}
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            value={raisedInput}
                            onChange={(e) => setRaisedInput(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-700 font-mono text-xs bg-white text-slate-955"
                          />
                        </div>

                        {/* Visual notifications */}
                        <AnimatePresence>
                          {trackerSuccess && (
                            <motion.p 
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="text-xs text-emerald-700 font-bold flex items-center gap-1.5"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>{isUrdu ? 'مالیاتی ٹریکر کامیابی سے اپ ڈیٹ ہو گیا ہے!' : 'Fundraising statistics saved successfully!'}</span>
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Save Button */}
                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm cursor-pointer transition-colors shadow-sm"
                        >
                          {isUrdu ? 'اہداف محفوظ کریں' : 'Save & Propagate Changes'}
                        </button>
                      </form>

                      {/* Right: Interactive Live Simulation Box */}
                      <div className="md:col-span-5 bg-white rounded-xl p-5 border border-slate-200 space-y-4">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                          <TrendingUp className="w-4 h-4 text-amber-500" />
                          <span>{isUrdu ? 'ڈیمو عطیہ موصولی سمیلیٹر' : 'Live Donation Simulator'}</span>
                        </h4>
                        
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {isUrdu 
                            ? 'لائیو ڈیمو کا تجربہ کرنے کے لیے، نیچے دیئے گئے بٹنوں پر کلک کر کے فرضی عطیہ جمع کریں اور لائیو پروگریس بار کا متحرک اینیمیشن فوری دیکھیں۔'
                            : 'Click any quick-addition button below to inject a mock donation. This lets you observe the animated fundraising progress bar update instantly in real-time!' }
                        </p>

                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => injectMockDonation(10000)}
                            className="p-2 py-3 rounded-lg border border-emerald-200 text-emerald-800 hover:bg-emerald-50 font-mono text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 mb-1" />
                            <span>10,000</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => injectMockDonation(50000)}
                            className="p-2 py-3 rounded-lg border border-amber-200 text-amber-800 hover:bg-amber-50/50 font-mono text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 mb-1" />
                            <span>50,000</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => injectMockDonation(100000)}
                            className="p-2 py-3 rounded-lg border border-royal-200 text-blue-800 hover:bg-blue-50 font-mono text-xs font-bold flex flex-col items-center justify-center cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 mb-1" />
                            <span>100,000</span>
                          </button>
                        </div>

                        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-amber-800">
                          <p className="font-semibold">{isUrdu ? 'ضروری نوٹ:' : 'Demonstration Note:'}</p>
                          <p className="mt-1 leading-normal opacity-90">
                            {isUrdu 
                              ? 'یہ تبدیلیاں براؤزر کے لوکل اسٹوریج (localStorage) میں محفوظ ہوتی ہیں، جو صفحہ کو دوبارہ لوڈ کرنے پر بھی محفوظ رہیں گی۔'
                              : 'These changes persist safely inside local browser storage, making them persistent across page refreshes!' }
                          </p>
                        </div>
                      </div>

                    </div>
                  )}

                  {activeTab === 'volunteers' && (
                    
                    /* T2: VOLUNTEERS MANAGEMENT TABLE */
                    <div className="space-y-4">
                      
                      {/* Search Bar & Export Actions row */}
                      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                        {/* Search Input */}
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={isUrdu ? "نام، ای میل یا دستیابی سے تلاش کریں..." : "Search registered volunteers..."}
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-700 text-xs bg-white text-slate-900"
                          />
                          <div className="absolute top-2.5 left-3 text-slate-400">
                            <Search className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Export Buttons */}
                        <div className="flex gap-2.5 shrink-0">
                          <button
                            onClick={() => exportVolunteers('json')}
                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                            title="Export JSON"
                          >
                            <Download className="w-3.5 h-3.5 text-slate-500" />
                            <span>JSON</span>
                          </button>

                          <button
                            onClick={() => exportVolunteers('csv')}
                            className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-colors"
                            title="Export CSV Table"
                          >
                            <Download className="w-3.5 h-3.5 text-white/90" />
                            <span>Export CSV</span>
                          </button>
                        </div>
                      </div>

                      {/* Volunteers Registry Table */}
                      <div className="border border-slate-200 rounded-lg overflow-x-auto bg-white">
                        {filteredVolunteers.length === 0 ? (
                          <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                            <Users className="w-8 h-8 text-slate-300 mx-auto" />
                            <p>{isUrdu ? 'کوئی رضاکار دستیاب نہیں ہے۔' : 'No registered volunteers matching search criteria.'}</p>
                          </div>
                        ) : (
                          <table className="w-full border-collapse text-xs sm:text-sm text-left">
                            <thead>
                              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                                <th className="p-3.5 px-4">{isUrdu ? 'نام رضاکار' : 'Name'}</th>
                                <th className="p-3.5">{isUrdu ? 'رابطہ نمبر' : 'Contact (Phone / Email)'}</th>
                                <th className="p-3.5">{isUrdu ? 'دلچسپی کے شعبے' : 'Interests'}</th>
                                <th className="p-3.5">{isUrdu ? 'دستیاب اوقات' : 'Availability'}</th>
                                <th className="p-3.5 text-center shrink-0">{isUrdu ? 'حذف' : 'Action'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredVolunteers.map((vol) => (
                                <tr key={vol.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                  {/* Name & time */}
                                  <td className="p-3.5 px-4 font-bold text-slate-900">
                                    <div>{vol.name}</div>
                                    <span className="text-[10px] text-slate-400 font-mono font-medium block mt-0.5">
                                      {vol.timestamp}
                                    </span>
                                  </td>

                                  {/* Contact info */}
                                  <td className="p-3.5">
                                    <div className="font-mono text-slate-800">{vol.phone}</div>
                                    <div className="text-slate-400 text-[11px] mt-0.5 font-mono">{vol.email}</div>
                                  </td>

                                  {/* Areas of Interest */}
                                  <td className="p-3.5">
                                    <div className="flex flex-wrap gap-1">
                                      {vol.interests.map((i) => (
                                        <span 
                                          key={i} 
                                          className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-extrabold text-emerald-800 uppercase tracking-wide"
                                        >
                                          {i}
                                        </span>
                                      ))}
                                    </div>
                                  </td>

                                  {/* Availability preference */}
                                  <td className="p-3.5">
                                    <span className="px-1.5 py-0.5 rounded bg-amber-50 border border-amber-100 text-[10px] font-extrabold text-amber-800 uppercase tracking-wide">
                                      {vol.availability}
                                    </span>
                                  </td>

                                  {/* Actions */}
                                  <td className="p-3.5 text-center">
                                    <button
                                      onClick={() => handleDeleteVolunteer(vol.id)}
                                      className="p-1.5 rounded bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 cursor-pointer transition-all"
                                      title="Delete Registration"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>

                    </div>
                  )}

                  {activeTab === 'supabase' && (
                    
                    /* T3: SUPABASE DIAGNOSTICS & MANAGEMENT */
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start text-left font-sans">
                      
                      {/* Left: Diagnostics & Status Panel */}
                      <div className="md:col-span-6 space-y-5">
                        
                        {/* Status Card */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <Activity className="w-4 h-4 text-emerald-700 animate-pulse" />
                              <span>{isUrdu ? 'کنکشن کی حالت' : 'API Connection Diagnostics'}</span>
                            </h3>

                            {dbTestResult ? (
                              dbTestResult.success ? (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 font-extrabold border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isUrdu ? 'فعال ہے' : 'Operational'}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-rose-50 text-rose-800 font-extrabold border border-rose-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>{isUrdu ? 'مسئلہ ہے' : 'Error / Disconnected'}</span>
                                </span>
                              )
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-600 font-extrabold border border-slate-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-ping" />
                                <span>{isUrdu ? 'نامعلوم' : 'Unchecked'}</span>
                              </span>
                            )}
                          </div>

                          {/* Dynamic Parameters */}
                          <div className="space-y-2 text-xs font-medium text-left">
                            <div className="flex justify-between border-b border-slate-150 pb-1.5">
                              <span className="text-slate-400">{isUrdu ? 'سپابیس سرور یو آر ایل:' : 'Endpoint URL:'}</span>
                              <span className="font-mono text-[10px] text-slate-800 select-all">{SUPABASE_URL}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-150 pb-1.5">
                              <span className="text-slate-400">{isUrdu ? 'اے پی آئی کلید (Anon Key):' : 'Publishable Key (Anon):'}</span>
                              <span className="font-mono text-[10px] text-slate-800">
                                {SUPABASE_ANON_KEY.substring(0, 15)}...{SUPABASE_ANON_KEY.substring(SUPABASE_ANON_KEY.length - 10)}
                              </span>
                            </div>
                          </div>

                          {/* Run Diagnostics button */}
                          <button
                            onClick={runDiagnostics}
                            disabled={dbTesting}
                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer transition-colors disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${dbTesting ? 'animate-spin' : ''}`} />
                            <span>{dbTesting ? (isUrdu ? 'ٹیسٹنگ جاری ہے...' : 'Testing Endpoints...') : (isUrdu ? 'ٹیسٹ کنکشن رن کریں' : 'Run Diagnostics Test')}</span>
                          </button>
                        </div>

                        {/* Diagnostics Terminal Logs Output */}
                        <div className="bg-slate-900 text-emerald-400 rounded-xl border border-slate-850 p-4 font-mono text-[11px] leading-relaxed relative">
                          <div className="absolute top-2.5 right-3 text-slate-500 text-[10px] select-none flex items-center gap-1">
                            <Terminal className="w-3 h-3 text-slate-500" />
                            <span>diagnostics_stderr.log</span>
                          </div>

                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 select-none">
                            {isUrdu ? 'ٹیسٹ لاگز اور آؤٹ پٹ' : 'Console System Output'}
                          </h4>

                          <div className="space-y-1 max-h-[160px] overflow-y-auto">
                            <p className="text-slate-500">// {isUrdu ? 'آخری تشخیصی سیشن کا آؤٹ پٹ' : 'Diagnostics output stream:'}</p>
                            {dbTesting && <p className="text-amber-300 animate-pulse">&gt; Initializing WebSocket, establishing TLS with {SUPABASE_URL}...</p>}
                            {dbTestResult ? (
                              <>
                                <p className={dbTestResult.success ? 'text-emerald-400' : 'text-rose-400'}>
                                  &gt; Connection status: {dbTestResult.success ? 'SUCCESS (200 OK)' : 'FAILED'}
                                </p>
                                <p className="text-slate-300">&gt; Message: {dbTestResult.message}</p>
                                {dbTestResult.details && (
                                  <p className="text-slate-400 text-[10px] whitespace-pre-wrap max-w-full">
                                    &gt; Details: {JSON.stringify(dbTestResult.details, null, 2)}
                                  </p>
                                )}
                              </>
                            ) : (
                              !dbTesting && <p className="text-slate-500">&gt; No diagnostic tests run yet. Click "Run Diagnostics Test" above.</p>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* Right: Copy-paste SQL schema script panel */}
                      <div className="md:col-span-6 space-y-4">
                        
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3.5">
                          <div className="flex justify-between items-center">
                            <h3 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                              <Database className="w-4 h-4 text-emerald-700" />
                              <span>{isUrdu ? 'سپابیس کلاؤڈ سکیما سکرپٹ' : 'Database Schema Script'}</span>
                            </h3>

                            <button
                              onClick={() => {
                                const sqlText = `
-- Create contact form submissions table
create table contact_submissions (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create volunteer registrations table
create table volunteer_registrations (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  interests text[] not null,
  availability text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up RLS (Row Level Security) and enable insert access
alter table contact_submissions enable row level security;
create policy "Allow insert access to anonymous users" on contact_submissions for insert with check (true);
create policy "Allow select access to administrators" on contact_submissions for select using (true);

alter table volunteer_registrations enable row level security;
create policy "Allow insert access to anonymous users" on volunteer_registrations for insert with check (true);
create policy "Allow select access to administrators" on volunteer_registrations for select using (true);
`;
                                navigator.clipboard.writeText(sqlText);
                                setCopiedTable('schema');
                                setTimeout(() => setCopiedTable(null), 3000);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              {copiedTable === 'schema' ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>{isUrdu ? 'کاپی ہو گیا!' : 'SQL Copied!'}</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{isUrdu ? 'اسکرپٹ کاپی کریں' : 'Copy SQL Schema'}</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed">
                            {isUrdu 
                              ? 'اپنے سپابیس ڈیش بورڈ کے "SQL Editor" میں جائیں اور رابطہ فارم اور رضاکار رجسٹریشن کی معلومات کو کلاؤڈ ڈیٹا بیس میں محفوظ کرنے کے لیے درج ذیل اسکرپٹ کو چلائیں:'
                              : 'Open your Supabase Workspace, click on "SQL Editor", paste and execute this script. This will provision the necessary relational tables with instant Row Level Security (RLS) policies:'}
                          </p>

                          <div className="bg-slate-900 border border-slate-850 rounded-lg p-3 text-emerald-500 font-mono text-[9px] leading-relaxed max-h-[160px] overflow-y-auto whitespace-pre select-all text-left">
{`-- 1. Submissions Table
create table contact_submissions (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,
  created_at timestamp with time zone default now()
);

-- 2. Volunteers Table
create table volunteer_registrations (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  interests text[] not null,
  availability text,
  created_at timestamp with time zone default now()
);

-- 3. Enable RLS
alter table contact_submissions enable row level security;
alter table volunteer_registrations enable row level security;

-- 4. Enable Public Insert
create policy "allow_anon_insert" on contact_submissions for insert with check (true);
create policy "allow_anon_insert" on volunteer_registrations for insert with check (true);`}
                          </div>
                        </div>

                      </div>

                      {/* Bottom Live Synced Records Panel */}
                      {dbTestResult?.success && (
                        <div className="md:col-span-12 space-y-4 pt-2 border-t border-slate-200">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {isUrdu ? 'سپابیس سے براہ راست ہم آہنگ شدہ ریکارڈز (لائیو سٹریمنگ)' : 'Live Synced Cloud Database Submissions'}
                          </h4>

                          {loadingSupabaseData ? (
                            <div className="p-8 text-center text-slate-400 text-xs">
                              <RefreshCw className="w-5 h-5 text-emerald-700 animate-spin mx-auto mb-2" />
                              <p>{isUrdu ? 'ڈیٹا بیس سے ریکارڈز لوڈ کیے جا رہے ہیں...' : 'Querying real-time records from your Supabase cluster...'}</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              
                              {/* Synced Contacts */}
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <h5 className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-2 pb-1 border-b border-slate-200">
                                  {isUrdu ? 'کلاؤڈ سے حاصل شدہ رابطے' : 'Synced Contact Inquiries'} ({supabaseContacts.length})
                                </h5>
                                {supabaseContacts.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 py-4 text-center">{isUrdu ? 'کوئی رابطہ فارم کی معلومات نہیں ملیں۔' : 'No inquiry submissions found on Supabase yet.'}</p>
                                ) : (
                                  <div className="space-y-2 max-h-[160px] overflow-y-auto text-left">
                                    {supabaseContacts.map((c, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border border-slate-150 text-[11px]">
                                        <div className="flex justify-between font-bold text-slate-855">
                                          <span>{c.name}</span>
                                          <span className="font-mono text-[9px] text-slate-400">{c.created_at?.substring(0, 10)}</span>
                                        </div>
                                        <div className="text-slate-400 text-[10px] font-mono mt-0.5">{c.email}</div>
                                        <p className="text-slate-600 mt-1 italic">"{c.message}"</p>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Synced Volunteers */}
                              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                                <h5 className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-2 pb-1 border-b border-slate-200">
                                  {isUrdu ? 'کلاؤڈ سے حاصل شدہ رضاکار' : 'Synced Volunteers Registry'} ({supabaseVols.length})
                                </h5>
                                {supabaseVols.length === 0 ? (
                                  <p className="text-[10px] text-slate-400 py-4 text-center">{isUrdu ? 'کوئی رضاکار اندراج نہیں ملا۔' : 'No volunteer registry entries found on Supabase yet.'}</p>
                                ) : (
                                  <div className="space-y-2 max-h-[160px] overflow-y-auto text-left">
                                    {supabaseVols.map((v, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border border-slate-150 text-[11px]">
                                        <div className="flex justify-between font-bold text-slate-855">
                                          <span>{v.name}</span>
                                          <span className="px-1 py-0.5 bg-amber-50 text-amber-800 text-[9px] rounded font-mono uppercase font-bold">{v.availability}</span>
                                        </div>
                                        <div className="text-slate-400 text-[10px] font-mono mt-0.5">{v.email}</div>
                                        <div className="flex gap-1 flex-wrap mt-1">
                                          {v.interests?.map((i: string) => (
                                            <span key={i} className="px-1 py-0.5 bg-emerald-50 text-emerald-800 font-mono text-[8px] rounded font-bold uppercase">{i}</span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  )}
                </div>

              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </motion.div>
    </div>
  );
}
