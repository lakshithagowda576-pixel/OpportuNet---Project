import { useState } from "react";
import { useListJobs, ListJobsCategory } from "@workspace/api-client-react";
import { Search, Filter, Loader2 } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function JobsDirectory() {
  const [activeTab, setActiveTab] = useState<ListJobsCategory | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: jobs = [], isLoading } = useListJobs({
    category: activeTab === "ALL" ? undefined : activeTab,
    search: searchQuery || undefined
  });

  const categories = [
    { id: "ALL", label: "All Jobs" },
    { id: ListJobsCategory.IT, label: "IT Sector" },
    { id: ListJobsCategory.NON_IT, label: "Non-IT Sector" },
    { id: ListJobsCategory.STATE_GOVT, label: "State Govt (KPSC)" },
    { id: ListJobsCategory.CENTRAL_GOVT, label: "Central Govt (SSC/UPSC)" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 max-w-6xl mx-auto"
    >
      <div className="flex flex-col gap-2">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-display font-bold text-foreground"
        >
          Job Directory
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-muted-foreground text-lg"
        >
          Find and apply for the best opportunities across various sectors.
        </motion.p>
      </div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-card/60 backdrop-blur-md p-4 rounded-2xl shadow-sm border border-border/50 flex flex-col md:flex-row gap-4 relative z-10"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by job title, company, or skills..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-background/50 border border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground font-medium shadow-inner"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-secondary/80 backdrop-blur-sm text-secondary-foreground font-semibold hover:bg-secondary transition-colors shadow-sm">
          <Filter className="w-5 h-5" />
          More Filters
        </button>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex overflow-x-auto pb-4 pt-2 scrollbar-hide gap-3"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveTab(category.id as any)}
            className={cn(
              "px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 relative",
              activeTab === category.id
                ? "text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-card text-muted-foreground border border-border/80 hover:bg-secondary hover:text-foreground"
            )}
          >
            {activeTab === category.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            {category.label}
          </button>
        ))}
      </motion.div>

      {/* Results */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-20"
            >
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10"
            >
              {jobs?.length ? (
                jobs.map((job, idx) => (
                  <JobCard key={job.id} job={job} index={idx} />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="col-span-full py-24 flex flex-col items-center justify-center bg-card/40 rounded-3xl border-2 border-dashed border-border/60 text-center"
                >
                  <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Search className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">No jobs found</h3>
                  <p className="text-muted-foreground max-w-md text-lg">
                    We couldn't find any positions matching your current filters. Try adjusting your search criteria.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
