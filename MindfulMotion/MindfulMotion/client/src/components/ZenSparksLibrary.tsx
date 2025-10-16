import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Zap } from "lucide-react";
import { zenSparks } from "@shared/schema";
import type { MoodType } from "@shared/schema";

interface ZenSparksLibraryProps {
  onSelect: (duration: number, mood: MoodType) => void;
}

export function ZenSparksLibrary({ onSelect }: ZenSparksLibraryProps) {
  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-chart-5">
          <Zap className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold">Zen Sparks</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Quick meditation sessions for instant calm. Perfect for busy moments when you need rapid serenity.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {zenSparks.map((spark) => (
          <Card key={spark.id} className="hover-elevate">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{spark.title}</span>
                <div className="flex items-center gap-1 text-chart-4">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{spark.duration}m</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{spark.description}</p>
              <Button
                onClick={() => onSelect(spark.duration, spark.mood as MoodType)}
                className="w-full"
                data-testid={`button-zen-spark-${spark.id}`}
              >
                Start Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
