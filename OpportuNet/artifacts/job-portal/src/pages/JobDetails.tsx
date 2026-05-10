import { useState } from "react";
import { useRoute } from "wouter";
import { 
  useGetJob, 
  useGetJobApplicantCount, 
  useCreateApplication
} from "@workspace/api-client-react";
import { 
  Building2, MapPin, Clock, IndianRupee, 
  Calendar, CheckCircle2, Users, AlertCircle, 
  Loader2, ArrowLeft, Mail, BookOpen, ListChecks, Briefcase, ExternalLink
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export default function JobDetails() {
  const [, params] = useRoute("/jobs/:id");
  const jobId = Number(params?.id);
  const { toast } = useToast();

  const { data: job, isLoading: isJobLoading } = useGetJob(jobId);
  const { data: applicantStats } = useGetJobApplicantCount(jobId);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [appName, setAppName] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  
  const { mutate: apply, isPending: isApplying } = useCreateApplication({
    mutation: {
      onSuccess: () => {
        setIsApplyModalOpen(false);
        setAppName(""); setAppEmail(""); setCoverLetter("");
        
        toast({ title: "Application Submitted!", description: "Your application was received. Track it in My Applications." });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to submit. You may have already applied.", variant: "destructive" });
      }
    }
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    apply({ data: { jobId, applicantName: appName, applicantEmail: appEmail, coverLetter } });
  };

  const getShiftLabel = (shift: string) => {
    switch (shift) {
      case "Full_time": return "Full Time";
      case "Part_time": return "Part Time";
      default: return shift;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "IT": return "IT Sector";
      case "NON_IT": return "Non-IT";
      case "STATE_GOVT": return "State Government";
      case "CENTRAL_GOVT": return "Central Government";
      default: return category.replace("_", " ");
    }
  };

  const steps = job?.applicationGuide?.split("\n").filter(s => s.trim()) ?? [];

  if (isJobLoading) {
    return <div className="flex justify-center py-32"><Loader2 className="w-12 h-12 animate-spin text-primary" /></div>;
  }
  if (!job) {
    return <div className="text-center py-32 text-xl font-bold">Job not found.</div>;
  }

  const isGovtJob = job.category === "STATE_GOVT" || job.category === "CENTRAL_GOVT";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1, delayChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Link href="/jobs" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Jobs
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={itemVariants} className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 border border-border/60 shadow-xl shadow-primary/5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute -inset-2 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 -z-10"></div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                {getCategoryLabel(job.category)}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-4 h-4" /> Active Hiring
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
                <Clock className="w-4 h-4" /> {getShiftLabel(job.shift)}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">{job.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5 text-foreground font-semibold">
                <Building2 className="w-5 h-5 text-primary" /> {job.company}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-5 h-5 text-primary/70" /> {job.location}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto shrink-0">
            {job.applicationLink && (
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-60 px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" /> Apply Now
              </motion.a>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full md:w-60 px-6 py-4 rounded-xl font-bold text-lg bg-primary/20 text-primary hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all duration-300 flex items-center justify-center gap-2 border border-primary/30"
            >
              <BookOpen className="w-5 h-5" /> Apply Here
            </motion.button>
            {!isGovtJob && job.hrEmail && (
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={`mailto:${job.hrEmail}`}
                className="w-full md:w-60 px-6 py-3 rounded-xl font-semibold bg-secondary/50 backdrop-blur-sm text-secondary-foreground hover:bg-secondary flex items-center justify-center gap-2 transition-colors text-sm border border-border"
              >
                <Mail className="w-4 h-4 text-primary" /> Email HR
              </motion.a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Key info strip */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Salary / Package", value: job.salary, icon: <IndianRupee className="w-3.5 h-3.5" />, color: "text-foreground" },
          { label: "Openings", value: `${job.openings} Position${job.openings !== 1 ? 's' : ''}`, icon: <AlertCircle className="w-3.5 h-3.5" />, color: "text-foreground" },
          { label: "Application Opens", value: formatDate(job.startDate), icon: <Calendar className="w-3.5 h-3.5 text-emerald-500" />, color: "text-emerald-600" },
          { label: "Last Date to Apply", value: formatDate(job.endDate), icon: <Calendar className="w-3.5 h-3.5 text-destructive" />, color: "text-destructive" },
        ].map((item, idx) => (
          <motion.div 
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            key={idx} 
            className="bg-card/70 backdrop-blur-sm rounded-2xl p-4 border border-border/50 shadow-sm flex flex-col gap-1 hover:shadow-md hover:border-primary/20 transition-all"
          >
            <span className="text-xs text-muted-foreground flex items-center gap-1.5">{item.icon} {item.label}</span>
            <span className={cn("font-bold text-sm", item.color)}>{item.value}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Job Description */}
          <motion.section variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" /> Job Description
            </h2>
            <div className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {job.description}
            </div>
            <div className="mt-6 pt-6 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-xl">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Location:</span>
                <span className="font-semibold text-foreground">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Work Type:</span>
                <span className="font-semibold text-foreground">{getShiftLabel(job.shift)}</span>
              </div>
              {!isGovtJob && job.hrEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">HR Contact:</span>
                  <a href={`mailto:${job.hrEmail}`} className="font-semibold text-primary hover:underline">{job.hrEmail}</a>
                </div>
              )}
              <div className="flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Package:</span>
                <span className="font-semibold text-foreground">{job.salary}</span>
              </div>
            </div>
          </motion.section>

          {/* Eligibility */}
          <motion.section variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" /> Eligibility Criteria
            </h2>
            <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200/60 rounded-xl p-5 text-amber-900 text-sm leading-relaxed whitespace-pre-wrap shadow-inner">
              {job.eligibility}
            </div>
          </motion.section>

          {/* Application Guide */}
          <motion.section variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" /> Step-by-Step Application Guide
            </h2>
            <div className="space-y-4">
              {steps.map((step, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-4 items-start bg-secondary/30 p-4 rounded-xl border border-border/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                    {i + 1}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                    {step.replace(/^Step \d+:\s*/i, "")}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Application timeline */}
          <motion.div variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm">
            <h3 className="font-display font-bold text-base border-b border-border/50 pb-3 mb-4">Application Timeline</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-500 mt-0.5 shrink-0 shadow-sm shadow-emerald-500/40"></div>
                <div>
                  <p className="text-xs text-muted-foreground">Start Date</p>
                  <p className="font-semibold text-emerald-600">{formatDate(job.startDate)}</p>
                </div>
              </div>
              <div className="w-0.5 h-6 bg-border ml-1.5"></div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-destructive mt-0.5 shrink-0 shadow-sm shadow-destructive/40"></div>
                <div>
                  <p className="text-xs text-muted-foreground">Last Date</p>
                  <p className="font-semibold text-destructive">{formatDate(job.endDate)}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick info */}
          <motion.div variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base border-b border-border/50 pb-3">Quick Info</h3>
            {[
              { label: "Salary", value: job.salary, icon: <IndianRupee className="w-4 h-4 text-primary" />, bg: "bg-primary/10" },
              { label: "Openings", value: `${job.openings} posts`, icon: <AlertCircle className="w-4 h-4 text-amber-500" />, bg: "bg-amber-500/10" },
              { label: "Location", value: job.location, icon: <MapPin className="w-4 h-4 text-blue-500" />, bg: "bg-blue-500/10" },
              { label: "Work Mode", value: getShiftLabel(job.shift), icon: <Clock className="w-4 h-4 text-purple-500" />, bg: "bg-purple-500/10" },
            ].map(({ label, value, icon, bg }) => (
              <div key={label} className="flex gap-3 items-start group">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors", bg)}>{icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</p>
                  <p className="font-semibold text-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Applicant stats */}
          {applicantStats && (
            <motion.div variants={itemVariants} className="bg-card/70 backdrop-blur-sm rounded-2xl p-6 border border-border/50 shadow-sm">
              <h3 className="font-display font-bold text-base border-b border-border/50 pb-3 mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" /> Applicant Stats
              </h3>
              <div className="text-center mb-5">
                <p className="text-4xl font-display font-bold text-foreground">{applicantStats.total}</p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-semibold">Total Applicants</p>
              </div>
              <div className="space-y-2.5">
                {Object.entries(applicantStats.byStatus).map(([status, count]) => (
                  count > 0 && (
                    <div key={status} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold",
                        status === "Pending" ? "bg-yellow-100/80 text-yellow-700" :
                        status === "Reviewed" ? "bg-blue-100/80 text-blue-700" :
                        status === "Interview" ? "bg-purple-100/80 text-purple-700" :
                        status === "Offered" ? "bg-green-100/80 text-green-700" :
                        "bg-red-100/80 text-red-700"
                      )}>{status}</span>
                      <span className="font-bold text-foreground">{count as number}</span>
                    </div>
                  )
                ))}
              </div>
            </motion.div>
          )}

          {/* Apply CTA */}
          <motion.div variants={itemVariants} className="flex flex-col gap-3">
            {job.applicationLink && (
              <motion.a 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href={job.applicationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" /> Apply Now
              </motion.a>
            )}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsApplyModalOpen(true)}
              className="w-full px-6 py-4 rounded-xl font-bold text-lg bg-primary/20 text-primary hover:bg-primary/30 shadow-lg shadow-primary/10 transition-all duration-300 flex items-center justify-center gap-2 border border-primary/30"
            >
              <BookOpen className="w-5 h-5" /> Apply Here
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setIsApplyModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border/50 p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent"></div>
              
              <h2 className="text-2xl font-display font-bold mb-1">Apply for {job.title}</h2>
              <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> {job.company}
              </p>
              

              
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">Full Name *</label>
                  <input 
                    required type="text" value={appName}
                    onChange={e => setAppName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">Email Address *</label>
                  <input 
                    required type="email" value={appEmail}
                    onChange={e => setAppEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none text-sm font-medium"
                    placeholder="rahul@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-foreground">Cover Letter (Optional)</label>
                  <textarea 
                    value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none min-h-[100px] resize-none text-sm font-medium"
                    placeholder="Tell us why you are a great fit for this role..."
                  />
                </div>
                {!isGovtJob && job.hrEmail && (
                  <div className="bg-secondary/50 rounded-xl p-3 text-xs text-muted-foreground flex items-center gap-2 border border-border/50">
                    <Mail className="w-3.5 h-3.5" />
                    <span><strong className="text-foreground">HR Contact:</strong> {job.hrEmail}</span>
                  </div>
                )}
                <div className="flex gap-3 pt-4">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button" onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" disabled={isApplying}
                    className="flex-[2] px-4 py-3 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
                  >
                    {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

