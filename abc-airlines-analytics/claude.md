# Route Profitability Analysis - Complete Implementation Specification

## Project Overview
Build a comprehensive Route Profitability Analysis system for ABC PLC Budget Airlines to identify and optimize underperforming routes, maximize revenue, and improve network efficiency. This system should analyze 50 routes with 3 years of historical data and provide predictive insights for future performance.

## Business Context
- **Problem**: 20% of routes operating at a loss (unidentified), $15M annual revenue leakage
- **Goal**: Achieve 8-12% revenue growth and 10-15% cost reduction through data-driven route optimization
- **Impact**: Transform route decisions from days to minutes with 85% prediction accuracy

## Core Features to Implement

### 1. Historical Profitability Analysis

#### 1.1 Multi-Period Analysis
Create a comprehensive time-based analysis system that allows users to:

**Time Dimensions**:
- Daily analysis (identify day-of-week patterns)
- Weekly analysis (week-over-week trends)
- Monthly analysis (seasonal patterns)
- Quarterly analysis (business cycle trends)
- Yearly analysis (long-term trajectory)

**Comparison Modes**:
- Period-over-period (this month vs last month)
- Year-over-year (October 2024 vs October 2023)
- Moving averages (7-day, 30-day, 90-day)
- Actual vs budget/forecast
- Custom date range comparisons

**Implementation Requirements**:
- Date range picker with preset options (Last 7 days, Last month, Last quarter, YTD, Custom)
- Toggle between absolute values and percentage changes
- Ability to export data for selected periods
- Drill-down from yearly → quarterly → monthly → daily views

#### 1.2 Revenue Analysis
Build detailed revenue breakdown showing:

**Revenue Components**:
- Base ticket revenue (fare excluding taxes)
- Ancillary revenue (baggage, seats, meals)
- Cargo revenue (freight and mail)
- Other revenue (change fees, cancellations)
- Total revenue per route

**Revenue Metrics**:
- Revenue per Available Seat Kilometer (RASK)
- Revenue per passenger (yield)
- Average fare trends
- Ancillary attachment rate
- Load factor impact on revenue

**Visualization**: Stacked area chart showing revenue composition over time

#### 1.3 Cost Analysis
Implement comprehensive cost tracking:

**Cost Categories**:
```
Variable Costs (change with passengers/flights):
- Fuel costs (30-40% of total)
- Crew costs (15-20% of total)
- Catering costs (2-3% per passenger)
- Ground handling (per flight)
- Passenger services

Fixed Costs (independent of load):
- Aircraft lease/ownership
- Insurance
- Maintenance reserves
- Slot costs

Allocated Costs:
- Marketing spend
- Overhead allocation
- Distribution costs
```

**Cost Metrics**:
- Cost per Available Seat Kilometer (CASK)
- Cost per passenger
- Fuel efficiency metrics
- Crew productivity
- Airport cost comparisons

**Visualization**: Waterfall chart from revenue to profit showing each cost component

#### 1.4 Profit Analysis
Calculate and display comprehensive profitability:

**Profit Metrics**:
- Gross profit (Revenue - Direct costs)
- Operating profit (EBIT)
- Net profit margin
- Contribution margin ((Revenue - Variable costs) / Revenue)
- Breakeven load factor

**Profit Trends**:
- Month-over-month profit changes
- Profit bridge analysis (what drove changes)
- Margin trend analysis
- Profitability by day of week
- Seasonal profit patterns

### 2. Route Ranking System

#### 2.1 Performance Scoring Algorithm
Create multi-criteria scoring system:

```python
scoring_weights = {
    'profitability': {
        'weight': 0.40,
        'metrics': {
            'absolute_profit': 0.30,
            'profit_margin': 0.40,
            'roi': 0.30
        }
    },
    'operational_efficiency': {
        'weight': 0.25,
        'metrics': {
            'load_factor': 0.40,
            'on_time_performance': 0.30,
            'aircraft_utilization': 0.30
        }
    },
    'strategic_value': {
        'weight': 0.20,
        'metrics': {
            'network_contribution': 0.40,
            'market_share': 0.30,
            'growth_rate': 0.30
        }
    },
    'risk_assessment': {
        'weight': 0.15,
        'metrics': {
            'demand_volatility': 0.35,
            'competition_intensity': 0.35,
            'seasonality_impact': 0.30
        }
    }
}
```

