import { Router } from "express";
import { db } from "@workspace/db";
import { applicationsTable, jobsTable, hrEmailsTable, usersTable, collegesTable, collegeCutoffsTable, collegeFeesTable, examsTable, studyMaterialsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../middleware/requireAuth";
import nodemailer from "nodemailer";
import { z } from "zod";
import { CreateJobSchema, UpdateJobSchema, CreateCollegeSchema, UpdateCollegeSchema, CreateCollegeCutoffSchema, UpdateCollegeCutoffSchema, CreateCollegeFeeSchema, UpdateCollegeFeeSchema, CreateExamSchema, UpdateExamSchema, CreateStudyMaterialSchema, UpdateStudyMaterialSchema } from "@workspace/api-zod";

const router = Router();
router.use(requireAdmin);

// Get all applications (admin)
router.get("/applications", async (req, res) => {
  const apps = await db.select({
    id: applicationsTable.id,
    jobId: applicationsTable.jobId,
    applicantName: applicationsTable.applicantName,
    applicantEmail: applicationsTable.applicantEmail,
    coverLetter: applicationsTable.coverLetter,
    status: applicationsTable.status,
    appliedAt: applicationsTable.appliedAt,
    jobTitle: jobsTable.title,
    company: jobsTable.company,
    hrEmail: jobsTable.hrEmail,
  }).from(applicationsTable)
    .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
    .orderBy(desc(applicationsTable.appliedAt));
  res.json(apps.map(a => ({ ...a, appliedAt: a.appliedAt.toISOString() })));
});

// Update application status (admin)
router.patch("/applications/:id/status", async (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = z.object({
    status: z.enum(["Pending", "Reviewed", "Interview", "Offered", "Rejected"])
  }).parse(req.body);
  const [updated] = await db.update(applicationsTable)
    .set({ status })
    .where(eq(applicationsTable.id, id))
    .returning();
  if (!updated) { res.status(404).json({ error: "Application not found" }); return; }
  res.json({ ...updated, appliedAt: updated.appliedAt.toISOString() });
});

// Send email to applicant (admin)
router.post("/send-email", async (req, res) => {
  const { to, subject, body, applicantName } = z.object({
    to: z.string().email(),
    subject: z.string().min(1),
    body: z.string().min(1),
    applicantName: z.string().optional(),
  }).parse(req.body);

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const fromEmail = process.env.SMTP_FROM || smtpUser || "noreply@govportal.com";

  if (!smtpHost || !smtpUser || !smtpPass) {
    // Simulate email sending if SMTP not configured
    res.json({ 
      success: true, 
      simulated: true, 
      message: `Email would be sent to ${to}. Configure SMTP_HOST, SMTP_USER, SMTP_PASS environment variables for real email sending.` 
    });
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });
    await transporter.sendMail({
      from: `"GovPortal HR" <${fromEmail}>`,
      to,
      subject,
      html: `<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">GovPortal</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          ${applicantName ? `<p>Dear <strong>${applicantName}</strong>,</p>` : ""}
          <div style="white-space: pre-wrap; line-height: 1.6;">${body}</div>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;" />
          <p style="color: #6b7280; font-size: 12px;">This email was sent from GovPortal HR Management System.</p>
        </div>
      </div>`,
    });
    res.json({ success: true, message: `Email sent to ${to}` });
  } catch (err: any) {
    res.status(500).json({ error: `Failed to send email: ${err.message}` });
  }
});

