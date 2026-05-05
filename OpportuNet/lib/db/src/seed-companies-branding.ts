import { companiesTable } from "./schema/companies";

// Comprehensive company branding data
export const companiesBrandingData = [
  // Tech Giants
  {
    name: "Google",
    logoUrl: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
    primaryColor: "#4285F4", // Blue
    secondaryColor: "#34A853", // Green
    description: "Google's mission is to organize the world's information and make it universally accessible and useful.",
    foundedYear: 1998,
    headquarters: "Mountain View, California",
    website: "https://www.google.com/careers",
    linkedin: "https://linkedin.com/company/google",
    twitter: "https://twitter.com/google",
    companySize: "190,000+ employees",
    industry: "Technology & Internet",
    culture: "Innovation-driven, collaborative, diversity-focused. We believe great ideas come from anywhere, and we encourage creative thinking.",
    benefits: "Competitive salary, Health insurance, 401(k) matching, Stock options, Flexible work, Paid time off, Wellness programs, Free meals",
    type: "corporate",
  },
  {
    name: "Microsoft",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/200px-Microsoft_logo_%282012%29.svg.png",
    primaryColor: "#F25022", // Orange-red
    secondaryColor: "#7FBA00", // Green
    description: "Microsoft empowers every person and organization on the planet to achieve more.",
    foundedYear: 1975,
    headquarters: "Redmond, Washington",
    website: "https://careers.microsoft.com",
    linkedin: "https://linkedin.com/company/microsoft",
    twitter: "https://twitter.com/microsoft",
    companySize: "220,000+ employees",
    industry: "Technology & Software",
    culture: "Growth mindset, customer obsession, and a commitment to innovation. We foster inclusive teams and support continuous learning.",
    benefits: "Competitive compensation, Health coverage, Retirement plans, Stock awards, Paid leave, Career development, Flexible work arrangements",
    type: "corporate",
  },
  {
    name: "Amazon",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
    primaryColor: "#FF9900", // Orange
    secondaryColor: "#146EB4", // Blue
    description: "Amazon's vision is to be Earth's most customer-centric company where people can find and discover anything they want online.",
    foundedYear: 1994,
    headquarters: "Seattle, Washington",
    website: "https://amazon.jobs",
    linkedin: "https://linkedin.com/company/amazon",
    twitter: "https://twitter.com/amazon",
    companySize: "1,500,000+ employees",
    industry: "E-commerce & Technology",
    culture: "Customer obsession, think big, invent and simplify. We expect our employees to work hard, enjoy the work, and make a difference.",
    benefits: "Competitive pay, Health insurance, 401(k) match, Stock options, Parental leave, Tuition assistance, Mental health support",
    type: "corporate",
  },
  {
    name: "Apple",
    logoUrl: "https://www.apple.com/favicon.ico",
    primaryColor: "#555555", // Dark gray
    secondaryColor: "#A2AAAD", // Light gray
    description: "Apple designs products that are at the intersection of technology and the liberal arts. Join a team of dedicated professionals.",
    foundedYear: 1976,
    headquarters: "Cupertino, California",
    website: "https://jobs.apple.com",
    linkedin: "https://linkedin.com/company/apple",
    twitter: "https://twitter.com/apple",
    companySize: "161,000+ employees",
    industry: "Consumer Electronics & Software",
    culture: "Excellence in design, attention to detail, innovation. We push the boundaries of what's possible.",
    benefits: "Excellent compensation, Health/dental/vision insurance, 401(k), Stock awards, Paid time off, Parental leave, Wellness programs",
    type: "corporate",
  },
  // Indian IT Giants
  {
    name: "Infosys",
    logoUrl: "https://www.infosys.com/etc.clientlibs/infosys/clientlibs/resources/images/svg/infosys-logo.svg",
    primaryColor: "#2C6E9E", // Blue
    secondaryColor: "#F37021", // Orange
    description: "Infosys is a global leader in next-generation digital services and consulting. We create digital experiences and platforms.",
    foundedYear: 1981,
    headquarters: "Bangalore, India",
    website: "https://www.infosys.com/careers",
    linkedin: "https://linkedin.com/company/infosys",
    twitter: "https://twitter.com/infosys",
    companySize: "314,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Respect, Integrity, Professional Excellence, Inclusive Growth. We believe in the power of technology and human potential.",
    benefits: "Competitive salary, Health insurance, PF and gratuity, Stock options, Career growth, Learning programs, Flexible work",
    type: "corporate",
  },
  {
    name: "TCS (Tata Consultancy Services)",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/TCS_Logo.svg/220px-TCS_Logo.svg.png",
    primaryColor: "#0066CC", // Blue
    secondaryColor: "#FF6600", // Orange
    description: "TCS is a global IT services, consulting and business solutions organization that leverages technology for good.",
    foundedYear: 1968,
    headquarters: "Mumbai, India",
    website: "https://www.tcs.com/careers",
    linkedin: "https://linkedin.com/company/tcs",
    twitter: "https://twitter.com/tcs",
    companySize: "614,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Pioneering the IT industry, creating meaningful impact. We are committed to creating an inclusive workplace.",
    benefits: "Competitive compensation, Comprehensive health benefits, PF & gratuity, Stock awards, Professional development, Wellness support",
    type: "corporate",
  },
  {
    name: "Wipro",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Wipro_logo.png",
    primaryColor: "#1B3C9C", // Dark blue
    secondaryColor: "#FF8800", // Orange
    description: "Wipro is a leading global information technology, consulting and business process services company.",
    foundedYear: 1980,
    headquarters: "Bangalore, India",
    website: "https://www.wipro.com/careers",
    linkedin: "https://linkedin.com/company/wipro",
    twitter: "https://twitter.com/wipro",
    companySize: "275,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Commitment to excellence, innovative thinking, social responsibility. We create meaningful value for our clients and society.",
    benefits: "Attractive salary structure, Health & wellness coverage, Retirement benefits, Performance bonuses, Career advancement, Learning opportunities",
    type: "corporate",
  },
  {
    name: "HCL Technologies",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/HCL_logo.png/220px-HCL_logo.png",
    primaryColor: "#0093D0", // Blue
    secondaryColor: "#FF6B35", // Orange
    description: "HCL is a leading global IT services company with deep expertise across diverse markets and domains.",
    foundedYear: 1976,
    headquarters: "Noida, India",
    website: "https://www.hcl.com/careers",
    linkedin: "https://linkedin.com/company/hcl-technologies",
    twitter: "https://twitter.com/hcltech",
    companySize: "226,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Employee first, continuous innovation, global mindset. We empower our people to create transformational change.",
    benefits: "Competitive salary, Health insurance, Retirement plans, Performance incentives, Learning & development, Flexible work arrangements",
    type: "corporate",
  },
  {
    name: "Tech Mahindra",
    logoUrl: "https://www.techmahindra.com/etc/designs/techmahindra/favicon.ico",
    primaryColor: "#FFC224", // Golden yellow
    secondaryColor: "#0D47A1", // Dark blue
    description: "Tech Mahindra is a digital enterprise that leverages the power of connected technologies for human experiences.",
    foundedYear: 1986,
    headquarters: "Pune, India",
    website: "https://www.techmahindra.com/careers",
    linkedin: "https://linkedin.com/company/tech-mahindra",
    twitter: "https://twitter.com/TechMahindra",
    companySize: "187,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Our DNA is to solve, evolve and involve. We are committed to being a responsible corporate citizen.",
    benefits: "Competitive compensation, Health & wellness benefits, Retirement security, Stock awards, Career growth paths, Flexible work options",
    type: "corporate",
  },
  {
    name: "Accenture",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Accenture.svg",
    primaryColor: "#A100F2", // Purple
    secondaryColor: "#00A699", // Teal
    description: "Accenture is a global professional services company with leading capabilities in digital, cloud and security.",
    foundedYear: 2001,
    headquarters: "Dublin, Ireland",
    website: "https://www.accenture.com/careers",
    linkedin: "https://linkedin.com/company/accenture",
    twitter: "https://twitter.com/accenture",
    companySize: "733,000+ employees",
    industry: "IT Services & Consulting",
    culture: "Reimagining how businesses operate. We foster an inclusive culture where diverse perspectives drive innovation.",
    benefits: "Competitive salary, Comprehensive benefits, Retirement plans, Professional development, Wellness programs, Flexible work",
    type: "corporate",
  },
  // Government Exams
  {
    name: "UPSC (Union Public Service Commission)",
    logoUrl: "https://upsc.gov.in/sites/default/files/upscseal.jpg",
    primaryColor: "#FF9933", // Saffron
    secondaryColor: "#128807", // Green
    description: "UPSC conducts the Civil Services Examination. It is the premier examination for recruitment to the Indian Civil Service.",
    foundedYear: 1926,
    headquarters: "New Delhi, India",
    website: "https://upsc.gov.in",
    linkedin: "",
    twitter: "https://twitter.com/upsc_ias",
    companySize: "Government of India",
    industry: "Government Recruitment",
    culture: "Merit-based selection, transparency, and fairness in the recruitment process. UPSC is committed to finding the best talent.",
    benefits: "Government salary, Pension, Health insurance, Subsidized accommodation, Leave benefits, Family pension",
    type: "government",
  },
  {
    name: "SSC (Staff Selection Commission)",
    logoUrl: "https://ssc.nic.in/staticfiles/img/logo.png",
    primaryColor: "#FF9933", // Saffron
    secondaryColor: "#128807", // Green
    description: "SSC is responsible for conducting examinations for recruitment to various posts under the Government of India.",
    foundedYear: 1975,
    headquarters: "New Delhi, India",
    website: "https://ssc.nic.in",
    linkedin: "",
    twitter: "",
    companySize: "Government of India",
    industry: "Government Recruitment",
    culture: "Ensuring fair and transparent recruitment. SSC is dedicated to finding qualified candidates for government positions.",
    benefits: "Government salary, Pension scheme, Medical benefits, Housing facility, Leave encashment, Family pension",
    type: "government",
  },
  {
    name: "IBPS (Institute of Banking Personnel Selection)",
    logoUrl: "https://www.ibps.in/themes/new/img/logo.png",
    primaryColor: "#0066CC", // Blue
    secondaryColor: "#FF6600", // Orange
    description: "IBPS conducts examinations for recruitment to Probationary Officers and Clerks in Public Sector Banks.",
    foundedYear: 1975,
    headquarters: "Mumbai, India",
    website: "https://www.ibps.in",
    linkedin: "",
    twitter: "https://twitter.com/IbpsOnline",
    companySize: "Public Sector Banks",
    industry: "Banking Recruitment",
    culture: "Banking sector recruitment through fair and transparent examination process.",
    benefits: "Bank salary, Pension, Medical benefits, Housing loans, Leave benefits, Family pension",
    type: "government",
  },
  {
    name: "RRB (Railway Recruitment Board)",
    logoUrl: "https://www.rrbonline.gov.in/assets/images/rrc_logo.png",
    primaryColor: "#C1272D", // Red
    secondaryColor: "#FFFFFF", // White
    description: "RRB conducts examinations for recruitment to various positions in Indian Railways.",
    foundedYear: 1998,
    headquarters: "New Delhi, India",
    website: "https://www.rrbonline.gov.in",
    linkedin: "",
    twitter: "",
    companySize: "Indian Railways",
    industry: "Railway Recruitment",
    culture: "Merit-based recruitment for building India's railway workforce.",
    benefits: "Railway salary, Pension benefits, Medical facilities, Pass privileges, Leave benefits, Family pension",
    type: "government",
  },
  {
    name: "KPSC (Karnataka Public Service Commission)",
    logoUrl: "https://www.kpsc.kar.gov.in/english/images/kpsc_logo.png",
    primaryColor: "#FF9933", // Saffron
    secondaryColor: "#128807", // Green
    description: "KPSC conducts examinations for recruitment to state services in Karnataka.",
    foundedYear: 1951,
    headquarters: "Bangalore, Karnataka",
    website: "https://www.kpsc.kar.gov.in",
    linkedin: "",
    twitter: "",
    companySize: "Government of Karnataka",
    industry: "State Government Recruitment",
    culture: "Transparent and fair recruitment process for Karnataka state services.",
    benefits: "State government salary, Pension, Health benefits, Housing facilities, Leave benefits, Family pension",
    type: "government",
  },
  // Additional Major Tech Companies
  {
    name: "IBM",
    logoUrl: "https://www.ibm.com/favicon.ico",
    primaryColor: "#0F62FE", // Blue
    secondaryColor: "#161616", // Dark gray
    description: "IBM is a global technology and consulting company providing cloud computing, AI, and enterprise services.",
    foundedYear: 1911,
    headquarters: "Armonk, New York",
    website: "https://www.ibm.com/careers",
    linkedin: "https://linkedin.com/company/ibm",
    twitter: "https://twitter.com/IBM",
    companySize: "283,000+ employees",
    industry: "Technology & IT Services",
    culture: "Think, trusted innovation, commitment to excellence and social responsibility.",
    benefits: "Competitive salary, Comprehensive benefits, 401(k), Stock awards, Paid time off, Health & wellness, Professional development",
    type: "corporate",
  },
  {
    name: "Oracle",
    logoUrl: "https://www.oracle.com/favicon.ico",
    primaryColor: "#F80000", // Red
    secondaryColor: "#FFFFFF", // White
    description: "Oracle is the global leader in database technology and cloud services for enterprise.",
    foundedYear: 1977,
    headquarters: "Austin, Texas",
    website: "https://www.oracle.com/careers",
    linkedin: "https://linkedin.com/company/oracle",
    twitter: "https://twitter.com/oracle",
    companySize: "148,000+ employees",
    industry: "Enterprise Software & Services",
    culture: "Database expertise, cloud innovation, and customer success. We attract creative problem solvers.",
    benefits: "Competitive compensation, Health coverage, 401(k) matching, Stock options, Paid leave, Learning opportunities, Wellness",
    type: "corporate",
  },
  {
    name: "Cisco",
    logoUrl: "https://www.cisco.com/favicon.ico",
    primaryColor: "#1BA0D7", // Blue
    secondaryColor: "#FFFFFF", // White
    description: "Cisco designs and manufactures networking equipment used in the internet and computer networks worldwide.",
    foundedYear: 1984,
    headquarters: "San Jose, California",
    website: "https://jobs.cisco.com",
    linkedin: "https://linkedin.com/company/cisco",
    twitter: "https://twitter.com/Cisco",
    companySize: "84,000+ employees",
    industry: "Networking & Cybersecurity",
    culture: "Innovation in networking, commitment to diversity, and powering an inclusive future.",
    benefits: "Competitive salary, Health/dental/vision insurance, 401(k), Stock awards, Paid time off, Wellness programs",
    type: "corporate",
  },
  {
    name: "Intel",
    logoUrl: "https://www.intel.com/favicon.ico",
    primaryColor: "#0071C5", // Blue
    secondaryColor: "#FFFFFF", // White
    description: "Intel designs and manufactures semiconductor technology used in computers, servers, and data centers.",
    foundedYear: 1968,
    headquarters: "Santa Clara, California",
    website: "https://www.intel.com/content/www/us/en/careers/careers-home.html",
    linkedin: "https://linkedin.com/company/intel",
    twitter: "https://twitter.com/intel",
    companySize: "114,600+ employees",
    industry: "Semiconductor Manufacturing",
    culture: "Innovation through advanced technology, customer focus, and operational excellence.",
    benefits: "Competitive compensation, Excellent health coverage, 401(k), Stock awards, Paid leave, Professional development",
    type: "corporate",
  },
  {
    name: "Dell Technologies",
    logoUrl: "https://www.delltechnologies.com/favicon.ico",
    primaryColor: "#007DB8", // Blue
    secondaryColor: "#FFFFFF", // White
    description: "Dell Technologies is a global technology company providing infrastructure, software and services.",
    foundedYear: 1984,
    headquarters: "Round Rock, Texas",
    website: "https://www.delltechnologies.com/en-us/careers/home.htm",
    linkedin: "https://linkedin.com/company/dell",
    twitter: "https://twitter.com/Dell",
    companySize: "165,000+ employees",
    industry: "Computer Hardware & Services",
    culture: "Customer-centric, driving innovation, and creating a diverse and inclusive workplace.",
    benefits: "Competitive salary, Health insurance, 401(k) match, Stock options, Paid time off, Wellness programs",
    type: "corporate",
  },
];

export async function seedCompanies(db: any) {
  for (const company of companiesBrandingData) {
    await db
      .insert(companiesTable)
      .values(company)
      .onConflictDoUpdate({
        target: companiesTable.name,
        set: company,
      });
  }
  console.log(`✅ Seeded ${companiesBrandingData.length} companies`);
}
