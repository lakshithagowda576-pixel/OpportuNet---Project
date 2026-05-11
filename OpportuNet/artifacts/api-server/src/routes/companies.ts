// @ts-nocheck
import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { companiesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";
import { requireAdmin } from "../middleware/auth";
import { CreateCompanySchema, UpdateCompanySchema } from "@workspace/api-zod";

const router: IRouter = Router();

// GET /api/companies - List all companies
router.get("/companies", async (req, res) => {
  try {
    const companies = await db.select().from(companiesTable);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch companies" });
  }
});

// GET /api/companies/:name - Get specific company branding
router.get("/companies/:name", async (req, res) => {
  try {
    const [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.name, req.params.name));
    
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    
    res.json(company);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch company details" });
  }
});

// ==================== COMPANIES CRUD (ADMIN) ====================

// POST /api/admin/companies - Create company (admin)
router.post("/admin/companies", requireAdmin, async (req, res) => {
  try {
    const data = CreateCompanySchema.parse(req.body);
    const [company] = await db.insert(companiesTable).values(data).returning();
    res.status(201).json({ ...company, createdAt: company.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// PUT /api/admin/companies/:id - Update company (admin)
router.put("/admin/companies/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = UpdateCompanySchema.parse(req.body);
    const [company] = await db.update(companiesTable).set(data).where(eq(companiesTable.id, id)).returning();
    if (!company) {
      res.status(404).json({ error: "Company not found" });
      return;
    }
    res.json({ ...company, createdAt: company.createdAt.toISOString() });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: "Validation error", details: error.errors });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// DELETE /api/admin/companies/:id - Delete company (admin)
router.delete("/admin/companies/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(companiesTable).where(eq(companiesTable.id, id));
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
