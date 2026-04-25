import { Link } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTutorStore } from "@/lib/store";
import { Brain, Code2, Sparkles, ArrowRight, BookOpen, Zap } from "lucide-react";

const Index = () => {
  const diagnosticDone = useTutorStore((s) => s.diagnosticDone);

  const features = [
    { icon: Brain, title: "Diagnostic Test", desc: "4 tagged questions assess your DSA foundations." },
    { icon: Sparkles, title: "AI-Personalized Plan", desc: "A 2-3 day plan calibrated to your weak spots." },
    { icon: Code2, title: "Adaptive Practice", desc: "Next problem chosen by your performance, not random." },
    { icon: Zap, title: "AI Debug & Hints", desc: "3-level hints that never reveal the solution." },
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="relative">
        <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
        <section className="container relative py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3 w-3" /> Built for focused, adaptive practice
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
              Master DSA, the way that works <span className="gradient-text">for you</span>.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground">
              Take a 2-minute diagnostic. Get a personalized plan. Solve problems chosen specifically to fix your weakest concept — with an AI tutor that hints, debugs, and explains without ever spoiling the answer.
            </p>
            <div className="mt-8 flex items-center justify-center gap-3">
              <Button size="lg" asChild className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <Link to={diagnosticDone ? "/profile" : "/diagnostic"}>
                  {diagnosticDone ? "View your profile" : "Start diagnostic"}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/problems">Browse problems</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <Card key={title} className="border-border/60 bg-gradient-card shadow-card">
                <CardContent className="p-5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
