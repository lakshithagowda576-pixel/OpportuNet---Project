# 📊 Database Setup Reference

## What Tables Your App Needs

Your OpportuNet application requires the following tables in Supabase PostgreSQL:

---

## **1. users** - User Accounts

**Purpose:** Store all user profiles

**Columns:**
```
id (INT, Primary Key)
name (TEXT) - User's full name
email (TEXT, Unique) - Login email
password_hash (TEXT) - Encrypted password
role (ENUM) - 'user', 'admin', or 'hr'
provider (ENUM) - 'email', 'google', 'github', 'facebook', 'linkedin'
provider_id (TEXT) - OAuth provider ID
avatar (TEXT) - Profile picture URL
created_at (TIMESTAMP) - Account creation date
```

**Sample Data:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password_hash": "hashed_password",
  "role": "user",
  "provider": "email",
  "avatar": "https://example.com/avatar.jpg",
  "created_at": "2024-06-15T10:00:00Z"
}
```

---

## **2. jobs** - Job Postings

**Purpose:** Store job listings

**Columns:**
```
id (INT, Primary Key)
title (TEXT) - Job title (e.g., "Software Engineer")
company_id (INT, Foreign Key) - Links to companies table
category (ENUM) - 'IT', 'NON_IT', 'STATE_GOVT', 'CENTRAL_GOVT'
description (TEXT) - Full job description
requirements (TEXT) - Required qualifications
salary_min (INT) - Minimum salary
salary_max (INT) - Maximum salary
location (TEXT) - Job location
shift_type (ENUM) - 'Day', 'Night', 'Full_time', 'Part_time'
posted_at (TIMESTAMP) - When job was posted
expires_at (TIMESTAMP) - Application deadline
active (BOOLEAN) - Is job still open?
```

**Sample Data:**
```json
{
  "id": 1,
  "title": "Senior Software Engineer",
  "company_id": 1,
  "category": "IT",
  "description": "We are looking for an experienced engineer...",
  "requirements": "5+ years experience, B.Tech CS",
  "salary_min": 80000,
  "salary_max": 150000,
  "location": "Bangalore",
  "shift_type": "Full_time",
  "posted_at": "2024-06-01T00:00:00Z",
  "expires_at": "2024-12-31T23:59:59Z",
  "active": true
}
```

---

## **3. companies** - Company Information

**Purpose:** Store company profiles

**Columns:**
```
id (INT, Primary Key)
name (TEXT, Unique) - Company name
logo_url (TEXT) - Company logo
description (TEXT) - About company
website_url (TEXT) - Company website
email (TEXT) - Contact email
phone (TEXT) - Contact phone
location (TEXT) - Headquarters location
created_at (TIMESTAMP) - When added to database
```

**Sample Data:**
```json
{
  "id": 1,
  "name": "Google",
  "logo_url": "https://example.com/google.png",
  "description": "Technology company",
  "website_url": "https://google.com",
  "email": "careers@google.com",
  "phone": "+1-650-253-0000",
  "location": "Mountain View, USA",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## **4. applications** - Job Applications

**Purpose:** Track user job applications

**Columns:**
```
id (INT, Primary Key)
job_id (INT, Foreign Key) - Which job
user_id (INT, Foreign Key) - Which user (optional)
applicant_name (TEXT) - Applicant's name
applicant_email (TEXT) - Applicant's email
applicant_phone (TEXT) - Contact number
applicant_address (TEXT) - Address
education (TEXT) - Education background
qualification (TEXT) - Qualifications
resume_url (TEXT) - Resume file URL
accepted_terms (BOOLEAN) - Accepted T&C?
cover_letter (TEXT) - Application message
status (ENUM) - 'Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected', 'Redirected'
applied_at (TIMESTAMP) - Application date
```

**Sample Data:**
```json
{
  "id": 1,
  "job_id": 1,
  "user_id": 1,
  "applicant_name": "John Doe",
  "applicant_email": "john@example.com",
  "applicant_phone": "+91-9876543210",
  "applicant_address": "123 Main St, Bangalore",
  "education": "B.Tech Computer Science",
  "qualification": "5 years experience",
  "resume_url": "https://example.com/resume.pdf",
  "accepted_terms": true,
  "cover_letter": "I am interested in this role...",
  "status": "Pending",
  "applied_at": "2024-06-10T10:00:00Z"
}
```

---

## **5. exams** - Entrance Exams

**Purpose:** Store exam information (JEE, NEET, CET, etc.)

**Columns:**
```
id (INT, Primary Key)
name (TEXT) - Exam name (e.g., "JEE Main")
exam_code (TEXT, Unique) - Exam code (e.g., "JEE_MAIN")
category (ENUM) - 'IT', 'NON_IT', 'STATE_GOVT', 'CENTRAL_GOVT'
description (TEXT) - About the exam
exam_date (DATE) - When is exam?
registration_url (TEXT) - Registration link
created_at (TIMESTAMP) - When added
```

**Sample Data:**
```json
{
  "id": 1,
  "name": "JEE Main",
  "exam_code": "JEE_MAIN",
  "category": "IT",
  "description": "National engineering entrance exam",
  "exam_date": "2024-01-25",
  "registration_url": "https://jeemain.nta.nic.in",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## **6. study_materials** - Study Resources

**Purpose:** Store exam study materials (PDFs, videos, notes)

**Columns:**
```
id (INT, Primary Key)
exam_id (INT, Foreign Key) - Which exam?
title (TEXT) - Material title
subject (TEXT) - Subject (e.g., "Physics", "Mathematics")
type (ENUM) - 'PDF', 'Video', 'Notes', 'Practice_Test'
description (TEXT) - What is this about?
url (TEXT) - Download/view link
created_at (TIMESTAMP) - When added
```

**Sample Data:**
```json
{
  "id": 1,
  "exam_id": 1,
  "title": "JEE Main Physics Notes",
  "subject": "Physics",
  "type": "PDF",
  "description": "Complete physics notes for JEE Main",
  "url": "https://example.com/jee-physics.pdf",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## **7. colleges** - College Information

**Purpose:** Store college details

**Columns:**
```
id (INT, Primary Key)
name (TEXT) - College name
code (TEXT, Unique) - College code
state (TEXT) - State/Region
city (TEXT) - City
category (TEXT) - Government/Private
established_year (INT) - Year founded
website_url (TEXT) - College website
logo_url (TEXT) - College logo
created_at (TIMESTAMP) - When added
```

**Sample Data:**
```json
{
  "id": 1,
  "name": "Indian Institute of Technology Bombay",
  "code": "IITB",
  "state": "Maharashtra",
  "city": "Mumbai",
  "category": "Government",
  "established_year": 1958,
  "website_url": "https://iitb.ac.in",
  "logo_url": "https://example.com/iitb.png",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## **8. hr_emails** - HR Contact Information

**Purpose:** Store HR email addresses for job inquiries

**Columns:**
```
id (INT, Primary Key)
job_id (INT, Foreign Key) - Which job?
email (TEXT) - HR email address
label (TEXT) - 'Primary', 'Secondary', etc.
added_by (TEXT) - Who added this?
created_at (TIMESTAMP) - When added
```

**Sample Data:**
```json
{
  "id": 1,
  "job_id": 1,
  "email": "hr@google.com",
  "label": "Primary",
  "added_by": "admin",
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## **9. messages** - Communication Messages

**Purpose:** Store messages from applicants to HR

**Columns:**
```
id (INT, Primary Key)
job_id (INT, Foreign Key) - Which job?
sender_name (TEXT) - Who sent message?
sender_email (TEXT) - Sender's email
hr_email (TEXT) - HR email
subject (TEXT) - Message subject
body (TEXT) - Message content
is_reply (BOOLEAN) - Is this a reply?
sent_at (TIMESTAMP) - When sent?
```

**Sample Data:**
```json
{
  "id": 1,
  "job_id": 1,
  "sender_name": "John Doe",
  "sender_email": "john@example.com",
  "hr_email": "hr@google.com",
  "subject": "Question about Software Engineer role",
  "body": "Hello, I have a question about...",
  "is_reply": false,
  "sent_at": "2024-06-10T15:30:00Z"
}
```

---

## **10. session** - Express Session Storage

**Purpose:** Store user session data (created automatically)

**Columns:**
```
sid (VARCHAR, Primary Key) - Session ID
sess (JSON) - Session data
expire (TIMESTAMP) - Session expiration time
```

**Note:** This table is created automatically by Express when first used.

---

## 🔑 Relationships Map

```
users
  ├── many-to-many → jobs (through applications)
  └── one-to-many → applications

jobs
  ├── many-to-one → companies
  ├── one-to-many → applications
  ├── one-to-many → hr_emails
  └── one-to-many → messages

companies
  └── one-to-many → jobs

exams
  └── one-to-many → study_materials

colleges
  (standalone)

applications
  ├── many-to-one → jobs
  └── many-to-one → users (optional)

study_materials
  └── many-to-one → exams

hr_emails
  └── many-to-one → jobs

messages
  └── many-to-one → jobs
```

---

## 📋 Minimum Data Required

Your app will work with these minimum entries:

### 1. At least 1 company:
```sql
INSERT INTO companies (name, email, website_url, location) 
VALUES ('Tech Company', 'hr@tech.com', 'https://tech.com', 'Bangalore');
```

### 2. At least 1 job:
```sql
INSERT INTO jobs (title, company_id, category, description, location, active) 
VALUES ('Engineer', 1, 'IT', 'Great job', 'Bangalore', true);
```

### 3. At least 1 exam (optional):
```sql
INSERT INTO exams (name, exam_code, category) 
VALUES ('JEE Main', 'JEE_MAIN', 'IT');
```

### 4. At least 1 college (optional):
```sql
INSERT INTO colleges (name, state, city, category) 
VALUES ('My College', 'Karnataka', 'Bangalore', 'Government');
```

---

## 🔄 Data Flow

```
User logs in
    ↓
Creates account in 'users' table
    ↓
User views jobs from 'jobs' table
    ↓
User applies for job
    ↓
Application created in 'applications' table
    ↓
HR reviews and updates 'status'
    ↓
User receives email notification
```

---

## ✅ Verification Queries

Run these in Supabase SQL editor to verify setup:

```sql
-- Count all users
SELECT COUNT(*) FROM users;

-- Count all jobs
SELECT COUNT(*) FROM jobs;

-- Count all applications
SELECT COUNT(*) FROM applications;

-- Check company-job relationship
SELECT c.name, j.title FROM companies c 
JOIN jobs j ON c.id = j.company_id;

-- Check user applications
SELECT u.name, j.title, a.status FROM users u
JOIN applications a ON u.id = a.user_id
JOIN jobs j ON a.job_id = j.id;
```

---

## 🛠️ How to Add Data

### Option 1: Using SQL in Supabase Console
1. Go to https://supabase.com
2. Select your project
3. Go to SQL Editor
4. Write INSERT statements (see examples above)

### Option 2: Using Seed Script
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm run seed
```

### Option 3: Using Application UI
1. When deployed, create companies/jobs through admin panel
2. Users create accounts through sign up

---

## 🚀 After Setting Up

Once all tables exist with sample data:

1. **Run backend:** `cd artifacts/api-server && pnpm run start`
2. **Run frontend:** `cd artifacts/job-portal && pnpm run dev`
3. **Visit:** http://localhost:5173
4. **Create account** or login with test credentials
5. **View jobs** from the jobs table
6. **Apply for jobs** - creates records in applications table
7. **Check messages** - stored in messages table

---

## 🔐 Notes on Security

- **Never** expose `DIRECT_URL` (only for migrations)
- **Always** use `DATABASE_URL` in production (connection pooling)
- **Never** commit `.env` to GitHub
- **Rotate** credentials regularly
- **Use** environment variables for sensitive data
- **Enable** Row Level Security (RLS) in Supabase for production

---

## 📞 Need Help?

- Check **Supabase SQL Editor** for table structure
- Use `SELECT * FROM information_schema.tables WHERE table_schema='public'` to list all tables
- Check **Backend logs** for database connection errors
- Check **Frontend console (F12)** for API errors
