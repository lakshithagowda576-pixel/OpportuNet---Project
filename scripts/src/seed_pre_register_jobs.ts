import { db } from "@workspace/db";
import { jobsTable } from "@workspace/db/schema";

const preRegisterJobTitles = [
  "Software Engineer", "Frontend Developer", "Backend Developer", "Full Stack Developer",
  "Data Scientist", "DevOps Engineer", "Cloud Architect", "Cybersecurity Analyst",
  "Product Manager", "UI/UX Designer", "QA Engineer", "Mobile App Developer",
  "Network Administrator", "System Administrator", "Database Administrator",
  "Business Analyst", "Marketing Manager", "HR Generalist", "Financial Analyst",
  "Project Coordinator", "Sales Representative", "Customer Success Manager",
  "Technical Writer", "IT Support Specialist", "Security Officer",
  "Junior Engineer", "Staff Nurse", "Revenue Inspector", "Supply Chain Manager",
  "Agriculture Officer", "Brand Manager", "Sales Executive", "NDA Cadet",
  "Income Tax Inspector", "Probationary Officer", "Clerk", "Multi Tasking Staff",
  "Senior Software Engineer", "Tech Lead", "Engineering Manager", "Data Analyst",
  "Machine Learning Engineer", "Blockchain Developer", "Game Developer", "AR/VR Developer",
  "Cloud Security Engineer", "Site Reliability Engineer", "API Developer", "Database Developer",
  "Systems Analyst", "Network Security Engineer", "Information Security Manager",
  "Compliance Officer", "Risk Manager", "Internal Auditor", "Tax Consultant",
  "Legal Advisor", "Company Secretary", "Cost Accountant", "Management Trainee",
  "Graduate Engineer Trainee", "Diploma Engineer", "Apprentice", "Trainee Engineer"
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
  { name: "Microsoft India", url: "https://careers.microsoft.com/us/en/search-results?keywords=India" },
  { name: "Meta India", url: "https://www.metacareers.com/locations/bangalore" },
  { name: "Apple India", url: "https://jobs.apple.com/en-in/search" },
  { name: "Netflix India", url: "https://jobs.netflix.com/jobs/india" },
  { name: "Adobe India", url: "https://www.adobe.com/careers.html" }
];

const locations = [
  "Bangalore", "Hyderabad", "Pune", "Mumbai", "Chennai", "Delhi NCR", "Noida", "Gurgaon", 
  "Kolkata", "Ahmedabad", "Remote", "Jaipur", "Lucknow", "Indore", "Chandigarh", "Coimbatore"
];

const jobTypes = ["Full-time", "Contract", "Internship", "Part-time"];
const categories = ["IT", "NON_IT", "STATE_GOVT", "CENTRAL_GOVT"];

function generateJobsForMonth(month: number, year: number, jobsPerMonth: number) {
  const jobs = [];
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0); // Last day of the month
  
  for (let i = 0; i < jobsPerMonth; i++) {
    const company = companies[Math.floor(Math.random() * companies.length)];
    const title = preRegisterJobTitles[Math.floor(Math.random() * preRegisterJobTitles.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const type = jobTypes[Math.floor(Math.random() * jobTypes.length)];
    const category = categories[Math.floor(Math.random() * categories.length)];
    
    const shift = ["Day", "Night", "Full_time", "Part_time"][Math.floor(Math.random() * 4)];
    
    // Random date within the month
    const randomDay = Math.floor(Math.random() * (endDate.getDate() - 1)) + 1;
    const jobDate = new Date(year, month, randomDay);
    
    jobs.push({
      title: `${title} - ${startDate.toLocaleString('default', { month: 'long' })} ${year}`,
      company: company.name,
      location: location,
      category: category as any,
      shift: shift as any,
      description: `Join ${company.name} as a ${title}. We are looking for talented individuals to join our team in ${location}. This is a ${type} position in the ${category} sector. Position opens in ${startDate.toLocaleString('default', { month: 'long' })} ${year}.`,
      eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
      applicationGuide: "Step 1: Visit the official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
      startDate: jobDate.toISOString().split('T')[0],
      endDate: new Date(jobDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hrEmail: `careers@${company.name.toLowerCase().replace(/[^a-z]/g, '')}.com`,
      salary: `${Math.floor(Math.random() * 20 + 5)} - ${Math.floor(Math.random() * 30 + 15)} LPA`,
      openings: Math.floor(Math.random() * 15 + 1),
      applicationLink: company.url,
      official_url: company.url,
    });
  }
  
  return jobs;
}

async function seed() {
  console.log("Seeding pre-register jobs from now till December 2026...");
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  const allJobs = [];
  
  // Generate jobs for each remaining month till December 2026
  for (let year = currentYear; year <= 2026; year++) {
    const startMonth = year === currentYear ? currentMonth : 0;
    const endMonth = year === 2026 ? 11 : 11; // December (0-indexed)
    
    for (let month = startMonth; month <= endMonth; month++) {
      const jobsPerMonth = Math.floor(Math.random() * 15) + 10; // 10-25 jobs per month
      const monthJobs = generateJobsForMonth(month, year, jobsPerMonth);
      allJobs.push(...monthJobs);
      
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      console.log(`Generated ${jobsPerMonth} jobs for ${monthName} ${year}`);
    }
  }
  
  console.log(`Total jobs to insert: ${allJobs.length}`);
  
  // Insert in batches to avoid overwhelming the database
  const batchSize = 50;
  for (let i = 0; i < allJobs.length; i += batchSize) {
    const batch = allJobs.slice(i, i + batchSize);
    await db.insert(jobsTable).values(batch);
    console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(allJobs.length / batchSize)}`);
  }
  
  console.log(`Successfully seeded ${allJobs.length} pre-register jobs!`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
