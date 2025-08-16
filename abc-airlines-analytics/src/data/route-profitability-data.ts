export interface RoutePerformance {
  date: string
  route_id: string
  flight_number: string
  seats_available: number
  passengers_booked: number
  load_factor: number
  revenue_base_fare: number
  revenue_ancillary: number
  revenue_cargo: number
  revenue_other: number
  revenue_total: number
  cost_fuel: number
  cost_crew: number
  cost_airport: number
  cost_ground_handling: number
  cost_maintenance: number
  cost_catering: number
  cost_navigation: number
  cost_insurance: number
  cost_aircraft_ownership: number
  cost_marketing: number
  cost_overhead: number
  cost_total: number
  gross_profit: number
  operating_profit: number
  net_profit: number
  profit_margin: number
  on_time_departure: boolean
  delay_minutes: number
  cancelled: boolean
  aircraft_type: string
  block_hours: number
}

export interface RouteMaster {
  route_id: string
  origin_airport: string
  destination_airport: string
  route_name: string
  distance_km: number
  flight_time_mins: number
  route_type: 'Domestic' | 'International' | 'Regional'
  market_size: 'Large' | 'Medium' | 'Small'
  hub_classification: 'Hub-Hub' | 'Hub-Spoke' | 'Spoke-Spoke'
  strategic_importance: 'High' | 'Medium' | 'Low'
  years_operating: number
  slot_restricted: boolean
}

export interface Competition {
  date: string
  route_id: string
  num_competitors: number
  our_capacity: number
  total_market_capacity: number
  market_share: number
  our_avg_fare: number
  competitor_min_fare: number
  competitor_avg_fare: number
  price_index: number
  new_entrant_flag: boolean
}

export interface RouteForecast {
  forecast_date: string
  route_id: string
  target_date: string
  predicted_passengers: number
  passenger_lower_bound: number
  passenger_upper_bound: number
  predicted_revenue: number
  revenue_lower_bound: number
  revenue_upper_bound: number
  predicted_load_factor: number
  profit_probability: number
  risk_score: number
  confidence_level: number
}

export interface RouteScore {
  route_id: string
  profitability_score: number
  operational_score: number
  strategic_score: number
  risk_score: number
  total_score: number
  classification: 'Stars' | 'Cash Cows' | 'Question Marks' | 'Dogs'
  trend: 'up' | 'down' | 'stable'
}

export interface Recommendation {
  id: string
  route_id: string
  type: 'immediate_actions' | 'tactical_improvements' | 'strategic_decisions'
  category: string
  title: string
  description: string
  impact: 'High' | 'Medium' | 'Low'
  effort: 'Easy' | 'Medium' | 'Hard'
  timeline: 'Immediate' | 'Short-term' | 'Long-term'
  confidence: 'High' | 'Medium' | 'Low'
  potential_savings: number
  urgency: 'high' | 'medium' | 'low'
}

export interface Alert {
  id: string
  route_id: string
  type: 'performance_degradation' | 'competitive_threats' | 'opportunity_windows' | 'operational_issues'
  title: string
  description: string
  impact_assessment: string
  recommended_action: string
  urgency: 'high' | 'medium' | 'low'
  created_date: string
}

// Generate dummy data
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  while (start <= end) {
    dates.push(start.toISOString().split('T')[0])
    start.setDate(start.getDate() + 1)
  }
  
  return dates
}

function getSeasonalMultiplier(date: string, routeType: 'business' | 'leisure'): number {
  const month = new Date(date).getMonth() + 1
  
  if (routeType === 'business') {
    // Business routes: summer low, winter high
    return month >= 6 && month <= 8 ? 0.9 : 1.1
  } else {
    // Leisure routes: summer high, winter low
    return month >= 6 && month <= 8 ? 1.4 : 0.6
  }
}

function getDayOfWeekMultiplier(date: string, routeType: 'business' | 'leisure'): number {
  const dayOfWeek = new Date(date).getDay()
  
  const businessMultipliers = [1.0, 1.1, 0.9, 0.9, 1.1, 1.3, 0.7] // Sun-Sat
  const leisureMultipliers = [1.2, 0.8, 0.8, 0.8, 1.0, 1.3, 1.4] // Sun-Sat
  
  return routeType === 'business' ? businessMultipliers[dayOfWeek] : leisureMultipliers[dayOfWeek]
}