#### 2.2 Route Classification
Categorize routes into performance tiers:

**Categories**:
- **Stars** (Top 20%): High profit, high growth
- **Cash Cows** (Next 30%): Stable, profitable
- **Question Marks** (Next 30%): Potential but underperforming
- **Dogs** (Bottom 20%): Consistent loss-makers

**Visual Output**: 
- Ranked list with color coding
- BCG matrix plot (Growth vs Market Share)
- Performance badges/icons

#### 2.3 Predictive Ranking
Implement forward-looking analysis:

**Prediction Components**:
- Historical trend extrapolation
- Seasonal adjustment factors
- Event calendar integration
- Competition monitoring
- Economic indicators

**Output Format**:
- Next 3 months predicted performance
- Confidence intervals
- Risk flags for likely underperformers
- Opportunity alerts for potential winners

### 3. Advanced Analytics Features

#### 3.1 What-If Scenario Analysis
Build interactive scenario modeling:

**Adjustable Parameters**:
```javascript
scenarios = {
    capacity: {
        frequency: "Flights per week slider (1-28)",
        aircraft_size: "Dropdown (A319/A320/A321)",
        seasonal_adjustment: "Summer/Winter capacity"
    },
    pricing: {
        base_fare: "±50% adjustment slider",
        ancillary_pricing: "Bundle pricing options",
        competitive_response: "Match/Undercut/Premium"
    },
    schedule: {
        departure_time: "Time picker",
        day_of_week: "Checkboxes for operating days",
        seasonal_schedule: "Different summer/winter"
    },
    costs: {
        fuel_price: "±30% adjustment",
        crew_costs: "Overtime scenarios",
        airport_fees: "Alternative airports"
    }
}
```

**Real-time Calculations**:
- Instant profit impact display
- Side-by-side comparison with current state
- Sensitivity analysis graphs
- ROI calculation for changes

#### 3.2 Competitor Intelligence
Monitor and analyze competition:

**Tracking Metrics**:
- Competitor capacity on route
- Price comparison (indexed)
- Schedule overlap analysis
- Market share trends
- New entrant alerts

**Competitive Response Matrix**:
- If competitor drops price by X%, impact = Y
- Recommended response strategies
- Historical response effectiveness

#### 3.3 Demand Forecasting
Implement predictive models:

**Forecasting Methods**:
- Time series analysis (ARIMA/SARIMA)
- Machine learning (XGBoost/Random Forest)
- Seasonal decomposition
- Event impact modeling

**Input Factors**:
```python
demand_drivers = {
    'internal': ['price', 'schedule', 'capacity', 'marketing'],
    'external': ['seasonality', 'events', 'holidays', 'economy'],
    'competition': ['competitor_capacity', 'competitor_price'],
    'special_events': ['sports', 'festivals', 'conferences']
}
```

**Output**:
- 90-day passenger forecast
- Booking curve predictions
- Revenue projections
- Load factor estimates

### 4. Decision Support System

#### 4.1 Automated Recommendations
Generate actionable insights:

**Recommendation Types**:
```python
recommendations = {
    'immediate_actions': {
        'stop_bleeding': 'Routes losing money daily',
        'quick_wins': 'Easy pricing/schedule fixes',
        'capacity_right_sizing': 'Aircraft swap opportunities'
    },
    'tactical_improvements': {
        'schedule_optimization': 'Better departure times',
        'pricing_opportunities': 'Fare adjustment potential',
        'ancillary_focus': 'Routes for ancillary push'
    },
    'strategic_decisions': {
        'route_exits': 'Routes to discontinue',
        'frequency_changes': 'Add/reduce flights',
        'market_development': 'Growth opportunities'
    }
}
```

**Priority Scoring**:
- Impact (High/Medium/Low)
- Effort (Easy/Medium/Hard)
- Timeline (Immediate/Short-term/Long-term)
- Confidence (High/Medium/Low)

#### 4.2 Alert System
Proactive monitoring and alerts:

**Alert Categories**:
- Performance degradation (3 consecutive weeks decline)
- Competitive threats (new entrant, price war)
- Opportunity windows (competitor exit, event)
- Operational issues (low OTP, high cancellations)

**Alert Format**:
- Route affected
- Issue description
- Impact assessment
- Recommended action
- Urgency level

