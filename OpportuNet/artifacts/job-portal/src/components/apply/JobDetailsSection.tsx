import React from "react";
import { Badge } from "../ui/badge";
import { DollarSign, MapPin, Clock, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";

interface JobDetailsSectionProps {
  job: {
    title: string;
    description: string;
    location: string;
    salary: string;
    shift: string;
    eligibility: string;
    applicationGuide: string;
  };
}

const JobDetailsSection: React.FC<JobDetailsSectionProps> = ({ job }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className="p-6 border-b bg-[var(--brand-primary)]/5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-black text-gray-900">{job.title}</h2>
          <Badge variant="outline" className="border-[var(--brand-primary)] text-[var(--brand-primary)] font-bold">
            Full Time
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-6 text-sm font-medium text-gray-600">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-[var(--brand-primary)]" />
            {job.salary}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[var(--brand-primary)]" />
            {job.location}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-[var(--brand-primary)]" />
            {job.shift}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Description */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Job Description
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {job.description}
          </div>
        </section>

        {/* Eligibility */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Requirements & Eligibility
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {job.eligibility.split("\n").map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <span>{item.trim()}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Guide */}
        <section className="p-4 rounded-lg bg-blue-50 border border-blue-100">
          <h3 className="text-sm font-bold text-blue-900 mb-2">Application Instructions</h3>
          <div className="text-xs text-blue-800 leading-relaxed whitespace-pre-line">
            {job.applicationGuide}
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetailsSection;
