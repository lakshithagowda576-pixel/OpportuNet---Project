import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";

const jobTitles = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Cloud Architect", "Cybersecurity Analyst",
  "Product Manager", "UI/UX Designer", "QA Engineer", "Mobile App Developer",
  "Network Administrator", "System Administrator", "Database Administrator",
  "Business Analyst", "Marketing Manager", "HR Generalist", "Financial Analyst",
  "Project Coordinator", "Sales Representative", "Customer Success Manager",
  "Technical Writer", "IT Support Specialist", "Security Officer",
  "Junior Engineer", "Staff Nurse", "Revenue Inspector", "Supply Chain Manager",
  "Agriculture Officer", "Brand Manager", "Sales Executive", "NDA Cadet",
  "Income Tax Inspector", "Probationary Officer", "Clerk", "Multi Tasking Staff"
];

const companies = [
  { name: "Tata Consultancy Services (TCS)", url: "https://www.tcs.com/careers" },
  { name: "Infosys", url: "https://www.infosys.com/careers/" },
  { name: "Wipro", url: "https://careers.wipro.com/" },
  { name: "HCLTech", url: "https://www.hcltech.com/careers" },
  { name: "State Bank of India (SBI)", url: "https://sbi.co.in/web/careers" },
  { name: "UPSC", url: "https://upsc.gov.in/" },
  { name: "Staff Selection Commission (SSC)", url: "https://ssc.nic.in/" },
  { name: "IBPS", url: "https://www.ibps.in/" },
  { name: "Indian Railways", url: "https://indianrailways.gov.in/" },
  { name: "ISRO", url: "https://www.isro.gov.in/Careers.html" },
  { name: "DRDO", url: "https://www.drdo.gov.in/careers" },
  { name: "Cognizant", url: "https://www.cognizant.com/careers" },
  { name: "Accenture India", url: "https://www.accenture.com/in-en/careers" },
  { name: "Amazon India", url: "https://www.amazon.jobs/en/locations/india" },
  { name: "Google India", url: "https://www.google.com/about/careers/applications/locations/bangalore/" },
  { name: "Microsoft India", url: "https://careers.microsoft.com/us/en/search-results?keywords=India" }
];

const locations = [
  "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Delhi NCR", "Noida", "Gurgaon", "Kolkata", "Ahmedabad", "Remote"
];

const jobTypes = ["Full-time", "Contract", "Internship", "Part-time"];
const categories = ["IT", "NON_IT", "STATE_GOVT", "CENTRAL_GOVT"];

async function seed() {
  console.log("Seeding 110 live-like jobs...");
  
  const jobs = [];
  for (let i = 1; i <= 110; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = jobTitles[Math.floor(Math.random() * jobTitles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const shift = ["Day", "Night", "Full_time", "Part_time"][Math.floor(Math.random() * 4)];
    
    jobs.push({
      title: `${title} (${i})`,
      company: company.name,
      location: location,
      category: category as any,
      shift: shift as any,
      description: `Join ${company.name} as a ${title}. We are looking for talented individuals to join our team in ${location}. This is a ${type} position in the ${category} sector.`,
      eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
      applicationGuide: "Step 1: Visit the official portal. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit.",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hrEmail: `careers@${company.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      salary: `${Math.floor(Math.random() * 20 + 5)} - ${Math.floor(Math.random() * 30 + 15)} LPA`,
      openings: Math.floor(Math.random() * 10 + 1),
      applicationLink: company.url,
      official_url: company.url,
    });
  }
  
  await db.insert(jobsTable).values(jobs);
  console.log("Successfully seeded 110 jobs!");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
