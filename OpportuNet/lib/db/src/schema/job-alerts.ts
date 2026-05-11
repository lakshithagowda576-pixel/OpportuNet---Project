import { pgTable, serial, text, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const jobAlertsTable = pgTable("job_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  keywords: text("keywords"),
  location: text("location"),
  category: text("category"),
  frequency: text("frequency").default("daily"), // daily, weekly
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const alertEmailsSentTable = pgTable("alert_emails_sent", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  alertId: integer("alert_id").references(() => jobAlertsTable.id),
  sentAt: timestamp("sent_at").defaultNow(),
  jobIds: jsonb("job_ids"),
});

export const createJobAlertSchema = createInsertSchema(jobAlertsTable);
export const selectJobAlertSchema = createSelectSchema(jobAlertsTable);
