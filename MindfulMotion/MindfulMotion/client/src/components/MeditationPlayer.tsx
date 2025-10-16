import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Pause, Box } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ThreeDEnvironment } from "./ThreeDEnvironment";
import { AudioEngine } from "./AudioEngine";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { MoodType } from "@shared/schema";

interface MeditationPlayerProps {
  mood: MoodType;
  script: string;
  duration: number;
  environment: string;
  onComplete: () => void;
}

const environmentBackgrounds = {
  bamboo: "bg-gradient-to-br from-emerald-900/40 to-green-950/60",
  ocean: "bg-gradient-to-br from-blue-900/40 to-cyan-950/60",
  aurora: "bg-gradient-to-br from-purple-900/40 to-indigo-950/60",
  temple: "bg-gradient-to-br from-amber-900/40 to-orange-950/60",
};

export function MeditationPlayer({
  mood,
  script,
  duration,
  environment,
  onComplete,
}: MeditationPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(duration * 60); // Convert to seconds
  const [use3D, setUse3D] = useState(false);
  const [frequency, setFrequency] = useState<"alpha" | "theta" | "delta">("alpha");

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsPlaying(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });

      setProgress((prev) => {
        const newProgress = ((duration * 60 - timeRemaining) / (duration * 60)) * 100;
        return Math.min(newProgress, 100);
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration, timeRemaining, onComplete]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const bgClass = environmentBackgrounds[environment as keyof typeof environmentBackgrounds] || environmentBackgrounds.bamboo;

  return (
    <div className={`min-h-screen flex flex-col ${use3D ? '' : bgClass} backdrop-blur-sm relative`}>
      {use3D && <ThreeDEnvironment environment={environment} />}
      
      <div className="absolute top-4 right-4 z-20">
        <div className="flex items-center gap-3 backdrop-blur-md bg-background/30 px-4 py-2 rounded-full">
          <Box className="h-4 w-4" />
          <Label htmlFor="3d-mode" className="text-sm cursor-pointer">
            3D Mode
          </Label>
          <Switch
            id="3d-mode"
            checked={use3D}
            onCheckedChange={setUse3D}
            data-testid="switch-3d-mode"
          />
        </div>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-4xl w-full space-y-12">
          <div className="text-center space-y-6 backdrop-blur-md bg-background/30 p-8 rounded-3xl">
            <h2 className="text-2xl font-semibold text-primary capitalize">
              {mood} Meditation
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <p className="font-serif text-xl md:text-2xl leading-relaxed text-foreground whitespace-pre-line">
                {script}
              </p>
            </div>
          </div>

          <div className="space-y-6 backdrop-blur-md bg-background/20 p-6 rounded-2xl">
            <Progress value={progress} className="h-2" data-testid="progress-meditation" />
            
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">Time Remaining</p>
                <p className="text-3xl font-bold tabular-nums" data-testid="text-time-remaining">
                  {formatTime(timeRemaining)}
                </p>
              </div>

              <Button
                size="lg"
                onClick={togglePlayPause}
                data-testid="button-meditation-toggle"
                className="rounded-full w-20 h-20"
                variant="default"
              >
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8 ml-1" />}
              </Button>

              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="text-3xl font-bold tabular-nums">
                  {duration} min
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 backdrop-blur-md bg-background/20 p-4 rounded-xl">
              <Label className="text-sm font-medium">Frequency</Label>
              <Select value={frequency} onValueChange={(value: "alpha" | "theta" | "delta") => setFrequency(value)}>
                <SelectTrigger className="w-40" data-testid="select-frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alpha" data-testid="option-alpha">Alpha (10 Hz)</SelectItem>
                  <SelectItem value="theta" data-testid="option-theta">Theta (6 Hz)</SelectItem>
                  <SelectItem value="delta" data-testid="option-delta">Delta (2 Hz)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AudioEngine isPlaying={isPlaying} frequency={frequency} />
          </div>
        </div>
      </div>
    </div>
  );
}
