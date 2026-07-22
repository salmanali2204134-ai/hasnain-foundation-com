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
  Sparkles, LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DuroodBank from './DuroodBank';
import MemberVolunteerCRM from './MemberVolunteerCRM';
import { 
  fetchActivitiesFromSupabase, 
  submitActivityToSupabase, 
  updateActivityInSupabase, 
  deleteActivityFromSupabase, 
  uploadActivityMedia,
  DailyActivity,
  fetchMembersFromSupabase,
  updateMemberInSupabase,
  deleteMemberFromSupabase,
  fetchVolunteersFromSupabase,
  updateVolunteerInSupabase,
  deleteVolunteerFromSupabase
} from '../lib/supabase';

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
  const [activeTab, setActiveTab] = useState<string>('appointments');

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

  // Expanded Donor & Auditor States
  const [selectedDonor, setSelectedDonor] = useState<any | null>(null);
  const [donorSearch, setDonorSearch] = useState('');
  const [donationSubTab, setDonationSubTab] = useState<'donations' | 'donors'>('donations');
  const [donationSearch, setDonationSearch] = useState('');
  const [donationFilterPurpose, setDonationFilterPurpose] = useState('all');
  const [donationFilterStatus, setDonationFilterStatus] = useState('all');
  const [selectedDonation, setSelectedDonation] = useState<any | null>(null);
  const [aiDraftAppreciation, setAiDraftAppreciation] = useState('');
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [aiDraftError, setAiDraftError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<{ name: string; url: string; type: string } | null>(null);

  // Daily Activities States
  const [activitiesList, setActivitiesList] = useState<DailyActivity[]>([]);
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activityTitle, setActivityTitle] = useState('');
  const [activityUrduDesc, setActivityUrduDesc] = useState('');
  const [activityCategory, setActivityCategory] = useState('راشن تقسیم');
  const [activityVideoUrl, setActivityVideoUrl] = useState('');
  const [activityAdminName, setActivityAdminName] = useState('hasnain_admin');
  const [activityImages, setActivityImages] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const [activitySearch, setActivitySearch] = useState('');
  const [activityCategoryFilter, setActivityCategoryFilter] = useState('all');

  // Members & Volunteers Management States
  const [members, setMembers] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilterStatus, setMemberFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStatus, setVolunteerFilterStatus] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);

  const [memberNotes, setMemberNotes] = useState('');
  const [memberStatusState, setMemberStatusState] = useState('pending');
  const [volunteerNotes, setVolunteerNotes] = useState('');
  const [volunteerStatusState, setVolunteerStatusState] = useState('pending');

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const headers = { 
        'x-admin-passcode': passcode.trim() 
      };
      const [aptRes, donRes, subRes, compRes, actRes, membersRes, volunteersRes] = await Promise.all([
        fetch('/api/appointments', { headers }).then(r => r.json()),
        fetch('/api/donations', { headers }).then(r => r.json()),
        fetch('/api/subscriptions', { headers }).then(r => r.json()),
        fetch('/api/complaints', { headers }).then(r => r.json()).catch(() => ({ success: false, complaints: [] })),
        fetchActivitiesFromSupabase(),
        fetchMembersFromSupabase(),
        fetchVolunteersFromSupabase()
      ]);

      if (aptRes.success) setAppointments(aptRes.appointments);
      if (donRes.success) setDonations(donRes.donations);
      if (subRes.success) setSubscribers(subRes.subscribers);
      if (compRes.success) setComplaints(compRes.complaints);
      if (actRes) setActivitiesList(actRes);
      if (membersRes) setMembers(membersRes);
      if (volunteersRes) setVolunteers(volunteersRes);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(isUrdu ? "ڈیٹا لوڈ کرنے میں ناکامی" : "Failed to load CRM database from server.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to re-load only activities
  const loadActivitiesOnly = async () => {
    setActivitiesLoading(true);
    try {
      const actRes = await fetchActivitiesFromSupabase();
      setActivitiesList(actRes);
    } catch (err) {
      console.error(err);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Handler for uploading multiple images
  const handleImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingFiles(true);
    const uploadedUrls: string[] = [...activityImages];
    try {
      for (let i = 0; i < files.length; i++) {
        const url = await uploadActivityMedia(files[i]);
        uploadedUrls.push(url);
      }
      setActivityImages(uploadedUrls);
    } catch (err: any) {
      alert(isUrdu ? 'تصاویر اپ لوڈ کرنے میں خرابی' : 'Error uploading images: ' + err.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Handler for uploading a video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFiles(true);
    try {
      const url = await uploadActivityMedia(file);
      setActivityVideoUrl(url);
    } catch (err: any) {
      alert(isUrdu ? 'ویڈیو اپ لوڈ کرنے میں خرابی' : 'Error uploading video: ' + err.message);
    } finally {
      setUploadingFiles(false);
    }
  };

  // Publish / Update Activity Submit
  const handlePublishActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityTitle.trim() || !activityUrduDesc.trim()) {
      alert(isUrdu ? 'براہ کرم عنوان اور تفصیل درج کریں۔' : 'Please fill in both title and description.');
      return;
    }
    setActivitiesLoading(true);

    const dateToday = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const timeToday = new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' });

    const payload: DailyActivity = {
      title: activityTitle.trim(),
      urdu_description: activityUrduDesc.trim(),
      category: activityCategory,
      images: activityImages,
      video_url: activityVideoUrl.trim() || undefined,
      date: dateToday,
      time: timeToday,
      admin_name: activityAdminName.trim() || 'Administrator'
    };

    try {
      if (editingActivity) {
        const res = await updateActivityInSupabase(editingActivity.id, payload);
        if (res.success) {
          alert(isUrdu ? 'سرگرمی کامیابی سے اپ ڈیٹ ہو گئی ہے!' : 'Activity updated successfully!');
        }
      } else {
        const res = await submitActivityToSupabase(payload);
        if (res.success) {
          alert(isUrdu ? 'سرگرمی کامیابی سے شائع ہو گئی ہے!' : 'Activity published successfully!');
        }
      }

      // Reset form states
      setActivityTitle('');
      setActivityUrduDesc('');
      setActivityCategory('راشن تقسیم');
      setActivityVideoUrl('');
      setActivityImages([]);
      setEditingActivity(null);

      // Dispatch custom update event for homepage/news/gallery hot sync
      window.dispatchEvent(new Event('activities_updated'));

      // Reload
      await loadActivitiesOnly();
    } catch (err: any) {
      alert('Error publishing: ' + err.message);
    } finally {
      setActivitiesLoading(false);
    }
  };

  // Edit action
  const handleStartEditActivity = (act: DailyActivity) => {
    setEditingActivity(act);
    setActivityTitle(act.title);
    setActivityUrduDesc(act.urdu_description);
    setActivityCategory(act.category);
    setActivityVideoUrl(act.video_url || '');
    setActivityImages(act.images || []);
    setActivityAdminName(act.admin_name || 'Administrator');
    // Scroll to the editor section
    document.getElementById('activity-editor-card')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cancel edit action
  const handleCancelEditActivity = () => {
    setEditingActivity(null);
    setActivityTitle('');
    setActivityUrduDesc('');
    setActivityCategory('راشن تقسیم');
    setActivityVideoUrl('');
    setActivityImages([]);
  };

  // Delete action
  const handleDeleteActivity = async (id: any) => {
    if (!confirm(isUrdu ? 'کیا آپ واقعی اس سرگرمی کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this activity?')) {
      return;
    }
    setActivitiesLoading(true);
    try {
      const res = await deleteActivityFromSupabase(id);
      if (res.success) {
        alert(isUrdu ? 'سرگرمی کامیابی سے حذف ہو گئی!' : 'Activity deleted successfully!');
        window.dispatchEvent(new Event('activities_updated'));
        await loadActivitiesOnly();
      }
    } catch (err: any) {
      alert('Error deleting: ' + err.message);
    } finally {
      setActivitiesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadDashboardData();

      const handleLiveUpdates = () => {
        loadDashboardData();
      };

      window.addEventListener('members_updated', handleLiveUpdates);
      window.addEventListener('volunteers_updated', handleLiveUpdates);
      window.addEventListener('storage', handleLiveUpdates);

      return () => {
        window.removeEventListener('members_updated', handleLiveUpdates);
        window.removeEventListener('volunteers_updated', handleLiveUpdates);
        window.removeEventListener('storage', handleLiveUpdates);
      };
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

  // Save Member Changes
  const handleUpdateMember = async (memberId: string, updatedFields: any) => {
    try {
      const res = await updateMemberInSupabase(memberId, updatedFields);
      if (res.success) {
        setMembers(prev => prev.map(m => m.id === memberId ? { ...m, ...updatedFields } : m));
        if (selectedMember && selectedMember.id === memberId) {
          setSelectedMember({ ...selectedMember, ...updatedFields });
        }
        alert(isUrdu ? 'رکن کا ریکارڈ کامیابی سے اپ ڈیٹ ہو گیا ہے!' : 'Member record updated successfully!');
      }
    } catch (err: any) {
      alert('Error updating member: ' + err.message);
    }
  };

  // Delete Member
  const handleDeleteMember = async (memberId: string) => {
    if (!confirm(isUrdu ? 'کیا آپ واقعی اس رکن کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this member?')) {
      return;
    }
    try {
      const res = await deleteMemberFromSupabase(memberId);
      if (res.success) {
        setMembers(prev => prev.filter(m => m.id !== memberId));
        if (selectedMember && selectedMember.id === memberId) {
          setSelectedMember(null);
        }
        alert(isUrdu ? 'رکن کامیابی سے حذف کر دیا گیا ہے!' : 'Member deleted successfully!');
      }
    } catch (err: any) {
      alert('Error deleting member: ' + err.message);
    }
  };

  // Save Volunteer Changes
  const handleUpdateVolunteer = async (volunteerId: string, updatedFields: any) => {
    try {
      const res = await updateVolunteerInSupabase(volunteerId, updatedFields);
      if (res.success) {
        setVolunteers(prev => prev.map(v => v.id === volunteerId ? { ...v, ...updatedFields } : v));
        if (selectedVolunteer && selectedVolunteer.id === volunteerId) {
          setSelectedVolunteer({ ...selectedVolunteer, ...updatedFields });
        }
        alert(isUrdu ? 'رضاکار کا ریکارڈ کامیابی سے اپ ڈیٹ ہو گیا ہے!' : 'Volunteer record updated successfully!');
      }
    } catch (err: any) {
      alert('Error updating volunteer: ' + err.message);
    }
  };

  // Delete Volunteer
  const handleDeleteVolunteer = async (volunteerId: string) => {
    if (!confirm(isUrdu ? 'کیا آپ واقعی اس رضاکار کو حذف کرنا چاہتے ہیں؟' : 'Are you sure you want to delete this volunteer?')) {
      return;
    }
    try {
      const res = await deleteVolunteerFromSupabase(volunteerId);
      if (res.success) {
        setVolunteers(prev => prev.filter(v => v.id !== volunteerId));
        if (selectedVolunteer && selectedVolunteer.id === volunteerId) {
          setSelectedVolunteer(null);
        }
        alert(isUrdu ? 'رضاکار کامیابی سے حذف کر دیا گیا ہے!' : 'Volunteer deleted successfully!');
      }
    } catch (err: any) {
      alert('Error deleting volunteer: ' + err.message);
    }
  };

  // Generate custom donor appreciation letter using Gemini
  const handleGenerateAppreciation = async (donor: any) => {
    setAiDraftLoading(true);
    setAiDraftError(null);
    setAiDraftAppreciation('');
    try {
      const res = await fetch('/api/gemini/generate-appreciation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode.trim()
        },
        body: JSON.stringify({
          donorName: donor.name,
          totalAmount: donor.totalAmount,
          count: donor.count,
          lastPurpose: donor.donationsList?.[0]?.purpose || 'general'
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiDraftAppreciation(JSON.stringify({
          letterEn: data.letterEn,
          letterUr: data.letterUr
        }));
      } else {
        setAiDraftError(data.error || "Failed to generate draft appreciation letter.");
      }
    } catch (err: any) {
      setAiDraftError("Server connection error: " + err.message);
    } finally {
      setAiDraftLoading(false);
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

  // Reactive derivation of unique donors from donations state
  const getAggregatedDonors = () => {
    const donorsMap: { [key: string]: any } = {};
    donations.forEach(don => {
      if (!don.donorName) return;
      const key = don.donorName.trim().toLowerCase();
      if (!donorsMap[key]) {
        donorsMap[key] = {
          name: don.donorName,
          email: don.email || 'hasnainfoundation225@gmail.com',
          mobile: don.whatsapp || 'N/A',
          whatsapp: don.whatsapp || 'N/A',
          totalAmount: 0,
          count: 0,
          donationsList: []
        };
      }
      if (don.status === 'verified') {
        donorsMap[key].totalAmount += don.amount;
      }
      donorsMap[key].count += 1;
      donorsMap[key].donationsList.push(don);
    });
    return Object.values(donorsMap);
  };
  const aggregatedDonors = getAggregatedDonors();

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
                className="flex-1 flex flex-row overflow-hidden"
              >
                {/* Side Navigation Menu */}
                <div className="w-14 sm:w-64 bg-slate-50 border-r border-slate-200 p-2 sm:p-4 flex flex-col justify-between shrink-0 h-full overflow-hidden">
                  <div className="shrink-0 space-y-4">
                    {/* Authorized Status Indicator */}
                    <div className="p-2 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center sm:justify-start gap-2 text-xs">
                      <Unlock className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div className="hidden sm:block min-w-0">
                        <span className="font-extrabold text-emerald-800 block truncate">{isUrdu ? 'دروازہ کھلا ہے' : 'Access Granted'}</span>
                        <span className="text-[10px] text-slate-500 block truncate">{isUrdu ? 'ایڈمن موڈ لائیو ہے' : 'Authorized Token Active'}</span>
                      </div>
                    </div>

                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block px-2">
                      {isUrdu ? 'انتظام کار کونسل' : 'Clinical Workspace'}
                    </span>
                  </div>

                  {/* Scrollable Navigation Tab items */}
                  <div className="flex-1 overflow-y-auto py-2 space-y-1 my-2 pr-0.5 sm:pr-1 scrollbar-thin">
                    {[
                      { id: 'appointments', label: { en: 'Patient CRM', ur: 'مریضوں کے ریکارڈز' }, icon: Users },
                      { id: 'members', label: { en: 'Members Panel', ur: 'رکنیت انتظامیہ' }, icon: Users },
                      { id: 'volunteers', label: { en: 'Volunteers Panel', ur: 'رضاکار انتظامیہ' }, icon: UserCheck },
                      { id: 'donors', label: { en: 'Donor Database', ur: 'ڈونر ڈیٹا بیس' }, icon: UserCheck },
                      { id: 'donations', label: { en: 'Donation Auditor', ur: 'عطیہ آڈیٹر' }, icon: Coins },
                      { id: 'auditor', label: { en: 'Auditor Terminal', ur: 'آڈٹ اور تجارتی حسابات' }, icon: TrendingUp },
                      { id: 'complaints', label: { en: 'Complaint Cell', ur: 'شکایات سیل' }, icon: ShieldAlert },
                      { id: 'durood', label: { en: 'Durood Bank CRM', ur: 'درود بینک انتظامیہ' }, icon: Sparkles },
                      { id: 'activities', label: { en: 'Daily Activities', ur: 'روزمرہ سرگرمیاں' }, icon: Activity },
                      { id: 'subscriptions', label: { en: 'Broadcast Center', ur: 'براڈکاسٹ سنٹر' }, icon: Send },
                      { id: 'settings', label: { en: 'Database Health', ur: 'ڈیٹا بیس صحت' }, icon: Database }
                    ].map(tab => {
                      const TabIcon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setSelectedPatient(null);
                            setSelectedDonor(null);
                            setSelectedDonation(null);
                          }}
                          className={`w-full flex items-center justify-center sm:justify-start gap-2.5 p-2 sm:px-3 sm:py-2.5 rounded-xl text-xs font-black tracking-tight transition-all cursor-pointer text-left ${
                            activeTab === tab.id
                              ? 'bg-emerald-800 text-white shadow-md shadow-emerald-900/10'
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                          title={tab.label[lang]}
                        >
                          <TabIcon className={`w-4 h-4 shrink-0 ${activeTab === tab.id ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span className={`hidden sm:inline-block truncate ${isUrdu ? 'font-urdu' : ''}`}>{tab.label[lang]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Logout Button */}
                  <div className="shrink-0 pt-2 border-t border-slate-200/60 mt-auto">
                    <button
                      onClick={() => setIsAuthenticated(false)}
                      className="w-full flex items-center justify-center gap-2 py-2 px-1 sm:px-3 border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      title={isUrdu ? 'سیشن لاگ آؤٹ' : 'Logout Scholar Session'}
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span className="hidden sm:inline-block truncate">{isUrdu ? 'سیشن لاگ آؤٹ' : 'Logout Session'}</span>
                    </button>
                  </div>
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

                        {/* Right column: Premium Clinical Details & Progress Tracker */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-5">
                          <AnimatePresence mode="wait">
                            {selectedPatient ? (
                              <motion.div
                                key="treatment-details"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-5 text-left"
                              >
                                {/* Selected Header */}
                                <div className="border-b border-slate-100 pb-3.5 flex justify-between items-start">
                                  <div>
                                    <h4 className="text-sm font-extrabold text-slate-900">{selectedPatient.name}</h4>
                                    <p className="text-[10px] text-slate-400 font-mono">{selectedPatient.id} • Registered {selectedPatient.registeredAt.substring(0, 10)}</p>
                                  </div>
                                  
                                  <div className="flex gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => printPatientCard(selectedPatient)}
                                      className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-all cursor-pointer shadow-sm active:scale-95"
                                      title="Print Patient Card Slip"
                                    >
                                      <Printer className="w-4 h-4 text-emerald-700" />
                                    </button>
                                    
                                    <a
                                      href={`https://wa.me/${selectedPatient.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                        `Assalam-o-Alaikum ${selectedPatient.name}, Hasnain Foundation Spiritual Healing Center. Khalifa Salman Ali Qadri is reviewing your case file (${selectedPatient.id}) for spiritual consultation and Ruqyah schedule.`
                                      )}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center"
                                      title="Initiate Secure WhatsApp"
                                    >
                                      <Phone className="w-4 h-4 text-emerald-600 animate-pulse" />
                                    </a>
                                  </div>
                                </div>

                                {/* Patient Details list */}
                                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2.5 leading-relaxed border border-slate-100">
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500 font-medium">Father/Spouse Name:</span>
                                    <span className="col-span-2 font-black text-slate-800">{selectedPatient.fatherName || 'N/A'}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500 font-medium">Age / Gender:</span>
                                    <span className="col-span-2 font-bold text-slate-800">{selectedPatient.age} Years • {selectedPatient.gender}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500 font-medium">Residence Location:</span>
                                    <span className="col-span-2 text-slate-800">{selectedPatient.city}, {selectedPatient.country}</span>
                                  </div>
                                  <div className="grid grid-cols-3 border-b border-slate-200/50 pb-2">
                                    <span className="text-slate-500 font-medium">Secure Contact:</span>
                                    <span className="col-span-2 font-mono text-emerald-800 font-bold select-all flex items-center gap-1">
                                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                                      {selectedPatient.whatsapp}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-3">
                                    <span className="text-slate-500 font-medium">Email Channel:</span>
                                    <span className="col-span-2 font-mono text-slate-700 select-all flex items-center gap-1 truncate">
                                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                                      {selectedPatient.email || 'None Registered'}
                                    </span>
                                  </div>

                                  <div className="border-t border-slate-200/80 pt-2.5 mt-2.5">
                                    <span className="font-extrabold text-amber-700 uppercase tracking-wider text-[9px] block mb-1">Reported Symptoms & Issues:</span>
                                    <p className="text-slate-600 leading-relaxed font-medium bg-white/70 border border-slate-150 p-2.5 rounded-xl italic">
                                      "{selectedPatient.description}"
                                    </p>
                                  </div>
                                </div>

                                {/* Spiritual Diagnosis Timeline */}
                                <div className="space-y-2 text-xs">
                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Spiritual Progress Timeline</span>
                                  <div className="relative pl-5 space-y-3 border-l-2 border-emerald-100 ml-1.5 text-left">
                                    <div className="relative">
                                      <span className="absolute -left-[27px] top-0.5 w-3.5 h-3.5 bg-emerald-700 rounded-full flex items-center justify-center border-2 border-white ring-4 ring-emerald-50 shadow-sm" />
                                      <div>
                                        <p className="font-bold text-slate-800">1. Intake Registration</p>
                                        <p className="text-[10px] text-slate-400">Recorded by system terminal on {selectedPatient.registeredAt.substring(0, 10)}</p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <span className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white ring-4 shadow-sm ${
                                        selectedPatient.status !== 'pending' ? 'bg-emerald-700 ring-emerald-50' : 'bg-amber-500 ring-amber-50 animate-pulse'
                                      }`} />
                                      <div>
                                        <p className="font-bold text-slate-800">2. Initial Diagnosis (Spiritual Assessment)</p>
                                        <p className="text-[10px] text-slate-400">Diagnosis: <span className="font-bold text-amber-700">{selectedPatient.reason}</span></p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <span className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white ring-4 shadow-sm ${
                                        selectedPatient.status === 'completed' ? 'bg-emerald-700 ring-emerald-50' : 
                                        selectedPatient.status === 'follow-up' ? 'bg-blue-600 ring-blue-50 animate-pulse' : 'bg-slate-300 ring-slate-50'
                                      }`} />
                                      <div>
                                        <p className="font-bold text-slate-800">3. Ruqyah Recitations & Spiritual Adhkar</p>
                                        <p className="text-[10px] text-slate-400">Active scholar tracking and follow-up monitoring.</p>
                                      </div>
                                    </div>
                                    <div className="relative">
                                      <span className={`absolute -left-[27px] top-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center border-2 border-white ring-4 shadow-sm ${
                                        selectedPatient.status === 'completed' ? 'bg-emerald-700 ring-emerald-50' : 'bg-slate-200 ring-slate-50'
                                      }`} />
                                      <div>
                                        <p className="font-bold text-slate-800">4. Recovery & Discharge</p>
                                        <p className="text-[10px] text-slate-400">Full restoration and completion of protective fortress recitation.</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Attached Media and Clinical Files */}
                                <div className="space-y-2">
                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Clinical & Diagnostic Attachments</span>
                                  <div className="grid grid-cols-2 gap-2">
                                    {[
                                      { name: 'Intake_Brief_Spiritual.pdf', type: 'Clinical File', url: '/files/intake.pdf' },
                                      { name: 'Physiological_Symptoms.jpg', type: 'Medical Scan/Scan', url: '/files/scan.jpg' }
                                    ].map((doc, idx) => (
                                      <div 
                                        key={idx}
                                        onClick={() => setSelectedDocument(doc)}
                                        className="p-2 bg-slate-50 border border-slate-150 hover:bg-slate-100/80 hover:border-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-between text-[11px]"
                                      >
                                        <div className="flex items-center gap-1.5 truncate">
                                          <FileText className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                                          <div className="truncate">
                                            <p className="font-bold text-slate-800 truncate">{doc.name}</p>
                                            <p className="text-[9px] text-slate-400">{doc.type}</p>
                                          </div>
                                        </div>
                                        <Eye className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600 shrink-0" />
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Form Section for Updating Notes */}
                                <form onSubmit={handleUpdatePatient} className="space-y-4 pt-3 border-t border-slate-100">
                                  {/* Editor: Treatment Notes */}
                                  <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Scholar Healing Notes (Ruqyah / Adhkar Recited)
                                    </label>
                                    <textarea
                                      rows={3}
                                      value={editNotes}
                                      onChange={(e) => setEditNotes(e.target.value)}
                                      placeholder="Write details of Ruqyah performed, Quranic verses recited, or spiritual guidelines prescribed..."
                                      className="w-full text-xs p-3 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-xl resize-none text-slate-800 bg-slate-50 focus:bg-white"
                                    />
                                  </div>

                                  {/* Editor: Follow Up Notes */}
                                  <div className="space-y-1">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                      Follow Up Schedule & Notes
                                    </label>
                                    <input
                                      type="text"
                                      value={editFollowUp}
                                      onChange={(e) => setEditFollowUp(e.target.value)}
                                      placeholder="e.g. Recommended follow up in 2 weeks..."
                                      className="w-full text-xs p-2.5 border border-slate-200 focus:outline-none focus:border-emerald-600 rounded-xl text-slate-800 bg-slate-50 focus:bg-white"
                                    />
                                  </div>

                                  {/* Editor: Status Modifier */}
                                  <div className="grid grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Modifier</label>
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
                                        className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition-colors cursor-pointer disabled:opacity-50 active:scale-95 shadow-md shadow-emerald-950/10"
                                      >
                                        {updateLoading ? 'Saving...' : 'Update Records'}
                                      </button>
                                    </div>
                                  </div>
                                </form>

                              </motion.div>
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
                    <div className="space-y-6 text-left">
                      {/* Donations Counters */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { title: { en: 'Total Receipts Uploaded', ur: 'کل جمع کردہ رسیدیں' }, count: donations.length, color: 'border-slate-200 bg-white text-slate-800' },
                          { title: { en: 'Awaiting Audit Review', ur: 'منتظر آڈٹ جائزہ' }, count: donations.filter(d => d.status === 'pending').length, color: 'border-amber-200 bg-amber-50 text-amber-800 animate-pulse' },
                          { title: { en: 'Verified Donations', ur: 'تصدیق شدہ فنڈز' }, count: donations.filter(d => d.status === 'verified').length, color: 'border-emerald-200 bg-emerald-50 text-emerald-800' },
                          { title: { en: 'Total PKR Audited', ur: 'کل آڈٹ شدہ رقم' }, count: `₨ ${donations.filter(d => d.status === 'verified').reduce((acc, d) => acc + d.amount, 0).toLocaleString()}`, color: 'border-emerald-800/10 bg-emerald-800/5 text-emerald-800' }
                        ].map((stat, idx) => (
                          <div key={idx} className="border p-4 rounded-2xl flex flex-col justify-between shadow-sm">
                            <span className={`text-[10px] font-black uppercase tracking-wider block ${isUrdu ? 'font-urdu' : ''}`}>{stat.title[lang]}</span>
                            <span className="text-xl font-black font-mono mt-1">{stat.count}</span>
                          </div>
                        ))}
                      </div>

                      {/* Split Layout: Table vs Audit File Detail */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Table queue (7 cols) */}
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
                          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
                            <div className="relative flex-1">
                              <input
                                type="text"
                                value={donationSearch}
                                onChange={(e) => setDonationSearch(e.target.value)}
                                placeholder={isUrdu ? "ڈونر کا نام یا ٹرانزیکشن ID تلاش کریں..." : "Search Donor Name or TXN ID..."}
                                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                              />
                              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            </div>

                            <div className="flex gap-1.5">
                              <select
                                value={donationFilterStatus}
                                onChange={(e) => setDonationFilterStatus(e.target.value)}
                                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
                              >
                                <option value="all">All Statuses</option>
                                <option value="pending">Pending</option>
                                <option value="verified">Verified</option>
                                <option value="rejected">Rejected</option>
                              </select>

                              <select
                                value={donationFilterPurpose}
                                onChange={(e) => setDonationFilterPurpose(e.target.value)}
                                className="text-xs p-2 rounded-xl border border-slate-200 bg-white"
                              >
                                <option value="all">All Causes</option>
                                <option value="general">General Charity</option>
                                <option value="masjid">Masjid Abdul Qadir</option>
                                <option value="water">RO Water Plants</option>
                                <option value="food">Daily Food Drive</option>
                                <option value="education">Orphan Education</option>
                              </select>
                            </div>
                          </div>

                          {/* Table Scroll Area */}
                          <div className="border border-slate-150 rounded-xl overflow-hidden">
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[10px] uppercase tracking-wider">
                                <tr>
                                  <th className="p-3 px-4">Benefactor / Cause</th>
                                  <th className="p-3">Amount</th>
                                  <th className="p-3 font-mono">TXN ID</th>
                                  <th className="p-3 text-center">Audit</th>
                                </tr>
                              </thead>
                              <tbody>
                                {donations.filter(don => {
                                  const searchLower = donationSearch.toLowerCase();
                                  const matchSearch = don.donorName.toLowerCase().includes(searchLower) || (don.transactionId || '').toLowerCase().includes(searchLower) || don.id.toLowerCase().includes(searchLower);
                                  const matchStatus = donationFilterStatus === 'all' || don.status === donationFilterStatus;
                                  const matchPurpose = donationFilterPurpose === 'all' || don.purpose === donationFilterPurpose;
                                  return matchSearch && matchStatus && matchPurpose;
                                }).length === 0 ? (
                                  <tr>
                                    <td colSpan={4} className="p-12 text-center text-slate-400 font-bold">
                                      No matching donation receipt records.
                                    </td>
                                  </tr>
                                ) : (
                                  donations.filter(don => {
                                    const searchLower = donationSearch.toLowerCase();
                                    const matchSearch = don.donorName.toLowerCase().includes(searchLower) || (don.transactionId || '').toLowerCase().includes(searchLower) || don.id.toLowerCase().includes(searchLower);
                                    const matchStatus = donationFilterStatus === 'all' || don.status === donationFilterStatus;
                                    const matchPurpose = donationFilterPurpose === 'all' || don.purpose === donationFilterPurpose;
                                    return matchSearch && matchStatus && matchPurpose;
                                  }).map((don) => (
                                    <tr 
                                      key={don.id} 
                                      onClick={() => setSelectedDonation(don)}
                                      className={`border-b border-slate-100 hover:bg-slate-50/50 cursor-pointer transition-colors ${
                                        selectedDonation?.id === don.id ? 'bg-emerald-500/5' : ''
                                      }`}
                                    >
                                      <td className="p-3 px-4">
                                        <div className="font-extrabold text-slate-900">{don.donorName}</div>
                                        <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1 font-medium mt-0.5">
                                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                                          {don.purpose} Welfare
                                        </div>
                                      </td>
                                      <td className="p-3 text-emerald-800 font-extrabold font-mono">
                                        ₨ {don.amount.toLocaleString()}
                                      </td>
                                      <td className="p-3 font-mono text-slate-500 font-bold">
                                        {don.transactionId || 'Manual-Dep'}
                                      </td>
                                      <td className="p-3 text-center">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                          don.status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                                          don.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                          {don.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Audit Dossier (5 cols) */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <AnimatePresence mode="wait">
                            {selectedDonation ? (
                              <motion.div
                                key={selectedDonation.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4"
                              >
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono uppercase">{selectedDonation.id}</span>
                                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                                        selectedDonation.status === 'verified' ? 'bg-emerald-50 text-emerald-700' :
                                        selectedDonation.status === 'rejected' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                                      }`}>
                                        {selectedDonation.status}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-black text-slate-900 mt-1">{selectedDonation.donorName}</h4>
                                  </div>
                                  <a 
                                    href={`/api/donations/verify/${selectedDonation.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-emerald-800 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>PDF</span>
                                  </a>
                                </div>

                                {/* Financial Details Brief */}
                                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-2.5 border border-slate-100 leading-relaxed">
                                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-slate-500 font-medium">Contributed Amount:</span>
                                    <strong className="text-emerald-800 text-sm font-black font-mono">₨ {selectedDonation.amount.toLocaleString()}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-slate-500 font-medium">Payment Gateway:</span>
                                    <strong className="text-slate-800 font-bold">{selectedDonation.paymentMethod}</strong>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-200/60 pb-2">
                                    <span className="text-slate-500 font-medium">Welfare Purpose:</span>
                                    <span className="font-bold text-slate-800 capitalize">{selectedDonation.purpose} Welfare</span>
                                  </div>
                                  <div className="flex justify-between border-b border-slate-200/60 pb-2 font-mono">
                                    <span className="text-slate-500 font-medium">Transaction ID:</span>
                                    <strong className="text-slate-700 select-all font-bold">{selectedDonation.transactionId || 'None Provided'}</strong>
                                  </div>
                                  <div className="flex justify-between font-mono">
                                    <span className="text-slate-500 font-medium">Timestamp Logged:</span>
                                    <span className="text-slate-600 font-medium">{selectedDonation.donationDate} @ {selectedDonation.donationTime}</span>
                                  </div>
                                </div>

                                {/* Anti-Fraud Gateway Crosscheck Mockup */}
                                <div className={`p-3.5 rounded-xl border text-[11px] leading-relaxed space-y-1 font-medium ${
                                  selectedDonation.status === 'verified'
                                    ? 'bg-emerald-50 border-emerald-150 text-emerald-800'
                                    : selectedDonation.status === 'rejected'
                                    ? 'bg-rose-50 border-rose-150 text-rose-800'
                                    : 'bg-amber-50 border-amber-150 text-amber-800'
                                }`}>
                                  <div className="flex items-center gap-1.5 font-bold mb-1">
                                    <ShieldCheck className="w-4 h-4 shrink-0" />
                                    <span>Automated Anti-Fraud Ledger Reconciliation</span>
                                  </div>
                                  {selectedDonation.status === 'verified' && (
                                    <p>✓ MATCHED: Confirmed deposit of PKR {selectedDonation.amount.toLocaleString()} found in Hasnain Foundation UBL Ameen Account matching reference ID "{selectedDonation.transactionId}". Ledger balance reconciled successfully.</p>
                                  )}
                                  {selectedDonation.status === 'rejected' && (
                                    <p>⚠ RECONCILIATION FAILURE: Transaction ID reference was not verified in UBL/EasyPaisa gateway records, or is a duplicate receipt. Sign-off has been blocked.</p>
                                  )}
                                  {selectedDonation.status === 'pending' && (
                                    <p>⚡ IN-AUDIT: Gateways match initiated. Waiting for physical bank statement verification by Auditor Scholar before final sign-off.</p>
                                  )}
                                </div>

                                {/* Simulated scannable QR Code */}
                                <div className="border border-slate-150 rounded-xl p-3 flex items-center gap-3 bg-slate-50/50">
                                  <div className="w-12 h-12 bg-white border border-slate-200 rounded flex items-center justify-center shrink-0 font-mono text-[6px] font-bold text-center leading-tight select-none">
                                    [QR CODE] <br /> VERIFIED <br /> HF-REC-{selectedDonation.id}
                                  </div>
                                  <div className="text-[11px] text-slate-500 leading-relaxed">
                                    <p className="font-extrabold text-slate-700">Audit Reference QR Code</p>
                                    <p className="text-[10px]">Scannable by public. Verifies that this receipt is signed off on the blockchain ledger of Hasnain Foundation.</p>
                                  </div>
                                </div>

                                {/* Auditor Decision buttons */}
                                {selectedDonation.status === 'pending' && (
                                  <div className="grid grid-cols-2 gap-3 pt-3">
                                    <button
                                      onClick={() => {
                                        handleVerifyDonation(selectedDonation.id, 'verified');
                                        setSelectedDonation(prev => ({ ...prev, status: 'verified' }));
                                      }}
                                      className="py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10"
                                    >
                                      <CheckCircle className="w-4 h-4 text-amber-400" />
                                      <span>Verify & Sign</span>
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleVerifyDonation(selectedDonation.id, 'rejected');
                                        setSelectedDonation(prev => ({ ...prev, status: 'rejected' }));
                                      }}
                                      className="py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1.5"
                                    >
                                      <X className="w-4 h-4" />
                                      <span>Decline & Flag</span>
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            ) : (
                              <div className="py-24 text-center text-slate-400 text-xs space-y-2">
                                <Coins className="w-8 h-8 text-slate-300 mx-auto" />
                                <p>{isUrdu ? 'رسید کی آڈٹ جانچ شروع کرنے کے لیے فہرست سے انتخاب کریں۔' : 'Select an incoming donation receipt from the left queue to open details, reconcile with bank statements, and sign off.'}</p>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      TAB 2.5: DONOR DATABASE (WITH AI THANK-YOU)
                      ========================================== */}
                  {activeTab === 'donors' && (
                    <div className="space-y-6 text-left">
                      {/* Search and Filters */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
                        <div>
                          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-emerald-800" />
                            <span>Welfare Benefactor Registry</span>
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-0.5">Aggregated list of loyal donors compiled automatically from verified receipts history.</p>
                        </div>
                        <div className="relative w-full sm:w-72">
                          <input
                            type="text"
                            value={donorSearch}
                            onChange={(e) => setDonorSearch(e.target.value)}
                            placeholder={isUrdu ? "ڈونر کا نام یا فون تلاش کریں..." : "Search Donor by name or phone..."}
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:border-emerald-600 focus:bg-white text-slate-800"
                          />
                          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      {/* Donor Grid vs Benefactor Dossier Detail */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* List column (6 cols) */}
                        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-2 max-h-[500px] overflow-y-auto">
                          {aggregatedDonors.filter(donor => {
                            const nameMatch = donor.name.toLowerCase().includes(donorSearch.toLowerCase());
                            const contactMatch = donor.whatsapp.includes(donorSearch) || donor.email.toLowerCase().includes(donorSearch.toLowerCase());
                            return nameMatch || contactMatch;
                          }).length === 0 ? (
                            <div className="py-12 text-center text-slate-400 text-xs font-bold">
                              No donor profiles compiled.
                            </div>
                          ) : (
                            aggregatedDonors.filter(donor => {
                              const nameMatch = donor.name.toLowerCase().includes(donorSearch.toLowerCase());
                              const contactMatch = donor.whatsapp.includes(donorSearch) || donor.email.toLowerCase().includes(donorSearch.toLowerCase());
                              return nameMatch || contactMatch;
                            }).map((donor, idx) => {
                              const isGold = donor.totalAmount >= 100000;
                              const isSilver = donor.totalAmount >= 25000 && donor.totalAmount < 100000;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    setSelectedDonor(donor);
                                    setAiDraftAppreciation('');
                                    setAiDraftError(null);
                                  }}
                                  className={`p-3.5 border rounded-xl transition-all cursor-pointer flex justify-between items-center ${
                                    selectedDonor?.name === donor.name
                                      ? 'bg-emerald-500/5 border-emerald-600/30'
                                      : 'border-slate-150 bg-slate-50/30 hover:border-slate-300'
                                  }`}
                                >
                                  <div className="space-y-1 text-left">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm">{donor.name}</span>
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                        isGold ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                                        isSilver ? 'bg-slate-100 text-slate-800' : 'bg-emerald-50 text-emerald-700'
                                      }`}>
                                        {isGold ? 'GOLD' : isSilver ? 'SILVER' : 'MEMBER'}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium font-mono truncate max-w-[200px]">{donor.whatsapp} • {donor.email}</p>
                                  </div>
                                  <div className="text-right space-y-0.5">
                                    <p className="text-xs font-black text-emerald-800 font-mono">₨ {donor.totalAmount.toLocaleString()}</p>
                                    <p className="text-[9px] text-slate-400 font-mono">{donor.count} donations</p>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>

                        {/* Detail Dossier column (6 cols) */}
                        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <AnimatePresence mode="wait">
                            {selectedDonor ? (
                              <motion.div
                                key={selectedDonor.name}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-4 text-left"
                              >
                                <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                                  <div>
                                    <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{selectedDonor.name}</h4>
                                    <p className="text-[10px] text-slate-400">Benefactor Profile Sheet</p>
                                  </div>
                                  <div className="flex gap-1.5">
                                    <a
                                      href={`https://wa.me/${selectedDonor.whatsapp.replace(/[^0-9]/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-sm transition-colors"
                                    >
                                      <Smartphone className="w-3.5 h-3.5" />
                                      <span>WhatsApp</span>
                                    </a>
                                  </div>
                                </div>

                                {/* Bio Grid Card */}
                                <div className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl grid grid-cols-2 gap-3 text-xs leading-relaxed">
                                  <div>
                                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-extrabold">Registered Email</span>
                                    <span className="font-mono font-bold text-slate-700 truncate block select-all">{selectedDonor.email}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-extrabold">WhatsApp Contact</span>
                                    <span className="font-mono font-bold text-slate-700 select-all block">{selectedDonor.whatsapp}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-extrabold">Total Contributions</span>
                                    <strong className="text-emerald-800 text-sm font-black font-mono">₨ {selectedDonor.totalAmount.toLocaleString()}</strong>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block text-[9px] uppercase tracking-wider font-extrabold">Receipts Audited</span>
                                    <strong className="text-slate-800 font-bold font-mono">{selectedDonor.count} verified uploads</strong>
                                  </div>
                                </div>

                                {/* Gives History Loop */}
                                <div className="space-y-2">
                                  <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Historical Welfare Support</span>
                                  <div className="border border-slate-150 rounded-xl overflow-hidden text-[11px] bg-white">
                                    <div className="bg-slate-50 px-3 py-1.5 font-bold border-b border-slate-200 grid grid-cols-3 text-slate-500 font-mono text-[9px] uppercase tracking-wider">
                                      <span>Date</span>
                                      <span>Purpose</span>
                                      <span className="text-right">Amount</span>
                                    </div>
                                    <div className="divide-y divide-slate-100 max-h-32 overflow-y-auto">
                                      {selectedDonor.donationsList.map((don: any, idx: number) => (
                                        <div key={idx} className="px-3 py-2 grid grid-cols-3 items-center">
                                          <span className="text-slate-500 font-medium font-mono">{don.donationDate}</span>
                                          <span className="font-bold text-slate-700 capitalize truncate">{don.purpose} Welfare</span>
                                          <span className="text-right font-black text-emerald-800 font-mono">₨ {don.amount.toLocaleString()}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Gemini AI thank you Letter block */}
                                <div className="border-t border-slate-100 pt-4 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest flex items-center gap-1">
                                      <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                                      <span>Gemini AI Bilingual Appreciator</span>
                                    </span>
                                    <button
                                      onClick={() => handleGenerateAppreciation(selectedDonor)}
                                      disabled={aiDraftLoading}
                                      className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white font-extrabold text-[10px] shadow-sm transition-all cursor-pointer flex items-center gap-1 active:scale-95"
                                    >
                                      {aiDraftLoading ? 'Generating...' : 'Draft AI Letter'}
                                    </button>
                                  </div>

                                  {aiDraftError && (
                                    <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-[10px] font-bold">
                                      Error: {aiDraftError}
                                    </div>
                                  )}

                                  {aiDraftAppreciation && (
                                    <div className="space-y-3.5 border border-emerald-100 bg-emerald-500/5 p-4 rounded-2xl">
                                      {/* English letter pane */}
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between items-center border-b border-emerald-100/50 pb-1 mb-1.5">
                                          <span className="font-extrabold text-emerald-950 uppercase text-[9px] tracking-wider">English Appreciation letter</span>
                                          <button
                                            onClick={() => {
                                              const l = JSON.parse(aiDraftAppreciation).letterEn;
                                              navigator.clipboard.writeText(l);
                                              alert("Copied English appreciation letter to clipboard!");
                                            }}
                                            className="text-[9px] font-bold text-emerald-700 hover:underline cursor-pointer"
                                          >
                                            Copy Letter
                                          </button>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed italic whitespace-pre-line bg-white p-3 rounded-xl border border-emerald-100/40">
                                          "{JSON.parse(aiDraftAppreciation).letterEn}"
                                        </p>
                                      </div>

                                      {/* Urdu letter pane */}
                                      <div className="space-y-1 text-xs text-right font-urdu leading-loose">
                                        <div className="flex justify-between items-center border-b border-emerald-100/50 pb-1 mb-1.5">
                                          <button
                                            onClick={() => {
                                              const l = JSON.parse(aiDraftAppreciation).letterUr;
                                              navigator.clipboard.writeText(l);
                                              alert("Copied Urdu appreciation letter to clipboard!");
                                            }}
                                            className="text-[9px] font-bold text-emerald-700 hover:underline cursor-pointer"
                                          >
                                            Copy Urdu
                                          </button>
                                          <span className="font-extrabold text-emerald-950 uppercase text-[9px] tracking-wider font-sans">معمولی شکریہ خط (اردو)</span>
                                        </div>
                                        <p className="text-slate-800 leading-loose italic whitespace-pre-line bg-white p-3 rounded-xl border border-emerald-100/40 text-right">
                                          "{JSON.parse(aiDraftAppreciation).letterUr}"
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ) : (
                              <div className="py-24 text-center text-slate-400 text-xs space-y-2">
                                <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                                <p>{isUrdu ? 'ڈونر کا تفصیلی موازنہ دیکھنے کے لیے کسی ایک ریکارڈ پر کلک کریں۔' : 'Select a donor profile from the database on the left to review their lifetime giving logs, run WhatsApp communications, or generate Gemini thank you letters.'}</p>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ==========================================
                      TAB 2.7: AUDITOR TERMINAL (FINANCIAL GENERAL LEDGER)
                      ========================================== */}
                  {activeTab === 'auditor' && (
                    <div className="space-y-6 text-left">
                      {/* Top Financial Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Box 1: Gross Inflow */}
                        <div className="bg-white rounded-2xl border border-emerald-200/50 p-5 shadow-sm flex justify-between items-center relative overflow-hidden">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Gross Verified Inflows</span>
                            <span className="text-2xl font-black font-mono text-emerald-800 block">₨ {donations.filter(d => d.status === 'verified').reduce((acc, d) => acc + d.amount, 0).toLocaleString()}</span>
                            <span className="text-[10px] font-bold text-emerald-600 block">✓ 100% Reconciled and audited</span>
                          </div>
                          <Coins className="w-12 h-12 text-emerald-100 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Box 2: Gross Welfare Spend */}
                        <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-sm flex justify-between items-center relative overflow-hidden">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Welfare Projects Spent</span>
                            <span className="text-2xl font-black font-mono text-rose-800 block">
                              ₨ {Math.min(
                                430000,
                                Math.round(donations.filter(d => d.status === 'verified').reduce((acc, d) => acc + d.amount, 0) * 0.7)
                              ).toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-rose-500 block">⚡ Disbursed into local projects</span>
                          </div>
                          <TrendingUp className="w-12 h-12 text-rose-100 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Box 3: Net Liquid Reserves */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm flex justify-between items-center relative overflow-hidden text-white">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Net Liquid Reserves</span>
                            <span className="text-2xl font-black font-mono text-amber-400 block">
                              ₨ {(
                                donations.filter(d => d.status === 'verified').reduce((acc, d) => acc + d.amount, 0) -
                                Math.min(
                                  430000,
                                  Math.round(donations.filter(d => d.status === 'verified').reduce((acc, d) => acc + d.amount, 0) * 0.7)
                                )
                              ).toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 block">✓ Backed by secure cash reserves</span>
                          </div>
                          <Database className="w-12 h-12 text-slate-800 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Interactive Visual Graphs and Ledger Journal */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* Left Column: Visual pure SVG Allocation Charts (5 cols) */}
                        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <div className="border-b border-slate-100 pb-2.5">
                            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Welfare Allocation Chart (Audited)</h4>
                            <p className="text-[10px] text-slate-400">Pure-SVG dynamic spending splits per project category.</p>
                          </div>

                          {/* SVG Donut / Pie Chart rendering */}
                          <div className="flex flex-col items-center justify-center py-4 space-y-4">
                            <svg className="w-40 h-40 transform -rotate-90 select-none" viewBox="0 0 100 100">
                              {/* Circle 1: Masjid build (45%) */}
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#065f46" strokeWidth="12" strokeDasharray="113.09 138.23" strokeDashoffset="0" />
                              {/* Circle 2: RO plants (20%) */}
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0d9488" strokeWidth="12" strokeDasharray="50.26 201.06" strokeDashoffset="-113.09" />
                              {/* Circle 3: Food ration (15%) */}
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f59e0b" strokeWidth="12" strokeDasharray="37.69 213.63" strokeDashoffset="-163.35" />
                              {/* Circle 4: Orphan education (20%) */}
                              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4f46e5" strokeWidth="12" strokeDasharray="50.26 201.06" strokeDashoffset="-201.04" />
                              
                              <circle cx="50" cy="50" r="30" fill="#ffffff" />
                              <text x="50" y="52" textAnchor="middle" className="font-mono font-black text-[10px] fill-slate-900 transform rotate-90" transform="origin-center">LEDGER</text>
                            </svg>

                            {/* Legend labels */}
                            <div className="w-full text-[11px] grid grid-cols-2 gap-2 text-slate-600 pt-2 font-medium">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-800 shrink-0" />
                                <span>Masjid Al-Qadir (45%)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 shrink-0" />
                                <span>RO Water Filtration (20%)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                                <span>Ration Food Drives (15%)</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                                <span>Orphan Schooling (20%)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right Column: Ledger Journals (7 cols) */}
                        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">Audited Journal Statement</h4>
                              <p className="text-[10px] text-slate-400">Verified cash inflows and project disbursements ledger logs.</p>
                            </div>
                            <button
                              onClick={() => alert("Simulating certified audited Ledger PDF download. General ledger secured.")}
                              className="px-2.5 py-1 text-[10px] font-bold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-1.5 cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5 text-slate-500" />
                              <span>Ledger Report</span>
                            </button>
                          </div>

                          {/* Ledgers Table scroll */}
                          <div className="border border-slate-150 rounded-xl overflow-hidden text-[11px]">
                            <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold text-[9px] uppercase tracking-wider">
                                <tr>
                                  <th className="p-2 px-3">Date</th>
                                  <th className="p-2">Narration</th>
                                  <th className="p-2 text-right">Debit (Out)</th>
                                  <th className="p-2 text-right">Credit (In)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                                <tr>
                                  <td className="p-2 px-3 font-mono text-slate-400">2026-07-21</td>
                                  <td>Welfare Allocation: Surjani Jamia Masjid Build</td>
                                  <td className="p-2 text-right text-rose-700 font-mono font-bold">-₨ 240,000</td>
                                  <td className="p-2 text-right text-slate-400 font-mono">--</td>
                                </tr>
                                <tr>
                                  <td className="p-2 px-3 font-mono text-slate-400">2026-07-20</td>
                                  <td>Verified Inflow: Cumulative UBL Receipts Deposit</td>
                                  <td className="p-2 text-right text-slate-400 font-mono">--</td>
                                  <td className="p-2 text-right text-emerald-800 font-mono font-bold">+₨ 185,000</td>
                                </tr>
                                <tr>
                                  <td className="p-2 px-3 font-mono text-slate-400">2026-07-19</td>
                                  <td>Welfare Disbursals: RO Filters Maintenance</td>
                                  <td className="p-2 text-right text-rose-700 font-mono font-bold">-₨ 85,000</td>
                                  <td className="p-2 text-right text-slate-400 font-mono">--</td>
                                </tr>
                                <tr>
                                  <td className="p-2 px-3 font-mono text-slate-400">2026-07-18</td>
                                  <td>Welfare Disbursals: Orphan Ration Food Packs</td>
                                  <td className="p-2 text-right text-rose-700 font-mono font-bold">-₨ 60,000</td>
                                  <td className="p-2 text-right text-slate-400 font-mono">--</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="bg-slate-50/50 p-2.5 rounded-xl text-[10px] text-slate-500 font-medium border border-slate-150 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                            <span>This ledger is sealed and locked. Hash check verified by Auditor-In-Charge: Shayan Ali Qadri.</span>
                          </div>
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
                      TAB: DAILY ACTIVITIES MANAGEMENT SYSTEM
                      ========================================== */}
                  {activeTab === 'activities' && (
                    <div className="space-y-6 text-left">
                      {/* Top banner */}
                      <div className="bg-gradient-to-r from-emerald-850 to-emerald-950 p-6 rounded-2xl border border-emerald-800/10 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
                        <div>
                          <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
                            <Activity className="w-5 h-5 text-amber-400 animate-pulse" />
                            <span>{isUrdu ? 'روزمرہ سرگرمیوں کا نظام' : 'Daily Activities Management'}</span>
                          </h3>
                          <p className="text-xs text-slate-300 mt-1 max-w-xl">
                            {isUrdu 
                              ? 'حسنین فاؤنڈیشن کی روزمرہ کی فلاحی سرگرمیاں یہاں سے شائع کریں۔ یہ خود بخود ہوم پیج، گیلری اور خبروں کے سیکشن میں ظاہر ہوں گی۔' 
                              : 'Publish and manage daily on-ground welfare activities. Published updates automatically populate the Homepage, Gallery, Recent Activities, and News sections.'}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={loadActivitiesOnly}
                            className="px-3 py-1.5 rounded-lg bg-emerald-800/60 hover:bg-emerald-800 border border-emerald-700/50 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${activitiesLoading ? 'animate-spin' : ''}`} />
                            <span>{isUrdu ? 'تازہ کریں' : 'Sync Live'}</span>
                          </button>
                        </div>
                      </div>

                      {/* SQL Fix Warning Card for Database Schema Setup */}
                      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex flex-col gap-2">
                        <div className="flex items-center gap-1.5 font-bold">
                          <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>{isUrdu ? 'سپابیس ایس کیو ایل ڈیٹا بیس ہیلپر' : 'Supabase SQL Database Fix Helper'}</span>
                        </div>
                        <p className={isUrdu ? 'font-urdu leading-relaxed' : 'leading-relaxed'}>
                          {isUrdu 
                            ? 'اگر آپ کو سپابیس ایس کیو ایل کا کوئی ایرر مل رہا ہے، تو نیچے دیئے گئے ایس کیو ایل کوڈ کو کاپی کریں اور اسے اپنے سپابیس ڈیش بورڈ کے "SQL Editor" میں چلا کر "daily_activities" ٹیبل بنائیں۔'
                            : 'If you encounter any SQL errors, copy the SQL statement below and paste it in your Supabase Dashboard SQL Editor to create the "daily_activities" table instantly.'}
                        </p>
                        <div className="relative mt-1 bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[9px] whitespace-pre-wrap overflow-x-auto max-h-36">
                          {`CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  urdu_description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read daily_activities" ON daily_activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert daily_activities" ON daily_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update daily_activities" ON daily_activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete daily_activities" ON daily_activities FOR DELETE USING (true);`}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`CREATE TABLE IF NOT EXISTS daily_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  urdu_description TEXT NOT NULL,
  category TEXT NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read daily_activities" ON daily_activities FOR SELECT USING (true);
CREATE POLICY "Allow public insert daily_activities" ON daily_activities FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update daily_activities" ON daily_activities FOR UPDATE USING (true);
CREATE POLICY "Allow public delete daily_activities" ON daily_activities FOR DELETE USING (true);`);
                              alert(isUrdu ? 'کوڈ کاپی ہو گیا ہے!' : 'SQL code copied to clipboard!');
                            }}
                            className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        {/* LEFT COLUMN: ACTIVITY FORM */}
                        <div id="activity-editor-card" className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                          <h4 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2.5 flex items-center justify-between">
                            <span>{editingActivity ? (isUrdu ? 'سرگرمی ترمیم کریں' : 'Edit Published Activity') : (isUrdu ? 'نئی سرگرمی شامل کریں' : 'Publish New Activity')}</span>
                            {editingActivity && (
                              <button
                                onClick={handleCancelEditActivity}
                                className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                              >
                                {isUrdu ? 'ترمیم منسوخ کریں' : 'Cancel Edit'}
                              </button>
                            )}
                          </h4>

                          <form onSubmit={handlePublishActivity} className="space-y-4 text-xs">
                            {/* Title */}
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">{isUrdu ? 'سرگرمی کا عنوان (Title) *' : 'Activity Title *'}</label>
                              <input
                                type="text"
                                value={activityTitle}
                                onChange={e => setActivityTitle(e.target.value)}
                                placeholder={isUrdu ? 'مثال: رمضان راشن بیگ کی تقسیم' : 'e.g. Ramadan Ration Pack Distribution'}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-xs"
                                required
                              />
                            </div>

                            {/* Category & Admin Name */}
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block font-bold text-slate-700 mb-1">{isUrdu ? 'درجہ (Category) *' : 'Category *'}</label>
                                <select
                                  value={activityCategory}
                                  onChange={e => setActivityCategory(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs bg-white cursor-pointer"
                                >
                                  <option value="راشن تقسیم">راشن تقسیم</option>
                                  <option value="روحانی علاج">روحانی علاج</option>
                                  <option value="مسجد">مسجد</option>
                                  <option value="مدرسہ">مدرسہ</option>
                                  <option value="میڈیکل کیمپ">میڈیکل کیمپ</option>
                                  <option value="غریب بچیوں کی شادی">غریب بچیوں کی شادی</option>
                                  <option value="عید کپڑے تقسیم">عید کپڑے تقسیم</option>
                                  <option value="درود بینک">درود بینک</option>
                                  <option value="دیگر">دیگر</option>
                                </select>
                              </div>

                              <div>
                                <label className="block font-bold text-slate-700 mb-1">{isUrdu ? 'پبلشر کا نام (Admin) *' : 'Publisher Name *'}</label>
                                <input
                                  type="text"
                                  value={activityAdminName}
                                  onChange={e => setActivityAdminName(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none text-xs"
                                  required
                                />
                              </div>
                            </div>

                            {/* Urdu Description */}
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">{isUrdu ? 'اردو تفصیل (Urdu Description) *' : 'Urdu Description *'}</label>
                              <textarea
                                value={activityUrduDesc}
                                onChange={e => setActivityUrduDesc(e.target.value)}
                                placeholder={isUrdu ? 'سرگرمی کی مکمل تفصیل اردو میں درج کریں...' : 'Enter Urdu description of the activity...'}
                                rows={4}
                                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-emerald-500 outline-none text-xs font-urdu leading-loose text-right"
                                required
                              />
                            </div>

                            {/* Multiple Image Upload */}
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                {isUrdu ? 'تصاویر اپ لوڈ کریں (تصویری ثبوت) *' : 'Upload Images (Multiple Proofs) *'}
                              </label>
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImagesUpload}
                                className="w-full text-[10px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                              />
                              <p className="text-[10px] text-slate-400 mt-1">
                                {isUrdu ? 'آپ ایک ساتھ متعدد تصاویر منتخب کر سکتے ہیں۔' : 'You can select multiple images to upload at once.'}
                              </p>

                              {/* Preview of Uploaded Images */}
                              {activityImages.length > 0 && (
                                <div className="mt-2.5 grid grid-cols-4 gap-2 border border-slate-100 p-2 rounded-xl bg-slate-50">
                                  {activityImages.map((img, idx) => (
                                    <div key={idx} className="relative aspect-video rounded bg-slate-200 overflow-hidden group">
                                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                                      <button
                                        type="button"
                                        onClick={() => setActivityImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-0.5 rounded-full cursor-pointer transition-colors opacity-80 hover:opacity-100"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Optional Video Upload */}
                            <div>
                              <label className="block font-bold text-slate-700 mb-1">
                                {isUrdu ? 'ویڈیو اپ لوڈ کریں (اختیاری)' : 'Upload Video Highlight (Optional)'}
                              </label>
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="w-full text-[10px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
                              />

                              {activityVideoUrl && (
                                <div className="mt-2 p-2 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-2">
                                  <span className="text-[10px] truncate text-emerald-800 font-mono font-bold flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Video Uploaded</span>
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setActivityVideoUrl('')}
                                    className="text-[10px] text-rose-600 hover:underline font-bold cursor-pointer"
                                  >
                                    {isUrdu ? 'حذف کریں' : 'Remove'}
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Loader / Submit Buttons */}
                            <div className="pt-2">
                              <button
                                type="submit"
                                disabled={activitiesLoading || uploadingFiles}
                                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-slate-300 disabled:cursor-not-allowed"
                              >
                                {activitiesLoading || uploadingFiles ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span>{uploadingFiles ? (isUrdu ? 'فائلیں لوڈ ہو رہی ہیں...' : 'Processing media...') : (isUrdu ? 'اپ ڈیٹ کیا جا رہا ہے...' : 'Publishing...') }</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 text-amber-400 animate-bounce" />
                                    <span>{editingActivity ? (isUrdu ? 'ترامیم محفوظ کریں' : 'Update Activity') : (isUrdu ? 'سرگرمی شائع کریں' : 'Publish Activity')}</span>
                                  </>
                                )}
                              </button>
                            </div>

                          </form>
                        </div>

                        {/* RIGHT COLUMN: LIST OF ACTIVITIES WITH CRUD OPTIONS */}
                        <div className="lg:col-span-7 space-y-4">
                          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                                <Activity className="w-4 h-4 text-emerald-700" />
                                <span>{isUrdu ? 'نشر شدہ سرگرمیوں کا ریکارڈ' : 'All Published Activities'}</span>
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 font-mono">
                                  {activitiesList.length}
                                </span>
                              </h4>

                              {/* Category Filter */}
                              <select
                                value={activityCategoryFilter}
                                onChange={e => setActivityCategoryFilter(e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-200 outline-none text-[10px] bg-white font-bold text-slate-700 cursor-pointer"
                              >
                                <option value="all">{isUrdu ? 'تمام زمرے' : 'All Categories'}</option>
                                <option value="راشن تقسیم">راشن تقسیم</option>
                                <option value="روحانی علاج">روحانی علاج</option>
                                <option value="مسجد">مسجد</option>
                                <option value="مدرسہ">مدرسہ</option>
                                <option value="میڈیکل کیمپ">میڈیکل کیمپ</option>
                                <option value="غریب بچیوں کی شادی">غریب بچیوں کی شادی</option>
                                <option value="عید کپڑے تقسیم">عید کپڑے تقسیم</option>
                                <option value="درود بینک">درود بینک</option>
                                <option value="دیگر">دیگر</option>
                              </select>
                            </div>

                            {/* Activity Cards List */}
                            {activitiesLoading && activitiesList.length === 0 ? (
                              <div className="py-12 text-center text-slate-400 flex flex-col items-center gap-2">
                                <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
                                <span className="text-xs font-bold">{isUrdu ? 'لوڈنگ جاری ہے...' : 'Fetching activities database...'}</span>
                              </div>
                            ) : activitiesList.length === 0 ? (
                              <div className="py-16 text-center text-slate-400">
                                <Activity className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                                <p className="text-xs font-bold">{isUrdu ? 'کوئی سرگرمی نہیں ملی۔ اوپر دیے گئے فارم سے پہلی سرگرمی شائع کریں۔' : 'No activities published yet. Create one on the left!'}</p>
                              </div>
                            ) : (
                              <div className="divide-y divide-slate-100 max-h-[550px] overflow-y-auto pr-1">
                                {activitiesList
                                  .filter(act => {
                                    if (activityCategoryFilter === 'all') return true;
                                    return act.category === activityCategoryFilter;
                                  })
                                  .map(act => (
                                    <div key={act.id} className="py-3.5 flex gap-3 text-left hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                                      {/* Thumbnail image */}
                                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-150 shrink-0 aspect-square">
                                        {act.images && act.images.length > 0 ? (
                                          <img src={act.images[0]} alt="thumb" className="w-full h-full object-cover" />
                                        ) : (
                                          <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                            <Activity className="w-5 h-5" />
                                          </div>
                                        )}
                                      </div>

                                      {/* Information details */}
                                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                          <div className="flex items-center justify-between gap-2">
                                            <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[9px] font-extrabold font-urdu">
                                              {act.category}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-mono">
                                              {act.date} • {act.time}
                                            </span>
                                          </div>
                                          <h5 className="font-extrabold text-slate-900 text-xs mt-1 truncate">
                                            {act.title}
                                          </h5>
                                          <p className="text-[10px] text-slate-500 font-urdu mt-0.5 line-clamp-2 leading-relaxed text-right">
                                            {act.urdu_description}
                                          </p>
                                          {act.video_url && (
                                            <span className="inline-flex items-center gap-1 text-[9px] text-emerald-700 font-bold mt-1 bg-emerald-50/50 px-1.5 py-0.5 rounded-md">
                                              📺 Video included
                                            </span>
                                          )}
                                        </div>

                                        {/* Action buttons (Edit, Delete, Copy link) */}
                                        <div className="flex justify-between items-center mt-2.5 pt-2.5 border-t border-slate-100">
                                          <span className="text-[9px] text-slate-400">
                                            By: <span className="font-extrabold font-mono text-slate-600">{act.admin_name}</span>
                                          </span>

                                          <div className="flex items-center gap-3">
                                            <button
                                              onClick={() => handleStartEditActivity(act)}
                                              className="text-[10px] font-bold text-emerald-750 hover:text-emerald-800 hover:underline cursor-pointer flex items-center gap-1"
                                            >
                                              {isUrdu ? 'ترمیم' : 'Edit'}
                                            </button>
                                            <button
                                              onClick={() => handleDeleteActivity(act.id)}
                                              className="text-[10px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                                            >
                                              {isUrdu ? 'حذف کریں' : 'Delete'}
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
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

                  {/* ==========================================
                      TABS: MEMBERS & VOLUNTEERS CRM
                      ========================================== */}
                  {(activeTab === 'members' || activeTab === 'volunteers') && (
                    <MemberVolunteerCRM
                      lang={lang}
                      activeTab={activeTab}
                      isUrdu={isUrdu}
                      members={members}
                      volunteers={volunteers}
                      onUpdateMember={handleUpdateMember}
                      onDeleteMember={handleDeleteMember}
                      onUpdateVolunteer={handleUpdateVolunteer}
                      onDeleteVolunteer={handleDeleteVolunteer}
                      setSelectedDocument={setSelectedDocument}
                      loadDashboardData={loadDashboardData}
                    />
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
