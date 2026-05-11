// @ts-nocheck
// import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { resumesTable, type Resume } from "@workspace/db/schema";
import { db } from "@workspace/db";
import { eq } from "drizzle-orm";

interface ParsedResumeData {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: Array<{ name: string; proficiency?: string }>;
  experience: Array<{ title: string; company: string; duration?: string; description?: string }>;
  education: Array<{ degree: string; field: string; school: string; year?: string }>;
  certifications: Array<{ name: string; issuer?: string; date?: string; url?: string }>;
  languages: Array<{ name: string; proficiency?: string }>;
}

/**
 * Main resume parsing function (Mocked for Node.js compatibility)
 */
export async function parseResume(buffer: Buffer): Promise<ParsedResumeData> {
  console.log("Resume parsing is currently mocked in Node.js environment");
  return {
    fullName: "Mock User",
    email: "mock@example.com",
    skills: [{ name: "JavaScript" }, { name: "TypeScript" }],
    experience: [],
    education: [],
    certifications: [],
    languages: [],
  };
}

/**
 * Save parsed resume to database
 */
export async function saveResumeToDatabase(
  userId: number,
  fileName: string,
  fileUrl: string,
  fileSize: number,
  parsedData: ParsedResumeData
): Promise<Resume> {
  const result = await db
    .insert(resumesTable)
    .values({
      userId,
      fileName,
      fileUrl,
      fileSize,
      mimeType: "application/pdf",
      fullName: parsedData.fullName,
      email: parsedData.email,
      phone: parsedData.phone,
      location: parsedData.location,
      summary: parsedData.summary,
      skills: parsedData.skills as any,
      experience: parsedData.experience as any,
      education: parsedData.education as any,
      certifications: parsedData.certifications as any,
      languages: parsedData.languages as any,
      parsedAt: new Date(),
      parsingStatus: "completed",
    })
    .returning();

  return result[0];
}

/**
 * Update existing resume with parsed data
 */
export async function updateResumeInDatabase(
  resumeId: number,
  parsedData: ParsedResumeData
): Promise<Resume> {
  const result = await db
    .update(resumesTable)
    .set({
      fullName: parsedData.fullName,
      email: parsedData.email,
      phone: parsedData.phone,
      location: parsedData.location,
      summary: parsedData.summary,
      skills: parsedData.skills as any,
      experience: parsedData.experience as any,
      education: parsedData.education as any,
      certifications: parsedData.certifications as any,
      languages: parsedData.languages as any,
      parsedAt: new Date(),
      parsingStatus: "completed",
      updatedAt: new Date(),
    })
    .where(eq(resumesTable.id, resumeId))
    .returning();

  return result[0];
}

/**
 * Get user's resumes
 */
export async function getUserResumes(userId: number): Promise<Resume[]> {
  return await db.select().from(resumesTable).where(eq(resumesTable.userId, userId));
}

/**
 * Get single resume by ID
 */
export async function getResumeById(resumeId: number): Promise<Resume | null> {
  const result = await db.select().from(resumesTable).where(eq(resumesTable.id, resumeId));
  return result[0] || null;
}

/**
 * Delete resume
 */
export async function deleteResume(resumeId: number): Promise<void> {
  await db.delete(resumesTable).where(eq(resumesTable.id, resumeId));
}
