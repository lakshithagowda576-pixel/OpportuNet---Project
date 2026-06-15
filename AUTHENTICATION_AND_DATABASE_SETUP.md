# OpportuNet - Authentication Issues & Database Setup Guide

## 🔴 Issue 1: "Unexpected token 'T', 'The page c'..." JSON Error

This error occurs when the frontend tries to parse HTML as JSON. This happens because:

1. **Backend is not running** - The API endpoint is down
2. **API endpoint returns 404** - Returns HTML error page instead of JSON
3. **CORS issues** - Request is blocked or returns error
4. **Environment variables not set** - Wrong API URL

### ✅ Quick Fix Steps:

**1. Ensure Backend is Running**
```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\artifacts\api-server
pnpm run build
pnpm run start
```

Should see: `Server is running on port 3008`

**2. Verify Environment Variables in Frontend**

Check `.env` file in OpportuNet root:
```
VITE_SUPABASE_URL=https://vyjcsbrizpqxerhmuxfn.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_i4c9pWLajSadnl3OaQ2EBw_yBEl1jZy
VITE_API_BASE_URL=http://localhost:3008
```

⚠️ **IMPORTANT**: Add `VITE_API_BASE_URL` to your `.env` if missing!

**3. Check if Frontend is Using Correct API URL**

Open browser DevTools (F12) → Console and check:
- Are API calls going to `http://localhost:3008`?
- Or are they going somewhere else?
- Look for 404 or CORS errors

**4. Test API Directly**
```bash
curl http://localhost:3008/api/auth/me
```

Should return:
```json
{"error": "Not authenticated"}
```

NOT an HTML error page.

---

## 🗄️ Issue 2: Database Tables Not Created

### What Tables Need to Exist:

1. **`public.users`** - User accounts
2. **`public.jobs`** - Job postings
3. **`public.applications`** - Job applications
4. **`public.exams`** - Entrance exams (JEE, CET, etc.)
5. **`public.study_materials`** - Study resources
6. **`public.companies`** - Company information
7. **`public.hr_emails`** - HR contact emails
8. **`public.messages`** - Communication messages
9. **`public.colleges`** - College data
10. **`public.session`** - Express session storage

### ✅ Create Tables Automatically:

**Option 1: Use Drizzle Migrations (Recommended)**

```bash
cd c:\Users\LENOVO\Downloads\OpportuNet\lib\db
pnpm run push
```

This will:
- Run all migrations
- Create all tables
- Set up foreign keys and enums

**Option 2: Manual SQL in Supabase**

1. Go to https://supabase.com → Login
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy and paste the schema (see below)
5. Click **Run**

---

## 📊 Database Schema Setup

### Create Enums First:

```sql
CREATE TYPE application_status AS ENUM ('Pending', 'Reviewed', 'Interview', 'Offered', 'Rejected', 'Redirected');
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'github', 'facebook', 'linkedin');
CREATE TYPE job_category AS ENUM ('IT', 'NON_IT', 'STATE_GOVT', 'CENTRAL_GOVT');
CREATE TYPE shift_type AS ENUM ('Day', 'Night', 'Full_time', 'Part_time');
CREATE TYPE study_material_type AS ENUM ('PDF', 'Video', 'Notes', 'Practice_Test');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'hr');
```

### Create Users Table:

```sql
CREATE TABLE public.users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT,
  role user_role DEFAULT 'user' NOT NULL,
  provider auth_provider DEFAULT 'email' NOT NULL,
  provider_id TEXT,
  avatar TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_users_email ON public.users(email);
```

### Create Jobs Table:

```sql
CREATE TABLE public.jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company_id INTEGER REFERENCES public.companies(id),
  category job_category NOT NULL,
  description TEXT,
  requirements TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  location TEXT,
  shift_type shift_type,
  posted_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  active BOOLEAN DEFAULT true
);

CREATE INDEX idx_jobs_category ON public.jobs(category);
CREATE INDEX idx_jobs_company ON public.jobs(company_id);
```

### Create Companies Table:

```sql
CREATE TABLE public.companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Create Applications Table:

```sql
CREATE TABLE public.applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES public.jobs(id),
  user_id INTEGER REFERENCES public.users(id),
  applicant_name TEXT NOT NULL,
  applicant_email TEXT NOT NULL,
  applicant_phone TEXT,
  applicant_address TEXT,
  education TEXT,
  qualification TEXT,
  resume_url TEXT,
  accepted_terms BOOLEAN DEFAULT false NOT NULL,
  cover_letter TEXT,
  status application_status DEFAULT 'Pending' NOT NULL,
  applied_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_applications_job ON public.applications(job_id);
CREATE INDEX idx_applications_user ON public.applications(user_id);
```

### Create Exams Table:

```sql
CREATE TABLE public.exams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  exam_code TEXT NOT NULL UNIQUE,
  category job_category,
  description TEXT,
  exam_date DATE,
  registration_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Create Study Materials Table:

```sql
CREATE TABLE public.study_materials (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES public.exams(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type study_material_type NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_study_materials_exam ON public.study_materials(exam_id);
```

### Create HR Emails Table:

```sql
CREATE TABLE public.hr_emails (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES public.jobs(id),
  email TEXT NOT NULL,
  label TEXT DEFAULT 'Primary' NOT NULL,
  added_by TEXT DEFAULT 'admin' NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hr_emails_job ON public.hr_emails(job_id);
```

