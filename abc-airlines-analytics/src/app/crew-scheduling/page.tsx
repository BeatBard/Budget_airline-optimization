'use client'

import { 
  Users, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Settings,
  Target,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency } from '@/lib/utils'

export default function CrewSchedulingPage() {
  const { crewScheduling } = dummyData

  const pieChartColors = ['#3b82f6', '#ef4444', '#f59e0b']

  const costBreakdownData = [
    { name: 'Regular Hours', value: crewScheduling.costBreakdown.regularHours, color: '#10b981' },
    { name: 'Overtime', value: crewScheduling.costBreakdown.overtime, color: '#ef4444' },
    { name: 'Idle Time', value: crewScheduling.costBreakdown.idleTime, color: '#f59e0b' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Crew Scheduling Optimizer
        </h1>
        <p className="text-slate-400">
          Eliminate $8M in overtime costs and achieve regulatory compliance through intelligent scheduling
        </p>
      </div>

      {/* Problem Visualization */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Current Problems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Annual Overtime Costs"
            value={formatCurrency(8000000)}
            subtitle="40% above industry average"
            icon={<Clock className="w-8 h-8" />}
            trend={{ value: -25, isPositive: false }}
          />
          <MetricCard
            title="Compliance Violations"
            value="15/quarter"
            subtitle="$50K-$200K per violation"
            icon={<AlertTriangle className="w-8 h-8" />}
            trend={{ value: -30, isPositive: false }}
          />
          <MetricCard
            title="Crew Utilization"
            value="65%"
            subtitle="Target: 85%"
            icon={<Users className="w-8 h-8" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Crew Turnover"
            value="35%"
            subtitle="Industry avg: 20%"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: -18, isPositive: false }}
          />
        </div>
      </section>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Overtime Costs Trend */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Monthly Overtime Costs</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={crewScheduling.monthlyOvertimeCosts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Overtime Cost']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="cost" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-400 mt-2">
            Trending upward due to inefficient manual scheduling
          </p>
        </div>

        {/* Cost Breakdown */}
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Crew Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={costBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, value}) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {costBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Percentage']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-slate-400 mt-2">
            25% overtime allocation is unsustainable
          </p>
        </div>
      </div>

      {/* Compliance Violations */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Compliance Violations (Q2)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {crewScheduling.complianceViolations.map((violation, index) => (
            <div key={index} className="metric-card">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{violation.type}</h4>
                <div className={`w-3 h-3 rounded-full ${
                  violation.severity === 'high' ? 'bg-red-500' :
                  violation.severity === 'medium' ? 'bg-amber-500' : 'bg-green-500'
                }`} />
              </div>
              <p className="text-2xl font-bold text-white">{violation.count}</p>
              <p className="text-sm text-slate-400 capitalize">{violation.severity} severity</p>
            </div>
          ))}
        </div>
      </section>

      {/* Before/After Optimization */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Optimization Impact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before */}
          <div className="metric-card border-red-500/20 bg-red-500/5">
            <div className="flex items-center mb-4">
              <XCircle className="w-6 h-6 text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Current State</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Planning Time</span>
                <span className="text-red-400 font-medium">2 weeks/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Violations</span>
                <span className="text-red-400 font-medium">15/quarter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Overtime Costs</span>
                <span className="text-red-400 font-medium">{formatCurrency(8000000)}/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Crew Satisfaction</span>
                <span className="text-red-400 font-medium">3.2/5</span>
              </div>
            </div>
          </div>

          {/* After */}
          <div className="metric-card border-green-500/20 bg-green-500/5">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              <h3 className="text-lg font-semibold text-white">Optimized State</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Planning Time</span>
                <span className="text-green-400 font-medium">2 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Violations</span>
                <span className="text-green-400 font-medium">0/quarter</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Overtime Costs</span>
                <span className="text-green-400 font-medium">{formatCurrency(4800000)}/year</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Crew Satisfaction</span>
                <span className="text-green-400 font-medium">4.2/5</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Benefits */}
      <section>
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(3200000)}</p>
              <p className="text-green-100">Annual Savings</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">95%</p>
              <p className="text-green-100">Time Reduction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">100%</p>
              <p className="text-green-100">Compliance Rate</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">+31%</p>
              <p className="text-green-100">Satisfaction Increase</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors">
              Implement Optimization
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}