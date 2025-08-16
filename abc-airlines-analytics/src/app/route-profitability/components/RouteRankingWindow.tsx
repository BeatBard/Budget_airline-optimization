import { useState } from 'react'
import { 
  ArrowLeft,
  Star,
  Trophy,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Filter,
  Search,
  Download,
  BarChart3,
  Target
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'
import { formatCurrency } from '@/lib/utils'
import { RouteScore, routeMasterData } from '@/data/route-profitability-data'

interface RouteRankingWindowProps {
  onNavigate: (window: string) => void
  routeScores: RouteScore[]
}

export default function RouteRankingWindow({ onNavigate, routeScores }: RouteRankingWindowProps) {
  const [sortBy, setSortBy] = useState('total_score')
  const [filterBy, setFilterBy] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Filter and sort routes
  const filteredRoutes = routeScores
    .filter(route => {
      if (filterBy !== 'all' && route.classification !== filterBy) return false
      if (searchTerm && !route.route_id.toLowerCase().includes(searchTerm.toLowerCase())) return false
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'total_score': return b.total_score - a.total_score
        case 'profitability_score': return b.profitability_score - a.profitability_score
        case 'operational_score': return b.operational_score - a.operational_score
        case 'strategic_score': return b.strategic_score - a.strategic_score
        case 'risk_score': return b.risk_score - a.risk_score
        default: return b.total_score - a.total_score
      }
    })

  // BCG Matrix data for scatter plot
  const bcgMatrixData = routeScores.map(route => {
    const routeInfo = routeMasterData.find(r => r.route_id === route.route_id)
    return {
      route_id: route.route_id,
      growth: Math.random() * 20 + 5, // Simulated growth rate
      marketShare: route.strategic_score / 2, // Use strategic score as proxy
      classification: route.classification,
      score: route.total_score
    }
  })

  // Classification stats
  const classificationStats = {
    Stars: routeScores.filter(r => r.classification === 'Stars').length,
    'Cash Cows': routeScores.filter(r => r.classification === 'Cash Cows').length,
    'Question Marks': routeScores.filter(r => r.classification === 'Question Marks').length,
    Dogs: routeScores.filter(r => r.classification === 'Dogs').length
  }

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Stars': return 'text-yellow-400 bg-yellow-500/20'
      case 'Cash Cows': return 'text-blue-400 bg-blue-500/20'
      case 'Question Marks': return 'text-orange-400 bg-orange-500/20'
      case 'Dogs': return 'text-red-400 bg-red-500/20'
      default: return 'text-slate-400 bg-slate-500/20'
    }
  }

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case 'Stars': return <Star className="w-4 h-4" />
      case 'Cash Cows': return <Trophy className="w-4 h-4" />
      case 'Question Marks': return <AlertTriangle className="w-4 h-4" />
      case 'Dogs': return <TrendingDown className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Route Performance Rankings
            </h2>
            <p className="text-slate-400">
              Multi-criteria scoring and BCG matrix classification of all network routes
            </p>
          </div>
        </div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Rankings</span>
        </button>
      </div>

      {/* Classification Overview */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Portfolio Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="metric-card text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-6 h-6 text-yellow-400" />
              <span className="text-lg font-semibold text-white">Stars</span>
            </div>
            <div className="text-2xl font-bold text-yellow-400">{classificationStats.Stars}</div>
            <p className="text-sm text-slate-400">High growth, high share</p>
          </div>
          
          <div className="metric-card text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-semibold text-white">Cash Cows</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">{classificationStats['Cash Cows']}</div>
            <p className="text-sm text-slate-400">Low growth, high share</p>
          </div>
          
          <div className="metric-card text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
              <span className="text-lg font-semibold text-white">Question Marks</span>
            </div>
            <div className="text-2xl font-bold text-orange-400">{classificationStats['Question Marks']}</div>
            <p className="text-sm text-slate-400">High growth, low share</p>
          </div>
          
          <div className="metric-card text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <span className="text-lg font-semibold text-white">Dogs</span>
            </div>
            <div className="text-2xl font-bold text-red-400">{classificationStats.Dogs}</div>
            <p className="text-sm text-slate-400">Low growth, low share</p>
          </div>
        </div>
      </section>

      {/* BCG Matrix */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">BCG Matrix Analysis</h3>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={bcgMatrixData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis 
                dataKey="marketShare" 
                stroke="#94a3b8" 
                label={{ value: 'Market Share', position: 'insideBottom', offset: -5, style: { textAnchor: 'middle', fill: '#94a3b8' } }}
              />
              <YAxis 
                dataKey="growth" 
                stroke="#94a3b8"
                label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8' } }}
              />
              <Tooltip 
                formatter={(value, name, props) => [
                  name === 'marketShare' ? `${Math.round(value as number)}%` : `${Math.round(value as number)}%`,
                  name === 'marketShare' ? 'Market Share' : 'Growth Rate'
                ]}
                labelFormatter={(label) => `Route: ${label}`}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Scatter dataKey="growth" fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-700 p-3 rounded">
              <p className="text-slate-300">Top Right (Stars): High growth, High market share</p>
              <p className="text-yellow-400">Invest for growth</p>
            </div>
            <div className="bg-slate-700 p-3 rounded">
              <p className="text-slate-300">Bottom Right (Cash Cows): Low growth, High market share</p>
              <p className="text-blue-400">Harvest profits</p>
            </div>
            <div className="bg-slate-700 p-3 rounded">
              <p className="text-slate-300">Top Left (Question Marks): High growth, Low market share</p>
              <p className="text-orange-400">Selective investment</p>
            </div>
            <div className="bg-slate-700 p-3 rounded">
              <p className="text-slate-300">Bottom Left (Dogs): Low growth, Low market share</p>
              <p className="text-red-400">Consider divestment</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Detailed Rankings</h3>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <select 
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Classifications</option>
              <option value="Stars">Stars</option>
              <option value="Cash Cows">Cash Cows</option>
              <option value="Question Marks">Question Marks</option>
              <option value="Dogs">Dogs</option>
            </select>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              <option value="total_score">Total Score</option>
              <option value="profitability_score">Profitability</option>
              <option value="operational_score">Operational</option>
              <option value="strategic_score">Strategic</option>
              <option value="risk_score">Risk Score</option>
            </select>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="metric-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-600">
                  <th className="text-left py-3 px-4 text-slate-300">Rank</th>
                  <th className="text-left py-3 px-4 text-slate-300">Route</th>
                  <th className="text-center py-3 px-4 text-slate-300">Total Score</th>
                  <th className="text-center py-3 px-4 text-slate-300">Profitability</th>
                  <th className="text-center py-3 px-4 text-slate-300">Operational</th>
                  <th className="text-center py-3 px-4 text-slate-300">Strategic</th>
                  <th className="text-center py-3 px-4 text-slate-300">Risk</th>
                  <th className="text-center py-3 px-4 text-slate-300">Classification</th>
                  <th className="text-center py-3 px-4 text-slate-300">Trend</th>
                  <th className="text-center py-3 px-4 text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route, index) => (
                  <tr key={route.route_id} className="border-b border-slate-700 hover:bg-slate-750">
                    <td className="py-3 px-4 text-slate-300">
                      {index + 1 <= 3 ? (
                        <div className="flex items-center space-x-2">
                          <Trophy className={`w-4 h-4 ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : 'text-orange-400'}`} />
                          <span>#{index + 1}</span>
                        </div>
                      ) : (
                        `#${index + 1}`
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">{route.route_id}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        route.total_score >= 80 ? 'bg-green-500/20 text-green-300' :
                        route.total_score >= 60 ? 'bg-blue-500/20 text-blue-300' :
                        route.total_score >= 40 ? 'bg-orange-500/20 text-orange-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {route.total_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center text-slate-300">{route.profitability_score}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{route.operational_score}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{route.strategic_score}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{route.risk_score}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getClassificationColor(route.classification)}`}>
                        {getClassificationIcon(route.classification)}
                        <span className="ml-1">{route.classification}</span>
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
                      <button 
                        onClick={() => onNavigate('scenarios')}
                        className="text-blue-400 hover:text-blue-300 text-xs font-medium"
                      >
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

      {/* Score Breakdown Chart */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Score Breakdown - Top 10 Routes</h3>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={filteredRoutes.slice(0, 10)} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="route_id" type="category" stroke="#94a3b8" width={80} />
              <Tooltip 
                formatter={(value, name) => [value, name]}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar dataKey="profitability_score" stackId="a" fill="#10b981" name="Profitability" />
              <Bar dataKey="operational_score" stackId="a" fill="#3b82f6" name="Operational" />
              <Bar dataKey="strategic_score" stackId="a" fill="#8b5cf6" name="Strategic" />
              <Bar dataKey="risk_score" stackId="a" fill="#f59e0b" name="Risk" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Summary Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Ranking Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{filteredRoutes[0]?.route_id}</div>
            <p className="text-purple-100">Top performing route</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{classificationStats.Dogs}</div>
            <p className="text-purple-100">Routes need immediate attention</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">{Math.round(routeScores.reduce((sum, r) => sum + r.total_score, 0) / routeScores.length)}</div>
            <p className="text-purple-100">Average network score</p>
          </div>
        </div>
      </div>
    </div>
  )
}