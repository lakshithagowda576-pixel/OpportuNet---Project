import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { trackEvent } from "@/lib/analytics";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GoogleAccountSelector } from "@/components/GoogleAccountSelector";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API_BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showGoogleSelector, setShowGoogleSelector] = useState(false);
  const { login, loginWithGoogle, loginWithGitHub } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    trackEvent({
      eventType: "page_view",
      eventCategory: "Authentication",
      eventAction: "view",
      page: "/login",
    });

    // Check if returning from OAuth - if so, store the account info
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("oauth_complete")) {
      const storedUser = localStorage.getItem("last_oauth_user");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          const saved = localStorage.getItem("google_accounts");
          let accounts = saved ? JSON.parse(saved) : [];
          
          // Add or update this account
          const existingIndex = accounts.findIndex((a: any) => a.email === user.email);
          if (existingIndex >= 0) {
            accounts[existingIndex].lastUsed = new Date().toISOString();
            accounts = [accounts[existingIndex], ...accounts.slice(0, existingIndex), ...accounts.slice(existingIndex + 1)];
          } else {
            accounts.unshift({
              email: user.email,
              name: user.name,
              lastUsed: new Date().toISOString(),
            });
          }
          
          // Keep only last 5 accounts
          accounts = accounts.slice(0, 5);
          localStorage.setItem("google_accounts", JSON.stringify(accounts));
          localStorage.removeItem("last_oauth_user");
          
          // Clean up URL
          window.history.replaceState({}, "", "/login");
        } catch {
          // Ignore errors
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      trackEvent({
        eventType: "user_login",
        eventCategory: "Authentication",
        eventAction: "login_email",
        metadata: { email },
      });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAccountSelect = (selectedEmail?: string) => {
    if (selectedEmail) {
      // Pass selected email as parameter (for future use if needed)
      console.log("Selected account:", selectedEmail);
    }
    // Always redirect to OAuth flow, which will show the account selector
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/10 p-2 overflow-hidden">
              <img 
                src={`${import.meta.env.BASE_URL}logo.png`} 
                alt="OpportuNet Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-display font-bold text-foreground">OpportuNet</span>
          </div>
          <p className="text-muted-foreground text-sm">Connecting Talent with Opportunities Beyond Boundaries</p>
        </div>

        <div className="bg-card rounded-3xl shadow-2xl shadow-primary/10 border border-border overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-center mb-6">Sign In</h2>

            {/* OAuth Buttons */}
            <div className="space-y-3 mb-6">
              <GoogleAccountSelector onSelectAccount={handleGoogleAccountSelect} isLoading={loading} />
              <button
                onClick={() => handleGoogleAccountSelect()}
                className="w-full py-3 rounded-xl font-medium bg-white border-2 border-gray-200 text-gray-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <button
                onClick={loginWithGitHub}
                className="w-full py-3 rounded-xl font-medium bg-gray-900 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPass ? "text" : "password"} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-12 py-3 rounded-xl bg-background border-2 border-border focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-xs text-muted-foreground">
                  Use: admin@govportal.com / Admin@123
                </span>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
