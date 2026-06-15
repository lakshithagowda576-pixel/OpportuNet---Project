import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { 
  jobsTable, 
  applicationsTable, 
  usersTable, 
  companiesTable,
  examTable,
  collegesTable,
  studyMaterialsTable
} from "./schema/index";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const { Pool } = pg;

// Sample data
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

const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "NIT Warangal", "NIT Allahabad", "BITS Pilani", "VIT Vellore",
  "IIIT Hyderabad", "DTU Delhi", "Manipal University", "Anna University",
  "Karnatak University", "Savitribai Phule Pune University", "Amrita Vishwa Vidyapeetham"
];

const SUBJECTS = ["Computer Science", "Electronics", "Mechanical", "Civil", "Information Technology"];

const DOMAINS = [
  "Software Development",
  "Data Science",
  "Cloud Computing",
  "Machine Learning",
  "DevOps",
  "Full Stack Development",
  "Mobile Development",
  "AI/ML Engineering"
];

function generateRandomEmail(): string {
  const num = Math.floor(Math.random() * 100000);
  return `user${num}@example.com`;
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL must be set.");
    process.exit(1);
  }

  console.log("🚀 Starting database seeding...");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    // ===== CLEAR EXISTING DATA =====
    console.log("\n📋 Clearing existing data...");
    await db.delete(applicationsTable).catch(() => {});
    await db.delete(studyMaterialsTable).catch(() => {});
    await db.delete(examTable).catch(() => {});
    await db.delete(jobsTable).catch(() => {});
    await db.delete(usersTable).catch(() => {});
    await db.delete(companiesTable).catch(() => {});
    await db.delete(collegesTable).catch(() => {});
    console.log("✅ Cleared all existing data");

    // ===== SEED COMPANIES =====
    console.log("\n🏢 Seeding companies...");
    const companies = [
      {
        name: "TCS",
        description: "Tata Consultancy Services - Leading IT Company",
        website: "https://tcs.com",
        primaryColor: "#0066CC",
        secondaryColor: "#004B99",
        foundedYear: 1968,
        headquarters: "Mumbai, India",
        companySize: "600000+ employees",
        industry: "IT Services",
        culture: "Integrity, excellence, respect",
        benefits: ["Health Insurance", "Bonuses", "Training"],
        type: "corporate"
      },
      {
        name: "Infosys",
        description: "Global IT Services Company",
        website: "https://infosys.com",
        primaryColor: "#2C6E9E",
        secondaryColor: "#007CC3",
        foundedYear: 1981,
        headquarters: "Bangalore, India",
        companySize: "300000+ employees",
        industry: "IT Services",
        culture: "C-LIFE values",
        benefits: ["Health Insurance", "Work-Life Balance"],
        type: "corporate"
      },
      {
        name: "Wipro",
        description: "IT Services and Solutions Company",
        website: "https://wipro.com",
        primaryColor: "#EF6423",
        secondaryColor: "#000000",
        foundedYear: 1980,
        headquarters: "Bangalore, India",
        companySize: "250000+ employees",
        industry: "IT Services",
        culture: "Excellence and innovation",
        benefits: ["Medical", "Wellness"],
        type: "corporate"
      },
      {
        name: "Accenture",
        description: "Professional Services Company",
        website: "https://accenture.com",
        primaryColor: "#A100F2",
        secondaryColor: "#000000",
        foundedYear: 1989,
        headquarters: "Dublin, Ireland",
        companySize: "700000+ employees",
        industry: "Consulting & IT",
        culture: "Innovation and collaboration",
        benefits: ["Development", "Flexibility"],
        type: "corporate"
      },
      {
        name: "Google",
        description: "Technology Giant",
        website: "https://google.com",
        primaryColor: "#4285F4",
        secondaryColor: "#34A853",
        foundedYear: 1998,
        headquarters: "Mountain View, USA",
        companySize: "100000+ employees",
        industry: "Technology",
        culture: "Innovation and openness",
        benefits: ["Meals", "Gym", "Training"],
        type: "corporate"
      },
      {
        name: "Microsoft",
        description: "Software and Cloud Services",
        website: "https://microsoft.com",
        primaryColor: "#F25022",
        secondaryColor: "#7FBA00",
        foundedYear: 1975,
        headquarters: "Redmond, USA",
        companySize: "200000+ employees",
        industry: "Technology",
        culture: "Growth mindset",
        benefits: ["Health", "Wellness"],
        type: "corporate"
      },
      {
        name: "Amazon",
        description: "E-commerce and Cloud Provider",
        website: "https://amazon.com",
        primaryColor: "#FF9900",
        secondaryColor: "#000000",
        foundedYear: 1994,
        headquarters: "Seattle, USA",
        companySize: "1500000+ employees",
        industry: "E-commerce & Cloud",
        culture: "Customer obsession",
        benefits: ["Insurance", "Wellness"],
        type: "corporate"
      },
      {
        name: "Cognizant",
        description: "IT Services and Consulting",
        website: "https://cognizant.com",
        primaryColor: "#004B93",
        secondaryColor: "#FF6600",
        foundedYear: 1994,
        headquarters: "Teaneck, USA",
        companySize: "300000+ employees",
        industry: "IT Services",
        culture: "Global perspective",
        benefits: ["Health", "Development"],
        type: "corporate"
      }
    ];

    const insertedCompanies = await db.insert(companiesTable).values(companies).returning();
    console.log(`✅ Seeded ${insertedCompanies.length} companies`);

    // ===== SEED JOBS =====
    console.log("\n💼 Seeding jobs...");
    const jobs = [];
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

    for (const company of insertedCompanies) {
      for (let i = 0; i < 5; i++) {
        jobs.push({
          title: getRandomItem(jobTitles),
          company_id: company.id,
          category: getRandomItem(["IT"]),
          location: getRandomItem(["Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai"]),
          description: `Exciting opportunity to join ${company.name} as a ${getRandomItem(jobTitles)}. Work on cutting-edge technologies.`,
          requirements: `Strong fundamentals in Computer Science, proficiency in programming languages.`,
          salary_min: Math.floor(Math.random() * 10 + 4) * 100000,
          salary_max: Math.floor(Math.random() * 20 + 10) * 100000,
          shift_type: "Full_time",
          posted_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          active: true
        });
      }
    }

    const insertedJobs = await db.insert(jobsTable).values(jobs).returning();
    console.log(`✅ Seeded ${insertedJobs.length} jobs`);

    // ===== SEED USERS =====
    console.log("\n👥 Seeding users...");
    const users = [];
    for (let i = 0; i < 500; i++) {
      users.push({
        name: `${getRandomItem(FIRST_NAMES)} ${getRandomItem(LAST_NAMES)}`,
        email: generateRandomEmail(),
        password_hash: "hashed_password_sample",
        role: getRandomItem(["user", "user", "user", "admin"]),
        provider: "email",
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    const insertedUsers = await db.insert(usersTable).values(users).returning();
    console.log(`✅ Seeded ${insertedUsers.length} users`);

    // ===== SEED 1000+ APPLICATIONS =====
    console.log("\n📝 Seeding 1000+ job applications...");
    const applications = [];
    const statuses = ["Pending", "Reviewed", "Interview", "Offered", "Rejected"];

    for (let i = 0; i < 1200; i++) {
      const randomUser = getRandomItem(insertedUsers);
      const randomJob = getRandomItem(insertedJobs);
      
      applications.push({
        job_id: randomJob.id,
        user_id: randomUser.id,
        applicant_name: randomUser.name,
        applicant_email: randomUser.email,
        applicant_phone: `+91-${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        applicant_address: getRandomItem([
          "Bangalore, Karnataka",
          "Hyderabad, Telangana",
          "Pune, Maharashtra",
          "Chennai, Tamil Nadu",
          "Mumbai, Maharashtra",
          "Delhi, India",
          "Gurgaon, Haryana",
          "Noida, Uttar Pradesh"
        ]),
        education: `${getRandomItem(SUBJECTS)} from ${getRandomItem(COLLEGES)}`,
        qualification: getRandomItem(DOMAINS),
        resume_url: `https://example.com/resume${i}.pdf`,
        accepted_terms: true,
        cover_letter: `I am interested in the ${randomJob.title} position at your company.`,
        status: getRandomItem(statuses),
        applied_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString()
      });

      if ((i + 1) % 200 === 0) {
        console.log(`   Processing ${i + 1} applications...`);
      }
    }

    const insertedApplications = await db.insert(applicationsTable).values(applications).returning();
    console.log(`✅ Seeded ${insertedApplications.length} applications`);

    // ===== SEED COLLEGES =====
    console.log("\n🎓 Seeding colleges...");
    const collegesData = COLLEGES.map((name) => ({
      name,
      collegeCode: name.replace(/\s+/g, "").toUpperCase().substring(0, 10),
      state: getRandomItem(["Karnataka", "Telangana", "Maharashtra", "Tamil Nadu"]),
      city: getRandomItem(["Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai"]),
      location: getRandomItem(["Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai"]),
      affiliation: "Autonomous",
      about: `${name} is a premier engineering institution.`,
      establishedYear: 1958 + Math.floor(Math.random() * 50)
    }));

    const insertedColleges = await db.insert(collegesTable).values(collegesData).returning();
    console.log(`✅ Seeded ${insertedColleges.length} colleges`);

    // ===== SEED EXAMS =====
    console.log("\n📚 Seeding exams...");
    const exams = [
      {
        name: "JEE Main",
        fullName: "Joint Entrance Examination Main",
        code: "JEE_MAIN",
        category: "IT",
        description: "National level engineering entrance exam",
        examDate: "2026-01-25",
        applicationStartDate: "2025-11-01",
        applicationEndDate: "2025-12-15",
        applyLink: "https://jeemain.nta.nic.in",
        eligibility: "12th pass students",
        applicationGuide: "Visit official website and register",
        officialWebsite: "https://jeemain.nta.nic.in"
      },
      {
        name: "JEE Advanced",
        fullName: "Joint Entrance Examination Advanced",
        code: "JEE_ADV",
        category: "IT",
        description: "Advanced engineering entrance exam",
        examDate: "2026-06-02",
        applicationStartDate: "2026-05-01",
        applicationEndDate: "2026-05-15",
        applyLink: "https://jeeadv.ac.in",
        eligibility: "JEE Main qualified",
        applicationGuide: "Visit official website after JEE Main",
        officialWebsite: "https://jeeadv.ac.in"
      },
      {
        name: "Karnataka CET",
        fullName: "Karnataka Common Entrance Test",
        code: "KCET",
        category: "IT",
        description: "State level engineering entrance exam",
        examDate: "2026-06-20",
        applicationStartDate: "2026-04-01",
        applicationEndDate: "2026-05-15",
        applyLink: "https://cetonline.karnataka.gov.in",
        eligibility: "12th pass from Karnataka",
        applicationGuide: "Register on official portal",
        officialWebsite: "https://cetonline.karnataka.gov.in"
      },
      {
        name: "GATE",
        fullName: "Graduate Aptitude Test in Engineering",
        code: "GATE",
        category: "IT",
        description: "Graduate engineering entrance exam",
        examDate: "2026-02-03",
        applicationStartDate: "2025-09-01",
        applicationEndDate: "2025-10-15",
        applyLink: "https://gate.iitkgp.ac.in",
        eligibility: "Engineering graduates",
        applicationGuide: "Register online on GATE portal",
        officialWebsite: "https://gate.iitkgp.ac.in"
      },
      {
        name: "NEET",
        fullName: "National Eligibility cum Entrance Test",
        code: "NEET",
        category: "NON_IT",
        description: "Medical entrance exam",
        examDate: "2026-05-17",
        applicationStartDate: "2026-02-01",
        applicationEndDate: "2026-03-15",
        applyLink: "https://neet.nta.nic.in",
        eligibility: "12th pass biology students",
        applicationGuide: "Register on NTA NEET portal",
        officialWebsite: "https://neet.nta.nic.in"
      }
    ];

    const insertedExams = await db.insert(examTable).values(exams).returning();
    console.log(`✅ Seeded ${insertedExams.length} exams`);

    // ===== SEED STUDY MATERIALS =====
    console.log("\n📖 Seeding study materials...");
    const studyMaterials = [];
    const subjects = ["Physics", "Chemistry", "Mathematics", "English"];

    for (const exam of insertedExams) {
      for (const subject of subjects) {
        studyMaterials.push({
          exam_id: exam.id,
          title: `${exam.name} ${subject} Complete Notes`,
          subject: subject,
          type: getRandomItem(["PDF", "Video", "Notes", "Practice_Test"]),
          description: `Comprehensive ${subject} study material for ${exam.name} with solved examples`,
          url: `https://example.com/materials/${exam.code}_${subject.toLowerCase()}.pdf`
        });
      }
    }

    const insertedMaterials = await db.insert(studyMaterialsTable).values(studyMaterials).returning();
    console.log(`✅ Seeded ${insertedMaterials.length} study materials`);

    // ===== SUMMARY =====
    console.log("\n" + "=".repeat(60));
    console.log("✨ DATABASE SEEDING COMPLETED SUCCESSFULLY! ✨");
    console.log("=".repeat(60));
    console.log(`
📊 Seeding Summary:
   ✅ Companies: ${insertedCompanies.length}
   ✅ Jobs: ${insertedJobs.length}
   ✅ Users: ${insertedUsers.length}
   ✅ Job Applications: ${insertedApplications.length}
   ✅ Colleges: ${insertedColleges.length}
   ✅ Exams: ${insertedExams.length}
   ✅ Study Materials: ${insertedMaterials.length}
   
📈 Total Records: ${insertedCompanies.length + insertedJobs.length + insertedUsers.length + insertedApplications.length + insertedColleges.length + insertedExams.length + insertedMaterials.length}

🎯 Your database is now ready for testing!
    `);
    console.log("=".repeat(60));

    await pool.end();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    await pool.end();
    process.exit(1);
  }
}

seed();
