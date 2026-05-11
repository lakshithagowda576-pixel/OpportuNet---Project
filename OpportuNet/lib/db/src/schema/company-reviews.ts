import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const companyReviewsTable = pgTable("company_reviews", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviewVotesTable = pgTable("review_votes", {
  id: serial("id").primaryKey(),
  reviewId: integer("review_id").notNull(),
  userId: integer("user_id").notNull(),
  voteType: text("vote_type").notNull(), // helpful, unhelpful
  createdAt: timestamp("created_at").defaultNow(),
});

export const createCompanyReviewSchema = createInsertSchema(companyReviewsTable);
export const selectCompanyReviewSchema = createSelectSchema(companyReviewsTable);
export const createReviewVoteSchema = createInsertSchema(reviewVotesTable);
