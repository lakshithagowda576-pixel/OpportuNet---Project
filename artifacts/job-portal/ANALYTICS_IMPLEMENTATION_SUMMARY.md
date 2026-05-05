# Analytics Implementation Summary

## Overview

Complete analytics event tracking has been implemented across the OpportuNet job portal application. The system tracks user interactions, application events, and administrative actions to provide insights into platform usage and user behavior.

## Architecture

### Components

1. **Frontend Analytics Utility** (`/src/lib/analytics.ts`)
   - `trackEvent()` function: Sends events to backend
   - `AnalyticsEventPayload` interface: Type-safe event structure
   - Automatic error handling and silent failures

2. **Backend Analytics Routes** (`/api-server/src/routes/analytics.ts`)
   - POST `/api/analytics/events`: Receives and stores events
   - Event validation and sanitization
   - Database persistence

3. **Database Schema** (`/lib/db/src/schema/analytics.ts`)
   - `analytics_events` table
   - Stores event type, category, action, metadata, timestamps
   - User context (IP, session, user ID)

### Event Flow

```
User Action
    ↓
Frontend Component/Page
    ↓
trackEvent() called
    ↓
POST /api/analytics/events
    ↓
Backend Route Handler
    ↓
Database Storage
    ↓
Analytics Dashboard (future)
```

## Implemented Event Types

### Page View Events
- **Dashboard** (`page_view`)
  - Metadata: jobCount, applicationCount
  
- **Profile** (`page_view`)
  - No additional metadata required
  
- **Job Details** (`page_view`)
  - Metadata: jobId, company, category
  
- **Job Directory** (`page_view`)
  - No additional metadata
  
- **Login** (`page_view`)
  - No additional metadata
  
- **Application Tracker** (`page_view`)
  - No additional metadata
  
- **Job Alerts** (`page_view`)
  - No additional metadata
  
- **Company Reviews** (`page_view`)
  - Metadata: companyId
  
- **Apply Page** (`application_page_view`)
  - Metadata: jobId, company, category
  
- **Admin Panel** (`page_view`)
  - Metadata: userRole

### Authentication Events
- **User Login** (`user_login`)
  - Metadata: email
  - Triggered on successful email/password login

### Job Interaction Events
- **Job Viewed** (`job_viewed`)
  - Metadata: jobId, company, category
  - Triggered when viewing job details

- **Job Details Viewed** (`job_details_viewed`)
  - Metadata: jobId, company, category
  - Triggered when opening modal from job card

- **Job Saved** (`job_saved`)
  - Metadata: jobId, company
  - Triggered when saving job to favorites

- **Job Apply Clicked** (`job_apply_clicked`)
  - Metadata: jobId, company, category, status
  - Status can be: "open", "closed", "future"

### Application Events
- **Application Submitted** (`application_submitted`)
  - Metadata: jobId, company, applicantEmail
  - Triggered on successful submission

- **Profile Updated** (`profile_update`)
  - Metadata: name, email
  - Triggered on profile save

### Search and Filter Events
- **Job Search** (`job_search`)
  - Metadata: query
  - Triggered on search input change

- **Filter Applied - Category** (`filter_applied`)
  - Metadata: category
  - Triggered on category selection

- **Filter Applied - Month** (`filter_applied`)
  - Metadata: month
  - Triggered on month filter change

### Review Events
- **Review Submitted** (`review_submitted`)
  - Metadata: companyId, rating, isAnonymous
  - Triggered on review submission

- **Review Voted** (`review_voted`)
  - Metadata: reviewId, voteType
  - Triggered on helpful/unhelpful vote

### Job Alert Events
- **Alert Created** (`alert_created`)
  - Metadata: categories, frequency
  - Triggered on new alert creation

- **Alert Deleted** (`alert_deleted`)
  - No additional metadata
  - Triggered on alert deletion

- **Alert Updated** (`alert_updated`)
  - Metadata: categories
  - Triggered on category toggle

### Admin Events
- **Application Status Changed** (`application_status_changed`)
  - Metadata: applicationId, newStatus
  - Triggered on admin status update

- **Email Sent** (`email_sent`)
  - Metadata: recipientEmail
  - Triggered on email submission

- **HR Email Added** (`hr_email_added`)
  - Metadata: email, label
  - Triggered on HR email creation

- **HR Email Deleted** (`hr_email_deleted`)
  - No additional metadata
  - Triggered on HR email deletion

- **Admin Tab Changed** (`admin_tab_changed`)
  - Metadata: activeTab
  - Triggered on tab selection

## Integration Details

### Pages with Analytics

| Page | Location | Events |
|------|----------|--------|
| Dashboard | `/dashboard` | page_view |
| Profile | `/profile` | page_view, profile_update |
| Job Details | `/jobs/:id` | job_viewed, application_submitted |
| Apply Page | `/apply/:jobId` | application_page_view |
| Login | `/login` | page_view, user_login |
| Job Directory | `/jobs` | page_view, job_search, filter_applied |
| Job Applications | `/jobs/:id/applications` | page_view |
| Application Tracker | `/tracker` | page_view |
| Company Reviews | `/company/:id/reviews` | page_view, review_submitted, review_voted |
| Job Alerts | `/alerts` | page_view, alert_created, alert_deleted, alert_updated |
| Admin Panel | `/admin` | page_view, admin_tab_changed, application_status_changed, email_sent, hr_email_added, hr_email_deleted |

### Components with Analytics

| Component | Events |
|-----------|--------|
| JobCard | job_details_viewed, job_saved, job_apply_clicked |

## Event Payload Structure

