/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

// Clean and parse URL and Anon Key from environment variables or direct user input fallback
const rawUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://uxlvwmsvlyucldalswwi.supabase.co';
export const SUPABASE_URL = rawUrl.trim();

const rawKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'Api key-sb_publishable_ATfPYsYfA9QOolQQ3sr9gQ_aYycoUTb';
// Robust handling to strip any "Api key-" prefix if the user inputs the entire label
export const SUPABASE_ANON_KEY = rawKey.replace(/^Api key-/, '').trim();

// Create the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

/**
 * Test connectivity with the Supabase API endpoints
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  try {
    // Perform a light REST fetch request directly to the Supabase REST endpoint
    // to test API key validation and network accessibility
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (res.ok) {
      return {
        success: true,
        message: 'Successfully connected to the Supabase API endpoints. Authentication and token validation passed.',
        details: { status: res.status, statusText: res.statusText }
      };
    } else {
      const errorText = await res.text();
      return {
        success: false,
        message: `API endpoint returned an error: ${res.status} (${res.statusText})`,
        details: errorText
      };
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Network connection failed. Please check your Supabase Project ID or network connectivity.',
      details: error
    };
  }
}

/**
 * Initialize / Create database tables dynamically if needed
 * Note: In a client-side environment, DDL is typically performed via Supabase Dashboard,
 * but we provide clear instruction and helpful hints.
 */
export const REQUIRED_TABLES = [
  {
    name: 'contact_submissions',
    columns: 'id (uuid/int), name (text), email (text), phone (text), subject (text), message (text), created_at (timestamp)'
  },
  {
    name: 'volunteer_registrations',
    columns: 'id (text), name (text), email (text), phone (text), interests (text[]), availability (text), created_at (timestamp)'
  },
  {
    name: 'donations_log',
    columns: 'id (uuid/text), donor_name (text), email (text), amount (numeric), category (text), created_at (timestamp)'
  },
  {
    name: 'durood_bank',
    columns: 'id (serial/uuid primary key), full_name (text), mobile (text), whatsapp (text), email (text), city (text), country (text), durood_type (text), quantity (integer), intention (text), created_at (timestamp), updated_at (timestamp)'
  },
  {
    name: 'daily_activities',
    columns: 'id (uuid primary key), title (text), urdu_description (text), category (text), images (text[]), video_url (text), date (text), time (text), admin_name (text), created_at (timestamp), updated_at (timestamp)'
  }
];

