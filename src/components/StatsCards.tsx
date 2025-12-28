import { Layers, Target, Clock } from 'lucide-react';

interface StatsCardsProps {
  logCount: number;
  avgConfidence: number;
  processingTime: number;
}

export const StatsCards = ({ logCount, avgConfidence, processingTime }: StatsCardsProps) => {
  const stats = [
    {
      label: 'Logs Detected',
      value: logCount.toString(),
      icon: Layers,
      gradient: 'from-primary to-accent',
    },
    {
      label: 'Avg Confidence',
      value: `${avgConfidence.toFixed(1)}%`,
      icon: Target,
      gradient: 'from-accent to-pink-500',
    },
    {
      label: 'Processing Time',
      value: `${processingTime.toFixed(0)}ms`,
      icon: Clock,
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="stat-card animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className={`text-4xl font-bold gradient-text bg-gradient-to-r ${stat.gradient}`}>
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} opacity-20`}>
              <stat.icon className="h-6 w-6 text-foreground" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
