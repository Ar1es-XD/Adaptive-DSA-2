import { Link, useLocation } from "react-router-dom";
import { Brain, Code2, BookOpen, Sparkles, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home", icon: Sparkles },
  { to: "/diagnostic", label: "Diagnostic", icon: Brain },
  { to: "/profile", label: "Profile", icon: BarChart3 },
  { to: "/problems", label: "Problems", icon: Code2 },
];

export function AppHeader() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-border/40 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md border border-border/60 bg-card">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-sm font-medium tracking-tight text-foreground">
            Cyber-Dojo
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
