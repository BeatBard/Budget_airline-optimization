export const dummyData = {
  // Key metrics for dashboard
  keyMetrics: {
    totalSavingsOpportunity: 40000000,
    currentDailyCost: 110000,
    complianceRiskScore: 85,
    customerSatisfactionTrend: -15,
    crewUtilization: 65,
    targetUtilization: 85,
    overtimeCosts: 8000000,
    routeLosses: 15000000,
    ancillaryGap: 20000000,
  },

  // Crew scheduling data
  crewScheduling: {
    monthlyOvertimeCosts: [
      { month: 'Jan', cost: 650000 },
      { month: 'Feb', cost: 720000 },
      { month: 'Mar', cost: 680000 },
      { month: 'Apr', cost: 750000 },
      { month: 'May', cost: 890000 },
      { month: 'Jun', cost: 820000 },
    ],
    complianceViolations: [
      { type: 'Flight Time', count: 8, severity: 'high' },
      { type: 'Rest Period', count: 12, severity: 'medium' },
      { type: 'Duty Time', count: 6, severity: 'high' },
      { type: 'Training', count: 4, severity: 'low' },
    ],
    costBreakdown: {
      regularHours: 60,
      overtime: 25,
      idleTime: 15,
    },
    optimizationResults: {
      planningSavings: '2 weeks → 2 hours',
      violationReduction: '15 → 0 per quarter',
      overtimeReduction: '-40%',
      satisfactionIncrease: '+25 points',
    },
  },

  // Route profitability data
  routeProfitability: {
    routes: [
      { name: 'London-Paris', revenue: 2500000, profit: 450000, status: 'profitable', loadFactor: 78 },
      { name: 'NYC-Miami', revenue: 3200000, profit: 680000, status: 'profitable', loadFactor: 82 },
      { name: 'Madrid-Rome', revenue: 1800000, profit: -120000, status: 'loss', loadFactor: 45 },
      { name: 'Berlin-Vienna', revenue: 1400000, profit: 280000, status: 'profitable', loadFactor: 71 },
      { name: 'Dublin-Prague', revenue: 980000, profit: -80000, status: 'loss', loadFactor: 38 },
    ],
    pricingOptimization: {
      currentRevenue: 125000000,
      optimizedRevenue: 140000000,
      upliftPotential: 12,
    },
  },

  // Ancillary revenue data
  ancillaryRevenue: {
    currentMetrics: {
      attachmentRate: 8,
      revenuePerPassenger: 12,
      industryBenchmark: 45,
      conversionRate: 2,
    },
    segments: [
      { name: 'Business Travelers', size: 25, value: 180, conversion: 35 },
      { name: 'Leisure Families', size: 45, value: 85, conversion: 15 },
      { name: 'Frequent Flyers', size: 15, value: 220, conversion: 42 },
      { name: 'Budget Seekers', size: 15, value: 25, conversion: 5 },
    ],
    products: [
      { name: 'Seat Selection', attachment: 15, revenue: 8 },
      { name: 'Extra Baggage', attachment: 12, revenue: 25 },
      { name: 'Priority Boarding', attachment: 8, revenue: 12 },
      { name: 'Meal Upgrades', attachment: 5, revenue: 18 },
      { name: 'Travel Insurance', attachment: 3, revenue: 35 },
    ],
  },

  // GenAI productivity data
  genAiProductivity: [
    { task: 'SQL Query Writing', traditional: 30, withGenAI: 5, timeSaved: 83 },
    { task: 'Report Generation', traditional: 120, withGenAI: 30, timeSaved: 75 },
    { task: 'Data Analysis', traditional: 300, withGenAI: 60, timeSaved: 80 },
    { task: 'Documentation', traditional: 240, withGenAI: 60, timeSaved: 75 },
    { task: 'Test Case Creation', traditional: 180, withGenAI: 30, timeSaved: 83 },
  ],

  // Implementation roadmap
  roadmap: [
    {
      phase: 'Quick Wins',
      duration: 'Months 1-3',
      features: ['Basic crew scheduling optimizer', 'Route profitability dashboard', 'Customer segmentation'],
      expectedValue: 5000000,
    },
    {
      phase: 'Core Features',
      duration: 'Months 4-6', 
      features: ['Advanced optimization algorithms', 'Dynamic pricing engine', 'Personalization MVP'],
      expectedValue: 12000000,
    },
    {
      phase: 'Advanced Analytics',
      duration: 'Months 7-9',
      features: ['Predictive models', 'Real-time optimization', 'Full personalization'],
      expectedValue: 20000000,
    },
    {
      phase: 'Scale',
      duration: 'Months 10-12',
      features: ['Enterprise deployment', 'Integration with all systems', 'Continuous optimization'],
      expectedValue: 40000000,
    },
  ],

  // Decision queue for dashboard
  decisionQueue: [
    {
      id: 1,
      title: 'Approve overtime for London base?',
      cost: 12000,
      alternative: 'Alternative: $45K delay cost',
      urgency: 'high',
      type: 'crew',
    },
    {
      id: 2,
      title: 'Add Tuesday flight to Madrid?',
      cost: 0,
      alternative: 'Revenue opportunity: $2M/year',
      urgency: 'medium',
      type: 'route',
    },
    {
      id: 3,
      title: 'Match competitor price drop?',
      cost: 500000,
      alternative: 'Impact: -$500K if no action',
      urgency: 'high',
      type: 'pricing',
    },
  ],
};