### 5. Data Structure and Schema

#### 5.1 Core Data Tables

**FACT_ROUTE_PERFORMANCE** (Daily granularity):
```sql
CREATE TABLE fact_route_performance (
    date DATE,
    route_id VARCHAR(20),
    flight_number VARCHAR(10),
    
    -- Capacity and Load
    seats_available INT,
    passengers_booked INT,
    load_factor DECIMAL(5,2),
    
    -- Revenue Components
    revenue_base_fare DECIMAL(10,2),
    revenue_ancillary DECIMAL(10,2),
    revenue_cargo DECIMAL(10,2),
    revenue_other DECIMAL(10,2),
    revenue_total DECIMAL(10,2),
    
    -- Cost Components
    cost_fuel DECIMAL(10,2),
    cost_crew DECIMAL(10,2),
    cost_airport DECIMAL(10,2),
    cost_ground_handling DECIMAL(10,2),
    cost_maintenance DECIMAL(10,2),
    cost_catering DECIMAL(10,2),
    cost_navigation DECIMAL(10,2),
    cost_insurance DECIMAL(10,2),
    cost_aircraft_ownership DECIMAL(10,2),
    cost_marketing DECIMAL(10,2),
    cost_overhead DECIMAL(10,2),
    cost_total DECIMAL(10,2),
    
    -- Profitability
    gross_profit DECIMAL(10,2),
    operating_profit DECIMAL(10,2),
    net_profit DECIMAL(10,2),
    profit_margin DECIMAL(5,2),
    
    -- Operational Metrics
    on_time_departure BOOLEAN,
    delay_minutes INT,
    cancelled BOOLEAN,
    aircraft_type VARCHAR(10),
    block_hours DECIMAL(5,2)
);
```

**DIM_ROUTE_MASTER**:
```sql
CREATE TABLE dim_route_master (
    route_id VARCHAR(20) PRIMARY KEY,
    origin_airport VARCHAR(3),
    destination_airport VARCHAR(3),
    route_name VARCHAR(100),
    distance_km INT,
    flight_time_mins INT,
    route_type VARCHAR(20), -- Domestic/International/Regional
    market_size VARCHAR(10), -- Large/Medium/Small
    hub_classification VARCHAR(20), -- Hub-Hub/Hub-Spoke/Spoke-Spoke
    strategic_importance VARCHAR(10), -- High/Medium/Low
    years_operating INT,
    slot_restricted BOOLEAN
);
```

**DIM_COMPETITION**:
```sql
CREATE TABLE dim_competition (
    date DATE,
    route_id VARCHAR(20),
    num_competitors INT,
    our_capacity INT,
    total_market_capacity INT,
    market_share DECIMAL(5,2),
    our_avg_fare DECIMAL(10,2),
    competitor_min_fare DECIMAL(10,2),
    competitor_avg_fare DECIMAL(10,2),
    price_index DECIMAL(5,2), -- Our price / Competitor avg
    new_entrant_flag BOOLEAN
);
```

**FACT_ROUTE_FORECAST**:
```sql
CREATE TABLE fact_route_forecast (
    forecast_date DATE,
    route_id VARCHAR(20),
    target_date DATE,
    
    -- Demand Forecast
    predicted_passengers INT,
    passenger_lower_bound INT,
    passenger_upper_bound INT,
    
    -- Revenue Forecast
    predicted_revenue DECIMAL(10,2),
    revenue_lower_bound DECIMAL(10,2),
    revenue_upper_bound DECIMAL(10,2),
    
    -- Performance Indicators
    predicted_load_factor DECIMAL(5,2),
    profit_probability DECIMAL(5,2),
    risk_score DECIMAL(5,2),
    confidence_level DECIMAL(5,2)
);
```

#### 5.2 Sample Data Generation
Create realistic dummy data:

