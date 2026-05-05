# OpportuNet Enhancement Roadmap & Implementation Guide

## Executive Summary

This document outlines 9 proposed enhancements for OpportuNet, prioritized by impact, complexity, and dependencies. The roadmap spans a 12-18 month development cycle with three phases: Quick Wins (Months 1-3), Core Features (Months 4-9), and Advanced Features (Months 10-18).

---

## Feature Prioritization Matrix

| # | Feature | Impact | Complexity | Timeline | Phase | Priority |
|---|---------|--------|-----------|----------|-------|----------|
| 1 | Dark Mode & Theme Customization | Medium | Low | 2-3 weeks | Phase 1 | **P1** |
| 2 | Job Alert Subscriptions & Email Digests | High | Medium | 4-6 weeks | Phase 1 | **P1** |
| 3 | Company Ratings & Reviews | High | Medium | 6-8 weeks | Phase 1 | **P2** |
| 4 | Multi-language Support | High | High | 8-12 weeks | Phase 2 | **P2** |
| 5 | Resume Parsing & Auto-fill Forms | Very High | High | 8-10 weeks | Phase 2 | **P1** |
| 6 | Live Job Data Integration | Very High | Very High | 10-14 weeks | Phase 2 | **P1** |
| 7 | Advanced Analytics Dashboard | Medium | Medium | 6-8 weeks | Phase 2 | **P2** |
| 8 | Mobile Application Development | Very High | Very High | 12-16 weeks | Phase 3 | **P2** |
| 9 | Blockchain Credential Verification | Low | Very High | 10-12 weeks | Phase 3 | **P3** |

---

## Phase 1: Quick Wins (Months 1-3)
**Goal:** Build momentum, improve user experience, increase engagement

### 1.1 Dark Mode & Theme Customization (2-3 weeks)
**Impact:** High user satisfaction, low effort

#### Technical Approach:
- **Frontend:** Use CSS custom properties (variables) and Tailwind CSS themes
- **Storage:** Save theme preference to localStorage and user profile
- **Implementation:**
  - Create theme context provider in React
  - Define color palettes for light/dark modes
  - Add theme toggle in navigation
  - Store preference in user settings table

#### Tech Stack:
- React Context API or Zustand for state management
- TailwindCSS with dark mode configuration
- Next.js theme support

#### Effort Estimate:
- Frontend: 60 hours
- Backend (user preferences): 20 hours
- Testing: 20 hours
- **Total: 100 hours (~2.5 weeks, 1 developer)**

#### Dependencies:
- None (independent feature)

---

### 1.2 Job Alert Subscriptions & Email Digests (4-6 weeks)
**Impact:** Very high engagement and retention

#### Technical Approach:
- **Job Alert System:**
  - Create JobAlert table with user_id, filters (category, location, salary_range, keywords), frequency
  - Implement cron job that runs daily/weekly
  - Query jobs matching alert criteria and group by user
  - Generate and send email digests

- **Email Service:**
  - Use SendGrid, Mailgun, or AWS SES
  - HTML email templates with job previews
  - Unsubscribe links and preference management

- **Database Schema Additions:**
```sql
CREATE TABLE job_alerts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name VARCHAR(255),
  filters JSONB {
    categories: string[],
    locations: string[],
    min_salary: number,
    max_salary: number,
    keywords: string[]
  },
  frequency ENUM ('daily', 'weekly'),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE alert_emails_sent (
  id UUID PRIMARY KEY,
  alert_id UUID,
  sent_at TIMESTAMP,
  job_count INTEGER,
  FOREIGN KEY (alert_id) REFERENCES job_alerts(id)
);
```

#### Implementation Steps:
1. Create JobAlert CRUD endpoints
2. Build email template system
3. Create cron job scheduler (node-cron or bull queue)
4. Implement email sending with retry logic
5. Add UI for alert management in job portal
6. Track unsubscribes and preferences

