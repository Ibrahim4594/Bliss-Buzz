import { useState } from "react";
import { Brain, Zap, CloudRain, Wind, Moon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MoodType } from "@shared/schema";

const moods = [
  {
    id: "anxious" as MoodType,
    label: "Anxious",
    icon: Brain,
    color: "text-chart-2",
    description: "Mind racing, worried",
  },
  {
    id: "stressed" as MoodType,
    label: "Stressed",
    icon: Zap,
    color: "text-chart-5",
    description: "Tense, overwhelmed",
  },
  {
    id: "overwhelmed" as MoodType,
    label: "Overwhelmed",
    icon: CloudRain,
    color: "text-chart-4",
    description: "Too much to handle",
  },
  {
    id: "restless" as MoodType,
    label: "Restless",
    icon: Wind,
    color: "text-chart-1",
    description: "Can't settle down",
  },
  {
    id: "tired" as MoodType,
    label: "Tired",
    icon: Moon,
    color: "text-muted-foreground",
    description: "Exhausted, drained",
  },
  {
    id: "peaceful" as MoodType,
    label: "Peaceful",
    icon: Sparkles,
    color: "text-chart-3",
    description: "Calm, centered",
  },
];

interface MoodCheckInProps {
  onMoodSelect: (mood: MoodType) => void;
}

export function MoodCheckIn({ onMoodSelect }: MoodCheckInProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood);
  };

  const handleContinue = () => {
    if (selectedMood) {
      onMoodSelect(selectedMood);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          How are you feeling?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your emotional state guides your meditation journey. Select what resonates most right now.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {moods.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;

          return (
            <Card
              key={mood.id}
              className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                isSelected ? "ring-2 ring-primary bg-primary/10" : ""
              }`}
              onClick={() => handleMoodSelect(mood.id)}
              data-testid={`card-mood-${mood.id}`}
            >
              <div className="flex flex-col items-center space-y-3 text-center">
                <div className={`${mood.color}`}>
                  <Icon className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{mood.label}</h3>
                  <p className="text-sm text-muted-foreground">{mood.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!selectedMood}
          data-testid="button-continue-mood"
          className="px-12 py-6 text-lg rounded-full"
        >
          Continue to Meditation
        </Button>
      </div>
    </div>
  );
}
