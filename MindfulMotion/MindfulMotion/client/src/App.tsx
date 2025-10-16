import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sparkles, Home as HomeIcon, Zap, LayoutDashboard } from "lucide-react";
import Home from "@/pages/Home";
import Meditate from "@/pages/Meditate";
import Dashboard from "@/pages/Dashboard";
import ZenSparks from "@/pages/ZenSparks";
import NotFound from "@/pages/not-found";

function Navigation() {
  const [location, setLocation] = useLocation();
  
  // Hide nav during active meditation
  if (location.includes("meditate")) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 hover-elevate rounded-lg px-2 py-1"
          >
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Bliss Buzz</span>
          </button>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              data-testid="nav-home"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/zen-sparks")}
              data-testid="nav-zen-sparks"
            >
              <Zap className="h-4 w-4 mr-2" />
              Zen Sparks
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/dashboard")}
              data-testid="nav-dashboard"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/meditate" component={Meditate} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/zen-sparks" component={ZenSparks} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Navigation />
          <div className="fixed top-4 right-4 z-50">
            <ThemeToggle />
          </div>
          <Router />
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
