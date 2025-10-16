import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface AudioEngineProps {
  isPlaying: boolean;
  frequency: "alpha" | "theta" | "delta";
}

export function AudioEngine({ isPlaying, frequency }: AudioEngineProps) {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const oscillatorRef = useRef<Tone.Oscillator | null>(null);
  const gainNodeRef = useRef<Tone.Gain | null>(null);

  // Frequency mapping for binaural beats
  const frequencyMap = {
    alpha: 10, // 10 Hz - Relaxed alertness, meditation
    theta: 6, // 6 Hz - Deep meditation, creativity
    delta: 2, // 2 Hz - Deep sleep, healing
  };

  useEffect(() => {
    // Initialize audio nodes
    gainNodeRef.current = new Tone.Gain(0.5).toDestination();
    oscillatorRef.current = new Tone.Oscillator({
      frequency: frequencyMap[frequency],
      type: "sine",
    }).connect(gainNodeRef.current);

    return () => {
      // Cleanup on unmount
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.dispose();
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.dispose();
      }
    };
  }, []);

  // Update frequency when prop changes
  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.frequency.value = frequencyMap[frequency];
    }
  }, [frequency]);

  // Control playback
  useEffect(() => {
    const startAudio = async () => {
      if (isPlaying && oscillatorRef.current && gainNodeRef.current) {
        await Tone.start();
        oscillatorRef.current.start();
        gainNodeRef.current.gain.value = isMuted ? 0 : volume / 100;
      } else if (!isPlaying && oscillatorRef.current) {
        oscillatorRef.current.stop();
      }
    };

    startAudio();
  }, [isPlaying, isMuted, volume]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.rampTo(isMuted ? 0 : volume / 100, 0.1);
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="space-y-4 backdrop-blur-md bg-background/20 p-4 rounded-xl">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Binaural Beats</Label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground capitalize">
            {frequency} ({frequencyMap[frequency]} Hz)
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleMute}
          data-testid="button-audio-mute"
          className="shrink-0"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        
        <div className="flex-1 space-y-2">
          <Slider
            value={[volume]}
            onValueChange={(values) => setVolume(values[0])}
            max={100}
            step={1}
            disabled={isMuted}
            data-testid="slider-audio-volume"
            className="w-full"
          />
        </div>

        <span className="text-xs text-muted-foreground w-10 text-right" data-testid="text-volume-value">
          {isMuted ? "0" : volume}%
        </span>
      </div>
    </div>
  );
}
