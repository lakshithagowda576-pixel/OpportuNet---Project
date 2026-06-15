import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { jobAlertsTable, alertEmailsSentTable, usersTable } from "@workspace/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { sendEmail } from "../lib/mailer";
import { requireAuth } from "../middleware/requireAuth";

const router: IRouter = Router();

async function getSessionUser(req: any) {
  if (!req.session?.userId) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, req.session.userId));
  return user;
}

router.use("/job-alerts", requireAuth);

router.get("/job-alerts", async (req: any, res: Response) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
      return;
    }

    const alerts = await db
      .select()
      .from(jobAlertsTable)
      .where(eq(jobAlertsTable.userId, user.id))
      .orderBy(desc(jobAlertsTable.createdAt));

    res.json(alerts);
  } catch (error: any) {
    console.error("Failed to fetch job alerts:", error);
    res.status(500).json({ error: error.message || "Failed to fetch job alerts" });
  }
});

router.post("/job-alerts", async (req: any, res: Response) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
      return;
    }

    const { name, filters, frequency } = req.body;
    if (!name || typeof name !== "string") {
      res.status(400).json({ error: "Alert name is required." });
      return;
    }

    const cleanedFilters = {
      categories: Array.isArray(filters?.categories) ? filters.categories.filter((item: any) => typeof item === "string") : undefined,
      locations: Array.isArray(filters?.locations) ? filters.locations.filter((item: any) => typeof item === "string") : undefined,
      keywords: Array.isArray(filters?.keywords) ? filters.keywords.filter((item: any) => typeof item === "string") : undefined,
      minSalary: typeof filters?.minSalary === "number" ? filters.minSalary : undefined,
      maxSalary: typeof filters?.maxSalary === "number" ? filters.maxSalary : undefined,
      shifts: Array.isArray(filters?.shifts) ? filters.shifts.filter((item: any) => typeof item === "string") : undefined,
    };

    const [alert] = await db.insert(jobAlertsTable).values({
      userId: user.id,
      name,
      filters: cleanedFilters,
      frequency: frequency === "weekly" ? "weekly" : "daily",
      isActive: true,
    }).returning();

    let emailStatus = "sent";
    let emailError = undefined;

    try {
      const filterSummary = [] as string[];
      if (cleanedFilters.categories?.length) {
        filterSummary.push(`Categories: ${cleanedFilters.categories.join(", ")}`);
      }
      if (cleanedFilters.locations?.length) {
        filterSummary.push(`Locations: ${cleanedFilters.locations.join(", ")}`);
      }
      if (cleanedFilters.keywords?.length) {
        filterSummary.push(`Keywords: ${cleanedFilters.keywords.join(", ")}`);
      }
      if (typeof cleanedFilters.minSalary === "number") {
        filterSummary.push(`Min Salary: ₹${cleanedFilters.minSalary}`);
      }
      if (typeof cleanedFilters.maxSalary === "number") {
        filterSummary.push(`Max Salary: ₹${cleanedFilters.maxSalary}`);
      }
      if (cleanedFilters.shifts?.length) {
        filterSummary.push(`Shifts: ${cleanedFilters.shifts.join(", ")}`);
      }

      const emailBody = `Your job alert "${alert.name}" has been created successfully.\n\n` +
        `Frequency: ${alert.frequency}\n` +
        `${filterSummary.length ? `Filters:\n- ${filterSummary.join("\n- ")}\n` : "No filters specified. You will receive broad job alerts."}` +
        `\nYou will receive matching job notifications at this email address.`;

      await sendEmail({
        to: user.email,
        subject: `Your OpportuNet job alert "${alert.name}" is active`,
        body: emailBody,
        applicantName: user.name,
      });
    } catch (emailErrorObj: any) {
      emailStatus = "failed";
      emailError = emailErrorObj.message || String(emailErrorObj);
      console.error(`Failed to send creation email for alert ${alert.id}:`, emailErrorObj);
    }

    try {
      await db.insert(alertEmailsSentTable).values({
        alertId: alert.id,
        userId: user.id,
        recipientEmail: user.email,
        jobCount: 0,
        status: emailStatus as any,
        errorMessage: emailError,
      });
    } catch (emailLogError: any) {
      console.error("Failed to log alert email status:", emailLogError);
    }

    res.status(201).json(alert);
  } catch (error: any) {
    console.error("Failed to create job alert:", error);
    res.status(500).json({ error: error.message || "Failed to create job alert" });
  }
});

router.put("/job-alerts/:id", async (req: any, res: Response) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
      return;
    }

    const alertId = parseInt(req.params.id, 10);
    if (isNaN(alertId)) {
      res.status(400).json({ error: "Invalid alert ID" });
      return;
    }

    const [existingAlert] = await db
      .select()
      .from(jobAlertsTable)
      .where(and(eq(jobAlertsTable.id, alertId), eq(jobAlertsTable.userId, user.id)));

    if (!existingAlert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    const { name, filters, frequency, isActive } = req.body;
    const updateData: any = {};

    if (typeof name === "string" && name.trim().length > 0) {
      updateData.name = name.trim();
    }
    if (filters !== undefined) {
      updateData.filters = {
        categories: Array.isArray(filters?.categories) ? filters.categories.filter((item: any) => typeof item === "string") : existingAlert.filters?.categories,
        locations: Array.isArray(filters?.locations) ? filters.locations.filter((item: any) => typeof item === "string") : existingAlert.filters?.locations,
        keywords: Array.isArray(filters?.keywords) ? filters.keywords.filter((item: any) => typeof item === "string") : existingAlert.filters?.keywords,
        minSalary: typeof filters?.minSalary === "number" ? filters.minSalary : existingAlert.filters?.minSalary,
        maxSalary: typeof filters?.maxSalary === "number" ? filters.maxSalary : existingAlert.filters?.maxSalary,
        shifts: Array.isArray(filters?.shifts) ? filters.shifts.filter((item: any) => typeof item === "string") : existingAlert.filters?.shifts,
      };
    }
    if (frequency === "daily" || frequency === "weekly") {
      updateData.frequency = frequency;
    }
    if (typeof isActive === "boolean") {
      updateData.isActive = isActive;
    }

    const [updatedAlert] = await db
      .update(jobAlertsTable)
      .set(updateData)
      .where(eq(jobAlertsTable.id, alertId))
      .returning();

    res.json(updatedAlert);
  } catch (error: any) {
    console.error("Failed to update job alert:", error);
    res.status(500).json({ error: error.message || "Failed to update job alert" });
  }
});

router.delete("/job-alerts/:id", async (req: any, res: Response) => {
  try {
    const user = await getSessionUser(req);
    if (!user) {
      res.status(401).json({ error: "Unauthorized. Please log in." });
      return;
    }

    const alertId = parseInt(req.params.id, 10);
    if (isNaN(alertId)) {
      res.status(400).json({ error: "Invalid alert ID" });
      return;
    }

    const [existingAlert] = await db
      .select()
      .from(jobAlertsTable)
      .where(and(eq(jobAlertsTable.id, alertId), eq(jobAlertsTable.userId, user.id)));

    if (!existingAlert) {
      res.status(404).json({ error: "Alert not found" });
      return;
    }

    await db.delete(jobAlertsTable).where(eq(jobAlertsTable.id, alertId));
    res.json({ success: true });
  } catch (error: any) {
    console.error("Failed to delete job alert:", error);
    res.status(500).json({ error: error.message || "Failed to delete job alert" });
  }
});

export default router;
