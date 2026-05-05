import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { resumesTable, updateResumeSchema } from "@workspace/db";
import {
  parseResume,
  saveResumeToDatabase,
  updateResumeInDatabase,
  getUserResumes,
  getResumeById,
  deleteResume,
} from "../lib/resume-parser";
import { db } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads", "resumes");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${req.session?.userId}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Only accept PDF files
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are accepted"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

/**
 * POST /resumes
 * Upload and parse a resume
 */
router.post("/resumes", requireAuth, upload.single("file"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const userId = req.session?.userId;
    const fileBuffer = fs.readFileSync(req.file.path);

    // Parse the resume
    const parsedData = await parseResume(fileBuffer);

    // Save to database
    const resume = await saveResumeToDatabase(userId, req.file.originalname, req.file.path, req.file.size, parsedData);

    return res.status(201).json({
      id: resume.id,
      fileName: resume.fileName,
      parsedData,
      message: "Resume uploaded and parsed successfully",
    });
  } catch (error) {
    console.error("Resume upload error:", error);
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({
      error: error instanceof Error ? error.message : "Failed to parse resume",
    });
  }
});

/**
 * GET /resumes
 * Get all resumes for the authenticated user
 */
router.get("/resumes", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const resumes = await getUserResumes(userId);

    return res.json({
      total: resumes.length,
      resumes: resumes.map((r) => ({
        id: r.id,
        fileName: r.fileName,
        fullName: r.fullName,
        email: r.email,
        parsedAt: r.parsedAt,
        isPublic: r.isPublic,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    return res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

/**
 * GET /resumes/:id
 * Get a single resume with full details
 */
router.get("/resumes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const resumeId = parseInt(req.params.id);

    const resume = await getResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    // Check ownership
    if (resume.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    return res.json({
      id: resume.id,
      fileName: resume.fileName,
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      location: resume.location,
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience,
      education: resume.education,
      certifications: resume.certifications,
      languages: resume.languages,
      isPublic: resume.isPublic,
      parsedAt: resume.parsedAt,
      createdAt: resume.createdAt,
    });
  } catch (error) {
    console.error("Get resume error:", error);
    return res.status(500).json({ error: "Failed to fetch resume" });
  }
});

/**
 * PUT /resumes/:id
 * Update resume details
 */
router.put("/resumes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const resumeId = parseInt(req.params.id);

    const resume = await getResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Validate update data
    const validationResult = updateResumeSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    // Update resume
    const updatedResume = await db
      .update(resumesTable)
      .set({
        ...validationResult.data,
        updatedAt: new Date(),
      })
      .where(eq(resumesTable.id, resumeId))
      .returning();

    return res.json({
      id: updatedResume[0].id,
      message: "Resume updated successfully",
      resume: updatedResume[0],
    });
  } catch (error) {
    console.error("Update resume error:", error);
    return res.status(500).json({ error: "Failed to update resume" });
  }
});

/**
 * DELETE /resumes/:id
 * Delete a resume
 */
router.delete("/resumes/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const resumeId = parseInt(req.params.id);

    const resume = await getResumeById(resumeId);

    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }

    if (resume.userId !== userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete file from disk
    if (fs.existsSync(resume.fileUrl)) {
      fs.unlinkSync(resume.fileUrl);
    }

    // Delete from database
    await deleteResume(resumeId);

    return res.json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Delete resume error:", error);
    return res.status(500).json({ error: "Failed to delete resume" });
  }
});

export default router;
