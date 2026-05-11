import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const analyticsEventsTable = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventType: text("event_type").notNull(),
  eventData: jsonb("event_data"),
  userId: integer("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const createAnalyticsEventSchema = createInsertSchema(analyticsEventsTable);
export const selectAnalyticsEventSchema = createSelectSchema(analyticsEventsTable);
