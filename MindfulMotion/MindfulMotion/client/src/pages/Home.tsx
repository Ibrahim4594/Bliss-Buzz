import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sparkles, Zap } from "lucide-react";
import type { MeditationSession } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  
  const { data: sessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ["/api/sessions"],
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <Sparkles className="h-20 w-20 text-primary animate-pulse" />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
            Bliss Buzz
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Transform your inner buzz into lasting bliss. AI-powered meditation that meets you exactly where you are.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setLocation("/meditate")}
            data-testid="button-start-journey"
            className="px-12 py-6 text-lg rounded-full"
          >
            Start Your Journey
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            data-testid="button-quick-calm"
            className="px-12 py-6 text-lg rounded-full"
          >
            <Link href="/zen-sparks">
              <Zap className="h-5 w-5 mr-2" />
              Quick Calm
            </Link>
          </Button>
        </div>

        {sessions.length > 0 && (
          <Button
            variant="ghost"
            asChild
            data-testid="button-view-dashboard"
          >
            <Link href="/dashboard">View Your Progress</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