```typescript
interface AnalyticsEventPayload {
  eventType: string;           // Required: Event identifier
  eventCategory?: string;      // Optional: Event category
  eventAction: string;         // Required: Event action
  eventLabel?: string;         // Optional: Additional label
  eventValue?: number;         // Optional: Numeric value
  page?: string;               // Optional: Page/route path
  route?: string;              // Optional: Route identifier
  metadata?: Record<string, unknown>; // Optional: Custom data
}
```

## API Endpoint

**POST** `/api/analytics/events`

### Request
```json
{
  "eventType": "page_view",
  "eventCategory": "Dashboard",
  "eventAction": "view",
  "page": "/dashboard",
  "metadata": {
    "jobCount": 42,
    "applicationCount": 5
  }
}
```

### Response
```json
{
  "success": true,
  "eventId": "uuid-here"
}
```

## Database Schema

### analytics_events Table
```sql
CREATE TABLE analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(255) NOT NULL,
  event_category VARCHAR(255),
  event_action VARCHAR(255) NOT NULL,
  event_label VARCHAR(255),
  event_value INTEGER,
  page VARCHAR(512),
  route VARCHAR(512),
  metadata JSONB,
  user_id INTEGER,
  session_id VARCHAR(255),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX event_type_idx (event_type),
  INDEX created_at_idx (created_at),
  INDEX user_id_idx (user_id)
);
```

## Usage Examples

### Tracking a Page View
```typescript
import { trackEvent } from "@/lib/analytics";

useEffect(() => {
  trackEvent({
    eventType: "page_view",
    eventCategory: "Dashboard",
    eventAction: "view",
    page: "/dashboard",
    metadata: { jobCount, applicationCount },
  });
}, []);
```

### Tracking User Actions
```typescript
const handleApplyClick = () => {
  trackEvent({
    eventType: "job_apply_clicked",
    eventCategory: "Application",
    eventAction: "apply_click",
    metadata: { jobId, company, category, status },
  });
  // Perform action...
};
```

### Tracking with Metadata
```typescript
const handleSubmit = async () => {
  const response = await submitApplication(data);
  if (response.ok) {
    trackEvent({
      eventType: "application_submitted",
      eventCategory: "Application",
      eventAction: "submit",
      page: `/jobs/${jobId}`,
      metadata: {
        jobId,
        company: job?.company,
        applicantEmail: user.email,
      },
    });
  }
};
```

## Error Handling

The analytics system implements silent failures to avoid disrupting user experience:

```typescript
export async function trackEvent(payload: AnalyticsEventPayload) {
  try {
    await fetch(`${BASE}/api/analytics/events`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.warn("Analytics trackEvent failed:", error);
    // Silently fail - don't interrupt user workflow
  }
}
```

## Testing

### Unit Tests
Located in: `/src/__tests__/analytics.test.ts`

Run tests:
```bash
npm run test -- analytics.test.ts
```

### Manual Testing
Complete testing checklist: `ANALYTICS_TESTING_GUIDE.md`

Key verification points:
1. Events appear in Network tab
2. Correct payload structure
3. Database persistence
4. Error handling
5. Performance metrics

## Monitoring and Analytics

### Key Metrics to Track
- Total events per day
- Events by type distribution
- User engagement patterns
- Application funnel conversion
- Job search behavior
- Admin action frequency

### Sample Queries

```sql
-- Events in last 24 hours
SELECT COUNT(*) FROM analytics_events 
WHERE created_at > NOW() - INTERVAL 1 DAY;

-- Most viewed job categories
SELECT metadata->>'category' as category, COUNT(*) 
FROM analytics_events 
WHERE event_type = 'job_viewed' 
GROUP BY category 
ORDER BY COUNT(*) DESC;

-- Search queries
SELECT metadata->>'query' as query, COUNT(*) 
FROM analytics_events 
WHERE event_type = 'job_search' 
GROUP BY query 
ORDER BY COUNT(*) DESC;

-- User engagement funnel
SELECT 
  COUNT(DISTINCT CASE WHEN event_type = 'page_view' THEN user_id END) as page_views,
  COUNT(DISTINCT CASE WHEN event_type = 'job_viewed' THEN user_id END) as job_views,
  COUNT(DISTINCT CASE WHEN event_type = 'application_submitted' THEN user_id END) as applications
FROM analytics_events;
```

## Deployment Checklist

Before deploying to production:

- [ ] Database migrations run successfully
- [ ] Analytics endpoint tested
- [ ] Error handling verified
- [ ] Privacy policy updated
- [ ] Data retention policy defined
- [ ] GDPR compliance verified
- [ ] Performance impact assessed
- [ ] Monitoring and alerts configured

## Privacy Considerations

The analytics system collects minimal personally identifiable information:
- User ID (when authenticated)
- IP Address
- User Agent
- Event data with optional metadata

Sensitive data (passwords, payment info) are NOT collected.

## Future Enhancements

1. **Analytics Dashboard**
   - Real-time event visualization
   - Funnel analysis
   - User journey tracking

2. **Advanced Segmentation**
   - User cohort analysis
   - Behavior clustering
   - Anomaly detection

3. **Event Batching**
   - Batch multiple events for efficiency
   - Offline event queueing

4. **Retention Policies**
   - Configurable data retention
   - Automatic data archival
   - Compliance reporting

5. **Integration**
   - Google Analytics integration
   - Custom BI tool integration
   - Real-time alerting

## Support

For questions or issues with analytics implementation:
1. Check `ANALYTICS_TESTING_GUIDE.md`
2. Review event payload in DevTools Network tab
3. Check database for event storage
4. Verify backend route logs
5. Contact development team