#### Tech Stack:
- Database: Drizzle ORM (extend existing)
- Email: SendGrid or AWS SES
- Task Queue: Bull/Redis for reliable job scheduling
- Email Templates: Handlebars or ETA

#### Effort Estimate:
- Backend (API + scheduler): 80 hours
- Frontend (UI components): 40 hours
- Email templates & design: 20 hours
- Testing & DevOps (cron setup): 30 hours
- **Total: 170 hours (~4 weeks, 1-2 developers)**

#### Dependencies:
- Email service account setup
- Redis/queue infrastructure

---

### 1.3 Company Ratings & Reviews (6-8 weeks)
**Impact:** High - builds trust, increases engagement

#### Technical Approach:
- **Review System:**
  - Users can rate companies (1-5 stars)
  - Write text reviews (interview experience, salary, culture)
  - Rate anonymously with optional name
  - Include categories: interview process, company culture, work-life balance, salary, management

- **Trust & Moderation:**
  - Verified badge for users who applied through platform
  - Admin moderation queue for inappropriate content
  - Upvote/downvote system for helpful reviews
  - Flag reviews for spam/abuse

- **Database Schema:**
```sql
CREATE TABLE company_reviews (
  id UUID PRIMARY KEY,
  company_id UUID NOT NULL,
  user_id UUID,
  rating DECIMAL(2,1),
  title VARCHAR(255),
  content TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  interview_experience_rating INT,
  culture_rating INT,
  work_life_balance_rating INT,
  salary_rating INT,
  management_rating INT,
  helpful_count INT DEFAULT 0,
  unhelpful_count INT DEFAULT 0,
  status ENUM ('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE review_votes (
  id UUID PRIMARY KEY,
  review_id UUID,
  user_id UUID,
  vote_type ENUM ('helpful', 'unhelpful'),
  created_at TIMESTAMP,
  UNIQUE(review_id, user_id),
  FOREIGN KEY (review_id) REFERENCES company_reviews(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Implementation Steps:
1. Create review database schema
2. Build review CRUD endpoints with moderation
3. Create review display UI component
4. Implement upvote/downvote system
5. Create admin moderation dashboard
6. Add rating aggregation (average stars)
7. Search and filter reviews by rating/date

#### Tech Stack:
- Backend: Express/NestJS endpoints
- Frontend: React components with star rating library
- Moderation: Queue system for review approval workflow

#### Effort Estimate:
- Backend (CRUD + moderation): 90 hours
- Frontend (review components + display): 60 hours
- Admin dashboard: 40 hours
- Testing: 30 hours
- **Total: 220 hours (~5.5 weeks, 2 developers)**

#### Dependencies:
- Company entity fully established in database
- User authentication/verification system

---

## Phase 2: Core Features (Months 4-9)
**Goal:** Enable major user workflows, data integration, multi-platform access

### 2.1 Resume Parsing & Auto-fill Forms (8-10 weeks)
**Impact:** Very high - dramatically improves user experience (80% time reduction)

#### Technical Approach:

**Option A: Third-party Service (Recommended for MVP)**
- Use pdfjs-extract or docx library for parsing
- NLP services: Google Cloud Vision, AWS Textract, or Azure Form Recognizer
- Server-side parsing: safer, more reliable

**Option B: Client-side Parsing (Budget-conscious)**
- Use pdf-parse, docx, or pdfjs for file reading
- Local NLP using TensorFlow.js (lightweight models)
- Send extracted data to backend

**Recommended: Hybrid Approach**
- Client: Extract text from PDF/DOCX
- Server: Use AWS Textract or Google Cloud Vision for structured extraction
- Store parsed data in user profile

#### Resume Data Model:
```typescript
interface ParsedResume {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedinUrl?: string;
    portfolio?: string;
  };
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationYear: number;
  }>;
  experience: Array<{
    company: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: Array<{
    name: string;
    proficiency: 'beginner' | 'intermediate' | 'expert';
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}
```

#### Implementation Steps:
1. Create resume upload endpoint with file validation
2. Implement text extraction from PDF/DOCX
3. Build NLP parsing pipeline using third-party service
4. Store parsed data in user profile
5. Create form auto-fill logic
6. Build UI for resume upload and review
7. Allow manual editing of extracted data

#### Tech Stack:
- Backend: pdfjs-dist, docx-parser, AWS Textract/Google Vision API
- Frontend: React file upload component, form auto-fill logic
- Database: Extend user profile schema

#### Effort Estimate:
- Backend (parsing + API): 110 hours
- Frontend (upload + auto-fill): 80 hours
- Testing & integration: 40 hours
- **Total: 230 hours (~5-6 weeks, 2 developers)**

#### Dependencies:
- AWS Textract or Google Cloud Vision account & API key
- User profile schema update
- Application form schema flexibility

#### Estimated Cost:
- AWS Textract: ~$1.50 per 1000 pages
- Google Cloud Vision: ~$6.50 per 1000 images
- Azure Form Recognizer: ~$50/month for limited usage

---

### 2.2 Live Job Data Integration (10-14 weeks)
**Impact:** Very high - core platform value

#### Technical Approach:

**Data Sources Priority:**
1. **Tier 1 (Free/Low Cost):** Company career pages (web scraping)
2. **Tier 2 (API):** Adzuna API, Indeed API, LinkedIn API
3. **Tier 3 (Premium):** ZipRecruiter, Dice API

**Architecture:**
```
Data Sources (Adzuna, Indeed, etc.)
        ↓
Scheduler (Bull Queue, node-cron)
        ↓
ETL Service (Transform/normalize data)
        ↓
Database (Jobs table)
        ↓
API Layer (REST endpoints)
        ↓
Frontend (Display jobs)
```

#### Implementation Strategy:

**Phase 2.2a: Web Scraping (Weeks 1-2)**
- Implement cheerio or Puppeteer for scraping company career pages
- Store job source metadata (URL, last scraped)
- Deduplication logic
- Rate limiting & ethical scraping practices

**Phase 2.2b: Third-party API Integration (Weeks 3-5)**
- Integrate Adzuna API (most comprehensive)
- Implement data normalization layer (different APIs have different schemas)
- Build job mapping: external_id → internal job
- Sync schedules: Adzuna (hourly), Indeed (every 4 hours)

**Phase 2.2c: Job Expiration & Updates (Weeks 6-7)**
- Track job status (active, expired, filled)
- Auto-mark jobs as inactive if not found in refresh
- Notify users about job expiration
- Update job details when changes detected

**Phase 2.2d: Deduplication & Merging (Weeks 8-9)**
- Identify duplicate jobs across sources
- Merge job listings from same company
- Provide "view on multiple platforms" feature

**Phase 2.2e: Sync & Monitoring (Weeks 10-11)**
- Implement reliable job scheduler with retry logic
- Create admin dashboard for sync monitoring
- Error handling and alerts
- Database cleanup for old records

#### Database Schema Additions:
```sql
CREATE TABLE external_jobs (
  id UUID PRIMARY KEY,
  source VARCHAR(50),
  external_id VARCHAR(255),
  title VARCHAR(255),
  company_id UUID,
  location VARCHAR(255),
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  description TEXT,
  requirements TEXT,
  url VARCHAR(500),
  posted_date TIMESTAMP,
  deadline_date TIMESTAMP,
  status ENUM ('active', 'expired', 'filled') DEFAULT 'active',
  last_verified TIMESTAMP,
  sync_frequency VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE job_sync_logs (
  id UUID PRIMARY KEY,
  source VARCHAR(50),
  sync_start_time TIMESTAMP,
  sync_end_time TIMESTAMP,
  jobs_fetched INT,
  jobs_added INT,
  jobs_updated INT,
  jobs_expired INT,
  error_message TEXT,
  status ENUM ('success', 'partial', 'failed')
);

CREATE TABLE duplicate_jobs (
  id UUID PRIMARY KEY,
  primary_job_id UUID,
  duplicate_job_id UUID,
  confidence_score DECIMAL(3,2),
  FOREIGN KEY (primary_job_id) REFERENCES external_jobs(id),
  FOREIGN KEY (duplicate_job_id) REFERENCES external_jobs(id)
);
```

#### API Integrations:
```typescript
// Adzuna API
const adzunaAPI = {
  endpoint: 'https://api.adzuna.com/v1/api/jobs',
  requirements: ['API key', 'Daily rate limit: 10,000 requests'],
  costEstimate: 'Free tier available'
};

// Indeed API
const indeedAPI = {
  endpoint: 'https://api.indeed.com/ads/apisearch',
  requirements: ['Publisher ID', 'Rate limiting: 100 req/hour'],
  costEstimate: '$0.25 per qualified lead (optional)'
};
```

#### Tech Stack:
- Scheduler: Bull Queue + Redis
- Scraping: Cheerio (parsing) + Axios (HTTP) or Puppeteer (JavaScript sites)
- ETL: Custom service with data normalization
- Deduplication: Fuzzy matching library (string-similarity)
- API Clients: axios for external APIs

#### Implementation Steps:
1. Set up Bull Queue infrastructure
2. Create Adzuna API client
3. Implement data normalization service
4. Build database schema for external jobs
5. Create sync scheduler with error handling
6. Implement deduplication logic
7. Build admin dashboard for monitoring
8. Create API endpoints to query jobs
9. Update frontend to display external jobs
10. Add "Apply now" redirect for external jobs

#### Effort Estimate:
- Backend infrastructure & API clients: 120 hours
- ETL & data normalization: 90 hours
- Scheduler & sync logic: 80 hours
- Deduplication & merging: 60 hours
- Admin dashboard: 50 hours
- Frontend integration: 40 hours
- Testing & monitoring: 50 hours
- **Total: 490 hours (~12 weeks, 3-4 developers)**

#### Dependencies:
- API keys for Adzuna, Indeed, etc.
- Redis infrastructure
- Company entity fully mapped
- Rate limiting strategy defined

#### Risks:
- API rate limits (mitigate with caching)
- Data quality inconsistency (implement validation)
- Job data freshness trade-offs

---

### 2.3 Multi-language Support (8-12 weeks)
**Impact:** High - unlocks new markets

#### Technical Approach:

**Supported Languages Phase 1:**
- English (existing)
- Hindi
- Kannada
- Tamil
- Telugu

**Implementation Strategy:**

**Phase 2.3a: i18n Setup (Weeks 1-2)**
- Choose i18n framework: next-i18next or react-i18next
- Structure translation files (JSON or YAML)
- Set up language detection (browser locale, user preference)
- Implement language switcher UI

**Phase 2.3b: Static Content Translation (Weeks 2-4)**
- Translate UI strings, buttons, labels
- Translate job categories, locations
- Translate form labels and validation messages
- Translate email templates

**Phase 2.3c: Dynamic Content Translation (Weeks 4-6)**
- Set up translation pipeline for job descriptions
- Auto-translate external job data
- Create review/comment translation (optional)
- Handle RTL languages if needed

**Phase 2.3d: Database & Storage (Weeks 6-7)**
- Add language field to user profile
- Store user language preference
- Handle translation variants per language

**Phase 2.3e: Testing & QA (Weeks 7-8)**
- Linguistic testing by native speakers
- UI rendering across languages
- Deployment & monitoring

#### File Structure:
```
locales/
  en/
    common.json
    jobs.json
    auth.json
    forms.json
  hi/
    common.json
    jobs.json
    auth.json
    forms.json
  ka/
    ...
  ta/
    ...
  te/
    ...
```

#### Tech Stack:
- Frontend: next-i18next (for Next.js) or react-i18next
- Backend: Consider i18next node library
- Translation Service: Crowdin, Lokalise, or manual JSON
- Auto-translation: Google Translate API for external content

#### Implementation Steps:
1. Install and configure next-i18next
2. Create translation file structure
3. Extract all text strings to translation files
4. Implement language switcher component
5. Add user language preference to database
6. Set up auto-detection of browser locale
7. Create translation job for human translators
8. Test across all languages
9. Set up CI/CD for translation updates

#### Effort Estimate:
- i18n setup & infrastructure: 50 hours
- Text extraction & structure: 40 hours
- Frontend implementation: 60 hours
- Backend language support: 30 hours
- Translation work (external): 100-150 hours
- Testing & QA: 40 hours
- **Total: 320-370 hours (~8-10 weeks including translation)**

#### Dependencies:
- Translation resources (professional translators recommended)
- User profile schema update (language field)
- Testing with native speakers

#### Cost Considerations:
- Professional translation: $3,000-8,000 (5 languages)
- Translation management tool: $50-200/month
- Manual effort for QA: 40 hours

---

### 2.4 Advanced Analytics Dashboard for HR (6-8 weeks)
**Impact:** Medium - valuable for company partners

#### Technical Approach:

**Key Metrics:**
1. **Conversion Funnel:**
   - Job postings → Applications received
   - Applications → Interviews scheduled
   - Interviews → Offers made
   - Offers → Candidates accepted

2. **Time-to-Hire Metrics:**
   - Average days to first application
   - Time from application to first interview
   - Time from interview to offer
   - Total time-to-hire

3. **Source Tracking:**
   - Applications by job source (internal, Adzuna, Indeed, etc.)
   - Conversion rate by source
   - Best-performing sources
   - Cost-per-hire by source

4. **Predictive Analytics:**
   - Hiring trends over time
   - Seasonality patterns
   - Skill demand forecasting
   - Candidate pipeline health

#### Database Schema Additions:
```sql
CREATE TABLE application_analytics (
  id UUID PRIMARY KEY,
  company_id UUID,
  job_id UUID,
  source VARCHAR(50),
  applications_count INT,
  interviews_scheduled INT,
  offers_made INT,
  offers_accepted INT,
  interview_no_show INT,
  offer_declined INT,
  period DATE,
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE hiring_metrics (
  id UUID PRIMARY KEY,
  company_id UUID,
  metric_type VARCHAR(50),
  value DECIMAL(10,2),
  calculated_at TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);
```

#### Tech Stack:
- Charting: Chart.js, Recharts, or Plotly
- Backend: Create analytics aggregation queries
- Caching: Redis for expensive queries
- Export: PDF/CSV generation

#### Implementation Steps:
1. Create analytics schema and views
2. Build aggregation queries for metrics
3. Create API endpoints for dashboard data
4. Build dashboard UI with charts
5. Implement filtering (date range, job, source)
6. Add export functionality
7. Set up caching for performance
8. Create admin role permissions

#### Effort Estimate:
- Backend queries & API: 60 hours
- Dashboard UI & charts: 70 hours
- Data export & reporting: 30 hours
- Caching & optimization: 20 hours
- Testing: 20 hours
- **Total: 200 hours (~5 weeks, 2 developers)**

#### Dependencies:
- Application status tracking complete
- Job source metadata available
- Company role/permissions system

---

## Phase 3: Advanced Features (Months 10-18)
**Goal:** Enhance engagement, provide competitive advantages

### 3.1 Mobile Application Development (12-16 weeks)
**Impact:** Very high - expands reach, improves retention

#### Technical Approach:

**Tech Stack Options:**

**Option A: React Native (Recommended)**
- Pros: Share code with web app, faster development
- Cons: Native performance limitations
- Best for: MVP, rapid deployment
- Timeline: 12-14 weeks

**Option B: Native (Swift/Kotlin)**
- Pros: Best performance, platform features
- Cons: Longer development, more expensive
- Best for: Long-term strategy
- Timeline: 16-20 weeks

**Option C: Flutter**
- Pros: Good performance, expressive UI
- Cons: Different ecosystem
- Best for: Future-proof, growing community
- Timeline: 12-14 weeks

**Recommended: React Native for MVP, plan native ports**

#### Features:
1. **Authentication**
   - Biometric login (Face ID/Touch ID)
   - OAuth for social login
   - Secure token storage

2. **Job Browsing**
   - Search & filter jobs
   - Save jobs offline
   - Push notifications for new matches

3. **Applications**
   - One-click apply with saved profile
   - Application status tracking
   - Interview reminders

4. **Camera Integration**
   - Resume upload via camera
   - Document scanning
   - Profile photo capture

5. **Offline Access**
   - Saved jobs accessible offline
   - Application drafts
   - Cached job data

#### Architecture:
```
Mobile App (React Native)
        ↓
API Client (Shared with web)
        ↓
Existing API (Express/NestJS)
        ↓
Database
```

#### Implementation Phase:

**Phase 3.1a: Project Setup & Auth (Weeks 1-2)**
- Set up React Native project (Expo or bare)
- Implement authentication (biometric + OAuth)
- Secure token storage (react-native-keychain)

**Phase 3.1b: Core Features (Weeks 3-7)**
- Job listing screen
- Search & filter
- Job details view
- Save jobs functionality
- Offline persistence

**Phase 3.1c: Application Flow (Weeks 8-10)**
- Application submission
- Status tracking
- Push notifications
- Interview reminders

**Phase 3.1d: Advanced Features (Weeks 11-13)**
- Camera integration
- Resume upload
- Profile management
- Document scanning

**Phase 3.1e: Testing & Deployment (Weeks 14-16)**
- iOS TestFlight submission
- Android internal testing
- App Store/Play Store deployment
- Bug fixes & polish

#### Tech Stack:
- Frontend: React Native with TypeScript
- State Management: Redux or Zustand
- Navigation: React Navigation
- API: Axios or TanStack Query
- Offline: SQLite with WatermelonDB or Realm
- Push Notifications: Firebase Cloud Messaging
- Camera: React Native Camera
- Biometric: React Native Biometrics

#### Implementation Steps:
1. Set up React Native project
2. Create authentication flow (biometric + OAuth)
3. Build job listing screens
4. Implement search & filter
5. Create application form
6. Add push notification setup
7. Implement offline storage
8. Add camera integration
9. Create push notification flow
10. Test on real devices
11. Submit to app stores
12. Set up monitoring & analytics

#### Effort Estimate:
- Setup & auth: 60 hours
- Job browsing features: 100 hours
- Application flow: 80 hours
- Offline & caching: 60 hours
- Camera & documents: 40 hours
- Push notifications: 40 hours
- Testing & deployment: 80 hours
- **Total: 460 hours (~11.5 weeks, 3-4 developers)**

#### Dependencies:
- Finalized API design
- Authentication system complete
- Push notification infrastructure (Firebase)
- App Store/Play Store developer accounts

#### Estimated Costs:
- App Store developer account: $99/year
- Google Play developer account: $25 one-time
- Firebase (push, analytics): Free tier adequate
- Code signing certificates: $0 (Apple) to $9/year (Android)

#### Risks:
- App store review delays
- Platform-specific bugs
- Device fragmentation testing

---

### 3.2 Blockchain-based Credential Verification (10-12 weeks)
**Impact:** Low-Medium for MVP, high for enterprise

#### Technical Approach:

**Strategy:** Issue verifiable credentials on blockchain

**Implementation Options:**

**Option A: Self-Sovereign Identity (SSI)**
- Use W3C Verifiable Credentials standard
- Issue credentials without storing on blockchain
- Users control credentials
- Employer verifies signatures

**Option B: Ethereum/Polygon Smart Contracts**
- Store credential hashes on blockchain
- Issue NFT certificates
- Verify directly from smart contract

**Option C: Specialized Networks (Sovrin, Hyperledger)**
- Dedicated identity networks
- More privacy-focused
- Higher complexity

**Recommended: W3C Verifiable Credentials (most flexible)**

#### Implementation:

**Phase 3.2a: Setup (Weeks 1-2)**
- Choose wallet (did:key, did:web, or blockchain DID)
- Set up credential issuer
- Create credential schema

**Phase 3.2b: Issuance Flow (Weeks 3-4)**
- User verification process
- Credential generation
- Digital signature
- Issue to user wallet

**Phase 3.2c: Verification Flow (Weeks 5-6)**
- Employer views candidate credentials
- Verify signature
- Check revocation status
- Trust indicators

**Phase 3.2d: Smart Contracts (Weeks 7-9)**
- Deploy on Polygon (low cost)
- Store credential metadata
- Track revocations
- Version management

**Phase 3.2e: Integration & Testing (Weeks 10-12)**
- Web3 wallet integration (MetaMask)
- Mobile wallet support
- Testing & audit
- Documentation

#### Tech Stack:
- Credentials: Veramo or Hyperledger Indy SDK
- Blockchain: Polygon (low cost) or Ethereum
- Smart Contracts: Solidity
- Wallets: MetaMask, Brave Wallet
- DID Methods: did:key, did:polygon
- Libraries: ethers.js, web3.js

#### Database Schema:
```sql
CREATE TABLE blockchain_credentials (
  id UUID PRIMARY KEY,
  user_id UUID,
  credential_type VARCHAR(50),
  issuer_did VARCHAR(255),
  subject_did VARCHAR(255),
  credential_hash VARCHAR(255),
  transaction_hash VARCHAR(255),
  blockchain_network VARCHAR(50),
  issued_at TIMESTAMP,
  expires_at TIMESTAMP,
  revoked_at TIMESTAMP,
  credential_proof TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

#### Implementation Steps:
1. Design credential schemas
2. Set up Veramo/credential issuer
3. Create smart contract
4. Deploy to Polygon testnet
5. Build issuance UI
6. Create verification dashboard
7. Integrate wallet support
8. Test credential flow
9. Deploy to mainnet
10. Create documentation

#### Effort Estimate:
- Smart contract development: 80 hours
- Credential issuance system: 70 hours
- Verification UI: 60 hours
- Wallet integration: 50 hours
- Testing & audit: 40 hours
- Documentation: 20 hours
- **Total: 320 hours (~8 weeks, 2-3 developers)**

#### Dependencies:
- User education verification process
- Wallet support (browser extensions)
- Legal/compliance review

#### Estimated Costs:
- Smart contract audit: $3,000-10,000 (optional but recommended)
- Gas fees for deployment: ~$10-100 (testnet free)
- Mainnet gas for users: ~$0.50-2 per credential (Polygon)

#### Risks:
- Complex UX for non-technical users
- Regulatory uncertainty
- Low initial adoption (ecosystem still emerging)

---

## Implementation Roadmap Timeline

```
Month 1-3 (Phase 1):
├─ Week 1-3: Dark Mode & Theme Customization
├─ Week 4-8: Job Alert Subscriptions & Email Digests
└─ Week 6-11: Company Ratings & Reviews

Month 4-9 (Phase 2):
├─ Week 1-6: Resume Parsing & Auto-fill Forms
├─ Week 5-16: Live Job Data Integration (parallel)
├─ Week 8-12: Multi-language Support (parallel)
└─ Week 13-17: Advanced Analytics Dashboard

Month 10-18 (Phase 3):
├─ Week 1-13: Mobile Application Development
└─ Week 14-24: Blockchain Credential Verification
```

---

## Resource Allocation Recommendations

### Phase 1 (Months 1-3):
- **Team Size:** 2-3 developers
- **Frontend:** 1 developer
- **Backend:** 1-2 developers
- **QA/Testing:** 0.5 developer

### Phase 2 (Months 4-9):
- **Team Size:** 4-5 developers
- **Frontend:** 1-2 developers
- **Backend:** 2 developers
- **DevOps/Infrastructure:** 0.5 developer
- **QA/Testing:** 0.5-1 developer

### Phase 3 (Months 10-18):
- **Team Size:** 5-6 developers
- **Mobile:** 2-3 developers
- **Backend/Blockchain:** 2 developers
- **QA/Testing:** 1 developer

---

## Risk Analysis & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|-----------|-----------|
| API rate limits (external jobs) | Medium | High | Implement caching, use multiple sources |
| Third-party service outages | Medium | Medium | Graceful degradation, fallback sources |
| Resume parsing accuracy issues | Medium | Medium | Manual review option, user feedback loop |
| Mobile app store approval delays | Low | Medium | Submit early, plan buffer time |
| Blockchain adoption resistance | Low | Low | Target enterprise features first |
| Translation quality issues | Medium | Medium | Use professional translators, native testing |
| Data privacy compliance | High | Medium | GDPR/CCPA audit, privacy by design |

---

## Success Metrics

### Phase 1 Metrics:
- **Dark Mode:** 40%+ user adoption within 2 weeks
- **Job Alerts:** 25%+ of users subscribe, 20% open rate on emails
- **Company Reviews:** 500+ reviews in 3 months, 4.5+ star avg rating

### Phase 2 Metrics:
- **Resume Parsing:** 70%+ accuracy, 50%+ of applications use auto-fill
- **Live Jobs:** 50,000+ job listings, daily sync reliability >99%
- **Multi-language:** 30%+ traffic from non-English regions
- **Analytics:** 90% of partners use dashboard

### Phase 3 Metrics:
- **Mobile App:** 100K+ downloads in 6 months, 4.0+ star rating
- **Blockchain:** 1,000+ verified credentials issued

---

## Budget Estimate Summary

| Phase | Feature | Team Weeks | Cost (Internal)* | Cost (Third-party) | Total |
|-------|---------|------------|-----------------|-------------------|-------|
| 1 | Dark Mode | 2.5 | $25K | $0 | $25K |
| 1 | Job Alerts | 4 | $40K | $2K | $42K |
| 1 | Company Reviews | 5.5 | $55K | $0 | $55K |
| 2 | Resume Parsing | 5.5 | $55K | $5K | $60K |
| 2 | Live Job Data | 12 | $120K | $10K | $130K |
| 2 | Multi-language | 8 | $80K | $5K | $85K |
| 2 | Analytics Dashboard | 5 | $50K | $0 | $50K |
| 3 | Mobile App | 11.5 | $115K | $5K | $120K |
| 3 | Blockchain | 8 | $80K | $5K | $85K |
| | **TOTAL** | **61 weeks** | **$620K** | **$32K** | **$652K** |

*Based on $100/hour average developer cost

---

## Quick Start Recommendations

**If starting immediately, prioritize in this order:**

1. **Month 1-2:** Dark Mode + Job Alerts (quick wins, high engagement)
2. **Month 2-3:** Company Reviews (builds community)
3. **Month 3-6:** Resume Parsing (core UX improvement)
4. **Month 5-9:** Live Job Data (system differentiator)
5. **Month 7-10:** Multi-language (market expansion)
6. **Month 10-15:** Mobile App (scale user base)
7. **Months 15+:** Blockchain (advanced differentiator)

---

## Next Steps

1. **Validate Priorities:** Confirm with stakeholders which features align with business goals
2. **Resource Planning:** Assign teams based on phase timelines
3. **API Planning:** Finalize external API selections (Adzuna, Indeed, etc.)
4. **Infrastructure:** Prepare Redis, queue systems, email service setup
5. **Design Kickoff:** Create wireframes for new UI features
6. **Third-party Setup:** Procure API keys, email services, translation tools
7. **Start Phase 1:** Begin dark mode and job alerts implementation

---

**Document Version:** 1.0  
**Last Updated:** May 4, 2026  
**Created for:** OpportuNet Enhancement Planning
