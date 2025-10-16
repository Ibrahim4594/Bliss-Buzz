import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Flame, Clock, TrendingUp, Award } from "lucide-react";
import type { MeditationSession, UserStats, MeditationLevel } from "@shared/schema";
import { levelThresholds } from "@shared/schema";

interface SerenityDashboardProps {
  sessions: MeditationSession[];
  stats: UserStats | null;
}

export function SerenityDashboard({ sessions, stats }: SerenityDashboardProps) {
  // Calculate progress to next level
  const getNextLevel = (currentLevel: MeditationLevel): MeditationLevel | null => {
    const levels: MeditationLevel[] = ["Beginner", "Intermediate", "Advanced", "Master"];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
  };

  const calculateProgress = () => {
    if (!stats) return { progress: 0, nextLevel: null, requirement: "" };
    
    const nextLevel = getNextLevel(stats.meditationLevel as MeditationLevel);
    if (!nextLevel) return { progress: 100, nextLevel: null, requirement: "Master Level Achieved!" };

    const threshold = levelThresholds[nextLevel];
    const sessionProgress = (stats.totalSessions / threshold.minSessions) * 100;
    const minuteProgress = (stats.totalMinutes / threshold.minMinutes) * 100;
    const streakProgress = (stats.currentStreak / threshold.minStreak) * 100;
    
    const progress = Math.min((sessionProgress + minuteProgress + streakProgress) / 3, 100);
    
    const requirement = `${threshold.minSessions} sessions, ${threshold.minMinutes} minutes, ${threshold.minStreak} day streak`;
    
    return { progress, nextLevel, requirement };
  };

  const levelProgress = calculateProgress();

  // Prepare mood trend data
  const moodData = sessions.slice(-7).map((session, index) => ({
    day: `Day ${index + 1}`,
    mood: session.mood,
    duration: session.duration,
  }));

  // Prepare weekly stats
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const dayIndex = 6 - i;
    const daySessions = sessions.filter((s, idx) => idx >= sessions.length - 7 + dayIndex && idx < sessions.length - 7 + dayIndex + 1);
    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex],
      minutes: daySessions.reduce((sum, s) => sum + s.duration, 0),
    };
  }).reverse();

  const statCards = [
    {
      title: "Total Sessions",
      value: stats?.totalSessions || 0,
      icon: Activity,
      color: "text-chart-1",
      testId: "stat-total-sessions",
    },
    {
      title: "Current Streak",
      value: `${stats?.currentStreak || 0} days`,
      icon: Flame,
      color: "text-chart-5",
      testId: "stat-current-streak",
    },
    {
      title: "Total Minutes",
      value: stats?.totalMinutes || 0,
      icon: Clock,
      color: "text-chart-3",
      testId: "stat-total-minutes",
    },
    {
      title: "Longest Streak",
      value: `${stats?.longestStreak || 0} days`,
      icon: TrendingUp,
      color: "text-chart-2",
      testId: "stat-longest-streak",
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Master":
        return "bg-chart-5 text-white";
      case "Advanced":
        return "bg-chart-2 text-white";
      case "Intermediate":
        return "bg-chart-3 text-white";
      default:
        return "bg-chart-1 text-white";
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Your Serenity Journey</h1>
        <p className="text-muted-foreground">Track your transformation from buzz to bliss</p>
        
        {stats && (
          <div className="flex flex-col items-center gap-3 pt-2">
            <Badge 
              className={`px-4 py-2 text-lg gap-2 ${getLevelColor(stats.meditationLevel || "Beginner")}`}
              data-testid="meditation-level-badge"
            >
              <Award className="h-5 w-5" />
              {stats.meditationLevel || "Beginner"}
            </Badge>
            
            {levelProgress.nextLevel && (
              <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Next: {levelProgress.nextLevel}</span>
                      <span className="font-medium">{Math.round(levelProgress.progress)}%</span>
                    </div>
                    <Progress value={levelProgress.progress} className="h-2" data-testid="level-progress" />
                    <p className="text-xs text-muted-foreground text-center pt-1">
                      Requirement: {levelProgress.requirement}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover-elevate">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  {stat.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold" data-testid={stat.testId}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="minutes" fill="hsl(var(--chart-1))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meditation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={moodData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="duration" 
                  stroke="hsl(var(--chart-3))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--chart-3))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {sessions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sessions.slice(-5).reverse().map((session, index) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card border hover-elevate"
                  data-testid={`session-history-${index}`}
                >
                  <div>
                    <p className="font-medium capitalize">{session.mood} Meditation</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {session.environment} • {session.duration} min
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      {new Date(session.completedAt || "").toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
