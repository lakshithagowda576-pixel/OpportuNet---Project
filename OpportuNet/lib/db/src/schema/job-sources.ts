import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const jobSourcesTable = pgTable("job_sources", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  apiKey: text("api_key"),
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  lastSyncStatus: text("last_sync_status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobIngestionsTable = pgTable("job_ingestions", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => jobSourcesTable.id).notNull(),
  jobCount: integer("job_count").default(0),
  newJobs: integer("new_jobs").default(0),
  updatedJobs: integer("updated_jobs").default(0),
  duplicates: integer("duplicates").default(0),
  status: text("status").notNull(), // completed, failed, in_progress
  errorMessage: text("error_message"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const jobSourceMappingTable = pgTable("job_source_mapping", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => jobSourcesTable.id).notNull(),
  externalJobId: text("external_job_id").notNull(),
  internalJobId: integer("internal_job_id").notNull(),
  externalUrl: text("external_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const createJobSourceSchema = createInsertSchema(jobSourcesTable);
export const selectJobSourceSchema = createSelectSchema(jobSourcesTable);
export const updateJobSourceSchema = createJobSourceSchema.partial();
