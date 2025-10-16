import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, Waves, Sparkles, Church } from "lucide-react";
import { environments } from "@shared/schema";

interface EnvironmentSelectorProps {
  selectedEnvironment: string;
  onSelect: (environment: string) => void;
  onContinue: () => void;
}

const environmentIcons = {
  bamboo: Trees,
  ocean: Waves,
  aurora: Sparkles,
  temple: Church,
};

export function EnvironmentSelector({
  selectedEnvironment,
  onSelect,
  onContinue,
}: EnvironmentSelectorProps) {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold">Choose Your Sanctuary</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select an immersive environment for your meditation journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {environments.map((env) => {
          const Icon = environmentIcons[env.id as keyof typeof environmentIcons];
          const isSelected = selectedEnvironment === env.id;

          return (
            <Card
              key={env.id}
              className={`p-6 cursor-pointer transition-all hover-elevate active-elevate-2 ${
                isSelected ? "ring-2 ring-primary bg-primary/10" : ""
              }`}
              onClick={() => onSelect(env.id)}
              data-testid={`card-environment-${env.id}`}
            >
              <div className="flex items-center gap-4">
                <div className="text-chart-4">
                  <Icon className="h-12 w-12" />
                </div>
                <div>
                  <h3 className="font-semibold text-xl">{env.name}</h3>
                  <p className="text-muted-foreground">{env.description}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex justify-center pt-4">
        <Button
          size="lg"
          onClick={onContinue}
          disabled={!selectedEnvironment}
          data-testid="button-continue-environment"
          className="px-12 py-6 text-lg rounded-full"
        >
          Begin Meditation
        </Button>
      </div>
    </div>
  );
}
