'use client'

import { 
  DollarSign, 
  Users, 
  TrendingUp,
  ShoppingBag,
  Target,
  Zap,
  PieChart,
  BarChart3
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsaPieChart, Pie, Cell } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function AncillaryRevenuePage() {
  const { ancillaryRevenue } = dummyData

  const segmentColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
  const productColors = ['#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899']

  const personalizationComparison = [
    { approach: 'Generic Offer', conversion: 8, revenue: 12 },
    { approach: 'Personalized Offer', conversion: 24, revenue: 35 },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ancillary Revenue Maximizer
        </h1>
        <p className="text-slate-400">
          Unlock $20M in untapped revenue through personalization and optimization
        </p>
      </div>

      {/* Current State Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Current Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Attachment Rate"
            value={formatPercentage(ancillaryRevenue.currentMetrics.attachmentRate)}
            subtitle={`Industry: ${formatPercentage(25)}`}
            icon={<ShoppingBag className="w-8 h-8" />}
            trend={{ value: -17, isPositive: false }}
          />
          <MetricCard
            title="Revenue per Passenger"
            value={formatCurrency(ancillaryRevenue.currentMetrics.revenuePerPassenger)}
            subtitle={`Industry: ${formatCurrency(ancillaryRevenue.currentMetrics.industryBenchmark)}`}
            icon={<DollarSign className="w-8 h-8" />}
            trend={{ value: -73, isPositive: false }}
          />
          <MetricCard
            title="Conversion Rate"
            value={formatPercentage(ancillaryRevenue.currentMetrics.conversionRate)}
            subtitle="Generic offers only"
            icon={<Target className="w-8 h-8" />}
            trend={{ value: -5, isPositive: false }}
          />
          <MetricCard
            title="Lost Revenue Daily"
            value={formatCurrency(55000)}
            subtitle="Untapped opportunity"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: -15, isPositive: false }}
          />
        </div>
      </section>

      {/* Customer Segmentation */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Customer Segmentation Analysis</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Segments Chart */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Segment Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsaPieChart>
                <Pie
                  data={ancillaryRevenue.segments}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, size}) => `${name}: ${size}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="size"
                >
                  {ancillaryRevenue.segments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={segmentColors[index % segmentColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Size']}
                  labelStyle={{ color: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
              </RechartsaPieChart>
            </ResponsiveContainer>
          </div>

          {/* Segments Table */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Segment Performance</h3>
            <div className="table-container">
              <table className="w-full text-sm min-w-[400px]">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className="text-left py-2 text-slate-300">Segment</th>
                    <th className="text-right py-2 text-slate-300">Size</th>
                    <th className="text-right py-2 text-slate-300">Value</th>
                    <th className="text-right py-2 text-slate-300">Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {ancillaryRevenue.segments.map((segment, index) => (
                    <tr key={index} className="border-b border-slate-700">
                      <td className="py-2 font-medium text-white">{segment.name}</td>
                      <td className="py-2 text-right text-slate-300">{segment.size}%</td>
                      <td className="py-2 text-right text-slate-300">{formatCurrency(segment.value)}</td>
                      <td className="py-2 text-right text-green-400">{segment.conversion}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Product Performance */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Ancillary Product Performance</h2>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={ancillaryRevenue.products} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'attachment') return [`${value}%`, 'Attachment Rate']
                  if (name === 'revenue') return [formatCurrency(value as number), 'Avg Revenue']
                  return [value, name]
                }}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="attachment" fill="#3b82f6" name="attachment" />
              <Bar dataKey="revenue" fill="#10b981" name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Personalization Demo */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Personalization Engine Impact</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Before/After Comparison */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Conversion Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={personalizationComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="approach" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'conversion') return [`${value}%`, 'Conversion Rate']
                    if (name === 'revenue') return [formatCurrency(value as number), 'Revenue per Passenger']
                    return [value, name]
                  }}
                  labelStyle={{ color: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
                <Bar dataKey="conversion" fill="#3b82f6" name="conversion" />
                <Bar dataKey="revenue" fill="#10b981" name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Personalization Strategies */}
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Personalization Strategies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Behavioral Targeting</p>
                  <p className="text-sm text-slate-400">Purchase history analysis</p>
                </div>
                <span className="text-green-400 font-medium">+15%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Dynamic Bundling</p>
                  <p className="text-sm text-slate-400">Smart product combinations</p>
                </div>
                <span className="text-green-400 font-medium">+12%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Price Optimization</p>
                  <p className="text-sm text-slate-400">Willingness-to-pay modeling</p>
                </div>
                <span className="text-green-400 font-medium">+8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">A/B Testing</p>
                  <p className="text-sm text-slate-400">Continuous optimization</p>
                </div>
                <span className="text-blue-400 font-medium">Ongoing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Revenue Impact */}
      <section>
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Optimization Impact</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-white">25%</p>
              <p className="text-green-100">Target Attachment Rate</p>
              <p className="text-sm text-green-200">vs 8% current</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(35)}</p>
              <p className="text-green-100">Revenue per Passenger</p>
              <p className="text-sm text-green-200">vs {formatCurrency(12)} current</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{formatCurrency(20000000)}</p>
              <p className="text-green-100">Annual Impact</p>
              <p className="text-sm text-green-200">Additional revenue</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">+15</p>
              <p className="text-green-100">Satisfaction Points</p>
              <p className="text-sm text-green-200">Customer experience</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-colors mr-4">
              Start Personalization
            </button>
            <button className="px-8 py-3 border border-green-300 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
              View Test Results
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}