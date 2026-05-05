import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { like, or } from "drizzle-orm";

async function cleanup() {
  console.log("Cleaning up jobs with broken/example links...");
  
  const result = await db.delete(jobsTable)
    .where(
      or(
        like(jobsTable.applicationLink, "%example.com%"),
        like(jobsTable.official_url, "%example.com%")
      )
    )
    .returning();
    
  console.log(`Deleted ${result.length} jobs with example.com links.`);
  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
