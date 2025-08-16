import { 
  Target,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Settings,
  ArrowRight
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PrescriptiveAnalyticsProps {
  selectedRoute: string
  timeRange: string
  onRouteChange: (route: string) => void
  onTimeRangeChange: (range: string) => void
}

export default function PrescriptiveAnalytics({ selectedRoute, timeRange }: PrescriptiveAnalyticsProps) {
  // Route scoring based on the specification
  const getRouteScore = (routeId: string) => {
    const scores = {
      'LON-PAR': {
        profitability: 85,  // 40% weight
        operational: 78,    // 25% weight
        strategic: 92,      // 20% weight
        risk: 65,          // 15% weight (inverted)
        total: 79
      },
      'LON-NYC': {
        profitability: 92,
        operational: 85,
        strategic: 95,
        risk: 70,
        total: 87
      },
      'BRS-PRG': {
        profitability: 15,
        operational: 45,
        strategic: 25,
        risk: 25,
        total: 27
      },
      'MIA-NYC': {
        profitability: 78,
        operational: 75,
        strategic: 80,
        risk: 68,
        total: 75
      }
    }
    return scores[routeId as keyof typeof scores] || scores['LON-PAR']
  }

  // Portfolio classification
  const getPortfolioTag = (routeId: string) => {
    const tags = {
      'LON-PAR': 'Cash Cow',
      'LON-NYC': 'Star',
      'BRS-PRG': 'Dog',
      'MIA-NYC': 'Cash Cow'
    }
    return tags[routeId as keyof typeof tags] || 'Question Mark'
  }

  // Recommendations based on route performance
  const getRecommendations = (routeId: string) => {
    const recommendations = {
      'LON-PAR': [
        {
          type: 'tactical_improvements',
          title: 'Optimize departure times',
          description: 'Adjust 2 daily flights to capture more business traffic',
          impact: 'Medium',
          effort: 'Easy',
          timeline: 'Immediate',
          confidence: 'High',
          potentialValue: 850000,
          urgency: 'medium'
        },
        {
          type: 'tactical_improvements',
          title: 'Enhance ancillary offerings',
          description: 'Introduce premium seat selection and fast-track security',
          impact: 'Medium',
          effort: 'Medium',
          timeline: 'Short-term',
          confidence: 'High',
          potentialValue: 620000,
          urgency: 'low'
        }
      ],
      'BRS-PRG': [
        {
          type: 'strategic_decisions',
          title: 'Consider route discontinuation',
          description: 'Route consistently underperforming with low recovery probability',
          impact: 'High',
          effort: 'Medium',
          timeline: 'Short-term',
          confidence: 'High',
          potentialValue: 2400000,
          urgency: 'high'
        },
        {
          type: 'immediate_actions',
          title: 'Reduce frequency to 3x weekly',
          description: 'Cut losses while maintaining minimum service',
          impact: 'High',
          effort: 'Easy',
          timeline: 'Immediate',
          confidence: 'High',
          potentialValue: 1200000,
          urgency: 'high'
        }
      ],
      'LON-NYC': [
        {
          type: 'tactical_improvements',
          title: 'Increase capacity',
          description: 'Add A321 aircraft to capture additional demand',
          impact: 'High',
          effort: 'Medium',
          timeline: 'Short-term',
          confidence: 'High',
          potentialValue: 3200000,
          urgency: 'medium'
        },
        {
          type: 'tactical_improvements',
          title: 'Premium pricing strategy',
          description: 'Implement dynamic pricing for peak business travel',
          impact: 'Medium',
          effort: 'Easy',
          timeline: 'Immediate',
          confidence: 'Medium',
          potentialValue: 1800000,
          urgency: 'low'
        }
      ]
    }
    return recommendations[routeId as keyof typeof recommendations] || recommendations['LON-PAR']
  }

  // What-if scenario results
  const getScenarioResults = (routeId: string) => {
    if (routeId === 'BRS-PRG') {
      return [
        {
          scenario: 'Current State',
          revenue: 800000,
          costs: 1000000,
          profit: -200000,
          roi: -20,
          probability: 100
        },
        {
          scenario: 'Reduce to 3x weekly',
          revenue: 520000,
          costs: 650000,
          profit: -130000,
          roi: -20,
          probability: 95
        },
        {
          scenario: 'Discontinue route',
          revenue: 0,
          costs: 50000, // Exit costs
          profit: -50000,
          roi: 0,
          probability: 100
        },
        {
          scenario: 'Marketing push + pricing',
          revenue: 950000,
          costs: 1100000,
          profit: -150000,
          roi: -15,
          probability: 30
        }
      ]
    } else {
      return [
        {
          scenario: 'Current State',
          revenue: 2500000,
          costs: 2050000,
          profit: 450000,
          roi: 22,
          probability: 100
        },
        {
          scenario: 'Increase frequency',
          revenue: 3200000,
          costs: 2600000,
          profit: 600000,
          roi: 23,
          probability: 85
        },
        {
          scenario: 'Premium pricing',
          revenue: 2750000,
          costs: 2050000,
          profit: 700000,
          roi: 34,
          probability: 70
        },
        {
          scenario: 'Optimize schedule',
          revenue: 2650000,
          costs: 1980000,
          profit: 670000,
          roi: 34,
          probability: 90
        }
      ]
    }
  }

  const routeScore = getRouteScore(selectedRoute)
  const portfolioTag = getPortfolioTag(selectedRoute)
  const recommendations = getRecommendations(selectedRoute)
  const scenarioResults = getScenarioResults(selectedRoute)

  // Radar chart data for route scoring
  const radarData = [
    { subject: 'Profitability', A: routeScore.profitability, fullMark: 100 },
    { subject: 'Operational', A: routeScore.operational, fullMark: 100 },
    { subject: 'Strategic', A: routeScore.strategic, fullMark: 100 },
    { subject: 'Risk (inv)', A: routeScore.risk, fullMark: 100 }
  ]

  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Star': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'Cash Cow': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Question Mark': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'Dog': return 'bg-red-500/20 text-red-300 border-red-500/30'
      default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-orange-400'
      case 'low': return 'text-green-400'
      default: return 'text-slate-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Route Score Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Route Performance Score</h3>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-white mb-2">{routeScore.total}/100</div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getTagColor(portfolioTag)}`}>
              {portfolioTag}
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Profitability (40%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-slate-600 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${routeScore.profitability}%` }} />
                </div>
                <span className="text-white font-medium">{routeScore.profitability}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Operational (25%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-slate-600 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${routeScore.operational}%` }} />
                </div>
                <span className="text-white font-medium">{routeScore.operational}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Strategic (20%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-slate-600 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${routeScore.strategic}%` }} />
                </div>
                <span className="text-white font-medium">{routeScore.strategic}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Risk (15%)</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-slate-600 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${routeScore.risk}%` }} />
                </div>
                <span className="text-white font-medium">{routeScore.risk}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Performance Radar</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
              <PolarRadiusAxis domain={[0, 100]} stroke="#94a3b8" />
              <Radar 
                name="Score" 
                dataKey="A" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recommendations */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-white mb-4">AI-Generated Recommendations</h3>
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-slate-700 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-white">{rec.title}</h4>
                    <span className={`text-sm font-medium ${getUrgencyColor(rec.urgency)}`}>
                      {rec.urgency.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-sm mb-3">{rec.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center">
                      <div className="text-slate-400">Impact</div>
                      <div className={`font-medium ${
                        rec.impact === 'High' ? 'text-red-400' : 
                        rec.impact === 'Medium' ? 'text-orange-400' : 'text-green-400'
                      }`}>{rec.impact}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Effort</div>
                      <div className="text-white font-medium">{rec.effort}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Timeline</div>
                      <div className="text-white font-medium">{rec.timeline}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-slate-400">Value</div>
                      <div className="text-green-400 font-medium">{formatCurrency(rec.potentialValue)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
                    Simulate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What-If Scenario Comparison */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-white mb-4">Scenario Comparison & ROI</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarioResults}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="scenario" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
                <Tooltip 
                  formatter={(value, name) => [
                    formatCurrency(value as number),
                    name === 'profit' ? 'Profit' : name === 'revenue' ? 'Revenue' : 'Costs'
                  ]}
                  labelStyle={{ color: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                />
                <Bar dataKey="revenue" fill="#3b82f6" name="revenue" />
                <Bar dataKey="costs" fill="#ef4444" name="costs" />
                <Bar dataKey="profit" fill="#10b981" name="profit" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {scenarioResults.map((scenario, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{scenario.scenario}</span>
                  <span className={`text-sm font-medium ${scenario.roi > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {scenario.roi > 0 ? '+' : ''}{scenario.roi}% ROI
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-slate-400">Revenue</div>
                    <div className="text-white">{formatCurrency(scenario.revenue)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Profit</div>
                    <div className={scenario.profit > 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(scenario.profit)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400">Probability</div>
                    <div className="text-white">{scenario.probability}%</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Priority Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Implementation Priority</h3>
          <div className="space-y-3">
            {recommendations
              .sort((a, b) => {
                const urgencyScore = { high: 3, medium: 2, low: 1 }
                return urgencyScore[b.urgency as keyof typeof urgencyScore] - urgencyScore[a.urgency as keyof typeof urgencyScore]
              })
              .map((rec, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-red-500' : index === 1 ? 'bg-orange-500' : 'bg-green-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-white font-medium">{rec.title}</div>
                      <div className="text-slate-400 text-sm">{rec.timeline} • {rec.effort} effort</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-medium">{formatCurrency(rec.potentialValue)}</div>
                    <div className="text-slate-400 text-sm">{rec.confidence} confidence</div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Implementation Roadmap</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-white font-medium">Immediate (0-30 days)</div>
                <div className="text-slate-400 text-sm">High-urgency actions</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <div>
                <div className="text-white font-medium">Short-term (1-3 months)</div>
                <div className="text-slate-400 text-sm">Strategic implementations</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-white font-medium">Long-term (3+ months)</div>
                <div className="text-slate-400 text-sm">Optimization opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescriptive Summary */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Action Plan Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">{recommendations.length}</div>
            <p className="text-orange-100">Recommendations</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(recommendations.reduce((sum, rec) => sum + rec.potentialValue, 0))}
            </div>
            <p className="text-orange-100">Total Value</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {recommendations.filter(r => r.urgency === 'high').length}
            </div>
            <p className="text-orange-100">High Priority</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">{Math.round(Math.max(...scenarioResults.map(s => s.roi)))}%</div>
            <p className="text-orange-100">Best ROI Scenario</p>
          </div>
        </div>
      </div>
    </div>
  )
}