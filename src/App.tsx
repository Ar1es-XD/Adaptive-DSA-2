import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "./components/Layout";
import { useTutorStore } from "./lib/store";
import Index from "./pages/Index";
import SignUp from "./pages/SignUp";
import Waiver from "./pages/Waiver";
import Diagnostic from "./pages/Diagnostic";
import DiagnosticResult from "./pages/DiagnosticResult";
import Profile from "./pages/Profile";
import Problems from "./pages/Problems";
import ProblemSolve from "./pages/ProblemSolve";
import Compiler from "./pages/Compiler";
import Concept from "./pages/Concept";
import Concepts from "./pages/Concepts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Smart landing based on onboarding state
const LandingGuard = () => {
  const user = useTutorStore(s => s.user);
  const diagnosticDone = useTutorStore(s => s.diagnosticDone);
  if (user && diagnosticDone) return <Index />;         // show home for full users
  if (user && !diagnosticDone) return <Navigate to="/diagnostic" replace />;
  return <SignUp />;                                      // no account → sign up
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<LandingGuard />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/waiver" element={<Waiver />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/diagnostic-result" element={<DiagnosticResult />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemSolve />} />
            <Route path="/compiler" element={<Compiler />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/concept/:concept" element={<Concept />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
