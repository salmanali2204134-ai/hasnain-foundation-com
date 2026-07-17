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
  }
];

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
