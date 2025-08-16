import { 
  MapPin, 
  TrendingUp, 
  TrendingDown,
  Target,
  DollarSign,
  Plane,
  Activity,
  ArrowRight,
  AlertTriangle,
  Star,
  BarChart3
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { MetricCard } from '@/components/ui/metric-card'
import { formatCurrency, formatPercentage } from '@/lib/utils'
import { RouteScore } from '@/data/route-profitability-data'

interface DashboardWindowProps {
  onNavigate: (window: string) => void
  routeScores: RouteScore[]
}

export default function DashboardWindow({ onNavigate, routeScores }: DashboardWindowProps) {
  // Calculate dashboard metrics
  const totalRoutes = routeScores.length
  const profitableRoutes = routeScores.filter(r => r.classification === 'Stars' || r.classification === 'Cash Cows').length
  const lossMakingRoutes = routeScores.filter(r => r.classification === 'Dogs').length
  const questionMarkRoutes = routeScores.filter(r => r.classification === 'Question Marks').length

  // Top 10 routes for overview
  const topRoutes = routeScores.slice(0, 10)

  // Route classification data for pie chart
  const classificationData = [
    { name: 'Stars', value: routeScores.filter(r => r.classification === 'Stars').length, color: '#10b981' },
    { name: 'Cash Cows', value: routeScores.filter(r => r.classification === 'Cash Cows').length, color: '#3b82f6' },
    { name: 'Question Marks', value: routeScores.filter(r => r.classification === 'Question Marks').length, color: '#f59e0b' },
    { name: 'Dogs', value: routeScores.filter(r => r.classification === 'Dogs').length, color: '#ef4444' }
  ]

  // Performance trend data
  const trendData = [
    { month: 'Jul', score: 68 },
    { month: 'Aug', score: 71 },
    { month: 'Sep', score: 69 },
    { month: 'Oct', score: 73 },
    { month: 'Nov', score: 76 },
    { month: 'Dec', score: 74 }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">
          Network Performance Dashboard
        </h2>
        <p className="text-slate-400">
          Real-time insights into your route network performance and profitability
        </p>
      </div>

      {/* Key Metrics */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Key Performance Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Routes"
            value={totalRoutes.toString()}
            subtitle="Active network routes"
            icon={<MapPin className="w-8 h-8" />}
          />
          <MetricCard
            title="Profitable Routes"
            value={`${Math.round((profitableRoutes / totalRoutes) * 100)}%`}
            subtitle={`${profitableRoutes} routes generating profit`}
            icon={<TrendingUp className="w-8 h-8" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Loss-Making Routes"
            value={`${Math.round((lossMakingRoutes / totalRoutes) * 100)}%`}
            subtitle={`${lossMakingRoutes} routes need attention`}
            icon={<TrendingDown className="w-8 h-8" />}
            trend={{ value: -8, isPositive: false }}
          />
          <MetricCard
            title="Revenue Opportunity"
            value="$15M"
            subtitle="Potential annual savings"
            icon={<Target className="w-8 h-8" />}
            trend={{ value: 12, isPositive: true }}
          />
        </div>
      </section>

      {/* Quick Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Route Classification */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Route Portfolio</h3>
            <button 
              onClick={() => onNavigate('ranking')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>View Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [value, 'Routes']}
                    labelStyle={{ color: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {classificationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-slate-300">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Trend */}
        <div className="metric-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Network Performance Trend</h3>
            <button 
              onClick={() => onNavigate('profitability')}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
            >
              <span>View Analysis</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value) => [value, 'Average Score']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="score" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Routes */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Top Performing Routes</h3>
          <button 
            onClick={() => onNavigate('ranking')}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All Rankings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="metric-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300">Rank</th>
                  <th className="text-left py-3 px-4 text-slate-300">Route</th>
                  <th className="text-center py-3 px-4 text-slate-300">Score</th>
                  <th className="text-center py-3 px-4 text-slate-300">Classification</th>
                  <th className="text-center py-3 px-4 text-slate-300">Trend</th>
                  <th className="text-center py-3 px-4 text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {topRoutes.map((route, index) => (
                  <tr key={route.route_id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 px-4 text-slate-300">#{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-white">{route.route_id}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                        {route.total_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        route.classification === 'Stars' ? 'bg-yellow-500/20 text-yellow-300' :
                        route.classification === 'Cash Cows' ? 'bg-blue-500/20 text-blue-300' :
                        route.classification === 'Question Marks' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {route.classification === 'Stars' && <Star className="w-3 h-3 mr-1" />}
                        {route.classification}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {route.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-green-400 mx-auto" />
                      ) : route.trend === 'down' ? (
                        <TrendingDown className="w-4 h-4 text-red-400 mx-auto" />
                      ) : (
                        <Activity className="w-4 h-4 text-yellow-400 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-400 hover:text-blue-300 text-xs font-medium">
                        Analyze
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => onNavigate('profitability')}
            className="metric-card hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white">Analyze Profitability</p>
                <p className="text-sm text-slate-400">Deep dive into route performance</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('scenarios')}
            className="metric-card hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Target className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-white">Run Scenarios</p>
                <p className="text-sm text-slate-400">Test what-if situations</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('insights')}
            className="metric-card hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-white">View Alerts</p>
                <p className="text-sm text-slate-400">Check critical insights</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => onNavigate('ranking')}
            className="metric-card hover:bg-slate-750 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-white">Route Rankings</p>
                <p className="text-sm text-slate-400">Compare all routes</p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Summary Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Executive Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">$15M</div>
            <p className="text-blue-100">Annual Revenue Opportunity</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">{lossMakingRoutes}</div>
            <p className="text-blue-100">Routes Need Immediate Action</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">85%</div>
            <p className="text-blue-100">Prediction Accuracy</p>
          </div>
        </div>
      </div>
    </div>
  )
}