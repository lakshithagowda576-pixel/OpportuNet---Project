import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const companiesTable = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  logoUrl: text("logo_url"),
  primaryColor: text("primary_color").notNull().default("#4285F4"), // Default to a blue
  secondaryColor: text("secondary_color").notNull().default("#34A853"), // Default to a green
  description: text("description"),
  foundedYear: integer("founded_year"),
  headquarters: text("headquarters"),
  website: text("website"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  companySize: text("company_size"),
  industry: text("industry"),
  culture: text("culture"),
  benefits: text("benefits"),
  type: text("type").notNull().default("corporate"), // corporate or government
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCompanySchema = createInsertSchema(companiesTable).omit({ id: true, createdAt: true });
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companiesTable.$inferSelect;
