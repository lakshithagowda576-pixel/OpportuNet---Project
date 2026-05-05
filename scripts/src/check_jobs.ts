import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";
import { like, or, count } from "drizzle-orm";

async function checkJobs() {
  const [total] = await db.select({ value: count() }).from(jobsTable);
  const broken = await db.select().from(jobsTable).where(
    or(
      like(jobsTable.applicationLink, "%example.com%"),
      like(jobsTable.official_url, "%example.com%")
    )
  );
  
  console.log(`Total jobs: ${total.value}`);
  console.log(`Broken (example.com) jobs: ${broken.length}`);
  
  process.exit(0);
}

checkJobs().catch(err => {
  console.error(err);
  process.exit(1);
});
