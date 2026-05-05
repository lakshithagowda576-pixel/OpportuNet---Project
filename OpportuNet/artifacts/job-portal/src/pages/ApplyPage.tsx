import React, { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CompanyBrandedLayout from "../components/apply/CompanyBrandedLayout";
import JobDetailsSection from "../components/apply/JobDetailsSection";
import CompanyDetails from "../components/apply/CompanyDetails";
import ApplicationForm from "../components/apply/ApplicationForm";
import { Loader2, AlertCircle, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";

const ApplyPage: React.FC = () => {
  const [, params] = useRoute("/apply/:id");
  const [, setLocation] = useLocation();
  const jobId = params?.id ? parseInt(params.id) : null;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  // Fetch job details
  const { data: job, isLoading: isLoadingJob, error: jobError } = useQuery({
    queryKey: ["job", jobId],
    queryFn: async () => {
      const res = await axios.get(`/api/jobs/${jobId}`);
      return res.data;
    },
    enabled: !!jobId,
  });

  // Fetch company branding after job is loaded
  const { data: company, isLoading: isLoadingCompany } = useQuery({
    queryKey: ["company", job?.company],
    queryFn: async () => {
      const res = await axios.get(`/api/companies/${job.company}`);
      return res.data;
    },
    enabled: !!job?.company,
  });

  const handleFormSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const res = await axios.post("/api/applications/direct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (res.data.success) {
        setIsSuccess(true);
        setApplicationId(res.data.applicationId);
        toast.success("Application submitted successfully!");
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.response?.data?.error || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingJob || (job && isLoadingCompany)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading official application portal...</p>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h1>
          <p className="text-gray-600 mb-8">The job you are looking for might have been removed or the link is invalid.</p>
          <Button onClick={() => setLocation("/")} className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Fallback company info if branding is missing
  const activeCompany = company || {
    name: job.company,
    primaryColor: job.category?.includes("GOVT") ? "#FF9933" : "#4285F4",
    secondaryColor: job.category?.includes("GOVT") ? "#128807" : "#34A853",
    type: job.category?.includes("GOVT") ? "government" : "corporate",
    description: `${job.company} is a leading organization in the ${job.category} sector.`,
    foundedYear: 2000,
    headquarters: job.location,
    website: "#",
    companySize: "1,000+ employees",
    industry: job.category,
    culture: "Focus on excellence and innovation.",
    benefits: "Health Insurance, Paid Time Off, Career Growth",
  };

  if (isSuccess) {
    return (
      <CompanyBrandedLayout company={activeCompany}>
        <div className="max-w-2xl mx-auto py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden text-center p-12">
            <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 mb-4">Application Submitted!</h1>
            <p className="text-gray-600 mb-8">
              Thank you for applying to <strong>{activeCompany.name}</strong>. Your application for <strong>{job.title}</strong> has been received successfully.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <div className="text-xs text-gray-400 uppercase font-bold mb-1">Your Application ID</div>
              <div className="text-2xl font-mono font-bold text-gray-900">#APP-{applicationId}</div>
            </div>

            <p className="text-sm text-gray-500 mb-10 leading-relaxed">
              A confirmation email has been sent to your registered email address. 
              Our recruitment team will review your application and get back to you shortly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => setLocation("/applications")} variant="outline" className="h-12 px-8">
                Track Applications
              </Button>
              <Button 
                onClick={() => setLocation("/")} 
                className="h-12 px-8"
                style={{ backgroundColor: 'var(--brand-primary)' }}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </CompanyBrandedLayout>
    );
  }

  return (
    <CompanyBrandedLayout company={activeCompany}>
      <div className="mb-8">
        <button 
          onClick={() => setLocation(`/jobs/${job.id}`)}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Job Details
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-7">
          <ApplicationForm 
            jobId={job.id} 
            companyName={activeCompany.name}
            isGov={activeCompany.type === "government"}
            onSubmit={handleFormSubmit}
            isLoading={isSubmitting}
          />
        </div>

        {/* Right Column: Info */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          <JobDetailsSection job={job} />
          <CompanyDetails company={activeCompany} />
        </div>
      </div>
    </CompanyBrandedLayout>
  );
};

export default ApplyPage;
