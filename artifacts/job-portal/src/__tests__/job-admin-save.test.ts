import { describe, expect, it } from "vitest";
import { createJobSchema } from "@workspace/api-zod";

describe("admin job save validation", () => {
  it("accepts blank optional application links when saving a job", () => {
    const payload = {
      title: "Software Engineer",
      company: "Example Corp",
      category: "IT" as const,
      location: "Bangalore",
      shift: "Full_time" as const,
      description: "A valid job description",
      eligibility: "Bachelor's degree required",
      applicationGuide: "Apply through the official portal",
      startDate: "2026-01-01",
      endDate: "2026-01-31",
      hrEmail: "hr@example.com",
      salary: "₹20L",
      openings: 1,
      applicationLink: "",
      official_url: "",
    };

    expect(() => createJobSchema.parse(payload)).not.toThrow();
    const parsed = createJobSchema.parse(payload);
    expect(parsed.applicationLink).toBe("");
    expect(parsed.official_url).toBe("");
  });
});
