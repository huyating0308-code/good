export enum RiskLevel {
  LOW = 'Conservative',
  MEDIUM = 'Moderate',
  HIGH = 'Aggressive'
}

export enum InvestmentHorizon {
  SHORT = 'Short Term (< 1 year)',
  MEDIUM = 'Medium Term (1-5 years)',
  LONG = 'Long Term (5+ years)'
}

export enum InvestmentStrategy {
  GROWTH = 'Momentum Growth',
  VALUE = 'Deep Value & Turnaround (5x Potential)',
  INCOME = 'Dividend & Stability'
}

export interface UserPreferences {
  riskLevel: RiskLevel;
  horizon: InvestmentHorizon;
  strategy: InvestmentStrategy;
  sectors: string[];
  capital: number;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  price: string;
  changePercent?: string;
  rationale: string;
  riskRating: 'Low' | 'Medium' | 'High';
  potentialUpside: string;
  sector: string;
}

export interface AgentResponse {
  recommendations: StockRecommendation[];
  marketSentiment: string;
  sources: { title: string; uri: string }[];
}

export type AppState = 'onboarding' | 'analyzing' | 'results';