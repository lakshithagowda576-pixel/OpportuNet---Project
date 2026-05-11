// @ts-nocheck
import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { createAnalyticsEventSchema, analyticsEventsTable } from "@workspace/db";
import { db } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

/**
 * POST /analytics/events
 * Track a client event
 */
router.post("/analytics/events", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.session?.userId;
    const validationResult = createAnalyticsEventSchema.safeParse({
      userId,
      ...req.body,
    });

    if (!validationResult.success) {
      return res.status(400).json({ error: validationResult.error.errors });
    }

    await db.insert(analyticsEventsTable).values(validationResult.data);

    return res.status(201).json({ message: "Event recorded" });
  } catch (error) {
    console.error("Analytics event error:", error);
    return res.status(500).json({ error: "Failed to record analytics event" });
  }
});

/**
 * GET /analytics/events
 * Fetch analytics events (admin only)
 */
router.get("/analytics/events", requireAuth, async (req: Request, res: Response) => {
  try {
    if ((req as any).user?.role !== "admin") {
      return res.status(403).json({ error: "Admin access required" });
    }

    const { limit = 100, offset = 0, eventType, userId } = req.query;
    const query = db.select().from(analyticsEventsTable);

    if (eventType) {
      query.where(eq(analyticsEventsTable.eventType, String(eventType)));
    }

    if (userId) {
      query.where(eq(analyticsEventsTable.userId, parseInt(String(userId))));
    }

    const events = await query.orderBy((t) => t.createdAt).limit(parseInt(String(limit))).offset(parseInt(String(offset)));

    return res.json({
      total: events.length,
      events,
    });
  } catch (error) {
    console.error("Fetch analytics events error:", error);
    return res.status(500).json({ error: "Failed to fetch analytics events" });
  }
});

export default router;
