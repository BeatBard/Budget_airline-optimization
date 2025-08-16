import { useState } from 'react'
import { 
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Bell,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  DollarSign,
  Activity
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Recommendation, Alert } from '@/data/route-profitability-data'

interface InsightsAlertsWindowProps {
  onNavigate: (window: string) => void
  recommendations: Recommendation[]
  alerts: Alert[]
}

export default function InsightsAlertsWindow({ onNavigate, recommendations, alerts }: InsightsAlertsWindowProps) {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'alerts'>('recommendations')
  const [filterUrgency, setFilterUrgency] = useState('all')
  const [filterType, setFilterType] = useState('all')

  // Filter recommendations
  const filteredRecommendations = recommendations.filter(rec => {
    if (filterUrgency !== 'all' && rec.urgency !== filterUrgency) return false
    if (filterType !== 'all' && rec.type !== filterType) return false
    return true
  })

  // Filter alerts
  const filteredAlerts = alerts.filter(alert => {
    if (filterUrgency !== 'all' && alert.urgency !== filterUrgency) return false
    if (filterType !== 'all' && alert.type !== filterType) return false
    return true
  })

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'medium': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'High': return <TrendingUp className="w-4 h-4 text-red-400" />
      case 'Medium': return <Target className="w-4 h-4 text-orange-400" />
      case 'Low': return <Activity className="w-4 h-4 text-green-400" />
      default: return <Activity className="w-4 h-4 text-slate-400" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'immediate_actions': return <Zap className="w-4 h-4 text-red-400" />
      case 'tactical_improvements': return <Target className="w-4 h-4 text-orange-400" />
      case 'strategic_decisions': return <TrendingUp className="w-4 h-4 text-blue-400" />
      case 'performance_degradation': return <TrendingDown className="w-4 h-4 text-red-400" />
      case 'competitive_threats': return <AlertTriangle className="w-4 h-4 text-orange-400" />
      case 'opportunity_windows': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'operational_issues': return <AlertTriangle className="w-4 h-4 text-red-400" />
      default: return <Bell className="w-4 h-4 text-slate-400" />
    }
  }

  // Calculate stats
  const highPriorityAlerts = alerts.filter(a => a.urgency === 'high').length
  const totalSavingsOpportunity = recommendations.reduce((sum, rec) => sum + Math.abs(rec.potential_savings), 0)
  const immediateActions = recommendations.filter(rec => rec.type === 'immediate_actions').length

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
              Insights & Alerts
            </h2>
            <p className="text-slate-400">
              Automated recommendations and proactive alerts for network optimization
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            highPriorityAlerts > 0 ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
          }`}>
            {highPriorityAlerts} High Priority Alerts
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Savings</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(totalSavingsOpportunity)}</p>
              <p className="text-green-400 text-sm">Identified opportunities</p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
              <p className="text-orange-400 text-sm">{highPriorityAlerts} high priority</p>
            </div>
            <div className="p-3 bg-orange-500/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Recommendations</p>
              <p className="text-2xl font-bold text-white">{recommendations.length}</p>
              <p className="text-blue-400 text-sm">{immediateActions} immediate actions</p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Implementation</p>
              <p className="text-2xl font-bold text-white">85%</p>
              <p className="text-green-400 text-sm">Success rate</p>
            </div>
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 bg-slate-700 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'recommendations'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
            Recommendations ({recommendations.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-600'
            }`}
          >
            Alerts ({alerts.length})
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <select 
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Urgency</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            {activeTab === 'recommendations' ? (
              <>
                <option value="immediate_actions">Immediate Actions</option>
                <option value="tactical_improvements">Tactical Improvements</option>
                <option value="strategic_decisions">Strategic Decisions</option>
              </>
            ) : (
              <>
                <option value="performance_degradation">Performance Issues</option>
                <option value="competitive_threats">Competitive Threats</option>
                <option value="opportunity_windows">Opportunities</option>
                <option value="operational_issues">Operational Issues</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'recommendations' ? (
        <section>
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => (
              <div key={rec.id} className="metric-card hover:bg-slate-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(rec.type)}
                      <h4 className="text-lg font-semibold text-white">{rec.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(rec.urgency)}`}>
                        {rec.urgency.charAt(0).toUpperCase() + rec.urgency.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 mb-3">{rec.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          {getImpactIcon(rec.impact)}
                        </div>
                        <p className="text-xs text-slate-400">Impact</p>
                        <p className="text-sm font-medium text-white">{rec.impact}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                        </div>
                        <p className="text-xs text-slate-400">Timeline</p>
                        <p className="text-sm font-medium text-white">{rec.timeline}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Target className="w-4 h-4 text-purple-400" />
                        </div>
                        <p className="text-xs text-slate-400">Effort</p>
                        <p className="text-sm font-medium text-white">{rec.effort}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <p className="text-xs text-slate-400">Confidence</p>
                        <p className="text-sm font-medium text-white">{rec.confidence}</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-1">
                          <DollarSign className="w-4 h-4 text-yellow-400" />
                        </div>
                        <p className="text-xs text-slate-400">Savings</p>
                        <p className={`text-sm font-medium ${rec.potential_savings > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(Math.abs(rec.potential_savings))}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Route: {rec.route_id}</span>
                      <div className="flex items-center space-x-2">
                        <button className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center space-x-1">
                          <ThumbsUp className="w-4 h-4" />
                          <span>Approve</span>
                        </button>
                        <button className="text-red-400 hover:text-red-300 text-sm font-medium flex items-center space-x-1">
                          <ThumbsDown className="w-4 h-4" />
                          <span>Dismiss</span>
                        </button>
                        <button 
                          onClick={() => onNavigate('scenarios')}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Analyze</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="metric-card hover:bg-slate-750 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getTypeIcon(alert.type)}
                      <h4 className="text-lg font-semibold text-white">{alert.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(alert.urgency)}`}>
                        {alert.urgency.charAt(0).toUpperCase() + alert.urgency.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-slate-300 mb-2">{alert.description}</p>
                    
                    <div className="bg-slate-700 rounded-lg p-3 mb-3">
                      <p className="text-sm text-slate-400 mb-1">Impact Assessment:</p>
                      <p className="text-sm text-white">{alert.impact_assessment}</p>
                    </div>
                    
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-3">
                      <p className="text-sm text-blue-300 mb-1">Recommended Action:</p>
                      <p className="text-sm text-white">{alert.recommended_action}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-400">Route: {alert.route_id}</span>
                        <span className="text-sm text-slate-400 flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{alert.created_date}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center space-x-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>Acknowledge</span>
                        </button>
                        <button 
                          onClick={() => onNavigate('scenarios')}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Investigate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Action Summary */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Action Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">{immediateActions}</div>
            <p className="text-emerald-100">Immediate actions required</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">{formatCurrency(totalSavingsOpportunity)}</div>
            <p className="text-emerald-100">Total savings potential</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">24hrs</div>
            <p className="text-emerald-100">Average response time</p>
          </div>
        </div>
      </div>
    </div>
  )
}