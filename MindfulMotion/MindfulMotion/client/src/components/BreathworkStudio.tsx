import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface BreathworkStudioProps {
  onComplete?: () => void;
}

export function BreathworkStudio({ onComplete }: BreathworkStudioProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [timer, setTimer] = useState(4);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Initialize particles
    const particleCount = 50;
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`,
      alpha: Math.random() * 0.5 + 0.3,
    }));

    const animate = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Update and draw particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.offsetWidth) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.offsetHeight) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color.replace(")", `, ${particle.alpha})`).replace("hsl", "hsla");
        ctx.fill();
      });

      // Draw breathing circle
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const baseRadius = 60;
      const maxRadius = 120;

      let radius = baseRadius;
      let color = "rgba(96, 165, 250, 0.3)"; // Cool blue

      if (isPlaying) {
        if (phase === "inhale") {
          radius = baseRadius + (maxRadius - baseRadius) * (1 - timer / 4);
          color = "rgba(96, 165, 250, 0.4)";
        } else if (phase === "hold") {
          radius = maxRadius;
          color = "rgba(168, 85, 247, 0.4)"; // Purple
        } else {
          radius = maxRadius - (maxRadius - baseRadius) * (1 - timer / 4);
          color = "rgba(96, 165, 250, 0.3)";
        }
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = color.replace("0.3", "0.6").replace("0.4", "0.8");
      ctx.lineWidth = 3;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase, timer, isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (phase === "inhale") {
            setPhase("hold");
            return 4;
          } else if (phase === "hold") {
            setPhase("exhale");
            return 4;
          } else {
            setPhase("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, phase]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale":
        return "Breathe In";
      case "hold":
        return "Hold";
      case "exhale":
        return "Breathe Out";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Breathwork Studio</h2>
        <p className="text-muted-foreground">Follow the breathing pattern to center yourself</p>
      </div>

      <div className="relative w-full max-w-lg aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full rounded-2xl bg-gradient-to-br from-background to-card"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-center space-y-2">
            <p className="text-2xl font-serif text-primary font-semibold">{getPhaseText()}</p>
            <p className="text-6xl font-bold tabular-nums">{timer}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <Button
          size="lg"
          onClick={togglePlayPause}
          data-testid="button-breathwork-toggle"
          className="rounded-full w-16 h-16"
          variant="default"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
      </div>

      {onComplete && (
        <Button
          variant="outline"
          onClick={onComplete}
          data-testid="button-breathwork-complete"
          className="mt-4"
        >
          Complete Session
        </Button>
      )}
    </div>
  );
}
