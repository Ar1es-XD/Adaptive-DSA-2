import { Link, useLocation } from "react-router-dom";
import { User, BookOpen, LayoutDashboard, Terminal, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/concepts", label: "Concepts", icon: BookOpen },
  { to: "/problems", label: "Problems", icon: LayoutDashboard },
  { to: "/compiler", label: "Compiler", icon: Terminal },
  { to: "/diagnostic", label: "Diagnostic", icon: Code2 },
];

export function AppHeader() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur border-b-4 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,1)]">
      <div className="container flex h-24 items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-primary p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
              <Code2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <span className="text-3xl font-black tracking-tighter font-pixel uppercase text-foreground">
              Algora
            </span>
          </Link>

          <nav className="hidden md:flex gap-10">
            {links.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || (to.length > 1 && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest transition-all relative py-2 flex items-center gap-2",
                    active ? "text-primary" : "text-foreground hover:text-primary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  {active && (
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-primary" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/profile" 
            className="h-12 w-12 bg-card border-2 border-foreground flex items-center justify-center rounded-full overflow-hidden hover:bg-secondary transition-colors shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
          >
            <User className="h-6 w-6 text-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
