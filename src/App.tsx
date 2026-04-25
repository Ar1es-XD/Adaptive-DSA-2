import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Diagnostic from "./pages/Diagnostic";
import Profile from "./pages/Profile";
import Problems from "./pages/Problems";
import ProblemSolve from "./pages/ProblemSolve";
import Concept from "./pages/Concept";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/diagnostic" element={<Diagnostic />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:id" element={<ProblemSolve />} />
          <Route path="/concept/:concept" element={<Concept />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
