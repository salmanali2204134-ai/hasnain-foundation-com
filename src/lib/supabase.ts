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
  try {
    const { data: result, error } = await supabase
      .from('volunteer_registrations')
      .insert([
        {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          interests: data.interests,
          availability: data.availability,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;
    return { success: true, result };
  } catch (error: any) {
    console.warn('Failed to insert volunteer registration to Supabase. Saving locally instead.', error);
    return { success: false, error: error.message || error };
  }
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
