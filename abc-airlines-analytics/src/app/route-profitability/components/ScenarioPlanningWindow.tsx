import { useState } from 'react'
import { 
  ArrowLeft,
  Settings,
  Play,
  RefreshCw,
  Save,
  TrendingUp,
  TrendingDown,
  Calculator,
  Target,
  Plane,
  DollarSign,
  Users,
  Clock
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { formatCurrency } from '@/lib/utils'

interface ScenarioPlanningWindowProps {
  onNavigate: (window: string) => void
}

export default function ScenarioPlanningWindow({ onNavigate }: ScenarioPlanningWindowProps) {
  const [selectedRoute, setSelectedRoute] = useState('LON-PAR')
  const [scenarioName, setScenarioName] = useState('Optimization Test')
  
  // Scenario parameters
  const [frequency, setFrequency] = useState(14) // flights per week
  const [aircraftType, setAircraftType] = useState('A320')
  const [baseFare, setBaseFare] = useState(150)
  const [fuelPrice, setFuelPrice] = useState(100) // percentage
  const [departureTime, setDepartureTime] = useState('08:00')
  const [operatingDays, setOperatingDays] = useState(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'])

  // Current state (baseline)
  const currentState = {
    frequency: 14,
    aircraft: 'A320',
    seats: 180,
    loadFactor: 78,
    revenue: 2500000,
    costs: 2050000,
    profit: 450000,
    margin: 18,
    passengers: 42000
  }

  // Calculate new state based on parameters
  const calculateScenario = () => {
    const aircraftSeats = aircraftType === 'A319' ? 150 : aircraftType === 'A320' ? 180 : 220
    const frequencyMultiplier = frequency / currentState.frequency
    const fareMultiplier = baseFare / 150
    const fuelMultiplier = fuelPrice / 100
    
    // Simple calculation model
    const newSeats = aircraftSeats
    const newPassengers = Math.round(currentState.passengers * frequencyMultiplier * (fareMultiplier > 1 ? 0.9 : 1.1))
    const newLoadFactor = Math.min(95, Math.round((newPassengers / (newSeats * frequency * 52)) * 100))
    const newRevenue = Math.round(newPassengers * baseFare * 1.2) // Include ancillary
    const newCosts = Math.round(currentState.costs * frequencyMultiplier * fuelMultiplier)
    const newProfit = newRevenue - newCosts
    const newMargin = Math.round((newProfit / newRevenue) * 100)

    return {
      frequency,
      aircraft: aircraftType,
      seats: newSeats,
      loadFactor: newLoadFactor,
      revenue: newRevenue,
      costs: newCosts,
      profit: newProfit,
      margin: newMargin,
      passengers: newPassengers
    }
  }

  const newState = calculateScenario()

  // Comparison data for charts
  const comparisonData = [
    {
      metric: 'Revenue',
      current: currentState.revenue,
      scenario: newState.revenue,
      change: ((newState.revenue - currentState.revenue) / currentState.revenue) * 100
    },
    {
      metric: 'Costs',
      current: currentState.costs,
      scenario: newState.costs,
      change: ((newState.costs - currentState.costs) / currentState.costs) * 100
    },
    {
      metric: 'Profit',
      current: currentState.profit,
      scenario: newState.profit,
      change: ((newState.profit - currentState.profit) / currentState.profit) * 100
    }
  ]

  // Sensitivity analysis data
  const sensitivityData = [
    { factor: 'Fare +10%', impact: 850000 },
    { factor: 'Fare -10%', impact: -650000 },
    { factor: 'Frequency +2', impact: 420000 },
    { factor: 'Frequency -2', impact: -380000 },
    { factor: 'Load Factor +5%', impact: 290000 },
    { factor: 'Load Factor -5%', impact: -270000 },
    { factor: 'Fuel +20%', impact: -180000 },
    { factor: 'Fuel -20%', impact: 180000 }
  ]

  const handleDayToggle = (day: string) => {
    if (operatingDays.includes(day)) {
      setOperatingDays(operatingDays.filter(d => d !== day))
    } else {
      setOperatingDays([...operatingDays, day])
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
              What-If Scenario Planning
            </h2>
            <p className="text-slate-400">
              Test different operational parameters and see real-time impact on profitability
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Scenario</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Run Analysis</span>
          </button>
        </div>
      </div>

      {/* Scenario Setup */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Scenario Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Route & Schedule</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Route</label>
                  <select 
                    value={selectedRoute}
                    onChange={(e) => setSelectedRoute(e.target.value)}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="LON-PAR">London - Paris</option>
                    <option value="LON-NYC">London - New York</option>
                    <option value="MIA-NYC">Miami - New York</option>
                    <option value="MAD-BCN">Madrid - Barcelona</option>
                    <option value="BRS-PRG">Bristol - Prague</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Scenario Name</label>
                  <input
                    type="text"
                    value={scenarioName}
                    onChange={(e) => setScenarioName(e.target.value)}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Frequency (flights/week)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="28"
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12">{frequency}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Aircraft Type</label>
                  <select 
                    value={aircraftType}
                    onChange={(e) => setAircraftType(e.target.value)}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="A319">A319 (150 seats)</option>
                    <option value="A320">A320 (180 seats)</option>
                    <option value="A321">A321 (220 seats)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Departure Time</label>
                  <input
                    type="time"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    className="w-full bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Pricing & Costs</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Base Fare ($)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="75"
                      max="300"
                      value={baseFare}
                      onChange={(e) => setBaseFare(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-16">${baseFare}</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Fuel Price (% of current)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="70"
                      max="130"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(Number(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-white text-sm w-12">{fuelPrice}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Operating Days</h4>
              <div className="grid grid-cols-7 gap-2">
                {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`p-2 rounded text-xs font-medium transition-colors ${
                      operatingDays.includes(day)
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {day.charAt(0).toUpperCase() + day.slice(1, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Impact Summary */}
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Scenario Impact</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{formatCurrency(newState.revenue)}</div>
                  <div className="text-sm text-slate-400">Revenue</div>
                  <div className={`text-xs font-medium ${
                    newState.revenue > currentState.revenue ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {newState.revenue > currentState.revenue ? '+' : ''}{formatCurrency(newState.revenue - currentState.revenue)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{formatCurrency(newState.profit)}</div>
                  <div className="text-sm text-slate-400">Profit</div>
                  <div className={`text-xs font-medium ${
                    newState.profit > currentState.profit ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {newState.profit > currentState.profit ? '+' : ''}{formatCurrency(newState.profit - currentState.profit)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Target className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{newState.margin}%</div>
                  <div className="text-sm text-slate-400">Margin</div>
                  <div className={`text-xs font-medium ${
                    newState.margin > currentState.margin ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {newState.margin > currentState.margin ? '+' : ''}{newState.margin - currentState.margin}pp
                  </div>
                </div>
                
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="text-lg font-bold text-white">{newState.loadFactor}%</div>
                  <div className="text-sm text-slate-400">Load Factor</div>
                  <div className={`text-xs font-medium ${
                    newState.loadFactor > currentState.loadFactor ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {newState.loadFactor > currentState.loadFactor ? '+' : ''}{newState.loadFactor - currentState.loadFactor}pp
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Current vs Scenario Comparison</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="metric" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" tickFormatter={(value) => `$${value/1000000}M`} />
                  <Tooltip 
                    formatter={(value, name) => [formatCurrency(value as number), name === 'current' ? 'Current' : 'Scenario']}
                    labelStyle={{ color: '#f1f5f9' }}
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  />
                  <Bar dataKey="current" fill="#64748b" name="current" />
                  <Bar dataKey="scenario" fill="#3b82f6" name="scenario" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ROI Calculation */}
            <div className="metric-card">
              <h4 className="text-lg font-semibold text-white mb-4">Return on Investment</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-white">{formatCurrency(Math.abs(newState.profit - currentState.profit) * 12)}</div>
                  <div className="text-sm text-slate-400">Annual Impact</div>
                </div>
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-white">$2.5M</div>
                  <div className="text-sm text-slate-400">Implementation Cost</div>
                </div>
                <div className="text-center p-4 bg-slate-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(((Math.abs(newState.profit - currentState.profit) * 12) / 2500000) * 100)}%
                  </div>
                  <div className="text-sm text-slate-400">Annual ROI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sensitivity Analysis */}
      <section>
        <h3 className="text-xl font-semibold text-white mb-4">Sensitivity Analysis</h3>
        <div className="metric-card">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sensitivityData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis type="number" stroke="#94a3b8" tickFormatter={(value) => `$${value/1000}K`} />
              <YAxis dataKey="factor" type="category" stroke="#94a3b8" width={100} />
              <Tooltip 
                formatter={(value) => [formatCurrency(value as number), 'Profit Impact']}
                labelStyle={{ color: '#f1f5f9' }}
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
              />
              <Bar 
                dataKey="impact" 
                fill={(entry) => entry.impact > 0 ? '#10b981' : '#ef4444'}
                name="impact"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Scenario Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className={`text-3xl font-bold ${newState.profit > currentState.profit ? 'text-green-200' : 'text-red-200'} mb-2`}>
              {newState.profit > currentState.profit ? '+' : ''}{Math.round(((newState.profit - currentState.profit) / currentState.profit) * 100)}%
            </div>
            <p className="text-indigo-100">Profit Change</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">
              {Math.round(((newState.revenue - currentState.revenue) / currentState.revenue) * 100)}%
            </div>
            <p className="text-indigo-100">Revenue Change</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-white mb-2">6 months</div>
            <p className="text-indigo-100">Payback Period</p>
          </div>
        </div>
      </div>
    </div>
  )
}