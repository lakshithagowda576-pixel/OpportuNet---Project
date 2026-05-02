# OpportuNet CRUD Implementation Guide

## Overview

This document provides a complete guide to the CRUD (Create, Read, Update, Delete) functionality added to the OpportuNet project for managing jobs, colleges, exams, and study materials through the admin panel.

## Architecture

### Backend (Express.js + Drizzle ORM)

**Location:** [`artifacts/api-server/src/routes/admin.ts`](artifacts/api-server/src/routes/admin.ts)

#### Authentication
All CRUD endpoints are protected by `requireAdminOrHR` middleware, which verifies that the authenticated user has either "admin" or "hr" role.

```typescript
import { requireAdminOrHR } from "../middleware/requireAuth";
// Applied to all CRUD routes automatically
```

### Validation Layer (Zod Schemas)

**Location:** [`lib/api-zod/src/crud-schemas.ts`](lib/api-zod/src/crud-schemas.ts)

All request payloads are validated using Zod schemas before processing. This ensures data integrity and type safety.

---

## API Endpoints

### JOBS MANAGEMENT

#### Create Job
```
POST /api/admin/jobs/create
Authorization: Required (admin/hr)

Request Body (CreateJobInput):
{
  title: string;                          // Min 2, max 255 chars
  company: string;                        // Min 2, max 255 chars
  category: "IT" | "NON_IT" | "STATE_GOVT" | "CENTRAL_GOVT";
  location: string;                       // Min 2, max 255 chars
  shift: "Day" | "Night" | "Full_time" | "Part_time";
  description: string;                    // Min 10 chars
  eligibility: string;                    // Min 10 chars
  applicationGuide: string;               // Min 10 chars
  startDate: string;                      // Format: YYYY-MM-DD
  endDate: string;                        // Format: YYYY-MM-DD
  hrEmail: string;                        // Valid email
  salary: string;                         // Min 1 char
  openings: number;                       // Positive integer
  applicationLink?: string;               // Valid URL (optional)
  official_url?: string;                  // Valid URL (optional)
}

Response: 201 Created
{
  id: number;
  title: string;
  company: string;
  // ... all job fields
}
```

#### Update Job
```
PUT /api/admin/jobs/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (all fields optional for partial updates)
Response: 200 OK - Updated job object
```

#### Delete Job
```
DELETE /api/admin/jobs/:id
Authorization: Required (admin/hr)

Response: 200 OK
{
  success: true;
  message: "Job deleted successfully"
}
```

#### List Jobs
```
GET /api/admin/jobs
Authorization: Not required for listing

Response: 200 OK - Array of all jobs
```

---

### COLLEGES MANAGEMENT

#### Create College
```
POST /api/admin/colleges/create
Authorization: Required (admin/hr)

Request Body (CreateCollegeInput):
{
  name: string;                           // Min 2, max 255 chars
  location: string;                       // Min 2, max 255 chars
  city: string;                           // Min 2, max 100 chars
  state: string;                          // Min 2, max 100 chars
  collegeCode?: string;                   // Max 50 chars (optional)
  affiliation?: string;                   // Max 255 chars (optional)
  about?: string;                         // Optional
  websiteUrl?: string;                    // Valid URL (optional)
  contactEmail?: string;                  // Valid email (optional)
  contactPhone?: string;                  // Optional
  establishedYear?: number;               // 1800 to current year (optional)
  facilities?: string[];                  // Array of facility names (optional)
  qualification?: string;                 // Optional
}

Response: 201 Created
{
  id: number;
  name: string;
  // ... all college fields
}
```

#### Update College
```
PUT /api/admin/colleges/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (all fields optional for partial updates)
Response: 200 OK - Updated college object
```

#### Delete College
```
DELETE /api/admin/colleges/:id
Authorization: Required (admin/hr)
Note: Automatically deletes all associated cutoffs and fees

Response: 200 OK
{
  success: true;
  message: "College and related data deleted successfully"
}
```

#### List Colleges with Nested Data
```
GET /api/admin/colleges
Authorization: Not required

Response: 200 OK - Array of colleges with nested cutoffs and fees
[
  {
    id: number;
    name: string;
    // ... college fields
    cutoffs: [
      {
        id: number;
        collegeId: number;
        courseName: string;
        category: string;
        cutoffScore: number;
        ugSeats: number;
        pgSeats: number;
        academicYear: string;
      }
    ];
    fees: [
      {
        id: number;
        collegeId: number;
        courseType: "UG" | "PG";
        courseName: string;
        annualFees: string;
        totalFees: string;
        description: string;
        academicYear: string;
      }
    ];
  }
]
```

---

### COLLEGE CUTOFFS MANAGEMENT

