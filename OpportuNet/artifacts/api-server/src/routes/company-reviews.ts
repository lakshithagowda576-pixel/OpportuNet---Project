import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { companyReviewsTable, reviewVotesTable, usersTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session?.userId) return res.status(401).json({ error: "Unauthorized" });
  next();
};

// POST /company-reviews - create review
router.post("/company-reviews", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { companyId, rating, title, content, isAnonymous } = req.body;

    const [review] = await db.insert(companyReviewsTable).values({
      companyId,
      userId,
      rating,
      title,
      content,
      isAnonymous: !!isAnonymous,
    }).returning();

    res.status(201).json(review);
  } catch (error) {
    console.error("Failed to create review:", error);
    res.status(500).json({ error: "Failed to create review" });
  }
});

// GET /company-reviews/:companyId - list reviews for a company
router.get("/company-reviews/:companyId", async (req, res) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const reviews = await db.select().from(companyReviewsTable).where(eq(companyReviewsTable.companyId, companyId)).orderBy(desc(companyReviewsTable.createdAt));
    res.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
});

// POST /company-reviews/:id/vote - vote helpful/unhelpful
router.post("/company-reviews/:id/vote", requireAuth, async (req, res) => {
  try {
    const userId = req.session.userId;
    const reviewId = parseInt(req.params.id);
    const { voteType } = req.body; // 'helpful' | 'unhelpful'

    // Check if already voted
    const existing = await db.select().from(reviewVotesTable).where(eq(reviewVotesTable.reviewId, reviewId)).andWhere(eq(reviewVotesTable.userId, userId));
    if (existing.length > 0) {
      return res.status(400).json({ error: "Already voted" });
    }

    const [vote] = await db.insert(reviewVotesTable).values({ reviewId, userId, voteType }).returning();

    // Update counts
    if (voteType === "helpful") {
      await db.update(companyReviewsTable).set({ helpfulCount: companyReviewsTable.helpfulCount + 1 }).where(eq(companyReviewsTable.id, reviewId));
    } else {
      await db.update(companyReviewsTable).set({ unhelpfulCount: companyReviewsTable.unhelpfulCount + 1 }).where(eq(companyReviewsTable.id, reviewId));
    }

    res.json(vote);
  } catch (error) {
    console.error("Failed to vote on review:", error);
    res.status(500).json({ error: "Failed to vote on review" });
  }
});

export default router;
