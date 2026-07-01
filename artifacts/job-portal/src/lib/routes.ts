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