**Route Examples**:
```python
routes = {
    'high_profit': [
        'LON-PAR', 'LON-NYC', 'PAR-ROM', 'MAD-BCN', 'FRA-MUC'
    ],  # 70%+ load factor, high yields
    
    'moderate_profit': [
        'MAN-DUB', 'EDI-AMS', 'BER-WAW', 'MIL-NAP', 'LIS-MAD'
    ],  # 50-70% load factor, average yields
    
    'loss_making': [
        'BRS-PRG', 'LDS-BUD', 'NCL-RIG', 'LPL-KRK', 'CDF-OSL'
    ],  # <50% load factor, low yields
}

seasonality_patterns = {
    'business_routes': {
        'summer': 0.9,
        'winter': 1.1,
        'monday-thursday': 1.3,
        'friday-sunday': 0.7
    },
    'leisure_routes': {
        'summer': 1.4,
        'winter': 0.6,
        'monday-thursday': 0.8,
        'friday-sunday': 1.2
    }
}
```

### 6. Visualization Requirements

#### 6.1 Dashboard Layout
Create hierarchical dashboard structure:

**Main Dashboard**:
- KPI cards (Total routes, Profitable %, Avg margin, Total profit)
- Route performance table (sortable, filterable)
- Profit trend chart (time series)
- Route map (geographic visualization)

**Route Deep-Dive View**:
- Route header (key metrics at a glance)
- Revenue/Cost/Profit tabs
- Historical trends (multi-line chart)
- Competitor comparison
- Forecast vs actual
- Recommendations panel

#### 6.2 Chart Specifications

**Time Series Charts**:
- Line charts for trends (revenue, costs, profit)
- Area charts for composition over time
- Dual-axis for different scales
- Annotations for events/changes
- Forecast overlay with confidence bands

**Comparison Charts**:
- Horizontal bar charts for route ranking
- Grouped bars for period comparisons
- Scatter plots for profit vs load factor
- Bubble charts for 3D analysis (size = revenue)

**Composition Charts**:
- Pie/donut for cost breakdown
- Treemap for route portfolio
- Sankey diagram for passenger flow
- Stacked bars for revenue composition

**Performance Charts**:
- Gauge charts for KPIs (load factor, margin)
- Bullet charts for actual vs target
- Heat maps for route-by-month performance
- Box plots for distribution analysis

#### 6.3 Interactive Features
Implement user interactions:

**Filtering Controls**:
- Date range picker
- Route multi-select
- Aircraft type filter
- Profitability threshold slider
- Market type selector

**Drill-down Capabilities**:
- Click route for details
- Hover for tooltips
- Zoom on time series
- Pan on geographic map

**Export Options**:
- Download as PDF report
- Export data to CSV
- Save chart as image
- Email scheduled reports

### 7. User Interface Components

#### 7.1 Navigation Structure
```
Main Navigation:
├── Dashboard (Overview)
├── Profitability Analysis
│   ├── Historical Analysis
│   ├── Revenue Breakdown
│   ├── Cost Analysis
│   └── Margin Trends
├── Route Ranking
│   ├── Performance Scores
│   ├── Classification
│   └── Predictions
├── Scenario Planning
│   ├── What-If Analysis
│   ├── Sensitivity Testing
│   └── Optimization
├── Insights & Alerts
│   ├── Recommendations
│   ├── Alerts
│   └── Opportunities
└── Reports
    ├── Executive Summary
    ├── Route Reports
    └── Custom Reports
```

#### 7.2 Key UI Components

**KPI Card Component**:
```javascript
KPICard = {
    title: "Total Profit",
    value: "$27.5M",
    change: "+12.3%",
    trend: "up",
    sparkline: [/* last 7 days */],
    period: "YTD",
    target: "$25M",
    achievement: "110%"
}
```

**Route Performance Table**:
```javascript
RouteTable = {
    columns: [
        'Route',
        'Flights',
        'Load Factor',
        'Revenue',
        'Costs',
        'Profit',
        'Margin %',
        'Trend',
        'Score',
        'Actions'
    ],
    features: [
        'Sortable columns',
        'Inline sparklines',
        'Conditional formatting',
        'Quick actions menu',
        'Expandable rows'
    ]
}
```

**Scenario Simulator**:
```javascript
ScenarioPanel = {
    controls: {
        frequency: 'Slider (1-28 flights/week)',
        pricing: 'Input with ± buttons',
        aircraft: 'Dropdown selector',
        schedule: 'Time picker grid'
    },
    output: {
        current_state: 'Baseline metrics',
        new_state: 'Projected metrics',
        delta: 'Change indicators',
        roi: 'Return calculation'
    },
    actions: [
        'Save scenario',
        'Compare scenarios',
        'Apply changes',
        'Reset'
    ]
}
```

