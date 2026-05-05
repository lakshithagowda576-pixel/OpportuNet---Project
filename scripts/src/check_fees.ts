import { db } from "@workspace/db";
import { collegeFeesTable, collegesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

async function checkFees() {
  const fees = await db.select({
    collegeName: collegesTable.name,
    courseName: collegeFeesTable.courseName,
    annualFees: collegeFeesTable.annualFees,
    totalFees: collegeFeesTable.totalFees,
  })
  .from(collegeFeesTable)
  .leftJoin(collegesTable, eq(collegeFeesTable.collegeId, collegesTable.id))
  .limit(20);
  
  console.log("Sample Fees Data:");
  console.table(fees);
  
  process.exit(0);
}

checkFees().catch(err => {
  console.error(err);
  process.exit(1);
});
