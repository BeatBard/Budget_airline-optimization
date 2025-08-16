'use client'

import { 
  Calendar, 
  Target,
  TrendingUp,
  CheckCircle,
  Clock,
  DollarSign,
  Zap,
  Users,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency } from '@/lib/utils'

export default function RoadmapPage() {
  const { roadmap } = dummyData

  const valueAccumulation = [
    { phase: 'Start', cumulativeValue: 0 },
    { phase: 'Phase 1', cumulativeValue: 5000000 },
    { phase: 'Phase 2', cumulativeValue: 17000000 },
    { phase: 'Phase 3', cumulativeValue: 37000000 },
    { phase: 'Phase 4', cumulativeValue: 40000000 },
  ]

  const phaseColors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Implementation Roadmap
        </h1>
        <p className="text-slate-400">
          12-month journey to $40M+ in savings with clear milestones and deliverables
        </p>
      </div>

      {/* Overview Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Implementation Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Duration"
            value="12 months"
            subtitle="Full implementation"
            icon={<Calendar className="w-8 h-8" />}
          />
          <MetricCard
            title="Total Value"
            value={formatCurrency(40000000)}
            subtitle="Annual savings potential"
            icon={<Target className="w-8 h-8" />}
          />
          <MetricCard
            title="ROI Timeline"
            value="Month 3"
            subtitle="Break-even point"
            icon={<TrendingUp className="w-8 h-8" />}
          />
          <MetricCard
            title="Quick Wins"
            value="30 days"
            subtitle="First results visible"
            icon={<Zap className="w-8 h-8" />}
          />
        </div>
      </section>

      {/* Value Accumulation Chart */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Value Accumulation Over Time</h2>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={valueAccumulation} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="phase" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Cumulative Value']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Line 
                type="monotone" 
                dataKey="cumulativeValue" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Phase Details */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Implementation Phases</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roadmap.map((phase, index) => (
            <div key={index} className="metric-card border-l-4" style={{borderLeftColor: phaseColors[index]}}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">{phase.phase}</h3>
                  <p className="text-slate-400">{phase.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">
                    {formatCurrency(phase.expectedValue)}
                  </p>
                  <p className="text-sm text-slate-400">Expected Value</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Key Features:</h4>
                <ul className="space-y-1">
                  {phase.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-slate-400">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-600">
                <span className={`px-3 py-1 rounded text-xs font-medium ${
                  index === 0 ? 'bg-blue-500/20 text-blue-300' :
                  index === 1 ? 'bg-green-500/20 text-green-300' :
                  index === 2 ? 'bg-amber-500/20 text-amber-300' :
                  'bg-purple-500/20 text-purple-300'
                }`}>
                  {index === 0 ? 'Quick Wins' :
                   index === 1 ? 'Core Features' :
                   index === 2 ? 'Advanced Analytics' :
                   'Full Scale'}
                </span>
                <div className="flex items-center text-slate-400">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">3 months</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value by Phase Chart */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Value Creation by Phase</h2>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roadmap} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="phase" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Expected Value']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="expectedValue">
                {roadmap.map((entry, index) => (
                  <Bar key={`cell-${index}`} fill={phaseColors[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Implementation Strategy */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Implementation Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="metric-card">
            <div className="flex items-center mb-4">
              <Users className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Team & Resources</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Dedicated implementation team</li>
              <li>• OCTAVE consultancy support</li>
              <li>• Change management program</li>
              <li>• Training & adoption strategy</li>
              <li>• 24/7 technical support</li>
            </ul>
          </div>

          <div className="metric-card">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Success Metrics</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Cost reduction tracking</li>
              <li>• User adoption rates</li>
              <li>• Process efficiency gains</li>
              <li>• ROI measurement</li>
              <li>• Customer satisfaction scores</li>
            </ul>
          </div>

          <div className="metric-card">
            <div className="flex items-center mb-4">
              <Target className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Risk Mitigation</h3>
            </div>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>• Phased rollout approach</li>
              <li>• Pilot program validation</li>
              <li>• Fallback procedures</li>
              <li>• Data backup & recovery</li>
              <li>• Stakeholder communication</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg p-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Start Your Transformation Today
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Every day of delay costs you {formatCurrency(110000)}. Start with Phase 1 quick wins 
              and see measurable results in 30 days, with full ROI in 12 months.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">30</p>
                <p className="text-blue-100 text-sm">Days to first results</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">3</p>
                <p className="text-blue-100 text-sm">Months to ROI positive</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">12</p>
                <p className="text-blue-100 text-sm">Months to full impact</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{formatCurrency(40000000)}</p>
                <p className="text-blue-100 text-sm">Annual savings</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors">
                Start Phase 1 Implementation
              </button>
              <button className="px-8 py-3 border border-blue-300 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                Schedule Strategy Session
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}