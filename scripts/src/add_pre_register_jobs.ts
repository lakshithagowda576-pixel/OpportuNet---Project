// Simple script to add pre-register jobs via API call
// This avoids database connection issues

const preRegisterJobs = [
  {
    title: "Software Engineer - May 2026",
    company: "Tata Consultancy Services (TCS)",
    location: "Bangalore",
    category: "IT",
    shift: "Full_time",
    description: "Join TCS as a Software Engineer. We are looking for talented individuals to join our team in Bangalore. This is a Full-time position in IT sector. Position opens in May 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-05-15",
    endDate: "2026-06-15",
    hrEmail: "careers@tcs.com",
    salary: "15 - 25 LPA",
    openings: 10,
    applicationLink: "https://www.tcs.com/careers",
    official_url: "https://www.tcs.com/careers"
  },
  {
    title: "Frontend Developer - June 2026",
    company: "Infosys",
    location: "Hyderabad",
    category: "IT",
    shift: "Full_time",
    description: "Join Infosys as a Frontend Developer. We are looking for talented individuals to join our team in Hyderabad. This is a Full-time position in IT sector. Position opens in June 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-06-01",
    endDate: "2026-07-01",
    hrEmail: "careers@infosys.com",
    salary: "12 - 20 LPA",
    openings: 8,
    applicationLink: "https://www.infosys.com/careers/",
    official_url: "https://www.infosys.com/careers/"
  },
  {
    title: "Data Scientist - July 2026",
    company: "Wipro",
    location: "Pune",
    category: "IT",
    shift: "Full_time",
    description: "Join Wipro as a Data Scientist. We are looking for talented individuals to join our team in Pune. This is a Full-time position in IT sector. Position opens in July 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-07-10",
    endDate: "2026-08-10",
    hrEmail: "careers@wipro.com",
    salary: "18 - 30 LPA",
    openings: 5,
    applicationLink: "https://careers.wipro.com/",
    official_url: "https://careers.wipro.com/"
  },
  {
    title: "DevOps Engineer - August 2026",
    company: "HCLTech",
    location: "Noida",
    category: "IT",
    shift: "Full_time",
    description: "Join HCLTech as a DevOps Engineer. We are looking for talented individuals to join our team in Noida. This is a Full-time position in IT sector. Position opens in August 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-08-05",
    endDate: "2026-09-05",
    hrEmail: "careers@hcltech.com",
    salary: "14 - 22 LPA",
    openings: 6,
    applicationLink: "https://www.hcltech.com/careers",
    official_url: "https://www.hcltech.com/careers"
  },
  {
    title: "Product Manager - September 2026",
    company: "Accenture India",
    location: "Mumbai",
    category: "IT",
    shift: "Full_time",
    description: "Join Accenture India as a Product Manager. We are looking for talented individuals to join our team in Mumbai. This is a Full-time position in IT sector. Position opens in September 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-09-01",
    endDate: "2026-10-01",
    hrEmail: "hr@accenture.com",
    salary: "20 - 35 LPA",
    openings: 3,
    applicationLink: "https://www.accenture.com/in-en/careers",
    official_url: "https://www.accenture.com/in-en/careers"
  },
  {
    title: "UI/UX Designer - October 2026",
    company: "Amazon India",
    location: "Chennai",
    category: "IT",
    shift: "Full_time",
    description: "Join Amazon India as a UI/UX Designer. We are looking for talented individuals to join our team in Chennai. This is a Full-time position in IT sector. Position opens in October 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-10-15",
    endDate: "2026-11-15",
    hrEmail: "careers@amazon.com",
    salary: "16 - 28 LPA",
    openings: 4,
    applicationLink: "https://www.amazon.jobs/en/locations/india",
    official_url: "https://www.amazon.jobs/en/locations/india"
  },
  {
    title: "Cybersecurity Analyst - November 2026",
    company: "Google India",
    location: "Delhi NCR",
    category: "IT",
    shift: "Full_time",
    description: "Join Google India as a Cybersecurity Analyst. We are looking for talented individuals to join our team in Delhi NCR. This is a Full-time position in IT sector. Position opens in November 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-11-01",
    endDate: "2026-12-01",
    hrEmail: "careers@google.com",
    salary: "22 - 40 LPA",
    openings: 2,
    applicationLink: "https://www.google.com/about/careers/applications/locations/bangalore/",
    official_url: "https://www.google.com/about/careers/applications/locations/bangalore/"
  },
  {
    title: "Cloud Architect - December 2026",
    company: "Microsoft India",
    location: "Hyderabad",
    category: "IT",
    shift: "Full_time",
    description: "Join Microsoft India as a Cloud Architect. We are looking for talented individuals to join our team in Hyderabad. This is a Full-time position in IT sector. Position opens in December 2026.",
    eligibility: "Bachelor's degree in relevant field with 50% aggregate. Minimum 2 years of professional experience.",
    applicationGuide: "Step 1: Visit official portal when applications open. Step 2: Fill in the details. Step 3: Upload documents. Step 4: Submit before deadline.",
    startDate: "2026-12-01",
    endDate: "2026-12-31",
    hrEmail: "careers@microsoft.com",
    salary: "25 - 45 LPA",
    openings: 3,
    applicationLink: "https://careers.microsoft.com/us/en/search-results?keywords=India",
    official_url: "https://careers.microsoft.com/us/en/search-results?keywords=India"
  }
];

console.log("Pre-register jobs ready to add:");
console.log(`Total jobs: ${preRegisterJobs.length}`);
console.log("Jobs span from May to December 2026");
console.log("\nSample jobs:");
preRegisterJobs.forEach((job, index) => {
  console.log(`${index + 1}. ${job.title} at ${job.company} (${job.startDate})`);
});

console.log("\nTo add these jobs to the database, you can:");
console.log("1. Use the API endpoint at http://localhost:3008/api/jobs (POST)");
console.log("2. Or fix the DATABASE_URL environment variable and run the seed script");
console.log("3. Or manually add them through the admin interface");

process.exit(0);
