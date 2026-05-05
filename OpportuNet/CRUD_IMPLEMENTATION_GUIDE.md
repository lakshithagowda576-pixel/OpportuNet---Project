# CRUD API Endpoints & Company Branding Implementation Guide

## Overview

This guide documents the complete CRUD API endpoints for managing jobs, colleges, exams, and study materials, along with company branding functionality for application pages.

## Backend Implementation

### 1. Updated Zod Schemas (`lib/api-zod/src/crud-schemas.ts`)

All validation schemas for CRUD operations are centralized in one file:

- `CreateJobSchema` / `UpdateJobSchema`
- `CreateCollegeSchema` / `UpdateCollegeSchema`
- `CreateCollegeCutoffSchema` / `UpdateCollegeCutoffSchema`
- `CreateCollegeFeeSchema` / `UpdateCollegeFeeSchema`
- `CreateExamSchema` / `UpdateExamSchema`
- `CreateStudyMaterialSchema` / `UpdateStudyMaterialSchema`
- `CreateCompanySchema` / `UpdateCompanySchema`

### 2. Admin Routes (`artifacts/api-server/src/routes/admin.ts`)

All CRUD operations require admin or HR role (`requireAdmin` middleware).

#### Jobs CRUD
```
POST   /api/admin/jobs           - Create job
PUT    /api/admin/jobs/:id       - Update job
DELETE /api/admin/jobs/:id       - Delete job
GET    /api/admin/jobs           - List all jobs (existing)
```

**Example Request:**
```json
POST /api/admin/jobs
{
  "title": "Senior Software Engineer",
  "company": "Google",
  "category": "IT",
  "location": "Mountain View, CA",
  "shift": "Full_time",
  "description": "We are looking for...",
  "eligibility": "Bachelor's degree in CS...",
  "applicationGuide": "Apply through our portal...",
  "startDate": "2024-05-01T00:00:00Z",
  "endDate": "2024-06-30T23:59:59Z",
  "hrEmail": "hiring@google.com",
  "salary": "200,000 - 300,000 USD",
  "openings": 5,
  "applicationLink": "https://careers.google.com/job/123"
}
```

#### Colleges CRUD
```
POST   /api/admin/colleges       - Create college
PUT    /api/admin/colleges/:id   - Update college
DELETE /api/admin/colleges/:id   - Delete college
GET    /api/admin/colleges       - List all colleges
```

#### College Cutoffs & Fees CRUD
```
POST   /api/admin/college-cutoffs       - Create cutoff
PUT    /api/admin/college-cutoffs/:id   - Update cutoff
DELETE /api/admin/college-cutoffs/:id   - Delete cutoff

POST   /api/admin/college-fees       - Create fee
PUT    /api/admin/college-fees/:id   - Update fee
DELETE /api/admin/college-fees/:id   - Delete fee
```

#### Exams CRUD
```
POST   /api/admin/exams         - Create exam
PUT    /api/admin/exams/:id     - Update exam
DELETE /api/admin/exams/:id     - Delete exam
GET    /api/admin/exams         - List all exams
```

**Example Request:**
```json
POST /api/admin/exams
{
  "name": "SSC",
  "fullName": "Staff Selection Commission Combined Graduate Level Examination",
  "description": "The SSC CGL exam is conducted for...",
  "examDate": "2024-12-15T00:00:00Z",
  "applicationStartDate": "2024-10-01T00:00:00Z",
  "applicationEndDate": "2024-11-15T23:59:59Z",
  "applyLink": "https://ssc.nic.in/apply",
  "eligibility": "Bachelor's degree from recognized university",
  "applicationGuide": "Candidates can apply online through SSC portal...",
  "officialWebsite": "https://ssc.nic.in"
}
```

#### Study Materials CRUD
```
POST   /api/admin/study-materials         - Create material
PUT    /api/admin/study-materials/:id     - Update material
DELETE /api/admin/study-materials/:id     - Delete material
GET    /api/admin/study-materials         - List all materials
```

#### Companies CRUD
```
POST   /api/admin/companies         - Create company
PUT    /api/admin/companies/:id     - Update company
DELETE /api/admin/companies/:id     - Delete company
GET    /api/companies               - List all companies (public)
GET    /api/companies/:name         - Get company by name (public)
```

### 3. Authentication Middleware Updates

Updated `artifacts/api-server/src/middleware/requireAuth.ts`:

- `requireAdmin()` - Now accepts both "admin" and "hr" roles
- `requireAdminOnly()` - New function for admin-only operations (if needed)

