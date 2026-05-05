import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").notNull().default("#4285F4"),
  secondaryColor: text("secondary_color"),
  description: text("description"),
  foundedYear: integer("founded_year"),
  headquarters: text("headquarters"),
  website: text("website"),
  companySize: text("company_size"),
  industry: text("industry"),
  culture: text("culture"),
  benefits: jsonb("benefits").$type<string[]>(), 
  socialLinks: jsonb("social_links").$type<{
    linkedin?: string;
    twitter?: string;
    github?: string;
    facebook?: string;
  }>(),
  type: text("type").notNull().default("corporate"), // corporate or government
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true });
export type InsertCompany = typeof companiesTable.$inferInsert;
export type Company = typeof companiesTable.$inferSelect;
