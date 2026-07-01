import { db } from "@workspace/db";
import { examsTable, jobsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

export async function validateApplicationTarget(jobId?: number | string | null, examId?: number | string | null) {
  if (jobId != null && jobId !== "") {
    const parsedJobId = typeof jobId === "number" ? jobId : Number(jobId);
    if (!Number.isInteger(parsedJobId) || parsedJobId <= 0) {
      return { ok: false, error: "Please select a valid job." };
    }

    const [job] = await db
      .select({ id: jobsTable.id })
      .from(jobsTable)
      .where(eq(jobsTable.id, parsedJobId));

    if (!job) {
      return { ok: false, error: "The selected job is no longer available. Please choose a valid opening." };
    }
  }

  if (examId != null && examId !== "") {
    const parsedExamId = typeof examId === "number" ? examId : Number(examId);
    if (!Number.isInteger(parsedExamId) || parsedExamId <= 0) {
      return { ok: false, error: "Please select a valid exam." };
    }

    const [exam] = await db
      .select({ id: examsTable.id })
      .from(examsTable)
      .where(eq(examsTable.id, parsedExamId));

    if (!exam) {
      return { ok: false, error: "The selected exam is no longer available." };
    }
  }

  return { ok: true };
}
