import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { jobAlertsTable, alertEmailsSentTable, jobsTable, usersTable, jobCategoryEnum } from "@workspace/db/schema";
import { eq, and, desc, or, gte, lte, ilike, inArray } from "drizzle-orm";
import { insertJobAlertSchema } from "@workspace/db/schema";

const router: IRouter = Router();

// Middleware to ensure authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) {
    return res.status(401).json({ error: "Unauthorized. Please log in." });
  }
  next();
};

async function getSessionUser(req: any) {
  if (!req.session?.userId) return null;
  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.session.userId));
  return user;
}

// GET /job-alerts - Get all alerts for current user
router.get("/job-alerts", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const alerts = await db
      .select()
      .from(jobAlertsTable)
      .where(eq(jobAlertsTable.userId, user.id))
      .orderBy(desc(jobAlertsTable.createdAt));

    res.json(alerts);
  } catch (error) {
    console.error("Error fetching job alerts:", error);
    res.status(500).json({ error: "Failed to fetch job alerts" });
  }
});

// GET /job-alerts/:id - Get a specific alert
router.get("/job-alerts/:id", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const alertId = parseInt(req.params.id);
    const [alert] = await db
      .select()
      .from(jobAlertsTable)
      .where(
        and(
          eq(jobAlertsTable.id, alertId),
          eq(jobAlertsTable.userId, user.id)
        )
      );

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    res.json(alert);
  } catch (error) {
    console.error("Error fetching job alert:", error);
    res.status(500).json({ error: "Failed to fetch job alert" });
  }
});

// POST /job-alerts - Create a new alert
router.post("/job-alerts", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, filters, frequency } = req.body;

    if (!filters) {
      return res.status(400).json({ error: "Filters are required" });
    }

    if (!["daily", "weekly"].includes(frequency)) {
      return res.status(400).json({ error: "Frequency must be 'daily' or 'weekly'" });
    }

    const [alert] = await db
      .insert(jobAlertsTable)
      .values({
        userId: user.id,
        name: name || `Alert ${new Date().toLocaleDateString()}`,
        filters,
        frequency,
        isActive: true,
      })
      .returning();

    res.status(201).json(alert);
  } catch (error) {
    console.error("Error creating job alert:", error);
    res.status(500).json({ error: "Failed to create job alert" });
  }
});

// PUT /job-alerts/:id - Update an alert
router.put("/job-alerts/:id", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const alertId = parseInt(req.params.id);
    const { name, filters, frequency, isActive } = req.body;

    // Verify ownership
    const [existing] = await db
      .select()
      .from(jobAlertsTable)
      .where(
        and(
          eq(jobAlertsTable.id, alertId),
          eq(jobAlertsTable.userId, user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: "Alert not found" });
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (filters !== undefined) updateData.filters = filters;
    if (frequency !== undefined) updateData.frequency = frequency;
    if (isActive !== undefined) updateData.isActive = isActive;
    updateData.updatedAt = new Date();

    const [updated] = await db
      .update(jobAlertsTable)
      .set(updateData)
      .where(eq(jobAlertsTable.id, alertId))
      .returning();

    res.json(updated);
  } catch (error) {
    console.error("Error updating job alert:", error);
    res.status(500).json({ error: "Failed to update job alert" });
  }
});

// DELETE /job-alerts/:id - Delete an alert
router.delete("/job-alerts/:id", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const alertId = parseInt(req.params.id);

    // Verify ownership
    const [existing] = await db
      .select()
      .from(jobAlertsTable)
      .where(
        and(
          eq(jobAlertsTable.id, alertId),
          eq(jobAlertsTable.userId, user.id)
        )
      );

    if (!existing) {
      return res.status(404).json({ error: "Alert not found" });
    }

    await db.delete(jobAlertsTable).where(eq(jobAlertsTable.id, alertId));

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting job alert:", error);
    res.status(500).json({ error: "Failed to delete job alert" });
  }
});

// GET /job-alerts/:id/preview - Get job matches for an alert
router.get("/job-alerts/:id/preview", requireAuth, async (req, res) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const alertId = parseInt(req.params.id);
    const limit = parseInt(req.query.limit as string) || 10;

    const [alert] = await db
      .select()
      .from(jobAlertsTable)
      .where(
        and(
          eq(jobAlertsTable.id, alertId),
          eq(jobAlertsTable.userId, user.id)
        )
      );

    if (!alert) {
      return res.status(404).json({ error: "Alert not found" });
    }

    // Build query based on filters
    let query = db.select().from(jobsTable);
    const conditions: any[] = [];

    if (alert.filters?.categories && alert.filters.categories.length > 0) {
      conditions.push(inArray(jobsTable.category, alert.filters.categories));
    }

    if (alert.filters?.locations && alert.filters.locations.length > 0) {
      const locationConditions = alert.filters.locations.map((loc: string) =>
        ilike(jobsTable.location, `%${loc}%`)
      );
      conditions.push(or(...locationConditions));
    }

    if (alert.filters?.keywords && alert.filters.keywords.length > 0) {
      const keywordConditions = alert.filters.keywords.map((keyword: string) =>
        or(
          ilike(jobsTable.title, `%${keyword}%`),
          ilike(jobsTable.description, `%${keyword}%`)
        )
      );
      conditions.push(or(...keywordConditions));
    }

    // Apply conditions if any exist
    const matchingJobs = conditions.length > 0
      ? await db
          .select()
          .from(jobsTable)
          .where(and(...conditions))
          .limit(limit)
      : await db.select().from(jobsTable).limit(limit);

    res.json({
      alert,
      matchingJobs,
      totalMatches: matchingJobs.length,
    });
  } catch (error) {
    console.error("Error fetching job alert preview:", error);
    res.status(500).json({ error: "Failed to fetch job alert preview" });
  }
});

export default router;
