import { 
  DollarSign, 
  AlertTriangle, 
  TrendingUp, 
  Users,
  Target,
  Clock
} from 'lucide-react'
import { MetricCard } from '@/components/ui/metric-card'
import { ProblemCard } from '@/components/ui/problem-card'
import { DecisionCard } from '@/components/ui/decision-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency } from '@/lib/utils'

export default function Dashboard() {
  const { keyMetrics, decisionQueue } = dummyData

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Executive Dashboard
        </h1>
        <p className="text-slate-400">
          Real-time insights for ABC Airlines operations and optimization opportunities
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Savings Opportunity"
            value={formatCurrency(keyMetrics.totalSavingsOpportunity)}
            subtitle="Annual optimization potential"
            icon={<Target className="w-8 h-8" />}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Daily Cost of Inefficiency"
            value={formatCurrency(keyMetrics.currentDailyCost)}
            subtitle="Lost revenue per day"
            icon={<Clock className="w-8 h-8" />}
            trend={{ value: -8, isPositive: false }}
          />
          <MetricCard
            title="Compliance Risk Score"
            value={`${keyMetrics.complianceRiskScore}/100`}
            subtitle="Regulatory compliance status"
            icon={<AlertTriangle className="w-8 h-8" />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Crew Utilization"
            value={`${keyMetrics.crewUtilization}%`}
            subtitle={`Target: ${keyMetrics.targetUtilization}%`}
            icon={<Users className="w-8 h-8" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>
      </section>

      {/* Problem Overview */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Critical Business Problems</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProblemCard
            title="Crew Scheduling Crisis"
            description="$8M in annual overtime costs due to poor scheduling. 15+ regulatory violations per quarter and 35% crew turnover rate."
            currentCost={keyMetrics.overtimeCosts}
            potentialSavings={8000000}
            status="critical"
            href="/crew-scheduling"
          />
          <ProblemCard
            title="Route Profitability Blindness"
            description="20% of routes operating at a loss. $15M annual revenue leakage from poor pricing decisions and network misallocation."
            currentCost={keyMetrics.routeLosses}
            potentialSavings={15000000}
            status="warning"
            href="/route-profitability"
          />
          <ProblemCard
            title="Ancillary Revenue Gap"
            description="8% attachment rate vs 25% industry average. $20M untapped revenue opportunity from better personalization."
            currentCost={keyMetrics.ancillaryGap}
            potentialSavings={20000000}
            status="info"
            href="/ancillary-revenue"
          />
        </div>
      </section>

      {/* Decision Queue */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Priority Decisions</h2>
        <p className="text-slate-400 mb-6">
          Critical decisions that need your attention today
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decisionQueue.map((decision) => (
            <DecisionCard
              key={decision.id}
              title={decision.title}
              cost={decision.cost}
              alternative={decision.alternative}
              urgency={decision.urgency}
              type={decision.type}
            />
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ready to Start Optimizing?
              </h3>
              <p className="text-blue-100">
                Every day of delay costs you {formatCurrency(keyMetrics.currentDailyCost)}. 
                Start with Phase 1 quick wins and see results in 30 days.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Start Implementation
              </button>
              <button className="px-6 py-3 border border-blue-300 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                View Roadmap
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}