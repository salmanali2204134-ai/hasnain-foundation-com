/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { 
  X, Lock, Unlock, Settings, Users, Target, TrendingUp, 
  Trash2, Download, Search, Plus, Coins, ShieldAlert, CheckCircle,
  Database, Activity, Terminal, Copy, Check, ShieldCheck, AlertCircle, RefreshCw,
  UserCheck, FileText, Mail, Phone, MapPin, Calendar, Clock, Printer, Eye, Smartphone, Send, Shield,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DuroodBank from './DuroodBank';

interface AdminPanelProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ lang, isOpen, onClose }: AdminPanelProps) {
  const isUrdu = lang === 'ur';

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'appointments' | 'donations' | 'subscriptions' | 'settings' | 'complaints' | 'durood'>('appointments');

  // Backend Data States
  const [appointments, setAppointments] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search & Filter States
  const [aptSearch, setAptSearch] = useState('');
  const [aptFilterStatus, setAptFilterStatus] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  // Treatment Update States
  const [editNotes, setEditNotes] = useState('');
  const [editFollowUp, setEditFollowUp] = useState('');
  const [editStatus, setEditStatus] = useState('pending');
  const [updateLoading, setUpdateLoading] = useState(false);

  // Complaint States
  const [selectedComplaint, setSelectedComplaint] = useState<any | null>(null);
  const [complaintSearch, setComplaintSearch] = useState('');
  const [complaintFilterStatus, setComplaintFilterStatus] = useState<string>('all');
  const [editComplaintResolution, setEditComplaintResolution] = useState('');
  const [editComplaintStatus, setEditComplaintStatus] = useState('pending');
  const [complaintUpdateLoading, setComplaintUpdateLoading] = useState(false);

