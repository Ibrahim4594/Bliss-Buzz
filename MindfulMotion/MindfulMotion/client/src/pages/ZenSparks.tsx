import { useLocation } from "wouter";
import { ZenSparksLibrary } from "@/components/ZenSparksLibrary";
import type { MoodType } from "@shared/schema";

export default function ZenSparks() {
  const [, setLocation] = useLocation();

  const handleSelect = (duration: number, mood: MoodType) => {
    setLocation(`/meditate?mood=${mood}&duration=${duration}&quick=true`);
  };

  return <ZenSparksLibrary onSelect={handleSelect} />;
}
