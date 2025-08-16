'use client'

import { 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  Plane,
  BarChart3,
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { dummyData } from '@/data/dummy-data'
import { formatCurrency, formatPercentage } from '@/lib/utils'

export default function RouteProfitabilityPage() {
  const { routeProfitability } = dummyData

  const routeChartData = routeProfitability.routes.map(route => ({
    ...route,
    profitMargin: ((route.profit / route.revenue) * 100).toFixed(1)
  }))

  const pricingOptimizationData = [
    { metric: 'Current Revenue', value: routeProfitability.pricingOptimization.currentRevenue },
    { metric: 'Optimized Revenue', value: routeProfitability.pricingOptimization.optimizedRevenue },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Route Profitability Analysis
        </h1>
        <p className="text-slate-400">
          Identify profitable routes, optimize pricing, and eliminate $15M in revenue leakage
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Network Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Routes"
            value="50+"
            subtitle="Across 3 continents"
            icon={<MapPin className="w-8 h-8" />}
          />
          <MetricCard
            title="Profitable Routes"
            value="80%"
            subtitle="40 routes generating profit"
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Loss-Making Routes"
            value="20%"
            subtitle="10 routes need attention"
            icon={<TrendingDown className="w-8 h-8" />}
            trend={{ value: -8, isPositive: false }}
          />
          <MetricCard
            title="Revenue Optimization"
            value={formatPercentage(routeProfitability.pricingOptimization.upliftPotential)}
            subtitle="Potential increase"
            icon={<Target className="w-8 h-8" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>
      </section>

      {/* Route Performance Chart */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Route Performance Overview</h2>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={routeChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'revenue') return [formatCurrency(value as number), 'Revenue']
                  if (name === 'profit') return [formatCurrency(value as number), 'Profit']
                  return [value, name]
                }}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
              <Bar dataKey="profit" fill="#10b981" name="profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Route Analysis Table */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Detailed Route Analysis</h2>
        <div className="metric-card">
          <div className="table-container">
            <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-slate-600">
                <th className="text-left py-3 px-4 text-slate-300">Route</th>
                <th className="text-right py-3 px-4 text-slate-300">Revenue</th>
                <th className="text-right py-3 px-4 text-slate-300">Profit</th>
                <th className="text-right py-3 px-4 text-slate-300">Load Factor</th>
                <th className="text-center py-3 px-4 text-slate-300">Status</th>
                <th className="text-center py-3 px-4 text-slate-300">Action</th>
              </tr>
            </thead>
            <tbody>
              {routeProfitability.routes.map((route, index) => (
                <tr key={index} className="border-b border-slate-700 hover:bg-slate-750">
                  <td className="py-3 px-4 font-medium text-white">{route.name}</td>
                  <td className="py-3 px-4 text-right text-slate-300">{formatCurrency(route.revenue)}</td>
                  <td className={`py-3 px-4 text-right font-medium ${
                    route.profit > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(route.profit)}
                  </td>
                  <td className="py-3 px-4 text-right text-slate-300">{route.loadFactor}%</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      route.status === 'profitable' 
                        ? 'bg-green-500/20 text-green-300' 
                        : 'bg-red-500/20 text-red-300'
                    }`}>
                      {route.status === 'profitable' ? 'Profitable' : 'Loss-making'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                      {route.status === 'profitable' ? 'Optimize' : 'Investigate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Pricing Optimization */}
      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Pricing Optimization Opportunity</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue Potential</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pricingOptimizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="metric" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
                <Tooltip 
                  formatter={(value) => [formatCurrency(value as number), 'Revenue']}
                  labelStyle={{ color: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-center">
              <p className="text-2xl font-bold text-green-400">
                {formatCurrency(
                  routeProfitability.pricingOptimization.optimizedRevenue - 
                  routeProfitability.pricingOptimization.currentRevenue
                )}
              </p>
              <p className="text-sm text-slate-400">Additional Annual Revenue</p>
            </div>
          </div>

          <div className="metric-card">
            <h3 className="text-lg font-semibold text-white mb-4">Optimization Strategies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Dynamic Pricing</p>
                  <p className="text-sm text-slate-400">Real-time demand-based pricing</p>
                </div>
                <span className="text-green-400 font-medium">+8%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Competitor Monitoring</p>
                  <p className="text-sm text-slate-400">Automated price matching</p>
                </div>
                <span className="text-green-400 font-medium">+5%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Seasonal Optimization</p>
                  <p className="text-sm text-slate-400">Historical pattern analysis</p>
                </div>
                <span className="text-green-400 font-medium">+3%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <div>
                  <p className="font-medium text-white">Route Discontinuation</p>
                  <p className="text-sm text-slate-400">Eliminate loss-making routes</p>
                </div>
                <span className="text-red-400 font-medium">Stop Losses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Recommendations */}
      <section>
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Network Optimization Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">Drop Madrid-Rome</p>
              <p className="text-blue-100 text-sm">Save $3M annually</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">Increase NYC-Miami</p>
              <p className="text-blue-100 text-sm">Gain $2M annually</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <p className="text-white font-medium">Optimize Aircraft Mix</p>
              <p className="text-blue-100 text-sm">Save $1M annually</p>
            </div>
          </div>
          <div className="text-center mt-6">
            <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors mr-4">
              Implement Changes
            </button>
            <button className="px-8 py-3 border border-blue-300 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Download Analysis
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}