### 8. Technical Implementation

#### 8.1 Technology Stack
```javascript
frontend = {
    framework: 'Next.js 14',
    ui_library: 'React',
    styling: 'Tailwind CSS',
    charts: 'Recharts / D3.js',
    state: 'Zustand / Context API',
    tables: 'TanStack Table',
    forms: 'React Hook Form',
    dates: 'date-fns'
}

backend = {
    api: 'Next.js API Routes',
    database: 'PostgreSQL / SQLite (for POC)',
    orm: 'Prisma',
    caching: 'React Query'
}
```

#### 8.2 Performance Requirements
- Page load time: < 2 seconds
- Data refresh: < 1 second
- Chart rendering: < 500ms
- Export generation: < 5 seconds
- Concurrent users: 50+

#### 8.3 Responsive Design
- Desktop: Full dashboard (1920x1080)
- Laptop: Adapted layout (1366x768)
- Tablet: Simplified view (768x1024)
- Mobile: Key metrics only (375x667)

### 9. Demo Scenarios

#### 9.1 Scenario: "Finding Hidden Losses"
**Setup**: Executive opens dashboard
**Flow**:
1. Show total routes: 50 (seemingly healthy)
2. Click "Profitability View"
3. Reveal: 10 routes (20%) are losing money
4. Drill into worst performer: BRS-PRG
5. Show: -$200K monthly loss
6. Display recommendation: "Reduce frequency or exit"
7. Run scenario: Reducing to 3x weekly
8. Result: Loss reduced to -$50K
9. Alternative: Exit route, redeploy to profitable route
10. Impact: $2.4M annual saving

#### 9.2 Scenario: "Seasonal Optimization"
**Setup**: Planning for winter schedule
**Flow**:
1. Select "Seasonal Analysis"
2. Compare Summer vs Winter performance
3. Identify: 5 leisure routes with 60% winter drop
4. Run optimization algorithm
5. Recommendation: Reduce 15 flights/week in winter
6. Redeploy capacity to business routes
7. Impact: $3M improved winter profitability

#### 9.3 Scenario: "Competition Response"
**Setup**: Alert appears on dashboard
**Flow**:
1. Alert: "Competitor dropped LON-BCN price by 30%"
2. Click for analysis
3. Show current: 75% load, $150 average fare
4. Predict impact: Load drops to 60% if no response
5. Run scenarios:
   - Match price: 85% load, -15% revenue
   - Partial match (-15%): 70% load, -8% revenue
   - No change: 60% load, -20% revenue
6. Recommendation: Partial match + ancillary push
7. Implement and monitor

#### 9.4 Scenario: "Future Performance"
**Setup**: Quarterly planning meeting
**Flow**:
1. Select "Q2 2024 Forecast"
2. System predicts performance for all routes
3. Flags: 3 routes likely to underperform
4. Drill into each:
   - Route 1: Easter holiday impact
   - Route 2: New competitor entering
   - Route 3: Aircraft maintenance reducing capacity
5. Preventive actions suggested
6. If implemented: Prevent $1.5M losses

### 10. Success Metrics

#### 10.1 Business Metrics
- Identify 100% of loss-making routes
- Find $15M+ revenue opportunities
- Reduce analysis time from days to minutes
- Achieve 85% forecast accuracy
- Generate 50+ actionable recommendations

#### 10.2 User Engagement
- Daily active users: 20+
- Average session time: 15 minutes
- Features used per session: 5+
- Scenarios run per week: 50+
- Reports generated: 10+ daily

#### 10.3 Technical Metrics
- System uptime: 99.9%
- Data freshness: < 1 hour
- Query response time: < 2 seconds
- Concurrent users supported: 50+

### 11. Implementation Timeline

#### Week 1: Foundation
- Set up development environment
- Create database schema
- Generate dummy data (3 years, 50 routes)
- Build basic API endpoints
- Create dashboard layout

#### Week 2: Core Features
- Implement profitability analysis
- Build route ranking system
- Create time period selection
- Add basic visualizations
- Develop drill-down views

#### Week 3: Advanced Features
- Add scenario analysis
- Implement forecasting
- Build recommendation engine
- Create alert system
- Add competitive analysis

