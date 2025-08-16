import { useState } from 'react'
import { 
  Brain,
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Target,
  Zap,
  BarChart3,
  ArrowRight,
  Info,
  Calendar,
  CalendarDays
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, Area, Cell } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DiagnosticAnalyticsProps {
  selectedRoute: string
  timeRange: string
  onRouteChange: (route: string) => void
  onTimeRangeChange: (range: string) => void
}

export default function DiagnosticAnalytics({ selectedRoute, timeRange, onTimeRangeChange }: DiagnosticAnalyticsProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [isCustomRange, setIsCustomRange] = useState(false)

  // Helper functions for date handling
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getPresetDates = (preset: string) => {
    const end = new Date()
    const start = new Date()
    
    switch (preset) {
      case 'last_month':
        start.setMonth(start.getMonth() - 1)
        break
      case 'last_quarter':
        start.setMonth(start.getMonth() - 3)
        break
      case 'last_year':
        start.setFullYear(start.getFullYear() - 1)
        break
      case 'ytd':
        start.setMonth(0)
        start.setDate(1)
        break
      default:
        start.setMonth(start.getMonth() - 3)
    }
    
    return {
      start: formatDateForInput(start),
      end: formatDateForInput(end)
    }
  }

  const handlePresetSelect = (preset: string) => {
    setIsCustomRange(false)
    onTimeRangeChange(preset)
    setShowDatePicker(false)
  }

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setIsCustomRange(true)
      onTimeRangeChange('custom')
      setShowDatePicker(false)
    }
  }

  const getDisplayDateRange = () => {
    if (isCustomRange && customStartDate && customEndDate) {
      return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
    }
    const dates = getPresetDates(timeRange)
    return `${new Date(dates.start).toLocaleDateString()} - ${new Date(dates.end).toLocaleDateString()}`
  }
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
      {/* Enhanced Date Period Selector */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Analysis Period</h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-400">Current Range:</div>
            <div className="text-white font-medium bg-slate-700 px-3 py-1 rounded">
              {getDisplayDateRange()}
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { value: 'last_month', label: 'Last Month', desc: '30 days', icon: '🔍' },
            { value: 'last_quarter', label: 'Last Quarter', desc: '3 months', icon: '🧠' },
            { value: 'last_year', label: 'Last Year', desc: '12 months', icon: '📊' },
            { value: 'ytd', label: 'Year to Date', desc: 'Jan - Now', icon: '🎯' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handlePresetSelect(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                timeRange === period.value && !isCustomRange
                  ? 'bg-purple-600 text-white border-2 border-purple-400 shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent hover:border-slate-500'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-lg">{period.icon}</span>
                <div className="font-medium">{period.label}</div>
              </div>
              <div className="text-sm opacity-75">{period.desc}</div>
            </button>
          ))}
        </div>

        {/* Custom Date Range */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Custom Date Range</span>
            </div>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCustomRange || showDatePicker
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{showDatePicker ? 'Close' : 'Select Dates'}</span>
              </div>
            </button>
          </div>

          {/* Date Picker Interface */}
          {showDatePicker && (
            <div className="mt-4 bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={formatDateForInput(new Date())}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate}
                    max={formatDateForInput(new Date())}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  {customStartDate && customEndDate && (
                    <span>
                      Selected: {Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowDatePicker(false)
                      setCustomStartDate('')
                      setCustomEndDate('')
                    }}
                    className="px-3 py-1 text-sm bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomDateApply}
                    disabled={!customStartDate || !customEndDate}
                    className={`px-4 py-1 text-sm rounded font-medium transition-colors ${
                      customStartDate && customEndDate
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-slate-600 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Apply Range
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

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
            <BarChart data={featureImportance} layout="horizontal" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis 
                type="number" 
                stroke="#e2e8f0" 
                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                domain={[0, 0.5]}
                fontSize={12}
              />
              <YAxis 
                dataKey="feature" 
                type="category" 
                stroke="#e2e8f0" 
                width={120}
                fontSize={12}
                fill="#e2e8f0"
              />
              <Tooltip 
                formatter={(value) => [`${(value as number * 100).toFixed(1)}%`, 'Impact']}
                labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '2px solid #475569',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                }}
              />
              <Bar 
                dataKey="importance" 
                radius={[0, 4, 4, 0]}
              >
                {featureImportance.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.impact === 'positive' ? '#22c55e' : '#ef4444'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Profit Bridge Analysis */}
      <div className="metric-card">
        <h3 className="text-lg font-semibold text-white mb-4">Profit Bridge Analysis - Change Drivers</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={profitBridge} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis 
              dataKey="factor" 
              stroke="#e2e8f0" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              fontSize={12}
              fill="#e2e8f0"
            />
            <YAxis 
              stroke="#e2e8f0" 
              tickFormatter={(value) => `$${Math.abs(value)/1000}K`}
              fontSize={12}
              fill="#e2e8f0"
            />
            <Tooltip 
              formatter={(value, name) => [
                formatCurrency(value as number), 
                name === 'value' ? 'Impact' : 'Cumulative'
              ]}
              labelStyle={{ color: '#f1f5f9', fontWeight: 'bold' }}
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '2px solid #475569',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
              }}
            />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
            >
              {profitBridge.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={
                    entry.type === 'positive' ? '#22c55e' :
                    entry.type === 'negative' ? '#ef4444' :
                    entry.type === 'base' ? '#3b82f6' :
                    entry.type === 'final' ? '#8b5cf6' :
                    '#64748b'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Bridge Summary */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-slate-300">Positive Impact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-slate-300">Negative Impact</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-slate-300">Base</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-slate-300">Final Result</span>
          </div>
        </div>
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