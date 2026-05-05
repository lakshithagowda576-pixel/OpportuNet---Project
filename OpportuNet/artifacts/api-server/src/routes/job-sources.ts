import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { ingestJobsFromSource, ingestAllActiveSources } from "../lib/job-ingestion-service";
import {
  jobSourcesTable,
  jobIngestionsTable,
  createJobSourceSchema,
  updateJobSourceSchema,
} from "@workspace/db";
import { db } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /job-sources
 * Create a new job source (admin only)
 */
router.post("/job-sources", requireAuth, async (req: Request, res: Response) => {
  try {
    // Check if user is admin
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const validationResult = createJobSourceSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const result = await db.insert(jobSourcesTable).values(validationResult.data).returning();

    return res.status(201).json({
      id: result[0].id,
      message: "Job source created successfully",
    });
  } catch (error) {
    console.error("Create job source error:", error);
    return res.status(500).json({ error: "Failed to create job source" });
  }
});

/**
 * GET /job-sources
 * List all job sources (admin only)
 */
router.get("/job-sources", requireAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const sources = await db.select().from(jobSourcesTable);

    return res.json({
      total: sources.length,
      sources: sources.map((s) => ({
        id: s.id,
        name: s.name,
        isActive: s.isActive,
        lastSyncAt: s.lastSyncAt,
        lastSyncStatus: s.lastSyncStatus,
      })),
    });
  } catch (error) {
    console.error("Get job sources error:", error);
    return res.status(500).json({ error: "Failed to fetch job sources" });
  }
});

/**
 * PUT /job-sources/:id
 * Update a job source (admin only)
 */
router.put("/job-sources/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const sourceId = parseInt(req.params.id);
    const validationResult = updateJobSourceSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    const result = await db
      .update(jobSourcesTable)
      .set(validationResult.data)
      .where(eq(jobSourcesTable.id, sourceId))
      .returning();

    if (!result[0]) {
      return res.status(404).json({ error: "Job source not found" });
    }

    return res.json({ message: "Job source updated successfully" });
  } catch (error) {
    console.error("Update job source error:", error);
    return res.status(500).json({ error: "Failed to update job source" });
  }
});

/**
 * POST /job-sources/:id/ingest
 * Manually trigger ingestion for a specific source (admin only)
 */
router.post("/job-sources/:id/ingest", requireAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const sourceId = parseInt(req.params.id);
    const { query } = req.body;

    const result = await ingestJobsFromSource(sourceId, query || "software engineer");

    return res.json({
      message: "Ingestion completed",
      ...result,
    });
  } catch (error) {
    console.error("Ingestion error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Ingestion failed",
    });
  }
});

/**
 * POST /job-sources/ingest-all
 * Trigger ingestion for all active sources (admin only)
 */
router.post("/job-sources/ingest-all", requireAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { query } = req.body;
    const results = await ingestAllActiveSources(query || "software engineer");

    return res.json({
      message: "Bulk ingestion completed",
      results,
    });
  } catch (error) {
    console.error("Bulk ingestion error:", error);
    return res.status(500).json({ error: "Bulk ingestion failed" });
  }
});

/**
 * GET /job-ingestions
 * View ingestion history (admin only)
 */
router.get("/job-ingestions", requireAuth, async (req: Request, res: Response) => {
  try {
    const isAdmin = (req as any).user?.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { limit = 50, offset = 0 } = req.query;

    const ingestions = await db
      .select()
      .from(jobIngestionsTable)
      .orderBy((t) => t.createdAt)
      .limit(parseInt(limit as string))
      .offset(parseInt(offset as string));

    return res.json({
      total: ingestions.length,
      ingestions,
    });
  } catch (error) {
    console.error("Get ingestions error:", error);
    return res.status(500).json({ error: "Failed to fetch ingestions" });
  }
});

export default router;