#### Create Cutoff
```
POST /api/admin/college-cutoffs/create
Authorization: Required (admin/hr)

Request Body (CreateCollegeCutoffInput):
{
  collegeId: number;                      // Required, must be valid college ID
  courseName: string;                     // Min 2, max 255 chars
  category?: string;                      // Max 50 chars (default: "General")
  cutoffScore: number;                    // Non-negative integer
  ugSeats?: number;                       // Non-negative (default: 0)
  pgSeats?: number;                       // Non-negative (default: 0)
  academicYear?: string;                  // Max 20 chars (default: "2024-25")
}

Response: 201 Created - Cutoff object
```

#### Update Cutoff
```
PUT /api/admin/college-cutoffs/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (excluding collegeId, all fields optional)
Response: 200 OK - Updated cutoff object
```

#### Delete Cutoff
```
DELETE /api/admin/college-cutoffs/:id
Authorization: Required (admin/hr)

Response: 200 OK
```

---

### COLLEGE FEES MANAGEMENT

#### Create Fee
```
POST /api/admin/college-fees/create
Authorization: Required (admin/hr)

Request Body (CreateCollegeFeeInput):
{
  collegeId: number;                      // Required, must be valid college ID
  courseType: "UG" | "PG";               // Required
  courseName: string;                     // Min 2, max 255 chars
  annualFees?: string;                    // Optional
  totalFees?: string;                     // Optional
  description?: string;                   // Optional
  academicYear?: string;                  // Max 20 chars (default: "2024-25")
}

Response: 201 Created - Fee object
```

#### Update Fee
```
PUT /api/admin/college-fees/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (excluding collegeId, all fields optional)
Response: 200 OK - Updated fee object
```

#### Delete Fee
```
DELETE /api/admin/college-fees/:id
Authorization: Required (admin/hr)

Response: 200 OK
```

---

### EXAMS MANAGEMENT

#### Create Exam
```
POST /api/admin/exams/create
Authorization: Required (admin/hr)

Request Body (CreateExamInput):
{
  name: string;                           // Min 2, max 100 chars (short name)
  fullName: string;                       // Min 2, max 255 chars
  description: string;                    // Min 10 chars
  examDate: string;                       // Format: YYYY-MM-DD
  applicationStartDate: string;           // Format: YYYY-MM-DD
  applicationEndDate: string;             // Format: YYYY-MM-DD
  applyLink: string;                      // Valid URL (required)
  eligibility: string;                    // Min 10 chars
  applicationGuide: string;               // Min 10 chars
  officialWebsite: string;                // Valid URL (required)
}

Response: 201 Created - Exam object
```

#### Update Exam
```
PUT /api/admin/exams/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (all fields optional for partial updates)
Response: 200 OK - Updated exam object
```

#### Delete Exam
```
DELETE /api/admin/exams/:id
Authorization: Required (admin/hr)
Note: Automatically deletes all associated study materials

Response: 200 OK
{
  success: true;
  message: "Exam and related study materials deleted successfully"
}
```

#### List Exams with Nested Materials
```
GET /api/admin/exams
Authorization: Not required

Response: 200 OK - Array of exams with nested study materials
[
  {
    id: number;
    name: string;
    fullName: string;
    // ... exam fields
    materials: [
      {
        id: number;
        examId: number;
        title: string;
        subject: string;
        type: "PDF" | "Video" | "Notes" | "Practice_Test";
        description: string;
        url: string;
        createdAt: timestamp;
      }
    ];
  }
]
```

---

### STUDY MATERIALS MANAGEMENT

#### Create Study Material
```
POST /api/admin/study-materials/create
Authorization: Required (admin/hr)

Request Body (CreateStudyMaterialInput):
{
  examId: number;                         // Required, must be valid exam ID
  title: string;                          // Min 2, max 255 chars
  subject: string;                        // Min 2, max 100 chars
  type: "PDF" | "Video" | "Notes" | "Practice_Test"; // Required
  description: string;                    // Min 10 chars
  url: string;                            // Valid URL (required)
}

Response: 201 Created - Study material object
```

#### Update Study Material
```
PUT /api/admin/study-materials/:id
Authorization: Required (admin/hr)

Request Body: Same as Create (excluding examId, all fields optional)
Response: 200 OK - Updated study material object
```

#### Delete Study Material
```
DELETE /api/admin/study-materials/:id
Authorization: Required (admin/hr)

Response: 200 OK
```

---

## Frontend Components

### File Structure

```
artifacts/job-portal/src/
├── hooks/
│   └── useAdminMutations.ts          # All React Query mutation hooks
├── components/
│   ├── JobManagement.tsx             # Job CRUD UI
│   ├── CollegeManagement.tsx         # College CRUD UI with nested forms
│   ├── ExamManagement.tsx            # Exam CRUD UI with nested materials
└── pages/
    └── AdminPanel.tsx                # Updated with new tabs
```

