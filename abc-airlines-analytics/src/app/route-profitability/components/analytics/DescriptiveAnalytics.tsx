import { useState } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Plane,
  Calendar,
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface DescriptiveAnalyticsProps {
  selectedRoute: string
  timeRange: string
  onRouteChange: (route: string) => void
  onTimeRangeChange: (range: string) => void
}

export default function DescriptiveAnalytics({ selectedRoute, timeRange, onTimeRangeChange }: DescriptiveAnalyticsProps) {
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

  // Generate route data based on time period
  const getRouteData = (routeId: string, timePeriod: string) => {
    const baseMetrics = {
      'LON-PAR': { revenue: 2500000, cost: 2050000, profit: 450000, loadFactor: 78, passengers: 42000 },
      'LON-NYC': { revenue: 6800000, cost: 5200000, profit: 1600000, loadFactor: 82, passengers: 38000 },
      'BRS-PRG': { revenue: 800000, cost: 1000000, profit: -200000, loadFactor: 45, passengers: 12000 },
      'MIA-NYC': { revenue: 5200000, cost: 4100000, profit: 1100000, loadFactor: 75, passengers: 35000 }
    }
    
    // Adjust metrics based on time period
    const timeMultipliers = {
      'last_month': 0.08, // 1/12 of yearly data
      'last_quarter': 0.25, // 1/4 of yearly data
      'last_year': 1.0, // Full yearly data
      'ytd': 0.75 // Assuming 9 months YTD
    }
    
    const base = baseMetrics[routeId as keyof typeof baseMetrics] || baseMetrics['LON-PAR']
    const multiplier = timeMultipliers[timePeriod as keyof typeof timeMultipliers] || 1
    
    return {
      revenue: Math.round(base.revenue * multiplier),
      cost: Math.round(base.cost * multiplier),
      profit: Math.round(base.profit * multiplier),
      loadFactor: base.loadFactor, // Load factor doesn't change with time period
      passengers: Math.round(base.passengers * multiplier)
    }
  }

  const routeData = getRouteData(selectedRoute, timeRange)

  // Generate trend data based on time period
  const getTrendData = (data: any, period: string) => {
    if (period === 'last_month') {
      // Daily data for last month
      return Array.from({ length: 30 }, (_, i) => ({
        period: `Day ${i + 1}`,
        revenue: data.revenue * (0.8 + Math.random() * 0.4),
        profit: data.profit * (0.7 + Math.random() * 0.6),
        loadFactor: Math.max(30, Math.min(95, data.loadFactor * (0.8 + Math.random() * 0.4)))
      }))
    } else if (period === 'last_quarter') {
      // Weekly data for last quarter
      return Array.from({ length: 12 }, (_, i) => ({
        period: `Week ${i + 1}`,
        revenue: data.revenue * (0.85 + Math.random() * 0.3),
        profit: data.profit * (0.8 + Math.random() * 0.4),
        loadFactor: Math.max(30, Math.min(95, data.loadFactor * (0.85 + Math.random() * 0.3)))
      }))
    } else if (period === 'ytd') {
      // Monthly data for YTD (9 months)
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
      return months.map((month, i) => ({
        period: month,
        revenue: data.revenue * (0.8 + (i / 9) * 0.4 + Math.random() * 0.2),
        profit: data.profit * (0.7 + (i / 9) * 0.6 + Math.random() * 0.2),
        loadFactor: Math.max(30, Math.min(95, data.loadFactor * (0.85 + Math.random() * 0.3)))
      }))
    } else {
      // Monthly data for full year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return months.map((month, i) => ({
        period: month,
        revenue: data.revenue * (0.85 + Math.sin((i / 12) * Math.PI * 2) * 0.2 + Math.random() * 0.1),
        profit: data.profit * (0.7 + Math.sin((i / 12) * Math.PI * 2) * 0.4 + Math.random() * 0.1),
        loadFactor: Math.max(30, Math.min(95, data.loadFactor * (0.9 + Math.sin((i / 12) * Math.PI * 2) * 0.15)))
      }))
    }
  }

  const trendData = getTrendData(routeData, timeRange)

  // YoY comparison data
  const yoyData = [
    { metric: 'Revenue', thisYear: routeData.revenue, lastYear: routeData.revenue * 0.92, change: 8.7 },
    { metric: 'Profit', thisYear: routeData.profit, lastYear: routeData.profit * 0.85, change: 17.6 },
    { metric: 'Load Factor', thisYear: routeData.loadFactor, lastYear: routeData.loadFactor * 0.94, change: 6.4 },
    { metric: 'Passengers', thisYear: routeData.passengers, lastYear: routeData.passengers * 0.89, change: 12.4 }
  ]

  return (
    <div className="space-y-8">
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
            { value: 'last_month', label: 'Last Month', desc: '30 days', icon: '📅' },
            { value: 'last_quarter', label: 'Last Quarter', desc: '3 months', icon: '📊' },
            { value: 'last_year', label: 'Last Year', desc: '12 months', icon: '📈' },
            { value: 'ytd', label: 'Year to Date', desc: 'Jan - Now', icon: '🎯' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => handlePresetSelect(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                timeRange === period.value && !isCustomRange
                  ? 'bg-blue-600 text-white border-2 border-blue-400 shadow-lg'
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
              <CalendarDays className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Custom Date Range</span>
            </div>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isCustomRange || showDatePicker
                  ? 'bg-blue-600 text-white'
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
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full bg-slate-600 text-white border border-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
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

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="metric-card text-center">
          <div className="p-4 bg-blue-500/20 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <DollarSign className="w-8 h-8 text-blue-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Revenue</p>
          <p className="text-3xl font-bold text-white mb-2">{formatCurrency(routeData.revenue)}</p>
          <p className="text-green-400 text-sm">+8.7% vs last year</p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-4 bg-green-500/20 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          <p className="text-slate-400 text-sm mb-1">Profit</p>
          <p className={`text-3xl font-bold mb-2 ${routeData.profit > 0 ? 'text-white' : 'text-red-400'}`}>
            {formatCurrency(routeData.profit)}
          </p>
          <p className={`text-sm ${routeData.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
            {routeData.profit > 0 ? 'Profitable' : 'Loss Making'}
          </p>
            </div>
        
        <div className="metric-card text-center">
          <div className="p-4 bg-purple-500/20 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Load Factor</p>
          <p className="text-3xl font-bold text-white mb-2">{routeData.loadFactor}%</p>
          <p className="text-purple-400 text-sm">
            {routeData.loadFactor > 75 ? 'Excellent' : routeData.loadFactor > 60 ? 'Good' : 'Poor'}
          </p>
        </div>
        
        <div className="metric-card text-center">
          <div className="p-4 bg-orange-500/20 rounded-lg mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <Activity className="w-8 h-8 text-orange-400" />
          </div>
          <p className="text-slate-400 text-sm mb-1">Performance</p>
          <p className="text-3xl font-bold text-white mb-2">
            {Math.round(((routeData.profit / routeData.revenue) * 100))}%
          </p>
          <p className="text-orange-400 text-sm">Margin</p>
        </div>
      </div>

      {/* Main Chart */}
        <div className="metric-card">
        <h3 className="text-xl font-semibold text-white mb-6 text-center">12-Month Performance Trend</h3>
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="period" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
              <Tooltip 
                formatter={(value, name) => [
                formatCurrency(value as number),
                  name === 'revenue' ? 'Revenue' : 'Profit'
                ]}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="revenue" />
            <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={3} name="profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      {/* Simple Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">Route Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-white mb-2">
              {routeData.profit > 0 ? '✅' : '❌'}
          </div>
            <div className="text-xl font-semibold text-white">
              {routeData.profit > 0 ? 'PROFITABLE' : 'LOSS MAKING'}
                </div>
            <p className="text-blue-100 mt-2">Current Status</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">
              {Math.round(((routeData.profit / routeData.revenue) * 100))}%
            </div>
            <div className="text-xl font-semibold text-white">PROFIT MARGIN</div>
            <p className="text-blue-100 mt-2">Net Profitability</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-white mb-2">
              {routeData.loadFactor > 75 ? '🔥' : routeData.loadFactor > 60 ? '👍' : '⚠️'}
            </div>
            <div className="text-xl font-semibold text-white">{routeData.loadFactor}%</div>
            <p className="text-blue-100 mt-2">Load Factor</p>
          </div>
        </div>
      </div>
    </div>
  )
}