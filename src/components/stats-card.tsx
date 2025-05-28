import { ArrowUp, Heart, Package, Award } from 'lucide-react';

export function StatsCard({
  title,
  value,
  icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: string;
}) {
  const IconComponent = {
    package: Package,
    heart: Heart,
    award: Award,
  }[icon];

  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
            <ArrowUp className="h-4 w-4 text-green-500" />
            {trend}
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          {IconComponent && (
            <IconComponent className="h-6 w-6 text-foreground" />
          )}
        </div>
      </div>
    </div>
  );
} 