### 4. Companies Route (`artifacts/api-server/src/routes/companies.ts`)

Added CRUD endpoints for company branding management:

```typescript
// Create company with branding
POST /api/admin/companies
{
  "name": "Google",
  "logoUrl": "https://...",
  "primaryColor": "#4285F4",
  "secondaryColor": "#34A853",
  "description": "...",
  "foundedYear": 1998,
  "headquarters": "Mountain View, California",
  "website": "https://google.com/careers",
  "linkedin": "https://linkedin.com/company/google",
  "twitter": "https://twitter.com/google",
  "companySize": "190,000+ employees",
  "industry": "Technology",
  "culture": "...",
  "benefits": "...",
  "type": "corporate"  // or "government"
}
```

## Frontend Implementation

### 1. React Query Hooks (`artifacts/job-portal/src/hooks/use-admin-mutations.ts`)

Custom hooks for all CRUD operations with automatic error handling and toast notifications:

```typescript
import {
  useCreateJob, useUpdateJob, useDeleteJob,
  useCreateCollege, useUpdateCollege, useDeleteCollege,
  useCreateExam, useUpdateExam, useDeleteExam,
  useCreateStudyMaterial, useUpdateStudyMaterial, useDeleteStudyMaterial,
} from "@/hooks/use-admin-mutations";

// Usage example
function MyComponent() {
  const createJobMutation = useCreateJob();
  
  const handleCreateJob = async (jobData) => {
    await createJobMutation.mutateAsync(jobData);
    // Toast notification automatically shown on success/error
  };
}
```

### 2. Admin Management Components

#### Job Management (`components/admin/JobManagement.tsx`)
- Table view of all jobs
- Create/Edit job form with validation
- Delete functionality
- Real-time updates via React Query

#### College Management (`components/admin/CollegeManagement.tsx`)
- Manage colleges
- View college details
- Edit college information
- Delete colleges

#### Exam Management (`components/admin/ExamManagement.tsx`)
- Create and manage exams
- Track exam dates and applications
- Edit exam details

#### Study Material Management (`components/admin/StudyMaterialManagement.tsx`)
- Add study materials (PDF, Video, Notes, Practice Tests)
- Link materials to exams
- Edit and delete materials

### 3. Company Branding Components

#### CompanyBrandedLayout (`components/apply/CompanyBrandedLayout.tsx`)
Wrapper component that applies company branding to the application page:
- Dynamic header with company logo and name
- Brand color styling (primary and secondary colors)
- Special styling for government jobs
- Government emblem and flag colors for government exams

#### CompanyDetails (`components/apply/CompanyDetails.tsx`)
Displays comprehensive company information:
- Company history and founding year
- Company culture and values
- Office locations
- Company size and industry
- Benefits and perks
- Social media links
- Official website link

#### JobDetailsSection (`components/apply/JobDetailsSection.tsx`)
Shows job-specific information:
- Job title and description
- Salary range
- Location and work shift
- Required qualifications
- Responsibilities
- Number of openings

#### ApplicationForm (`components/apply/ApplicationForm.tsx`)
Comprehensive application form with:
- Personal information (name, email, phone)
- Professional details (experience, current company)
- Education and skills
- Resume upload (PDF/DOC)
- Cover letter (optional)
- Portfolio/GitHub link
- LinkedIn profile
- Declaration checkbox
- Government-specific digital signature for govt jobs

## Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  logoUrl TEXT,
  primaryColor TEXT NOT NULL DEFAULT '#4285F4',
  secondaryColor TEXT NOT NULL DEFAULT '#34A853',
  description TEXT,
  foundedYear INTEGER,
  headquarters TEXT,
  website TEXT,
  linkedin TEXT,
  twitter TEXT,
  companySize TEXT,
  industry TEXT,
  culture TEXT,
  benefits TEXT,
  type TEXT NOT NULL DEFAULT 'corporate', -- 'corporate' or 'government'
  createdAt TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Seed Data

20+ companies are seeded with complete branding information:

**Tech Giants:**
- Google (Blue/Green)
- Microsoft (Orange-red)
- Amazon (Orange)
- Apple (Dark gray)

**Indian IT Companies:**
- Infosys (Blue/Orange)
- TCS (Blue/Orange)
- Wipro (Dark blue/Orange)
- HCL (Blue/Orange)
- Tech Mahindra (Golden/Blue)
- Accenture (Purple/Teal)

**Government Exams:**
- UPSC (Saffron/Green - Government colors)
- SSC (Saffron/Green)
- IBPS (Blue/Orange)
- RRB (Red/White)
- KPSC (Saffron/Green - Karnataka colors)

