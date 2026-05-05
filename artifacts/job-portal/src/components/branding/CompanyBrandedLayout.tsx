import React, { ReactNode } from "react";

interface CompanyBrandedLayoutProps {
  primaryColor: string;
  secondaryColor?: string;
  children: ReactNode;
}

export const CompanyBrandedLayout: React.FC<CompanyBrandedLayoutProps> = ({
  primaryColor,
  secondaryColor,
  children,
}) => {
  // Apply brand colors to CSS variables
  const style = {
    "--brand-primary": primaryColor,
    "--brand-secondary": secondaryColor || primaryColor,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
};
