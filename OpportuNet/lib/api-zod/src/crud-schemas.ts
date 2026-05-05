import { z } from "zod";

// ==================== JOBS ====================
export const CreateJobSchema = z.object({
  title: z.string().min(1, "Title required").max(255),
  company: z.string().min(1, "Company required").max(255),
  category: z.enum(["IT", "NON_IT", "STATE_GOVT", "CENTRAL_GOVT"]),
  location: z.string().min(1, "Location required"),
  shift: z.enum(["Day", "Night", "Full_time", "Part_time"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
  eligibility: z.string().min(5, "Eligibility required"),
  applicationGuide: z.string().min(5, "Application guide required"),
  startDate: z.string().datetime("Invalid start date"),
  endDate: z.string().datetime("Invalid end date"),
  hrEmail: z.string().email("Invalid HR email"),
  salary: z.string().min(1),
  openings: z.number().int().min(1, "At least 1 opening required").default(1),
  applicationLink: z.string().url("Invalid URL").optional().default(""),
});

export const UpdateJobSchema = CreateJobSchema.partial();

export const DeleteJobSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;
export type UpdateJobInput = z.infer<typeof UpdateJobSchema>;

// ==================== COLLEGES ====================
export const CreateCollegeSchema = z.object({
  name: z.string().min(1, "College name required"),
  location: z.string().min(1, "Location required"),
  city: z.string().min(1, "City required"),
  state: z.string().min(1, "State required"),
  collegeCode: z.string().optional(),
  affiliation: z.string().optional(),
  about: z.string().optional(),
  websiteUrl: z.string().url("Invalid website URL").optional(),
  contactEmail: z.string().email("Invalid email").optional(),
  contactPhone: z.string().optional(),
  establishedYear: z.number().int().optional(),
  facilities: z.array(z.string()).optional().default([]),
  qualification: z.string().optional(),
});

export const UpdateCollegeSchema = CreateCollegeSchema.partial();

export const DeleteCollegeSchema = z.object({
  id: z.number().int().positive(),
});

// ==================== COLLEGE CUTOFFS ====================
export const CreateCollegeCutoffSchema = z.object({
  collegeId: z.number().int().positive(),
  courseName: z.string().min(1),
  category: z.string().default("General"),
  cutoffScore: z.number().int().min(0),
  ugSeats: z.number().int().min(0).default(0),
  pgSeats: z.number().int().min(0).default(0),
  academicYear: z.string().default("2024-25"),
});

export const UpdateCollegeCutoffSchema = CreateCollegeCutoffSchema.partial();

export const DeleteCollegeCutoffSchema = z.object({
  id: z.number().int().positive(),
});

// ==================== COLLEGE FEES ====================
export const CreateCollegeFeeSchema = z.object({
  collegeId: z.number().int().positive(),
  courseType: z.enum(["UG", "PG"]),
  courseName: z.string().min(1),
  annualFees: z.string().optional(),
  totalFees: z.string().optional(),
  description: z.string().optional(),
  academicYear: z.string().default("2024-25"),
});

export const UpdateCollegeFeeSchema = CreateCollegeFeeSchema.partial();

export const DeleteCollegeFeeSchema = z.object({
  id: z.number().int().positive(),
});

// ==================== EXAMS ====================
export const CreateExamSchema = z.object({
  name: z.string().min(1, "Exam name required"),
  fullName: z.string().min(1, "Full name required"),
  description: z.string().min(10, "Description required"),
  examDate: z.string().datetime("Invalid exam date"),
  applicationStartDate: z.string().datetime("Invalid start date"),
  applicationEndDate: z.string().datetime("Invalid end date"),
  applyLink: z.string().url("Invalid apply link"),
  eligibility: z.string().min(5, "Eligibility required"),
  applicationGuide: z.string().min(5, "Application guide required"),
  officialWebsite: z.string().url("Invalid website URL"),
});

export const UpdateExamSchema = CreateExamSchema.partial();

export const DeleteExamSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateExamInput = z.infer<typeof CreateExamSchema>;
export type UpdateExamInput = z.infer<typeof UpdateExamSchema>;

// ==================== STUDY MATERIALS ====================
export const CreateStudyMaterialSchema = z.object({
  examId: z.number().int().positive(),
  title: z.string().min(1, "Title required"),
  subject: z.string().min(1, "Subject required"),
  type: z.enum(["PDF", "Video", "Notes", "Practice_Test"]),
  description: z.string().min(10, "Description required"),
  url: z.string().url("Invalid URL"),
});

export const UpdateStudyMaterialSchema = CreateStudyMaterialSchema.partial();

export const DeleteStudyMaterialSchema = z.object({
  id: z.number().int().positive(),
});

export type CreateStudyMaterialInput = z.infer<typeof CreateStudyMaterialSchema>;
export type UpdateStudyMaterialInput = z.infer<typeof UpdateStudyMaterialSchema>;

// ==================== APPLICATIONS ====================
export const CreateApplicationDirectSchema = z.object({
  jobId: z.number().int().positive(),
  fullName: z.string().min(1, "Full name required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  currentLocation: z.string().optional(),
  yearsOfExperience: z.number().int().min(0).optional(),
  currentCompany: z.string().optional(),
  resumeUrl: z.string().url().optional(),
  coverLetter: z.string().optional(),
  portfolioLink: z.string().url().optional(),
  linkedinProfile: z.string().url().optional(),
  education: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export type CreateApplicationDirectInput = z.infer<typeof CreateApplicationDirectSchema>;

// ==================== COMPANIES ====================
export const CreateCompanySchema = z.object({
  name: z.string().min(1, "Company name required"),
  logoUrl: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").default("#4285F4"),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color").default("#34A853"),
  description: z.string().optional(),
  foundedYear: z.number().int().optional(),
  headquarters: z.string().optional(),
  website: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  companySize: z.string().optional(),
  industry: z.string().optional(),
  culture: z.string().optional(),
  benefits: z.string().optional(),
  type: z.enum(["corporate", "government"]).default("corporate"),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();

export const DeleteCompanySchema = z.object({
  id: z.number().int().positive(),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof UpdateCompanySchema>;