### React Query Hooks

All hooks are in [`artifacts/job-portal/src/hooks/useAdminMutations.ts`](artifacts/job-portal/src/hooks/useAdminMutations.ts)

#### Job Hooks
```typescript
useCreateJob()    // Mutation hook for creating jobs
useUpdateJob()    // Mutation hook for updating jobs
useDeleteJob()    // Mutation hook for deleting jobs
```

#### College Hooks
```typescript
useCreateCollege()          // Create college
useUpdateCollege()          // Update college
useDeleteCollege()          // Delete college
useCreateCollegeCutoff()    // Create cutoff
useUpdateCollegeCutoff()    // Update cutoff
useDeleteCollegeCutoff()    // Delete cutoff
useCreateCollegeFee()       // Create fee
useUpdateCollegeFee()       // Update fee
useDeleteCollegeFee()       // Delete fee
```

#### Exam Hooks
```typescript
useCreateExam()             // Create exam
useUpdateExam()             // Update exam
useDeleteExam()             // Delete exam
useCreateStudyMaterial()    // Create study material
useUpdateStudyMaterial()    // Update study material
useDeleteStudyMaterial()    // Delete study material
```

### Hook Usage Example

```typescript
const createJobMut = useCreateJob();

const handleSubmit = (formData: CreateJobInput) => {
  createJobMut.mutate(formData, {
    onSuccess: () => {
      // Handle success - refetch queries automatically handled
      toast({ title: "Success", description: "Job created successfully" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};
```

### Component Features

#### JobManagement Component
- **Location:** [`artifacts/job-portal/src/components/JobManagement.tsx`](artifacts/job-portal/src/components/JobManagement.tsx)
- Add, edit, delete jobs
- Form validation with Zod schemas
- Toast notifications for feedback
- Loading states with spinner
- Grid display of all jobs with quick actions

#### CollegeManagement Component
- **Location:** [`artifacts/job-portal/src/components/CollegeManagement.tsx`](artifacts/job-portal/src/components/CollegeManagement.tsx)
- Add, edit, delete colleges
- **Nested Management:** Cutoffs and Fees
- Expandable college cards showing nested data
- Inline forms for adding/editing cutoffs and fees
- Cascade delete (deleting college removes all cutoffs and fees)
- Full form validation

#### ExamManagement Component
- **Location:** [`artifacts/job-portal/src/components/ExamManagement.tsx`](artifacts/job-portal/src/components/ExamManagement.tsx)
- Add, edit, delete exams
- **Nested Management:** Study Materials
- Expandable exam cards showing nested materials
- Inline forms for adding/editing study materials
- Cascade delete (deleting exam removes all materials)
- Material type selector (PDF, Video, Notes, Practice Test)

### Admin Panel Integration

**Location:** [`artifacts/job-portal/src/pages/AdminPanel.tsx`](artifacts/job-portal/src/pages/AdminPanel.tsx)

New tabs available (admin only):
- **Jobs** - Manage all job postings
- **Colleges** - Manage colleges with cutoffs and fees
- **Exams** - Manage exams with study materials
- **HR Emails** - Existing HR email management
- **Users** - Existing user management

---

## Error Handling

All API requests include error handling with:
- **HTTP Status Codes:**
  - 201: Resource created successfully
  - 200: Request successful
  - 400: Validation errors
  - 401: Unauthorized (not logged in)
  - 403: Forbidden (insufficient permissions)
  - 404: Resource not found
  - 500: Server error

- **Toast Notifications:** All mutations show toast feedback (success/error)
- **Loading States:** Buttons are disabled and show "Saving..." text during submission
- **Form Validation:** Zod schemas validate data before submission

---

## Database Schema Changes

No additional schema changes needed. The following existing tables are used:

