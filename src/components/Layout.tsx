import { useLocation, Navigate } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { useTutorStore } from "@/lib/store";

const ONBOARDING_ROUTES = ["/", "/signup", "/waiver", "/diagnostic", "/diagnostic-result"];

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const user = useTutorStore(s => s.user);
  const diagnosticDone = useTutorStore(s => s.diagnosticDone);

  const isOnboarding = ONBOARDING_ROUTES.includes(pathname);
  // Navbar appears if diagnostic is done, UNLESS we are in the middle of onboarding (except home /)
  const showNav = diagnosticDone && (pathname === "/" || !isOnboarding);

  // Guard: not signed up → force back to signup
  if (!user && !isOnboarding) {
    return <Navigate to="/" replace />;
  }

  // Guard: signed up but diagnostic not done → only allow onboarding routes
  if (user && !diagnosticDone && !isOnboarding) {
    return <Navigate to="/diagnostic" replace />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      {showNav && <AppHeader />}
      <div className={`flex-1 flex flex-col w-full ${showNav ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}`}>
        {children}
      </div>
    </div>
  );
}
