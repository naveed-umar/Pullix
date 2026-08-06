import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Wand2, ArrowRight, ShieldCheck, Zap, LineChart, Code2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { OrbitalHeroSection } from "@/components/features/orbital-hero";
import { SparklesCore } from "@/components/ui/sparkles";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-primary-foreground">
      {/* Navigation */}
      <header className="flex h-16 items-center justify-between px-6 md:px-12 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="h-5 w-5" />
          </div>
          PulliX
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden md:block">
            Sign In
          </Link>
          <Link href="/signup" className={buttonVariants()}>Get Started</Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <div className="w-full h-screen border-b border-border/50">
          <OrbitalHeroSection>
            <div className="h-full w-full flex flex-col items-center justify-center text-center px-6 pt-16 pointer-events-none">
              <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 pointer-events-auto">
                <SparklesIcon className="mr-2 h-4 w-4" /> Introducing PulliX 2.0
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent pointer-events-auto drop-shadow-2xl">
                Engineering Intelligence, <br className="hidden md:block" /> Powered by AI.
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed pointer-events-auto drop-shadow-md">
                Automate code reviews, detect security vulnerabilities, and map your architecture in seconds. The ultimate platform for modern engineering teams.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pointer-events-auto">
                <Link href="/dashboard" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base shadow-xl shadow-primary/20" })}>
                  Start for free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base bg-background/20 backdrop-blur-md border-border/50 text-foreground hover:bg-background/40">
                  Book a Demo
                </Button>
              </div>
            </div>
          </OrbitalHeroSection>
        </div>


        {/* Features Grid */}
        <section className="px-6 py-24 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Everything you need to ship faster.</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Stop wasting time on manual reviews. Let AI handle the heavy lifting while you focus on building great products.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={<ShieldCheck className="h-6 w-6 text-primary" />}
              title="Automated Security"
              description="Detect vulnerabilities, hardcoded secrets, and dependency risks before they reach production."
            />
            <FeatureCard 
              icon={<Code2 className="h-6 w-6 text-primary" />}
              title="AI Code Review"
              description="Get instant, context-aware suggestions for refactoring, performance, and maintainability."
            />
            <FeatureCard 
              icon={<LineChart className="h-6 w-6 text-primary" />}
              title="Architecture Mapping"
              description="Automatically visualize your system architecture and identify single points of failure."
            />
            <FeatureCard 
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Zero Configuration"
              description="Connect your GitHub repository and get insights within seconds. No complex setup required."
            />
            <FeatureCard 
              icon={<Wand2 className="h-6 w-6 text-primary" />}
              title="Code Explain"
              description="Instantly understand complex legacy code with AI-generated explanations and flow charts."
            />
            <FeatureCard 
              icon={<SparklesIcon className="h-6 w-6 text-primary" />}
              title="Cost Estimator"
              description="Analyze your infrastructure code to predict cloud costs and identify optimization opportunities."
            />
          </div>
        </section>

        {/* CTA */}
        <section className="relative px-6 py-32 border-t border-border/50 bg-background text-center overflow-hidden">
          <div className="absolute inset-0 w-full h-full">
            <SparklesCore
              id="tsparticlesfullpage"
              background="transparent"
              minSize={0.6}
              maxSize={1.4}
              particleDensity={100}
              className="w-full h-full"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tight mb-6 text-foreground">Ready to elevate your engineering?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of developers building better software with PulliX.
            </p>
            <Link href="/signup" className={buttonVariants({ size: "lg", className: "h-12 px-8 text-base shadow-xl" })}>Get Started for Free</Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-12 text-center text-sm text-muted-foreground">
        <p>© 2026 PulliX. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors h-full">
      <CardContent className="p-6 flex flex-col gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed flex-1">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}
