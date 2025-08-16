import { useState } from 'react'
import { 
  TrendingUp, 
  Brain,
  Target,
  AlertTriangle,
  Calendar,
  Activity,
  Zap,
  BarChart3,
  CalendarDays
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
  const [showHistoricalDatePicker, setShowHistoricalDatePicker] = useState(false)
  const [showForecastDatePicker, setShowForecastDatePicker] = useState(false)
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [customForecastStart, setCustomForecastStart] = useState('')
  const [customForecastEnd, setCustomForecastEnd] = useState('')
  const [isCustomRange, setIsCustomRange] = useState(false)
  const [isCustomForecast, setIsCustomForecast] = useState(false)

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
    setShowHistoricalDatePicker(false)
  }

  const handleCustomDateApply = () => {
    if (customStartDate && customEndDate) {
      setIsCustomRange(true)
      onTimeRangeChange('custom')
      setShowHistoricalDatePicker(false)
    }
  }

  const handleForecastPresetSelect = (preset: string) => {
    setIsCustomForecast(false)
    setForecastPeriod(preset)
    setShowForecastDatePicker(false)
  }

  const handleCustomForecastApply = () => {
    if (customForecastStart && customForecastEnd) {
      setIsCustomForecast(true)
      setForecastPeriod('custom')
      setShowForecastDatePicker(false)
    }
  }

  const getForecastDisplayRange = () => {
    if (isCustomForecast && customForecastStart && customForecastEnd) {
      return `${new Date(customForecastStart).toLocaleDateString()} - ${new Date(customForecastEnd).toLocaleDateString()}`
    }
    const today = new Date()
    const end = new Date(today)
    
    switch (forecastPeriod) {
      case 'next_month':
        end.setMonth(end.getMonth() + 1)
        break
      case 'next_3_months':
        end.setMonth(end.getMonth() + 3)
        break
      case 'next_6_months':
        end.setMonth(end.getMonth() + 6)
        break
      case 'next_year':
        end.setFullYear(end.getFullYear() + 1)
        break
      default:
        end.setMonth(end.getMonth() + 3)
    }
    
    return `${today.toLocaleDateString()} - ${end.toLocaleDateString()}`
  }

  const getDisplayDateRange = () => {
    if (isCustomRange && customStartDate && customEndDate) {
      return `${new Date(customStartDate).toLocaleDateString()} - ${new Date(customEndDate).toLocaleDateString()}`
    }
    const dates = getPresetDates(timeRange)
    return `${new Date(dates.start).toLocaleDateString()} - ${new Date(dates.end).toLocaleDateString()}`
  }
  // Generate demand forecast based on selected period (weekly data)
  const generateDemandForecast = (routeId: string, period: string) => {
    const weeks = period === 'next_month' ? 4 : period === 'next_3_months' ? 12 : period === 'next_6_months' ? 26 : 52;
    const baseMetrics = {
      'LON-PAR': { passengers: 24500, revenue: 1470000, loadFactor: 78 }, // Weekly totals
      'LON-NYC': { passengers: 22400, revenue: 4060000, loadFactor: 82 },
      'BRS-PRG': { passengers: 7000, revenue: 455000, loadFactor: 45 },
      'MIA-NYC': { passengers: 20300, revenue: 3045000, loadFactor: 75 }
    }
    
    const base = baseMetrics[routeId as keyof typeof baseMetrics] || baseMetrics['LON-PAR']
    const forecast = []
    
    for (let i = 1; i <= weeks; i++) {
      const date = new Date()
      date.setDate(date.getDate() + (i * 7)) // Weekly intervals
      
      // Seasonal factors
      const month = date.getMonth()
      const seasonalFactor = routeId === 'BRS-PRG' 
        ? (month >= 5 && month <= 8 ? 1.3 : 0.7) // Summer boost for leisure route
        : (month >= 11 || month <= 1 ? 0.9 : 1.1) // Business routes dip in holidays
      
      // Trend factor
      const trendFactor = routeId === 'BRS-PRG' ? 0.99 : 1.01 // Weekly growth rates
      
      // Random variation (less for weekly data)
      const randomFactor = 0.9 + Math.random() * 0.2
      
      const factor = seasonalFactor * Math.pow(trendFactor, i / weeks) * randomFactor
      
      const passengers = Math.round(base.passengers * factor)
      const demandIndex = Math.round(factor * 100) // Demand as index
      const loadFactor = Math.min(95, Math.max(30, Math.round(base.loadFactor * factor)))
      
      // Confidence bands (wider for further weeks)
      const confidenceWidth = Math.min(0.25, 0.05 + (i / weeks) * 0.2)
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        week: i,
        weekLabel: `Week ${i}`,
        passengers,
        demandIndex,
        loadFactor,
        passengersLower: Math.round(passengers * (1 - confidenceWidth)),
        passengersUpper: Math.round(passengers * (1 + confidenceWidth)),
        demandLower: Math.round(demandIndex * (1 - confidenceWidth)),
        demandUpper: Math.round(demandIndex * (1 + confidenceWidth)),
        profitProbability: routeId === 'BRS-PRG' ? Math.max(10, 85 - (i * 2)) : Math.min(95, 80 + Math.random() * 15)
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

  // Aggregate forecast based on selected period (weekly)
  const getAggregatedForecast = (forecastData: any[], period: string) => {
    const totalWeeks = forecastData.length
    const chunks = period === 'next_month' ? [4] : 
                  period === 'next_3_months' ? [4, 8, 12] :
                  period === 'next_6_months' ? [8, 16, 26] : [12, 24, 39, 52]
    
    return chunks.map((weeks, index) => {
      const data = forecastData.slice(0, weeks)
      const chunkLabel = period === 'next_month' ? 'Next 4 Weeks' :
                        period === 'next_3_months' ? `Next ${weeks} Weeks` :
                        period === 'next_6_months' ? `Next ${Math.round(weeks/4)} Months` :
                        `Next ${Math.round(weeks/4)} Months`
      
      return {
        period: chunkLabel,
        passengers: Math.round(data.reduce((sum, d) => sum + d.passengers, 0)),
        demandIndex: Math.round(data.reduce((sum, d) => sum + d.demandIndex, 0) / data.length),
        avgLoadFactor: Math.round(data.reduce((sum, d) => sum + d.loadFactor, 0) / data.length),
        confidence: Math.max(75, 95 - (weeks / totalWeeks) * 20)
      }
    })
  }

  const aggregatedForecast = getAggregatedForecast(forecast, forecastPeriod)

  return (
    <div className="space-y-6">
      {/* Historical Data Range Selector */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Historical Data for Model Training</h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-400">Training Period:</div>
            <div className="text-white font-medium bg-slate-700 px-3 py-1 rounded">
              {getDisplayDateRange()}
            </div>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { value: 'last_month', label: 'Last Month', desc: '30 days', icon: '📈' },
            { value: 'last_quarter', label: 'Last Quarter', desc: '3 months', icon: '🔮' },
            { value: 'last_year', label: 'Last Year', desc: '12 months', icon: '🎯' },
            { value: 'ytd', label: 'Year to Date', desc: 'Jan - Now', icon: '📊' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handlePresetSelect(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                timeRange === period.value && !isCustomRange
                  ? 'bg-green-600 text-white border-2 border-green-400 shadow-lg'
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
              <CalendarDays className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Custom Training Period</span>
            </div>
            <button
              onClick={() => setShowHistoricalDatePicker(!showHistoricalDatePicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCustomRange || showHistoricalDatePicker
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{showHistoricalDatePicker ? 'Close' : 'Select Period'}</span>
              </div>
            </button>
          </div>

          {/* Historical Date Picker Interface */}
          {showHistoricalDatePicker && (
            <div className="mt-4 bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Training Start Date
                  </label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    max={formatDateForInput(new Date())}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Training End Date
                  </label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    min={customStartDate}
                    max={formatDateForInput(new Date())}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  {customStartDate && customEndDate && (
                    <span>
                      Training Data: {Math.ceil((new Date(customEndDate).getTime() - new Date(customStartDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowHistoricalDatePicker(false)
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
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-slate-600 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Apply Period
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forecast Period Selector */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Select Forecast Timeline</h3>
          <div className="flex items-center space-x-3">
            <div className="text-sm text-slate-400">Forecast Period:</div>
            <div className="text-white font-medium bg-slate-700 px-3 py-1 rounded">
              {getForecastDisplayRange()}
            </div>
          </div>
        </div>

        {/* Forecast Presets */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {[
            { value: 'next_month', label: 'Next Month', desc: '30 days ahead', icon: '🔮' },
            { value: 'next_3_months', label: 'Next 3 Months', desc: '90 days ahead', icon: '📈' },
            { value: 'next_6_months', label: 'Next 6 Months', desc: '180 days ahead', icon: '🎯' },
            { value: 'next_year', label: 'Next Year', desc: '365 days ahead', icon: '🚀' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handleForecastPresetSelect(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                forecastPeriod === period.value && !isCustomForecast
                  ? 'bg-green-600 text-white border-2 border-green-400 shadow-lg'
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

        {/* Custom Forecast Range */}
        <div className="border-t border-slate-700 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarDays className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Custom Forecast Period</span>
            </div>
            <button
              onClick={() => setShowForecastDatePicker(!showForecastDatePicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCustomForecast || showForecastDatePicker
                  ? 'bg-green-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{showForecastDatePicker ? 'Close' : 'Select Dates'}</span>
              </div>
            </button>
          </div>

          {/* Custom Forecast Date Picker */}
          {showForecastDatePicker && (
            <div className="mt-4 bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Forecast Start Date
                  </label>
                  <input
                    type="date"
                    value={customForecastStart}
                    onChange={(e) => setCustomForecastStart(e.target.value)}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Forecast End Date
                  </label>
                  <input
                    type="date"
                    value={customForecastEnd}
                    onChange={(e) => setCustomForecastEnd(e.target.value)}
                    min={customForecastStart}
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-slate-400">
                  {customForecastStart && customForecastEnd && (
                    <span>
                      Forecast Duration: {Math.ceil((new Date(customForecastEnd).getTime() - new Date(customForecastStart).getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowForecastDatePicker(false)
                      setCustomForecastStart('')
                      setCustomForecastEnd('')
                    }}
                    className="px-3 py-1 text-sm bg-slate-600 text-slate-300 rounded hover:bg-slate-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomForecastApply}
                    disabled={!customForecastStart || !customForecastEnd}
                    className={`px-4 py-1 text-sm rounded font-medium transition-colors ${
                      customForecastStart && customForecastEnd
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-slate-600 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Apply Forecast
                  </button>
                </div>
              </div>
            </div>
          )}
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
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Passenger Forecast with Confidence Bands</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" tickFormatter={(value) => `W${value}`} />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value, name) => [
                  name.includes('passengers') ? `${value} passengers` : value,
                  name === 'passengers' ? 'Weekly Forecast' : 
                  name === 'passengersUpper' ? 'Upper Bound' : 'Lower Bound'
                ]}
                labelFormatter={(value) => `Week ${value}`}
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
          <h3 className="text-lg font-semibold text-white mb-4">Weekly Demand Index Forecast</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={forecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="week" stroke="#94a3b8" tickFormatter={(value) => `W${value}`} />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                formatter={(value, name) => [
                  value,
                  name === 'demandIndex' ? 'Weekly Demand Index' : 
                  name === 'demandUpper' ? 'Upper Bound' : 'Lower Bound'
                ]}
                labelFormatter={(value) => `Week ${value}`}
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