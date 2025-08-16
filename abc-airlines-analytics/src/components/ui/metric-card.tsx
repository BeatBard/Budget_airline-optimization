import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  icon?: React.ReactNode
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  className,
  icon 
}: MetricCardProps) {
  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span 
                className={cn(
                  "text-sm font-medium",
                  trend.isPositive ? "text-green-400" : "text-red-400"
                )}
              >
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-slate-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-blue-400 opacity-80">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}