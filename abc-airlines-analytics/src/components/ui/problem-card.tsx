import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'

interface ProblemCardProps {
  title: string
  description: string
  currentCost: number
  potentialSavings: number
  status: 'critical' | 'warning' | 'info'
  href: string
  className?: string
}

export function ProblemCard({
  title,
  description,
  currentCost,
  potentialSavings,
  status,
  href,
  className,
}: ProblemCardProps) {
  const statusColors = {
    critical: 'border-red-500 bg-red-500/5',
    warning: 'border-amber-500 bg-amber-500/5',
    info: 'border-blue-500 bg-blue-500/5',
  }

  const statusIndicators = {
    critical: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
  }

  return (
    <Link href={href}>
      <div className={cn("problem-card", statusColors[status], className)}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div
              className={cn(
                "w-3 h-3 rounded-full mr-3",
                statusIndicators[status]
              )}
            />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </div>

        <p className="text-slate-300 text-sm mb-4 leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Current Cost
            </p>
            <p className="text-lg font-bold text-red-400">
              {formatCurrency(currentCost)}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
              Potential Savings
            </p>
            <p className="text-lg font-bold text-green-400">
              {formatCurrency(potentialSavings)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}