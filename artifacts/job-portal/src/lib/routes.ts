export function buildJobRoute(jobId: number | string | null | undefined) {
  const normalizedId = typeof jobId === 'string' ? jobId.trim() : jobId;
  if (normalizedId === null || normalizedId === undefined || normalizedId === '') {
    return null;
  }

  const id = Number(normalizedId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return `/jobs/${id}`;
}

export function buildJobApplyRoute(jobId: number | string | null | undefined) {
  const jobRoute = buildJobRoute(jobId);
  return jobRoute ? `${jobRoute}/apply` : null;
}

export function buildJobApplicationsRoute(jobId: number | string | null | undefined) {
  const jobRoute = buildJobRoute(jobId);
  return jobRoute ? `${jobRoute}/applications` : null;
}

export function buildExamApplyRoute(examId: number | string | null | undefined) {
  const normalizedId = typeof examId === 'string' ? examId.trim() : examId;
  if (normalizedId === null || normalizedId === undefined || normalizedId === '') {
    return null;
  }

  const id = Number(normalizedId);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return `/exams/${id}/apply`;
}

export function normalizeExternalLink(raw: string | null | undefined) {
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) {
    return null;
  }

  if (/^(https?:)?\/\//i.test(value)) {
    return value.startsWith('//') ? `https:${value}` : value;
  }

  if (/^[a-zA-Z][a-zA-Z\d+.-]*:/i.test(value)) {
    return value;
  }

  if (value.startsWith('/')) {
    return null;
  }

  return `https://${value}`;
}

export function buildSearchFallbackUrl(companyName: string | null | undefined) {
  const company = typeof companyName === 'string' ? companyName.trim() : '';
  if (!company) {
    return null;
  }

  const cleanCompany = company.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  return `https://www.google.com/search?q=${encodeURIComponent(`${cleanCompany} careers jobs official website`)}`;
}

export function buildExternalLink(raw: string | null | undefined, fallbackCompany?: string | null) {
  return normalizeExternalLink(raw) ?? buildSearchFallbackUrl(fallbackCompany);
}
