import * as pdfjsLib from "pdfjs-dist";
import { resumesTable, Resume } from "../schema/resumes";
import { db } from "./index";
import { eq } from "drizzle-orm";

// Set up PDF.js worker
if (typeof window === "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

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
 * Extract text from PDF buffer
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise;
  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    text += pageText + "\n";
  }

  return text;
}

/**
 * Parse contact information from resume text
 */
function parseContactInfo(text: string): Partial<ParsedResumeData> {
  const result: Partial<ParsedResumeData> = {};

  // Email pattern
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.email = emailMatch[0];

  // Phone pattern (supports various formats)
  const phoneMatch = text.match(/(\+?1[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/);
  if (phoneMatch) result.phone = phoneMatch[0];

  // Location pattern (look for "City, State" pattern or "Location:" prefix)
  const locationMatch = text.match(/(?:Location|Address|Based in|From)[\s:]*([A-Za-z\s,]+?)(?:\n|,|$)/i);
  if (locationMatch) result.location = locationMatch[1].trim();

  // Name: typically first non-empty line or before contact info
  const lines = text.split("\n").filter((l) => l.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    if (firstLine.length < 100 && !firstLine.match(/\d+@|\(\d{3}\)/)) {
      result.fullName = firstLine;
    }
  }

  return result;
}

/**
 * Parse skills section from resume text
 */
function parseSkills(text: string): Array<{ name: string; proficiency?: string }> {
  const skills: Array<{ name: string; proficiency?: string }> = [];

  // Common skill section headers
  const skillsMatch = text.match(
    /(?:Skills|Core Competencies|Technical Skills|Expertise)([\s\S]*?)(?=\n(?:Experience|Education|Projects|Certifications|Languages|$))/i
  );

  if (skillsMatch) {
    const skillsText = skillsMatch[1];
    // Split by common delimiters
    const skillList = skillsText
      .split(/[,;•\n-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2 && s.length < 50);

    skillList.forEach((skill) => {
      // Check for proficiency levels (Expert, Intermediate, Beginner)
      const profMatch = skill.match(/(Expert|Advanced|Intermediate|Beginner)/i);
      const proficiency = profMatch ? profMatch[1] : undefined;
      const name = skill.replace(/(Expert|Advanced|Intermediate|Beginner)/i, "").trim();
      if (name) {
        skills.push({ name, proficiency });
      }
    });
  }

  return skills;
}

/**
 * Parse work experience from resume text
 */
function parseExperience(
  text: string
): Array<{ title: string; company: string; duration?: string; description?: string }> {
  const experience: Array<{ title: string; company: string; duration?: string; description?: string }> = [];

  // Match experience section
  const expMatch = text.match(
    /(?:Experience|Work Experience|Professional Experience|Employment)([\s\S]*?)(?=\n(?:Education|Skills|Projects|Certifications|$))/i
  );

  if (expMatch) {
    const expText = expMatch[1];
    // Split by job entries (usually marked by company names or dates)
    const entries = expText.split(/\n(?=[A-Z][a-zA-Z\s]+(?:\n|$))/);

    entries.forEach((entry) => {
      if (entry.length < 10) return;
      const lines = entry.split("\n").filter((l) => l.trim());

      // Try to extract job title and company
      if (lines.length >= 1) {
        const titleMatch = lines[0].match(/([A-Za-z\s]+(?:Engineer|Manager|Developer|Designer|Analyst|Coordinator|Assistant|Specialist))/i);
        if (titleMatch) {
          const companyMatch = lines.find((l) => /[A-Z][a-z]+(?:\s[A-Z][a-z]+)*/.test(l));
          const durationMatch = entry.match(/([A-Za-z]+\s\d{4}\s*[-–]\s*(?:[A-Za-z]+\s)?\d{4}|Present)/);

          experience.push({
            title: titleMatch[1].trim(),
            company: companyMatch?.trim() || "Unknown",
            duration: durationMatch ? durationMatch[0] : undefined,
            description: lines.slice(1).join(" ").substring(0, 200),
          });
        }
      }
    });
  }

  return experience;
}

/**
 * Parse education from resume text
 */
function parseEducation(text: string): Array<{ degree: string; field: string; school: string; year?: string }> {
  const education: Array<{ degree: string; field: string; school: string; year?: string }> = [];

  const eduMatch = text.match(/(?:Education|Academic Background)([\s\S]*?)(?=\n(?:Experience|Skills|Certifications|$))/i);

  if (eduMatch) {
    const eduText = eduMatch[1];
    const entries = eduText.split(/\n(?=[A-Z])/);

    entries.forEach((entry) => {
      if (entry.length < 10) return;
      const degreeMatch = entry.match(/(Bachelor|Master|PhD|B\.S\.|M\.S\.|B\.A\.|M\.A\.|B\.Tech|M\.Tech|Associate|Diploma)/i);
      const fieldMatch = entry.match(/(?:in|of)\s([A-Za-z\s]+?)(?:\n|,|$)/i);
      const schoolMatch = entry.match(/(?:from|at|–|-)\s([A-Z][A-Za-z\s&]+(?:University|College|Institute|School))/i);
      const yearMatch = entry.match(/(\d{4})/);

      if (degreeMatch && schoolMatch) {
        education.push({
          degree: degreeMatch[1],
          field: fieldMatch ? fieldMatch[1].trim() : "General",
          school: schoolMatch[1].trim(),
          year: yearMatch ? yearMatch[0] : undefined,
        });
      }
    });
  }

  return education;
}

/**
 * Parse certifications from resume text
 */
function parseCertifications(text: string): Array<{ name: string; issuer?: string; date?: string; url?: string }> {
  const certs: Array<{ name: string; issuer?: string; date?: string; url?: string }> = [];

  const certMatch = text.match(/(?:Certifications|Licenses|Credentials)([\s\S]*?)(?=\n(?:$|Languages|Skills))/i);

  if (certMatch) {
    const certText = certMatch[1];
    const entries = certText.split(/\n|;/).filter((l) => l.trim());

    entries.forEach((entry) => {
      if (entry.length < 5) return;
      const issuerMatch = entry.match(/–\s*(.+?)(?:\(|$)/);
      const dateMatch = entry.match(/(\d{1,2}\/\d{1,2}\/\d{4}|\d{4})/);

      certs.push({
        name: entry.split("–")[0].trim(),
        issuer: issuerMatch ? issuerMatch[1].trim() : undefined,
        date: dateMatch ? dateMatch[0] : undefined,
      });
    });
  }

  return certs;
}

/**
 * Parse languages from resume text
 */
function parseLanguages(text: string): Array<{ name: string; proficiency?: string }> {
  const languages: Array<{ name: string; proficiency?: string }> = [];

  const langMatch = text.match(/(?:Languages?|Linguistic Abilities)([\s\S]*?)(?=\n(?:$|Skills|Experience))/i);

  if (langMatch) {
    const langText = langMatch[1];
    const entries = langText.split(/[,;\n]/).filter((l) => l.trim());

    entries.forEach((entry) => {
      const parts = entry.split(/[-–]/).map((p) => p.trim());
      if (parts.length > 0) {
        const profMatch = parts[1]?.match(/(Native|Fluent|Professional|Intermediate|Beginner)/i);
        languages.push({
          name: parts[0],
          proficiency: profMatch ? profMatch[0] : undefined,
        });
      }
    });
  }

  return languages;
}

/**
 * Main resume parsing function
 */
export async function parseResume(buffer: Buffer): Promise<ParsedResumeData> {
  try {
    // Extract text from PDF
    const text = await extractTextFromPDF(buffer);

    // Parse different sections
    const contactInfo = parseContactInfo(text);
    const skills = parseSkills(text);
    const experience = parseExperience(text);
    const education = parseEducation(text);
    const certifications = parseCertifications(text);
    const languages = parseLanguages(text);

    return {
      ...contactInfo,
      skills,
      experience,
      education,
      certifications,
      languages,
    };
  } catch (error) {
    console.error("Resume parsing error:", error);
    throw new Error(`Failed to parse resume: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
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
