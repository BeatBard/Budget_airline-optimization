'use client'

import { 
  Zap, 
  Clock, 
  Users,
  TrendingUp,
  Code,
  FileText,
  BarChart3,
  Database
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency } from '@/lib/utils'

export default function GenAIProductivityPage() {
  const { genAiProductivity } = dummyData

  const productivityMetrics = {
    hoursSavedPerMonth: 320,
    teamSizeReduction: { from: 10, to: 3 },
    deliveryTimeline: { from: 24, to: 12 },
    costSavingsAnnual: 5760000
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          GenAI Productivity Dashboard
        </h1>
        <p className="text-slate-400">
          Accelerate delivery and reduce costs through AI-powered development
        </p>
      </div>

      {/* Key Productivity Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Productivity Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Hours Saved Monthly"
            value={productivityMetrics.hoursSavedPerMonth}
            subtitle="Development time reduction"
            icon={<Clock className="w-8 h-8" />}
            trend={{ value: 78, isPositive: true }}
          />
          <MetricCard
            title="Team Size Efficiency"
            value={`${productivityMetrics.teamSizeReduction.from} → ${productivityMetrics.teamSizeReduction.to}`}
            subtitle="People required"
            icon={<Users className="w-8 h-8" />}
            trend={{ value: 70, isPositive: true }}
          />
          <MetricCard
            title="Delivery Timeline"
            value={`${productivityMetrics.deliveryTimeline.from} → ${productivityMetrics.deliveryTimeline.to} months`}
            subtitle="Time to market"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 50, isPositive: true }}
          />
          <MetricCard
            title="Annual Cost Savings"
            value={formatCurrency(productivityMetrics.costSavingsAnnual)}
            subtitle="Labor cost reduction"
            icon={<Zap className="w-8 h-8" />}
            trend={{ value: 85, isPositive: true }}
          />
        </div>
      </section>

      {/* Task Comparison */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Development Task Acceleration</h2>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart 
              data={genAiProductivity} 
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="task" 
                stroke="#94a3b8" 
                angle={-45} 
                textAnchor="end" 
                height={100}
              />
              <YAxis stroke="#94a3b8" label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'traditional') return [`${value} min`, 'Traditional Method']
                  if (name === 'withGenAI') return [`${value} min`, 'With GenAI']
                  return [value, name]
                }}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="traditional" fill="#ef4444" name="traditional" />
              <Bar dataKey="withGenAI" fill="#10b981" name="withGenAI" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Task Breakdown Table */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Detailed Task Analysis</h2>
        <div className="metric-card">
          <div className="table-container">
            <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-300">Task</th>
                <th className="text-right py-3 px-4 text-slate-300">Traditional</th>
                <th className="text-right py-3 px-4 text-slate-300">With GenAI</th>
                <th className="text-right py-3 px-4 text-slate-300">Time Saved</th>
                <th className="text-center py-3 px-4 text-slate-300">Impact</th>
              </tr>
            </thead>
            <tbody>
              {genAiProductivity.map((task, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-750">
                  <td className="py-3 px-4 font-medium text-white">{task.task}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{task.traditional} min</td>
                  <td className="py-3 px-4 text-right text-green-400">{task.withGenAI} min</td>
                  <td className="py-3 px-4 text-right font-medium text-green-400">
                    {task.timeSaved}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      task.timeSaved >= 80 
                        ? 'bg-green-500/20 text-green-300' 
                        : task.timeSaved >= 70
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {task.timeSaved >= 80 ? 'High' : task.timeSaved >= 70 ? 'Medium' : 'Moderate'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Live Demonstrations */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">AI-Powered Development Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="metric-card">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-blue-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Code Generation</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Natural Language Input:</p>
                <p className="text-green-400 text-sm font-mono">
                  "Create a function to calculate flight delay compensation"
                </p>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Generated Code:</p>
                <code className="text-blue-400 text-xs block">
                  function calculateDelayCompensation(delayMinutes, flightDistance) &#123;<br/>
                  &nbsp;&nbsp;// Auto-generated implementation<br/>
                  &#125;
                </code>
              </div>
              <p className="text-xs text-slate-400">Time saved: 25 minutes &rarr; 2 minutes</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-green-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Query Builder</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Request:</p>
                <p className="text-green-400 text-sm">
                  "Show profitable routes with load factor above 75%"
                </p>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Generated SQL:</p>
                <code className="text-blue-400 text-xs block">
                  SELECT route_name, profit, load_factor<br/>
                  FROM routes WHERE profit &gt; 0 AND load_factor &gt; 75
                </code>
              </div>
              <p className="text-xs text-slate-400">Time saved: 30 minutes &rarr; 5 minutes</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-amber-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Documentation</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Auto-Generated:</p>
                <p className="text-amber-400 text-sm">
                  API documentation, user guides, technical specs
                </p>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Features:</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>• Code-to-docs generation</li>
                  <li>• Multi-format output</li>
                  <li>• Version sync</li>
                </ul>
              </div>
              <p className="text-xs text-slate-400">Time saved: 4 hours &rarr; 1 hour</p>
            </div>
          </div>

          <div className="metric-card">
            <div className="flex items-center mb-4">
              <BarChart3 className="w-6 h-6 text-purple-400 mr-3" />
              <h3 className="text-lg font-semibold text-white">Report Generation</h3>
            </div>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Input Data:</p>
                <p className="text-purple-400 text-sm">
                  Raw performance metrics, financial data
                </p>
              </div>
              <div className="bg-slate-700 rounded p-3">
                <p className="text-sm text-slate-300 mb-2">Output:</p>
                <ul className="text-slate-400 text-xs space-y-1">
                  <li>• Executive summaries</li>
                  <li>• Trend analysis</li>
                  <li>• Action recommendations</li>
                </ul>
              </div>
              <p className="text-xs text-slate-400">Time saved: 2 hours &rarr; 30 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Summary */}
      <section>
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">GenAI Implementation ROI</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">78%</p>
              <p className="text-purple-100">Average Time Savings</p>
              <p className="text-sm text-purple-200">Across all development tasks</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">70%</p>
              <p className="text-purple-100">Team Size Reduction</p>
              <p className="text-sm text-purple-200">More output, fewer resources</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">50%</p>
              <p className="text-purple-100">Faster Delivery</p>
              <p className="text-sm text-purple-200">24 months &rarr; 12 months</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(5760000)}</p>
              <p className="text-purple-100">Annual Savings</p>
              <p className="text-sm text-purple-200">Development cost reduction</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors mr-4">
              Implement GenAI Tools
            </button>
            <button className="px-8 py-3 border border-purple-300 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              See Live Demo
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}