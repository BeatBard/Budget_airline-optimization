'use client'

import { useState } from 'react'
import { 
  Brain,
  TrendingUp, 
  Target,
  BarChart3,
  ArrowRight
} from 'lucide-react'

// Import analytics components directly
import DescriptiveAnalytics from './components/analytics/DescriptiveAnalytics'
import DiagnosticAnalytics from './components/analytics/DiagnosticAnalytics'
import PredictiveAnalytics from './components/analytics/PredictiveAnalytics'
import PrescriptiveAnalytics from './components/analytics/PrescriptiveAnalytics'

type WindowType = 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive'

export default function RouteProfitabilityPage() {
  const [activeWindow, setActiveWindow] = useState<WindowType>('descriptive')
  const [selectedRoute, setSelectedRoute] = useState('LON-PAR')
  const [timeRange, setTimeRange] = useState('last_quarter')

  const renderActiveWindow = () => {
    const commonProps = {
      selectedRoute,
      timeRange,
      onRouteChange: setSelectedRoute,
      onTimeRangeChange: setTimeRange
    }

    switch (activeWindow) {
      case 'descriptive':
        return <DescriptiveAnalytics {...commonProps} />
      case 'diagnostic':
        return <DiagnosticAnalytics {...commonProps} />
      case 'predictive':
        return <PredictiveAnalytics {...commonProps} />
      case 'prescriptive':
        return <PrescriptiveAnalytics {...commonProps} />
      default:
        return <DescriptiveAnalytics {...commonProps} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              ABC Airlines - Route Profitability Analysis
            </h1>
            <p className="text-slate-400 text-sm">
              Transform route decisions from days to minutes with 85% prediction accuracy
            </p>
          </div>
          
          {/* Analytics Process Navigation */}
          <div className="flex space-x-3">
            <select 
              value={selectedRoute}
              onChange={(e) => setSelectedRoute(e.target.value)}
              className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm mr-4"
            >
              <option value="LON-PAR">London - Paris</option>
              <option value="LON-NYC">London - New York</option>
              <option value="BRS-PRG">Bristol - Prague</option>
              <option value="MIA-NYC">Miami - New York</option>
            </select>

            <div className="flex space-x-1">
              <button
                onClick={() => setActiveWindow('descriptive')}
                className={`px-4 py-2 rounded-l-lg text-sm font-medium transition-colors border-r border-slate-600 ${
                  activeWindow === 'descriptive'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>1. Descriptive</span>
                </div>
                <div className="text-xs opacity-75">What happened?</div>
              </button>
              
              <button
                onClick={() => setActiveWindow('diagnostic')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r border-slate-600 ${
                  activeWindow === 'diagnostic'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Brain className="w-4 h-4" />
                  <span>2. Diagnostic</span>
                </div>
                <div className="text-xs opacity-75">Why happened?</div>
              </button>
              
              <button
                onClick={() => setActiveWindow('predictive')}
                className={`px-4 py-2 text-sm font-medium transition-colors border-r border-slate-600 ${
                  activeWindow === 'predictive'
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>3. Predictive</span>
                </div>
                <div className="text-xs opacity-75">What will happen?</div>
              </button>
              
              <button
                onClick={() => setActiveWindow('prescriptive')}
                className={`px-4 py-2 rounded-r-lg text-sm font-medium transition-colors ${
                  activeWindow === 'prescriptive'
                    ? 'bg-orange-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>4. Prescriptive</span>
                </div>
                <div className="text-xs opacity-75">What to do?</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-8 pb-24">
        {renderActiveWindow()}
      </div>

      {/* Progress Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <button
            onClick={() => {
              const steps: WindowType[] = ['descriptive', 'diagnostic', 'predictive', 'prescriptive']
              const currentIndex = steps.indexOf(activeWindow)
              if (currentIndex > 0) {
                setActiveWindow(steps[currentIndex - 1])
              }
            }}
            disabled={activeWindow === 'descriptive'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeWindow === 'descriptive'
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>← Previous</span>
          </button>
          
          {/* Progress Indicator */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {(['descriptive', 'diagnostic', 'predictive', 'prescriptive'] as WindowType[]).map((step, index) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full transition-colors ${
                      activeWindow === step
                        ? 'bg-blue-500'
                        : index < ['descriptive', 'diagnostic', 'predictive', 'prescriptive'].indexOf(activeWindow)
                        ? 'bg-green-500'
                        : 'bg-slate-600'
                    }`}
                  />
                  {index < 3 && (
                    <ArrowRight className="w-4 h-4 text-slate-500 mx-2" />
                  )}
                </div>
              ))}
            </div>
            <span className="text-white font-medium capitalize">
              {activeWindow} Analytics
            </span>
          </div>
          
          <button
            onClick={() => {
              const steps: WindowType[] = ['descriptive', 'diagnostic', 'predictive', 'prescriptive']
              const currentIndex = steps.indexOf(activeWindow)
              if (currentIndex < steps.length - 1) {
                setActiveWindow(steps[currentIndex + 1])
              }
            }}
            disabled={activeWindow === 'prescriptive'}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeWindow === 'prescriptive'
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <span>Next →</span>
          </button>
        </div>
      </div>
    </div>
  )
}