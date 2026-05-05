import React from "react";
import { Building2, MapPin, Globe, Calendar, Users, Briefcase, Award, Heart } from "lucide-react";

interface CompanyDetailsProps {
  company: {
    name: string;
    description: string;
    foundedYear: number;
    headquarters: string;
    website: string;
    companySize: string;
    industry: string;
    culture: string;
    benefits: string;
  };
}

const CompanyDetails: React.FC<CompanyDetailsProps> = ({ company }) => {
  return (
    <div className="space-y-8">
      {/* About Section */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--brand-primary)]" />
          About {company.name}
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm">
          {company.description}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-gray-50">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase font-medium">Founded</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              {company.foundedYear}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase font-medium">Headquarters</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              {company.headquarters}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase font-medium">Company Size</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-400" />
              {company.companySize}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400 uppercase font-medium">Industry</span>
            <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-400" />
              {company.industry}
            </span>
          </div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Life at {company.name}
        </h3>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p>{company.culture}</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Benefits & Perks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {company.benefits.split(",").map((benefit, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
              <div className="h-6 w-6 rounded-full bg-white flex items-center justify-center shadow-sm text-[var(--brand-primary)]">
                <CheckCircleIcon className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium text-gray-700">{benefit.trim()}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Office Locations (Mockup) */}
      <section className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Official Website</h3>
        <a 
          href={company.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold transition-all hover:underline"
          style={{ color: 'var(--brand-primary)' }}
        >
          <Globe className="h-4 w-4" />
          Visit {company.name} Official Portal
        </a>
      </section>
    </div>
  );
};

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export default CompanyDetails;