```sql
-- Jobs
CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category job_category NOT NULL,
  location TEXT NOT NULL,
  shift shift_type NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  application_guide TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL,
  hr_email TEXT NOT NULL,
  salary TEXT NOT NULL,
  openings INTEGER DEFAULT 1,
  application_link TEXT DEFAULT '',
  official_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Colleges
CREATE TABLE colleges (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  college_code VARCHAR(50),
  affiliation TEXT,
  about TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  established_year INTEGER,
  facilities TEXT[],
  qualification TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- College Cutoffs
CREATE TABLE college_cutoffs (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id),
  course_name TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'General',
  cutoff_score INTEGER NOT NULL,
  ug_seats INTEGER DEFAULT 0,
  pg_seats INTEGER DEFAULT 0,
  academic_year VARCHAR(20) DEFAULT '2024-25',
  created_at TIMESTAMP DEFAULT NOW()
);

-- College Fees
CREATE TABLE college_fees (
  id SERIAL PRIMARY KEY,
  college_id INTEGER NOT NULL REFERENCES colleges(id),
  course_type VARCHAR(10) NOT NULL,
  course_name TEXT NOT NULL,
  annual_fees TEXT,
  total_fees TEXT,
  description TEXT,
  academic_year VARCHAR(20) DEFAULT '2024-25',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Exams
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  full_name TEXT NOT NULL,
  description TEXT NOT NULL,
  exam_date TEXT NOT NULL,
  application_start_date TEXT NOT NULL,
  application_end_date TEXT NOT NULL,
  apply_link TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  application_guide TEXT NOT NULL,
  official_website TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Study Materials
CREATE TABLE study_materials (
  id SERIAL PRIMARY KEY,
  exam_id INTEGER NOT NULL REFERENCES exams(id),
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  type study_material_type NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Setup

No additional environment variables are required. The existing setup is sufficient.

Make sure you have:
- PostgreSQL database configured (DATABASE_URL)
- Session secret configured (SESSION_SECRET)
- Admin/HR user with proper role set in database

---

## Testing the Implementation

### 1. Login as Admin
- Navigate to `/login`
- Login with an admin account
- You should see the new tabs in the Admin Panel

### 2. Create a Job
- Go to Admin Panel → Jobs tab
- Click "Add Job"
- Fill in all required fields
- Click "Create Job"
- You should see a success toast and the job added to the list

### 3. Create a College with Cutoffs
- Go to Admin Panel → Colleges tab
- Click "Add College"
- Fill in college details
- Submit
- Click expand button on the college card
- Add a cutoff by clicking "Add Cutoff"
- Fill in cutoff details and save

### 4. Create an Exam with Study Materials
- Go to Admin Panel → Exams tab
- Click "Add Exam"
- Fill in exam details
- Submit
- Click expand button on the exam card
- Add a study material by clicking "Add Material"
- Select material type and fill in details

---

## API Integration Example

### Using the API directly (without hooks):

```typescript
// Create a job
const response = await fetch('/api/admin/jobs/create', {
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Senior Developer',
    company: 'Tech Corp',
    category: 'IT',
    location: 'New York',
    shift: 'Day',
    description: 'We are looking for...',
    eligibility: 'B.Tech or equivalent...',
    applicationGuide: 'Apply through...',
    startDate: '2024-05-15',
    endDate: '2024-06-15',
    hrEmail: 'hr@techcorp.com',
    salary: '15-20 LPA',
    openings: 5,
  })
});
const job = await response.json();
```

---

## Security Notes

1. **Authentication:** All CRUD endpoints require authenticated session
2. **Authorization:** Endpoints check for admin or hr role
3. **Validation:** All inputs validated with Zod schemas
4. **SQL Injection:** Protected by Drizzle ORM parameterized queries
5. **CORS:** Configured to allow credentials for session-based auth

---

## Performance Considerations

1. **Query Optimization:** Nested data (cutoffs, fees, materials) fetched efficiently
2. **Caching:** React Query handles automatic refetching and caching
3. **Pagination:** Can be added to list endpoints if dataset grows large
4. **Batch Operations:** Consider batch delete for bulk operations

---

## Troubleshooting

### "Unauthorized" Error
- Ensure you're logged in
- Check that your user has admin or hr role
- Session cookie might be expired

### "Forbidden" Error
- Your role doesn't have permission
- Ask admin to assign admin/hr role

### Validation Errors
- Check error message details
- Ensure all required fields are filled
- Follow format requirements (dates, URLs, emails)

### Components Not Showing
- Check that admin tabs are imported in AdminPanel.tsx
- Verify you're logged in as admin
- Check browser console for errors

---

## Future Enhancements

1. **Bulk Operations:** Add bulk create/update/delete
2. **Export/Import:** CSV export and import for data migration
3. **Search & Filter:** Advanced search on list pages
4. **Pagination:** For large datasets
5. **Audit Log:** Track who created/modified/deleted records
6. **Batch Email:** Send emails to multiple applicants
7. **Custom Fields:** Allow admins to add custom fields to entities
8. **API Rate Limiting:** Prevent abuse of CRUD endpoints

---

## Support & Documentation

- **API Docs:** OpenAPI schema available at `/api-spec`
- **TypeScript Types:** Full type definitions from Zod and database schema
- **Code Examples:** Check component files for usage patterns
- **Database:** Schema defined in `lib/db/src/schema/`

---

**Last Updated:** May 2026
**Version:** 1.0
**Status:** Production Ready
