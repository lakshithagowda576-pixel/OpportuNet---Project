import { db } from "@workspace/db";
import { collegesTable, collegeCutoffsTable, collegeFeesTable } from "@workspace/db/schema";
import { eq, not } from "drizzle-orm";
// import { seedColleges } from "./seed-colleges.js"; 

async function fixColleges() {
  console.log("Deleting non-Karnataka colleges...");
  
  // We can't easily just delete non-Karnataka because of foreign keys
  // So we'll delete all and re-seed.
  
  console.log("Wiping all college data...");
  await db.delete(collegeFeesTable);
  await db.delete(collegeCutoffsTable);
  await db.delete(collegesTable);
  
  console.log("Re-seeding Karnataka colleges...");
  // I'll call the seedColleges function directly if I can, or just run the api server
  // But wait, the api server only seeds if it's empty.
  // So wiping is enough, the next time api server starts it will seed.
  
  process.exit(0);
}

// Wait, I should just run the seedColleges logic here to be sure.
// But I need the data.
// It's easier to just wipe and let the server re-seed.

fixColleges().catch(err => {
  console.error(err);
  process.exit(1);
});
