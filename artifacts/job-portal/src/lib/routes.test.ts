import { describe, expect, it } from 'vitest';
import { buildJobApplyRoute, buildJobApplicationsRoute, buildJobRoute, buildExamApplyRoute, normalizeExternalLink, buildExternalLink } from './routes';

describe('route helpers', () => {
  it('builds a valid job detail route for positive ids', () => {
    expect(buildJobRoute(42)).toBe('/jobs/42');
    expect(buildJobRoute('42')).toBe('/jobs/42');
  });

  it('returns null for invalid ids so the UI avoids broken links', () => {
    expect(buildJobRoute(null)).toBeNull();
    expect(buildJobRoute(undefined)).toBeNull();
    expect(buildJobRoute('')).toBeNull();
    expect(buildJobRoute('abc')).toBeNull();
    expect(buildJobRoute(0)).toBeNull();
  });

  it('builds apply and applications routes from a valid job id', () => {
    expect(buildJobApplyRoute(7)).toBe('/jobs/7/apply');
    expect(buildJobApplicationsRoute(7)).toBe('/jobs/7/applications');
  });

  it('builds a valid exam apply route from a positive exam id', () => {
    expect(buildExamApplyRoute(11)).toBe('/exams/11/apply');
    expect(buildExamApplyRoute('11')).toBe('/exams/11/apply');
    expect(buildExamApplyRoute('invalid')).toBeNull();
  });

  it('normalizes bare government portal domains into valid external links', () => {
    expect(normalizeExternalLink('www.isro.gov.in/careers')).toBe('https://www.isro.gov.in/careers');
    expect(normalizeExternalLink('cetonline.karnataka.gov.in/kea/')).toBe('https://cetonline.karnataka.gov.in/kea/');
    expect(normalizeExternalLink('https://kea.kar.nic.in')).toBe('https://kea.kar.nic.in');
  });

  it('builds a fallback search link when no external link is provided', () => {
    const result = buildExternalLink('', 'ISRO');
    expect(result).toBe('https://www.google.com/search?q=isro%20careers%20jobs%20official%20website');
  });
});
