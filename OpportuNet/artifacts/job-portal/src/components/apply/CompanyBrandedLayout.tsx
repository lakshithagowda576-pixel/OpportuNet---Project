import React from "react";

interface CompanyBrandedLayoutProps {
  company: {
    name: string;
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    type: string;
  };
  children: React.ReactNode;
}

const CompanyBrandedLayout: React.FC<CompanyBrandedLayoutProps> = ({ company, children }) => {
  const isGov = company.type === "government";
  
  // Government colors if not specified
  const primary = isGov ? "#FF9933" : company.primaryColor; // Saffron for Gov
  const secondary = isGov ? "#128807" : company.secondaryColor; // Green for Gov
  
  return (
    <div 
      className="min-h-screen bg-gray-50"
      style={{ 
        ['--brand-primary' as any]: primary,
        ['--brand-secondary' as any]: secondary,
      }}
    >
      {/* Dynamic Header */}
      <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {company.logoUrl ? (
              <img src={company.logoUrl} alt={company.name} className="h-12 w-auto object-contain" />
            ) : (
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: primary }}>
                {company.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Official Career Portal</p>
            </div>
          </div>
          
          {isGov && (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-1 bg-[#FF9933]"></div>
              <div className="h-8 w-1 bg-white border"></div>
              <div className="h-8 w-1 bg-[#128807]"></div>
              <span className="text-xs font-medium text-gray-600">Digital India | Recruitment Portal</span>
            </div>
          )}
        </div>
      </header>

      {/* Brand Hero Strip */}
      <div className="h-1 w-full flex">
        <div className="flex-1" style={{ backgroundColor: primary }}></div>
        <div className="flex-1" style={{ backgroundColor: secondary }}></div>
        <div className="flex-1" style={{ backgroundColor: isGov ? '#FFFFFF' : primary }}></div>
      </div>

      <main className="container mx-auto py-8 px-4">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {company.logoUrl && <img src={company.logoUrl} alt="" className="h-8 w-auto brightness-0 invert" />}
                <span className="text-lg font-bold">{company.name}</span>
              </div>
              <p className="text-gray-400 text-sm">
                Join our team and help us build the future. We are always looking for passionate individuals to join our global family.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Our Culture</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Diversity & Inclusion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Office Locations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">Contact</h3>
              <p className="text-gray-400 text-sm">
                Questions about careers? <br />
                Reach out to our recruitment team at <br />
                <span className="text-white font-medium">careers@{company.name.toLowerCase().replace(/\s/g, '')}.com</span>
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
            <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved. Powered by OpportuNet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CompanyBrandedLayout;
