import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { 
  jobsTable, 
  applicationsTable, 
  usersTable, 
  companiesTable,
  collegesTable,
} from "./schema/index";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema: { jobsTable, applicationsTable, usersTable, companiesTable, collegesTable } });

// ===== HELPER FUNCTIONS =====
function getRandomItem<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomEmail(): string {
  return `user${Math.floor(Math.random() * 100000)}@example.com`;
}

async function seed() {
  try {
    console.log("\n🚀 Starting database seeding with 1000+ applications...\n");

    // ===== CLEAR EXISTING DATA =====
    console.log("📋 Clearing existing data...");
    await db.delete(applicationsTable).catch(() => {});
    await db.delete(jobsTable).catch(() => {});
    await db.delete(usersTable).catch(() => {});
    await db.delete(companiesTable).catch(() => {});
    await db.delete(collegesTable).catch(() => {});
    console.log("✅ Cleared all existing data\n");

    // ===== SEED COMPANIES =====
    console.log("🏢 Seeding 8 companies...");
    const companyNames = [
      { name: "TCS", email: "hr@tcs.com" },
      { name: "Infosys", email: "hr@infosys.com" },
      { name: "Wipro", email: "hr@wipro.com" },
      { name: "Accenture", email: "hr@accenture.com" },
      { name: "Cognizant", email: "hr@cognizant.com" },
      { name: "HCL", email: "hr@hcl.com" },
      { name: "Tech Mahindra", email: "hr@techmahindra.com" },
      { name: "IBM India", email: "hr@ibmindia.com" }
    ];
    const companyEmails = new Map(companyNames.map((company) => [company.name, company.email]));

    const insertedCompanies = await db.insert(companiesTable).values(companyNames.map(({ name }) => ({ name }))).returning();
    console.log(`✅ Seeded ${insertedCompanies.length} companies\n`);

    // ===== SEED JOBS =====
    console.log("💼 Seeding 40 jobs...");
    const jobTitles = [
      "Software Engineer",
      "Senior Software Engineer",
      "Data Scientist",
      "Cloud Engineer",
      "DevOps Engineer",
      "Full Stack Developer",
      "Machine Learning Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Mobile Developer"
    ];

    const locations = ["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"];
    let jobCount = 0;

    for (const company of insertedCompanies) {
      for (let i = 0; i < 5; i++) {
        await db.insert(jobsTable).values({
          title: getRandomItem(jobTitles),
          company: company.name,
          category: "IT" as any,
          location: getRandomItem(locations),
          shift: "Full_time" as any,
          description: `Exciting opportunity to join ${company.name} as a ${getRandomItem(jobTitles)}. Work on cutting-edge technologies and innovative solutions.`,
          eligibility: "Bachelor's degree in Computer Science or related field with 2+ years of experience.",
          applicationGuide: "Submit your resume and a cover letter through our online portal.",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          hrEmail: companyEmails.get(company.name) ?? "hr@example.com",
          salary: `${(Math.floor(Math.random() * 20) + 5)} - ${(Math.floor(Math.random() * 30) + 15)} LPA`,
          openings: Math.floor(Math.random() * 10) + 1,
          applicationLink: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com/careers`,
          official_url: `https://${company.name.toLowerCase().replace(/\s+/g, '')}.com`,
          isFeatured: Math.random() > 0.7,
          active: true
        });
        jobCount++;
      }
    }
    
    const insertedJobs = await db.select().from(jobsTable).limit(40);
    console.log(`✅ Seeded ${insertedJobs.length} jobs\n`);

    // ===== SEED USERS =====
    console.log("👥 Seeding 500 users...");
    const FIRST_NAMES = [
      "Rahul", "Priya", "Arun", "Sneha", "Vikram", "Anjali", "Arjun", "Divya",
      "Rohan", "Pooja", "Amit", "Neha", "Nikhil", "Shreya", "Sanjay", "Kavya",
      "Akshay", "Deepika", "Varun", "Isha", "Aryan", "Ananya", "Harish", "Nisha",
      "Karthik", "Richa", "Ashok", "Sunita", "Ravi", "Swati", "Siddharth", "Kriti",
      "Rajesh", "Aadhya", "Suresh", "Meera", "Prakash", "Simran", "Mohit", "Tanvi"
    ];

    const LAST_NAMES = [
      "Kumar", "Singh", "Patel", "Sharma", "Gupta", "Verma", "Rao", "Nair",
      "Reddy", "Iyer", "Menon", "Chopra", "Malhotra", "Desai", "Joshi", "Bhat"
    ];

    const passwordHash = "$2b$10$hashed_password_sample"; // Sample hash for demo
    const insertedUsers = [];

    for (let i = 0; i < 500; i++) {
      const [user] = await db.insert(usersTable).values({
        name: `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`,
        email: generateRandomEmail(),
        passwordHash: passwordHash,
        role: "user" as any,
        provider: "email"
      }).returning();
      insertedUsers.push(user);
      
      if ((i + 1) % 100 === 0) {
        process.stdout.write(`  ${i + 1}/500 users...\r`);
      }
    }
    console.log(`✅ Seeded ${insertedUsers.length} users                    \n`);

    // ===== SEED APPLICATIONS =====
    console.log("📝 Seeding 1200 job applications...");
    const statuses = ["Pending", "Reviewed", "Interview", "Offered", "Rejected"] as const;
    let applicationCount = 0;

    // Create 1200 applications in batches
    for (let i = 0; i < 1200; i++) {
      const randomUser = getRandomItem(insertedUsers);
      const randomJob = getRandomItem(insertedJobs);

      try {
        await db.insert(applicationsTable).values({
          userId: randomUser.id,
          jobId: randomJob.id,
          applicantName: randomUser.name,
          applicantEmail: randomUser.email,
          status: getRandomItem(statuses),
          appliedAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
        });
        applicationCount++;
        
        if ((i + 1) % 200 === 0) {
          process.stdout.write(`  ${i + 1}/1200 applications...\r`);
        }
      } catch (e) {
        // Skip duplicate applications (same user, same job)
      }
    }
    console.log(`✅ Seeded ${applicationCount} job applications              \n`);

    // ===== SUMMARY =====
    console.log("═══════════════════════════════════════════════════");
    console.log("✅ SEEDING COMPLETE!");
    console.log("═══════════════════════════════════════════════════");
    console.log(`📊 Summary:`);
    console.log(`   • Companies: ${insertedCompanies.length}`);
    console.log(`   • Jobs: ${insertedJobs.length}`);
    console.log(`   • Users: ${insertedUsers.length}`);
    console.log(`   • Applications: ${applicationCount}`);
    console.log(`\n✨ Database ready with 1000+ test applications!`);
    console.log("═══════════════════════════════════════════════════\n");

    await pool.end();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