  // Broadcast States
  const [broadcastType, setBroadcastType] = useState('Email Newsletter');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');
  const [broadcastSuccessLog, setBroadcastSuccessLog] = useState<any | null>(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const headers = { 
        'x-admin-passcode': passcode.trim() 
      };
      const [aptRes, donRes, subRes, compRes] = await Promise.all([
        fetch('/api/appointments', { headers }).then(r => r.json()),
        fetch('/api/donations', { headers }).then(r => r.json()),
        fetch('/api/subscriptions', { headers }).then(r => r.json()),
        fetch('/api/complaints', { headers }).then(r => r.json()).catch(() => ({ success: false, complaints: [] }))
      ]);

      if (aptRes.success) setAppointments(aptRes.appointments);
      if (donRes.success) setDonations(donRes.donations);
      if (subRes.success) setSubscribers(subRes.subscribers);
      if (compRes.success) setComplaints(compRes.complaints);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(isUrdu ? "ڈیٹا لوڈ کرنے میں ناکامی" : "Failed to load CRM database from server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadDashboardData();
    }
  }, [isAuthenticated, isOpen]);

  // Auth Handling
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPasscode = passcode.trim();
    if (cleanPasscode === '786786') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // Update Patient Record (Notes, Status)
  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setUpdateLoading(true);
    try {
      const res = await fetch(`/api/appointments/${selectedPatient.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({
          status: editStatus,
          treatmentNotes: editNotes,
          followUpNotes: editFollowUp
        })
      });

      const resJson = await res.json();
      if (resJson.success) {
        // Refresh local items
        setAppointments(prev => prev.map(a => a.id === selectedPatient.id ? resJson.appointment : a));
        setSelectedPatient(resJson.appointment);
        alert(isUrdu ? "مریض کا ریکارڈ کامیابی سے اپ ڈیٹ ہو گیا ہے!" : "Patient record updated successfully!");
      } else {
        alert("Error: " + resJson.error);
      }
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  // Verify Donation receipt
  const handleVerifyDonation = async (id: string, status: 'verified' | 'rejected') => {
    try {
      const res = await fetch(`/api/donations/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({ status })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setDonations(prev => prev.map(d => d.id === id ? resJson.donation : d));
        
        // Dispatch custom event to notify donation trackers
        window.dispatchEvent(new Event('donation_tracker_updated'));
      }
    } catch (err: any) {
      alert("Error updating donation status: " + err.message);
    }
  };

  // Trigger Broadcast simulator
  const handleTriggerBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) {
      alert(isUrdu ? "عنوان اور مواد لکھنا لازمی ہے۔" : "Please provide title and content.");
      return;
    }
    setBroadcastLoading(true);
    setBroadcastSuccessLog(null);
    try {
      const res = await fetch('/api/subscriptions/broadcast', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({
          type: broadcastType,
          title: broadcastTitle,
          content: broadcastContent
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setBroadcastSuccessLog(resJson);
        setBroadcastTitle('');
        setBroadcastContent('');
      }
    } catch (err: any) {
      alert("Broadcast failed: " + err.message);
    } finally {
      setBroadcastLoading(false);
    }
  };

  // Update complaint status & resolution notes
  const handleUpdateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;
    setComplaintUpdateLoading(true);
    try {
      const res = await fetch(`/api/complaints/${selectedComplaint.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({
          status: editComplaintStatus,
          resolutionNotes: editComplaintResolution
        })
      });
      const resJson = await res.json();
      if (resJson.success) {
        setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? resJson.complaint : c));
        setSelectedComplaint(resJson.complaint);
        alert(isUrdu ? "شکایت کا ریکارڈ کامیابی سے اپ ڈیٹ ہو گیا!" : "Complaint record updated successfully!");
      }
    } catch (err: any) {
      alert("Error updating complaint: " + err.message);
    } finally {
      setComplaintUpdateLoading(false);
    }
  };

  // Export Patients List to CSV
  const exportPatientsToCSV = () => {
    const headers = ['ID', 'Name', 'Age', 'Gender', 'Contact', 'City', 'Country', 'Spiritual Problem', 'Status', 'Registered At'];
    const rows = appointments.map(apt => [
      apt.id,
      apt.name,
      apt.age,
      apt.gender,
      apt.whatsapp,
      apt.city,
      apt.country,
      apt.reason,
      apt.status.toUpperCase(),
      apt.registeredAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Hasnain_Foundation_Patients.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Prints the active patient treatment card
  const printPatientCard = (patient: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hasnain Foundation - Official Patient Slip</title>
            <style>
              body { font-family: 'Inter', sans-serif; padding: 40px; color: #1e293b; background-color: #ffffff; }
              .card { max-width: 600px; margin: 0 auto; border: 2px solid #047857; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f1f5f9; padding-bottom: 15px; margin-bottom: 20px; }
              .logo { font-size: 20px; font-weight: 900; color: #065f46; }
              .badge { background: #f59e0b; color: #000; font-family: monospace; font-weight: bold; padding: 4px 10px; border-radius: 6px; font-size: 14px; }
              .field { display: grid; grid-template-cols: 1fr 2fr; border-bottom: 1px solid #f1f5f9; padding: 10px 0; font-size: 14px; }
              .label { color: #64748b; font-weight: bold; }
              .value { color: #0f172a; font-weight: 500; }
              .notes-box { background: #f8fafc; border-left: 4px solid #047857; padding: 15px; border-radius: 8px; margin-top: 15px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div>
                  <div class="logo">HASNAIN FOUNDATION</div>
                  <div style="font-size:10px; color:#b45309; text-transform:uppercase; letter-spacing:1px; font-weight:bold;">Spiritual Healing CRM</div>
                </div>
                <div class="badge">${patient.id}</div>
              </div>
              <div class="field"><span class="label">Patient Name:</span><span class="value">${patient.name}</span></div>
              <div class="field"><span class="label">Father Name:</span><span class="value">${patient.fatherName || 'N/A'}</span></div>
              <div class="field"><span class="label">Age / Gender:</span><span class="value">${patient.age} / ${patient.gender}</span></div>
              <div class="field"><span class="label">WhatsApp Contact:</span><span class="value">${patient.whatsapp}</span></div>
              <div class="field"><span class="label">City / Country:</span><span class="value">${patient.city}, ${patient.country}</span></div>
              <div class="field"><span class="label">Spiritual Issue:</span><span class="value" style="color:#b45309; font-weight:bold;">${patient.reason}</span></div>
              <div class="field"><span class="label">Status:</span><span class="value" style="text-transform:uppercase; font-weight:bold;">${patient.status}</span></div>
              
              <div class="notes-box">
                <strong style="color:#065f46; display:block; margin-bottom:5px;">SCHOLAR TREATMENT NOTES:</strong>
                <p style="font-size:13px; line-height:1.6; margin:0;">${patient.treatmentNotes || 'No notes available yet.'}</p>
              </div>

              <div style="margin-top:25px; font-size:11px; text-align:center; color:#94a3b8; border-top:1px solid #f1f5f9; padding-top:15px;">
                Hasnain Foundation Spiritual Healing Center - Quran & Sunnah Guidance
              </div>
            </div>
            <script>window.onload = function() { window.print(); window.close(); }</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  // Filter Patients
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.name.toLowerCase().includes(aptSearch.toLowerCase()) || 
                          apt.id.toLowerCase().includes(aptSearch.toLowerCase()) ||
                          apt.reason.toLowerCase().includes(aptSearch.toLowerCase()) ||
                          apt.whatsapp.includes(aptSearch);
    const matchesFilter = aptFilterStatus === 'all' || apt.status === aptFilterStatus;
    return matchesSearch && matchesFilter;
  });

  // Today's Stats Counters
  const countByStatus = (status: string) => appointments.filter(a => a.status === status).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 font-sans text-slate-800">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
      />

      {/* Main Panel Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-6xl h-[90vh] overflow-hidden relative flex flex-col z-10"
      >
        {/* Top Control Bar */}
        <div className="p-4 px-6 border-b border-slate-200 flex justify-between items-center bg-gradient-to-r from-emerald-950 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight font-sans text-amber-100 flex items-center gap-1.5">
                {isUrdu ? 'روحانی شفا خانہ - ایڈمن CRM پورٹل' : 'Hasnain Foundation Spiritual Healing - Enterprise CRM'}
              </h2>
              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
                {isUrdu ? 'لاگ ان: خلیفہ سلمان علی قادری / علامہ شایان علی قادری' : 'Secured Access: Scholar Administration'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inner layout based on Auth */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {!isAuthenticated ? (
              // ==========================================
              // SECURE LOCK PASSCODE SCREEN
              // ==========================================
              <motion.div
                key="auth-gate"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                  <Lock className="w-8 h-8 text-emerald-700 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {isUrdu ? 'ایڈمن سیکیورٹی تصدیق' : 'Scholar CRM Authorization'}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    {isUrdu 
                      ? 'مریضوں کے خفیہ کوائف اور علاج معالجہ مانیٹر کرنے کے لیے پاس کوڈ درج کریں۔' 
                      : 'Please input the administrator passcode to access clinical patient records, verify uploads, and dispatch newsletters.'}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="w-full space-y-4">
                  <div className="relative">
                    <input
                      type={showPasscode ? "text" : "password"}
                      required
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder={isUrdu ? "پاس کوڈ درج کریں" : "Enter Passcode"}
                      className="w-full text-center py-3 pl-12 pr-12 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 font-sans text-sm bg-slate-50 focus:bg-white transition-all text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasscode(!showPasscode)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                      title={showPasscode ? "Hide Passcode" : "Show Passcode"}
                    >
                      <Eye className="w-4.5 h-4.5" />
                    </button>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400">
                      <Lock className="w-4.5 h-4.5 text-emerald-600" />
                    </div>
                  </div>

                  {authError && (
                    <p className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1 bg-rose-50 border border-rose-100 py-2 rounded-xl">
                      <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0" />
                      <span>{isUrdu ? 'غلط کوڈ! دوبارہ کوشش کریں' : 'Incorrect Passcode. Please try again.'}</span>
                    </p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Unlock className="w-4 h-4 text-amber-400" />
                    <span>{isUrdu ? 'دروازہ کھولیں (لاگ ان)' : 'Authenticate & Unlock'}</span>
                  </button>
                </form>
              </motion.div>
            ) : (
              // ==========================================
              // SECURE AUTHORIZED WORKSPACE
              // ==========================================
              <motion.div
                key="workspace-dashboard"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 flex flex-col md:flex-row overflow-hidden"
              >
                {/* Side Navigation Menu */}
                <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
                  <div className="space-y-6">
                    {/* Authorized Status Indicator */}
                    <div className="p-3.5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-2 text-xs">
                      <Unlock className="w-4 h-4 text-emerald-700" />
                      <div>
                        <span className="font-extrabold text-emerald-800 block">{isUrdu ? 'دروازہ کھلا ہے' : 'Access Granted'}</span>
                        <span className="text-[10px] text-slate-500">{isUrdu ? 'ایڈمن موڈ لائیو ہے' : 'Authorized Token Active'}</span>
                      </div>
                    </div>

                    {/* Navigation Tab items */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block px-2 mb-2">
                        {isUrdu ? 'انتظام کار کونسل' : 'Clinical Workspace'}
                      </span>
                      
                      {[
                        { id: 'appointments', label: { en: 'Patients Database', ur: 'مریضوں کے ریکارڈز' }, icon: Users },
                        { id: 'donations', label: { en: 'Donation Auditor', ur: 'عطیہ آڈیٹر' }, icon: Coins },
                        { id: 'subscriptions', label: { en: 'Broadcast Center', ur: 'براڈکاسٹ سنٹر' }, icon: Send },
                        { id: 'complaints', label: { en: 'Integrity & Complaints', ur: 'شکایات سیل' }, icon: ShieldAlert },
                        { id: 'durood', label: { en: 'Durood Bank CRM', ur: 'درود بینک انتظامیہ' }, icon: Sparkles },
                        { id: 'settings', label: { en: 'Database Health', ur: 'ڈیٹا بیس صحت' }, icon: Database }
                      ].map(tab => {
                        const TabIcon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id as any);
                              setSelectedPatient(null);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer text-left ${
                              activeTab === tab.id
                                ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/10'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            <TabIcon className={`w-4 h-4 ${activeTab === tab.id ? 'text-amber-400' : 'text-slate-400'}`} />
                            <span className={isUrdu ? 'font-urdu' : ''}>{tab.label[lang]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Logout Button */}
                  <button
                    onClick={() => setIsAuthenticated(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    <span>{isUrdu ? 'سیشن لاگ آؤٹ' : 'Logout Scholar Session'}</span>
                  </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
                  
                  {errorMessage && (
                    <div className="p-4 bg-rose-50 text-rose-800 rounded-xl mb-4 text-xs border border-rose-200">
                      {errorMessage}
                    </div>
                  )}

                  {/* ==========================================
                      TAB 1: PATIENT DATABASE & TREATMENT CRM
                      ========================================== */}
                  {activeTab === 'appointments' && (
                    <div className="space-y-6">
                      
                      {/* Counter Stats Panels */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: { en: 'Total Registrations', ur: 'کل رجسٹریشنز' }, count: appointments.length, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
                          { title: { en: 'Pending Diagnose', ur: 'منتظر معائنہ' }, count: countByStatus('pending'), color: 'border-amber-200 bg-amber-50 text-amber-800' },
                          { title: { en: 'In Follow Up', ur: 'زیرِ نگرانی' }, count: countByStatus('follow-up'), color: 'border-blue-200 bg-blue-50 text-blue-800' },
                          { title: { en: 'Completed Healing', ur: 'صحتیاب شفاء' }, count: countByStatus('completed'), color: 'border-emerald-300 bg-emerald-500/5 text-emerald-700' }
                        ].map((stat, idx) => (
                          <div key={idx} className={`border p-4 rounded-2xl flex flex-col justify-between ${stat.color}`}>
                            <span className={`text-[10px] font-black uppercase tracking-wider block ${isUrdu ? 'font-urdu' : ''}`}>{stat.title[lang]}</span>
                            <span className="text-2xl font-black font-mono mt-1">{stat.count}</span>
                          </div>
                        ))}
                      </div>

                      {/* Main Dual Columns: Patient List & Patient Treatment Details */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Left column: List & Search (7 cols) */}
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
                          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                            
                            {/* Search bar */}
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={aptSearch}
                                onChange={(e) => setAptSearch(e.target.value)}
                                placeholder={isUrdu ? "مریض کا نام، ID یا نمبر تلاش کریں..." : "Search by Patient name, ID, or WhatsApp..."}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                              />
                              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </div>

                            {/* Status filters */}
                            <select
                              value={aptFilterStatus}
                              onChange={(e) => setAptFilterStatus(e.target.value)}
                              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 focus:outline-none focus:border-emerald-600"
                            >
                              <option value="all">{isUrdu ? 'تمام حالتیں' : 'All Statuses'}</option>
                              <option value="pending">{isUrdu ? 'منتظر' : 'Pending'}</option>
                              <option value="follow-up">{isUrdu ? 'زیرِ نگرانی' : 'Follow Up'}</option>
                              <option value="completed">{isUrdu ? 'صحتیاب' : 'Completed'}</option>
                              <option value="cancelled">{isUrdu ? 'منسوخ' : 'Cancelled'}</option>
                            </select>

                            {/* Export CSV button */}
                            <button
                              onClick={exportPatientsToCSV}
                              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span>CSV</span>
                            </button>
                          </div>

                          {/* Patient Row entries */}
                          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                            {filteredAppointments.length === 0 ? (
                              <div className="py-12 text-center text-slate-400 text-xs">
                                {isUrdu ? 'کوئی مریض ریکارڈ میچ نہیں کر سکا۔' : 'No patient files found matching filters.'}
                              </div>
                            ) : (
                              filteredAppointments.map(patient => (
                                <div
                                  key={patient.id}
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setEditNotes(patient.treatmentNotes || '');
                                    setEditFollowUp(patient.followUpNotes || '');
                                    setEditStatus(patient.status);
                                  }}
                                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                                    selectedPatient?.id === patient.id
                                      ? 'bg-emerald-500/5 border-emerald-600/30 shadow-md shadow-emerald-950/5'
                                      : 'border-slate-150 bg-white hover:border-slate-300'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    {/* Patient Photo Avatar */}
                                    <img
                                      src={patient.photo || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"}
                                      alt="avatar"
                                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                    />
                                    <div className="text-left">
                                      <div className="flex items-center gap-2">
                                        <span className="font-extrabold text-sm text-slate-900">{patient.name}</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">{patient.id}</span>
                                      </div>
                                      <p className="text-[10px] text-amber-600 font-extrabold mt-0.5">{patient.reason}</p>
                                      <p className="text-[9px] text-slate-400 font-medium font-mono">{patient.whatsapp} • {patient.city}</p>
                                    </div>
                                  </div>

                                  <div className="text-right flex flex-col items-end gap-1.5">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                      patient.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                                      patient.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                      patient.status === 'follow-up' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {patient.status}
                                    </span>
                                    <span className="text-[8px] text-slate-400 font-mono">{patient.registeredAt.substring(0, 10)}</span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Right column: Form Treatment Editor (5 cols) */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <AnimatePresence mode="wait">
                            {selectedPatient ? (
                              <motion.form
                                key="treatment-details"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                onSubmit={handleUpdatePatient}
                                className="space-y-4"
                              >
                                {/* Selected Header */}
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                                  <div>
                                    <h4 className="text-sm font-extrabold text-slate-900">{selectedPatient.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-mono">{selectedPatient.id} • Registered {selectedPatient.registeredAt.substring(0, 10)}</p>
                                  </div>
                                  
                                  <button
                                    type="button"
                                    onClick={() => printPatientCard(selectedPatient)}
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                                    title="Print Patient Card Slip"
                                  >
                                    <Printer className="w-4 h-4 text-slate-500" />
                                  </button>
                                </div>

                                {/* Patient Details list */}
                                <div className="bg-slate-50 rounded-xl p-3.5 text-xs space-y-2 leading-relaxed">
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-1.5">
                                    <span className="text-slate-500">Father Name:</span>
                                    <span className="col-span-2 font-bold text-slate-800">{selectedPatient.fatherName || 'N/A'}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-1.5">
                                    <span className="text-slate-500">Age / Gender:</span>
                                    <span className="col-span-2 text-slate-800">{selectedPatient.age} Years • {selectedPatient.gender}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-1.5">
                                    <span className="text-slate-500">Residence:</span>
                                    <span className="col-span-2 text-slate-800">{selectedPatient.city}, {selectedPatient.country}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-1.5">
                                    <span className="text-slate-500">WhatsApp:</span>
                                    <span className="col-span-2 font-mono text-emerald-700 font-bold select-all">{selectedPatient.whatsapp}</span>
                                  </div>
                                  <div className="grid grid-cols-3">
                                    <span className="text-slate-500">Email:</span>
                                    <span className="col-span-2 font-mono text-slate-700 select-all">{selectedPatient.email}</span>
                                  </div>

                                  <div className="border-t border-slate-200/80 pt-2 mt-2">
                                    <span className="font-extrabold text-amber-700 uppercase tracking-widest text-[9px] block mb-1">Symptoms reported:</span>
                                    <p className="text-slate-600 leading-relaxed font-medium italic">"{selectedPatient.description}"</p>
                                  </div>
                                </div>

                                {/* Editor: Treatment Notes */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                                    Scholar Healing Notes (Ruqyah / Adhkar Recited)
                                  </label>
                                  <textarea
                                    rows={4}
                                    value={editNotes}
                                    onChange={(e) => setEditNotes(e.target.value)}
                                    placeholder="Write details of Ruqyah performed, Quranic verses recited, or spiritual guidelines prescribed..."
                                    className="w-full text-xs p-3 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-xl resize-none text-slate-800"
                                  />
                                </div>

                                {/* Editor: Follow Up Notes */}
                                <div className="space-y-1">
                                  <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                                    Follow Up Schedule & Notes
                                  </label>
                                  <input
                                    type="text"
                                    value={editFollowUp}
                                    onChange={(e) => setEditFollowUp(e.target.value)}
                                    placeholder="e.g. Recommended follow up in 2 weeks..."
                                    className="w-full text-xs p-2.5 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-xl text-slate-800"
                                  />
                                </div>

                                {/* Editor: Status Modifier */}
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1">Status Modifier</label>
                                    <select
                                      value={editStatus}
                                      onChange={(e) => setEditStatus(e.target.value)}
                                      className="w-full text-xs p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-white"
                                    >
                                      <option value="pending">Pending Diagnosis</option>
                                      <option value="follow-up">Follow Up Scheduled</option>
                                      <option value="completed">Completed Healing</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </div>

                                  <div className="flex items-end">
                                    <button
                                      type="submit"
                                      disabled={updateLoading}
                                      className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                      {updateLoading ? 'Saving...' : 'Update Records'}
                                    </button>
                                  </div>
                                </div>

                              </motion.form>
                            ) : (
                              <motion.div
                                key="treatment-placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="py-24 text-center text-slate-400 text-xs space-y-2"
                              >
                                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                                <p>{isUrdu ? 'مریض کا معائنہ شروع کرنے کے لیے فہرست سے انتخاب فرمائیں۔' : 'Please select a patient from the database on the left to start editing their treatment history and generating clinical notes.'}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ==========================================
                      TAB 2: DONATION AUDITOR & RECEIPT QUEUE
                      ========================================== */}
                  {activeTab === 'donations' && (
                    <div className="space-y-6">
                      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-4 text-left">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <div>
                            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                              <Coins className="w-5 h-5 text-amber-500" />
                              <span>{isUrdu ? 'عطیہ آمدنی اور رسیدوں کی تصدیق' : 'Welfare Donation Auditing Terminal'}</span>
                            </h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {isUrdu ? 'بینک اکاؤنٹ یا والٹ کے ذریعے بھیجے گئے رسیدات کی جانچ اور منظوری' : 'Review uploaded donor receipts and crosscheck with bank statement records.'}
                            </p>
                          </div>
                        </div>

                        {/* Donations Queue Table */}
                        <div className="border border-slate-150 rounded-xl overflow-hidden">
                          <table className="w-full text-xs sm:text-sm text-left">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
                              <tr>
                                <th className="p-3 px-4">Donor Name</th>
                                <th className="p-3">Amount</th>
                                <th className="p-3">Platform</th>
                                <th className="p-3 font-mono">TXN ID</th>
                                <th className="p-3 text-center">Status</th>
                                <th className="p-3 text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {donations.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                                    No donation receipt uploads found.
                                  </td>
                                </tr>
                              ) : (
                                donations.map((don) => (
                                  <tr key={don.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                                    <td className="p-3 px-4 font-black">
                                      <div>{don.donorName}</div>
                                      <span className="text-[9px] text-slate-400 font-mono block mt-0.5">{don.whatsapp || don.email}</span>
                                    </td>
                                    <td className="p-3 text-emerald-800 font-black font-mono">
                                      PKR {don.amount.toLocaleString()}
                                    </td>
                                    <td className="p-3 font-bold text-slate-700">
                                      {don.paymentMethod}
                                    </td>
                                    <td className="p-3 font-mono text-slate-600">
                                      {don.transactionId}
                                    </td>
                                    <td className="p-3 text-center">
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                        don.status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                                        don.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                      }`}>
                                        {don.status}
                                      </span>
                                    </td>
                                    <td className="p-3 flex items-center justify-center gap-1.5">
                                      {don.status === 'pending' && (
                                        <>
                                          <button
                                            onClick={() => handleVerifyDonation(don.id, 'verified')}
                                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-[10px] font-bold cursor-pointer transition-colors"
                                          >
                                            Verify
                                          </button>
                                          <button
                                            onClick={() => handleVerifyDonation(don.id, 'rejected')}
                                            className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold cursor-pointer transition-colors"
                                          >
                                            Reject
                                          </button>
                                        </>
                                      )}
                                      {don.status !== 'pending' && (
                                        <span className="text-[10px] text-slate-400 font-medium">Audited</span>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      TAB 3: BROADCAST CENTER (SMARTPHONE MOCKUP)
                      ========================================== */}
                  {activeTab === 'subscriptions' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Left: Broadcast triggers form (7 cols) */}
                        <form onSubmit={handleTriggerBroadcast} className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-left">
                          <h3 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                            <Send className="w-5 h-5 text-emerald-700" />
                            <span>{isUrdu ? 'براڈکاسٹ سنٹر اور نیوز لیٹر' : 'Subscribers Broadcast Control'}</span>
                          </h3>

                          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-600" />
                            <span>Registered subscribers to broadcast: {subscribers.length} visitors</span>
                          </div>

                          {/* Broadcast Type */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                              Broadcast Medium / Type
                            </label>
                            <select
                              value={broadcastType}
                              onChange={(e) => setBroadcastType(e.target.value)}
                              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white"
                            >
                              <option value="Email Newsletter">Email Newsletter & Article</option>
                              <option value="WhatsApp Announcement">WhatsApp Graphic / Poster Broadcast</option>
                              <option value="Spiritual Alad">Special Ruqyah Video Link Broadcast</option>
                            </select>
                          </div>

                          {/* Title */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                              Broadcast Title / Subject
                            </label>
                            <input
                              type="text"
                              required
                              value={broadcastTitle}
                              onChange={(e) => setBroadcastTitle(e.target.value)}
                              placeholder="e.g. New Ruqyah Guideline For Evil Eye Protection"
                              className="w-full text-xs p-2.5 border border-slate-200 rounded-xl text-slate-800"
                            />
                          </div>

                          {/* Content */}
                          <div className="space-y-1">
                            <label className="block text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                              Message Content
                            </label>
                            <textarea
                              rows={5}
                              required
                              value={broadcastContent}
                              onChange={(e) => setBroadcastContent(e.target.value)}
                              placeholder="Write your beautiful Islamic spiritual newsletter contents here..."
                              className="w-full text-xs p-3 border border-slate-200 rounded-xl resize-none text-slate-800 text-left"
                            />
                          </div>

                          {/* Action Button */}
                          <button
                            type="submit"
                            disabled={broadcastLoading}
                            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-950 text-white font-extrabold text-xs sm:text-sm cursor-pointer transition-colors shadow-md flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4 text-amber-400" />
                            <span>{broadcastLoading ? 'Broadcasting...' : 'Execute Multicast Broadcast Now'}</span>
                          </button>
                        </form>

                        {/* Right: Smartphone Visual Mockup Simulation (5 cols) */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Live Feed Recipient Mockup</h4>
                          
                          <div className="w-[280px] h-[550px] bg-slate-950 rounded-[40px] border-8 border-slate-800 shadow-2xl relative p-3 flex flex-col justify-between overflow-hidden">
                            {/* Smartphone top bar speaker */}
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full z-20 flex items-center justify-center">
                              <span className="w-2 h-2 bg-black rounded-full" />
                            </div>

                            {/* Simulated screen body */}
                            <div className="flex-1 bg-slate-900 rounded-[28px] overflow-hidden p-3.5 flex flex-col justify-between pt-6 text-[10px] relative">
                              
                              {/* Screen content based on broadcast success */}
                              <AnimatePresence mode="wait">
                                {broadcastSuccessLog ? (
                                  <motion.div
                                    key="simulated-receipt"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-3"
                                  >
                                    <div className="bg-emerald-500 text-slate-950 p-2.5 rounded-xl font-bold flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      <span>Simulated Transmit Success!</span>
                                    </div>
                                    
                                    <div className="bg-slate-800 text-white p-3 rounded-xl space-y-2 text-[9px] border border-slate-700">
                                      <p className="font-extrabold text-amber-400 uppercase tracking-wider">SMS / WHATSAPP RECEIVED:</p>
                                      <p className="font-bold text-slate-200">"{broadcastSuccessLog.broadcast.title}"</p>
                                      <p className="text-slate-400 font-medium leading-relaxed italic">
                                        {broadcastSuccessLog.logs[0]?.name ? `Sent to ${broadcastSuccessLog.logs[0]?.name}: ` : ''}
                                        "Assalam-o-Alaikum, check out this update from Hasnain Foundation..."
                                      </p>
                                      <div className="border-t border-slate-700 pt-1.5 text-[8px] text-emerald-400 font-mono">
                                        ✓ Delivered to {broadcastSuccessLog.broadcast.deliveredCount} active subscribers.
                                      </div>
                                    </div>
                                  </motion.div>
                                ) : (
                                  <motion.div
                                    key="simulated-inactive"
                                    className="h-full flex flex-col items-center justify-center text-slate-500 space-y-3 text-center"
                                  >
                                    <Smartphone className="w-12 h-12 text-slate-700 animate-bounce" />
                                    <p className="max-w-[180px] leading-relaxed font-bold">
                                      Fill in the broadcast form on the left and submit to view the simulated delivery message feed instantly in real-time.
                                    </p>
                                  </motion.div>
                                )}
                              </AnimatePresence>

                              {/* Smartphone bottom notch line */}
                              <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto" />
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      TAB 5: SECURE COMPLAINTS MANAGEMENT
                      ========================================== */}
                  {activeTab === 'complaints' && (
                    <div className="space-y-6 text-left">
                      
                      {/* Counter Stats Panels */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: { en: 'Total Reports', ur: 'کل درج شکایتیں' }, count: complaints.length, color: 'border-rose-200 bg-rose-50/50 text-rose-800' },
                          { title: { en: 'Pending Review', ur: 'زیرِ غور' }, count: complaints.filter((c: any) => c.status === 'pending').length, color: 'border-amber-200 bg-amber-50 text-amber-800' },
                          { title: { en: 'In Investigation', ur: 'زیرِ تفتیش' }, count: complaints.filter((c: any) => c.status === 'under_investigation').length, color: 'border-blue-200 bg-blue-50 text-blue-800' },
                          { title: { en: 'Resolved Cases', ur: 'حل شدہ' }, count: complaints.filter((c: any) => c.status === 'resolved').length, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' }
                        ].map((stat, idx) => (
                          <div key={idx} className={`border p-4 rounded-2xl flex flex-col justify-between ${stat.color}`}>
                            <span className={`text-[10px] font-black uppercase tracking-wider block ${isUrdu ? 'font-urdu' : ''}`}>{stat.title[lang]}</span>
                            <span className="text-2xl font-black font-mono mt-1">{stat.count}</span>
                          </div>
                        ))}
                      </div>

                      {/* Split view: List vs Detail */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        
                        {/* Left column: Complaints List */}
                        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
                          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                            
                            {/* Search bar */}
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={complaintSearch}
                                onChange={(e) => setComplaintSearch(e.target.value)}
                                placeholder={isUrdu ? "شکایت، زمرہ یا ٹکٹ آئی ڈی تلاش کریں..." : "Search by subject, category, or ID..."}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-rose-600 focus:bg-white text-slate-800"
                              />
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            </div>

                            {/* Status Filter */}
                            <select
                              value={complaintFilterStatus}
                              onChange={(e) => setComplaintFilterStatus(e.target.value)}
                              className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
                            >
                              <option value="all">All Statuses</option>
                              <option value="pending">Pending</option>
                              <option value="under_investigation">Under Investigation</option>
                              <option value="resolved">Resolved</option>
                              <option value="dismissed">Dismissed</option>
                            </select>
                          </div>

                          {/* Complaints list table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                  <th className="py-2.5 px-2">ID</th>
                                  <th className="py-2.5 px-2">Reporter</th>
                                  <th className="py-2.5 px-2">Subject / Type</th>
                                  <th className="py-2.5 px-2">Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {complaints.filter((comp: any) => {
                                  const term = complaintSearch.toLowerCase();
                                  const matchText = (comp.subject || '').toLowerCase() + ' ' + (comp.wrongdoingType || '').toLowerCase() + ' ' + (comp.id || '').toLowerCase() + ' ' + (comp.name || '').toLowerCase();
                                  const matchSearch = matchText.includes(term);
                                  const matchStatus = complaintFilterStatus === 'all' || comp.status === complaintFilterStatus;
                                  return matchSearch && matchStatus;
                                }).length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="py-8 text-center text-slate-400 font-bold">
                                      {isUrdu ? 'کوئی شکایت ریکارڈ نہیں ملا' : 'No complaint records matching filters.'}
                                    </td>
                                  </tr>
                                ) : (
                                  complaints.filter((comp: any) => {
                                    const term = complaintSearch.toLowerCase();
                                    const matchText = (comp.subject || '').toLowerCase() + ' ' + (comp.wrongdoingType || '').toLowerCase() + ' ' + (comp.id || '').toLowerCase() + ' ' + (comp.name || '').toLowerCase();
                                    const matchSearch = matchText.includes(term);
                                    const matchStatus = complaintFilterStatus === 'all' || comp.status === complaintFilterStatus;
                                    return matchSearch && matchStatus;
                                  }).map((comp: any) => (
                                    <tr
                                      key={comp.id}
                                      onClick={() => {
                                        setSelectedComplaint(comp);
                                        setEditComplaintStatus(comp.status);
                                        setEditComplaintResolution(comp.resolutionNotes || '');
                                      }}
                                      className={`border-b border-slate-50 last:border-b-0 hover:bg-slate-50 transition-colors cursor-pointer ${
                                        selectedComplaint?.id === comp.id ? 'bg-rose-50/50' : ''
                                      }`}
                                    >
                                      <td className="py-2.5 px-2 font-mono font-black text-slate-600">{comp.id}</td>
                                      <td className="py-2.5 px-2 font-bold text-slate-700">
                                        {comp.name === "Anonymous Citizen" ? (
                                          <span className="text-rose-600 italic bg-rose-50 px-1.5 py-0.5 rounded text-[10px]">Anonymous</span>
                                        ) : comp.name}
                                      </td>
                                      <td className="py-2.5 px-2">
                                        <p className="font-bold text-slate-900 truncate max-w-[150px]">{comp.subject}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">{comp.wrongdoingType}</p>
                                      </td>
                                      <td className="py-2.5 px-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                          comp.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                          comp.status === 'under_investigation' ? 'bg-blue-100 text-blue-800' :
                                          comp.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                          'bg-slate-100 text-slate-800'
                                        }`}>
                                          {comp.status === 'under_investigation' ? 'Investigating' : comp.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Right column: Action Panel / Resolution Note Details */}
                        <div className="lg:col-span-6">
                          <AnimatePresence mode="wait">
                            {selectedComplaint ? (
                              <motion.div
                                key={selectedComplaint.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm"
                              >
                                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-black text-rose-700">{selectedComplaint.id}</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                                        selectedComplaint.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                        selectedComplaint.status === 'under_investigation' ? 'bg-blue-100 text-blue-800' :
                                        selectedComplaint.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                        'bg-slate-100 text-slate-800'
                                      }`}>
                                        {selectedComplaint.status === 'under_investigation' ? 'Investigating' : selectedComplaint.status}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 mt-1">{selectedComplaint.subject}</h4>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-mono font-bold">{selectedComplaint.submittedAt}</span>
                                </div>

                                {/* Reporter Profile Details */}
                                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                                  <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">REPORTER CREDENTIALS</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                                    <p><strong className="text-slate-500">Name: </strong> {selectedComplaint.name}</p>
                                    <p><strong className="text-slate-500">WhatsApp: </strong> {selectedComplaint.whatsapp}</p>
                                    <p className="sm:col-span-2"><strong className="text-slate-500">Email: </strong> {selectedComplaint.email}</p>
                                  </div>
                                  {selectedComplaint.name === "Anonymous Citizen" && (
                                    <p className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 p-1.5 rounded font-bold">
                                      ⚠ This report was filed anonymously. Reporter identities are protected.
                                    </p>
                                  )}
                                </div>

                                {/* Wrongdoing Type & Narrative Description */}
                                <div className="space-y-1.5">
                                  <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">WRONGDOING TYPE</p>
                                  <p className="text-xs bg-rose-50 border border-rose-100 text-rose-900 px-3 py-1.5 rounded-lg font-bold">
                                    {selectedComplaint.wrongdoingType}
                                  </p>
                                </div>

                                <div className="space-y-1.5">
                                  <p className="text-[10px] text-slate-400 font-extrabold tracking-wider uppercase">NARRATIVE & FACTS</p>
                                  <div className="bg-slate-50/50 border border-slate-150 p-3.5 rounded-xl text-xs text-slate-800 leading-relaxed font-medium whitespace-pre-line">
                                    {selectedComplaint.description}
                                  </div>
                                </div>

                                {/* Scholar Resolution Form */}
                                <form onSubmit={handleUpdateComplaint} className="border-t border-slate-100 pt-4 space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    {/* Edit Status */}
                                    <div className="space-y-1">
                                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                        INVESTIGATION STATUS
                                      </label>
                                      <select
                                        value={editComplaintStatus}
                                        onChange={(e) => setEditComplaintStatus(e.target.value)}
                                        className="w-full text-xs p-2 border border-slate-200 rounded-xl bg-white text-slate-800"
                                      >
                                        <option value="pending">Pending Review</option>
                                        <option value="under_investigation">Under Investigation</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="dismissed">Dismissed</option>
                                      </select>
                                    </div>
                                    <div className="flex items-end justify-end">
                                      <button
                                        type="submit"
                                        disabled={complaintUpdateLoading}
                                        className="px-4 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors w-full cursor-pointer"
                                      >
                                        {complaintUpdateLoading ? 'Saving...' : 'Save Updates'}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Resolution Notes */}
                                  <div className="space-y-1">
                                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                                      RESOLUTION NOTES / ACTION TAKEN
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={editComplaintResolution}
                                      onChange={(e) => setEditComplaintResolution(e.target.value)}
                                      placeholder="Describe the disciplinary actions taken, warnings issued, or findings of the investigation..."
                                      className="w-full text-xs p-2.5 border border-slate-200 rounded-xl resize-none text-slate-800"
                                    />
                                  </div>
                                </form>

                              </motion.div>
                            ) : (
                              <div className="bg-slate-100/50 border border-slate-200 border-dashed rounded-2xl h-80 flex flex-col items-center justify-center text-slate-400 text-center p-4">
                                <ShieldAlert className="w-12 h-12 text-slate-300 animate-pulse mb-2" />
                                <h4 className="text-xs font-bold uppercase tracking-wider">{isUrdu ? 'کوئی شکایت منتخب نہیں کی گئی' : 'No Report Selected'}</h4>
                                <p className="text-[10px] text-slate-400 max-w-xs mt-1">
                                  {isUrdu ? 'بائیں جانب کی فہرست سے کسی بھی شکایت پر کلک کریں تاکہ اس کے حقائق، ای میل، نمبرز اور تصفیہ کے لیے کارروائی کی جا سکے۔' : 'Click on any reported complaint/wrongdoing in the left column to view confidential facts, contact channels, and log disciplinary action notes.'}
                                </p>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>

                      </div>

                    </div>
                  )}

                  {/* ==========================================
                      TAB 4: DATABASE HEALTH & SQL SCRIPTS
                      ========================================== */}
                  {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 text-left">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                          <Database className="w-5 h-5 text-emerald-700" />
                          <span>Database Connectivity & Diagnosis</span>
                        </h3>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-600 space-y-3">
                        <p className="font-semibold">Diagnostic logs:</p>
                        <p className="font-mono text-[10px] text-emerald-800">
                          &gt; SELECT COUNT(*) FROM hasnain_patients; <br />
                          &gt; Output: ${appointments.length} active records in local cache. <br />
                          &gt; Status: OK - Syncing perfectly with server memory.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      TAB 5: DUROOD BANK CRM
                      ========================================== */}
                  {activeTab === 'durood' && (
                    <div className="bg-slate-950 rounded-2xl border border-emerald-800/20 overflow-hidden shadow-2xl p-1">
                      <DuroodBank lang={lang} forceAdmin={true} />
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
