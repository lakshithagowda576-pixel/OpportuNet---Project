import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { usersTable } from "./users";

export const resumesTable = pgTable("resumes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id).notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").default("application/pdf"),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  summary: text("summary"),
  skills: jsonb("skills"),
  experience: jsonb("experience"),
  education: jsonb("education"),
  certifications: jsonb("certifications"),
  languages: jsonb("languages"),
  parsedAt: timestamp("parsed_at"),
  parsingStatus: text("parsing_status").default("pending"), // pending, completed, failed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const updateResumeSchema = createInsertSchema(resumesTable);
export const selectResumeSchema = createSelectSchema(resumesTable);

export type Resume = typeof resumesTable.$inferSelect;
export type NewResume = typeof resumesTable.$inferInsert;
