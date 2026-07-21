/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'ur';

export interface Service {
  id: string;
  iconName: string; // Dynamic icon mapper
  title: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
}

export interface Project {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  category: {
    en: string;
    ur: string;
  };
  description: {
    en: string;
    ur: string;
  };
  image: string;
  completed: boolean;
  progress?: number;
  raised?: string;
  goal?: string;
  details: {
    en: string[];
    ur: string[];
  };
}

export interface Event {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  date: string;
  time: {
    en: string;
    ur: string;
  };
  location: {
    en: string;
    ur: string;
  };
  category: 'gathering' | 'conference' | 'naat' | 'welfare';
  description: {
    en: string;
    ur: string;
  };
  image: string;
  status: 'upcoming' | 'completed';
}

export interface GalleryItem {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  type: 'photo' | 'video';
  category: 'mosque' | 'food' | 'education' | 'welfare' | 'events' | 'spiritual';
  url: string;
  thumbnail: string;
}

export interface TransparencyReport {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  month: {
    en: string;
    ur: string;
  };
  year: string;
  type: 'monthly' | 'annual';
  downloadUrl: string;
  utilization: {
    category: { en: string; ur: string };
    percentage: number;
    amount: string;
  }[];
}

export interface NewsArticle {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  date: string;
  excerpt: {
    en: string;
    ur: string;
  };
  content: {
    en: string[];
    ur: string[];
  };
  image: string;
  tag: {
    en: string;
    ur: string;
  };
}

export interface SuccessStory {
  id: string;
  title: {
    en: string;
    ur: string;
  };
  beneficiaryName: string;
  project: {
    en: string;
    ur: string;
  };
  story: {
    en: string;
    ur: string;
  };
  isAiGenerated?: boolean;
}

export interface SocialPost {
  id: string;
  platform: 'facebook' | 'instagram' | 'youtube';
  author: string;
  date: string;
  content: {
    en: string;
    ur: string;
  };
  mediaUrl?: string;
  likes: number;
  shares?: number;
  comments?: number;
  videoDuration?: string;
  isAiGenerated?: boolean;
}

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

export interface Member {
  id: string;
  profile_photo: string;
  cnic_front: string;
  cnic_back: string;
  full_name: string;
  father_name: string;
  cnic: string;
  mobile: string;
  whatsapp: string;
  email: string;
  password?: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  occupation: string;
  blood_group: string;
  membership_type: string;
  registration_date: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active';
  internal_notes?: string;
  issue_date?: string;
  expiry_date?: string;
  donations_count?: number;
  durood_count?: number;
  events_count?: number;
  certificates?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Volunteer {
  id: string;
  profile_photo: string;
  cnic_front: string;
  cnic_back: string;
  full_name: string;
  father_name: string;
  cnic: string;
  mobile: string;
  whatsapp: string;
  email: string;
  password?: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  blood_group: string;
  skills: string;
  availability: string;
  emergency_contact: string;
  experience: string;
  assigned_department: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'active';
  internal_notes?: string;
  issue_date?: string;
  expiry_date?: string;
  assigned_duties?: string[];
  attendance_count?: number;
  events_count?: number;
  performance_rating?: number;
  created_at?: string;
  updated_at?: string;
}


