/* =========================
   Career Response Types
   ========================= */

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
  period: string;
}

export interface JobOption {
  title: string;
  industryDemand: string;
  estimatedSalaryRange?: SalaryRange;
  responsibilities: string[];
  whyGoodFit: string;
  growthPotential: string;
}

export interface ProfileAssessment {
  experienceLevelDetected: string;
  marketPositioning: string;
  confidenceScore: number;
}

export interface SkillGapAnalysis {
  strongSkills: string[];
  missingCriticalSkills: string[];
  improvementPriorityOrder: string[];
}

export interface LearningRoadmap {
  "3MonthPlan": string[];
  "6MonthPlan": string[];
  "12MonthPlan": string[];
}

export interface SkillToLearn {
  title: string;
  whyImportant: string;
  howToLearn: string;
}

export interface SkillCategory {
  category: string;
  skills: SkillToLearn[];
}

export interface MarketIntelligence {
  topHiringCompanies: string[];
  averageInterviewRounds: number;
  keyInterviewTopics: string[];
}

export interface Certification {
  name: string;
  priority: string;
  estimatedTime: string;
  costEstimate: string;
}

export interface SalaryNegotiation {
  expectedRange: string;
  negotiationLeverage: string;
  marketComparables: string;
}

export interface LearningStrategy {
  approachTitle: string;
  principles: string[];
}

export interface CareerGuideResponse {
  summary: string;
  profileAssessment: ProfileAssessment;
  jobOptions: JobOption[];
  skillGapAnalysis: SkillGapAnalysis;
  learningRoadmap: LearningRoadmap;
  skillsToLearn: SkillCategory[];
  marketIntelligence: MarketIntelligence;
  certifications: Certification[];
  salaryNegotiation: SalaryNegotiation;
  learningStrategy: LearningStrategy;
  riskFactors: string[];
  finalAdvice: string;
}

export const utils_service = "http://localhost:5002/api/utils/career";