### Create Messages Table:

```sql
CREATE TABLE public.messages (
  id SERIAL PRIMARY KEY,
  job_id INTEGER NOT NULL REFERENCES public.jobs(id),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  hr_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  is_reply BOOLEAN DEFAULT false NOT NULL,
  sent_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_messages_job ON public.messages(job_id);
```

### Create Colleges Table:

```sql
CREATE TABLE public.colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  state TEXT,
  city TEXT,
  category TEXT,
  established_year INTEGER,
  website_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_colleges_state ON public.colleges(state);
```

### Create Session Table (For Express Sessions):

```sql
CREATE TABLE session (
  sid VARCHAR NOT NULL COLLATE "default" PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX idx_session_expire ON session(expire);
```

---

## 🌱 Seed Initial Data

### Sample Companies Data:

```sql
INSERT INTO public.companies (name, logo_url, description, website_url, email, location) VALUES
('Google', 'https://example.com/google.png', 'Tech Giant', 'google.com', 'careers@google.com', 'Mountain View'),
('Microsoft', 'https://example.com/microsoft.png', 'Software Company', 'microsoft.com', 'careers@microsoft.com', 'Redmond'),
('Amazon', 'https://example.com/amazon.png', 'E-commerce & Cloud', 'amazon.com', 'careers@amazon.com', 'Seattle');
```

### Sample Jobs Data:

```sql
INSERT INTO public.jobs (title, company_id, category, description, requirements, salary_min, salary_max, location, shift_type) VALUES
('Software Engineer', 1, 'IT', 'Build amazing features', 'B.Tech in CS', 80000, 150000, 'Bangalore', 'Full_time'),
('Data Scientist', 2, 'IT', 'Work with data', 'M.Tech or PhD', 100000, 180000, 'Hyderabad', 'Full_time'),
('Business Analyst', 3, 'NON_IT', 'Analyze business', 'Any Graduation', 50000, 100000, 'Chennai', 'Full_time');
```

### Sample Exams Data:

```sql
INSERT INTO public.exams (name, exam_code, category, description, exam_date) VALUES
('JEE Main', 'JEE_MAIN', 'IT', 'Engineering entrance', '2024-01-25'),
('Karnataka CET', 'KCET', 'IT', 'State engineering exam', '2024-06-20'),
('GATE', 'GATE', 'IT', 'Graduate engineering exam', '2024-02-03');
```

---

## 🔧 Complete Setup Checklist

- [ ] **Backend Setup**
  - [ ] Database URL is correct in `.env`
  - [ ] Run `pnpm run build` in api-server
  - [ ] Run `pnpm run start` - Backend starts on port 3008
  - [ ] Test: `curl http://localhost:3008/api/auth/me`

- [ ] **Database Setup**
  - [ ] All tables created (run migrations or SQL)
  - [ ] Sample data seeded
  - [ ] No connection errors in backend logs

- [ ] **Frontend Setup**
  - [ ] `VITE_SUPABASE_URL` in .env
  - [ ] `VITE_SUPABASE_ANON_KEY` in .env
  - [ ] `VITE_API_BASE_URL=http://localhost:3008` in .env
  - [ ] Run `pnpm run build` in job-portal
  - [ ] Run `pnpm run serve` - Frontend loads on port 4173
  - [ ] Open http://localhost:4173

- [ ] **Test Login**
  - [ ] No JSON parsing errors in browser console
  - [ ] API calls visible in DevTools Network tab
  - [ ] Can see response from `/api/auth/me`

---

## 🚨 Common Issues & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Unexpected token 'T'` | Backend not running or 404 | Start backend: `pnpm run start` |
| `Cannot GET /api/auth/me` | Route not defined | Check backend routes are mounted |
| `CORS error` | Frontend origin not allowed | Check CORS config in `app.ts` |
| `Database connection failed` | Wrong DATABASE_URL | Verify in Supabase console |
| `Table does not exist` | Migrations not run | Run: `pnpm run push` |
| `Blank white page` | Missing env vars | Check all VITE_ variables |

---

## 📝 Testing Flow

### 1. Test Backend API Only:
```bash
# Test health endpoint
curl http://localhost:3008/api/health

# Test auth endpoint  
curl http://localhost:3008/api/auth/me
```

### 2. Test Frontend with Backend:
1. Open http://localhost:4173
2. Open DevTools (F12) → Console
3. Try clicking "Sign In"
4. Check Network tab for API calls
5. Verify responses are JSON, not HTML

### 3. Test Complete Login:
1. Register a new account
2. Or login with test credentials (if seeded)
3. Should redirect to dashboard

---

## 📚 File References

- Backend routes: `artifacts/api-server/src/routes/`
- Database schema: `lib/db/drizzle/schema.ts`
- Frontend auth: `artifacts/job-portal/src/context/AuthContext.tsx`
- Frontend login: `artifacts/job-portal/src/pages/LoginPage.tsx`

---

## 🎯 Next Steps

1. **Verify backend is running** - Most critical
2. **Create all database tables** - Use migrations
3. **Seed sample data** - At least one company and job
4. **Test API endpoints** - Using curl or Postman
5. **Update environment variables** - Especially `VITE_API_BASE_URL`
6. **Test frontend login** - Check console for errors
7. **Deploy to Render/Vercel** - When everything works locally
