import { db } from "@workspace/db";
import { collegesTable } from "@workspace/db/schema";
import { count, eq, not } from "drizzle-orm";

async function check() {
  const [total] = await db.select({ value: count() }).from(collegesTable);
  const [karnataka] = await db.select({ value: count() }).from(collegesTable).where(eq(collegesTable.state, "Karnataka"));
  
  console.log(`Total colleges: ${total.value}`);
  console.log(`Karnataka colleges: ${karnataka.value}`);
  
  if (total.value > karnataka.value) {
    const others = await db.select().from(collegesTable).where(not(eq(collegesTable.state, "Karnataka"))).limit(5);
    console.log("Sample of non-Karnataka colleges:");
    console.log(others.map(c => `${c.name} (${c.state})`).join(", "));
  }
  
  process.exit(0);
}

check().catch(err => {
  console.error(err);
  process.exit(1);
});
