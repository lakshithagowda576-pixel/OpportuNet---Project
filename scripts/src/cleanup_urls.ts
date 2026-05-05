import { db } from "@workspace/db";
import { jobsTable, studyMaterialsTable } from "@workspace/db/schema";
import { eq, or, like } from "drizzle-orm";
import https from "https";
import http from "http";

async function checkUrl(url: string): Promise<boolean> {
  if (!url || url.includes("example.com")) return false;
  
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    try {
      const request = client.get(url, { timeout: 5000 }, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          resolve(true);
        } else {
          resolve(false);
        }
        res.resume();
      });
      request.on("error", () => resolve(false));
      request.on("timeout", () => {
        request.destroy();
        resolve(false);
      });
    } catch (e) {
      resolve(false);
    }
  });
}

async function cleanup() {
  console.log("Starting URL validation and cleanup...");
  
  const jobs = await db.select().from(jobsTable);
  console.log(`Checking ${jobs.length} jobs...`);
  
  let jobsRemoved = 0;
  for (const job of jobs) {
    const isLinkValid = await checkUrl(job.applicationLink || "");
    const isOfficialValid = (job as any).official_url ? await checkUrl((job as any).official_url) : true;
    
    if (!isLinkValid || !isOfficialValid) {
      console.log(`Removing job ${job.id}: ${job.title} due to broken link`);
      // Note: Might fail if referenced from applications, but we'll try
      try {
        await db.delete(jobsTable).where(eq(jobsTable.id, job.id));
        jobsRemoved++;
      } catch (e) {
        console.warn(`Could not delete job ${job.id} (likely has applications)`);
      }
    }
  }
  
  console.log(`Removed ${jobsRemoved} broken jobs.`);
  
  const materials = await db.select().from(studyMaterialsTable);
  console.log(`Checking ${materials.length} study materials...`);
  
  let materialsFixed = 0;
  for (const mat of materials) {
    const isValid = await checkUrl(mat.url);
    if (!isValid) {
      console.log(`Broken material link: ${mat.title} (${mat.url})`);
      // I'll update GeeksforGeeks links specifically if they are broken
      if (mat.url.includes("geeksforgeeks.org")) {
        let newUrl = mat.url;
        if (mat.url.includes("gate-previous-year-solved-papers")) {
          newUrl = "https://www.geeksforgeeks.org/gate-corner-2-gq/";
        } else if (mat.url.includes("/dbms/")) {
          newUrl = "https://www.geeksforgeeks.org/dbms/"; // Try to refresh or use alternative
        }
        
        await db.update(studyMaterialsTable)
          .set({ url: newUrl })
          .where(eq(studyMaterialsTable.id, mat.id));
        materialsFixed++;
      }
    }
  }
  
  console.log(`Fixed ${materialsFixed} material links.`);
  process.exit(0);
}

cleanup().catch(err => {
  console.error(err);
  process.exit(1);
});
