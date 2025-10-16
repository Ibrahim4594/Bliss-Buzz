import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { MoodCheckIn } from "@/components/MoodCheckIn";
import { EnvironmentSelector } from "@/components/EnvironmentSelector";
import { BreathworkStudio } from "@/components/BreathworkStudio";
import { MeditationPlayer } from "@/components/MeditationPlayer";
import { Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { MoodType } from "@shared/schema";

type Step = "mood" | "environment" | "breathwork" | "meditation";

export default function Meditate() {
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("mood");
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>("bamboo");
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [sessionDuration, setSessionDuration] = useState<number>(5);

  // Parse query params for Zen Sparks quick start
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1]);
    const mood = params.get("mood") as MoodType;
    const duration = params.get("duration");
    const isQuick = params.get("quick");

    if (mood && duration && isQuick) {
      setSelectedMood(mood);
      setSessionDuration(parseInt(duration));
      saveMoodMutation.mutate(mood);
      generateMeditationMutation.mutate({ mood, duration: parseInt(duration) });
      setStep("meditation");
    }
  }, [location]);

  const generateMeditationMutation = useMutation({
    mutationFn: async (data: { mood: MoodType; duration: number }) => {
      const result = await apiRequest("POST", "/api/meditation/generate", data);
      return result;
    },
    onSuccess: (data) => {
      setGeneratedScript(data.script);
      setStep("meditation");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate meditation. Please try again.",
        variant: "destructive",
      });
      setStep("breathwork");
    },
  });

  const saveMeditationMutation = useMutation({
    mutationFn: async (data: {
      mood: string;
      duration: number;
      script: string;
      environment: string;
    }) => {
      await apiRequest("POST", "/api/sessions", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Session Complete!",
        description: "Your meditation journey has been saved.",
      });
      setLocation("/dashboard");
    },
  });

  const saveMoodMutation = useMutation({
    mutationFn: async (mood: string) => {
      await apiRequest("POST", "/api/mood", { mood });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
    },
  });

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
    saveMoodMutation.mutate(mood);
    setStep("environment");
  };

  const handleEnvironmentContinue = () => {
    setStep("breathwork");
  };

  const handleBreathworkComplete = () => {
    if (selectedMood) {
      generateMeditationMutation.mutate({
        mood: selectedMood,
        duration: sessionDuration,
      });
    }
  };

  const handleMeditationComplete = () => {
    if (selectedMood) {
      saveMeditationMutation.mutate({
        mood: selectedMood,
        duration: sessionDuration,
        script: generatedScript,
        environment: selectedEnvironment,
      });
    }
  };

  const renderContent = () => {
    switch (step) {
      case "mood":
        return (
          <div className="min-h-screen pt-24 pb-12 px-4">
            <MoodCheckIn onMoodSelect={handleMoodSelect} />
          </div>
        );

      case "environment":
        return (
          <div className="min-h-screen pt-24 pb-12 px-4">
            <EnvironmentSelector
              selectedEnvironment={selectedEnvironment}
              onSelect={setSelectedEnvironment}
              onContinue={handleEnvironmentContinue}
            />
          </div>
        );

      case "breathwork":
        return (
          <div className="min-h-screen pt-24 pb-12 px-4">
            {generateMeditationMutation.isPending ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="animate-pulse">
                  <Sparkles className="h-16 w-16 text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold">Crafting Your Meditation...</h2>
                  <p className="text-muted-foreground">AI is creating a personalized session just for you</p>
                </div>
              </div>
            ) : (
              <BreathworkStudio onComplete={handleBreathworkComplete} />
            )}
          </div>
        );

      case "meditation":
        return selectedMood ? (
          <MeditationPlayer
            mood={selectedMood}
            script={generatedScript}
            duration={sessionDuration}
            environment={selectedEnvironment}
            onComplete={handleMeditationComplete}
          />
        ) : null;

      default:
        return null;
    }
  };

  return renderContent();
}