export interface DuroodSubmission {
  id?: any;
  full_name: string;
  mobile: string;
  whatsapp?: string;
  email?: string;
  city: string;
  country: string;
  durood_type: string;
  quantity: number;
  intention: string;
  date?: string;
  time?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Helper to submit a Durood entry to Supabase
 */
export async function submitDuroodToSupabase(data: DuroodSubmission) {
  try {
    const now = new Date();
    // Save Date in DD/MM/YYYY format and Time in 12-hour format with AM/PM
    const dateStr = now.toLocaleDateString('en-GB'); 
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    const payload = {
      full_name: data.full_name,
      mobile: data.mobile,
      whatsapp: data.whatsapp || '',
      email: data.email || '',
      city: data.city,
      country: data.country,
      durood_type: data.durood_type,
      quantity: Number(data.quantity),
      intention: data.intention,
      date: data.date || dateStr,
      time: data.time || timeStr,
      created_at: data.created_at || now.toISOString(),
      updated_at: now.toISOString()
    };

    const { data: result, error } = await supabase
      .from('durood_bank')
      .insert([payload])
      .select();

    if (error) throw error;
    return { success: true, result };
  } catch (error: any) {
    console.warn('Failed to insert Durood submission to Supabase. Saving locally instead.', error);
    // Return success: false with error details so component can fall back to local storage
    return { success: false, error: error.message || error };
  }
}

/**
 * Fetch all Durood submissions from Supabase
 */
export async function fetchDuroodSubmissions(): Promise<DuroodSubmission[]> {
  try {
    const { data, error } = await supabase
      .from('durood_bank')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.warn('Error fetching Durood submissions:', error);
    return [];
  }
}

/**
 * Delete a single Durood submission
 */
export async function deleteDuroodSubmission(id: any) {
  try {
    const { error } = await supabase
      .from('durood_bank')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting Durood submission:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Bulk delete Durood submissions
 */
export async function bulkDeleteDuroodSubmissions(ids: any[]) {
  try {
    const { error } = await supabase
      .from('durood_bank')
      .delete()
      .in('id', ids);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Error bulk deleting Durood submissions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Update a Durood submission (Admin only)
 */
export async function updateDuroodSubmission(id: any, data: Partial<DuroodSubmission>) {
  try {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };
    const { data: result, error } = await supabase
      .from('durood_bank')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;
    return { success: true, result };
  } catch (error: any) {
    console.error('Error updating Durood submission:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to submit contact form submissions to Supabase
 */
export async function submitContactToSupabase(data: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) {
  try {
    const { data: result, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    return { success: true, result };
  } catch (error: any) {
    console.warn('Failed to insert contact submission to Supabase. Saving locally instead.', error);
    return { success: false, error: error.message || error };
  }
}

/**
 * Helper to submit volunteer registrations to Supabase
 */
export async function submitVolunteerToSupabase(data: {
  id: string;
  name: string;
  email: string;
  phone: string;
  interests: string[];
  availability: string;
}) {
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  const fullRecord = {
    id: data.id,
    profile_photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    cnic_front: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
    cnic_back: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
    full_name: data.name,
    father_name: 'N/A',
    cnic: 'Pending',
    mobile: data.phone,
    whatsapp: data.phone,
    email: data.email,
    date_of_birth: 'N/A',
    gender: 'Male',
    address: 'Karachi, Pakistan',
    city: 'Karachi',
    blood_group: 'N/A',
    skills: data.interests ? data.interests.join(', ') : 'General Volunteer Support',
    availability: data.availability || 'Flexible',
    emergency_contact: data.phone,
    experience: 'Registered via Home Page Volunteer Form',
    assigned_department: 'Community Welfare Support',
    status: 'pending',
    internal_notes: `Interests: ${data.interests ? data.interests.join(', ') : 'None'}`,
    issue_date: today,
    expiry_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    assigned_duties: ['Welcome Orientation Session'],
    attendance_count: 0,
    events_count: 0,
    performance_rating: 5,
    created_at: now
  };

  try {
    // 1. Insert into volunteer_registrations
    await supabase.from('volunteer_registrations').insert([
      {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        interests: data.interests,
        availability: data.availability,
        created_at: now
      }
    ]);

    // 2. Insert into volunteers table
    await supabase.from('volunteers').insert([fullRecord]);
  } catch (error: any) {
    console.warn('Failed to insert volunteer registration to Supabase primary tables. Fallback to contact_submissions.', error);
    try {
      await supabase.from('contact_submissions').insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: 'VOLUNTEER_SIGNUP',
        message: JSON.stringify(fullRecord)
      }]);
    } catch (fbErr) {
      console.warn('Failed contact_submissions fallback as well.', fbErr);
    }
  }

  // Always save locally so the registration is NEVER lost
  try {
    const local1 = JSON.parse(localStorage.getItem('hasnain_volunteers_local') || '[]');
    local1.unshift(fullRecord);
    localStorage.setItem('hasnain_volunteers_local', JSON.stringify(local1));

    const local2 = JSON.parse(localStorage.getItem('hasnain_volunteers') || '[]');
    local2.unshift(fullRecord);
    localStorage.setItem('hasnain_volunteers', JSON.stringify(local2));

    window.dispatchEvent(new Event('volunteers_updated'));
  } catch (err) {
    console.error('Failed saving volunteer registration locally:', err);
  }

  return { success: true };
}

/**
 * Helper to submit member registrations to Supabase with automatic fallbacks
 */
export async function submitMemberRecordToSupabase(newMember: any) {
  try {
    // 1. Try primary 'members' table
    const { error } = await supabase.from('members').insert([newMember]);
    if (error) throw error;
  } catch (error: any) {
    console.warn('Failed to insert member to Supabase primary members table. Falling back to contact_submissions.', error);
    try {
      const fallbackPayload = {
        name: newMember.full_name,
        email: newMember.email,
        phone: newMember.mobile,
        subject: 'MEMBER_SIGNUP',
        message: JSON.stringify(newMember)
      };
      await supabase.from('contact_submissions').insert([fallbackPayload]);
    } catch (fbErr) {
      console.warn('Fallback to contact_submissions failed as well.', fbErr);
    }
  }

  // Always sync local storage and trigger event so registration is NEVER lost
  try {
    const local1 = JSON.parse(localStorage.getItem('hasnain_members_local') || '[]');
    local1.unshift(newMember);
    localStorage.setItem('hasnain_members_local', JSON.stringify(local1));

    const local2 = JSON.parse(localStorage.getItem('hasnain_members') || '[]');
    local2.unshift(newMember);
    localStorage.setItem('hasnain_members', JSON.stringify(local2));

    window.dispatchEvent(new Event('members_updated'));
  } catch (err) {
    console.error('Failed saving member locally:', err);
  }

  return { success: true };
}

/**
 * Fetch all contact submissions from Supabase (for Admin review)
 */
export async function fetchContactSubmissions() {
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error);
    return [];
  }
}

/**
 * Fetch all volunteer registrations from Supabase (for Admin review)
 */
export async function fetchVolunteerRegistrations() {
  try {
    const { data, error } = await supabase
      .from('volunteer_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Error fetching volunteer registrations:', error);
    return [];
  }
}

// ==========================================
// MEMBERS & VOLUNTEERS PORTAL CRUD HELPERS
// ==========================================

export async function fetchMembersFromSupabase(): Promise<any[]> {
  const allMembersMap = new Map<string, any>();

  const addMember = (m: any) => {
    if (!m) return;
    const email = (m.email || '').toLowerCase().trim();
    const cnic = (m.cnic || '').trim();
    const phone = (m.mobile || m.phone || '').trim();
    const id = m.id || m.member_id || (email ? `HF-M-${email.substring(0, 5)}` : `HF-M-${Math.floor(10000 + Math.random() * 90000)}`);
    
    // Key for deduplication
    const key = (id && id !== 'N/A') ? id : (email || cnic || phone || id);

    const existing = allMembersMap.get(key);
    const normalizedMember = {
      id: id,
      profile_photo: m.profile_photo || existing?.profile_photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      cnic_front: m.cnic_front || existing?.cnic_front || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      cnic_back: m.cnic_back || existing?.cnic_back || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      full_name: m.full_name || m.fullName || m.name || 'Registered Member',
      father_name: m.father_name || m.fatherName || 'N/A',
      cnic: cnic || 'N/A',
      mobile: phone || 'N/A',
      whatsapp: m.whatsapp || phone || 'N/A',
      email: m.email || '',
      password: m.password || '',
      date_of_birth: m.date_of_birth || m.dob || 'N/A',
      gender: m.gender || 'Male',
      address: m.address || 'Karachi, Pakistan',
      city: m.city || 'Karachi',
      occupation: m.occupation || 'N/A',
      blood_group: m.blood_group || m.bloodGroup || 'N/A',
      membership_type: m.membership_type || m.membershipType || 'Regular',
      registration_date: m.registration_date || m.created_at || new Date().toISOString().split('T')[0],
      status: m.status || existing?.status || 'pending',
      internal_notes: m.internal_notes || existing?.internal_notes || 'Online Member Application',
      issue_date: m.issue_date || new Date().toISOString().split('T')[0],
      expiry_date: m.expiry_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      donations_count: m.donations_count ?? 0,
      durood_count: m.durood_count ?? 0,
      events_count: m.events_count ?? 0,
      certificates: m.certificates || []
    };

    allMembersMap.set(key, normalizedMember);
  };

  // 1. Fetch from primary 'members' table
  try {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('registration_date', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      data.forEach(m => addMember(m));
    }
  } catch (err) {
    console.warn('Primary members table fetch failed:', err);
  }

  // 2. Fetch from 'contact_submissions' fallback table
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('subject', 'MEMBER_SIGNUP');

    if (!error && data && Array.isArray(data)) {
      data.forEach(row => {
        try {
          const parsed = JSON.parse(row.message);
          parsed._contact_id = row.id;
          addMember(parsed);
        } catch {}
      });
    }
  } catch (err) {
    console.warn('Contact submissions fallback fetch failed for members:', err);
  }

  // 3. Merge from local storage
  try {
    const local1 = localStorage.getItem('hasnain_members_local');
    if (local1) {
      const arr = JSON.parse(local1);
      if (Array.isArray(arr)) arr.forEach(m => addMember(m));
    }
    const local2 = localStorage.getItem('hasnain_members');
    if (local2) {
      const arr = JSON.parse(local2);
      if (Array.isArray(arr)) arr.forEach(m => addMember(m));
    }
  } catch (err) {
    console.warn('Local storage read failed for members:', err);
  }

  const finalMembersList = Array.from(allMembersMap.values());
  try {
    localStorage.setItem('hasnain_members_local', JSON.stringify(finalMembersList));
  } catch {}

  return finalMembersList;
}

export async function updateMemberInSupabase(id: string, payload: any) {
  try {
    // 1. Try primary table
    const { data, error } = await supabase
      .from('members')
      .update(payload)
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      await fetchMembersFromSupabase();
      return { success: true, result: data };
    }
    if (error) throw error;
  } catch (err: any) {
    console.warn('Error updating member, trying contact_submissions fallback:', err);
    try {
      const { data: contacts, error: cErr } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('subject', 'MEMBER_SIGNUP');

      if (!cErr && contacts) {
        const matched = contacts.find(row => {
          try {
            const obj = JSON.parse(row.message);
            return obj.id === id;
          } catch {
            return false;
          }
        });

        if (matched) {
          const currentObj = JSON.parse(matched.message);
          const updatedObj = { ...currentObj, ...payload };
          const { error: uErr } = await supabase
            .from('contact_submissions')
            .update({ message: JSON.stringify(updatedObj) })
            .eq('id', matched.id);

          if (!uErr) {
            await fetchMembersFromSupabase();
            return { success: true };
          }
        }
      }
    } catch (e2) {
      console.error('Failed updating contact_submissions fallback for member:', e2);
    }

    // Local fallback
    const cached = localStorage.getItem('hasnain_members_local');
    if (cached) {
      let list = JSON.parse(cached);
      list = list.map((item: any) => item.id === id ? { ...item, ...payload } : item);
      localStorage.setItem('hasnain_members_local', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}

export async function deleteMemberFromSupabase(id: string) {
  try {
    // 1. Try primary table
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchMembersFromSupabase();
    return { success: true };
  } catch (err: any) {
    console.warn('Error deleting member, trying contact_submissions fallback:', err);
    try {
      const { data: contacts, error: cErr } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('subject', 'MEMBER_SIGNUP');

      if (!cErr && contacts) {
        const matched = contacts.find(row => {
          try {
            const obj = JSON.parse(row.message);
            return obj.id === id;
          } catch {
            return false;
          }
        });

        if (matched) {
          const { error: dErr } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', matched.id);

          if (!dErr) {
            await fetchMembersFromSupabase();
            return { success: true };
          }
        }
      }
    } catch (e2) {
      console.error('Failed deleting contact_submissions fallback for member:', e2);
    }

    const cached = localStorage.getItem('hasnain_members_local');
    if (cached) {
      let list = JSON.parse(cached);
      list = list.filter((item: any) => item.id !== id);
      localStorage.setItem('hasnain_members_local', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}

export async function fetchVolunteersFromSupabase(): Promise<any[]> {
  const allVolunteersMap = new Map<string, any>();

  const addVolunteer = (v: any) => {
    if (!v) return;
    const email = (v.email || '').toLowerCase().trim();
    const phone = (v.mobile || v.phone || '').trim();
    const cnic = (v.cnic || '').trim();
    const id = v.id || (email ? `HF-V-${email.substring(0, 5)}` : `HF-V-${Math.floor(10000 + Math.random() * 90000)}`);

    const key = (id && id !== 'N/A') ? id : (email || phone || id);

    const existing = allVolunteersMap.get(key);

    let skills = v.skills;
    if (!skills && Array.isArray(v.interests)) {
      skills = v.interests.join(', ');
    } else if (!skills && typeof v.interests === 'string') {
      skills = v.interests;
    }

    const normalizedVolunteer = {
      id: id,
      profile_photo: v.profile_photo || existing?.profile_photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      cnic_front: v.cnic_front || existing?.cnic_front || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      cnic_back: v.cnic_back || existing?.cnic_back || 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=300',
      full_name: v.full_name || v.fullName || v.name || 'Registered Volunteer',
      father_name: v.father_name || v.fatherName || 'N/A',
      cnic: cnic || 'Pending',
      mobile: phone || 'N/A',
      whatsapp: v.whatsapp || phone || 'N/A',
      email: v.email || '',
      password: v.password || '',
      date_of_birth: v.date_of_birth || v.dob || 'N/A',
      gender: v.gender || 'Male',
      address: v.address || 'Karachi, Pakistan',
      city: v.city || 'Karachi',
      blood_group: v.blood_group || v.bloodGroup || 'N/A',
      skills: skills || 'General Support & Event Management',
      availability: v.availability || 'Flexible',
      emergency_contact: v.emergency_contact || phone || 'N/A',
      experience: v.experience || 'Online Volunteer Applicant',
      assigned_department: v.assigned_department || v.assignedDepartment || 'Welfare Support',
      status: v.status || existing?.status || 'pending',
      internal_notes: v.internal_notes || existing?.internal_notes || (v.timestamp ? `Registered on ${v.timestamp}` : 'Online Volunteer Registration'),
      issue_date: v.issue_date || v.timestamp || new Date().toISOString().split('T')[0],
      expiry_date: v.expiry_date || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      assigned_duties: v.assigned_duties || ['Welcome Orientation Session'],
      attendance_count: v.attendance_count ?? 0,
      events_count: v.events_count ?? 0,
      performance_rating: v.performance_rating ?? 5
    };

    allVolunteersMap.set(key, normalizedVolunteer);
  };

  // 1. Primary 'volunteers' table
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      data.forEach(v => addVolunteer(v));
    }
  } catch (err) {
    console.warn('Primary volunteers table fetch failed:', err);
  }

  // 2. 'volunteer_registrations' table
  try {
    const { data, error } = await supabase
      .from('volunteer_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && Array.isArray(data)) {
      data.forEach(v => addVolunteer(v));
    }
  } catch (err) {
    console.warn('Volunteer registrations table fetch failed:', err);
  }

  // 3. 'contact_submissions' table (VOLUNTEER_SIGNUP)
  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .select('*')
      .eq('subject', 'VOLUNTEER_SIGNUP');

    if (!error && data && Array.isArray(data)) {
      data.forEach(row => {
        try {
          const parsed = JSON.parse(row.message);
          parsed._contact_id = row.id;
          addVolunteer(parsed);
        } catch {}
      });
    }
  } catch (err) {
    console.warn('Contact submissions fallback fetch failed for volunteers:', err);
  }

  // 4. Local storage keys
  try {
    const local1 = localStorage.getItem('hasnain_volunteers_local');
    if (local1) {
      const arr = JSON.parse(local1);
      if (Array.isArray(arr)) arr.forEach(v => addVolunteer(v));
    }
    const local2 = localStorage.getItem('hasnain_volunteers');
    if (local2) {
      const arr = JSON.parse(local2);
      if (Array.isArray(arr)) arr.forEach(v => addVolunteer(v));
    }
  } catch (err) {
    console.warn('Local storage read failed for volunteers:', err);
  }

  const finalVolunteersList = Array.from(allVolunteersMap.values());

  try {
    localStorage.setItem('hasnain_volunteers_local', JSON.stringify(finalVolunteersList));
    localStorage.setItem('hasnain_volunteers', JSON.stringify(finalVolunteersList));
  } catch {}

  return finalVolunteersList;
}

export async function updateVolunteerInSupabase(id: string, payload: any) {
  try {
    const { data, error } = await supabase
      .from('volunteers')
      .update(payload)
      .eq('id', id)
      .select();

    if (!error && data && data.length > 0) {
      await fetchVolunteersFromSupabase();
      return { success: true, result: data };
    }
    if (error) throw error;
  } catch (err: any) {
    console.warn('Error updating volunteer, trying contact_submissions fallback:', err);
    try {
      const { data: contacts, error: cErr } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('subject', 'VOLUNTEER_SIGNUP');

      if (!cErr && contacts) {
        const matched = contacts.find(row => {
          try {
            const obj = JSON.parse(row.message);
            return obj.id === id;
          } catch {
            return false;
          }
        });

        if (matched) {
          const currentObj = JSON.parse(matched.message);
          const updatedObj = { ...currentObj, ...payload };
          const { error: uErr } = await supabase
            .from('contact_submissions')
            .update({ message: JSON.stringify(updatedObj) })
            .eq('id', matched.id);

          if (!uErr) {
            await fetchVolunteersFromSupabase();
            return { success: true };
          }
        }
      }
    } catch (e2) {
      console.error('Failed updating contact_submissions fallback for volunteer:', e2);
    }

    const cached = localStorage.getItem('hasnain_volunteers_local');
    if (cached) {
      let list = JSON.parse(cached);
      list = list.map((item: any) => item.id === id ? { ...item, ...payload } : item);
      localStorage.setItem('hasnain_volunteers_local', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}

export async function deleteVolunteerFromSupabase(id: string) {
  try {
    const { error } = await supabase
      .from('volunteers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    await fetchVolunteersFromSupabase();
    return { success: true };
  } catch (err: any) {
    console.warn('Error deleting volunteer, trying contact_submissions fallback:', err);
    try {
      const { data: contacts, error: cErr } = await supabase
        .from('contact_submissions')
        .select('*')
        .eq('subject', 'VOLUNTEER_SIGNUP');

      if (!cErr && contacts) {
        const matched = contacts.find(row => {
          try {
            const obj = JSON.parse(row.message);
            return obj.id === id;
          } catch {
            return false;
          }
        });

        if (matched) {
          const { error: dErr } = await supabase
            .from('contact_submissions')
            .delete()
            .eq('id', matched.id);

          if (!dErr) {
            await fetchVolunteersFromSupabase();
            return { success: true };
          }
        }
      }
    } catch (e2) {
      console.error('Failed deleting contact_submissions fallback for volunteer:', e2);
    }

    const cached = localStorage.getItem('hasnain_volunteers_local');
    if (cached) {
      let list = JSON.parse(cached);
      list = list.filter((item: any) => item.id !== id);
      localStorage.setItem('hasnain_volunteers_local', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}

// ==========================================
// DAILY ACTIVITIES MANAGEMENT SYSTEM CRUD
// ==========================================

export interface DailyActivity {
  id?: any;
  title: string;
  urdu_description: string;
  category: string;
  images: string[];
  video_url?: string;
  date: string;
  time: string;
  admin_name: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Upload an activity media file (Image or Video) to Supabase Storage.
 * If the bucket 'daily-activities' does not exist or fails, falls back gracefully to Base64.
 */
export async function uploadActivityMedia(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    // Try to upload to Supabase storage bucket 'daily-activities'
    const { data, error } = await supabase.storage
      .from('daily-activities')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.warn('Supabase storage upload failed, falling back to Base64:', error);
      throw error;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('daily-activities')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (err: any) {
    // Robust fallback: Convert to Base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (e) => {
        reject(new Error('Failed to read file: ' + e));
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Fetch all Daily Activities from Supabase (falling back to Local Storage if table doesn't exist).
 */
export async function fetchActivitiesFromSupabase(): Promise<DailyActivity[]> {
  try {
    const { data, error } = await supabase
      .from('daily_activities')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      // Check if it's a SQL table error or missing relation
      if (error.code === '42P01') {
        console.warn('daily_activities table does not exist in Supabase yet. Loading local fallback.');
      }
      throw error;
    }

    // Synchronize local storage as fallback/cache
    if (data) {
      localStorage.setItem('hasnain_activities_fallback', JSON.stringify(data));
      return data;
    }
    return [];
  } catch (error: any) {
    console.warn('Error fetching activities from Supabase. Returning local cache:', error);
    const cached = localStorage.getItem('hasnain_activities_fallback');
    return cached ? JSON.parse(cached) : [];
  }
}

/**
 * Submit a new Daily Activity to Supabase (or save to Local Storage on failure).
 */
export async function submitActivityToSupabase(data: DailyActivity) {
  try {
    const payload = {
      title: data.title,
      urdu_description: data.urdu_description,
      category: data.category,
      images: data.images,
      video_url: data.video_url || '',
      date: data.date,
      time: data.time,
      admin_name: data.admin_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: result, error } = await supabase
      .from('daily_activities')
      .insert([payload])
      .select();

    if (error) throw error;

    // Fetch latest and update local cache
    await fetchActivitiesFromSupabase();

    return { success: true, result };
  } catch (error: any) {
    console.warn('Failed to insert activity to Supabase. Saving locally instead.', error);
    
    // Save to local storage fallback
    const cached = localStorage.getItem('hasnain_activities_fallback');
    const list: DailyActivity[] = cached ? JSON.parse(cached) : [];
    const newLocalActivity: DailyActivity = {
      ...data,
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    list.unshift(newLocalActivity);
    localStorage.setItem('hasnain_activities_fallback', JSON.stringify(list));

    return { success: true, isLocalFallback: true, result: [newLocalActivity] };
  }
}

/**
 * Update an existing Daily Activity in Supabase (or local fallback).
 */
export async function updateActivityInSupabase(id: any, data: Partial<DailyActivity>) {
  try {
    const payload = {
      ...data,
      updated_at: new Date().toISOString()
    };

    if (typeof id === 'string' && id.startsWith('local-')) {
      throw new Error('Local item update requested');
    }

    const { data: result, error } = await supabase
      .from('daily_activities')
      .update(payload)
      .eq('id', id)
      .select();

    if (error) throw error;

    // Refresh cache
    await fetchActivitiesFromSupabase();
    return { success: true, result };
  } catch (error: any) {
    console.warn('Updating activity locally due to database bypass:', error.message || error);
    
    const cached = localStorage.getItem('hasnain_activities_fallback');
    if (cached) {
      let list: DailyActivity[] = JSON.parse(cached);
      list = list.map(item => {
        if (item.id === id) {
          return {
            ...item,
            ...data,
            updated_at: new Date().toISOString()
          };
        }
        return item;
      });
      localStorage.setItem('hasnain_activities_fallback', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}

/**
 * Delete an Activity from Supabase (or local fallback).
 */
export async function deleteActivityFromSupabase(id: any) {
  try {
    if (typeof id === 'string' && id.startsWith('local-')) {
      throw new Error('Local item deletion requested');
    }

    const { error } = await supabase
      .from('daily_activities')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Refresh cache
    await fetchActivitiesFromSupabase();
    return { success: true };
  } catch (error: any) {
    console.warn('Deleting activity locally:', error.message || error);

    const cached = localStorage.getItem('hasnain_activities_fallback');
    if (cached) {
      let list: DailyActivity[] = JSON.parse(cached);
      list = list.filter(item => item.id !== id);
      localStorage.setItem('hasnain_activities_fallback', JSON.stringify(list));
    }
    return { success: true, isLocalFallback: true };
  }
}