// Get all HR emails
router.get("/hr-emails", async (req, res) => {
  const emails = await db.select({
    id: hrEmailsTable.id,
    jobId: hrEmailsTable.jobId,
    email: hrEmailsTable.email,
    label: hrEmailsTable.label,
    addedBy: hrEmailsTable.addedBy,
    createdAt: hrEmailsTable.createdAt,
    jobTitle: jobsTable.title,
    company: jobsTable.company,
  }).from(hrEmailsTable)
    .leftJoin(jobsTable, eq(hrEmailsTable.jobId, jobsTable.id))
    .orderBy(desc(hrEmailsTable.createdAt));
  res.json(emails.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

// Add HR email (admin)
router.post("/hr-emails", async (req, res) => {
  const { jobId, email, label } = z.object({
    jobId: z.number().optional(),
    email: z.string().email(),
    label: z.string().optional().default("Primary"),
  }).parse(req.body);
  const adminUser = req.session?.userId ? `admin-${req.session.userId}` : "admin";
  const [created] = await db.insert(hrEmailsTable).values({
    jobId: jobId ?? null,
    email, label,
    addedBy: adminUser,
  }).returning();
  res.status(201).json({ ...created, createdAt: created.createdAt.toISOString() });
});

// Delete HR email (admin)
router.delete("/hr-emails/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(hrEmailsTable).where(eq(hrEmailsTable.id, id));
  res.json({ success: true });
});

// Get all users (admin)
router.get("/users", async (req, res) => {
  const users = await db.select({
    id: usersTable.id,
    name: usersTable.name,
    email: usersTable.email,
    role: usersTable.role,
    provider: usersTable.provider,
    createdAt: usersTable.createdAt,
  }).from(usersTable).orderBy(desc(usersTable.createdAt));
  res.json(users.map(u => ({ ...u, createdAt: u.createdAt.toISOString() })));
});

// Get all jobs (admin)
router.get("/jobs", async (req, res) => {
  const jobs = await db.select().from(jobsTable).orderBy(desc(jobsTable.id));
  res.json(jobs.map(j => ({ ...j, createdAt: j.createdAt.toISOString() })));
});

// ==================== JOBS CRUD ====================

// Create job (admin)
router.post("/jobs", async (req, res) => {
  try {
    const data = CreateJobSchema.parse(req.body);
    const [job] = await db.insert(jobsTable).values(data).returning();
    res.status(201).json({ ...job, createdAt: job.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update job (admin)
router.put("/jobs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateJobSchema.parse(req.body);
    const [job] = await db.update(jobsTable).set(data).where(eq(jobsTable.id, id)).returning();
    if (!job) {
      res.status(404).json({ error: "Job not found" });
      return;
    }
    res.json({ ...job, createdAt: job.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete job (admin)
router.delete("/jobs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(jobsTable).where(eq(jobsTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLLEGES CRUD ====================

// Get all colleges (admin)
router.get("/colleges", async (req, res) => {
  const colleges = await db.select().from(collegesTable).orderBy(desc(collegesTable.id));
  res.json(colleges.map(c => ({ ...c, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString() })));
});

// Create college (admin)
router.post("/colleges", async (req, res) => {
  try {
    const data = CreateCollegeSchema.parse(req.body);
    const [college] = await db.insert(collegesTable).values(data).returning();
    res.status(201).json({ ...college, createdAt: college.createdAt.toISOString(), updatedAt: college.updatedAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update college (admin)
router.put("/colleges/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateCollegeSchema.parse(req.body);
    const [college] = await db.update(collegesTable).set({ ...data, updatedAt: new Date() }).where(eq(collegesTable.id, id)).returning();
    if (!college) {
      res.status(404).json({ error: "College not found" });
      return;
    }
    res.json({ ...college, createdAt: college.createdAt.toISOString(), updatedAt: college.updatedAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete college (admin)
router.delete("/colleges/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(collegesTable).where(eq(collegesTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLLEGE CUTOFFS CRUD ====================

// Create college cutoff (admin)
router.post("/college-cutoffs", async (req, res) => {
  try {
    const data = CreateCollegeCutoffSchema.parse(req.body);
    const [cutoff] = await db.insert(collegeCutoffsTable).values(data).returning();
    res.status(201).json({ ...cutoff, createdAt: cutoff.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update college cutoff (admin)
router.put("/college-cutoffs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateCollegeCutoffSchema.parse(req.body);
    const [cutoff] = await db.update(collegeCutoffsTable).set(data).where(eq(collegeCutoffsTable.id, id)).returning();
    if (!cutoff) {
      res.status(404).json({ error: "Cutoff not found" });
      return;
    }
    res.json({ ...cutoff, createdAt: cutoff.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete college cutoff (admin)
router.delete("/college-cutoffs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(collegeCutoffsTable).where(eq(collegeCutoffsTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== COLLEGE FEES CRUD ====================

// Create college fee (admin)
router.post("/college-fees", async (req, res) => {
  try {
    const data = CreateCollegeFeeSchema.parse(req.body);
    const [fee] = await db.insert(collegeFeesTable).values(data).returning();
    res.status(201).json({ ...fee, createdAt: fee.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update college fee (admin)
router.put("/college-fees/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateCollegeFeeSchema.parse(req.body);
    const [fee] = await db.update(collegeFeesTable).set(data).where(eq(collegeFeesTable.id, id)).returning();
    if (!fee) {
      res.status(404).json({ error: "Fee not found" });
      return;
    }
    res.json({ ...fee, createdAt: fee.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete college fee (admin)
router.delete("/college-fees/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(collegeFeesTable).where(eq(collegeFeesTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== EXAMS CRUD ====================

// Get all exams (admin)
router.get("/exams", async (req, res) => {
  const exams = await db.select().from(examsTable).orderBy(desc(examsTable.id));
  res.json(exams.map(e => ({ ...e, createdAt: e.createdAt.toISOString() })));
});

// Create exam (admin)
router.post("/exams", async (req, res) => {
  try {
    const data = CreateExamSchema.parse(req.body);
    const [exam] = await db.insert(examsTable).values(data).returning();
    res.status(201).json({ ...exam, createdAt: exam.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update exam (admin)
router.put("/exams/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateExamSchema.parse(req.body);
    const [exam] = await db.update(examsTable).set(data).where(eq(examsTable.id, id)).returning();
    if (!exam) {
      res.status(404).json({ error: "Exam not found" });
      return;
    }
    res.json({ ...exam, createdAt: exam.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete exam (admin)
router.delete("/exams/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(examsTable).where(eq(examsTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STUDY MATERIALS CRUD ====================

// Get all study materials (admin)
router.get("/study-materials", async (req, res) => {
  const materials = await db.select().from(studyMaterialsTable).orderBy(desc(studyMaterialsTable.id));
  res.json(materials.map(m => ({ ...m, createdAt: m.createdAt.toISOString() })));
});

// Create study material (admin)
router.post("/study-materials", async (req, res) => {
  try {
    const data = CreateStudyMaterialSchema.parse(req.body);
    const [material] = await db.insert(studyMaterialsTable).values(data).returning();
    res.status(201).json({ ...material, createdAt: material.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update study material (admin)
router.put("/study-materials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateStudyMaterialSchema.parse(req.body);
    const [material] = await db.update(studyMaterialsTable).set(data).where(eq(studyMaterialsTable.id, id)).returning();
    if (!material) {
      res.status(404).json({ error: "Study material not found" });
      return;
    }
    res.json({ ...material, createdAt: material.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Delete study material (admin)
router.delete("/study-materials/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(studyMaterialsTable).where(eq(studyMaterialsTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats (admin)
router.get("/stats", async (req, res) => {
  const [apps] = await db.select().from(applicationsTable);
  const allApps = await db.select().from(applicationsTable);
  const allJobs = await db.select().from(jobsTable);
  const allUsers = await db.select().from(usersTable);
  const allHrEmails = await db.select().from(hrEmailsTable);
  res.json({
    totalApplications: allApps.length,
    totalJobs: allJobs.length,
    totalUsers: allUsers.length,
    totalHrEmails: allHrEmails.length,
    pendingApplications: allApps.filter(a => a.status === "Pending").length,
    offeredApplications: allApps.filter(a => a.status === "Offered").length,
    rejectedApplications: allApps.filter(a => a.status === "Rejected").length,
  });
});

export default router;
