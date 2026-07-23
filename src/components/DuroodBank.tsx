/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Language } from '../types';
import { DICTIONARY } from '../data';
import { 
  fetchDuroodSubmissions, 
  submitDuroodToSupabase, 
  deleteDuroodSubmission, 
  bulkDeleteDuroodSubmissions, 
  updateDuroodSubmission,
  DuroodSubmission,
  supabase
} from '../lib/supabase';
import { 
  Award, BookOpen, Calendar, Check, CheckCircle, ChevronRight, Clock, 
  Copy, Download, Edit3, FileText, Globe, Heart, Lock, Mail, MapPin, 
  Phone, Plus, Printer, RefreshCw, Search, Send, Share2, Shield, 
  Sparkles, Trash2, Trophy, User, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DuroodHadithsModal from './DuroodHadithsModal';

// Durood types with English and Urdu labels
const DUROOD_OPTIONS = [
  { id: 'ibrahimi', en: 'Durood-e-Ibrahimi', ur: 'درود ابراہیمی' },
  { id: 'nariyah', en: 'Durood-e-Nariyah', ur: 'درود ناریہ' },
  { id: 'taj', en: 'Durood-e-Taj', ur: 'درود تاج' },
  { id: 'tanjina', en: 'Durood-e-Tanjina', ur: 'درود تنجینا' },
  { id: 'shifa', en: 'Durood-e-Shifa', ur: 'درود شفا' },
  { id: 'karam', en: 'Durood-e-Karam', ur: 'درود کرم' },
  { id: 'muhabbat', en: 'Durood-e-Muhabbat', ur: 'درود محبت' },
  { id: 'lakhi', en: 'Durood-e-Lakhi', ur: 'درود لکھی' },
  { id: 'ghausiyah', en: 'Durood-e-Ghausiyah', ur: 'درود غوثیہ' },
  { id: 'akbari', en: 'Durood-e-Akbari', ur: 'درود اکبری' },
  { id: 'other', en: 'Other', ur: 'دیگر' }
];

// Intention options
const INTENTION_OPTIONS = [
  { id: 'ummah', en: 'Muslim Ummah', ur: 'امت مسلمہ' },
  { id: 'parents', en: 'Parents', ur: 'والدین' },
  { id: 'deceased', en: 'Deceased', ur: 'مرحومین' },
  { id: 'healing', en: 'Healing of Sick', ur: 'بیماروں کی شفا' },
  { id: 'rizq', en: 'Sustenance (Rizq)', ur: 'رزق' },
  { id: 'children', en: 'Children', ur: 'اولاد' },
  { id: 'foundation', en: 'Hasnain Foundation', ur: 'حسنین فاؤنڈیشن' },
  { id: 'mosque', en: 'Mosque', ur: 'مسجد' },
  { id: 'other', en: 'Other', ur: 'دیگر' }
];

// Campaigns milestone targets
const CAMPAIGN_TARGETS = [
  { id: '100k', count: 100000, en: '100,000 Milestone', ur: '1 لاکھ ہدف' },
  { id: '500k', count: 500000, en: '500,000 Milestone', ur: '5 لاکھ ہدف' },
  { id: '1m', count: 1000000, en: '1 Million Campaign', ur: '10 لاکھ ہدف' },
  { id: '5m', count: 5000000, en: '5 Million Campaign', ur: '50 لاکھ ہدف' },
  { id: '10m', count: 10000000, en: '10 Million Mega-Goal', ur: '1 کروڑ ہدف' },
  { id: '100m', count: 100000000, en: '100 Million Ultimate Goal', ur: '10 کروڑ ہدف' }
];

// Certificate Milestones
const CERTIFICATE_MILESTONES = [100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];

// Historical campaign batch record to ensure 1.7 Million baseline collection is never lost
const HISTORICAL_BATCH_RECORD: DuroodSubmission = { 
  id: 's0_historical_17m', 
  full_name: 'Hasnain Foundation Historical Collection (1.7M Initial Campaign Batch)', 
  mobile: '03180202424', 
  whatsapp: '03180202424', 
  email: 'info@hasnain.org', 
  city: 'Karachi', 
  country: 'Pakistan', 
  durood_type: 'درود ابراہیمی', 
  quantity: 1700000, 
  intention: 'امت مسلمہ و حسنین فاؤنڈیشن', 
  date: '01/01/2026',
  time: '12:00:00 AM',
  created_at: '2026-01-01T00:00:00.000Z' 
};

// Local backup seed data just in case Supabase is empty
const SEED_DATA: DuroodSubmission[] = [
  HISTORICAL_BATCH_RECORD,
  { id: 's1', full_name: 'Muhammad Salman Ali Qadri', mobile: '03152204134', whatsapp: '03152204134', email: 'salman@hasnain.org', city: 'Karachi', country: 'Pakistan', durood_type: 'درود ابراہیمی', quantity: 125000, intention: 'حسنین فاؤنڈیشن', created_at: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString() },
  { id: 's2', full_name: 'Allama Shayan Ali Qadri', mobile: '03133830370', whatsapp: '03133830370', email: 'shayan@hasnain.org', city: 'Karachi', country: 'Pakistan', durood_type: 'درود تاج', quantity: 75000, intention: 'امت مسلمہ', created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
  { id: 's3', full_name: 'Zahid Hussain', mobile: '03332145678', whatsapp: '03332145678', email: 'zahid@gmail.com', city: 'Lahore', country: 'Pakistan', durood_type: 'درود ناریہ', quantity: 5000, intention: 'بیماروں کی شفا', created_at: new Date().toISOString() },
  { id: 's4', full_name: 'Dr. Tariq Jameel', mobile: '03001234567', whatsapp: '03001234567', email: 'tariq@yahoo.com', city: 'Islamabad', country: 'Pakistan', durood_type: 'درود تنجینا', quantity: 15000, intention: 'والدین', created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString() },
  { id: 's5', full_name: 'Anonymous Contributor', mobile: '03219876543', whatsapp: '', email: '', city: 'Karachi', country: 'Pakistan', durood_type: 'درود ابراہیمی', quantity: 1000, intention: 'مرحومین', created_at: new Date().toISOString() }
];

export default function DuroodBank({ lang, forceAdmin = false }: { lang: Language; forceAdmin?: boolean }) {
  const isUrdu = lang === 'ur';

  // State Management
  const [submissions, setSubmissions] = useState<DuroodSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local' | 'syncing'>('syncing');
  const [activeTab, setActiveTab] = useState<'submit' | 'counters' | 'campaigns' | 'leaderboard' | 'certificates' | 'virtues' | 'profile' | 'admin'>('submit');
  const [isHadithModalOpen, setIsHadithModalOpen] = useState(false);

  // Quick prefill submit handler from Hadith / Durood modal
  const handleQuickSubmitDuroodFromModal = (duroodType: string, count: number) => {
    setFormData(prev => ({
      ...prev,
      duroodType: duroodType || 'درود ابراہیمی',
      quantity: count
    }));
    setActiveTab('submit');
    alert(isUrdu 
      ? `سبحان اللہ! آپ نے ${count.toLocaleString()} مرتبہ (${duroodType}) کا انتخاب کیا ہے۔ براہ کرم ذیل میں اپنا نام و موبائل نمبر درج کر کے درود جمع فرمائیں۔` 
      : `SubhanAllah! Selected ${count.toLocaleString()} recitations of (${duroodType}). Please enter your name & phone number to submit.`);
  };

  useEffect(() => {
    if (forceAdmin) {
      setIsAdminAuthenticated(true);
      setActiveTab('admin');
    }
  }, [forceAdmin]);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: 'Karachi',
    country: 'Pakistan',
    duroodType: 'درود ابراہیمی',
    quantity: '',
    intention: 'امت مسلمہ',
    confirmed: false,
    isAnonymous: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [submittedQuantity, setSubmittedQuantity] = useState(0);

  // Admin Panel states
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDurood, setFilterDurood] = useState('all');
  const [editingEntry, setEditingEntry] = useState<DuroodSubmission | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [selectedEntries, setSelectedEntries] = useState<any[]>([]);

  // Profile lookup states
  const [profilePhone, setProfilePhone] = useState('');
  const [profileResult, setProfileResult] = useState<{
    userSubmissions: DuroodSubmission[];
    total: number;
    favorite: string;
    badges: string[];
    name: string;
  } | null>(null);

  // Custom campaign targets
  const [activeCampaignId, setActiveCampaignId] = useState('1m');

  // Certificate render target
  const [selectedCertificate, setSelectedCertificate] = useState<{
    userName: string;
    totalCount: number;
    milestone: number;
    certNo: string;
    date: string;
  } | null>(null);

  const sortSubmissionsNewestFirst = (list: DuroodSubmission[]) => {
    return [...list].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA;
    });
  };

  // Load submissions
  const loadSubmissions = async () => {
    setLoading(true);
    setSyncStatus('syncing');
    try {
      const data = await fetchDuroodSubmissions();
      
      // Save local storage if offline or failed
      const localStored = localStorage.getItem('local_durood_submissions');
      let parsedLocal: DuroodSubmission[] = [];
      if (localStored) {
        try { parsedLocal = JSON.parse(localStored); } catch(e){}
      }

      if (data && data.length > 0) {
        // Guarantee historical batch of 1.7M Durood is preserved alongside live entries
        const hasHistoricalRecord = data.some(item => Number(item.quantity) >= 1700000 || item.id === 's0_historical_17m');
        const finalData = hasHistoricalRecord ? data : [HISTORICAL_BATCH_RECORD, ...data];
        setSubmissions(sortSubmissionsNewestFirst(finalData));
        setSyncStatus('synced');
        
        // Synchronize local storage to match Supabase
        localStorage.setItem('local_durood_submissions', JSON.stringify(finalData));
      } else {
        // Fallback to local storage or seed data if empty
        if (parsedLocal.length > 0) {
          const hasHistorical = parsedLocal.some(item => Number(item.quantity) >= 1700000 || item.id === 's0_historical_17m');
          const finalLocal = hasHistorical ? parsedLocal : [HISTORICAL_BATCH_RECORD, ...parsedLocal];
          setSubmissions(sortSubmissionsNewestFirst(finalLocal));
        } else {
          setSubmissions(sortSubmissionsNewestFirst(SEED_DATA));
          localStorage.setItem('local_durood_submissions', JSON.stringify(SEED_DATA));
        }
        setSyncStatus('local');
      }
    } catch (error) {
      console.error("Error loading Durood submissions:", error);
      const localStored = localStorage.getItem('local_durood_submissions');
      if (localStored) {
        try { setSubmissions(sortSubmissionsNewestFirst(JSON.parse(localStored))); } catch(e){}
      } else {
        setSubmissions(sortSubmissionsNewestFirst(SEED_DATA));
      }
      setSyncStatus('local');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();

    // Enable real-time updates so new submissions appear automatically
    const channel = supabase
      .channel('durood_bank_realtime_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'durood_bank'
        },
        (payload) => {
          console.log('Real-time notification on table durood_bank:', payload);
          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new as DuroodSubmission;
            setSubmissions(prev => {
              if (prev.some(sub => sub.id === newRecord.id)) return prev;
              return sortSubmissionsNewestFirst([newRecord, ...prev]);
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedRecord = payload.new as DuroodSubmission;
            setSubmissions(prev => 
              sortSubmissionsNewestFirst(prev.map(sub => sub.id === updatedRecord.id ? updatedRecord : sub))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedRecord = payload.old as { id: any };
            setSubmissions(prev => prev.filter(sub => sub.id !== deletedRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Sync state to local storage whenever submissions state is modified
  useEffect(() => {
    if (submissions.length > 0) {
      localStorage.setItem('local_durood_submissions', JSON.stringify(submissions));
    }
  }, [submissions]);

  // Compute stats
  const stats = useMemo(() => {
    let overall = 0;
    let today = 0;
    let weekly = 0;
    let monthly = 0;

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 24 * 3600 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const typeCounters: Record<string, number> = {};
    DUROOD_OPTIONS.forEach(opt => {
      typeCounters[opt.ur] = 0;
    });

    submissions.forEach(sub => {
      const qty = Number(sub.quantity) || 0;
      overall += qty;

      // Type counter
      const typeKey = sub.durood_type || 'درود ابراہیمی';
      typeCounters[typeKey] = (typeCounters[typeKey] || 0) + qty;

      // Time calculations
      if (sub.created_at) {
        const d = new Date(sub.created_at);
        if (d >= startOfToday) today += qty;
        if (d >= startOfWeek) weekly += qty;
        if (d >= startOfMonth) monthly += qty;
      }
    });

    return {
      overall,
      today,
      weekly,
      monthly,
      typeCounters
    };
  }, [submissions]);

  // Form Submission Handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.mobile || !formData.quantity || !formData.confirmed) {
      return;
    }

    setIsSubmitting(true);
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB'); 
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const submissionData: DuroodSubmission = {
      full_name: formData.isAnonymous ? (isUrdu ? 'مخفی پڑھنے والا' : 'Anonymous Reciter') : formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      whatsapp: formData.whatsapp.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      durood_type: formData.duroodType,
      quantity: Number(formData.quantity),
      intention: formData.intention,
      date: dateStr,
      time: timeStr,
      created_at: now.toISOString()
    };

    try {
      const res = await submitDuroodToSupabase(submissionData);
      
      let insertedItem = submissionData;
      if (res.success && res.result && res.result[0]) {
        insertedItem = res.result[0];
        setSyncStatus('synced');
      } else {
        insertedItem = {
          ...submissionData,
          id: `local-${Date.now()}`
        };
        setSyncStatus('local');
      }

      setSubmissions(prev => {
        if (prev.some(sub => sub.id === insertedItem.id)) return prev;
        return sortSubmissionsNewestFirst([insertedItem, ...prev]);
      });

      setSubmittedName(formData.fullName);
      setSubmittedQuantity(Number(formData.quantity));
      setSubmitSuccess(true);
      
      // Reset form but preserve profile fields for convenient re-submitting
      setFormData(prev => ({
        ...prev,
        quantity: '',
        confirmed: false
      }));

      // Trigger automatic achievement check if profile matches
      handleSearchProfile(formData.mobile);
    } catch (err) {
      console.error(err);
      // fallback
      const insertedItem = {
        ...submissionData,
        id: `local-${Date.now()}`
      };
      setSubmissions(prev => {
        if (prev.some(sub => sub.id === insertedItem.id)) return prev;
        return sortSubmissionsNewestFirst([insertedItem, ...prev]);
      });
      setSyncStatus('local');

      setSubmittedName(formData.fullName);
      setSubmittedQuantity(Number(formData.quantity));
      setSubmitSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Search User Profile
  const handleSearchProfile = (phoneVal?: string) => {
    const mobileToSearch = phoneVal || profilePhone;
    if (!mobileToSearch) return;

    const userSubmissions = submissions.filter(s => s.mobile === mobileToSearch);
    if (userSubmissions.length === 0) {
      setProfileResult(null);
      return;
    }

    const total = userSubmissions.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);
    
    // Favorite Durood computation
    const counts: Record<string, number> = {};
    userSubmissions.forEach(s => {
      counts[s.durood_type] = (counts[s.durood_type] || 0) + (Number(s.quantity) || 0);
    });
    let favorite = isUrdu ? 'درود ابراہیمی' : 'Durood-e-Ibrahimi';
    let max = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > max) {
        max = v;
        favorite = k;
      }
    });

    // Award Badges based on totals
    const badges: string[] = [];
    if (total >= 100) badges.push(isUrdu ? 'مبتدی (100+ مرتبہ)' : 'Mubtadi (100+ Recitations)');
    if (total >= 1000) badges.push(isUrdu ? 'خادمِ درود (1,000+ مرتبہ)' : 'Khadim-e-Durood (1k+ Recitations)');
    if (total >= 10000) badges.push(isUrdu ? 'روحانی ساتھی (10,000+ مرتبہ)' : 'Spiritual Partner (10k+ Recitations)');
    if (total >= 100000) badges.push(isUrdu ? 'مبلغِ درود (100,000+ مرتبہ)' : 'Muballigh-e-Durood (100k+ Recitations)');
    if (total >= 1000000) badges.push(isUrdu ? 'عاشقِ رسولؐ (1M+ مرتبہ)' : 'Ashiq-e-Rasool (1M+ Recitations)');

    setProfileResult({
      userSubmissions,
      total,
      favorite,
      badges,
      name: userSubmissions[0].full_name
    });
  };

  // Trigger profile search on load if form has preset
  useEffect(() => {
    if (formData.mobile) {
      handleSearchProfile(formData.mobile);
    }
  }, [submissions]);

  // Handle Admin Passcode Authenticate
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPasscode.trim() === '786786') {
      setIsAdminAuthenticated(true);
      setAdminError(false);
    } else {
      setAdminError(true);
    }
  };

  // Admin search & filtered entries
  const filteredEntries = useMemo(() => {
    return submissions.filter(item => {
      const matchSearch = 
        item.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.mobile?.includes(searchTerm) ||
        item.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDurood = filterDurood === 'all' || item.durood_type === filterDurood;

      return matchSearch && matchDurood;
    });
  }, [submissions, searchTerm, filterDurood]);

  // Delete Action (Admin)
  const handleDeleteEntry = async (id: any) => {
    if (!window.confirm(isUrdu ? 'کیا آپ اس اندراج کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this submission?')) return;
    try {
      const res = await deleteDuroodSubmission(id);
      if (res.success) {
        const newList = submissions.filter(s => s.id !== id);
        setSubmissions(newList);
        localStorage.setItem('local_durood_submissions', JSON.stringify(newList));
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Bulk Delete (Admin)
  const handleBulkDelete = async () => {
    if (selectedEntries.length === 0) return;
    if (!window.confirm(isUrdu ? `کیا آپ منتخب کردہ ${selectedEntries.length} اندراجات حذف کرنا چاہتے ہیں؟` : `Are you sure you want to bulk delete ${selectedEntries.length} entries?`)) return;
    
    try {
      const res = await bulkDeleteDuroodSubmissions(selectedEntries);
      if (res.success) {
        const newList = submissions.filter(s => !selectedEntries.includes(s.id));
        setSubmissions(newList);
        localStorage.setItem('local_durood_submissions', JSON.stringify(newList));
        setSelectedEntries([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Edit action
  const handleUpdateEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    setIsSavingEdit(true);
    try {
      const res = await updateDuroodSubmission(editingEntry.id, {
        full_name: editingEntry.full_name,
        mobile: editingEntry.mobile,
        whatsapp: editingEntry.whatsapp,
        city: editingEntry.city,
        country: editingEntry.country,
        durood_type: editingEntry.durood_type,
        quantity: Number(editingEntry.quantity),
        intention: editingEntry.intention
      });

      if (res.success) {
        const updatedList = submissions.map(s => s.id === editingEntry.id ? { ...s, ...editingEntry, quantity: Number(editingEntry.quantity) } : s);
        setSubmissions(updatedList);
        localStorage.setItem('local_durood_submissions', JSON.stringify(updatedList));
        setEditingEntry(null);
      }
    } catch(err) {
      console.error(err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Campaign calculation
  const campaign = useMemo(() => {
    const currentGoal = CAMPAIGN_TARGETS.find(t => t.id === activeCampaignId) || CAMPAIGN_TARGETS[2];
    const totalCount = stats.overall;
    const pct = Math.min((totalCount / currentGoal.count) * 100, 100);
    const remaining = Math.max(currentGoal.count - totalCount, 0);

    return {
      goalName: currentGoal.ur,
      goalEn: currentGoal.en,
      goalCount: currentGoal.count,
      percent: pct,
      remaining,
      completed: totalCount
    };
  }, [stats, activeCampaignId]);

  // Leaderboard lists
  const leaderboardData = useMemo(() => {
    // Group by mobile to aggregate reciter counts
    const userGroups: Record<string, { name: string; total: number; city: string; country: string }> = {};
    submissions.forEach(s => {
      // Do not merge if mobile is missing or empty
      const key = s.mobile || Math.random().toString();
      if (!userGroups[key]) {
        userGroups[key] = {
          name: s.full_name || (isUrdu ? 'مخفی صارف' : 'Anonymous Reciter'),
          total: 0,
          city: s.city || 'Karachi',
          country: s.country || 'Pakistan'
        };
      }
      userGroups[key].total += Number(s.quantity) || 0;
    });

    const list = Object.values(userGroups).sort((a, b) => b.total - a.total);
    return list.slice(0, 100); // Top 100 contributors
  }, [submissions]);

  // Export to Excel / CSV Helper
  const handleExportData = (type: 'csv' | 'excel') => {
    let content = '';
    if (type === 'csv') {
      const headers = ['ID', 'Full Name', 'Mobile', 'WhatsApp', 'Email', 'City', 'Country', 'Durood Type', 'Quantity', 'Intention', 'Created At'];
      const rows = submissions.map(s => [
        s.id || '',
        s.full_name || '',
        s.mobile || '',
        s.whatsapp || '',
        s.email || '',
        s.city || '',
        s.country || '',
        s.durood_type || '',
        s.quantity || 0,
        s.intention || '',
        s.created_at || ''
      ]);
      content = [headers.join(','), ...rows.map(r => r.map(val => `"${val.toString().replace(/"/g, '""')}"`).join(','))].join('\n');
      
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Hasnain_Foundation_Durood_Bank_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Basic Excel XML format
      let excelTemplate = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8" /></head>
        <body>
          <table border="1">
            <tr style="background-color: #047857; color: white; font-weight: bold;">
              <td>ID</td><td>Full Name</td><td>Mobile</td><td>WhatsApp</td><td>Email</td><td>City</td><td>Country</td><td>Durood Type</td><td>Quantity</td><td>Intention</td><td>Recited Date</td>
            </tr>
      `;
      submissions.forEach(s => {
        excelTemplate += `
          <tr>
            <td>${s.id || ''}</td>
            <td>${s.full_name || ''}</td>
            <td>${s.mobile || ''}</td>
            <td>${s.whatsapp || ''}</td>
            <td>${s.email || ''}</td>
            <td>${s.city || ''}</td>
            <td>${s.country || ''}</td>
            <td>${s.durood_type || ''}</td>
            <td>${s.quantity || 0}</td>
            <td>${s.intention || ''}</td>
            <td>${s.created_at || ''}</td>
          </tr>
        `;
      });
      excelTemplate += '</table></body></html>';
      const blob = new Blob([excelTemplate], { type: 'application/vnd.ms-excel' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Hasnain_Foundation_Durood_Bank_${new Date().toISOString().slice(0,10)}.xls`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Certificate printing / render helper HTML
  const generateCertificateHtml = (cert: typeof selectedCertificate) => {
    if (!cert) return '';
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hasnain Foundation - Durood Certificate</title>
          <meta charset="utf-8">
          <link href="https://fonts.googleapis.com/css2?family=Amiri&family=Inter:wght@400;600;800&family=Noto+Nastaliq+Urdu&display=swap" rel="stylesheet">
          <style>
            @media print {
              body { background-color: #ffffff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              .certificate-container { box-shadow: none !important; border: 15px double #b45309 !important; }
            }
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 40px;
              background-color: #1e293b;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .certificate-container {
              width: 100%;
              max-width: 900px;
              aspect-ratio: 1.414; /* Landscape proportions */
              background: radial-gradient(circle, #fafafa 0%, #f4f4f5 100%);
              border: 20px double #b45309;
              border-radius: 12px;
              padding: 50px;
              box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
              box-sizing: border-box;
              position: relative;
              text-align: center;
              color: #0f172a;
            }
            .certificate-container::before {
              content: '';
              position: absolute;
              top: 10px; left: 10px; right: 10px; bottom: 10px;
              border: 2px solid #b45309;
              opacity: 0.3;
              pointer-events: none;
            }
            .header-arabic {
              font-family: 'Amiri', serif;
              font-size: 28px;
              color: #047857;
              margin-bottom: 5px;
            }
            .title {
              font-size: 38px;
              font-weight: 800;
              letter-spacing: 2px;
              color: #065f46;
              margin: 10px 0;
            }
            .urdu-title {
              font-family: 'Noto Nastaliq Urdu', serif;
              font-size: 30px;
              line-height: 2;
              color: #b45309;
              margin-bottom: 20px;
            }
            .cert-body {
              font-size: 18px;
              line-height: 1.8;
              color: #334155;
              margin: 25px auto;
              max-width: 700px;
            }
            .user-name {
              font-family: 'Noto Nastaliq Urdu', 'Inter', sans-serif;
              font-size: 28px;
              font-weight: bold;
              color: #047857;
              border-bottom: 2px dashed #b45309;
              padding-bottom: 5px;
              display: inline-block;
              margin: 10px 0;
            }
            .count-badge {
              font-weight: 800;
              color: #b45309;
              font-size: 24px;
            }
            .footer-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              align-items: flex-end;
              margin-top: 50px;
              font-size: 13px;
              color: #64748b;
            }
            .seal-box {
              text-align: center;
            }
            .seal {
              width: 90px;
              height: 90px;
              border-radius: 50%;
              border: 4px double #b45309;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #b45309;
              font-weight: 800;
              font-size: 11px;
              margin: 0 auto 10px;
              background-color: rgba(180, 83, 9, 0.05);
              text-transform: uppercase;
              line-height: 1.2;
            }
            .signature {
              font-family: 'Amiri', serif;
              font-size: 20px;
              color: #065f46;
              font-style: italic;
              border-bottom: 1px solid #cbd5e1;
              display: inline-block;
              padding-bottom: 5px;
              margin-bottom: 5px;
            }
            .cert-no {
              position: absolute;
              bottom: 25px;
              left: 35px;
              font-family: monospace;
              font-size: 11px;
              color: #94a3b8;
            }
            .qr-code {
              position: absolute;
              bottom: 25px;
              right: 35px;
              width: 60px;
              height: 60px;
              border: 1px solid #cbd5e1;
              background-color: white;
              padding: 4px;
            }
          </style>
        </head>
        <body>
          <div class="certificate-container">
            <div class="header-arabic">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
            <div class="title">HASNAIN FOUNDATION</div>
            <div class="urdu-title">سندِ خدمتِ درود شریف</div>
            
            <div class="cert-body">
              یہ سند نہایت احترام کے ساتھ جناب <br>
              <div class="user-name">${cert.userName}</div> <br>
              کو پیش کی جاتی ہے کیونکہ انہوں نے حسنین فاؤنڈیشن کے درود بینک میں <br>
              <span class="count-badge">${cert.totalCount.toLocaleString()}</span> مرتبہ درود شریف پڑھ کر جمع کروانے کی سعادت حاصل کی ہے۔ <br>
              <div style="font-family: 'Noto Nastaliq Urdu', serif; margin-top: 15px; color: #047857; font-size: 22px;">
                اللہ تعالیٰ ان کی اس پاکیزہ عبادت کو قبول و مقبول فرمائے۔ آمین۔
              </div>
            </div>

            <div class="footer-grid">
              <div>
                <div class="signature">سلمان علی قادری</div>
                <div>سرپرستِ اعلیٰ</div>
                <div>حسنین فاؤنڈیشن</div>
              </div>
              
              <div class="seal-box">
                <div class="seal">Official<br>Seal<br>HF</div>
                <div>جاری کردہ تاریخ: ${cert.date}</div>
              </div>

              <div>
                <div class="signature">شایان علی قادری</div>
                <div>خلیفہ مجاز</div>
                <div>روحانی سرپرست</div>
              </div>
            </div>

            <div class="cert-no">CERT NO: ${cert.certNo}</div>
            <div class="qr-code">
              <svg viewBox="0 0 100 100" style="width:100%; height:100%;">
                <rect width="100" height="100" fill="white"/>
                <!-- Geometric representation of QR -->
                <rect x="10" y="10" width="25" height="25" fill="#0f172a"/>
                <rect x="15" y="15" width="15" height="15" fill="white"/>
                <rect x="18" y="18" width="9" height="9" fill="#0f172a"/>
                
                <rect x="65" y="10" width="25" height="25" fill="#0f172a"/>
                <rect x="70" y="15" width="15" height="15" fill="white"/>
                <rect x="73" y="18" width="9" height="9" fill="#0f172a"/>

                <rect x="10" y="65" width="25" height="25" fill="#0f172a"/>
                <rect x="15" y="70" width="15" height="15" fill="white"/>
                <rect x="18" y="73" width="9" height="9" fill="#0f172a"/>

                <rect x="45" y="45" width="10" height="10" fill="#0f172a"/>
                <rect x="60" y="60" width="15" height="15" fill="#0f172a"/>
                <rect x="75" y="75" width="15" height="15" fill="#0f172a"/>
                <rect x="45" y="75" width="12" height="12" fill="#0f172a"/>
                <rect x="75" y="45" width="12" height="12" fill="#0f172a"/>
              </svg>
            </div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 500);
            }
          </script>
        </body>
      </html>
    `;
  };

  // Launch Certificate Printer
  const handlePrintCertificate = (cert: typeof selectedCertificate) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generateCertificateHtml(cert));
      printWindow.document.close();
    }
  };

  // Handle WhatsApp/Social shares
  const handleShareCert = (platform: string, cert: any) => {
    const text = `*Hasnain Foundation - Certificate of Recitation*\n\nAlhamdulillah! I received Certificate of Recitation for collecting *${cert.totalCount.toLocaleString()}* recitations of Durood Shareef in the Durood Bank.\n\nVerify and read more at: ${window.location.href}`;
    let shareUrl = '';
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
    }
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  // Safe manual entry for Admin
  const [manualEntry, setManualEntry] = useState({
    fullName: '',
    mobile: '',
    whatsapp: '',
    email: '',
    city: 'Karachi',
    country: 'Pakistan',
    duroodType: 'درود ابراہیمی',
    quantity: '',
    intention: 'امت مسلمہ'
  });

  const handleManualEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEntry.fullName || !manualEntry.mobile || !manualEntry.quantity) return;

    try {
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-GB'); 
      const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

      const payload: DuroodSubmission = {
        full_name: manualEntry.fullName.trim(),
        mobile: manualEntry.mobile.trim(),
        whatsapp: manualEntry.whatsapp.trim(),
        email: manualEntry.email.trim(),
        city: manualEntry.city.trim(),
        country: manualEntry.country.trim(),
        durood_type: manualEntry.duroodType,
        quantity: Number(manualEntry.quantity),
        intention: manualEntry.intention,
        date: dateStr,
        time: timeStr,
        created_at: now.toISOString()
      };

      const res = await submitDuroodToSupabase(payload);
      
      let insertedItem = payload;
      if (res.success && res.result && res.result[0]) {
        insertedItem = res.result[0];
      } else {
        insertedItem = {
          ...payload,
          id: `local-${Date.now()}`
        };
      }

      setSubmissions(prev => {
        if (prev.some(sub => sub.id === insertedItem.id)) return prev;
        return sortSubmissionsNewestFirst([insertedItem, ...prev]);
      });

      setManualEntry({
        fullName: '',
        mobile: '',
        whatsapp: '',
        email: '',
        city: 'Karachi',
        country: 'Pakistan',
        duroodType: 'درود ابراہیمی',
        intention: 'امت مسلمہ',
        quantity: ''
      });
      alert(isUrdu ? 'نیا اندراج کامیابی سے شامل ہو گیا!' : 'New entry successfully added!');
    } catch(e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      
      {/* Dynamic Sync Status bar */}
      <div className="flex justify-end mb-4">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${
          syncStatus === 'synced'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : syncStatus === 'syncing'
            ? 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse'
            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
        }`}>
          <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span>
            {syncStatus === 'synced' 
              ? (isUrdu ? 'سپابیس ڈیٹا بیس کلاؤڈ لائیو ہم آہنگ' : 'Supabase Live Connected')
              : syncStatus === 'syncing'
              ? (isUrdu ? 'ہم آہنگ کیا جا رہا ہے...' : 'Syncing database...')
              : (isUrdu ? 'مقامى ذخیرہ اندوزی (آف لائن سیکیور موڈ)' : 'Saved locally (Offline Secure Mode)')
            }
          </span>
        </div>
      </div>

      {/* LUXURY HERO HEADER SECTION */}
      <div className="relative mb-12 text-center overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 p-8 sm:p-12 shadow-2xl">
        {/* Subtle geometric overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center justify-center p-3 mb-4 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-amber-400 tracking-tight font-urdu mb-2">
            📿 درود بینک
          </h1>
          <p className="text-lg sm:text-2xl text-emerald-200 font-medium font-urdu mb-8">
            اپنا پڑھا ہوا درود شریف جمع کریں اور کارِ خیر میں حصہ دار بنیں
          </p>

          {/* Core overall counter */}
          <div className="inline-block px-8 py-6 rounded-2xl bg-white/5 border border-amber-400/20 backdrop-blur-md shadow-inner text-center max-w-lg w-full">
            <span className="block text-xs uppercase tracking-widest text-amber-400 font-bold mb-1">
              {isUrdu ? 'کل جمع شدہ درود شریف' : 'Overall Durood Recited'}
            </span>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-widest font-mono">
              <AnimatePresence mode="wait">
                <motion.span
                  key={stats.overall}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {stats.overall.toLocaleString()}
                </motion.span>
              </AnimatePresence>
            </div>
            <span className="block text-[11px] text-emerald-300 font-urdu mt-1.5">
              {isUrdu ? 'سبحان اللہ! 17 لاکھ (1.7M) سابقہ جمع شدہ درود شریف شاملِ کاؤنٹر ہیں۔' : 'SubhanAllah! Includes 1.7M historical collection batch.'}
            </span>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS WITH GOLD/GREEN HOVERS */}
      <div className="flex flex-wrap gap-2 justify-center mb-8 border-b border-slate-200 pb-4">
        {[
          { id: 'submit', labelEn: 'Recite & Submit', labelUr: '📿 درود جمع کریں', icon: Heart },
          { id: 'counters', labelEn: 'Live Counters', labelUr: 'مختلف درودوں کی تعداد', icon: BookOpen },
          { id: 'campaigns', labelEn: 'Campaigns', labelUr: 'دعوت و ہدف مہم', icon: Trophy },
          { id: 'leaderboard', labelEn: 'Leaderboard', labelUr: 'مایہ ناز پڑھنے والے', icon: Award },
          { id: 'certificates', labelEn: 'Certificates', labelUr: 'اعزازی اسناد', icon: FileText },
          { id: 'virtues', labelEn: 'Virtues & Hadiths', labelUr: 'فضائل و احادیثِ درود', icon: Sparkles },
          { id: 'profile', labelEn: 'User Profile', labelUr: 'پروفائل اور اعزازات', icon: User },
          { id: 'admin', labelEn: 'Admin Portal', labelUr: 'انتظامی امور', icon: Lock }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const IconComp = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white border border-emerald-700 shadow-md'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-amber-500 hover:text-emerald-800'
              } ${isUrdu ? 'font-urdu' : ''}`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
              <span>{isUrdu ? tab.labelUr : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* CORE CONTENT RENDERER */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* SUBMIT FORM TAB */}
        {activeTab === 'submit' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Form Column */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 mb-6 gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-urdu">
                  {isUrdu ? 'درود پاک جمع کروانے کا فارم' : 'Submit Recited Durood'}
                </h2>

                <button
                  type="button"
                  onClick={() => setIsHadithModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-xs hover:scale-105 font-urdu"
                >
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>{isUrdu ? '📖 فضائل درود و ۲۵ احادیث (درودِ محبت، کرم، ناریہ پڑھیں)' : '📖 Read Virtues & 25 Hadiths'}</span>
                </button>
              </div>

              {submitSuccess ? (
                <motion.div 
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-12 px-6 rounded-2xl bg-emerald-50 border border-emerald-200"
                >
                  <div className="inline-flex items-center justify-center p-4 mb-4 rounded-full bg-emerald-100 text-emerald-700">
                    <Check className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-emerald-800 mb-2 font-urdu">
                    جزاکم اللہ خیراً
                  </h3>
                  <p className="text-lg text-emerald-700 font-urdu mb-4">
                    آپ کا درود شریف کامیابی سے درود بینک میں جمع ہو گیا ہے۔
                  </p>
                  <div className="inline-block p-4 bg-white rounded-xl border border-emerald-100 mb-6 font-urdu text-slate-700">
                    <div><strong>{submittedName}</strong></div>
                    <div className="text-xl font-bold text-amber-600 mt-1">{submittedQuantity.toLocaleString()} مرتبہ ({formData.duroodType})</div>
                  </div>
                  <p className="text-sm text-slate-500 font-urdu mb-6">
                    اللہ تعالیٰ آپ کی اس پیاری عبادت اور عقیدت کو بارگاہِ مصطفیٰ صلی اللہ علیہ وسلم میں قبول و مقبول فرمائے۔ آمین۔
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm cursor-pointer"
                  >
                    {isUrdu ? 'مزید درود جمع کریں' : 'Recite More'}
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'پورا نام *' : 'Full Name *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={e => setFormData({...formData, fullName: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm"
                        placeholder={isUrdu ? 'نام درج کریں' : 'Enter full name'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'موبائل نمبر *' : 'Mobile Number *'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.mobile}
                        onChange={e => setFormData({...formData, mobile: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-mono"
                        placeholder="03152204134"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'واٹس ایپ نمبر' : 'WhatsApp Number'}
                      </label>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-mono"
                        placeholder="03152204134"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'ای میل ایڈریس' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'شہر' : 'City'}
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={e => setFormData({...formData, city: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'ملک' : 'Country'}
                      </label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={e => setFormData({...formData, country: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'درود پاک کا انتخاب کریں *' : 'Select Durood *'}
                      </label>
                      <select
                        value={formData.duroodType}
                        onChange={e => setFormData({...formData, duroodType: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-urdu"
                      >
                        {DUROOD_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.ur}>
                            {isUrdu ? opt.ur : opt.en}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                        {isUrdu ? 'تعداد (صرف ہندسے) *' : 'Quantity *'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={e => setFormData({...formData, quantity: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-mono"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-1">
                      {isUrdu ? 'ایصالِ ثواب / نیت' : 'Intention'}
                    </label>
                    <select
                      value={formData.intention}
                      onChange={e => setFormData({...formData, intention: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-urdu"
                    >
                      {INTENTION_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.ur}>
                          {isUrdu ? opt.ur : opt.en}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Anonymous Toggle */}
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="isAnonymous"
                      checked={formData.isAnonymous}
                      onChange={e => setFormData({...formData, isAnonymous: e.target.checked})}
                      className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600"
                    />
                    <label htmlFor="isAnonymous" className="text-xs text-slate-600 font-urdu font-semibold">
                      {isUrdu ? 'لیڈر بورڈ پر میرا نام مخفی رکھیں (Anonymous Mode)' : 'Keep my name hidden on the leaderboard'}
                    </label>
                  </div>

                  {/* Recited Confirmation Checkbox */}
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-3">
                    <input
                      type="checkbox"
                      required
                      id="confirmed"
                      checked={formData.confirmed}
                      onChange={e => setFormData({...formData, confirmed: e.target.checked})}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 cursor-pointer"
                    />
                    <label htmlFor="confirmed" className="text-xs text-amber-800 font-urdu leading-relaxed font-bold cursor-pointer">
                      {isUrdu 
                        ? 'میں صدقِ دل سے تصدیق کرتا ہوں کہ میں نے یہ درود شریف پڑھ لیا ہے اور تعداد بالکل درست لکھی ہے۔' 
                        : 'I sincerely confirm that I have personally recited this Durood Shareef and the count is accurate.'
                      }
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 sm:py-4 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-950 text-white font-extrabold text-sm sm:text-base border border-emerald-700 hover:from-emerald-900 hover:to-black cursor-pointer shadow-md transition-all active:scale-[0.99] disabled:opacity-50 font-urdu flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5 text-amber-400 animate-pulse fill-amber-400/20" />
                    <span>{isSubmitting ? (isUrdu ? 'درود جمع کیا جا رہا ہے...' : 'Submitting Durood...') : (isUrdu ? '📿 درود جمع کریں' : 'Submit Recitations')}</span>
                  </button>
                </form>
              )}
            </div>

            {/* Dynamic micro-stats panel */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Spiritual Reward Reminder Card */}
              <div className="p-6 bg-gradient-to-tr from-slate-900 to-emerald-950 border border-emerald-800/40 rounded-3xl text-white shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-amber-400 pointer-events-none">
                  <Sparkles className="w-40 h-40" />
                </div>
                <h3 className="text-lg font-bold text-amber-400 mb-2 font-urdu">
                  حدیثِ مبارکہ کی روشنی میں
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-urdu mb-4">
                  سرکارِ دو عالم حضرت محمد مصطفیٰ صلی اللہ علیہ وسلم نے ارشاد فرمایا: "جو مجھ پر ایک مرتبہ درود شریف پڑھے گا، اللہ تعالیٰ اس پر 10 رحمتیں نازل فرمائے گا، اس کے 10 گناہ معاف فرمائے گا، اور اس کے 10 درجات بلند فرمائے گا۔"
                </p>
                <div className="text-right text-xs text-amber-400/80 font-mono font-bold">
                  — جامع سنن نسائی
                </div>
              </div>

              {/* Time Interval counters */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                  {isUrdu ? 'تفصیلی اوقاتاتی شمار' : 'Recitations Analytics'}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[11px] text-slate-500 font-bold uppercase">{isUrdu ? 'آج کے درود' : "Today's recitations"}</span>
                    <span className="text-2xl font-black text-emerald-800 font-mono">{stats.today.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                    <span className="block text-[11px] text-slate-500 font-bold uppercase">{isUrdu ? 'اس ہفتے کے درود' : 'Weekly total'}</span>
                    <span className="text-2xl font-black text-emerald-800 font-mono">{stats.weekly.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center col-span-2">
                    <span className="block text-[11px] text-slate-500 font-bold uppercase">{isUrdu ? 'اس مہینے کے درود' : 'Monthly total'}</span>
                    <span className="text-3xl font-black text-amber-600 font-mono">{stats.monthly.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Campaign Micro Target */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-3xl border border-amber-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest">
                    {isUrdu ? 'فعال مہم کی رفتار' : 'Active Campaign Tracker'}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-800 text-[10px] font-bold font-urdu">
                    {campaign.goalName}
                  </span>
                </div>
                <div className="w-full bg-amber-100 rounded-full h-3 mb-2.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${campaign.percent}%` }}
                    className="bg-amber-500 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-amber-900 font-urdu">
                  <span>{isUrdu ? `${Math.round(campaign.percent)}% مکمل` : `${Math.round(campaign.percent)}% Complete`}</span>
                  <span>{isUrdu ? `${campaign.remaining.toLocaleString()} باقی ہیں` : `${campaign.remaining.toLocaleString()} Remaining`}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* COUNTERS TAB */}
        {activeTab === 'counters' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-2xl font-black text-slate-800 mb-2 font-urdu">
                {isUrdu ? 'مختلف مبارک درودوں کے انفرادی کاؤنٹرز' : 'Individual Recitation Counters'}
              </h2>
              <p className="text-sm text-slate-500 font-urdu border-b border-slate-100 pb-4 mb-6">
                انفرادی طور پر پڑھے گئے تمام درود پاک کا براہ راست شمار جو سپابیس ڈیٹا بیس سے لائیو اپڈیٹ ہوتا ہے۔
              </p>

              {/* Interactive grid of counters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {DUROOD_OPTIONS.map(opt => {
                  const val = stats.typeCounters[opt.ur] || 0;
                  return (
                    <div 
                      key={opt.id}
                      className="p-5 rounded-2xl border border-slate-150 bg-white hover:border-amber-400 hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-xs font-extrabold text-slate-400 tracking-wider uppercase font-mono">{opt.id}</span>
                          <h3 className="text-lg font-black text-slate-800 font-urdu mt-0.5">
                            {opt.ur}
                          </h3>
                        </div>
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800">
                          <BookOpen className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <span className="block text-[10px] text-slate-400 uppercase tracking-widest">{isUrdu ? 'مجموعی تعداد' : 'Recitations count'}</span>
                        <div className="text-3xl font-black text-emerald-800 font-mono">
                          {val.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Custom SVG Analytics Chart */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-black text-slate-800 mb-4 font-urdu">
                {isUrdu ? 'درود پاک کے پڑھنے کی شماریاتی تناسب' : 'Analytical Recitation Ratio'}
              </h3>
              
              <div className="space-y-4">
                {DUROOD_OPTIONS.map(opt => {
                  const val = stats.typeCounters[opt.ur] || 0;
                  const ratio = stats.overall > 0 ? (val / stats.overall) * 100 : 0;
                  if (val === 0) return null; // Only show non-zero in chart
                  return (
                    <div key={opt.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700 font-urdu">
                        <span>{opt.ur}</span>
                        <span className="font-mono">{val.toLocaleString()} ({Math.round(ratio)}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-700 h-full rounded-full" 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-urdu">
              {isUrdu ? 'درود پاک کے دعوتی اہداف اور مہمات' : 'Durood Bank Recitation Campaigns'}
            </h2>
            <p className="text-sm text-slate-500 font-urdu border-b border-slate-100 pb-4 mb-6">
              ہم سب مل کر مختلف سنگ میل اور اہداف حاصل کرنے کی کوشش کر رہے ہیں تا کہ کثیر تعداد میں درود پاک کا ہدیہ پیش کیا جا سکے۔
            </p>

            {/* Milestone goal chooser */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {CAMPAIGN_TARGETS.map(target => {
                const isSelected = activeCampaignId === target.id;
                const isCompleted = stats.overall >= target.count;
                return (
                  <button
                    key={target.id}
                    onClick={() => setActiveCampaignId(target.id)}
                    className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/10 border-amber-500 text-amber-900 shadow-sm font-black'
                        : isCompleted
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-amber-400'
                    } ${isUrdu ? 'font-urdu' : ''}`}
                  >
                    <Trophy className={`w-6 h-6 mx-auto mb-2 ${isSelected ? 'text-amber-500' : isCompleted ? 'text-emerald-700' : 'text-slate-400'}`} />
                    <span className="block text-xs text-slate-500 uppercase">{target.count.toLocaleString()}</span>
                    <span className="text-sm font-bold font-urdu block mt-0.5">{target.ur}</span>
                    {isCompleted && (
                      <span className="inline-block mt-1 px-1.5 py-0.5 rounded-full bg-emerald-100 text-[9px] text-emerald-700 font-bold uppercase">
                        {isUrdu ? 'حاصل شدہ' : 'Completed'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Campaign Dashboard */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden border border-emerald-800">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 to-slate-950/40"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                <div className="md:col-span-8 space-y-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-urdu">
                    {isUrdu ? 'منتخب شدہ فعال مہم' : 'Selected Recitation Goal'}
                  </span>
                  
                  <h3 className="text-3xl font-black text-white font-urdu">
                    {campaign.goalEn} ({campaign.goalName})
                  </h3>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm font-bold text-slate-300">
                      <span>{isUrdu ? 'حاصل شدہ درود پاک' : 'Completed Recitations'}</span>
                      <span className="font-mono text-amber-400">{campaign.completed.toLocaleString()} / {campaign.goalCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${campaign.percent}%` }}
                        className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-xs text-slate-400">{isUrdu ? 'باقی ماندہ تعداد' : 'Remaining Target'}</span>
                      <span className="text-xl font-bold font-mono text-amber-400">{campaign.remaining.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <span className="block text-xs text-slate-400">{isUrdu ? 'فیصد شرح' : 'Completed Percent'}</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{Math.round(campaign.percent)}%</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-4 text-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
                  <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 mb-3">
                    <Award className="w-12 h-12" />
                  </div>
                  <h4 className="text-lg font-black text-amber-400 font-urdu mb-1">
                    {isUrdu ? 'کاروانِ محبت و بیداری' : 'Caravan of Love'}
                  </h4>
                  <p className="text-xs text-slate-300 font-urdu max-w-xs mx-auto leading-relaxed">
                    {isUrdu 
                      ? 'آئیں سب مل کر کثرت سے درود پاک پڑھیں اور اپنے پیاروں کے ایصالِ ثواب اور شفا کے لیے پیش کریں۔'
                      : 'Join the spiritual network to complete milestones of gratitude and devotion.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-urdu">
              {isUrdu ? 'مایہ ناز درود پڑھنے والے (لیڈر بورڈ)' : 'Top Reciters Leaderboard'}
            </h2>
            <p className="text-sm text-slate-500 font-urdu border-b border-slate-100 pb-4 mb-6">
              درود بینک میں سب سے زیادہ درود پاک پیش کرنے والے سعادت مند مومنین کا ہفتہ وار اور سالانہ لائیو شماریاتی ریکارڈ۔
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 font-urdu">
                    <th className="py-4 px-4 font-bold text-center">{isUrdu ? 'نمبر شمار' : 'Rank'}</th>
                    <th className="py-4 px-4 font-bold">{isUrdu ? 'نام گرامی' : 'Reciter Name'}</th>
                    <th className="py-4 px-4 font-bold text-center">{isUrdu ? 'شہر / ملک' : 'Location'}</th>
                    <th className="py-4 px-4 font-bold text-right">{isUrdu ? 'مجموعی تعداد' : 'Total Recited'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leaderboardData.map((item, index) => {
                    const isTop3 = index < 3;
                    return (
                      <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 text-center font-bold font-mono">
                          {isTop3 ? (
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs text-white ${
                              index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-slate-400' : 'bg-amber-700'
                            }`}>
                              {index + 1}
                            </span>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-black text-slate-800 font-urdu">
                          {item.name}
                        </td>
                        <td className="py-4 px-4 text-center text-slate-500 font-urdu">
                          {item.city}, {item.country}
                        </td>
                        <td className="py-4 px-4 text-right font-black text-emerald-800 font-mono text-base">
                          {item.total.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                  {leaderboardData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-slate-400 font-urdu">
                        {isUrdu ? 'کوئی ریکارڈ دستیاب نہیں ہے۔' : 'No records found yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 'certificates' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-1 font-urdu">
                  {isUrdu ? 'درود پاک کی لائیو اعزازی اسناد' : 'Islamic Durood Certificates'}
                </h2>
                <p className="text-sm text-slate-500 font-urdu">
                  {isUrdu ? 'سنگِ میل عبور کرنے والے پڑھنے والوں کو حسنین فاؤنڈیشن کی جانب سے خوبصورت سندِ خدمت لائیو تفویض کی جاتی ہے۔' : 'Live service certificates awarded for milestone achievements.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsHadithModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 font-urdu"
              >
                <BookOpen className="w-4.5 h-4.5 text-emerald-950" />
                <span>{isUrdu ? '📖 فضائل درود و ۲۵ احادیثِ مبارکہ' : '📖 Virtues of Durood & 25 Hadiths'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Lookup Card */}
              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-150">
                <h3 className="text-lg font-black text-slate-800 mb-4 font-urdu">
                  {isUrdu ? 'سند حاصل / چیک کریں' : 'Verify & Load Certificate'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                      {isUrdu ? 'موبائل نمبر درج کریں *' : 'Enter mobile number *'}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={e => setProfilePhone(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-sm font-mono"
                        placeholder="03152204134"
                      />
                      <button
                        onClick={() => handleSearchProfile()}
                        className="absolute right-2 top-2 p-1.5 rounded-lg bg-emerald-800 text-white hover:bg-emerald-950 cursor-pointer"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {profileResult ? (
                    <div className="p-4 bg-white rounded-xl border border-emerald-100 space-y-3 font-urdu">
                      <div className="text-xs font-bold text-emerald-800">{isUrdu ? 'خوشخبری! ریکارڈ مل گیا' : 'Record Loaded Successfully'}</div>
                      <div className="font-black text-slate-800">{profileResult.name}</div>
                      <div className="text-sm text-slate-600">
                        مجموعی درود پاک: <strong className="text-amber-600 font-mono text-base">{profileResult.total.toLocaleString()}</strong>
                      </div>

                      {/* Find highest achieved milestone */}
                      {(() => {
                        const achievedMilestones = CERTIFICATE_MILESTONES.filter(m => profileResult.total >= m);
                        if (achievedMilestones.length === 0) {
                          return (
                            <p className="text-xs text-rose-600 leading-relaxed font-semibold">
                              {isUrdu ? 'سند حاصل کرنے کے لیے کم از کم 100 مرتبہ درود پڑھنا ضروری ہے۔' : 'Minimum 100 recitations required for a certificate.'}
                            </p>
                          );
                        }
                        const topMilestone = achievedMilestones[achievedMilestones.length - 1];
                        const certNo = `HF-DB-${profilePhone.slice(-4)}-${topMilestone}`;
                        const dateStr = new Date().toLocaleDateString('en-GB');

                        return (
                          <div className="space-y-2 pt-2 border-t border-slate-100">
                            <span className="block text-xs text-slate-400 font-bold">{isUrdu ? 'اعلیٰ ترین سنگِ میل' : 'Highest Milestone Achieved'}</span>
                            <div className="text-emerald-800 font-black text-lg">{topMilestone.toLocaleString()} مرتبہ</div>
                            
                            <button
                              onClick={() => setSelectedCertificate({
                                userName: profileResult.name,
                                totalCount: profileResult.total,
                                milestone: topMilestone,
                                certNo,
                                date: dateStr
                              })}
                              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-lg cursor-pointer transition-colors"
                            >
                              {isUrdu ? 'اعزازی سند دیکھیں' : 'View Certificate'}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 font-urdu text-xs leading-relaxed">
                      {isUrdu ? 'اپنا موبائل نمبر درج کر کے لائیو اعزازی سند لوڈ کریں۔' : 'Enter mobile number to pull your live milestone certificate.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Certificate Preview Pane */}
              <div className="md:col-span-8">
                {selectedCertificate ? (
                  <div className="space-y-4">
                    {/* Live Certificate Visual Mock Card (Premium Green/Gold) */}
                    <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-tr from-slate-950 via-emerald-950 to-slate-900 text-white border-4 border-double border-amber-500 shadow-xl text-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(#d97706_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-10"></div>
                      
                      <div className="relative z-10">
                        <span className="block text-xs uppercase tracking-widest text-amber-400 font-bold">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</span>
                        <h3 className="text-2xl sm:text-4xl font-black text-white font-urdu mt-4">حسنین فاؤنڈیشن</h3>
                        <h4 className="text-xl sm:text-2xl text-amber-500 font-urdu mt-1 mb-6">سندِ خدمتِ درود شریف</h4>
                        
                        <p className="text-sm text-slate-300 font-urdu leading-relaxed max-w-lg mx-auto">
                          یہ سند نہایت احترام کے ساتھ جناب <br />
                          <strong className="text-emerald-300 text-lg sm:text-2xl border-b border-dashed border-amber-400/50 pb-1 inline-block my-2">{selectedCertificate.userName}</strong> <br />
                          کو پیش کی جاتی ہے کیونکہ انہوں نے درود بینک میں <br />
                          <strong className="text-amber-400 text-xl font-mono">{selectedCertificate.totalCount.toLocaleString()}</strong> مرتبہ درود شریف جمع کروانے کی سعادت حاصل کی ہے۔
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 text-xs text-slate-400 font-urdu">
                          <div className="text-left">
                            <span>جاری کردہ نمبر: <strong>{selectedCertificate.certNo}</strong></span>
                          </div>
                          <div className="text-right">
                            <span>تاریخِ اجرا: <strong>{selectedCertificate.date}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ACTION BUTTONS GRID */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <button
                        onClick={() => handlePrintCertificate(selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Printer className="w-4 h-4 text-amber-400" />
                        <span>{isUrdu ? 'پرنٹ سند' : 'Print Certificate'}</span>
                      </button>
                      <button
                        onClick={() => handlePrintCertificate(selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Download className="w-4 h-4 text-amber-400" />
                        <span>{isUrdu ? 'ڈاؤن لوڈ PDF' : 'Download PDF'}</span>
                      </button>
                      <button
                        onClick={() => handleShareCert('whatsapp', selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-emerald-400" />
                        <span>WhatsApp Share</span>
                      </button>
                      <button
                        onClick={() => handleShareCert('facebook', selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-royal-400" />
                        <span>Facebook Share</span>
                      </button>
                      <button
                        onClick={() => handleShareCert('telegram', selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-indigo-400" />
                        <span>Telegram Share</span>
                      </button>
                      <button
                        onClick={() => handleShareCert('twitter', selectedCertificate)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      >
                        <Share2 className="w-4 h-4 text-slate-400" />
                        <span>Twitter (X) Share</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 rounded-3xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-6 text-center font-urdu">
                    <Award className="w-16 h-16 text-slate-300 mb-3 animate-pulse" />
                    <p className="text-sm font-bold">بائیں جانب اپنا موبائل نمبر لکھ کر اعزازی سند کا ڈیزائن اور پرنٹ پیج لوڈ کریں۔</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIRTUES & HADITHS TAB */}
        {activeTab === 'virtues' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-3">
              <div>
                <h2 className="text-2xl font-black text-slate-800 mb-1 font-urdu">
                  {isUrdu ? 'فضائلِ درود شریف و ۲۵ احادیثِ مبارکہ' : 'Virtues of Durood & 25 Authentic Hadiths'}
                </h2>
                <p className="text-sm text-slate-500 font-urdu">
                  {isUrdu ? 'عربی متن، اردو و انگریزی ترجمہ اور درودِ محبت، درودِ کرم، درودِ ناریہ کی آن لائن تلاوت' : 'Arabic, Urdu & English text with live Durood recitation counters'}
                </p>
              </div>

              <button
                onClick={() => setIsHadithModalOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 font-urdu"
              >
                <BookOpen className="w-4.5 h-4.5 text-emerald-950" />
                <span>{isUrdu ? 'فول اسکرین پاپ اپ ریڈر کھولیں' : 'Open Fullscreen Reader'}</span>
              </button>
            </div>

            {/* Quick banner card */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl mb-6 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-black font-urdu">
                    {isUrdu ? 'درود پاک پڑھیں اور ثواب کا تحفہ درود بینک میں جمع کریں' : 'Recite Durood & Gift Your Recitations'}
                  </h3>
                  <p className="text-xs text-emerald-200 font-urdu mt-0.5">
                    درودِ محبت، درودِ کرم، اور درودِ ناریہ (صلوۃ التافریجیۃ) سمیت تمام مبارک درود یہاں موجود ہیں
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsHadithModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm cursor-pointer transition-all shadow-lg font-urdu shrink-0"
              >
                {isUrdu ? '📿 ۲۵ احادیث و درود شریف ریڈر کھل گیا ہے' : 'Open Hadith & Durood Reader'}
              </button>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-urdu">
              {isUrdu ? 'کاربر صارف پروفائل' : 'User Personal Reciter Profile'}
            </h2>
            <p className="text-sm text-slate-500 font-urdu border-b border-slate-100 pb-4 mb-6">
              اپنا سابقہ تمام ریکارڈ، تاریخچہ، روحانی درجات، حاصل شدہ بیجز اور مہمات کا ریکارڈ ملاحظہ کریں۔
            </p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Sidebar lookup */}
              <div className="md:col-span-4 bg-slate-50 rounded-2xl p-5 border border-slate-150">
                <h3 className="text-sm font-black text-slate-800 mb-3 font-urdu">{isUrdu ? 'پروفائل لاگ ان / تلاشی' : 'Search Profile'}</h3>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm font-mono"
                    placeholder="03152204134"
                  />
                  <button
                    onClick={() => handleSearchProfile()}
                    className="px-4 py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs cursor-pointer"
                  >
                    {isUrdu ? 'لوڈ کریں' : 'Load'}
                  </button>
                </div>
              </div>

              {/* Profile Details Pane */}
              <div className="md:col-span-8">
                {profileResult ? (
                  <div className="space-y-6">
                    {/* Core Profile Header card */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 border border-emerald-800 text-white shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-400/30">
                          <User className="w-8 h-8" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black font-urdu text-white">{profileResult.name}</h3>
                          <span className="text-xs text-emerald-300 font-mono">{profilePhone}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">{isUrdu ? 'کل پڑھا گیا درود' : 'Total Recited'}</span>
                          <span className="text-xl font-bold font-mono text-amber-400">{profileResult.total.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">{isUrdu ? 'محبوب ترین درود' : 'Favored Durood'}</span>
                          <span className="text-sm font-bold font-urdu text-white truncate max-w-[120px] block mt-0.5">{profileResult.favorite}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">{isUrdu ? 'کل شمولیت' : 'Submissions count'}</span>
                          <span className="text-xl font-bold font-mono text-white">{profileResult.userSubmissions.length}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase text-slate-400">{isUrdu ? 'تازہ ترین شراکت' : 'Last Submission'}</span>
                          <span className="text-xs text-slate-300 mt-1 block">
                            {profileResult.userSubmissions[0]?.created_at ? new Date(profileResult.userSubmissions[0].created_at).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Achievements Badges */}
                    <div className="bg-slate-50 rounded-2xl p-5 border border-slate-150">
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                        {isUrdu ? 'روحانی اسناد و حاصل شدہ بیجز' : 'Badges & Spiritual Milestones'}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {profileResult.badges.map((b, i) => (
                          <span 
                            key={i}
                            className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-800 border border-amber-400/30 text-xs font-bold font-urdu flex items-center gap-1.5"
                          >
                            <Trophy className="w-3.5 h-3.5 text-amber-500" />
                            <span>{b}</span>
                          </span>
                        ))}
                        {profileResult.badges.length === 0 && (
                          <div className="text-xs text-slate-400 font-urdu">{isUrdu ? 'ابھی کوئی روحانی بیج حاصل نہیں ہوا۔' : 'No badges earned yet. Complete 100 recitations to unlock.'}</div>
                        )}
                      </div>
                    </div>

                    {/* Recitation Submission History */}
                    <div>
                      <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-3">
                        {isUrdu ? 'سابقہ پڑھنے کا تاریخچہ' : 'Personal Recitations Log'}
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {profileResult.userSubmissions.map((sub, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-slate-150 flex justify-between items-center text-xs">
                            <div className="font-urdu">
                              <span className="font-bold text-slate-800">{sub.durood_type}</span>
                              <span className="text-slate-400 block text-[10px] mt-0.5">{sub.intention ? `نیت: ${sub.intention}` : ''}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-emerald-800 text-sm font-mono">+{Number(sub.quantity).toLocaleString()}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">
                                {sub.created_at ? new Date(sub.created_at).toLocaleDateString() : ''}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 p-6 text-center font-urdu">
                    <User className="w-12 h-12 text-slate-300 mb-2 animate-bounce" />
                    <p className="text-xs font-bold">براہ مہربانی اپنا موبائل نمبر درج کر کے "لوڈ کریں" پر کلک کریں۔</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ADMIN PORTAL TAB (PASSCODE PROTECTED '786786') */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-800 mb-2 font-urdu">
              {isUrdu ? 'درود بینک ایڈمنسٹریشن پینل' : 'Durood Bank CRM Admin Portal'}
            </h2>
            <p className="text-sm text-slate-500 font-urdu border-b border-slate-100 pb-4 mb-6">
              درود بینک کے تمام لائیو اور آف لائن ڈیٹا کی پڑتال، درستی، مٹانے اور فیلڈ رپورٹس تیار کرنے کے لیے۔
            </p>

            {!isAdminAuthenticated ? (
              <form onSubmit={handleAdminAuth} className="max-w-sm mx-auto py-12 text-center space-y-4">
                <div className="inline-flex p-4 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-500 mb-3">
                  <Lock className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-urdu">{isUrdu ? 'سیکیورٹی تصدیق درکار ہے' : 'Security Authentication Required'}</h3>
                
                <div>
                  <input
                    type="password"
                    required
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-700 text-center tracking-widest font-mono text-lg"
                    placeholder="••••••"
                  />
                  {adminError && (
                    <p className="text-xs text-rose-600 mt-1 font-bold font-urdu">
                      {isUrdu ? 'غلط پاس کوڈ! دوبارہ کوشش کریں۔' : 'Incorrect passcode! Try again.'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-sm font-bold cursor-pointer"
                >
                  {isUrdu ? 'ایڈمن پینل لاگ ان کریں' : 'Access Admin Area'}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                
                {/* Admin Quick Action Bar */}
                <div className="flex flex-wrap gap-3 items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleExportData('csv')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export CSV</span>
                    </button>
                    <button
                      onClick={() => handleExportData('excel')}
                      className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg cursor-pointer hover:bg-emerald-100 flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Excel</span>
                    </button>
                    {selectedEntries.length > 0 && (
                      <button
                        onClick={handleBulkDelete}
                        className="px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold rounded-lg cursor-pointer hover:bg-rose-100 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Bulk Delete ({selectedEntries.length})</span>
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Passcode verified (786786)</span>
                    <button
                      onClick={() => setIsAdminAuthenticated(false)}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                    >
                      Lock Dashboard
                    </button>
                  </div>
                </div>

                {/* Grid stats for admin */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">Overall Entries</span>
                    <span className="text-2xl font-bold font-mono text-emerald-800">{submissions.length}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">Overall Durood Sum</span>
                    <span className="text-2xl font-bold font-mono text-emerald-800">{stats.overall.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">Recited Today</span>
                    <span className="text-2xl font-bold font-mono text-amber-600">{stats.today.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">This Week</span>
                    <span className="text-2xl font-bold font-mono text-emerald-700">{stats.weekly.toLocaleString()}</span>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center col-span-2 lg:col-span-1">
                    <span className="block text-[10px] text-slate-400 uppercase font-black">Offline Backup State</span>
                    <span className="text-xs font-bold text-indigo-700 mt-1.5 block">Synced Local Log</span>
                  </div>
                </div>

                {/* Manual entry / Backups Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-4">
                  
                  {/* Manual entry card */}
                  <div className="md:col-span-5 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-4 font-urdu">
                      {isUrdu ? 'دستی اندراج فارم (Manual Entry)' : 'Admin Manual Entry'}
                    </h3>

                    <form onSubmit={handleManualEntrySubmit} className="space-y-3">
                      <input
                        type="text"
                        required
                        value={manualEntry.fullName}
                        onChange={e => setManualEntry({...manualEntry, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                        placeholder="Full Name / Contributor"
                      />
                      <input
                        type="tel"
                        required
                        value={manualEntry.mobile}
                        onChange={e => setManualEntry({...manualEntry, mobile: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                        placeholder="Mobile Number"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={manualEntry.duroodType}
                          onChange={e => setManualEntry({...manualEntry, duroodType: e.target.value})}
                          className="w-full px-2 py-2 border border-slate-200 rounded-xl text-xs font-urdu"
                        >
                          {DUROOD_OPTIONS.map(opt => (
                            <option key={opt.id} value={opt.ur}>{opt.ur}</option>
                          ))}
                        </select>
                        <input
                          type="number"
                          required
                          value={manualEntry.quantity}
                          onChange={e => setManualEntry({...manualEntry, quantity: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono"
                          placeholder="Recitation count"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-xs font-bold font-urdu cursor-pointer"
                      >
                        {isUrdu ? 'دستی طور پر درود جمع کریں' : 'Force Insert Entry'}
                      </button>
                    </form>
                  </div>

                  {/* Database control section */}
                  <div className="md:col-span-7 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                    <h3 className="text-sm font-black text-slate-800 border-b border-slate-200 pb-2 mb-2 font-urdu">
                      {isUrdu ? 'ڈیٹا بیس بیک اپ اور ری سٹور' : 'Database Backups & Rules'}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-urdu">
                      حسنین فاؤنڈیشن کلاؤڈ سیکیور فالبیک سسٹم درود بینک کے ریکارڈ کی چوبیس گھنٹے مکمل حفاظت کرتا ہے۔
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <button
                        onClick={() => {
                          const rawStr = JSON.stringify(submissions);
                          const blob = new Blob([rawStr], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `Hasnain_Foundation_Durood_DB_Backup_${new Date().toISOString().slice(0,10)}.json`;
                          link.click();
                        }}
                        className="px-3 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Backup Database (JSON)
                      </button>
                      <button
                        onClick={() => {
                          const fileInput = document.createElement('input');
                          fileInput.type = 'file';
                          fileInput.accept = '.json';
                          fileInput.onchange = (e: any) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event: any) => {
                              try {
                                const parsed = JSON.parse(event.target.result);
                                if (Array.isArray(parsed)) {
                                  setSubmissions(parsed);
                                  localStorage.setItem('local_durood_submissions', JSON.stringify(parsed));
                                  alert('Database successfully restored in memory/local storage!');
                                }
                              } catch(err) {
                                alert('Invalid backup file!');
                              }
                            };
                            reader.readAsText(file);
                          };
                          fileInput.click();
                        }}
                        className="px-3 py-2 bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Restore Database (JSON)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Entries Management table */}
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <div className="flex flex-wrap gap-3 items-center justify-between">
                    <h3 className="text-base font-black text-slate-800 font-urdu">{isUrdu ? 'جمع شدہ درود پاک کا لائیو ریکارڈ' : 'All Durood Records'}</h3>
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="px-3 py-1.5 border border-slate-200 rounded-xl text-xs"
                        placeholder="Search contributors..."
                      />
                      <select
                        value={filterDurood}
                        onChange={e => setFilterDurood(e.target.value)}
                        className="px-2 py-1.5 border border-slate-200 rounded-xl text-xs font-urdu"
                      >
                        <option value="all">تمام درود پاک</option>
                        {DUROOD_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.ur}>{opt.ur}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold font-urdu">
                          <th className="py-2.5 px-3 text-center">Select</th>
                          <th className="py-2.5 px-3">Contributor</th>
                          <th className="py-2.5 px-3">Mobile</th>
                          <th className="py-2.5 px-3">Durood Type</th>
                          <th className="py-2.5 px-3 text-right">Quantity</th>
                          <th className="py-2.5 px-3">City/Country</th>
                          <th className="py-2.5 px-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredEntries.map((item, index) => (
                          <tr key={index} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedEntries.includes(item.id)}
                                onChange={e => {
                                  if (e.target.checked) {
                                    setSelectedEntries([...selectedEntries, item.id]);
                                  } else {
                                    setSelectedEntries(selectedEntries.filter(id => id !== item.id));
                                  }
                                }}
                                className="w-3.5 h-3.5 rounded text-emerald-700"
                              />
                            </td>
                            <td className="py-2.5 px-3 font-bold font-urdu">{item.full_name}</td>
                            <td className="py-2.5 px-3 font-mono">{item.mobile}</td>
                            <td className="py-2.5 px-3 font-urdu text-emerald-800 font-bold">{item.durood_type}</td>
                            <td className="py-2.5 px-3 text-right font-bold font-mono text-emerald-700">{item.quantity?.toLocaleString()}</td>
                            <td className="py-2.5 px-3 font-urdu">{item.city}, {item.country}</td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="inline-flex gap-1.5">
                                <button
                                  onClick={() => setEditingEntry(item)}
                                  className="p-1 rounded bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                                  title="Edit entry"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEntry(item.id)}
                                  className="p-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 cursor-pointer"
                                  title="Delete entry"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit entry dialog / modal */}
                {editingEntry && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 relative shadow-2xl">
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        ✕
                      </button>
                      <h3 className="text-xl font-black font-urdu text-slate-800 border-b border-slate-100 pb-2 mb-4">
                        اندراج میں ترمیم کریں (Edit Submission)
                      </h3>

                      <form onSubmit={handleUpdateEntry} className="space-y-4">
                        <div>
                          <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Full Name</label>
                          <input
                            type="text"
                            required
                            value={editingEntry.full_name}
                            onChange={e => setEditingEntry({...editingEntry, full_name: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Mobile Number</label>
                          <input
                            type="tel"
                            required
                            value={editingEntry.mobile || ''}
                            onChange={e => setEditingEntry({...editingEntry, mobile: e.target.value})}
                            className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Durood Type</label>
                            <select
                              value={editingEntry.durood_type}
                              onChange={e => setEditingEntry({...editingEntry, durood_type: e.target.value})}
                              className="w-full px-2 py-2 border border-slate-200 rounded-xl text-sm font-urdu"
                            >
                              {DUROOD_OPTIONS.map(opt => (
                                <option key={opt.id} value={opt.ur}>{opt.ur}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-1">Quantity</label>
                            <input
                              type="number"
                              required
                              value={editingEntry.quantity}
                              onChange={e => setEditingEntry({...editingEntry, quantity: Number(e.target.value)})}
                              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-mono"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <button
                            type="button"
                            onClick={() => setEditingEntry(null)}
                            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-sm font-bold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isSavingEdit}
                            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-950 text-white rounded-xl text-sm font-bold cursor-pointer"
                          >
                            {isSavingEdit ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>
        )}

      {/* HADITH & DUROOD READER MODAL */}
      <DuroodHadithsModal
        lang={lang}
        isOpen={isHadithModalOpen}
        onClose={() => setIsHadithModalOpen(false)}
        onQuickSubmitDurood={handleQuickSubmitDuroodFromModal}
      />

      </div>
    </div>
  );
}
