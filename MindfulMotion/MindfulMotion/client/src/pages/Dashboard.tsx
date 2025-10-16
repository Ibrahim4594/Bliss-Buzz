import { useQuery } from "@tanstack/react-query";
import { SerenityDashboard } from "@/components/SerenityDashboard";
import type { MeditationSession, UserStats } from "@shared/schema";

export default function Dashboard() {
  const { data: sessions = [] } = useQuery<MeditationSession[]>({
    queryKey: ["/api/sessions"],
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/stats"],
  });

  return <SerenityDashboard sessions={sessions} stats={stats || null} />;
}
