import React, { useState } from 'react';
import { Users, UserCheck, Search, RefreshCw, Shield, Sparkles } from 'lucide-react';
import Logo from './Logo';
import { getHasnainFoundationLink } from '../lib/utils';

interface MemberVolunteerCRMProps {
  lang: 'en' | 'ur';
  activeTab: 'members' | 'volunteers';
  isUrdu: boolean;
  members: any[];
  volunteers: any[];
  onUpdateMember: (memberId: string, updatedFields: any) => Promise<void>;
  onDeleteMember: (memberId: string) => Promise<void>;
  onUpdateVolunteer: (volunteerId: string, updatedFields: any) => Promise<void>;
  onDeleteVolunteer: (volunteerId: string) => Promise<void>;
  setSelectedDocument: (doc: { name: string; url: string; type: string } | null) => void;
  loadDashboardData: () => Promise<void> | void;
}

export default function MemberVolunteerCRM({
  lang,
  activeTab,
  isUrdu,
  members,
  volunteers,
  onUpdateMember,
  onDeleteMember,
  onUpdateVolunteer,
  onDeleteVolunteer,
  setSelectedDocument,
  loadDashboardData
}: MemberVolunteerCRMProps) {

  // Member states
  const [memberSearch, setMemberSearch] = useState('');
  const [memberFilterStatus, setMemberFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any | null>(null);
  const [memberNotes, setMemberNotes] = useState('');
  const [memberStatusState, setMemberStatusState] = useState('pending');

  // Volunteer states
  const [volunteerSearch, setVolunteerSearch] = useState('');
  const [volunteerFilterStatus, setVolunteerFilterStatus] = useState('all');
  const [selectedVolunteer, setSelectedVolunteer] = useState<any | null>(null);
  const [volunteerNotes, setVolunteerNotes] = useState('');
  const [volunteerStatusState, setVolunteerStatusState] = useState('pending');

  // Reload States
  const [isReloading, setIsReloading] = useState(false);
  const [reloadMessage, setReloadMessage] = useState<string | null>(null);

  const handleReload = async () => {
    setIsReloading(true);
    setReloadMessage(null);
    try {
      if (loadDashboardData) {
        await loadDashboardData();
      }
      setReloadMessage(
        isUrdu 
          ? 'ڈیٹا بیس کامیابی سے ریفریش کر دیا گیا ہے۔' 
          : 'CRM database reloaded successfully from server & local cache.'
      );
      setTimeout(() => setReloadMessage(null), 3500);
    } catch (err) {
      console.error('Reload failed:', err);
      setReloadMessage(
        isUrdu 
          ? 'ریفریش کرنے میں ناکامی۔ دوبارہ کوشش کریں۔' 
          : 'Failed to reload CRM database.'
      );
      setTimeout(() => setReloadMessage(null), 3500);
    } finally {
      setIsReloading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {reloadMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-fade-in">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{reloadMessage}</span>
        </div>
      )}

      {/* ==========================================
          TAB: MEMBERS PANEL & CRM
          ========================================== */}
      {activeTab === 'members' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-800" />
                <span>{isUrdu ? 'رکنیت انتظامیہ کونسل' : 'Membership CRM Panel'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu ? 'مستقل اراکین کی رجسٹریشن، منظوری اور تفصیلی ریکارڈ چیک کریں۔' : 'Approve, reject, edit, or suspend official Hasnain Foundation members.'}
              </p>
            </div>
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-emerald-700' : ''}`} />
              <span>
                {isReloading 
                  ? (isUrdu ? 'ریفریش ہو رہا ہے...' : 'Reloading...') 
                  : (isUrdu ? 'ریفریش ڈیٹا' : 'Reload')}
              </span>
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isUrdu ? 'نام، والد کا نام، شناختی کارڈ یا ای میل تلاش کریں...' : 'Search members by name, CNIC, mobile, email, ID...'}
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setMemberFilterStatus(status)}
                  className={`flex-1 py-2 text-[10px] font-black rounded-xl border uppercase transition-all cursor-pointer ${
                    memberFilterStatus === status
                      ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'all' ? (isUrdu ? 'تمام' : 'All') : status}
                </button>
              ))}
            </div>
          </div>

          {/* Main List and Details Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Member List Pane */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 max-h-[600px] overflow-y-auto">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                {isUrdu ? 'اراکین کی فہرست' : 'Registered Members'} ({members.length})
              </h4>
              <div className="space-y-2">
                {members
                  .filter(m => {
                    if (memberFilterStatus !== 'all' && m.status !== memberFilterStatus) return false;
                    if (!memberSearch) return true;
                    const s = memberSearch.toLowerCase();
                    return (
                      (m.full_name || '').toLowerCase().includes(s) ||
                      (m.id || '').toLowerCase().includes(s) ||
                      (m.cnic || '').includes(s) ||
                      (m.mobile || '').includes(s) ||
                      (m.email || '').toLowerCase().includes(s)
                    );
                  })
                  .map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedMember(m);
                        setMemberNotes(m.internal_notes || '');
                        setMemberStatusState(m.status || 'pending');
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedMember?.id === m.id
                          ? 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-slate-50/30 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={m.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                          alt="Profile"
                          className="w-10 h-10 object-cover rounded-full border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">{m.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{m.id} • {m.mobile}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                        m.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        m.status === 'suspended' ? 'bg-amber-100 text-amber-800' :
                        m.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {m.status}
                      </span>
                    </button>
                  ))}
                {members.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    {isUrdu ? 'کوئی اراکین نہیں ملے' : 'No registered members found.'}
                  </div>
                )}
              </div>
            </div>

            {/* Member Details Pane */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
              {selectedMember ? (
                <div className="space-y-6">
                  {/* Header Area */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-150">
                    <div className="flex gap-4 items-center">
                      <div className="relative group">
                        <img
                          src={selectedMember.profile_photo}
                          alt="Profile"
                          className="w-20 h-20 object-cover rounded-2xl border-2 border-emerald-800 shadow-md bg-slate-50"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-opacity">
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onloadend = () => {
                                  onUpdateMember(selectedMember.id, { profile_photo: r.result as string })
                                    .then(() => {
                                      setSelectedMember((prev: any) => ({ ...prev, profile_photo: r.result as string }));
                                    });
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{selectedMember.full_name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedMember.id} ({selectedMember.membership_type} Member)</p>
                        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          selectedMember.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          selectedMember.status === 'suspended' ? 'bg-amber-100 text-amber-800' :
                          selectedMember.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedMember.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onDeleteMember(selectedMember.id).then(() => setSelectedMember(null))}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {isUrdu ? 'حذف کریں' : 'Delete Member'}
                      </button>
                    </div>
                  </div>

                  {/* Personal Details Fields */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold text-emerald-850 uppercase tracking-wider">
                      {isUrdu ? 'ذاتی معلومات (Editable)' : 'Personal Information (Editable)'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'پورا نام' : 'Full Name'}</label>
                        <input
                          type="text"
                          value={selectedMember.full_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, full_name: val }));
                            onUpdateMember(selectedMember.id, { full_name: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'والد کا نام' : 'Father Name'}</label>
                        <input
                          type="text"
                          value={selectedMember.father_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, father_name: val }));
                            onUpdateMember(selectedMember.id, { father_name: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'شناختی کارڈ (CNIC)' : 'CNIC Number'}</label>
                        <input
                          type="text"
                          value={selectedMember.cnic}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, cnic: val }));
                            onUpdateMember(selectedMember.id, { cnic: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'موبائل نمبر' : 'Mobile Number'}</label>
                        <input
                          type="text"
                          value={selectedMember.mobile}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, mobile: val }));
                            onUpdateMember(selectedMember.id, { mobile: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'واٹس ایپ' : 'WhatsApp'}</label>
                        <input
                          type="text"
                          value={selectedMember.whatsapp}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, whatsapp: val }));
                            onUpdateMember(selectedMember.id, { whatsapp: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'ای میل' : 'Email Address'}</label>
                        <input
                          type="email"
                          value={selectedMember.email}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, email: val }));
                            onUpdateMember(selectedMember.id, { email: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'تاریخِ پیدائش' : 'Date of Birth'}</label>
                        <input
                          type="date"
                          value={selectedMember.date_of_birth}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, date_of_birth: val }));
                            onUpdateMember(selectedMember.id, { date_of_birth: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'صنف (Gender)' : 'Gender'}</label>
                        <select
                          value={selectedMember.gender}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, gender: val }));
                            onUpdateMember(selectedMember.id, { gender: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold bg-white"
                        >
                          <option value="Male">{isUrdu ? 'مرد' : 'Male'}</option>
                          <option value="Female">{isUrdu ? 'خاتون' : 'Female'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'پیشہ (Occupation)' : 'Occupation'}</label>
                        <input
                          type="text"
                          value={selectedMember.occupation}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, occupation: val }));
                            onUpdateMember(selectedMember.id, { occupation: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'بلڈ گروپ' : 'Blood Group'}</label>
                        <select
                          value={selectedMember.blood_group}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, blood_group: val }));
                            onUpdateMember(selectedMember.id, { blood_group: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold bg-white"
                        >
                          {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'رکنیت کی قسم' : 'Membership Type'}</label>
                        <select
                          value={selectedMember.membership_type}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, membership_type: val }));
                            onUpdateMember(selectedMember.id, { membership_type: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold bg-white"
                        >
                          {['Regular', 'Premium', 'Life Time', 'Honorary'].map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'شہر' : 'City'}</label>
                        <input
                          type="text"
                          value={selectedMember.city}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedMember((prev: any) => ({ ...prev, city: val }));
                            onUpdateMember(selectedMember.id, { city: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'مکمل پتہ' : 'Full Address'}</label>
                      <textarea
                        value={selectedMember.address}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedMember((prev: any) => ({ ...prev, address: val }));
                          onUpdateMember(selectedMember.id, { address: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Document Uploads section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold text-emerald-850 uppercase tracking-wider">
                      {isUrdu ? 'شناختی دستاویزات (Documents)' : 'Verification Documents'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* CNIC FRONT */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between gap-2.5">
                        <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'شناختی کارڈ (سامنے کی تصویر)' : 'CNIC Front Photo'}</span>
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[1.6/1] bg-white">
                          <img
                            src={selectedMember.cnic_front}
                            alt="CNIC Front"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedDocument({ name: 'CNIC Front', url: selectedMember.cnic_front, type: 'image' })}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDocument({ name: 'CNIC Front', url: selectedMember.cnic_front, type: 'image' })}
                              className="p-1 bg-white hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold cursor-pointer"
                            >
                              View
                            </button>
                            <label className="p-1 bg-emerald-800 hover:bg-emerald-900 rounded text-white text-[10px] font-bold cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => {
                                      onUpdateMember(selectedMember.id, { cnic_front: r.result as string })
                                        .then(() => setSelectedMember((prev: any) => ({ ...prev, cnic_front: r.result as string })));
                                    };
                                    r.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* CNIC BACK */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between gap-2.5">
                        <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'شناختی کارڈ (پیچھے کی تصویر)' : 'CNIC Back Photo'}</span>
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[1.6/1] bg-white">
                          <img
                            src={selectedMember.cnic_back}
                            alt="CNIC Back"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedDocument({ name: 'CNIC Back', url: selectedMember.cnic_back, type: 'image' })}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDocument({ name: 'CNIC Back', url: selectedMember.cnic_back, type: 'image' })}
                              className="p-1 bg-white hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold cursor-pointer"
                            >
                              View
                            </button>
                            <label className="p-1 bg-emerald-800 hover:bg-emerald-900 rounded text-white text-[10px] font-bold cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => {
                                      onUpdateMember(selectedMember.id, { cnic_back: r.result as string })
                                        .then(() => setSelectedMember((prev: any) => ({ ...prev, cnic_back: r.result as string })));
                                    };
                                    r.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes & Status Approval */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-4">
                    <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-slate-600" />
                      <span>{isUrdu ? 'انتظامی منظوری و نوٹس' : 'Admin Approval & Status'}</span>
                    </h5>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'اندرونی نوٹس' : 'Internal Notes'}</label>
                        <textarea
                          value={memberNotes}
                          onChange={(e) => setMemberNotes(e.target.value)}
                          placeholder={isUrdu ? 'رکن کے بارے میں کوئی اضافی نوٹ یہاں درج کریں...' : 'Write custom audit remarks or verification details...'}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'رکنیت کا درجہ تبدیل کریں' : 'Update Verification Status'}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['pending', 'approved', 'rejected', 'suspended'].map(s => (
                              <button
                                key={s}
                                onClick={() => setMemberStatusState(s)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                                  memberStatusState === s
                                    ? s === 'approved' ? 'bg-emerald-800 border-emerald-800 text-white' :
                                      s === 'rejected' ? 'bg-rose-800 border-rose-800 text-white' :
                                      s === 'suspended' ? 'bg-amber-600 border-amber-600 text-white' :
                                      'bg-blue-800 border-blue-800 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onUpdateMember(selectedMember.id, { status: memberStatusState, internal_notes: memberNotes })
                              .then(() => {
                                setSelectedMember((prev: any) => ({ ...prev, status: memberStatusState, internal_notes: memberNotes }));
                              });
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md cursor-pointer transition-colors"
                        >
                          {isUrdu ? 'محفوظ کریں' : 'Save Status & Notes'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM DIGITAL MEMBERSHIP CARD (ONLY SHOWN IF APPROVED) */}
                  {selectedMember.status === 'approved' && (
                    <div className="border border-amber-500/15 rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl space-y-4">
                      <h5 className="text-xs font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>{isUrdu ? 'آٹو جنریٹڈ پریمیم شناختی کارڈ' : 'Auto Generated Premium Identity Card'}</span>
                      </h5>

                      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        {/* FRONT CARD */}
                        <div className="relative w-full max-w-[320px] aspect-[1.58/1] rounded-2xl p-4 text-white overflow-hidden shadow-lg border border-amber-500/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-between">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] rounded-full blur-2xl" />
                          <div className="flex justify-between items-center relative z-10 border-b border-amber-500/10 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Logo lang={lang} variant="emblem" className="w-6 h-6" />
                              <div>
                                <h5 className="text-[8px] font-black tracking-wider text-amber-300">HASNAIN FOUNDATION</h5>
                                <p className="text-[5px] font-bold text-slate-300 -mt-1">SERVICE TO HUMANITY</p>
                              </div>
                            </div>
                            <span className="text-[6px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                              {selectedMember.membership_type}
                            </span>
                          </div>

                          <div className="flex gap-3 items-center my-1 relative z-10">
                            <img
                              src={selectedMember.profile_photo}
                              alt="Face"
                              className="w-12 h-12 object-cover rounded-lg border border-amber-500/30 shrink-0 shadow bg-emerald-950"
                            />
                            <div className="text-left leading-tight text-[10px] space-y-0.5 font-bold min-w-0">
                              <p className="text-[6px] text-slate-400 font-normal">{isUrdu ? 'نام' : 'Name'}</p>
                              <p className="text-white text-xs font-black truncate">{selectedMember.full_name}</p>
                              
                              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5 font-semibold text-[6px]">
                                <div>
                                  <span className="block text-slate-400 font-normal">{isUrdu ? 'رکنیت آئی ڈی' : 'ID Number'}</span>
                                  <span className="text-amber-300 font-mono">{selectedMember.id}</span>
                                </div>
                                <div>
                                  <span className="block text-slate-400 font-normal">{isUrdu ? 'بلڈ گروپ' : 'Blood'}</span>
                                  <span className="text-white">{selectedMember.blood_group}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-end relative z-10 border-t border-amber-500/10 pt-1 text-[6px] font-bold">
                            <div className="text-left space-y-0.5">
                              <span className="block text-[5px] text-slate-400 font-normal">{isUrdu ? 'تاریخِ تنسیخ' : 'Expiry Date'}</span>
                              <span className="text-white font-mono">{selectedMember.expiry_date}</span>
                            </div>
                            <div className="bg-white p-0.5 rounded border border-slate-200">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getHasnainFoundationLink(selectedMember.id, 'member'))}`}
                                alt="QR"
                                className="w-6 h-6 object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* BACK CARD */}
                        <div className="relative w-full max-w-[320px] aspect-[1.58/1] rounded-2xl p-4 text-white overflow-hidden shadow-lg border border-slate-700 bg-slate-900 flex flex-col justify-between">
                          <div className="text-left text-[6px] space-y-1 relative z-10 font-bold leading-relaxed">
                            <h5 className="text-amber-300 font-black tracking-wide border-b border-slate-800 pb-1 uppercase">{isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}</h5>
                            <ul className="list-disc pl-3 text-slate-400 space-y-0.5 text-[5px]">
                              <li>This card remains the property of Hasnain Foundation.</li>
                              <li>Spiritual treatment and guidance at our center is free.</li>
                              <li>Report financial anomalies via our integrity cell.</li>
                            </ul>
                          </div>
                          <div className="border-t border-slate-800 pt-1 flex justify-between items-center text-[5px] font-medium text-slate-400">
                            <div>
                              <span className="block">{isUrdu ? 'مرکزی دفتر' : 'Headquarters'}</span>
                              <span className="text-slate-300">Sector 4-B, Surjani Town, Karachi</span>
                            </div>
                            <div className="text-right">
                              <span className="block font-mono">hasnainfoundation225@gmail.com</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-24 text-slate-400 text-xs">
                  {isUrdu ? 'تفصیلات دیکھنے کے لیے اراکین کی فہرست سے کسی فرد کا انتخاب کریں۔' : 'Select a registered member from the left list to view/edit profile or manage approvals.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          TAB: VOLUNTEERS PANEL & CRM
          ========================================== */}
      {activeTab === 'volunteers' && (
        <div className="space-y-6 text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-emerald-800" />
                <span>{isUrdu ? 'رضاکار انتظامیہ کونسل' : 'Volunteer CRM Panel'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isUrdu ? 'خدمتِ خلق کے رضاکاروں کی رجسٹریشن، محکمانہ فرائض اور تجربات منظم کریں۔' : 'Approve, reject, edit, or suspend official Hasnain Foundation volunteers.'}
              </p>
            </div>
            <button
              onClick={handleReload}
              disabled={isReloading}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReloading ? 'animate-spin text-emerald-700' : ''}`} />
              <span>
                {isReloading 
                  ? (isUrdu ? 'ریفریش ہو رہا ہے...' : 'Reloading...') 
                  : (isUrdu ? 'ریفریش ڈیٹا' : 'Reload')}
              </span>
            </button>
          </div>

          {/* Search & Status Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder={isUrdu ? 'نام، مہارت، شعبہ یا موبائل تلاش کریں...' : 'Search volunteers by name, skills, department, ID...'}
                value={volunteerSearch}
                onChange={(e) => setVolunteerSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'pending', 'approved', 'rejected', 'suspended'].map(status => (
                <button
                  key={status}
                  onClick={() => setVolunteerFilterStatus(status)}
                  className={`flex-1 py-2 text-[10px] font-black rounded-xl border uppercase transition-all cursor-pointer ${
                    volunteerFilterStatus === status
                      ? 'bg-emerald-800 border-emerald-800 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {status === 'all' ? (isUrdu ? 'تمام' : 'All') : status}
                </button>
              ))}
            </div>
          </div>

          {/* Main List and Details Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Volunteer List Pane */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3 max-h-[600px] overflow-y-auto">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">
                {isUrdu ? 'رضاکاروں کی فہرست' : 'Registered Volunteers'} ({volunteers.length})
              </h4>
              <div className="space-y-2">
                {volunteers
                  .filter(v => {
                    if (volunteerFilterStatus !== 'all' && v.status !== volunteerFilterStatus) return false;
                    if (!volunteerSearch) return true;
                    const s = volunteerSearch.toLowerCase();
                    return (
                      (v.full_name || '').toLowerCase().includes(s) ||
                      (v.id || '').toLowerCase().includes(s) ||
                      (v.skills || '').toLowerCase().includes(s) ||
                      (v.mobile || '').includes(s) ||
                      (v.assigned_department || '').toLowerCase().includes(s)
                    );
                  })
                  .map(v => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVolunteer(v);
                        setVolunteerNotes(v.internal_notes || '');
                        setVolunteerStatusState(v.status || 'pending');
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selectedVolunteer?.id === v.id
                          ? 'bg-emerald-50/50 border-emerald-600 ring-1 ring-emerald-600'
                          : 'bg-slate-50/30 hover:bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={v.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'}
                          alt="Profile"
                          className="w-10 h-10 object-cover rounded-full border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-extrabold text-xs text-slate-900 truncate">{v.full_name}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{v.id} • {v.assigned_department}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase shrink-0 ${
                        v.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                        v.status === 'suspended' ? 'bg-amber-100 text-amber-800' :
                        v.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {v.status}
                      </span>
                    </button>
                  ))}
                {volunteers.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-xs">
                    {isUrdu ? 'کوئی رضاکار نہیں ملے' : 'No registered volunteers found.'}
                  </div>
                )}
              </div>
            </div>

            {/* Volunteer Details Pane */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-6">
              {selectedVolunteer ? (
                <div className="space-y-6">
                  {/* Header Area */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-150">
                    <div className="flex gap-4 items-center">
                      <div className="relative group">
                        <img
                          src={selectedVolunteer.profile_photo}
                          alt="Profile"
                          className="w-20 h-20 object-cover rounded-2xl border-2 border-emerald-800 shadow-md bg-slate-50"
                        />
                        <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center text-[10px] font-bold text-white cursor-pointer transition-opacity">
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const r = new FileReader();
                                r.onloadend = () => {
                                  onUpdateVolunteer(selectedVolunteer.id, { profile_photo: r.result as string })
                                    .then(() => setSelectedVolunteer((prev: any) => ({ ...prev, profile_photo: r.result as string })));
                                };
                                r.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <div>
                        <h4 className="text-base font-black text-slate-900">{selectedVolunteer.full_name}</h4>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedVolunteer.id} ({selectedVolunteer.assigned_department})</p>
                        <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          selectedVolunteer.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          selectedVolunteer.status === 'suspended' ? 'bg-amber-100 text-amber-800' :
                          selectedVolunteer.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedVolunteer.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => onDeleteVolunteer(selectedVolunteer.id).then(() => setSelectedVolunteer(null))}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        {isUrdu ? 'حذف کریں' : 'Delete Volunteer'}
                      </button>
                    </div>
                  </div>

                  {/* Personal Details Fields */}
                  <div className="space-y-4">
                    <h5 className="text-xs font-extrabold text-emerald-850 uppercase tracking-wider">
                      {isUrdu ? 'ذاتی و پیشہ ورانہ تفصیلات' : 'Personal & Professional Fields (Editable)'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'پورا نام' : 'Full Name'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.full_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, full_name: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { full_name: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'والد کا نام' : 'Father Name'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.father_name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, father_name: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { father_name: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'شناختی کارڈ (CNIC)' : 'CNIC Number'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.cnic}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, cnic: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { cnic: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'موبائل نمبر' : 'Mobile Number'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.mobile}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, mobile: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { mobile: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'واٹس ایپ' : 'WhatsApp'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.whatsapp}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, whatsapp: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { whatsapp: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'ای میل' : 'Email Address'}</label>
                        <input
                          type="email"
                          value={selectedVolunteer.email}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, email: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { email: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'شہر' : 'City'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.city}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, city: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { city: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'تعینات شعبہ' : 'Assigned Department'}</label>
                        <select
                          value={selectedVolunteer.assigned_department}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, assigned_department: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { assigned_department: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold bg-white"
                        >
                          {['Welfare Support', 'Spiritual Help', 'Medical Desk', 'Disaster Relief', 'IT & Media', 'Ration Distribution'].map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'دستیابی' : 'Availability'}</label>
                        <select
                          value={selectedVolunteer.availability}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, availability: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { availability: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold bg-white"
                        >
                          {['Weekends', 'Weekdays', 'Evenings', 'Full-Time', 'On-Call Emergency'].map(av => (
                            <option key={av} value={av}>{av}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'ایمرجنسی رابطہ' : 'Emergency Contact'}</label>
                        <input
                          type="text"
                          value={selectedVolunteer.emergency_contact}
                          onChange={(e) => {
                            const val = e.target.value;
                            setSelectedVolunteer((prev: any) => ({ ...prev, emergency_contact: val }));
                            onUpdateVolunteer(selectedVolunteer.id, { emergency_contact: val });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'مہارتیں (Skills)' : 'Skills'}</label>
                      <input
                        type="text"
                        value={selectedVolunteer.skills}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedVolunteer((prev: any) => ({ ...prev, skills: val }));
                          onUpdateVolunteer(selectedVolunteer.id, { skills: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'سابقہ تجربہ' : 'Prior Experience'}</label>
                      <textarea
                        value={selectedVolunteer.experience}
                        onChange={(e) => {
                          const val = e.target.value;
                          setSelectedVolunteer((prev: any) => ({ ...prev, experience: val }));
                          onUpdateVolunteer(selectedVolunteer.id, { experience: val });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 font-semibold resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  {/* Document Uploads section */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold text-emerald-850 uppercase tracking-wider">
                      {isUrdu ? 'شناختی دستاویزات (Documents)' : 'Verification Documents'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* CNIC FRONT */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between gap-2.5">
                        <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'شناختی کارڈ (سامنے کی تصویر)' : 'CNIC Front Photo'}</span>
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[1.6/1] bg-white">
                          <img
                            src={selectedVolunteer.cnic_front}
                            alt="CNIC Front"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedDocument({ name: 'CNIC Front', url: selectedVolunteer.cnic_front, type: 'image' })}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDocument({ name: 'CNIC Front', url: selectedVolunteer.cnic_front, type: 'image' })}
                              className="p-1 bg-white hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold cursor-pointer"
                            >
                              View
                            </button>
                            <label className="p-1 bg-emerald-800 hover:bg-emerald-900 rounded text-white text-[10px] font-bold cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => {
                                      onUpdateVolunteer(selectedVolunteer.id, { cnic_front: r.result as string })
                                        .then(() => setSelectedVolunteer((prev: any) => ({ ...prev, cnic_front: r.result as string })));
                                    };
                                    r.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* CNIC BACK */}
                      <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 flex flex-col justify-between gap-2.5">
                        <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'شناختی کارڈ (پیچھے کی تصویر)' : 'CNIC Back Photo'}</span>
                        <div className="relative group rounded-lg overflow-hidden border border-slate-200 aspect-[1.6/1] bg-white">
                          <img
                            src={selectedVolunteer.cnic_back}
                            alt="CNIC Back"
                            className="w-full h-full object-cover cursor-pointer"
                            onClick={() => setSelectedDocument({ name: 'CNIC Back', url: selectedVolunteer.cnic_back, type: 'image' })}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedDocument({ name: 'CNIC Back', url: selectedVolunteer.cnic_back, type: 'image' })}
                              className="p-1 bg-white hover:bg-slate-100 rounded text-slate-700 text-[10px] font-bold cursor-pointer"
                            >
                              View
                            </button>
                            <label className="p-1 bg-emerald-800 hover:bg-emerald-900 rounded text-white text-[10px] font-bold cursor-pointer">
                              Replace
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const r = new FileReader();
                                    r.onloadend = () => {
                                      onUpdateVolunteer(selectedVolunteer.id, { cnic_back: r.result as string })
                                        .then(() => setSelectedVolunteer((prev: any) => ({ ...prev, cnic_back: r.result as string })));
                                    };
                                    r.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Admin Notes & Status Approval */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-4">
                    <h5 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Shield className="w-4 h-4 text-slate-600" />
                      <span>{isUrdu ? 'انتظامی منظوری و نوٹس' : 'Admin Approval & Status'}</span>
                    </h5>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">{isUrdu ? 'اندرونی نوٹس' : 'Internal Notes'}</label>
                        <textarea
                          value={volunteerNotes}
                          onChange={(e) => setVolunteerNotes(e.target.value)}
                          placeholder={isUrdu ? 'رضاکار کے بارے میں کوئی اضافی نوٹ یہاں درج کریں...' : 'Write custom audit remarks or volunteer notes...'}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-600 bg-white resize-none"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-500 block">{isUrdu ? 'درجہ تبدیل کریں' : 'Update Status'}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['pending', 'approved', 'rejected', 'suspended'].map(s => (
                              <button
                                key={s}
                                onClick={() => setVolunteerStatusState(s)}
                                className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border transition-all cursor-pointer ${
                                  volunteerStatusState === s
                                    ? s === 'approved' ? 'bg-emerald-800 border-emerald-800 text-white' :
                                      s === 'rejected' ? 'bg-rose-800 border-rose-800 text-white' :
                                      s === 'suspended' ? 'bg-amber-600 border-amber-600 text-white' :
                                      'bg-blue-800 border-blue-800 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onUpdateVolunteer(selectedVolunteer.id, { status: volunteerStatusState, internal_notes: volunteerNotes })
                              .then(() => {
                                setSelectedVolunteer((prev: any) => ({ ...prev, status: volunteerStatusState, internal_notes: volunteerNotes }));
                              });
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-xs shadow-md cursor-pointer transition-colors"
                        >
                          {isUrdu ? 'محفوظ کریں' : 'Save Status & Notes'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* PREMIUM DIGITAL VOLUNTEER CARD (ONLY SHOWN IF APPROVED) */}
                  {selectedVolunteer.status === 'approved' && (
                    <div className="border border-amber-500/15 rounded-2xl p-5 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-xl space-y-4">
                      <h5 className="text-xs font-extrabold text-amber-300 uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>{isUrdu ? 'آٹو جنریٹڈ پریمیم رضاکار کارڈ' : 'Auto Generated Premium Volunteer Card'}</span>
                      </h5>

                      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        {/* FRONT CARD */}
                        <div className="relative w-full max-w-[320px] aspect-[1.58/1] rounded-2xl p-4 text-white overflow-hidden shadow-lg border border-amber-500/20 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 flex flex-col justify-between">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] rounded-full blur-2xl" />
                          <div className="flex justify-between items-center relative z-10 border-b border-amber-500/10 pb-1.5">
                            <div className="flex items-center gap-1.5">
                              <Logo lang={lang} variant="emblem" className="w-6 h-6" />
                              <div>
                                <h5 className="text-[8px] font-black tracking-wider text-amber-300">HASNAIN FOUNDATION</h5>
                                <p className="text-[5px] font-bold text-slate-300 -mt-1">SERVICE TO HUMANITY</p>
                              </div>
                            </div>
                            <span className="text-[6px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              VOLUNTEER
                            </span>
                          </div>

                          <div className="flex gap-3 items-center my-1 relative z-10">
                            <img
                              src={selectedVolunteer.profile_photo}
                              alt="Face"
                              className="w-12 h-12 object-cover rounded-lg border border-amber-500/30 shrink-0 shadow bg-emerald-950"
                            />
                            <div className="text-left leading-tight text-[10px] space-y-0.5 font-bold min-w-0">
                              <p className="text-[6px] text-slate-400 font-normal">{isUrdu ? 'نام' : 'Name'}</p>
                              <p className="text-white text-xs font-black truncate">{selectedVolunteer.full_name}</p>
                              
                              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5 font-semibold text-[6px]">
                                <div>
                                  <span className="block text-slate-400 font-normal">{isUrdu ? 'رضاکار آئی ڈی' : 'ID Number'}</span>
                                  <span className="text-amber-300 font-mono">{selectedVolunteer.id}</span>
                                </div>
                                <div>
                                  <span className="block text-slate-400 font-normal">{isUrdu ? 'شعبہ' : 'Department'}</span>
                                  <span className="text-white truncate block max-w-[85px]">{selectedVolunteer.assigned_department}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-end relative z-10 border-t border-amber-500/10 pt-1 text-[6px] font-bold">
                            <div className="text-left space-y-0.5">
                              <span className="block text-[5px] text-slate-400 font-normal">{isUrdu ? 'تاریخِ تنسیخ' : 'Expiry Date'}</span>
                              <span className="text-white font-mono">{selectedVolunteer.expiry_date}</span>
                            </div>
                            <div className="bg-white p-0.5 rounded border border-slate-200">
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getHasnainFoundationLink(selectedVolunteer.id, 'member'))}`}
                                alt="QR"
                                className="w-6 h-6 object-contain"
                              />
                            </div>
                          </div>
                        </div>

                        {/* BACK CARD */}
                        <div className="relative w-full max-w-[320px] aspect-[1.58/1] rounded-2xl p-4 text-white overflow-hidden shadow-lg border border-slate-700 bg-slate-900 flex flex-col justify-between">
                          <div className="text-left text-[6px] space-y-1 relative z-10 font-bold leading-relaxed">
                            <h5 className="text-amber-300 font-black tracking-wide border-b border-slate-800 pb-1 uppercase">{isUrdu ? 'شرائط و ضوابط' : 'Terms & Conditions'}</h5>
                            <ul className="list-disc pl-3 text-slate-400 space-y-0.5 text-[5px]">
                              <li>This card remains the property of Hasnain Foundation.</li>
                              <li>Spiritual treatment and guidance at our center is free.</li>
                              <li>Report financial anomalies via our integrity cell.</li>
                            </ul>
                          </div>
                          <div className="border-t border-slate-800 pt-1 flex justify-between items-center text-[5px] font-medium text-slate-400">
                            <div>
                              <span className="block">{isUrdu ? 'مرکزی دفتر' : 'Headquarters'}</span>
                              <span className="text-slate-300">Sector 4-B, Surjani Town, Karachi</span>
                            </div>
                            <div className="text-right">
                              <span className="block font-mono">hasnainfoundation225@gmail.com</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-24 text-slate-400 text-xs">
                  {isUrdu ? 'تفصیلات دیکھنے کے لیے رضاکاروں کی فہرست سے کسی فرد کا انتخاب کریں۔' : 'Select a registered volunteer from the left list to view/edit profile or manage approvals.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
