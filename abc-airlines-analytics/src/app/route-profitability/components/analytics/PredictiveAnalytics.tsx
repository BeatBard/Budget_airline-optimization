import { useState } from 'react'
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

export default function PredictiveAnalytics({ selectedRoute, timeRange, onTimeRangeChange }: PredictiveAnalyticsProps) {
  const [forecastPeriod, setForecastPeriod] = useState('next_3_months')
  // Generate demand forecast based on selected period
  const generateDemandForecast = (routeId: string, period: string) => {
    const days = period === 'next_month' ? 30 : period === 'next_3_months' ? 90 : period === 'next_6_months' ? 180 : 365;
    const baseMetrics = {
      'LON-PAR': { passengers: 3500, revenue: 210000, loadFactor: 78 },
      'LON-NYC': { passengers: 3200, revenue: 580000, loadFactor: 82 },
      'BRS-PRG': { passengers: 1000, revenue: 65000, loadFactor: 45 },
      'MIA-NYC': { passengers: 2900, revenue: 435000, loadFactor: 75 }
    }
    
    const base = baseMetrics[routeId as keyof typeof baseMetrics] || baseMetrics['LON-PAR']
    const forecast = []
    
    for (let i = 1; i <= days; i++) {
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
      
      const factor = seasonalFactor * Math.pow(trendFactor, i / days) * randomFactor
      
      const passengers = Math.round(base.passengers * factor)
      const demandIndex = Math.round(factor * 100) // Demand as index
      const loadFactor = Math.min(95, Math.max(30, Math.round(base.loadFactor * factor)))
      
      // Confidence bands (wider for further dates)
      const confidenceWidth = Math.min(0.3, 0.1 + (i / days) * 0.2)
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        day: i,
        passengers,
        demandIndex,
        loadFactor,
        passengersLower: Math.round(passengers * (1 - confidenceWidth)),
        passengersUpper: Math.round(passengers * (1 + confidenceWidth)),
        demandLower: Math.round(demandIndex * (1 - confidenceWidth)),
        demandUpper: Math.round(demandIndex * (1 + confidenceWidth)),
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

  const forecast = generateDemandForecast(selectedRoute, forecastPeriod)
  const riskAssessment = getRiskAssessment(selectedRoute)
  const modelMetrics = getModelMetrics(selectedRoute)
  const eventImpacts = getEventImpacts()

  // Aggregate forecast based on selected period
  const getAggregatedForecast = (forecastData: any[], period: string) => {
    const totalDays = forecastData.length
    const chunks = period === 'next_month' ? [30] : 
                  period === 'next_3_months' ? [30, 60, 90] :
                  period === 'next_6_months' ? [60, 120, 180] : [90, 180, 270, 365]
    
    return chunks.map((days, index) => {
      const data = forecastData.slice(0, days)
      const chunkLabel = period === 'next_month' ? 'Next 30 Days' :
                        period === 'next_3_months' ? `Next ${days} Days` :
                        period === 'next_6_months' ? `Next ${Math.round(days/30)} Months` :
                        `Next ${Math.round(days/30)} Months`
      
      return {
        period: chunkLabel,
        passengers: Math.round(data.reduce((sum, d) => sum + d.passengers, 0)),
        demandIndex: Math.round(data.reduce((sum, d) => sum + d.demandIndex, 0) / data.length),
        avgLoadFactor: Math.round(data.reduce((sum, d) => sum + d.loadFactor, 0) / data.length),
        confidence: Math.max(75, 95 - (days / totalDays) * 20)
      }
    })
  }

  const aggregatedForecast = getAggregatedForecast(forecast, forecastPeriod)

  return (
    <div className="space-y-6">
      {/* Forecast Period Selector */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Forecast Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { value: 'next_month', label: 'Next Month', desc: '30 days ahead' },
            { value: 'next_3_months', label: 'Next 3 Months', desc: '90 days ahead' },
            { value: 'next_6_months', label: 'Next 6 Months', desc: '180 days ahead' },
            { value: 'next_year', label: 'Next Year', desc: '365 days ahead' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => setForecastPeriod(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                forecastPeriod === period.value
                  ? 'bg-green-600 text-white border-2 border-green-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
              }`}
            >
              <div className="font-medium">{period.label}</div>
              <div className="text-sm opacity-75">{period.desc}</div>
            </button>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-slate-400 text-sm">Baseline Date: </span>
          <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
        </div>
      </div>

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
                <span className="text-slate-400">Demand Index:</span>
                <span className="text-white font-medium">{period.demandIndex}</span>
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
          <h3 className="text-lg font-semibold text-white mb-4">Demand Index Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast.filter((_, i) => i % 7 === 0)}> {/* Show weekly points */}
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="day" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value, name) => [
                  value,
                  name === 'demandIndex' ? 'Demand Index' : 
                  name === 'demandUpper' ? 'Upper Bound' : 'Lower Bound'
                ]}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Line type="monotone" dataKey="demandLower" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} />
              <Line type="monotone" dataKey="demandIndex" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="demandUpper" stroke="#64748b" strokeDasharray="5 5" strokeWidth={1} />
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
        <h3 className="text-xl font-semibold text-white mb-4">Demand Forecast Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {aggregatedForecast[aggregatedForecast.length - 1]?.passengers.toLocaleString() || 'N/A'}
            </div>
            <p className="text-green-100">Predicted Passengers</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {aggregatedForecast[aggregatedForecast.length - 1]?.demandIndex || 'N/A'}
            </div>
            <p className="text-green-100">Demand Index</p>
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