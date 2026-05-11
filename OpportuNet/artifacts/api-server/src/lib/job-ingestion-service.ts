// @ts-nocheck
import fetch from "node-fetch";
import {
  jobSourcesTable,
  jobIngestionsTable,
  jobSourceMappingTable,
  jobsTable,
} from "@workspace/db/schema";
import { db } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import * as crypto from "crypto";

interface NormalizedJob {
  title: string;
  description: string;
  company: string;
  location: string;
  jobType: string; // full-time, part-time, contract, remote
  salary?: string;
  currency?: string;
  salaryMin?: number;
  salaryMax?: number;
  postedDate: Date;
  externalUrl: string;
  requirements?: string[];
  skills?: string[];
  benefits?: string[];
}

/**
 * LinkedIn Jobs Connector
 * Fetches jobs from LinkedIn via unofficial API or RapidAPI
 */
export async function fetchLinkedInJobs(apiKey: string, query: string): Promise<NormalizedJob[]> {
  try {
    const response = await fetch(
      `https://linkedin-api-io.p.rapidapi.com/search?query=${encodeURIComponent(query)}&type=jobs`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "linkedin-api-io.p.rapidapi.com",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.status}`);
    }

    const data: any = await response.json();
    const jobs: NormalizedJob[] = [];

    (data.data || []).forEach((job: any) => {
      jobs.push({
        title: job.title || "Untitled",
        description: job.description || "",
        company: job.company || "Unknown",
        location: job.location || "",
        jobType: "full-time",
        salary: job.salary,
        postedDate: new Date(job.postedDate || Date.now()),
        externalUrl: job.url || "",
        skills: job.skills || [],
      });
    });

    return jobs;
  } catch (error) {
    console.error("LinkedIn fetch error:", error);
    throw error;
  }
}

/**
 * GitHub Jobs Connector
 * Fetches jobs from GitHub's public jobs API
 */
export async function fetchGitHubJobs(): Promise<NormalizedJob[]> {
  try {
    const response = await fetch("https://jobs.github.com/positions.json");

    if (!response.ok) {
      throw new Error(`GitHub Jobs API error: ${response.status}`);
    }

    const data: any = await response.json();
    const jobs: NormalizedJob[] = [];

    (data || []).forEach((job: any) => {
      jobs.push({
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        jobType: job.type || "full-time",
        postedDate: new Date(job.created_at),
        externalUrl: job.url,
      });
    });

    return jobs;
  } catch (error) {
    console.error("GitHub Jobs fetch error:", error);
    throw error;
  }
}

/**
 * JSearch API Connector
 * Fetches jobs from RapidAPI's JSearch endpoint
 */
export async function fetchJSearchJobs(apiKey: string, query: string): Promise<NormalizedJob[]> {
  try {
    const response = await fetch(`https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&num_pages=1`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error(`JSearch API error: ${response.status}`);
    }

    const data: any = await response.json();
    const jobs: NormalizedJob[] = [];

    (data.data || []).forEach((job: any) => {
      jobs.push({
        title: job.job_title,
        description: job.job_description,
        company: job.employer_name,
        location: job.job_city ? `${job.job_city}, ${job.job_country}` : job.job_country,
        jobType: job.job_employment_type || "full-time",
        salary: job.job_salary_range?.formatted_salary_range,
        salaryMin: job.job_min_salary,
        salaryMax: job.job_max_salary,
        currency: job.job_salary_currency,
        postedDate: new Date(job.job_posted_at_datetime_utc),
        externalUrl: job.job_apply_link,
        requirements: job.job_required_skills || [],
      });
    });

    return jobs;
  } catch (error) {
    console.error("JSearch fetch error:", error);
    throw error;
  }
}

/**
 * Generate external job ID hash for deduplication
 */
function generateJobHash(title: string, company: string, location: string): string {
  const data = `${title.toLowerCase()}|${company.toLowerCase()}|${location.toLowerCase()}`;
  return crypto.createHash("md5").update(data).digest("hex");
}

/**
 * Normalize and deduplicate jobs
 */
export async function deduplicateJobs(jobs: NormalizedJob[], sourceId: number): Promise<NormalizedJob[]> {
  const existing = await db
    .select()
    .from(jobSourceMappingTable)
    .where(eq(jobSourceMappingTable.sourceId, sourceId));

  const existingIds = new Set(existing.map((m) => m.externalJobId));
  const deduplicated = jobs.filter((job) => {
    const hash = generateJobHash(job.title, job.company, job.location);
    return !existingIds.has(hash);
  });

  return deduplicated;
}

/**
 * Ingest jobs from a single source
 */
export async function ingestJobsFromSource(sourceId: number, query: string = "software engineer") {
  const ingestionStart = new Date();

  try {
    // Get source configuration
    const source = await db.select().from(jobSourcesTable).where(eq(jobSourcesTable.id, sourceId));

    if (!source[0]) {
      throw new Error(`Job source ${sourceId} not found`);
    }

    const jobSource = source[0];
    let jobs: NormalizedJob[] = [];

    // Fetch jobs based on source type
    switch (jobSource.name) {
      case "linkedin":
        if (!jobSource.apiKey) throw new Error("LinkedIn API key not configured");
        jobs = await fetchLinkedInJobs(jobSource.apiKey, query);
        break;
      case "github-jobs":
        jobs = await fetchGitHubJobs();
        break;
      case "jsearch":
        if (!jobSource.apiKey) throw new Error("JSearch API key not configured");
        jobs = await fetchJSearchJobs(jobSource.apiKey, query);
        break;
      default:
        throw new Error(`Unknown job source: ${jobSource.name}`);
    }

    // Deduplicate
    const deduped = await deduplicateJobs(jobs, sourceId);

    // Insert new jobs
    let newCount = 0;
    let duplicateCount = jobs.length - deduped.length;

    for (const job of deduped) {
      try {
        const externalId = generateJobHash(job.title, job.company, job.location);

        // Insert or update job in main jobs table
        const insertResult = await db
          .insert(jobsTable)
          .values({
            title: job.title,
            description: job.description,
            companyId: 0, // TODO: Link to companies table or create dynamic entries
            location: job.location,
            jobType: job.jobType,
            salary: job.salary,
            requirements: job.requirements as any,
            skills: job.skills as any,
            postedDate: job.postedDate,
            closingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            status: "open",
            isActive: true,
          })
          .returning();

        const internalJobId = insertResult[0]?.id;

        // Map external to internal job ID
        if (internalJobId) {
          await db.insert(jobSourceMappingTable).values({
            sourceId,
            externalJobId: externalId,
            internalJobId,
            externalUrl: job.externalUrl,
          });
          newCount++;
        }
      } catch (error) {
        console.error(`Error inserting job from ${jobSource.name}:`, error);
      }
    }

    // Create ingestion record
    await db.insert(jobIngestionsTable).values({
      sourceId,
      jobCount: jobs.length,
      newJobs: newCount,
      updatedJobs: 0,
      duplicates: duplicateCount,
      status: "completed",
      completedAt: new Date(),
    });

    // Update source last sync time
    await db
      .update(jobSourcesTable)
      .set({
        lastSyncAt: new Date(),
        lastSyncStatus: "success",
      })
      .where(eq(jobSourcesTable.id, sourceId));

    return {
      success: true,
      jobCount: jobs.length,
      newJobs: newCount,
      duplicates: duplicateCount,
    };
  } catch (error) {
    console.error("Ingestion error:", error);

    // Create failure record
    await db.insert(jobIngestionsTable).values({
      sourceId,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Unknown error",
      completedAt: new Date(),
    });

    // Update source sync status
    await db
      .update(jobSourcesTable)
      .set({
        lastSyncAt: new Date(),
        lastSyncStatus: "failed",
      })
      .where(eq(jobSourcesTable.id, sourceId));

    throw error;
  }
}

/**
 * Run all active job sources
 */
export async function ingestAllActiveSources(query: string = "software engineer") {
  const sources = await db
    .select()
    .from(jobSourcesTable)
    .where(eq(jobSourcesTable.isActive, true));

  const results = [];

  for (const source of sources) {
    try {
      const result = await ingestJobsFromSource(source.id, query);
      results.push({ source: source.name, ...result });
    } catch (error) {
      results.push({ source: source.name, error: error instanceof Error ? error.message : "Unknown error" });
    }
  }

  return results;
}
