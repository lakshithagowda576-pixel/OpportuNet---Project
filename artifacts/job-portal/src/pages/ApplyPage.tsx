import React, { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { trackEvent } from "@/lib/analytics";
import { Job, Company } from "@workspace/db/schema";
import { CompanyBrandedLayout } from "@/components/branding/CompanyBrandedLayout";
import { CompanyDetails } from "@/components/branding/CompanyDetails";
import { JobDetailsSection } from "@/components/branding/JobDetailsSection";
import { ApplicationForm } from "@/components/branding/ApplicationForm";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import apiFetch from "@/lib/api-client";

const ApplyPage: React.FC = () => {
  const [, params] = useRoute("/jobs/:id/apply");
  const jobId = params?.id;

  // Fetch job details
  const { data: job, isLoading: isLoadingJob } = useQuery<Job>({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const response = await apiFetch(`/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error("Job not found");
      }
      return response.json();
    },
    enabled: !!jobId,
  });

  // Fetch company branding details
  const { data: company, isLoading: isLoadingCompany } = useQuery<Company>({
    queryKey: ["company", job?.company],
    queryFn: async () => {
      const response = await apiFetch(`/companies/${job?.company}`);
      if (!response.ok) {
        throw new Error("Company not found");
      }
      return response.json();
    },
    enabled: !!job?.company,
  });

  useEffect(() => {
    if (job) {
      trackEvent({
        eventType: "application_page_view",
        eventCategory: "Application",
        eventAction: "view",
        page: `/apply/${jobId}`,
        metadata: { jobId, company: job.company, category: job.category },
      });
    }
  }, [job, jobId]);

  const isFuture = job ? new Date() < new Date(job.startDate) : false;

  if (isLoadingJob || isLoadingCompany) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  if (isFuture) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 max-w-md mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Applications Not Open</h2>
        <p className="text-gray-500">Applications for this position will open on {new Date(job.startDate).toLocaleDateString()}. Please pre-register on the job page to get notified.</p>
        <Button onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  // Use default branding if company details are missing
  const branding = {
    primaryColor: company?.primaryColor || (job.category.includes("GOVT") ? "#FF9933" : "#4285F4"),
    secondaryColor: company?.secondaryColor || (job.category.includes("GOVT") ? "#128807" : "#34A853"),
  };

  return (
    <CompanyBrandedLayout primaryColor={branding.primaryColor} secondaryColor={branding.secondaryColor}>
      <div className="mb-8">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="text-gray-600 hover:text-[var(--brand-primary)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Listing
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Job & Company Details */}
        <div className="lg:col-span-1 space-y-8">
          {company ? (
            <CompanyDetails company={company} />
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
              <h2 className="text-2xl font-bold mb-4">{job.company}</h2>
              <p className="text-gray-500">Corporate Member</p>
            </div>
          )}
        </div>

        {/* Right Column: Job Section & Application Form */}
        <div className="lg:col-span-2">
          <JobDetailsSection job={job} />
          <ApplicationForm 
            jobId={job.id} 
            companyName={job.company} 
            isGovernment={job.category.includes("GOVT")} 
          />
        </div>
      </div>
    </CompanyBrandedLayout>
  );
};

export default ApplyPage;
