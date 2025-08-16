import { Clock, AlertCircle, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface DecisionCardProps {
  title: string
  cost: number
  alternative: string
  urgency: 'high' | 'medium' | 'low'
  type: 'crew' | 'route' | 'pricing'
  className?: string
}

export function DecisionCard({
  title,
  cost,
  alternative,
  urgency,
  type,
  className,
}: DecisionCardProps) {
  const urgencyColors = {
    high: 'border-red-500 bg-red-500/10',
    medium: 'border-amber-500 bg-amber-500/10',
    low: 'border-green-500 bg-green-500/10',
  }

  const typeIcons = {
    crew: Clock,
    route: TrendingUp,
    pricing: AlertCircle,
  }

  const Icon = typeIcons[type]

  return (
    <div className={cn("decision-card", urgencyColors[urgency], className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <Icon className="w-4 h-4 text-blue-400 mr-2" />
          <span className={cn(
            "text-xs font-medium px-2 py-1 rounded uppercase tracking-wide",
            urgency === 'high' && "bg-red-500/20 text-red-300",
            urgency === 'medium' && "bg-amber-500/20 text-amber-300",
            urgency === 'low' && "bg-green-500/20 text-green-300"
          )}>
            {urgency} Priority
          </span>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-white mb-2">{title}</h4>
      
      <div className="space-y-2">
        <div>
          <span className="text-xs text-slate-500">Cost:</span>
          <span className="text-sm font-medium text-white ml-2">
            {cost > 0 ? formatCurrency(cost) : 'No cost'}
          </span>
        </div>
        <p className="text-xs text-slate-400">{alternative}</p>
      </div>

      <div className="flex gap-2 mt-4">
        <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
          Approve
        </button>
        <button className="flex-1 px-3 py-2 bg-slate-700 text-slate-300 text-xs font-medium rounded hover:bg-slate-600 transition-colors">
          Review
        </button>
      </div>
    </div>
  )
}