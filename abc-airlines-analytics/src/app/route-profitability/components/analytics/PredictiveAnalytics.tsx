import { 
  TrendingUp, 
  Brain,
  Target,
  AlertTriangle,
  Calendar,
  Activity,
  Zap,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface PredictiveAnalyticsProps {
  selectedRoute: string
  timeRange: string
  onRouteChange: (route: string) => void
  onTimeRangeChange: (range: string) => void
}

export default function PredictiveAnalytics({ selectedRoute, timeRange }: PredictiveAnalyticsProps) {
  // Generate ML forecast data for the next 90 days
  const generateForecast = (routeId: string) => {
    const baseMetrics = {
      'LON-PAR': { passengers: 3500, revenue: 210000, loadFactor: 78 },
      'LON-NYC': { passengers: 3200, revenue: 580000, loadFactor: 82 },
      'BRS-PRG': { passengers: 1000, revenue: 65000, loadFactor: 45 },
      'MIA-NYC': { passengers: 2900, revenue: 435000, loadFactor: 75 }
    }
    
    const base = baseMetrics[routeId as keyof typeof baseMetrics] || baseMetrics['LON-PAR']
    const forecast = []
    
    for (let i = 1; i <= 90; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)
      
      // Seasonal factors
      const month = date.getMonth()
      const seasonalFactor = routeId === 'BRS-PRG' 
        ? (month >= 5 && month <= 8 ? 1.3 : 0.7) // Summer boost for leisure route
        : (month >= 11 || month <= 1 ? 0.9 : 1.1) // Business routes dip in holidays
      
      // Trend factor
      const trendFactor = routeId === 'BRS-PRG' ? 0.98 : 1.02 // Declining vs growing
      
      // Random variation
      const randomFactor = 0.85 + Math.random() * 0.3
      
      const factor = seasonalFactor * Math.pow(trendFactor, i / 90) * randomFactor
      
      const passengers = Math.round(base.passengers * factor)
      const revenue = Math.round(base.revenue * factor)
      const loadFactor = Math.min(95, Math.max(30, Math.round(base.loadFactor * factor)))
      
      // Confidence bands (wider for further dates)
      const confidenceWidth = Math.min(0.3, 0.1 + (i / 90) * 0.2)
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: i,
        passengers,
        revenue,
        loadFactor,
        passengersLower: Math.round(passengers * (1 - confidenceWidth)),
        passengersUpper: Math.round(passengers * (1 + confidenceWidth)),
        revenueLower: Math.round(revenue * (1 - confidenceWidth)),
        revenueUpper: Math.round(revenue * (1 + confidenceWidth)),
        profitProbability: routeId === 'BRS-PRG' ? Math.max(10, 80 - i) : Math.min(95, 85 + Math.random() * 10)
      })
    }
    
    return forecast
  }

  // Risk assessment
  const getRiskAssessment = (routeId: string) => {
    const risks = {
      'LON-PAR': {
        volatility: 'Low',
        competitionIntensity: 'High',
        seasonalImpact: 'Medium',
        overallRisk: 'Medium',
        riskScore: 35
      },
      'BRS-PRG': {
        volatility: 'High',
        competitionIntensity: 'Low',
        seasonalImpact: 'High',
        overallRisk: 'High',
        riskScore: 75
      },
      'LON-NYC': {
        volatility: 'Medium',
        competitionIntensity: 'High',
        seasonalImpact: 'Low',
        overallRisk: 'Medium',
        riskScore: 45
      }
    }
    return risks[routeId as keyof typeof risks] || risks['LON-PAR']
  }

  // ML model confidence metrics
  const getModelMetrics = (routeId: string) => {
    return {
      accuracy: routeId === 'BRS-PRG' ? 78 : 87,
      r2Score: routeId === 'BRS-PRG' ? 0.73 : 0.89,
      mape: routeId === 'BRS-PRG' ? 15.2 : 8.7,
      dataPoints: 1095, // 3 years of daily data
      lastTrained: '2024-12-15',
      modelType: 'XGBoost + Seasonal ARIMA'
    }
  }

  // Event impact predictions
  const getEventImpacts = () => {
    return [
      { event: 'Holiday Season', impact: 15, probability: 90, timeframe: 'Dec 20-Jan 5' },
      { event: 'Easter Travel', impact: 25, probability: 85, timeframe: 'Mar 28-Apr 8' },
      { event: 'Summer Peak', impact: 35, probability: 95, timeframe: 'Jun-Aug' },
      { event: 'Competitor Entry', impact: -20, probability: 40, timeframe: 'Q2 2024' }
    ]
  }

  const forecast = generateForecast(selectedRoute)
  const riskAssessment = getRiskAssessment(selectedRoute)
  const modelMetrics = getModelMetrics(selectedRoute)
  const eventImpacts = getEventImpacts()

  // Aggregate forecast for the next 30/60/90 days
  const aggregatedForecast = [
    {
      period: 'Next 30 Days',
      passengers: Math.round(forecast.slice(0, 30).reduce((sum, d) => sum + d.passengers, 0)),
      revenue: Math.round(forecast.slice(0, 30).reduce((sum, d) => sum + d.revenue, 0)),
      avgLoadFactor: Math.round(forecast.slice(0, 30).reduce((sum, d) => sum + d.loadFactor, 0) / 30),
      confidence: 92
    },
    {
      period: 'Next 60 Days',
      passengers: Math.round(forecast.slice(0, 60).reduce((sum, d) => sum + d.passengers, 0)),
      revenue: Math.round(forecast.slice(0, 60).reduce((sum, d) => sum + d.revenue, 0)),
      avgLoadFactor: Math.round(forecast.slice(0, 60).reduce((sum, d) => sum + d.loadFactor, 0) / 60),
      confidence: 85
    },
    {
      period: 'Next 90 Days',
      passengers: Math.round(forecast.slice(0, 90).reduce((sum, d) => sum + d.passengers, 0)),
      revenue: Math.round(forecast.slice(0, 90).reduce((sum, d) => sum + d.revenue, 0)),
      avgLoadFactor: Math.round(forecast.slice(0, 90).reduce((sum, d) => sum + d.loadFactor, 0) / 90),
      confidence: 78
    }
  ]

  return (
    <div className="space-y-6">
      {/* ML Model Info */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <Brain className="w-6 h-6 text-green-400" />
          <h3 className="text-lg font-semibold text-white">ML Forecasting Model</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Model Type:</span>
            <p className="text-white font-medium">{modelMetrics.modelType}</p>
          </div>
          <div>
            <span className="text-slate-400">Accuracy:</span>
            <p className="text-green-400 font-medium">{modelMetrics.accuracy}%</p>
          </div>
          <div>
            <span className="text-slate-400">R² Score:</span>
            <p className="text-green-400 font-medium">{modelMetrics.r2Score}</p>
          </div>
          <div>
            <span className="text-slate-400">MAPE:</span>
            <p className="text-green-400 font-medium">{modelMetrics.mape}%</p>
          </div>
        </div>
      </div>

      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aggregatedForecast.map((period, index) => (
          <div key={index} className="metric-card">
            <h4 className="text-lg font-semibold text-white mb-3">{period.period}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Passengers:</span>
                <span className="text-white font-medium">{period.passengers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Revenue:</span>
                <span className="text-white font-medium">{formatCurrency(period.revenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Load Factor:</span>
                <span className="text-white font-medium">{period.avgLoadFactor}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Confidence:</span>
                <span className={`font-medium ${
                  period.confidence >= 90 ? 'text-green-400' :
                  period.confidence >= 80 ? 'text-yellow-400' : 'text-orange-400'
                }`}>{period.confidence}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 90-Day Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Passenger Forecast with Confidence Bands</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecast.filter((_, i) => i % 3 === 0)}> {/* Show every 3rd day for readability */}
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value, name) => [
                  name.includes('passengers') ? `${value} passengers` : value,
                  name === 'passengers' ? 'Forecast' : 
                  name === 'passengersUpper' ? 'Upper Bound' : 'Lower Bound'
                ]}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Area 
                type="monotone" 
                dataKey="passengersUpper" 
                stroke="none" 
                fill="#3b82f6" 
                fillOpacity={0.1}
              />
              <Area 
                type="monotone" 
                dataKey="passengersLower" 
                stroke="none" 
                fill="#ffffff" 
                fillOpacity={1}
              />
              <Line 
                type="monotone" 
                dataKey="passengers" 
                stroke="#3b82f6" 
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Revenue Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.filter((_, i) => i % 7 === 0)}> {/* Show weekly points */}
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
              <Tooltip 
                formatter={(value, name) => [
                  formatCurrency(value as number),
                  name === 'revenue' ? 'Forecast' : 
                  name === 'revenueUpper' ? 'Upper Bound' : 'Lower Bound'
                ]}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Line type="monotone" dataKey="revenueLower" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="revenueUpper" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Assessment</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <span className="text-white">Demand Volatility</span>
              <span className={`font-medium ${
                riskAssessment.volatility === 'Low' ? 'text-green-400' :
                riskAssessment.volatility === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{riskAssessment.volatility}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <span className="text-white">Competition Intensity</span>
              <span className={`font-medium ${
                riskAssessment.competitionIntensity === 'Low' ? 'text-green-400' :
                riskAssessment.competitionIntensity === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{riskAssessment.competitionIntensity}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
              <span className="text-white">Seasonal Impact</span>
              <span className={`font-medium ${
                riskAssessment.seasonalImpact === 'Low' ? 'text-green-400' :
                riskAssessment.seasonalImpact === 'Medium' ? 'text-yellow-400' : 'text-red-400'
              }`}>{riskAssessment.seasonalImpact}</span>
            </div>
            <div className="border-t border-slate-600 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Overall Risk Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-slate-600 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        riskAssessment.riskScore <= 30 ? 'bg-green-500' :
                        riskAssessment.riskScore <= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${riskAssessment.riskScore}%` }}
                    />
                  </div>
                  <span className="text-white font-medium">{riskAssessment.riskScore}/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3 className="text-lg font-semibold text-white mb-4">Event Impact Predictions</h3>
          <div className="space-y-3">
            {eventImpacts.map((event, index) => (
              <div key={index} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-white">{event.event}</span>
                  <span className={`text-sm font-medium ${
                    event.impact > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {event.impact > 0 ? '+' : ''}{event.impact}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">{event.timeframe}</span>
                  <span className="text-slate-300">{event.probability}% probability</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Predictive Summary */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">90-Day Forecast Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {aggregatedForecast[2].passengers.toLocaleString()}
            </div>
            <p className="text-green-100">Predicted Passengers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {formatCurrency(aggregatedForecast[2].revenue)}
            </div>
            <p className="text-green-100">Predicted Revenue</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">{modelMetrics.accuracy}%</div>
            <p className="text-green-100">Model Accuracy</p>
          </div>
          <div>
            <div className={`text-3xl font-bold mb-2 ${
              riskAssessment.riskScore <= 30 ? 'text-green-200' :
              riskAssessment.riskScore <= 60 ? 'text-yellow-200' : 'text-red-200'
            }`}>
              {riskAssessment.overallRisk}
            </div>
            <p className="text-green-100">Risk Level</p>
          </div>
        </div>
      </div>
    </div>
  )
}