**Other Major Companies:**
- IBM, Oracle, Cisco, Intel, Dell

Run seed data:
```bash
npm run seed  # Seeds jobs, colleges, exams, and companies
```

## API Error Handling

All endpoints return proper error responses:

```json
// Validation error
{
  "error": "Validation error",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "path": ["title"],
      "message": "Title required"
    }
  ]
}

// Not found
{
  "error": "Job not found"
}

// Server error
{
  "error": "Failed to create job: Database connection error"
}
```

## Admin Panel Integration

The AdminPanel component (`pages/AdminPanel.tsx`) now includes:
- Tabs for Jobs, Colleges, Exams, Study Materials
- Dashboard with statistics
- Application management
- HR email management
- User management

### Using Admin Components in AdminPanel

```tsx
import { JobManagement } from "@/components/admin/JobManagement";
import { CollegeManagement } from "@/components/admin/CollegeManagement";
import { ExamManagement } from "@/components/admin/ExamManagement";
import { StudyMaterialManagement } from "@/components/admin/StudyMaterialManagement";

function AdminPanel() {
  const [activeTab, setActiveTab] = useState("jobs");

  return (
    <div>
      {activeTab === "jobs" && <JobManagement />}
      {activeTab === "colleges" && <CollegeManagement />}
      {activeTab === "exams" && <ExamManagement />}
      {activeTab === "materials" && <StudyMaterialManagement />}
    </div>
  );
}
```

## Application Page Flow

1. **User clicks "Apply Now" on job listing**
   - Navigates to `/apply/:jobId`

2. **ApplyPage component:**
   - Fetches job details from `/api/jobs/:id`
   - Fetches company branding from `/api/companies/:companyName`
   - Applies company-specific styling

3. **Company branding applied:**
   - Logo displayed in header
   - Primary/secondary colors applied
   - Special styling for government jobs

4. **User fills application form:**
   - All fields validated using Zod schemas
   - Resume uploaded as file or base64
   - Form data submitted to `/api/applications/direct`

5. **Success page:**
   - Shows application ID
   - Confirmation message
   - Links to dashboard and applications tracker

## Security Notes

1. **All CRUD endpoints require authentication:**
   - Admin or HR role required via `requireAdmin` middleware
   - Enforced at route level

2. **Input validation:**
   - All data validated using Zod schemas
   - Client and server-side validation

3. **Role-based access:**
   - Admin: Can perform all CRUD operations
   - HR: Can perform all CRUD operations (configurable)
   - Regular users: Can view public data and apply for jobs

4. **Database operations:**
   - Use parameterized queries via Drizzle ORM
   - Protection against SQL injection

## Testing the Implementation

### Test Job Creation
```bash
curl -X POST http://localhost:5000/api/admin/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer",
    "company": "Google",
    "category": "IT",
    "location": "Mountain View",
    "shift": "Full_time",
    "description": "...",
    "eligibility": "Bachelor in CS",
    "applicationGuide": "Apply online",
    "startDate": "2024-05-01T00:00:00Z",
    "endDate": "2024-06-30T23:59:59Z",
    "hrEmail": "hr@google.com",
    "salary": "200k-300k",
    "openings": 5
  }'
```

### Test Company Retrieval
```bash
curl http://localhost:5000/api/companies/Google
```

### Test Application Submission
```bash
curl -X POST http://localhost:5000/api/applications/direct \
  -F "jobId=1" \
  -F "fullName=John Doe" \
  -F "email=john@example.com" \
  -F "phone=9876543210" \
  -F "resume=@resume.pdf"
```

## Troubleshooting

### Admin routes returning 403 Forbidden
- Ensure user is logged in with admin or hr role
- Check `req.session?.userRole` value in middleware

### Company branding not applying
- Verify company name exactly matches in jobs table
- Check company colors are valid hex codes
- Ensure company record exists in database

### Form validation errors
- Check Zod schema requirements in `crud-schemas.ts`
- Ensure all required fields are provided
- Validate date formats (ISO 8601)
- Email must be valid format

### Resume upload fails
- Ensure file is PDF or DOC/DOCX
- Check file size is under 5MB
- Verify `/uploads` directory exists and is writable

## Future Enhancements

1. Bulk upload of jobs/colleges/exams via CSV
2. Email notifications for applications
3. Application status tracking dashboard
4. Advanced filtering and search
5. Analytics and reporting
6. Multi-language support for company descriptions
7. Integration with external ATS systems

---

**Last Updated:** 2024
**Version:** 1.0.0