// Route master data for 50 routes
export const routeMasterData: RouteMaster[] = [
  // High Profit Routes (15 routes - 30%)
  { route_id: 'LON-PAR', origin_airport: 'LHR', destination_airport: 'CDG', route_name: 'London-Paris', distance_km: 344, flight_time_mins: 85, route_type: 'International', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 8, slot_restricted: true },
  { route_id: 'LON-NYC', origin_airport: 'LHR', destination_airport: 'JFK', route_name: 'London-New York', distance_km: 5585, flight_time_mins: 480, route_type: 'International', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 12, slot_restricted: true },
  { route_id: 'PAR-ROM', origin_airport: 'CDG', destination_airport: 'FCO', route_name: 'Paris-Rome', distance_km: 1105, flight_time_mins: 140, route_type: 'International', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 10, slot_restricted: false },
  { route_id: 'MAD-BCN', origin_airport: 'MAD', destination_airport: 'BCN', route_name: 'Madrid-Barcelona', distance_km: 483, flight_time_mins: 75, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Spoke', strategic_importance: 'High', years_operating: 15, slot_restricted: false },
  { route_id: 'FRA-MUC', origin_airport: 'FRA', destination_airport: 'MUC', route_name: 'Frankfurt-Munich', distance_km: 230, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Spoke', strategic_importance: 'High', years_operating: 18, slot_restricted: false },
  { route_id: 'AMS-BCN', origin_airport: 'AMS', destination_airport: 'BCN', route_name: 'Amsterdam-Barcelona', distance_km: 1243, flight_time_mins: 125, route_type: 'International', market_size: 'Large', hub_classification: 'Hub-Spoke', strategic_importance: 'High', years_operating: 9, slot_restricted: false },
  { route_id: 'DUB-LON', origin_airport: 'DUB', destination_airport: 'LHR', route_name: 'Dublin-London', distance_km: 463, flight_time_mins: 85, route_type: 'International', market_size: 'Large', hub_classification: 'Spoke-Hub', strategic_importance: 'High', years_operating: 14, slot_restricted: true },
  { route_id: 'ZUR-VIE', origin_airport: 'ZUR', destination_airport: 'VIE', route_name: 'Zurich-Vienna', distance_km: 596, flight_time_mins: 95, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Spoke', strategic_importance: 'Medium', years_operating: 7, slot_restricted: false },
  { route_id: 'CPH-OSL', origin_airport: 'CPH', destination_airport: 'OSL', route_name: 'Copenhagen-Oslo', distance_km: 483, flight_time_mins: 75, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 11, slot_restricted: false },
  { route_id: 'STO-HEL', origin_airport: 'ARN', destination_airport: 'HEL', route_name: 'Stockholm-Helsinki', distance_km: 396, flight_time_mins: 70, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 8, slot_restricted: false },
  { route_id: 'MIA-NYC', origin_airport: 'MIA', destination_airport: 'JFK', route_name: 'Miami-New York', distance_km: 1761, flight_time_mins: 180, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 6, slot_restricted: true },
  { route_id: 'LAX-LAS', origin_airport: 'LAX', destination_airport: 'LAS', route_name: 'Los Angeles-Las Vegas', distance_km: 379, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Spoke', strategic_importance: 'Medium', years_operating: 13, slot_restricted: false },
  { route_id: 'SFO-SEA', origin_airport: 'SFO', destination_airport: 'SEA', route_name: 'San Francisco-Seattle', distance_km: 1093, flight_time_mins: 125, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 9, slot_restricted: true },
  { route_id: 'ORD-DEN', origin_airport: 'ORD', destination_airport: 'DEN', route_name: 'Chicago-Denver', distance_km: 1474, flight_time_mins: 155, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 11, slot_restricted: false },
  { route_id: 'ATL-MIA', origin_airport: 'ATL', destination_airport: 'MIA', route_name: 'Atlanta-Miami', distance_km: 973, flight_time_mins: 115, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 14, slot_restricted: false },

  // Moderate Profit Routes (20 routes - 40%)
  { route_id: 'MAN-DUB', origin_airport: 'MAN', destination_airport: 'DUB', route_name: 'Manchester-Dublin', distance_km: 290, flight_time_mins: 65, route_type: 'International', market_size: 'Medium', hub_classification: 'Spoke-Spoke', strategic_importance: 'Medium', years_operating: 6, slot_restricted: false },
  { route_id: 'EDI-AMS', origin_airport: 'EDI', destination_airport: 'AMS', route_name: 'Edinburgh-Amsterdam', distance_km: 565, flight_time_mins: 90, route_type: 'International', market_size: 'Medium', hub_classification: 'Spoke-Hub', strategic_importance: 'Medium', years_operating: 5, slot_restricted: false },
  { route_id: 'BER-WAW', origin_airport: 'BER', destination_airport: 'WAW', route_name: 'Berlin-Warsaw', distance_km: 516, flight_time_mins: 85, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 4, slot_restricted: false },
  { route_id: 'MIL-NAP', origin_airport: 'MXP', destination_airport: 'NAP', route_name: 'Milan-Naples', distance_km: 658, flight_time_mins: 95, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Hub-Spoke', strategic_importance: 'Medium', years_operating: 8, slot_restricted: false },
  { route_id: 'LIS-MAD', origin_airport: 'LIS', destination_airport: 'MAD', route_name: 'Lisbon-Madrid', distance_km: 502, flight_time_mins: 80, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 7, slot_restricted: false },
  { route_id: 'GLA-BRU', origin_airport: 'GLA', destination_airport: 'BRU', route_name: 'Glasgow-Brussels', distance_km: 664, flight_time_mins: 95, route_type: 'International', market_size: 'Medium', hub_classification: 'Spoke-Hub', strategic_importance: 'Low', years_operating: 3, slot_restricted: false },
  { route_id: 'BOL-MIL', origin_airport: 'BLQ', destination_airport: 'MXP', route_name: 'Bologna-Milan', distance_km: 201, flight_time_mins: 55, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Hub', strategic_importance: 'Low', years_operating: 4, slot_restricted: false },
  { route_id: 'HAM-VIE', origin_airport: 'HAM', destination_airport: 'VIE', route_name: 'Hamburg-Vienna', distance_km: 779, flight_time_mins: 105, route_type: 'International', market_size: 'Medium', hub_classification: 'Spoke-Hub', strategic_importance: 'Medium', years_operating: 5, slot_restricted: false },
  { route_id: 'BUD-PRG', origin_airport: 'BUD', destination_airport: 'PRG', route_name: 'Budapest-Prague', distance_km: 443, flight_time_mins: 75, route_type: 'International', market_size: 'Medium', hub_classification: 'Spoke-Spoke', strategic_importance: 'Medium', years_operating: 6, slot_restricted: false },
  { route_id: 'ATH-ROM', origin_airport: 'ATH', destination_airport: 'FCO', route_name: 'Athens-Rome', distance_km: 1054, flight_time_mins: 135, route_type: 'International', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 9, slot_restricted: false },
  { route_id: 'DEN-PHX', origin_airport: 'DEN', destination_airport: 'PHX', route_name: 'Denver-Phoenix', distance_km: 957, flight_time_mins: 115, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Hub-Spoke', strategic_importance: 'Medium', years_operating: 7, slot_restricted: false },
  { route_id: 'SEA-PDX', origin_airport: 'SEA', destination_airport: 'PDX', route_name: 'Seattle-Portland', distance_km: 233, flight_time_mins: 55, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Hub-Spoke', strategic_importance: 'Low', years_operating: 8, slot_restricted: false },
  { route_id: 'BOS-BWI', origin_airport: 'BOS', destination_airport: 'BWI', route_name: 'Boston-Baltimore', distance_km: 634, flight_time_mins: 90, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Hub-Spoke', strategic_importance: 'Medium', years_operating: 5, slot_restricted: false },
  { route_id: 'DTW-MSP', origin_airport: 'DTW', destination_airport: 'MSP', route_name: 'Detroit-Minneapolis', distance_km: 981, flight_time_mins: 115, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Hub-Hub', strategic_importance: 'Medium', years_operating: 10, slot_restricted: false },
  { route_id: 'IAH-DFW', origin_airport: 'IAH', destination_airport: 'DFW', route_name: 'Houston-Dallas', distance_km: 362, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Large', hub_classification: 'Hub-Hub', strategic_importance: 'High', years_operating: 12, slot_restricted: false },
  { route_id: 'MCO-FLL', origin_airport: 'MCO', destination_airport: 'FLL', route_name: 'Orlando-Fort Lauderdale', distance_km: 298, flight_time_mins: 60, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 6, slot_restricted: false },
  { route_id: 'PHX-SAN', origin_airport: 'PHX', destination_airport: 'SAN', route_name: 'Phoenix-San Diego', distance_km: 482, flight_time_mins: 75, route_type: 'Domestic', market_size: 'Medium', hub_classification: 'Spoke-Spoke', strategic_importance: 'Medium', years_operating: 9, slot_restricted: false },
  { route_id: 'STL-KCI', origin_airport: 'STL', destination_airport: 'MCI', route_name: 'St. Louis-Kansas City', distance_km: 383, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 7, slot_restricted: false },
  { route_id: 'CLE-PIT', origin_airport: 'CLE', destination_airport: 'PIT', route_name: 'Cleveland-Pittsburgh', distance_km: 185, flight_time_mins: 50, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 5, slot_restricted: false },
  { route_id: 'MEM-BNA', origin_airport: 'MEM', destination_airport: 'BNA', route_name: 'Memphis-Nashville', distance_km: 300, flight_time_mins: 60, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 4, slot_restricted: false },

  // Loss Making Routes (15 routes - 30%)
  { route_id: 'BRS-PRG', origin_airport: 'BRS', destination_airport: 'PRG', route_name: 'Bristol-Prague', distance_km: 1318, flight_time_mins: 165, route_type: 'International', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 2, slot_restricted: false },
  { route_id: 'LDS-BUD', origin_airport: 'LBA', destination_airport: 'BUD', route_name: 'Leeds-Budapest', distance_km: 1465, flight_time_mins: 175, route_type: 'International', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'NCL-RIG', origin_airport: 'NCL', destination_airport: 'RIX', route_name: 'Newcastle-Riga', distance_km: 1587, flight_time_mins: 185, route_type: 'International', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 2, slot_restricted: false },
  { route_id: 'LPL-KRK', origin_airport: 'LPL', destination_airport: 'KRK', route_name: 'Liverpool-Krakow', distance_km: 1450, flight_time_mins: 175, route_type: 'International', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'CDF-OSL', origin_airport: 'CWL', destination_airport: 'OSL', route_name: 'Cardiff-Oslo', distance_km: 1238, flight_time_mins: 155, route_type: 'International', market_size: 'Small', hub_classification: 'Spoke-Hub', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'BOD-TLS', origin_airport: 'BOD', destination_airport: 'TLS', route_name: 'Bordeaux-Toulouse', distance_km: 245, flight_time_mins: 55, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 3, slot_restricted: false },
  { route_id: 'BLQ-CAG', origin_airport: 'BLQ', destination_airport: 'CAG', route_name: 'Bologna-Cagliari', distance_km: 789, flight_time_mins: 105, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 2, slot_restricted: false },
  { route_id: 'NTE-LYS', origin_airport: 'NTE', destination_airport: 'LYS', route_name: 'Nantes-Lyon', distance_km: 356, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 2, slot_restricted: false },
  { route_id: 'HAJ-DUS', origin_airport: 'HAJ', destination_airport: 'DUS', route_name: 'Hannover-Dusseldorf', distance_km: 234, flight_time_mins: 55, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'NUE-STR', origin_airport: 'NUE', destination_airport: 'STR', route_name: 'Nuremberg-Stuttgart', distance_km: 145, flight_time_mins: 45, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'ABZ-INV', origin_airport: 'ABZ', destination_airport: 'INV', route_name: 'Aberdeen-Inverness', distance_km: 166, flight_time_mins: 45, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 2, slot_restricted: false },
  { route_id: 'SOU-EXE', origin_airport: 'SOU', destination_airport: 'EXT', route_name: 'Southampton-Exeter', distance_km: 134, flight_time_mins: 40, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'HUY-CVT', origin_airport: 'HUY', destination_airport: 'CVT', route_name: 'Humberside-Coventry', distance_km: 189, flight_time_mins: 50, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'BHD-CAX', origin_airport: 'BHD', destination_airport: 'CAX', route_name: 'Belfast-Carlisle', distance_km: 198, flight_time_mins: 50, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false },
  { route_id: 'PLY-NWI', origin_airport: 'PLH', destination_airport: 'NWI', route_name: 'Plymouth-Norwich', distance_km: 387, flight_time_mins: 65, route_type: 'Domestic', market_size: 'Small', hub_classification: 'Spoke-Spoke', strategic_importance: 'Low', years_operating: 1, slot_restricted: false }
]

// Generate historical performance data for all routes over 3 years
export function generateRoutePerformanceData(): RoutePerformance[] {
  const data: RoutePerformance[] = []
  const dates = generateDateRange('2022-01-01', '2024-12-31')
  
  routeMasterData.forEach(route => {
    // Determine route characteristics
    const isHighProfit = ['LON-PAR', 'LON-NYC', 'PAR-ROM', 'MAD-BCN', 'FRA-MUC', 'AMS-BCN', 'DUB-LON', 'ZUR-VIE', 'CPH-OSL', 'STO-HEL', 'MIA-NYC', 'LAX-LAS', 'SFO-SEA', 'ORD-DEN', 'ATL-MIA'].includes(route.route_id)
    const isLossRoute = ['BRS-PRG', 'LDS-BUD', 'NCL-RIG', 'LPL-KRK', 'CDF-OSL', 'BOD-TLS', 'BLQ-CAG', 'NTE-LYS', 'HAJ-DUS', 'NUE-STR', 'ABZ-INV', 'SOU-EXE', 'HUY-CVT', 'BHD-CAX', 'PLY-NWI'].includes(route.route_id)
    
    const routeType = route.market_size === 'Large' && (route.route_name.includes('London') || route.route_name.includes('Paris') || route.route_name.includes('New York')) ? 'business' : 'leisure'
    
    // Base metrics
    const baseSeats = route.market_size === 'Large' ? 180 : route.market_size === 'Medium' ? 150 : 120
    const baseLoadFactor = isHighProfit ? 0.78 : isLossRoute ? 0.42 : 0.65
    const baseYield = isHighProfit ? 0.15 : isLossRoute ? 0.08 : 0.12 // revenue per passenger per km
    
    dates.forEach((date, index) => {
      const seasonalMultiplier = getSeasonalMultiplier(date, routeType)
      const dayMultiplier = getDayOfWeekMultiplier(date, routeType)
      
      // Add some random variation and trends
      const randomFactor = 0.8 + Math.random() * 0.4 // 80% to 120%
      const trendFactor = isLossRoute ? Math.max(0.7, 1 - (index / dates.length) * 0.3) : 1 + (index / dates.length) * 0.1 // Loss routes declining
      
      const adjustedLoadFactor = Math.min(0.95, Math.max(0.25, baseLoadFactor * seasonalMultiplier * dayMultiplier * randomFactor * trendFactor))
      const passengers = Math.round(baseSeats * adjustedLoadFactor)
      
      // Revenue calculations
      const baseRevenue = passengers * route.distance_km * baseYield * (1 + Math.random() * 0.2 - 0.1)
      const ancillaryRevenue = baseRevenue * 0.08 // 8% ancillary
      const cargoRevenue = baseRevenue * 0.03 // 3% cargo
      const otherRevenue = baseRevenue * 0.02 // 2% other
      const totalRevenue = baseRevenue + ancillaryRevenue + cargoRevenue + otherRevenue
      
      // Cost calculations based on distance and aircraft type
      const fuelCost = route.distance_km * 0.45 * passengers * 0.7 // Major cost component
      const crewCost = route.flight_time_mins * 15 + passengers * 2
      const airportCost = 2500 + passengers * 8
      const groundHandlingCost = 1200 + passengers * 3
      const maintenanceCost = route.distance_km * 0.12 + passengers * 1.5
      const cateringCost = passengers * 4.5
      const navigationCost = route.distance_km * 0.08
      const insuranceCost = totalRevenue * 0.005
      const aircraftOwnershipCost = route.distance_km * 0.35
      const marketingCost = totalRevenue * 0.03
      const overheadCost = totalRevenue * 0.08
      
      const totalCost = fuelCost + crewCost + airportCost + groundHandlingCost + maintenanceCost + 
                       cateringCost + navigationCost + insuranceCost + aircraftOwnershipCost + 
                       marketingCost + overheadCost
      
      const grossProfit = totalRevenue - (fuelCost + crewCost + cateringCost + groundHandlingCost)
      const operatingProfit = totalRevenue - totalCost + overheadCost
      const netProfit = totalRevenue - totalCost
      const profitMargin = (netProfit / totalRevenue) * 100
      
      // Operational metrics
      const onTimeProb = isHighProfit ? 0.85 : isLossRoute ? 0.72 : 0.79
      const onTime = Math.random() < onTimeProb
      const delayMinutes = onTime ? 0 : Math.random() * 45 + 5
      const cancelled = Math.random() < 0.02 // 2% cancellation rate
      
      const aircraftType = baseSeats >= 180 ? 'A321' : baseSeats >= 150 ? 'A320' : 'A319'
      const blockHours = route.flight_time_mins / 60 + 0.5 // Add turnaround time
      
      data.push({
        date,
        route_id: route.route_id,
        flight_number: `AB${100 + Math.floor(Math.random() * 900)}`,
        seats_available: baseSeats,
        passengers_booked: passengers,
        load_factor: Math.round(adjustedLoadFactor * 100),
        revenue_base_fare: Math.round(baseRevenue),
        revenue_ancillary: Math.round(ancillaryRevenue),
        revenue_cargo: Math.round(cargoRevenue),
        revenue_other: Math.round(otherRevenue),
        revenue_total: Math.round(totalRevenue),
        cost_fuel: Math.round(fuelCost),
        cost_crew: Math.round(crewCost),
        cost_airport: Math.round(airportCost),
        cost_ground_handling: Math.round(groundHandlingCost),
        cost_maintenance: Math.round(maintenanceCost),
        cost_catering: Math.round(cateringCost),
        cost_navigation: Math.round(navigationCost),
        cost_insurance: Math.round(insuranceCost),
        cost_aircraft_ownership: Math.round(aircraftOwnershipCost),
        cost_marketing: Math.round(marketingCost),
        cost_overhead: Math.round(overheadCost),
        cost_total: Math.round(totalCost),
        gross_profit: Math.round(grossProfit),
        operating_profit: Math.round(operatingProfit),
        net_profit: Math.round(netProfit),
        profit_margin: Math.round(profitMargin * 100) / 100,
        on_time_departure: onTime,
        delay_minutes: Math.round(delayMinutes),
        cancelled,
        aircraft_type: aircraftType,
        block_hours: Math.round(blockHours * 100) / 100
      })
    })
  })
  
  return data
}

// Generate route scores based on performance
export function generateRouteScores(): RouteScore[] {
  const performanceData = generateRoutePerformanceData()
  const routeScores: RouteScore[] = []
  
  routeMasterData.forEach(route => {
    const routeData = performanceData.filter(d => d.route_id === route.route_id)
    const recentData = routeData.slice(-90) // Last 90 days
    
    // Calculate metrics
    const avgProfitMargin = recentData.reduce((sum, d) => sum + d.profit_margin, 0) / recentData.length
    const avgLoadFactor = recentData.reduce((sum, d) => sum + d.load_factor, 0) / recentData.length
    const avgOnTime = recentData.reduce((sum, d) => sum + (d.on_time_departure ? 1 : 0), 0) / recentData.length
    const totalProfit = recentData.reduce((sum, d) => sum + d.net_profit, 0)
    
    // Scoring algorithm based on claude.md specification
    const profitabilityScore = (
      Math.min(100, Math.max(0, avgProfitMargin + 20)) * 0.4 +
      Math.min(100, Math.max(0, (totalProfit / 1000000) * 10)) * 0.3 +
      Math.min(100, Math.max(0, avgProfitMargin * 2)) * 0.3
    ) * 0.40
    
    const operationalScore = (
      (avgLoadFactor / 100) * 100 * 0.4 +
      (avgOnTime * 100) * 0.3 +
      85 * 0.3 // Assume good utilization
    ) * 0.25
    
    const strategicScore = (
      (route.strategic_importance === 'High' ? 100 : route.strategic_importance === 'Medium' ? 70 : 40) * 0.4 +
      (route.market_size === 'Large' ? 100 : route.market_size === 'Medium' ? 70 : 40) * 0.3 +
      Math.min(100, Math.max(0, 50 + Math.random() * 30)) * 0.3 // Simulated growth rate
    ) * 0.20
    
    const riskScore = (
      (100 - Math.min(100, Math.random() * 40)) * 0.35 + // Demand volatility
      (100 - Math.min(100, Math.random() * 50)) * 0.35 + // Competition intensity
      (100 - Math.min(100, Math.random() * 30)) * 0.30   // Seasonality impact
    ) * 0.15
    
    const totalScore = profitabilityScore + operationalScore + strategicScore + riskScore
    
    // Classification
    let classification: 'Stars' | 'Cash Cows' | 'Question Marks' | 'Dogs'
    if (totalScore >= 80) classification = 'Stars'
    else if (totalScore >= 65) classification = 'Cash Cows'
    else if (totalScore >= 45) classification = 'Question Marks'
    else classification = 'Dogs'
    
    // Trend
    const trend = avgProfitMargin > 5 ? 'up' : avgProfitMargin < -5 ? 'down' : 'stable'
    
    routeScores.push({
      route_id: route.route_id,
      profitability_score: Math.round(profitabilityScore),
      operational_score: Math.round(operationalScore),
      strategic_score: Math.round(strategicScore),
      risk_score: Math.round(riskScore),
      total_score: Math.round(totalScore),
      classification,
      trend
    })
  })
  
  return routeScores.sort((a, b) => b.total_score - a.total_score)
}

// Generate recommendations
export function generateRecommendations(): Recommendation[] {
  const scores = generateRouteScores()
  const recommendations: Recommendation[] = []
  
  scores.forEach((score, index) => {
    const route = routeMasterData.find(r => r.route_id === score.route_id)!
    
    if (score.classification === 'Dogs') {
      recommendations.push({
        id: `rec_${index}_1`,
        route_id: score.route_id,
        type: 'strategic_decisions',
        category: 'route_exits',
        title: `Consider discontinuing ${route.route_name}`,
        description: `Route consistently underperforming with score ${score.total_score}/100. Low load factors and negative margins.`,
        impact: 'High',
        effort: 'Medium',
        timeline: 'Short-term',
        confidence: 'High',
        potential_savings: 2400000,
        urgency: 'high'
      })
    } else if (score.classification === 'Question Marks') {
      recommendations.push({
        id: `rec_${index}_2`,
        route_id: score.route_id,
        type: 'tactical_improvements',
        category: 'schedule_optimization',
        title: `Optimize schedule for ${route.route_name}`,
        description: `Route shows potential but needs better timing. Consider adjusting departure times or frequency.`,
        impact: 'Medium',
        effort: 'Easy',
        timeline: 'Immediate',
        confidence: 'Medium',
        potential_savings: 800000,
        urgency: 'medium'
      })
    } else if (score.classification === 'Stars') {
      recommendations.push({
        id: `rec_${index}_3`,
        route_id: score.route_id,
        type: 'tactical_improvements',
        category: 'pricing_opportunities',
        title: `Increase capacity on ${route.route_name}`,
        description: `High-performing route with potential for growth. Consider increasing frequency or larger aircraft.`,
        impact: 'High',
        effort: 'Medium',
        timeline: 'Short-term',
        confidence: 'High',
        potential_savings: -1500000, // Investment for growth
        urgency: 'medium'
      })
    }
  })
  
  return recommendations.slice(0, 20) // Return top 20 recommendations
}

// Generate alerts
export function generateAlerts(): Alert[] {
  const scores = generateRouteScores()
  const alerts: Alert[] = []
  
  scores.forEach((score, index) => {
    const route = routeMasterData.find(r => r.route_id === score.route_id)!
    
    if (score.trend === 'down' && score.total_score < 50) {
      alerts.push({
        id: `alert_${index}_1`,
        route_id: score.route_id,
        type: 'performance_degradation',
        title: `Performance declining on ${route.route_name}`,
        description: `Route has shown 3 consecutive weeks of declining profitability`,
        impact_assessment: 'Potential $200K monthly loss if trend continues',
        recommended_action: 'Investigate pricing strategy and competitor analysis',
        urgency: 'high',
        created_date: '2024-12-15'
      })
    }
    
    if (Math.random() < 0.1) { // 10% chance of competitive threat
      alerts.push({
        id: `alert_${index}_2`,
        route_id: score.route_id,
        type: 'competitive_threats',
        title: `New competitor on ${route.route_name}`,
        description: `Budget airline announced new service starting next month`,
        impact_assessment: 'Estimated 15-20% passenger loss without response',
        recommended_action: 'Consider price adjustment or schedule optimization',
        urgency: 'medium',
        created_date: '2024-12-14'
      })
    }
  })
  
  return alerts.slice(0, 10) // Return top 10 alerts
}

export const routeProfitabilityData = {
  routeMaster: routeMasterData,
  generatePerformanceData: generateRoutePerformanceData,
  generateRouteScores,
  generateRecommendations,
  generateAlerts
}