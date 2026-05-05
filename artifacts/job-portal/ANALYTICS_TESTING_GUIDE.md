# Analytics Integration Testing Checklist

## End-to-End Testing Guide

This document outlines the manual steps to verify analytics event tracking is working correctly across the application.

### Prerequisites
- Application running locally (dev server)
- Browser DevTools open (F12)
- Access to admin panel (optional, for advanced testing)
- Database access to verify events are stored

### Test Execution Steps

#### 1. Page View Events Testing

**Dashboard Page**
- [ ] Navigate to `/dashboard`
- [ ] Open DevTools → Network tab
- [ ] Check for POST request to `/api/analytics/events`
- [ ] Verify payload includes:
  - `eventType: "page_view"`
  - `eventCategory: "Dashboard"`
  - `page: "/dashboard"`
  - `metadata.jobCount`
  - `metadata.applicationCount`

**Profile Page**
- [ ] Navigate to `/profile`
- [ ] Check for analytics event in Network tab
- [ ] Verify `eventCategory: "Profile"`

**Job Directory**
- [ ] Navigate to `/jobs`
- [ ] Check for page_view event
- [ ] Verify `eventCategory: "JobsDirectory"`

**Job Details**
- [ ] Click on any job from the directory
- [ ] Check for `job_viewed` event
- [ ] Verify metadata includes `jobId`, `company`, `category`

**Admin Panel** (requires admin/hr role)
- [ ] Navigate to `/admin`
- [ ] Check for admin page_view event
- [ ] Verify `userRole` in metadata

#### 2. Authentication Events Testing

**Login Flow**
- [ ] Navigate to `/login`
- [ ] Check for page_view event
- [ ] Enter email and password, submit
- [ ] Look for `user_login` event
- [ ] Verify email is included in metadata

#### 3. Job Interaction Events Testing

**View Job Details Modal**
- [ ] From job directory, click the "eye" icon on any job card
- [ ] Check for `job_details_viewed` event
- [ ] Verify metadata includes job information

**Save Job**
- [ ] Click "☆ Save" button on job card
- [ ] Check for `job_saved` event
- [ ] Verify button changes to "⭐ Saved" and event is sent

**Apply for Job**
- [ ] Click "Apply Now" button (or "Pre-Register" for future jobs)
- [ ] Check for `job_apply_clicked` event
- [ ] Verify status metadata (`open`, `closed`, `future`)

#### 4. Application Events Testing

**Submit Application**
- [ ] Complete and submit a job application
- [ ] Check for `application_submitted` event
- [ ] Verify metadata includes `jobId`, `company`, `applicantEmail`

**Update Profile**
- [ ] Navigate to profile page
- [ ] Edit profile information
- [ ] Save changes
- [ ] Check for `profile_update` event
- [ ] Verify metadata includes edited fields

#### 5. Search & Filter Events Testing

**Job Search**
- [ ] Go to `/jobs`
- [ ] Enter search query (e.g., "engineer")
- [ ] Check for `job_search` event
- [ ] Verify `query` in metadata

**Category Filter**
- [ ] Click on a category filter (IT, NON_IT, etc.)
- [ ] Check for `filter_applied` event
- [ ] Verify `category` in metadata

**Month Filter**
- [ ] Select a month from the dropdown
- [ ] Check for `filter_applied` event
- [ ] Verify `month` in metadata

#### 6. Review Events Testing

**Submit Review**
- [ ] Navigate to company reviews page
- [ ] Fill out review form
- [ ] Submit review
- [ ] Check for `review_submitted` event
- [ ] Verify metadata includes `rating`, `isAnonymous`

**Vote on Review**
- [ ] Click "helpful" or "unhelpful" on a review
- [ ] Check for `review_voted` event
- [ ] Verify `voteType` in metadata

#### 7. Job Alert Events Testing

**Create Alert**
- [ ] Navigate to `/alerts`
- [ ] Fill out new alert form
- [ ] Submit form
- [ ] Check for `alert_created` event
- [ ] Verify metadata includes `categories`, `frequency`

**Delete Alert**
- [ ] Click delete button on an existing alert
- [ ] Check for `alert_deleted` event

**Update Alert Categories**
- [ ] Toggle categories on an alert
- [ ] Check for `alert_updated` event
- [ ] Verify updated categories in metadata

#### 8. Admin Events Testing (Admin Role Required)

**Change Application Status**
- [ ] Go to Admin → Applications tab
- [ ] Click status dropdown on any application
- [ ] Select new status
- [ ] Check for `application_status_changed` event
- [ ] Verify `applicationId` and `newStatus` in metadata

**Send Email**
- [ ] In admin panel, compose and send an email
- [ ] Check for `email_sent` event
- [ ] Verify recipient email in metadata

**Add HR Email**
- [ ] Go to Admin → HR Emails tab
- [ ] Add new HR email
- [ ] Check for `hr_email_added` event
- [ ] Verify `email`, `label` in metadata

**Change Admin Tab**
- [ ] Switch between admin tabs (Dashboard, Applications, etc.)
- [ ] Check for `admin_tab_changed` event
- [ ] Verify `activeTab` in metadata

### Database Verification

After running through manual tests, verify events were stored:

```sql
-- Check total events recorded
SELECT COUNT(*) as total_events FROM analytics_events;

-- Count events by type
SELECT event_type, COUNT(*) FROM analytics_events GROUP BY event_type;

-- Count events by category
SELECT event_category, COUNT(*) FROM analytics_events GROUP BY event_category;

-- View recent events
SELECT * FROM analytics_events ORDER BY created_at DESC LIMIT 20;

-- Check for errors in event tracking
SELECT * FROM analytics_events WHERE created_at > NOW() - INTERVAL '1 hour' ORDER BY created_at DESC;
```

### Debugging Tips

**Events not appearing in Network tab:**
- Check if BASE_URL is correctly configured
- Verify `/api/analytics/events` endpoint exists
- Check browser console for errors

**Events showing error in Network tab:**
- Verify request credentials (`credentials: "include"`)
- Check Content-Type header is `application/json`
- Ensure payload structure matches AnalyticsEventPayload interface
- Check backend error logs

**Events appearing in Network but not in database:**
- Verify backend route handler processes events correctly
- Check database schema for `analytics_events` table
- Verify INSERT permissions

**Performance Issues:**
- Check if API endpoint has proper indexing
- Consider implementing request batching for high-traffic scenarios
- Monitor database query performance

### Test Results Template

```markdown
## Analytics Integration Test Results - [DATE]

### Environment
- OS: [Windows/Mac/Linux]
- Browser: [Chrome/Firefox/Safari]
- App Version: [commit hash or version]

### Test Coverage
- Page View Events: ✅ / ❌
- Authentication Events: ✅ / ❌
- Job Interaction Events: ✅ / ❌
- Application Events: ✅ / ❌
- Search & Filter Events: ✅ / ❌
- Review Events: ✅ / ❌
- Job Alert Events: ✅ / ❌
- Admin Events: ✅ / ❌

### Issues Found
- [Issue 1]
- [Issue 2]

### Performance Metrics
- Average event transmission time: [X]ms
- Network requests per session: [X]
- Database query time: [X]ms

### Notes
[Additional observations]
```

### Automation Testing

Run automated tests with:
```bash
npm run test -- analytics.test.ts
```

Verify test suite includes:
- Event payload structure validation
- Mock API endpoint testing
- Error handling scenarios
- Network failure recovery

### Continuous Monitoring

After deployment:
1. Monitor analytics event volume daily
2. Set up alerts for event submission failures
3. Track event latency metrics
4. Review event data for anomalies
5. Validate data accuracy against user actions
