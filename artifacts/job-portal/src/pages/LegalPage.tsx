import { Link } from "wouter";
import { ArrowLeft, Cookie, FileText, ShieldCheck } from "lucide-react";

const content = {
  privacy: {
    icon: ShieldCheck,
    title: "Privacy Policy",
    description: "How OpportuNet handles account, application, and preference data.",
    sections: [
      "We use your profile and application information to power job applications, exam registrations, college matching, and dashboard experiences.",
      "Authentication cookies are used only to keep your session active and protect private account pages.",
      "Contact details, resumes, and application records stay tied to your account so you can review and manage them later.",
    ],
  },
  terms: {
    icon: FileText,
    title: "Terms of Service",
    description: "The basic rules for using OpportuNet opportunities and exam resources.",
    sections: [
      "Use official employer, exam, and college portals for final submissions, payments, deadlines, and eligibility confirmation.",
      "OpportuNet helps organize opportunities and resources, but external application decisions remain with the listed organization.",
      "Keep your account details accurate so application tracking and college matching can work correctly.",
    ],
  },
  cookies: {
    icon: Cookie,
    title: "Cookie Settings",
    description: "Session and preference cookies used by this portal.",
    sections: [
      "Required cookies keep you signed in and protect authenticated pages.",
      "Preference storage remembers interface choices such as theme, language, and monthly update visibility.",
      "You can clear browser cookies at any time, but doing so will sign you out and reset local preferences.",
    ],
  },
} as const;

export default function LegalPage({ type }: { type: keyof typeof content }) {
  const page = content[type];
  const Icon = page.icon;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <section className="rounded-[3rem] border border-border bg-card p-10 md:p-14 shadow-xl shadow-primary/5">
        <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-8">
          <Icon className="w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">{page.title}</h1>
        <p className="text-lg text-muted-foreground font-medium leading-relaxed">{page.description}</p>

        <div className="mt-10 space-y-4">
          {page.sections.map((section, index) => (
            <div key={section} className="flex gap-4 rounded-2xl bg-secondary/40 border border-border/50 p-5">
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center text-xs font-black shrink-0">
                {index + 1}
              </div>
              <p className="text-sm md:text-base text-foreground/80 font-semibold leading-relaxed">{section}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
