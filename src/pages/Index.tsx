import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTutorStore } from "@/lib/store";
import { ArrowRight, BookOpen, User, PlayCircle, Library } from "lucide-react";
import { CONCEPT_LABELS, CONCEPTS } from "@/lib/types";

const Index = () => {
  const { diagnosticDone } = useTutorStore();

  return (
    <div className="bg-background text-foreground overflow-hidden flex flex-col h-full font-sans">
      <main className="relative flex-1">
        {/* Flat Hero Section */}
        <section className="container max-w-7xl pt-24 pb-16 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-sm font-medium border border-border">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Master Data Structures & Algorithms
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight">
              Adaptive learning <br /> for <span className="text-primary font-pixel">CODING</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
              We analyze how you think. By establishing your baseline reasoning, our system curates a custom-tailored path to build your problem-solving intuition from the ground up. Say goodbye to mindless grinding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base">
                <Link to={diagnosticDone ? "/problems" : "/diagnostic"}>
                  {diagnosticDone ? "Continue Learning" : "Start Diagnostic"} <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-border hover:bg-secondary h-14 px-8 text-base">
                <Link to="/compiler">
                  <PlayCircle className="mr-2 h-5 w-5" /> Open Compiler
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:w-auto relative animate-fade-in-up delay-100">
            {/* Hero image placeholder matching the flat style */}
            <div className="bg-card rounded-[2rem] border-2 border-border p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px] text-center">
              <BookOpen className="h-24 w-24 text-primary mb-6" />
              <h2 className="text-2xl font-bold font-pixel mb-2">Build Intuition</h2>
              <p className="text-muted-foreground">Stop memorizing solutions. Start understanding the underlying patterns.</p>
            </div>
          </div>
        </section>

        {/* Infinite Slider Section */}
        <section className="py-16 overflow-hidden bg-secondary border-y border-border">
          <div className="container mb-8 flex items-center gap-2">
             <Library className="h-5 w-5 text-primary" />
             <h2 className="text-xl font-bold">Explore Concepts</h2>
          </div>
          <div className="relative w-full flex items-center">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-secondary to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-secondary to-transparent z-10 pointer-events-none" />
            
            <div className="slider-track py-4">
              {[...CONCEPTS, ...CONCEPTS, ...CONCEPTS].map((concept, i) => {
                // Determine an image based on concept
                const imgMap: Record<string, string> = {
                  "arrays":         "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=800",
                  "two-pointers":   "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800",
                  "sliding-window": "https://images.unsplash.com/photo-1509233725247-49e657c54213?auto=format&fit=crop&q=80&w=800",
                  "recursion":      "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=800",
                  "hash-map":       "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800",
                  "stack":          "https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=800",
                  "binary-search":  "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800",
                  "strings":        "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?auto=format&fit=crop&q=80&w=800",
                };
                
                return (
                  <Link to={`/concept/${concept}`} key={`${concept}-${i}`} className="block">
                    <Card className="w-[320px] shrink-0 bg-card rounded-[2rem] border-2 border-transparent hover:border-primary transition-all cursor-pointer group shadow-sm h-full overflow-hidden">
                      <CardContent className="p-0 flex flex-col h-full">
                        <div className="h-48 bg-muted relative overflow-hidden">
                           <img 
                             src={imgMap[concept]} 
                             alt={CONCEPT_LABELS[concept]} 
                             className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                           />
                           <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          <h3 className="font-pixel text-base mb-3 text-foreground group-hover:text-primary transition-colors leading-relaxed">{CONCEPT_LABELS[concept]}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">Master the core principles and patterns of {CONCEPT_LABELS[concept]} to solve complex algorithmic challenges.</p>
                          <div className="mt-6 flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wider">
                             <PlayCircle className="h-5 w-5" /> Start Learning
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features / Information Section */}
        <section className="container max-w-7xl py-24 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-6 group">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-transparent group-hover:border-foreground">
                <Library className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight font-pixel">The Algora Method</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Traditional platforms dump problems on you. We model your cognitive understanding. Our heuristics analyze your code structure, recursion patterns, and optimization choices to map your unique learning curve.
              </p>
            </div>
            
            <div className="space-y-6 group">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-transparent group-hover:border-foreground">
                <PlayCircle className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight font-pixel">Personalized Roadmap</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Your path is generated in real-time. As you solve problems, the system updates your "Heuristic Mapping," identifying exactly which concept—whether it's Sliding Window or Recursion—needs your attention next.
              </p>
            </div>
            
            <div className="space-y-6 group">
              <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-[4px_4px_0_0_rgba(0,0,0,0.1)] group-hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] border-2 border-transparent group-hover:border-foreground">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-tight font-pixel">Real-time Feedback</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Our integrated compiler doesn't just run code. It provides AI-driven reviews that explain *why* your approach fails or succeeds, building the mental models required to tackle complex algorithmic challenges at elite levels.
              </p>
            </div>
          </div>
        </section>

        {/* Detailed Methodology Section */}
        <section className="bg-foreground text-background py-24">
          <div className="container max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-tight font-pixel">
                BEYOND THE <br /> <span className="text-primary">LEETCODE</span> GRIND
              </h2>
              <div className="space-y-6 text-xl opacity-90 leading-relaxed font-medium">
                <p>
                  Solving 500 problems isn't useful if you're just memorizing solutions. Algora focuses on **pattern recognition**.
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">01</span>
                    <span>Establish your baseline via a comprehensive logic & coding diagnostic.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">02</span>
                    <span>Solve curated problems that target your specific conceptual weaknesses.</span>
                  </li>
                  <li className="flex gap-4">
                    <span className="text-primary font-bold">03</span>
                    <span>Receive architectural feedback on your code, not just a binary pass/fail.</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-background rounded-[3rem] p-12 shadow-[12px_12px_0_0_#bf2f1f] border-4 border-foreground">
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b-2 border-foreground/10 pb-6">
                  <div className="h-4 w-4 rounded-full bg-primary" />
                  <span className="text-foreground font-bold uppercase tracking-widest text-sm">System Status: Active</span>
                </div>
                <div className="space-y-4 font-mono text-sm text-foreground/70">
                  <p>&gt; ANALYZING USER LEARNING CURVE...</p>
                  <p>&gt; IDENTIFIED WEAKNESS: SLIDING WINDOW (OPTIMAL SUBSTRUCTURE)</p>
                  <p>&gt; GENERATING TARGETED DRILLS...</p>
                  <div className="h-4 w-[60%] bg-secondary rounded-full overflow-hidden border border-foreground/10">
                    <div className="h-full bg-primary w-[45%] animate-pulse" />
                  </div>
                  <p className="text-foreground font-bold">&gt; READINESS LEVEL: 44%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Index;
