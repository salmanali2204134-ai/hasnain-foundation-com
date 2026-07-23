/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Language, Member, Volunteer } from '../types';
import { 
  User, Shield, FileText, Download, Printer, Key, Mail, Phone, MapPin, 
  Calendar, Clock, Heart, Award, CheckCircle2, AlertTriangle, Eye, Upload, 
  Search, ExternalLink, ArrowLeft, RefreshCw, Send, Check, DollarSign, BookOpen, Star, Plus, ThumbsUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase, submitMemberRecordToSupabase } from '../lib/supabase';
import { getHasnainFoundationLink } from '../lib/utils';
import Logo from './Logo';
import SmartCameraUpload from './SmartCameraUpload';

interface PortalSystemProps {
  lang: Language;
  onBackToHome?: () => void;
  verifyMemberId?: string; // Optional direct scan handle
}

export default function PortalSystem({ lang, onBackToHome, verifyMemberId }: PortalSystemProps) {
  const isUrdu = lang === 'ur';

  // Core navigation state
  // 'home' (portal landing), 'login-member', 'login-volunteer', 'signup-member', 'signup-volunteer', 'member-dash', 'volunteer-dash', 'verify'
  const [view, setView] = useState<string>('home');
  const [selectedVerifyId, setSelectedVerifyId] = useState<string | null>(verifyMemberId || null);
  const [verifiedRecord, setVerifiedRecord] = useState<any | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  // Auth user states
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);

  // Form states - Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Form states - Member Signup
  const [mForm, setMForm] = useState({
    fullName: '',
    fatherName: '',
    cnic: '',
    mobile: '',
    whatsapp: '',
    email: '',
    password: '',
    dob: '',
    gender: 'Male',
    address: '',
    city: 'Karachi',
    occupation: '',
    bloodGroup: 'B+',
    membershipType: 'Regular',
  });
  const [mPhoto, setMPhoto] = useState<string>('');
  const [mCnicFront, setMCnicFront] = useState<string>('');
  const [mCnicBack, setMCnicBack] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // Form states - Volunteer Signup
  const [vForm, setVForm] = useState({
    fullName: '',
    fatherName: '',
    cnic: '',
    mobile: '',
    whatsapp: '',
    email: '',
    password: '',
    dob: '',
    gender: 'Male',
    address: '',
    city: 'Karachi',
    bloodGroup: 'B+',
    skills: '',
    availability: 'Weekends',
    emergencyContact: '',
    experience: '',
    assignedDepartment: 'Welfare Support',
  });
  const [vPhoto, setVPhoto] = useState<string>('');
  const [vCnicFront, setVCnicFront] = useState<string>('');
  const [vCnicBack, setVCnicBack] = useState<string>('');

  // Durood input inside Member Dash
  const [duroodCount, setDuroodCount] = useState<number>(0);
  const [duroodType, setDuroodType] = useState<string>('درود ابراہیمی');
  const [submittingDurood, setSubmittingDurood] = useState(false);

  // Donation input inside Member Dash
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [donationPurpose, setDonationPurpose] = useState<string>('General Welfare');
  const [paymentMethod, setPaymentMethod] = useState<string>('EasyPaisa');
  const [txnId, setTxnId] = useState<string>('');
  const [submittingDonation, setSubmittingDonation] = useState(false);
  const [donationLogs, setDonationLogs] = useState<any[]>([]);

  // Local Storage synchronizers
  useEffect(() => {
    if (verifyMemberId) {
      setView('verify');
      handleVerify(verifyMemberId);
    }
  }, [verifyMemberId]);

  // Handle verified record scan lookup
  const handleVerify = async (id: string) => {
    setVerifyLoading(true);
    setVerifiedRecord(null);
    try {
      // 1. Check in members first
      const { data: member, error: mErr } = await supabase
        .from('members')
        .select('*')
        .eq('id', id.trim().toUpperCase())
        .maybeSingle();

      if (member) {
        setVerifiedRecord({ type: 'member', data: member });
        setVerifyLoading(false);
        return;
      }

      // 2. Check in volunteers
      const { data: volunteer, error: vErr } = await supabase
        .from('volunteers')
        .select('*')
        .eq('id', id.trim().toUpperCase())
        .maybeSingle();

      if (volunteer) {
        setVerifiedRecord({ type: 'volunteer', data: volunteer });
      } else {
        // Local fallback check
        const storedMembers = JSON.parse(localStorage.getItem('hasnain_members_local') || '[]');
        const storedVols = JSON.parse(localStorage.getItem('hasnain_volunteers_local') || '[]');
        const localMem = storedMembers.find((m: any) => m.id === id.trim().toUpperCase());
        const localVol = storedVols.find((v: any) => v.id === id.trim().toUpperCase());
        
        if (localMem) {
          setVerifiedRecord({ type: 'member', data: localMem });
        } else if (localVol) {
          setVerifiedRecord({ type: 'volunteer', data: localVol });
        }
      }
    } catch (err) {
      console.error("Verification Lookup Error: ", err);
    } finally {
      setVerifyLoading(false);
    }
  };

  // Convert File uploads to base64 safely
  const handleBase64Upload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setter(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Online Membership Signup Handler
  const handleMemberSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mForm.fullName || !mForm.email || !mForm.cnic || !mForm.mobile || !mForm.password) {
      setFormError(isUrdu ? "براہ کرم تمام لازمی فیلڈز پُر کریں۔" : "Please fill in all mandatory fields.");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Auto id prefix HF-M-
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const memberId = `HF-M-${idNum}`;
    const today = new Date().toLocaleDateString('en-CA');

    const newMember: Member = {
      id: memberId,
      profile_photo: mPhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      cnic_front: mCnicFront || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      cnic_back: mCnicBack || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      full_name: mForm.fullName,
      father_name: mForm.fatherName,
      cnic: mForm.cnic,
      mobile: mForm.mobile,
      whatsapp: mForm.whatsapp || mForm.mobile,
      email: mForm.email,
      password: mForm.password,
      date_of_birth: mForm.dob,
      gender: mForm.gender,
      address: mForm.address,
      city: mForm.city,
      occupation: mForm.occupation,
      blood_group: mForm.bloodGroup,
      membership_type: mForm.membershipType,
      registration_date: today,
      status: 'pending',
      internal_notes: 'Online Registration received.',
      issue_date: today,
      expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-CA'),
      donations_count: 0,
      durood_count: 0,
      events_count: 0,
      certificates: []
    };

    try {
      await submitMemberRecordToSupabase(newMember);

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setView('login-member');
      }, 3500);
    } catch (err: any) {
      console.error("Error registering member:", err);
      setFormError(isUrdu ? "رجسٹریشن کے دوران کوئی مسئلہ پیش آیا۔" : "An error occurred during registration.");
    } finally {
      setFormLoading(false);
    }
  };

  // Online Volunteer Signup Handler
  const handleVolunteerSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vForm.fullName || !vForm.email || !vForm.cnic || !vForm.mobile || !vForm.password) {
      setFormError(isUrdu ? "براہ کرم تمام لازمی فیلڈز پُر کریں۔" : "Please fill in all mandatory fields.");
      return;
    }

    setFormLoading(true);
    setFormError(null);

    // Auto id prefix HF-V-
    const idNum = Math.floor(1000 + Math.random() * 9000);
    const volunteerId = `HF-V-${idNum}`;
    const today = new Date().toLocaleDateString('en-CA');

    const newVolunteer: Volunteer = {
      id: volunteerId,
      profile_photo: vPhoto || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      cnic_front: vCnicFront || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      cnic_back: vCnicBack || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      full_name: vForm.fullName,
      father_name: vForm.fatherName,
      cnic: vForm.cnic,
      mobile: vForm.mobile,
      whatsapp: vForm.whatsapp || vForm.mobile,
      email: vForm.email,
      password: vForm.password,
      date_of_birth: vForm.dob,
      gender: vForm.gender,
      address: vForm.address,
      city: vForm.city,
      blood_group: vForm.bloodGroup,
      skills: vForm.skills,
      availability: vForm.availability,
      emergency_contact: vForm.emergencyContact,
      experience: vForm.experience,
      assigned_department: vForm.assignedDepartment,
      status: 'pending',
      internal_notes: 'Online Volunteer Application received.',
      issue_date: today,
      expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString('en-CA'),
      assigned_duties: ['Welcome Orientation Session'],
      attendance_count: 0,
      events_count: 0,
      performance_rating: 5
    };

    try {
      // Insert to Supabase volunteers
      const { data, error } = await supabase.from('volunteers').insert([newVolunteer]).select();
      if (error) throw error;

      // Sync local copy
      const stored = JSON.parse(localStorage.getItem('hasnain_volunteers_local') || '[]');
      stored.unshift(newVolunteer);
      localStorage.setItem('hasnain_volunteers_local', JSON.stringify(stored));
      localStorage.setItem('hasnain_volunteers', JSON.stringify(stored));
      window.dispatchEvent(new Event('volunteers_updated'));

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setView('login-volunteer');
      }, 3500);
    } catch (err: any) {
      console.warn("Supabase insertion error, trying contact_submissions fallback", err);
      try {
        const fallbackPayload = {
          name: newVolunteer.full_name,
          email: newVolunteer.email,
          phone: newVolunteer.mobile,
          subject: 'VOLUNTEER_SIGNUP',
          message: JSON.stringify(newVolunteer)
        };
        const { error: fbErr } = await supabase.from('contact_submissions').insert([fallbackPayload]);
        if (fbErr) throw fbErr;
        console.log("Volunteer registered via fallback contact_submissions table successfully.");
      } catch (fbErr) {
        console.warn("Both primary and secondary insertion failed, using pure local storage", fbErr);
      }

      // Local storage fallback
      const stored = JSON.parse(localStorage.getItem('hasnain_volunteers_local') || '[]');
      stored.unshift(newVolunteer);
      localStorage.setItem('hasnain_volunteers_local', JSON.stringify(stored));
      localStorage.setItem('hasnain_volunteers', JSON.stringify(stored));
      window.dispatchEvent(new Event('volunteers_updated'));

      setFormSuccess(true);
      setTimeout(() => {
        setFormSuccess(false);
        setView('login-volunteer');
      }, 3500);
    } finally {
      setFormLoading(false);
    }
  };

  // Member Login Handler
  const handleMemberLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError(isUrdu ? "برائے مہربانی ای میل اور پاس ورڈ درج کریں۔" : "Please enter email and password.");
      return;
    }

    setAuthLoading(true);
    setLoginError(null);

    try {
      // 1. Try Supabase primary table
      let member = null;
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('email', loginEmail.trim().toLowerCase())
          .eq('password', loginPassword.trim())
          .maybeSingle();
        
        if (!error && data) {
          member = data;
        }
      } catch (pErr) {
        console.warn("Primary members login query failed, trying fallback:", pErr);
      }

      // 1B. If not found, try fallback contact_submissions table
      if (!member) {
        try {
          const { data: contacts, error: cErr } = await supabase
            .from('contact_submissions')
            .select('*')
            .eq('subject', 'MEMBER_SIGNUP');
          
          if (!cErr && contacts) {
            const matchedRow = contacts.find(row => {
              try {
                const obj = JSON.parse(row.message);
                return obj.email.toLowerCase() === loginEmail.trim().toLowerCase() && obj.password === loginPassword.trim();
              } catch {
                return false;
              }
            });
            if (matchedRow) {
              member = JSON.parse(matchedRow.message);
              member._contact_id = matchedRow.id;
            }
          }
        } catch (fbErr) {
          console.warn("Fallback members login query failed:", fbErr);
        }
      }

      if (member) {
        setCurrentMember(member);
        setView('member-dash');
        return;
      }

      // 2. Check local fallback
      const stored = JSON.parse(localStorage.getItem('hasnain_members_local') || '[]');
      const localMatch = stored.find(
        (m: any) => m.email.toLowerCase() === loginEmail.trim().toLowerCase() && m.password === loginPassword.trim()
      );

      if (localMatch) {
        setCurrentMember(localMatch);
        setView('member-dash');
      } else {
        setLoginError(isUrdu ? "غلط ای میل یا پاس ورڈ، یا آپ کا اکاؤنٹ ابھی منظور نہیں ہوا ہے۔" : "Invalid email or password, or your application is pending review.");
      }
    } catch (err) {
      console.error(err);
      setLoginError(isUrdu ? "لاگ ان کے دوران خرابی پیش آئی۔" : "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Volunteer Login Handler
  const handleVolunteerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setLoginError(isUrdu ? "برائے مہربانی ای میل اور پاس ورڈ درج کریں۔" : "Please enter email and password.");
      return;
    }

    setAuthLoading(true);
    setLoginError(null);

    try {
      // 1. Try Supabase primary table
      let volunteer = null;
      try {
        const { data, error } = await supabase
          .from('volunteers')
          .select('*')
          .eq('email', loginEmail.trim().toLowerCase())
          .eq('password', loginPassword.trim())
          .maybeSingle();
        
        if (!error && data) {
          volunteer = data;
        }
      } catch (pErr) {
        console.warn("Primary volunteers login query failed, trying fallback:", pErr);
      }

      // 1B. If not found, try fallback contact_submissions table
      if (!volunteer) {
        try {
          const { data: contacts, error: cErr } = await supabase
            .from('contact_submissions')
            .select('*')
            .eq('subject', 'VOLUNTEER_SIGNUP');
          
          if (!cErr && contacts) {
            const matchedRow = contacts.find(row => {
              try {
                const obj = JSON.parse(row.message);
                return obj.email.toLowerCase() === loginEmail.trim().toLowerCase() && obj.password === loginPassword.trim();
              } catch {
                return false;
              }
            });
            if (matchedRow) {
              volunteer = JSON.parse(matchedRow.message);
              volunteer._contact_id = matchedRow.id;
            }
          }
        } catch (fbErr) {
          console.warn("Fallback volunteers login query failed:", fbErr);
        }
      }

      if (volunteer) {
        setCurrentVolunteer(volunteer);
        setView('volunteer-dash');
        return;
      }

      // 2. Check local fallback
      const stored = JSON.parse(localStorage.getItem('hasnain_volunteers_local') || '[]');
      const localMatch = stored.find(
        (v: any) => v.email.toLowerCase() === loginEmail.trim().toLowerCase() && v.password === loginPassword.trim()
      );

      if (localMatch) {
        setCurrentVolunteer(localMatch);
        setView('volunteer-dash');
      } else {
        setLoginError(isUrdu ? "غلط ای میل یا پاس ورڈ، یا آپ کا اکاؤنٹ ابھی منظور نہیں ہوا ہے۔" : "Invalid email or password, or your application is pending review.");
      }
    } catch (err) {
      console.error(err);
      setLoginError(isUrdu ? "لاگ ان کے دوران خرابی پیش آئی۔" : "An error occurred during authentication.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Submit Durood Contribution directly
  const submitDurood = async () => {
    if (duroodCount <= 0 || !currentMember) return;
    setSubmittingDurood(true);

    const payload = {
      full_name: currentMember.full_name,
      mobile: currentMember.mobile,
      whatsapp: currentMember.whatsapp,
      email: currentMember.email,
      city: currentMember.city,
      country: 'Pakistan',
      durood_type: duroodType,
      quantity: duroodCount,
      intention: 'Member Contribution'
    };

    try {
      const now = new Date();
      const { error } = await supabase.from('durood_bank').insert([{
        ...payload,
        date: now.toLocaleDateString('en-GB'),
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      }]);

      if (error) throw error;

      // Update local member stats
      const updated = {
        ...currentMember,
        durood_count: (currentMember.durood_count || 0) + duroodCount
      };
      setCurrentMember(updated);
      
      // Update local storage
      const stored = JSON.parse(localStorage.getItem('hasnain_members_local') || '[]');
      const idx = stored.findIndex((m: any) => m.id === currentMember.id);
      if (idx !== -1) {
        stored[idx] = updated;
        localStorage.setItem('hasnain_members_local', JSON.stringify(stored));
      }

      alert(isUrdu ? "سبحان اللہ! آپ کا درود پاک کامیابی سے درج کر لیا گیا ہے۔" : "SubhanAllah! Your Durood contribution is logged successfully.");
      setDuroodCount(0);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDurood(false);
    }
  };

  // Submit Donation Fee Directly
  const submitDonation = async () => {
    if (!donationAmount || !txnId || !currentMember) return;
    setSubmittingDonation(true);

    const payload = {
      donorName: currentMember.full_name,
      email: currentMember.email,
      mobile: currentMember.mobile,
      whatsapp: currentMember.whatsapp,
      amount: Number(donationAmount),
      paymentMethod,
      purpose: donationPurpose,
      transactionId: txnId
    };

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).then(r => r.json());

      if (res.success) {
        const updated = {
          ...currentMember,
          donations_count: (currentMember.donations_count || 0) + 1
        };
        setCurrentMember(updated);
        
        // Update local storage
        const stored = JSON.parse(localStorage.getItem('hasnain_members_local') || '[]');
        const idx = stored.findIndex((m: any) => m.id === currentMember.id);
        if (idx !== -1) {
          stored[idx] = updated;
          localStorage.setItem('hasnain_members_local', JSON.stringify(stored));
        }

        // Add to local donation list
        setDonationLogs(prev => [res.donation, ...prev]);

        alert(isUrdu ? "جزاک اللہ خیراً! آپ کی فیس/عطیہ موصول ہو گیا ہے اور ایڈمن کی تصدیق کے لیے بھیج دیا گیا ہے۔" : "JazakAllah Khair! Your fee/donation receipt has been submitted and is pending admin verification.");
        setDonationAmount('');
        setTxnId('');
      } else {
        alert(res.error || "Submission failed.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDonation(false);
    }
  };

  // Membership Renewal Request
  const handleRenewalRequest = () => {
    alert(isUrdu 
      ? "تجدیدِ رکنیت کی درخواست موصول ہو گئی ہے۔ حسنین فاؤنڈیشن انتظامیہ جلد آپ سے رابطہ کرے گی۔" 
      : "Your membership renewal request has been sent to the Admin Cell. We will get back to you soon."
    );
  };

  // Simulated PDF / Direct Print Handler
  const handlePrintIDCard = () => {
    window.print();
  };

  return (
    <div className="py-12 px-4 sm:px-6 max-w-7xl mx-auto font-sans relative">
      
      {/* 15. Premium Green & Gold Branding Banner */}
      <div className="text-center mb-10 flex flex-col items-center justify-center">
        <Logo lang={lang} variant="large" className="mx-auto mb-4 scale-110" />
        <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 mt-2 leading-tight tracking-tight">
          {isUrdu ? 'حسنین فاؤنڈیشن پورٹل' : 'Hasnain Foundation Portal'}
        </h1>
        <p className="text-amber-600 font-urdu text-lg sm:text-xl font-bold mt-2 tracking-wide">
          "خدمتِ دین و خلق ہماری پہچان"
        </p>
        <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full" />
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW: LANDING HOME */}
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 max-w-4xl mx-auto"
          >
            {/* MEMBERS BOX */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors" />
              <div>
                <div className="p-4 w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center mb-6">
                  <User className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 mb-3">
                  {isUrdu ? 'رکنیت پورٹل (Members)' : 'Membership Portal'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {isUrdu 
                    ? 'حسنین فاؤنڈیشن کے مستقل رکن بن کر فلاحی و دینی مہمات میں اپنا حصہ ڈالیں۔ ڈیجیٹل شناختی کارڈ اور سرٹیفکیٹ حاصل کریں۔'
                    : 'Register as an official member of the foundation. View your digital ID card, donations log, and exclusive welfare services.'}
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setView('login-member')}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isUrdu ? 'لاگ ان کریں' : 'Member Login'}</span>
                </button>
                <button 
                  onClick={() => setView('signup-member')}
                  className="w-full py-3.5 px-4 rounded-xl border border-slate-200 hover:border-emerald-600 hover:text-emerald-800 text-slate-700 font-bold text-sm bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isUrdu ? 'نیا فارم پُر کریں' : 'Online Membership Form'}</span>
                </button>
              </div>
            </div>

            {/* VOLUNTEERS BOX */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <div>
                <div className="p-4 w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center mb-6">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 mb-3">
                  {isUrdu ? 'رضاکار پورٹل (Volunteers)' : 'Volunteer Portal'}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  {isUrdu 
                    ? 'انسانیت کی خدمت کے لیے بطور رضاکار اپنا اندراج کریں۔ اپنے فرائض، حاضری کا ریکارڈ اور تعریفی اسناد چیک کریں۔'
                    : 'Join our forces to serve humanity. Log in to check your duties, attendance, and issue appreciation certificates.'}
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setView('login-volunteer')}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>{isUrdu ? 'لاگ ان کریں' : 'Volunteer Login'}</span>
                </button>
                <button 
                  onClick={() => setView('signup-volunteer')}
                  className="w-full py-3.5 px-4 rounded-xl border border-slate-200 hover:border-amber-600 hover:text-amber-800 text-slate-700 font-bold text-sm bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>{isUrdu ? 'رضاکار فارم پُر کریں' : 'Volunteer Registration'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: MEMBER SIGNUP */}
        {view === 'signup-member' && (
          <motion.div 
            key="signup-member"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-3xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                <User className="text-emerald-700" />
                <span>{isUrdu ? 'آن لائن ممبرشپ فارم' : 'Online Membership Form'}</span>
              </h3>
              <button 
                onClick={() => setView('home')}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft />
              </button>
            </div>

            {formError && (
              <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess ? (
              <div className="p-8 text-center bg-emerald-50 border border-emerald-100 rounded-3xl my-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4 animate-bounce" />
                <h4 className="text-2xl font-bold text-emerald-950">
                  {isUrdu ? 'درخواست کامیابی سے جمع کر دی گئی ہے!' : 'Application Submitted Successfully!'}
                </h4>
                <p className="text-slate-600 text-sm mt-2">
                  {isUrdu 
                    ? 'آپ کی رجسٹریشن زیرِ غور ہے۔ انتظامیہ کی منظوری کے بعد آپ اپنے شناختی کارڈ تک رسائی حاصل کر سکیں گے۔'
                    : 'Admin is reviewing your application. You will be able to log in once approved.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleMemberSignup} className="space-y-6">
                
                {/* File & Direct Camera Upload fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo Upload */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'پروفائل تصویر' : 'Profile Photo'}
                    type="profile"
                    value={mPhoto}
                    onChange={setMPhoto}
                    accentColor="emerald"
                  />

                  {/* CNIC Front */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'شناختی کارڈ (سامنے)' : 'CNIC Front Side'}
                    type="card"
                    cardSide="front"
                    value={mCnicFront}
                    onChange={setMCnicFront}
                    accentColor="emerald"
                  />

                  {/* CNIC Back */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'شناختی کارڈ (پیچھے)' : 'CNIC Back Side'}
                    type="card"
                    cardSide="back"
                    value={mCnicBack}
                    onChange={setMCnicBack}
                    accentColor="emerald"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'مکمل نام *' : 'Full Name *'}</label>
                    <input 
                      type="text" 
                      value={mForm.fullName} 
                      onChange={(e) => setMForm({...mForm, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'والد کا نام' : 'Father Name'}</label>
                    <input 
                      type="text" 
                      value={mForm.fatherName} 
                      onChange={(e) => setMForm({...mForm, fatherName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'شناختی کارڈ نمبر (CNIC) *' : 'CNIC Number *'}</label>
                    <input 
                      type="text" 
                      placeholder="42101-XXXXXXX-X"
                      value={mForm.cnic} 
                      onChange={(e) => setMForm({...mForm, cnic: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'موبائل نمبر *' : 'Mobile Number *'}</label>
                    <input 
                      type="text" 
                      placeholder="03XXXXXXXXX"
                      value={mForm.mobile} 
                      onChange={(e) => setMForm({...mForm, mobile: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'واٹس ایپ نمبر' : 'WhatsApp Number'}</label>
                    <input 
                      type="text" 
                      value={mForm.whatsapp} 
                      onChange={(e) => setMForm({...mForm, whatsapp: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'ای میل ایڈریس *' : 'Email Address *'}</label>
                    <input 
                      type="email" 
                      value={mForm.email} 
                      onChange={(e) => setMForm({...mForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'پاس ورڈ (لاگ ان کے لیے) *' : 'Choose Password *'}</label>
                    <input 
                      type="password" 
                      value={mForm.password} 
                      onChange={(e) => setMForm({...mForm, password: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'تاریخِ پیدائش' : 'Date of Birth'}</label>
                    <input 
                      type="date" 
                      value={mForm.dob} 
                      onChange={(e) => setMForm({...mForm, dob: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'جنس (Gender)' : 'Gender'}</label>
                    <select 
                      value={mForm.gender} 
                      onChange={(e) => setMForm({...mForm, gender: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                    >
                      <option value="Male">{isUrdu ? 'مرد' : 'Male'}</option>
                      <option value="Female">{isUrdu ? 'خواتین' : 'Female'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'بلڈ گروپ' : 'Blood Group'}</label>
                    <select 
                      value={mForm.bloodGroup} 
                      onChange={(e) => setMForm({...mForm, bloodGroup: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'ملازمت / پیشہ' : 'Occupation'}</label>
                    <input 
                      type="text" 
                      value={mForm.occupation} 
                      onChange={(e) => setMForm({...mForm, occupation: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'رکنیت کی قسم' : 'Membership Type'}</label>
                    <select 
                      value={mForm.membershipType} 
                      onChange={(e) => setMForm({...mForm, membershipType: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                    >
                      <option value="Regular">{isUrdu ? 'بنیادی (Regular)' : 'Regular'}</option>
                      <option value="Premium">{isUrdu ? 'خصوصی (Premium)' : 'Premium'}</option>
                      <option value="Life">{isUrdu ? 'تایادِ حیات (Life)' : 'Life'}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'مکمل پتہ *' : 'Residential Address *'}</label>
                    <input 
                      type="text" 
                      value={mForm.address} 
                      onChange={(e) => setMForm({...mForm, address: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-base shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{isUrdu ? 'اندراج مکمل کریں' : 'Submit Membership Application'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* VIEW: VOLUNTEER SIGNUP */}
        {view === 'signup-volunteer' && (
          <motion.div 
            key="signup-volunteer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-3xl mx-auto"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-2xl font-black text-emerald-950 flex items-center gap-2">
                <Award className="text-amber-600" />
                <span>{isUrdu ? 'آن لائن رضاکار رجسٹریشن فارم' : 'Online Volunteer Registration'}</span>
              </h3>
              <button 
                onClick={() => setView('home')}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft />
              </button>
            </div>

            {formError && (
              <div className="p-4 mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess ? (
              <div className="p-8 text-center bg-amber-50 border border-amber-100 rounded-3xl my-6">
                <CheckCircle2 className="w-16 h-16 text-amber-600 mx-auto mb-4 animate-bounce" />
                <h4 className="text-2xl font-bold text-emerald-950">
                  {isUrdu ? 'رضاکار فارم جمع کر دیا گیا ہے!' : 'Volunteer Form Submitted!'}
                </h4>
                <p className="text-slate-600 text-sm mt-2">
                  {isUrdu 
                    ? 'محبت اور جذبے کے ساتھ خدمتِ دین و خلق کا سفر۔ منظوری کے بعد آپ کو فرائض تفویض کر دیے جائیں گے۔'
                    : 'Admin will review and approve your details. Once authorized you will get a login to view assigned duties.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleVolunteerSignup} className="space-y-6">
                
                {/* File & Direct Camera Upload fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Photo Upload */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'پروفائل تصویر' : 'Profile Photo'}
                    type="profile"
                    value={vPhoto}
                    onChange={setVPhoto}
                    accentColor="amber"
                  />

                  {/* CNIC Front */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'شناختی کارڈ (سامنے)' : 'CNIC Front Side'}
                    type="card"
                    cardSide="front"
                    value={vCnicFront}
                    onChange={setVCnicFront}
                    accentColor="amber"
                  />

                  {/* CNIC Back */}
                  <SmartCameraUpload
                    lang={lang}
                    label={isUrdu ? 'شناختی کارڈ (پیچھے)' : 'CNIC Back Side'}
                    type="card"
                    cardSide="back"
                    value={vCnicBack}
                    onChange={setVCnicBack}
                    accentColor="amber"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'مکمل نام *' : 'Full Name *'}</label>
                    <input 
                      type="text" 
                      value={vForm.fullName} 
                      onChange={(e) => setVForm({...vForm, fullName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'والد کا نام' : 'Father Name'}</label>
                    <input 
                      type="text" 
                      value={vForm.fatherName} 
                      onChange={(e) => setVForm({...vForm, fatherName: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'شناختی کارڈ نمبر *' : 'CNIC Number *'}</label>
                    <input 
                      type="text" 
                      value={vForm.cnic} 
                      onChange={(e) => setVForm({...vForm, cnic: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'موبائل نمبر *' : 'Mobile Number *'}</label>
                    <input 
                      type="text" 
                      value={vForm.mobile} 
                      onChange={(e) => setVForm({...vForm, mobile: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'ای میل *' : 'Email Address *'}</label>
                    <input 
                      type="email" 
                      value={vForm.email} 
                      onChange={(e) => setVForm({...vForm, email: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'پاس ورڈ *' : 'Password *'}</label>
                    <input 
                      type="password" 
                      value={vForm.password} 
                      onChange={(e) => setVForm({...vForm, password: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'دستیابی (Availability)' : 'Availability'}</label>
                    <select 
                      value={vForm.availability} 
                      onChange={(e) => setVForm({...vForm, availability: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold"
                    >
                      <option value="Weekends">{isUrdu ? 'صرف ہفتہ، اتوار' : 'Weekends'}</option>
                      <option value="Weekdays">{isUrdu ? 'پیر تا جمعہ' : 'Weekdays'}</option>
                      <option value="Evenings">{isUrdu ? 'صرف شام' : 'Evenings Only'}</option>
                      <option value="Flexible">{isUrdu ? 'ہمہ وقت دستیاب' : 'Flexible'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'علاج معالجے/ہنر' : 'Skills / Experience'}</label>
                    <input 
                      type="text" 
                      value={vForm.skills} 
                      onChange={(e) => setVForm({...vForm, skills: e.target.value})}
                      placeholder="e.g. IT, Admin, Social Work"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'ایمرجنسی رابطہ نمبر *' : 'Emergency Contact *'}</label>
                    <input 
                      type="text" 
                      value={vForm.emergencyContact} 
                      onChange={(e) => setVForm({...vForm, emergencyContact: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold font-mono" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">{isUrdu ? 'تفضیلِ تجربہ' : 'Experience Summary'}</label>
                    <input 
                      type="text" 
                      value={vForm.experience} 
                      onChange={(e) => setVForm({...vForm, experience: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-600 bg-slate-50/50 font-bold" 
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={formLoading}
                  className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-base shadow-lg cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {formLoading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{isUrdu ? 'رضاکارانہ اندراج مکمل کریں' : 'Register as Volunteer'}</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        )}

        {/* VIEW: LOGIN PORTALS */}
        {(view === 'login-member' || view === 'login-volunteer') && (
          <motion.div 
            key="login-portal"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-md mx-auto relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-emerald-600 to-amber-500" />
            <div className="flex justify-between items-center mb-6 pb-2">
              <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                <Key className="text-amber-500" />
                <span>
                  {view === 'login-member' 
                    ? (isUrdu ? 'ممبر لاگ ان' : 'Member Portal Login') 
                    : (isUrdu ? 'رضاکار لاگ ان' : 'Volunteer Portal Login')}
                </span>
              </h3>
              <button 
                onClick={() => setView('home')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            {loginError && (
              <div className="p-3.5 mb-5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={view === 'login-member' ? handleMemberLogin : handleVolunteerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'ای میل ایڈریس' : 'Email Address'}</label>
                <input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'پاس ورڈ' : 'Password'}</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold" 
                />
              </div>

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full py-3.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-sm shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>{isUrdu ? 'لاگ ان کریں' : 'Access Dashboard'}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              {view === 'login-member' ? (
                <>
                  <span>{isUrdu ? 'ابھی تک ممبر نہیں بنے؟' : "Don't have a membership yet?"}</span>{' '}
                  <button onClick={() => setView('signup-member')} className="text-emerald-700 font-extrabold hover:underline">
                    {isUrdu ? 'یہاں رجسٹر کریں' : 'Apply Online Now'}
                  </button>
                </>
              ) : (
                <>
                  <span>{isUrdu ? 'کیا آپ خدمت کرنا چاہتے ہیں؟' : 'Want to serve humanity?'}</span>{' '}
                  <button onClick={() => setView('signup-volunteer')} className="text-amber-600 font-extrabold hover:underline">
                    {isUrdu ? 'یہاں رضاکارانہ اندراج کریں' : 'Join Our Forces'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* VIEW: QR VERIFICATION PAGE */}
        {view === 'verify' && (
          <motion.div 
            key="verify-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xl max-w-lg mx-auto text-center"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                <Shield className="text-emerald-700" />
                <span>{isUrdu ? 'شناختی کارڈ تصدیق نامہ' : 'Spiritual ID Verification Cell'}</span>
              </h3>
              <button 
                onClick={() => setView('home')}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 cursor-pointer"
              >
                <ArrowLeft />
              </button>
            </div>

            {verifyLoading ? (
              <div className="py-12">
                <RefreshCw className="w-10 h-10 animate-spin text-emerald-700 mx-auto" />
                <p className="text-slate-500 text-sm mt-3">{isUrdu ? 'معلومات کی تصدیق کی جا رہی ہے...' : 'Fetching live profile from blockchain/Supabase...'}</p>
              </div>
            ) : verifiedRecord ? (
              <div className="space-y-6">
                
                {/* 5. VERIFIED STATUS INDICATOR */}
                {verifiedRecord.data.status === 'approved' || verifiedRecord.data.status === 'active' ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center flex flex-col items-center justify-center gap-1 shadow-sm">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                    <span className="font-black text-lg tracking-wide uppercase">{isUrdu ? 'تصدیق شدہ رکن (APPROVED CARD)' : 'APPROVED / VERIFIED'}</span>
                    <span className="text-xs opacity-80">{isUrdu ? 'حسنین فاؤنڈیشن کا مستند فلاحی کارڈ' : 'Authentic Hasnain Foundation Spiritual Identity'}</span>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-center flex flex-col items-center justify-center gap-1 shadow-sm">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                    <span className="font-black text-lg tracking-wide uppercase">{isUrdu ? 'غیر تصدیق شدہ یا معطل' : 'INVALID / SUSPENDED CARD'}</span>
                    <span className="text-xs opacity-80">{isUrdu ? 'براہ کرم فاؤنڈیشن انتظامیہ سے رابطہ کریں۔' : 'This ID is invalid, suspended or pending admin verification.'}</span>
                  </div>
                )}

                <div className="flex flex-col items-center">
                  <img 
                    src={verifiedRecord.data.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                    alt="Verified Face" 
                    className="w-28 h-28 object-cover rounded-full border-4 border-amber-500/20 shadow-md mb-3" 
                  />
                  <h4 className="text-2xl font-black text-emerald-950">{verifiedRecord.data.full_name}</h4>
                  <p className="text-sm text-slate-500 font-mono font-bold mt-0.5">{verifiedRecord.data.id}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left border-t border-b border-slate-100 py-4 font-bold text-xs sm:text-sm">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="block text-[10px] text-slate-400 font-normal uppercase">{isUrdu ? 'رکنیت کی قسم' : 'Type'}</span>
                    <span className="text-emerald-950 capitalize">{verifiedRecord.type === 'member' ? `${verifiedRecord.data.membership_type} Member` : 'Official Volunteer'}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="block text-[10px] text-slate-400 font-normal uppercase">{isUrdu ? 'بلڈ گروپ' : 'Blood Group'}</span>
                    <span className="text-emerald-950">{verifiedRecord.data.blood_group}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="block text-[10px] text-slate-400 font-normal uppercase">{isUrdu ? 'تاریخِ اجراء' : 'Issue Date'}</span>
                    <span className="text-emerald-950 font-mono">{verifiedRecord.data.issue_date || verifiedRecord.data.registration_date}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <span className="block text-[10px] text-slate-400 font-normal uppercase">{isUrdu ? 'تاریخِ تنسیخ' : 'Expiry Date'}</span>
                    <span className="text-emerald-950 font-mono text-red-600">{verifiedRecord.data.expiry_date}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  {isUrdu 
                    ? 'یہ تفتیش براہِ راست حسنین فاؤنڈیشن کے مرکزی ڈیٹا بیس سے کی گئی ہے۔ معلومات کی صحت کسی بھی قسم کے شک و شبہ سے بالاتر ہے۔'
                    : 'This live digital certificate lookup verifies that the bearer is a valid member/volunteer in active standing with Hasnain Foundation.'}
                </p>
              </div>
            ) : (
              <div className="py-12">
                <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-slate-950">{isUrdu ? 'کوئی ریکارڈ نہیں ملا!' : 'Invalid Verification Code'}</h4>
                <p className="text-slate-500 text-sm mt-1 max-w-xs mx-auto">
                  {isUrdu 
                    ? 'فراہم کردہ رجسٹریشن آئی ڈی ڈیٹا بیس میں دستیاب نہیں ہے۔ براہ کرم مستند کیو آر کوڈ اسکین کریں۔'
                    : 'This ID card code does not match any registered approved profile on our servers.'}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* VIEW: MEMBER DASHBOARD */}
        {view === 'member-dash' && currentMember && (
          <motion.div 
            key="member-dash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* WELCOME BAR */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 text-center md:text-left">
                <img 
                  src={currentMember.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                  alt="Avatar" 
                  className="w-20 h-20 object-cover rounded-full border-4 border-amber-500/20 shadow-md"
                />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                    {isUrdu ? `خوش آمدید، ${currentMember.full_name}` : `Welcome, ${currentMember.full_name}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 shrink-0 text-slate-300 text-xs font-bold justify-center md:justify-start">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 capitalize">
                      {currentMember.membership_type} Member
                    </span>
                    <span className="font-mono">{currentMember.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setCurrentMember(null); setView('home'); }}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 text-slate-300 hover:text-white bg-slate-800 cursor-pointer transition-colors"
                >
                  {isUrdu ? 'لاگ آؤٹ' : 'Log Out'}
                </button>
              </div>
            </div>

            {/* STATUS BOX */}
            {currentMember.status !== 'approved' && currentMember.status !== 'active' && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="block font-black uppercase text-xs text-amber-500">{isUrdu ? 'درخواست پینڈنگ ہے' : 'Account Status: Pending Approval'}</span>
                  <span className="opacity-80 font-normal">{isUrdu ? 'انتظامیہ آپ کا شناختی کارڈ اور ممبرشپ منظور کر رہی ہے۔ جلد مطلع کیا جائے گا۔' : 'The admin team is reviewing your documentation. The premium ID Card will activate instantly on approval.'}</span>
                </div>
              </div>
            )}

            {/* CORE COLUMNS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* COL 1: PREMIUM ID CARD RENDER */}
              <div className="lg:col-span-1 space-y-6">
                <h4 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                  <Shield className="text-emerald-700" />
                  <span>{isUrdu ? 'ڈیجیٹل ممبرشپ کارڈ' : 'Premium Identity Card'}</span>
                </h4>

                {/* 4. PREMIUM FRONT & BACK ID CARD */}
                <div className="space-y-4 max-w-sm mx-auto">
                  {/* FRONT DESIGN */}
                  <div id="print-area-id" className="relative w-full aspect-[1.58/1] rounded-3xl p-5 text-white overflow-hidden shadow-2xl border border-amber-500/20 select-none bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-between">
                    {/* Watermarks & Seals */}
                    <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/[0.04] rounded-full blur-3xl" />
                    <div className="absolute bottom-4 right-4 opacity-10">
                      <Logo lang={lang} variant="emblem" className="w-24 h-24" />
                    </div>

                    {/* Card Header */}
                    <div className="flex justify-between items-center relative z-10 border-b border-amber-500/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Logo lang={lang} variant="emblem" className="w-8 h-8" />
                        <div>
                          <h5 className="text-[10px] font-black tracking-wider text-amber-300">HASNAIN FOUNDATION</h5>
                          <p className="text-[7px] font-bold text-slate-300 -mt-0.5">SERVICE TO HUMANITY</p>
                        </div>
                      </div>
                      <span className="text-[7px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        {currentMember.membership_type.toUpperCase()} MEMBER
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="flex gap-4 items-center my-2 relative z-10">
                      <img 
                        src={currentMember.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                        alt="Face" 
                        className="w-16 h-16 object-cover rounded-xl border border-amber-500/30 shrink-0 shadow-md bg-emerald-950" 
                      />
                      <div className="text-left leading-tight text-xs space-y-0.5 font-bold">
                        <p className="text-[8px] text-slate-400 font-normal">{isUrdu ? 'نام' : 'Name'}</p>
                        <p className="text-white text-sm font-black tracking-tight">{currentMember.full_name}</p>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 font-semibold text-[8px]">
                          <div>
                            <span className="block text-slate-400 font-normal">{isUrdu ? 'رکنیت آئی ڈی' : 'ID Number'}</span>
                            <span className="text-amber-300 font-mono">{currentMember.id}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-normal">{isUrdu ? 'بلڈ گروپ' : 'Blood'}</span>
                            <span className="text-white">{currentMember.blood_group}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="flex justify-between items-end relative z-10 border-t border-amber-500/10 pt-2 text-[7px] font-bold">
                      <div className="text-left space-y-0.5">
                        <span className="block text-[6px] text-slate-400 font-normal">{isUrdu ? 'تاریخِ تنسیخ' : 'Expiry Date'}</span>
                        <span className="text-white font-mono">{currentMember.expiry_date}</span>
                      </div>
                      
                      {/* Secure QR Code simulation */}
                      <div className="bg-white p-0.5 rounded-lg border border-slate-200">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getHasnainFoundationLink(currentMember.id, 'member'))}`} 
                          alt="QR Verification" 
                          className="w-8 h-8 object-contain" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* BACK DESIGN */}
                  <div className="relative w-full aspect-[1.58/1] rounded-3xl p-5 text-white overflow-hidden shadow-2xl border border-slate-700 bg-slate-900 flex flex-col justify-between">
                    <div className="text-left text-[8px] space-y-2 relative z-10 font-bold leading-relaxed">
                      <h5 className="text-amber-300 font-black tracking-wide border-b border-slate-800 pb-1.5 uppercase">{isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}</h5>
                      <ul className="list-disc pl-3 text-slate-400 space-y-0.5 text-[7px]">
                        <li>This card is non-transferable and remains the property of Hasnain Foundation.</li>
                        <li>Spiritual treatment and guidance at our center is completely free.</li>
                        <li>Report any financial anomalies instantly via our central integrity cell.</li>
                      </ul>
                    </div>

                    <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-[7px] font-medium text-slate-400">
                      <div>
                        <span className="block">{isUrdu ? 'مرکزی دفتر' : 'Headquarters'}</span>
                        <span className="text-slate-300">Surjani Town, Sector 4-B, Karachi</span>
                      </div>
                      <div className="text-right">
                        <span className="block font-mono">hasnainfoundation225@gmail.com</span>
                        <span className="text-slate-300 font-mono">hasnain-foundation-com.ai.studio</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={handlePrintIDCard}
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{isUrdu ? 'پرنٹ شناختی کارڈ' : 'Print ID Card'}</span>
                  </button>
                  <button 
                    onClick={handleRenewalRequest}
                    className="py-3 px-4 rounded-xl border border-slate-200 hover:border-amber-500 hover:text-amber-800 text-slate-700 font-bold text-xs bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{isUrdu ? 'درخواستِ تجدید' : 'Renew request'}</span>
                  </button>
                </div>
              </div>

              {/* COL 2: LIVE METRICS & DUROOD/DONATIONS FORM */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* METRICS DASH */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-800 text-white">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'مجموعی درود پاک' : 'My Durood Contributions'}</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">{(currentMember.durood_count || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-amber-600 text-white">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'عطیات / فیسیں' : 'Donations Tracked'}</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">{(currentMember.donations_count || 0).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-800 text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'تقریبات میں شرکت' : 'Events Participated'}</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">{(currentMember.events_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* FORM DUROOD */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md">
                  <h5 className="text-lg font-black text-emerald-950 mb-4 flex items-center gap-2">
                    <BookOpen className="text-emerald-700" />
                    <span>{isUrdu ? 'درود پاک کا تحفہ درج کریں' : 'Log Daily Durood Contribution'}</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'درود شریف کا انتخاب کریں' : 'Select Durood Type'}</label>
                      <select 
                        value={duroodType} 
                        onChange={(e) => setDuroodType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                      >
                        {['درود ابراہیمی', 'درود تاج', 'درود تنجینا', 'درود ناریہ', 'درود شفا'].map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                    </div>
                    <div className="sm:col-span-1">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'تعداد' : 'Count / Quantity'}</label>
                      <input 
                        type="number" 
                        value={duroodCount || ''} 
                        onChange={(e) => setDuroodCount(Number(e.target.value))}
                        placeholder="e.g. 500"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                      />
                    </div>
                    <div className="sm:col-span-1">
                      <button 
                        onClick={submitDurood}
                        disabled={submittingDurood || duroodCount <= 0}
                        className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-extrabold text-xs shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {submittingDurood ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        <span>{isUrdu ? 'ہدیہ پیش کریں' : 'Submit durood'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* FORM DONATIONS/FEES */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md">
                  <h5 className="text-lg font-black text-emerald-950 mb-4 flex items-center gap-2">
                    <DollarSign className="text-amber-500" />
                    <span>{isUrdu ? 'رکنیت فیس یا عطیہ جمع کریں' : 'Submit Membership Fee or Donation Receipt'}</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'رقم (PKR)' : 'Amount (PKR)'}</label>
                      <input 
                        type="number" 
                        value={donationAmount} 
                        onChange={(e) => setDonationAmount(e.target.value)}
                        placeholder="e.g. 1500"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'مقصد (Purpose)' : 'Purpose'}</label>
                      <select 
                        value={donationPurpose} 
                        onChange={(e) => setDonationPurpose(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                      >
                        <option value="Membership Fee">{isUrdu ? 'رکنیت فیس (Membership Fee)' : 'Membership Fee'}</option>
                        <option value="General Welfare">{isUrdu ? 'عام فنڈ (General Welfare)' : 'General Welfare'}</option>
                        <option value="Water RO Filtration">{isUrdu ? 'فلٹریشن واٹر پلانٹ (Water Plant)' : 'Water RO Filtration'}</option>
                        <option value="Orphan Schooling">{isUrdu ? 'یتیم بچوں کی تعلیم (Orphan Schooling)' : 'Orphan Schooling'}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'پیمنٹ کا طریقہ' : 'Payment Method'}</label>
                      <select 
                        value={paymentMethod} 
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold"
                      >
                        <option value="EasyPaisa">EasyPaisa</option>
                        <option value="JazzCash">JazzCash</option>
                        <option value="SadaPay">SadaPay</option>
                        <option value="HBL Bank Transfer">HBL Bank Transfer</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{isUrdu ? 'ٹرانزیکشن ID *' : 'Transaction ID *'}</label>
                      <input 
                        type="text" 
                        value={txnId} 
                        onChange={(e) => setTxnId(e.target.value)}
                        placeholder="e.g. TXN98321"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-600 bg-slate-50/50 font-bold font-mono" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={submitDonation}
                    disabled={submittingDonation || !donationAmount || !txnId}
                    className="w-full mt-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm shadow-md cursor-pointer transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {submittingDonation ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    <span>{isUrdu ? 'رسید جمع کریں' : 'Log Donation / Fee'}</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: VOLUNTEER DASHBOARD */}
        {view === 'volunteer-dash' && currentVolunteer && (
          <motion.div 
            key="volunteer-dash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* WELCOME BAR */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 text-center md:text-left">
                <img 
                  src={currentVolunteer.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
                  alt="Avatar" 
                  className="w-20 h-20 object-cover rounded-full border-4 border-amber-500/20 shadow-md"
                />
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-300">
                    {isUrdu ? `خوش آمدید، ${currentVolunteer.full_name}` : `Welcome, ${currentVolunteer.full_name}`}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 shrink-0 text-slate-300 text-xs font-bold justify-center md:justify-start">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/20 text-amber-400 capitalize">
                      {currentVolunteer.assigned_department}
                    </span>
                    <span className="font-mono">{currentVolunteer.id}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => { setCurrentVolunteer(null); setView('home'); }}
                  className="px-4 py-2 text-xs font-bold rounded-xl border border-slate-700 text-slate-300 hover:text-white bg-slate-800 cursor-pointer transition-colors"
                >
                  {isUrdu ? 'لاگ آؤٹ' : 'Log Out'}
                </button>
              </div>
            </div>

            {/* STATUS BOX */}
            {currentVolunteer.status !== 'approved' && currentVolunteer.status !== 'active' && (
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-bold flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <div>
                  <span className="block font-black uppercase text-xs text-amber-500">{isUrdu ? 'اندراج زیرِ جائزہ ہے' : 'Status: Pending Verification'}</span>
                  <span className="opacity-80 font-normal">{isUrdu ? 'رضاکار مہمات میں فرائض تفویض کرنے کے لیے فاؤنڈیشن انتظامیہ آپ کے فارم کی تصدیق کر رہی ہے۔' : 'The Volunteer Cell is verifying your skills and availability. Digital ID Card is unlocked instantly upon review.'}</span>
                </div>
              </div>
            )}

            {/* CORE COLUMNS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* CARD COL */}
              <div className="lg:col-span-1 space-y-6">
                <h4 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                  <Shield className="text-emerald-700" />
                  <span>{isUrdu ? 'رضاکار شناختی کارڈ' : 'Volunteer Identity Card'}</span>
                </h4>

                {/* PREMIUM ID CARD */}
                <div className="space-y-4 max-w-sm mx-auto">
                  {/* FRONT */}
                  <div className="relative w-full aspect-[1.58/1] rounded-3xl p-5 text-white overflow-hidden shadow-2xl border border-amber-500/20 select-none bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/[0.04] rounded-full blur-3xl" />
                    <div className="absolute bottom-4 right-4 opacity-10">
                      <Logo lang={lang} variant="emblem" className="w-24 h-24" />
                    </div>

                    <div className="flex justify-between items-center relative z-10 border-b border-amber-500/10 pb-2">
                      <div className="flex items-center gap-2">
                        <Logo lang={lang} variant="emblem" className="w-8 h-8" />
                        <div>
                          <h5 className="text-[10px] font-black tracking-wider text-amber-300">HASNAIN FOUNDATION</h5>
                          <p className="text-[7px] font-bold text-slate-300 -mt-0.5">VOLUNTEER CELL</p>
                        </div>
                      </div>
                      <span className="text-[7px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        VOLUNTEER
                      </span>
                    </div>

                    <div className="flex gap-4 items-center my-2 relative z-10">
                      <img 
                        src={currentVolunteer.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'} 
                        alt="Face" 
                        className="w-16 h-16 object-cover rounded-xl border border-amber-500/30 shrink-0 shadow-md bg-emerald-950" 
                      />
                      <div className="text-left leading-tight text-xs space-y-0.5 font-bold">
                        <p className="text-[8px] text-slate-400 font-normal">{isUrdu ? 'نام' : 'Name'}</p>
                        <p className="text-white text-sm font-black tracking-tight">{currentVolunteer.full_name}</p>
                        
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1 font-semibold text-[8px]">
                          <div>
                            <span className="block text-slate-400 font-normal">{isUrdu ? 'شناختی نمبر' : 'Volunteer ID'}</span>
                            <span className="text-amber-300 font-mono">{currentVolunteer.id}</span>
                          </div>
                          <div>
                            <span className="block text-slate-400 font-normal">{isUrdu ? 'بلڈ گروپ' : 'Blood'}</span>
                            <span className="text-white">{currentVolunteer.blood_group}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-end relative z-10 border-t border-amber-500/10 pt-2 text-[7px] font-bold">
                      <div className="text-left space-y-0.5">
                        <span className="block text-[6px] text-slate-400 font-normal">{isUrdu ? 'شعبہ' : 'Department'}</span>
                        <span className="text-white capitalize">{currentVolunteer.assigned_department}</span>
                      </div>
                      
                      <div className="bg-white p-0.5 rounded-lg border border-slate-200">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getHasnainFoundationLink(currentVolunteer.id, 'member'))}`} 
                          alt="QR Verification" 
                          className="w-8 h-8 object-contain" 
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePrintIDCard}
                  className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isUrdu ? 'پرنٹ شناختی کارڈ' : 'Print ID Card'}</span>
                </button>
              </div>

              {/* DETAILS & DUTIES COL */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* LIVE METRICS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-amber-600 text-white">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'مہمات میں حاضری' : 'Attendance Logged'}</span>
                      <span className="text-2xl font-black text-emerald-950 font-mono">{(currentVolunteer.attendance_count || 0)} Sessions</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-emerald-800 text-white">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'کارکردگی کی ریٹنگ' : 'Performance Star'}</span>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xl font-black text-emerald-950 font-mono">{currentVolunteer.performance_rating || 5}</span>
                        <div className="flex text-amber-500 text-xs">
                          {Array.from({ length: currentVolunteer.performance_rating || 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-slate-800 text-white">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-[10px] text-slate-500 font-bold uppercase">{isUrdu ? 'تفویض کردہ شعبہ' : 'Welfare Department'}</span>
                      <span className="text-sm font-black text-emerald-950 capitalize">{currentVolunteer.assigned_department}</span>
                    </div>
                  </div>
                </div>

                {/* VOLUNTEER ASSIGNED DUTIES */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md">
                  <h5 className="text-lg font-black text-emerald-950 mb-4 flex items-center gap-2">
                    <Award className="text-amber-500" />
                    <span>{isUrdu ? 'تفویض شدہ فرائض اور امور' : 'Assigned Duties & Active Duties'}</span>
                  </h5>
                  
                  {currentVolunteer.assigned_duties && currentVolunteer.assigned_duties.length > 0 ? (
                    <div className="space-y-3 font-bold text-xs sm:text-sm">
                      {currentVolunteer.assigned_duties.map((duty, index) => (
                        <div key={index} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                            <span className="text-emerald-950">{duty}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 font-extrabold text-[10px]">
                            {isUrdu ? 'فعال' : 'In Progress'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-sm font-bold">
                      {isUrdu ? 'کوئی فعال ڈیوٹی تفویض نہیں کی گئی ہے۔' : 'No active duties assigned yet.'}
                    </div>
                  )}
                </div>

                {/* VOLUNTEER INFO PANEL */}
                <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-3xl shadow-md grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{isUrdu ? 'دستیابی کی تفصیل' : 'Availability Profile'}</h5>
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <p className="text-sm font-black text-emerald-950">{currentVolunteer.availability}</p>
                      <p className="text-xs text-slate-500 mt-1">{isUrdu ? 'انتظامیہ آپ کی دلالت کی تاریخیں نوٹ کر چکی ہے۔' : 'The management tracks this available slot for campaigns.'}</p>
                    </div>
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{isUrdu ? 'مہارت کے شعبے' : 'Registered Skills'}</h5>
                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                      <p className="text-sm font-black text-emerald-950 capitalize">{currentVolunteer.skills || 'General Social Work'}</p>
                      <p className="text-xs text-slate-500 mt-1">{isUrdu ? 'آپ کو اسی مہارت کے مطابق فرائض سونپے جائیں گے۔' : 'Campaign duties are targeted based on your logged experience.'}</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
