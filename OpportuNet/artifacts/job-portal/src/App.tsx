import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/layout/AppLayout";
import { AuthProvider } from "@/context/AuthContext";
import Dashboard from "@/pages/Dashboard";
import JobsDirectory from "@/pages/JobsDirectory";
import JobDetails from "@/pages/JobDetails";
import ApplicationTracker from "@/pages/ApplicationTracker";
import PgCetHub from "@/pages/PgCetHub";
import LoginPage from "@/pages/LoginPage";
import AdminPanel from "@/pages/AdminPanel";
import ApplyPage from "@/pages/ApplyPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000 }
  }
});

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="min-h-screen"
      >
        <Switch>
          <Route path="/login" component={LoginPage} />
          <Route path="/apply/:id" component={ApplyPage} />
          <Route>
            <AppLayout>
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/jobs" component={JobsDirectory} />
                <Route path="/jobs/:id" component={JobDetails} />
                <Route path="/applications" component={ApplicationTracker} />
                <Route path="/exams" component={PgCetHub} />
                <Route path="/admin" component={AdminPanel} />
                <Route component={NotFound} />
              </Switch>
            </AppLayout>
          </Route>
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
