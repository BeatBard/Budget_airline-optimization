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
      {/* Time Period Selector */}
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Select Analysis Period</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { value: 'last_month', label: 'Last Month', desc: '30 days' },
            { value: 'last_quarter', label: 'Last Quarter', desc: '3 months' },
            { value: 'last_year', label: 'Last Year', desc: '12 months' },
            { value: 'ytd', label: 'Year to Date', desc: 'Jan - Now' }
          ].map((period) => (
            <button
              key={period.value}
              onClick={() => onTimeRangeChange(period.value)}
              className={`p-3 rounded-lg text-left transition-all ${
                timeRange === period.value
                  ? 'bg-blue-600 text-white border-2 border-blue-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 border-2 border-transparent'
              }`}
            >
              <div className="font-medium">{period.label}</div>
              <div className="text-sm opacity-75">{period.desc}</div>
            </button>
          ))}
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