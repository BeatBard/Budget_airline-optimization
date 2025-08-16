import { 
  Brain,
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  Info
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DiagnosticAnalyticsProps {
  selectedRoute: string
  timeRange: string
  onRouteChange: (route: string) => void
  onTimeRangeChange: (range: string) => void
}

export default function DiagnosticAnalytics({ selectedRoute, timeRange }: DiagnosticAnalyticsProps) {
  // Feature importance data (simulated explainable AI output)
  const getFeatureImportance = (routeId: string) => {
    const features = {
      'LON-PAR': [
        { feature: 'Load Factor', importance: 0.35, impact: 'positive', value: '78%', explanation: 'High load factor drives profitability' },
        { feature: 'Average Fare', importance: 0.28, impact: 'positive', value: '$165', explanation: 'Premium pricing on business route' },
        { feature: 'Fuel Costs', importance: 0.22, impact: 'negative', value: '$45K/flight', explanation: 'Major cost component impacting margin' },
        { feature: 'Competition', importance: 0.15, impact: 'negative', value: '3 competitors', explanation: 'Price pressure from competitors' }
      ],
      'BRS-PRG': [
        { feature: 'Load Factor', importance: 0.42, impact: 'negative', value: '45%', explanation: 'Low demand driving losses' },
        { feature: 'Route Length', importance: 0.25, impact: 'negative', value: '1,318km', explanation: 'High fuel costs for distance' },
        { feature: 'Aircraft Size', importance: 0.20, impact: 'negative', value: '150 seats', explanation: 'Fixed costs spread over fewer passengers' },
        { feature: 'Seasonality', importance: 0.13, impact: 'negative', value: 'High variance', explanation: 'Inconsistent demand patterns' }
      ]
    }
    return features[routeId as keyof typeof features] || features['LON-PAR']
  }

  // Profit bridge data showing drivers of change
  const getProfitBridge = (routeId: string) => {
    if (routeId === 'BRS-PRG') {
      return [
        { factor: 'Base Profit', value: 0, cumulative: 0, type: 'base' },
        { factor: 'Low Load Factor', value: -150000, cumulative: -150000, type: 'negative' },
        { factor: 'High Fuel Costs', value: -80000, cumulative: -230000, type: 'negative' },
        { factor: 'Airport Fees', value: -25000, cumulative: -255000, type: 'negative' },
        { factor: 'Crew Overtime', value: -15000, cumulative: -270000, type: 'negative' },
        { factor: 'Ancillary Revenue', value: 70000, cumulative: -200000, type: 'positive' },
        { factor: 'Net Profit', value: 0, cumulative: -200000, type: 'final' }
      ]
    } else {
      return [
        { factor: 'Base Profit', value: 0, cumulative: 0, type: 'base' },
        { factor: 'High Load Factor', value: 250000, cumulative: 250000, type: 'positive' },
        { factor: 'Premium Pricing', value: 180000, cumulative: 430000, type: 'positive' },
        { factor: 'Fuel Efficiency', value: 45000, cumulative: 475000, type: 'positive' },
        { factor: 'Fuel Price Increase', value: -25000, cumulative: 450000, type: 'negative' },
        { factor: 'Net Profit', value: 0, cumulative: 450000, type: 'final' }
      ]
    }
  }

  // Cost waterfall data
  const getCostWaterfall = (routeId: string) => {
    const baseCosts = {
      'LON-PAR': { fuel: 45, crew: 25, airport: 15, maintenance: 10, other: 5 },
      'BRS-PRG': { fuel: 55, crew: 20, airport: 12, maintenance: 8, other: 5 }
    }
    const costs = baseCosts[routeId as keyof typeof baseCosts] || baseCosts['LON-PAR']
    
    return [
      { category: 'Fuel Costs', percentage: costs.fuel, value: costs.fuel * 10000, impact: 'high' },
      { category: 'Crew Costs', percentage: costs.crew, value: costs.crew * 10000, impact: 'medium' },
      { category: 'Airport Fees', percentage: costs.airport, value: costs.airport * 10000, impact: 'medium' },
      { category: 'Maintenance', percentage: costs.maintenance, value: costs.maintenance * 10000, impact: 'low' },
      { category: 'Other', percentage: costs.other, value: costs.other * 10000, impact: 'low' }
    ]
  }

  // Pattern analysis
  const getPatternAnalysis = (routeId: string) => {
    return {
      dayOfWeek: {
        pattern: routeId.includes('LON') ? 'Business-heavy' : 'Leisure-heavy',
        explanation: routeId.includes('LON') ? 'Monday-Thursday perform 30% better' : 'Friday-Sunday show higher demand',
        impact: routeId.includes('LON') ? 'positive' : 'neutral'
      },
      seasonality: {
        pattern: routeId === 'BRS-PRG' ? 'High variance' : 'Moderate variance',
        explanation: routeId === 'BRS-PRG' ? '60% demand drop in winter' : 'Summer 20% increase',
        impact: routeId === 'BRS-PRG' ? 'negative' : 'positive'
      },
      competition: {
        pattern: routeId.includes('LON') ? 'High competition' : 'Low competition',
        explanation: routeId.includes('LON') ? '3-4 competitors on route' : '1-2 competitors',
        impact: routeId.includes('LON') ? 'negative' : 'neutral'
      }
    }
  }

  const featureImportance = getFeatureImportance(selectedRoute)
  const profitBridge = getProfitBridge(selectedRoute)
  const costWaterfall = getCostWaterfall(selectedRoute)
  const patterns = getPatternAnalysis(selectedRoute)

  return (
    <div className="space-y-6">
      {/* AI Explanation Header */}
      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">AI-Powered Root Cause Analysis</h3>
        </div>
        <p className="text-slate-300 text-sm">
          Explainable AI has analyzed {selectedRoute} performance to identify the key drivers of {selectedRoute === 'BRS-PRG' ? 'losses' : 'profitability'}
        </p>
      </div>

      {/* Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Importance Analysis</h3>
          <div className="space-y-4">
            {featureImportance.map((item, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{item.feature}</span>
                  <span className={`text-sm font-medium ${
                    item.impact === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(item.importance * 100).toFixed(0)}% impact
                  </span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2 mb-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item.impact === 'positive' ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${item.importance * 100}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{item.value}</span>
                  <span className="text-slate-300">{item.explanation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Feature Impact Visualization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureImportance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} />
              <YAxis dataKey="feature" type="category" stroke="#94a3b8" width={100} />
              <Tooltip 
                formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Importance']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar 
                dataKey="importance" 
                fill={(entry) => entry.impact === 'positive' ? '#10b981' : '#ef4444'}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Bridge Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-white mb-4">Profit Bridge Analysis - Change Drivers</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={profitBridge}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="factor" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
            <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
            <Tooltip 
              formatter={(value, name) => [formatCurrency(value as number), name === 'value' ? 'Impact' : 'Cumulative']}
              labelStyle={{ color: '#f1f5f9' }}
              contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
            />
            <Bar 
              dataKey="value" 
              fill={(entry) => {
                if (entry.type === 'positive') return '#10b981'
                if (entry.type === 'negative') return '#ef4444'
                return '#64748b'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cost Waterfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Cost Breakdown Analysis</h3>
          <div className="space-y-3">
            {costWaterfall.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.impact === 'high' ? 'bg-red-500' :
                    item.impact === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                  }`} />
                  <span className="text-white">{item.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">{item.percentage}%</span>
                  <p className="text-sm text-slate-400">{formatCurrency(item.value)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Pattern Analysis</h3>
          <div className="space-y-4">
            {Object.entries(patterns).map(([key, pattern]) => (
              <div key={key} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <div className={`flex items-center space-x-1 ${
                    pattern.impact === 'positive' ? 'text-green-400' :
                    pattern.impact === 'negative' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {pattern.impact === 'positive' ? <TrendingUp className="w-4 h-4" /> :
                     pattern.impact === 'negative' ? <TrendingDown className="w-4 h-4" /> :
                     <AlertTriangle className="w-4 h-4" />}
                    <span className="text-sm">{pattern.pattern}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-300">{pattern.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">AI Diagnostic Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-2">Primary Factors</h4>
            <ul className="space-y-2 text-purple-100">
              {featureImportance.slice(0, 2).map((factor, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <ArrowRight className="w-4 h-4" />
                  <span>{factor.feature}: {factor.explanation}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-2">Key Recommendation</h4>
            <p className="text-purple-100">
              {selectedRoute === 'BRS-PRG' 
                ? 'Focus on demand generation and route optimization to improve load factor'
                : 'Maintain current performance while monitoring competitive pricing'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}