#### Week 4: Polish & Demo
- Optimize performance
- Add animations/transitions
- Prepare demo scenarios
- Create presentation deck
- Conduct user testing

### 12. Dummy Data Specifications

#### 12.1 Data Volume
- Routes: 50 total
- History: 3 years (2022-2024)
- Flights: ~150 daily
- Total records: ~160,000
- Forecast period: 90 days

#### 12.2 Data Patterns
```python
data_patterns = {
    'profitable_routes': '60% of routes',
    'marginal_routes': '20% of routes',
    'loss_making_routes': '20% of routes',
    
    'load_factors': {
        'range': '45% - 95%',
        'average': '75%',
        'business_routes': '65-75%',
        'leisure_routes': '75-85%'
    },
    
    'seasonality': {
        'summer_peak': '+30% demand',
        'winter_low': '-25% demand',
        'shoulder': 'baseline'
    },
    
    'weekly_patterns': {
        'monday': 1.1,
        'tuesday': 0.9,
        'wednesday': 0.9,
        'thursday': 1.1,
        'friday': 1.3,
        'saturday': 0.7,
        'sunday': 1.0
    }
}
```

### 13. Key Calculations

#### 13.1 Profitability Metrics
```python
# Revenue per Available Seat Kilometer
RASK = total_revenue / (seats_available * distance_km)

# Cost per Available Seat Kilometer
CASK = total_costs / (seats_available * distance_km)

# Yield (Revenue per Passenger per Kilometer)
yield = total_revenue / (passengers * distance_km)

# Load Factor
load_factor = passengers / seats_available

# Break-even Load Factor
breakeven_load_factor = fixed_costs / (average_fare - variable_cost_per_passenger)

# Contribution Margin
contribution_margin = (revenue - variable_costs) / revenue

# Operating Margin
operating_margin = operating_profit / revenue

# Return on Investment
roi = (profit / total_costs) * 100
```

#### 13.2 Scoring Algorithm
```python
def calculate_route_score(route_data):
    # Profitability Score (40% weight)
    profit_score = (
        normalized(route_data['profit_margin']) * 0.4 +
        normalized(route_data['absolute_profit']) * 0.3 +
        normalized(route_data['roi']) * 0.3
    ) * 0.40
    
    # Operational Score (25% weight)
    operational_score = (
        normalized(route_data['load_factor']) * 0.4 +
        normalized(route_data['on_time_performance']) * 0.3 +
        normalized(route_data['utilization']) * 0.3
    ) * 0.25
    
    # Strategic Score (20% weight)
    strategic_score = (
        normalized(route_data['network_contribution']) * 0.4 +
        normalized(route_data['market_share']) * 0.3 +
        normalized(route_data['growth_rate']) * 0.3
    ) * 0.20
    
    # Risk Score (15% weight) - inverted
    risk_score = (
        (1 - normalized(route_data['demand_volatility'])) * 0.35 +
        (1 - normalized(route_data['competition_intensity'])) * 0.35 +
        (1 - normalized(route_data['seasonality_impact'])) * 0.30
    ) * 0.15
    
    total_score = profit_score + operational_score + strategic_score + risk_score
    return total_score * 100  # Convert to 0-100 scale
```

### 14. Error Handling & Edge Cases

#### 14.1 Data Quality Issues
- Missing data: Use interpolation or last known value
- Outliers: Flag and option to exclude
- Negative values: Validate and alert
- Zero passengers: Handle division by zero

#### 14.2 User Input Validation
- Date ranges: Ensure start < end
- Scenario inputs: Set min/max bounds
- Route selection: Validate route exists
- Numeric inputs: Prevent non-numeric entry

### 15. Testing Requirements

#### 15.1 Unit Tests
- Calculation accuracy
- Data transformations
- API endpoints
- Component rendering

#### 15.2 Integration Tests
- End-to-end workflows
- Data pipeline
- Export functionality
- Real-time updates

#### 15.3 User Acceptance Tests
- Scenario walkthroughs
- Performance benchmarks
- Responsive design
- Browser compatibility

## Final Implementation Notes

This system should clearly demonstrate to ABC PLC executives how data-driven decisions can transform their route network profitability. Focus on making the complex simple, showing clear ROI, and enabling fast decision-making.

Remember: The goal is to turn route analysis from a multi-day Excel exercise into a minutes-long interactive exploration that yields actionable insights.