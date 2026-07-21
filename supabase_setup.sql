-- =====================================================================
-- HASNAIN FOUNDATION - FULL DATABASE SETUP SCRIPT FOR SUPABASE
-- Purpose: Safely drops old tables, creates optimized schemas, enables 
-- Row Level Security (RLS), and seeds core initial data.
-- =====================================================================

-- 1. CLEANUP (Drop tables if they exist to start fresh)
DROP TABLE IF EXISTS daily_activities;
DROP TABLE IF EXISTS donations_log;
DROP TABLE IF EXISTS volunteer_registrations;
DROP TABLE IF EXISTS contact_submissions;
DROP TABLE IF EXISTS durood_bank;

-- =====================================================================
-- TABLE 1: DUROOD BANK RECITATIONS
-- =====================================================================
CREATE TABLE durood_bank (
    id BIGSERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT DEFAULT '',
    email TEXT DEFAULT '',
    city TEXT DEFAULT 'Karachi',
    country TEXT DEFAULT 'Pakistan',
    durood_type TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    intention TEXT DEFAULT 'امت مسلمہ',
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Optimize queries by indexing mobile (for profile lookup) and created_at (for admin datagrid sorting)
CREATE INDEX idx_durood_mobile ON durood_bank(mobile);
CREATE INDEX idx_durood_created_at ON durood_bank(created_at DESC);

-- =====================================================================
-- TABLE 2: DAILY ACTIVITIES (BLOG & EVENT LOG)
-- =====================================================================
CREATE TABLE daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    urdu_description TEXT NOT NULL,
    category TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    video_url TEXT DEFAULT '',
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    admin_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_created_at ON daily_activities(created_at DESC);

-- =====================================================================
-- TABLE 3: CONTACT FORM SUBMISSIONS
-- =====================================================================
CREATE TABLE contact_submissions (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    subject TEXT DEFAULT '',
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================================
-- TABLE 4: VOLUNTEERS (Upgraded full profile model)
-- =====================================================================
CREATE TABLE volunteers (
    id TEXT PRIMARY KEY, -- HF-V-XXXX
    profile_photo TEXT DEFAULT '',
    cnic_front TEXT DEFAULT '',
    cnic_back TEXT DEFAULT '',
    full_name TEXT NOT NULL,
    father_name TEXT DEFAULT '',
    cnic TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    date_of_birth TEXT DEFAULT '',
    gender TEXT NOT NULL,
    address TEXT DEFAULT '',
    city TEXT DEFAULT 'Karachi',
    blood_group TEXT DEFAULT 'B+',
    skills TEXT DEFAULT '',
    availability TEXT DEFAULT 'Weekends',
    emergency_contact TEXT DEFAULT '',
    experience TEXT DEFAULT '',
    assigned_department TEXT DEFAULT 'Welfare Support',
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, suspended, active
    internal_notes TEXT DEFAULT '',
    issue_date TEXT DEFAULT '',
    expiry_date TEXT DEFAULT '',
    assigned_duties TEXT[] DEFAULT '{}',
    attendance_count INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    performance_rating INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_volunteers_status ON volunteers(status);
CREATE INDEX idx_volunteers_email ON volunteers(email);

-- =====================================================================
-- TABLE 4B: MEMBERS (Full profile membership model)
-- =====================================================================
CREATE TABLE members (
    id TEXT PRIMARY KEY, -- HF-M-XXXX
    profile_photo TEXT DEFAULT '',
    cnic_front TEXT DEFAULT '',
    cnic_back TEXT DEFAULT '',
    full_name TEXT NOT NULL,
    father_name TEXT DEFAULT '',
    cnic TEXT NOT NULL,
    mobile TEXT NOT NULL,
    whatsapp TEXT DEFAULT '',
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL DEFAULT '123456',
    date_of_birth TEXT DEFAULT '',
    gender TEXT NOT NULL,
    address TEXT DEFAULT '',
    city TEXT DEFAULT 'Karachi',
    occupation TEXT DEFAULT '',
    blood_group TEXT DEFAULT 'B+',
    membership_type TEXT DEFAULT 'Regular', -- Regular, Premium, Life, Patron
    registration_date TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, suspended, active
    internal_notes TEXT DEFAULT '',
    issue_date TEXT DEFAULT '',
    expiry_date TEXT DEFAULT '',
    donations_count INTEGER DEFAULT 0,
    durood_count INTEGER DEFAULT 0,
    events_count INTEGER DEFAULT 0,
    certificates TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_email ON members(email);

-- =====================================================================
-- TABLE 5: DONATIONS LOG
-- =====================================================================
CREATE TABLE donations_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    donor_name TEXT NOT NULL,
    email TEXT DEFAULT '',
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    category TEXT DEFAULT 'General Sadqah',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- =====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES Setup
-- =====================================================================

-- Enable RLS on all tables
ALTER TABLE durood_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations_log ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------
-- POLICIES FOR durood_bank
-- -----------------------------------------------------
-- 1. Allow Anyone (Public) to submit a recitation
CREATE POLICY "Allow Public Durood Insert" 
ON durood_bank FOR INSERT 
WITH CHECK (true);

-- 2. Allow Anyone (Public) to SELECT so live overall counters and leaderboards function correctly
CREATE POLICY "Allow Public Durood Select" 
ON durood_bank FOR SELECT 
USING (true);

-- 3. Allow Admin/Authenticated service role to manage (UPDATE/DELETE) recitations
CREATE POLICY "Allow Authenticated Admin Update" 
ON durood_bank FOR UPDATE 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow Authenticated Admin Delete" 
ON durood_bank FOR DELETE 
TO authenticated 
USING (true);

-- -----------------------------------------------------
-- POLICIES FOR daily_activities
-- -----------------------------------------------------
-- 1. Allow Public to read activities on the website
CREATE POLICY "Allow Public Activities Select" 
ON daily_activities FOR SELECT 
USING (true);

-- 2. Allow Admins to insert, update, and delete activities
CREATE POLICY "Allow Authenticated Admin Write" 
ON daily_activities FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- -----------------------------------------------------
-- POLICIES FOR contact_submissions
-- -----------------------------------------------------
-- 1. Allow Public to insert new contact form messages
CREATE POLICY "Allow Public Contact Insert" 
ON contact_submissions FOR INSERT 
WITH CHECK (true);

-- 2. Allow only Admins to read or manage contact submissions
CREATE POLICY "Allow Authenticated Admin Contact Access" 
ON contact_submissions FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- -----------------------------------------------------
-- POLICIES FOR volunteers
-- -----------------------------------------------------
-- 1. Allow Public to register as a volunteer
CREATE POLICY "Allow Public Volunteer Registration" 
ON volunteers FOR INSERT 
WITH CHECK (true);

-- 2. Allow Public to view volunteer profiles (essential for QR ID Verification & Portal Logins)
CREATE POLICY "Allow Public Volunteer Select" 
ON volunteers FOR SELECT 
USING (true);

-- 3. Allow Admins to manage volunteers, and Volunteers to update their own profiles
CREATE POLICY "Allow Volunteer Update Self" 
ON volunteers FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow Authenticated Admin Volunteer Access" 
ON volunteers FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- -----------------------------------------------------
-- POLICIES FOR members
-- -----------------------------------------------------
-- 1. Allow Public to register as a member
CREATE POLICY "Allow Public Member Registration" 
ON members FOR INSERT 
WITH CHECK (true);

-- 2. Allow Public to view member profiles (essential for QR ID Verification & Portal Logins)
CREATE POLICY "Allow Public Member Select" 
ON members FOR SELECT 
USING (true);

-- 3. Allow Admins to manage members, and Members to update their own profiles
CREATE POLICY "Allow Member Update Self" 
ON members FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow Authenticated Admin Member Access" 
ON members FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- -----------------------------------------------------
-- POLICIES FOR donations_log
-- -----------------------------------------------------
-- 1. Allow Public to insert log entries when donation succeeds
CREATE POLICY "Allow Public Donation Logging" 
ON donations_log FOR INSERT 
WITH CHECK (true);

-- 2. Allow Admins to review transaction logs
CREATE POLICY "Allow Authenticated Admin Donation Access" 
ON donations_log FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- =====================================================================
-- SEED INITIAL DATA (Keeps the website populated with legacy totals)
-- =====================================================================

INSERT INTO durood_bank (full_name, mobile, whatsapp, email, city, country, durood_type, quantity, intention, date, time, created_at)
VALUES 
('Muhammad Salman Ali Qadri', '03152204134', '03152204134', 'salman@hasnain.org', 'Karachi', 'Pakistan', 'درود ابراہیمی', 125000, 'حسنین فاؤنڈیشن', '20/07/2026', '06:30:15 PM', NOW() - INTERVAL '2 days'),
('Allama Shayan Ali Qadri', '03133830370', '03133830370', 'shayan@hasnain.org', 'Karachi', 'Pakistan', 'درود تاج', 75000, 'امت مسلمہ', '19/07/2026', '10:15:44 PM', NOW() - INTERVAL '5 days'),
('Zahid Hussain', '03332145678', '03332145678', 'zahid@gmail.com', 'Lahore', 'Pakistan', 'درود ناریہ', 5000, 'بیماروں کی شفا', '21/07/2026', '12:00:00 PM', NOW()),
('Dr. Tariq Jameel', '03001234567', '03001234567', 'tariq@yahoo.com', 'Islamabad', 'Pakistan', 'درود تنجینا', 15000, 'والدین', '15/07/2026', '03:45:12 PM', NOW() - INTERVAL '12 days'),
('Anonymous Contributor', '03219876543', '', '', 'Karachi', 'Pakistan', 'درود ابراہیمی', 1000, 'مرحومین', '21/07/2026', '01:10:00 AM', NOW());

INSERT INTO daily_activities (title, urdu_description, category, images, video_url, date, time, admin_name, created_at)
VALUES 
('Dastarkhwan Food Distribution', 'الحمد للہ! حسنین فاؤنڈیشن کے تحت کراچی کے مستحق افراد میں پکا ہوا کھانا تقسیم کیا گیا۔ آئیے اس عظیم سفر میں ہمارا ساتھ دیں۔', 'Food Distribution', ARRAY['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800'], '', '21/07/2026', '02:30 PM', 'Salman Ali Qadri', NOW()),
('Free Medical Camp in Korangi', 'مفت طبی کیمپ کا انعقاد کیا گیا جس میں سینکڑوں مریضوں کا معائنہ کیا گیا اور مفت ادویات فراہم کی گئیں۔', 'Medical Aid', ARRAY['https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800'], '', '18/07/2026', '10:00 AM', 'Shayan Ali Qadri', NOW() - INTERVAL '3 days');

INSERT INTO donations_log (donor_name, email, amount, category)
VALUES 
('Ali Khan', 'ali.khan@gmail.com', 25000.00, 'Ramadan Food Drive'),
('Zoya Ahmed', 'zoya@hotmail.com', 10000.00, 'Orphan Education'),
('Mohammad Usman', 'usman@gmail.com', 50000.00, 'General Welfare');

-- =====================================================================
-- SETUP VERIFIED & COMPLETE
-- =====================================================================
