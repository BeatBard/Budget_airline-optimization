import { useState } from 'react'
import { 
  ArrowLeft,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Brain,
  Zap,
  Target,
  Calendar,
  Download,
  RefreshCw,
  Filter,
  Eye,
  AlertCircle,
  CheckCircle,
  Activity
} from 'lucide-react'

// Import individual analytics components
import DescriptiveAnalytics from './analytics/DescriptiveAnalytics'
import DiagnosticAnalytics from './analytics/DiagnosticAnalytics'
import PredictiveAnalytics from './analytics/PredictiveAnalytics'
import PrescriptiveAnalytics from './analytics/PrescriptiveAnalytics'

interface ProfitabilityAnalysisWindowProps {
  onNavigate: (window: string) => void
}

type AnalyticsLayer = 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive'

export default function ProfitabilityAnalysisWindow({ onNavigate }: ProfitabilityAnalysisWindowProps) {
  const [activeLayer, setActiveLayer] = useState<AnalyticsLayer>('descriptive')
  const [selectedRoute, setSelectedRoute] = useState('LON-PAR')
  const [timeRange, setTimeRange] = useState('last_quarter')

  const analyticsLayers = [
    {
      id: 'descriptive' as AnalyticsLayer,
      name: 'Descriptive',
      subtitle: 'What happened?',
      description: 'Historical performance analysis',
      icon: <BarChart3 className="w-5 h-5" />,
      color: 'blue'
    },
    {
      id: 'diagnostic' as AnalyticsLayer,
      name: 'Diagnostic',
      subtitle: 'Why did it happen?',
      description: 'Root cause analysis with AI',
      icon: <Brain className="w-5 h-5" />,
      color: 'purple'
    },
    {
      id: 'predictive' as AnalyticsLayer,
      name: 'Predictive',
      subtitle: 'What will happen?',
      description: 'ML-powered forecasting',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'green'
    },
    {
      id: 'prescriptive' as AnalyticsLayer,
      name: 'Prescriptive',
      subtitle: 'What should we do?',
      description: 'Actionable recommendations',
      icon: <Target className="w-5 h-5" />,
      color: 'orange'
    }
  ]

  const getTabColor = (color: string, isActive: boolean) => {
    const colors = {
      blue: isActive ? 'bg-blue-600 text-white' : 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30',
      purple: isActive ? 'bg-purple-600 text-white' : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30',
      green: isActive ? 'bg-green-600 text-white' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30',
      orange: isActive ? 'bg-orange-600 text-white' : 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
    }
    return colors[color as keyof typeof colors]
  }

  const renderAnalyticsContent = () => {
    const commonProps = {
      selectedRoute,
      timeRange,
      onRouteChange: setSelectedRoute,
      onTimeRangeChange: setTimeRange
    }

    switch (activeLayer) {
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
              Route Analytics Stack
            </h2>
            <p className="text-slate-400">
              4-layer analytics: Descriptive → Diagnostic → Predictive → Prescriptive
            </p>
          </div>
        </div>
        
        {/* Global Controls */}
        <div className="flex items-center space-x-4">
          <select 
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="LON-PAR">London - Paris</option>
            <option value="LON-NYC">London - New York</option>
            <option value="MIA-NYC">Miami - New York</option>
            <option value="MAD-BCN">Madrid - Barcelona</option>
            <option value="FRA-MUC">Frankfurt - Munich</option>
            <option value="BRS-PRG">Bristol - Prague</option>
            <option value="LDS-BUD">Leeds - Budapest</option>
          </select>
          
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="last_year">Last Year</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Analytics Layer Navigation */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Analytics Layers</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {analyticsLayers.map((layer, index) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={`p-4 rounded-lg transition-all duration-200 text-left ${getTabColor(layer.color, activeLayer === layer.id)}`}
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10">
                  {layer.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{layer.name}</div>
                  <div className="text-xs opacity-75">{layer.subtitle}</div>
                </div>
                {index < 3 && (
                  <div className="hidden md:block text-xl opacity-50">→</div>
                )}
              </div>
              <p className="text-xs opacity-75">{layer.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Current Layer Indicator */}
      <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTabColor(analyticsLayers.find(l => l.id === activeLayer)?.color || 'blue', true)}`}>
            {analyticsLayers.find(l => l.id === activeLayer)?.icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {analyticsLayers.find(l => l.id === activeLayer)?.name} Analytics
            </h3>
            <p className="text-slate-400 text-sm">
              {analyticsLayers.find(l => l.id === activeLayer)?.subtitle} - {analyticsLayers.find(l => l.id === activeLayer)?.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Route:</span>
          <span className="text-white font-medium">{selectedRoute}</span>
          <span className="text-slate-400">|</span>
          <span className="text-sm text-slate-400">Period:</span>
          <span className="text-white font-medium">{timeRange.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Analytics Content */}
      <div className="min-h-[600px]">
        {renderAnalyticsContent()}
      </div>

      {/* Layer Navigation Footer */}
      <div className="flex items-center justify-between bg-slate-800 rounded-lg p-4">
        <button
          onClick={() => {
            const currentIndex = analyticsLayers.findIndex(l => l.id === activeLayer)
            if (currentIndex > 0) {
              setActiveLayer(analyticsLayers[currentIndex - 1].id)
            }
          }}
          disabled={activeLayer === 'descriptive'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeLayer === 'descriptive'
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          ← Previous Layer
        </button>
        
        <div className="flex items-center space-x-2">
          {analyticsLayers.map((layer, index) => (
            <div
              key={layer.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                activeLayer === layer.id
                  ? 'bg-blue-500'
                  : index < analyticsLayers.findIndex(l => l.id === activeLayer)
                  ? 'bg-green-500'
                  : 'bg-slate-600'
              }`}
            />
          ))}
        </div>
        
        <button
          onClick={() => {
            const currentIndex = analyticsLayers.findIndex(l => l.id === activeLayer)
            if (currentIndex < analyticsLayers.length - 1) {
              setActiveLayer(analyticsLayers[currentIndex + 1].id)
            }
          }}
          disabled={activeLayer === 'prescriptive'}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeLayer === 'prescriptive'
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          Next Layer →
        </button>
      </div>
    </div>
  )
}