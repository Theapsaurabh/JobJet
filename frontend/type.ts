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

// /types/index.ts

export interface ResumeAnalysisResponse {
  atsScore: number;

  autoDetectedContext: AutoDetectedContext;

  scoreBreakdown: ScoreBreakdown;

  contactInfoValidation: ContactInfoValidation;

  parsingRisks: ParsingRisk[];

  sectionAnalysis: SectionAnalysis[];

  keywordGapAnalysis: KeywordGapAnalysis;

  suggestions: Suggestion[];

  strengths: string[];

  roleAlignment: RoleAlignment;

  competitivePositioning: CompetitivePositioning;

  employmentHistory: EmploymentHistory;

  quickWins: string[];

  estimatedScoreAfterFixes: number;

  summary: string;
}

/* ============================= */
/* Auto Detected Context */
/* ============================= */

export interface AutoDetectedContext {
  inferredTargetRoles: string[];
  detectedExperienceLevel:
    | "Entry"
    | "Mid"
    | "Senior"
    | "Lead"
    | "Unknown";
  primaryTechStack: string[];
  detectedDomain: string;
  resumeWordCount: number;
  estimatedPages: number;
}

/* ============================= */
/* Score Breakdown */
/* ============================= */

export interface ScoreBreakdown {
  formatting: FormattingScore;
  keywords: KeywordScore;
  structure: StructureScore;
  readability: ReadabilityScore;
  impact: ImpactScore;
}

interface BaseScore {
  score: number;
  maxScore: number;
  weight: string;
  feedback: string;
}

export interface FormattingScore extends BaseScore {
  criticalIssues: string[];
  atsCompatibility: "High" | "Medium" | "Low" | "Unknown";
}

export interface KeywordScore extends BaseScore {
  detectedKeywords: string[];
  missingCriticalKeywords: string[];
  keywordDensity: string;
  densityAssessment:
    | "Under-optimized"
    | "Optimal"
    | "Over-stuffed"
    | "Unknown";
  roleMatchPercentage: number;
}

export interface StructureScore extends BaseScore {
  presentSections: string[];
  missingSections: string[];
  sectionOrder: "Correct" | "Incorrect" | "Unknown";
  dateConsistency: "Consistent" | "Inconsistent" | "Unknown";
}

export interface ReadabilityScore extends BaseScore {
  averageBulletLength: string;
  actionVerbStrength: "Strong" | "Moderate" | "Weak" | "Unknown";
  tenseConsistency: "Consistent" | "Inconsistent" | "Unknown";
  grammarIssues: number;
}

export interface ImpactScore extends BaseScore {
  totalBulletPoints: number;
  quantifiedBullets: number;
  quantificationRate: string;
  impactLevel: "Strong" | "Moderate" | "Weak" | "Unknown";
}

/* ============================= */
/* Contact Validation */
/* ============================= */

export interface ContactInfoValidation {
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinkedIn: boolean;
  hasGitHub: boolean;
  hasPortfolio: boolean;
  hasLocation: boolean;
  missingCritical: string[];
  emailFormat: "Valid" | "Invalid" | "Unknown";
  phoneFormat: "Valid" | "Invalid" | "Unknown";
}

/* ============================= */
/* Parsing Risk */
/* ============================= */

export interface ParsingRisk {
  severity: "critical" | "high" | "medium" | "low";
  issue: string;
  impact: string;
  fix: string;
  estimatedScoreImpact: string;
}

/* ============================= */
/* Section Analysis */
/* ============================= */

export interface SectionAnalysis {
  section: string;
  present: boolean;
  quality?: "Strong" | "Adequate" | "Weak" | "Missing";
  currentContent?: string;
  feedback: string;
  suggestion: string;
  priority?: "high" | "medium" | "low";
  bulletPointCount?: number;
  quantifiedCount?: number;
  categorized?: boolean;
}

/* ============================= */
/* Keyword Gap */
/* ============================= */

export interface KeywordGapAnalysis {
  forDetectedRole: string;
  industryStandardKeywords: string[];
  yourKeywords: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  matchScore: number;
  recommendations: string[];
}

/* ============================= */
/* Suggestions */
/* ============================= */

export interface Suggestion {
  category: string;
  issue: string;
  recommendation: string;
  priority: "critical" | "high" | "medium" | "low";
  estimatedScoreIncrease: string;
  example: {
    before: string;
    after: string;
  };
}

/* ============================= */
/* Role Alignment */
/* ============================= */

export interface RoleAlignment {
  detectedPrimaryRole: string;
  alignmentScore: number;
  roleMatchStrength: "Strong" | "Moderate" | "Weak" | "Unknown";
  alternateRoles: string[];
  bestFitCompanies: string[];
  missingForRole: string[];
  recommendedJobTitles: string[];
}

/* ============================= */
/* Competitive Positioning */
/* ============================= */

export interface CompetitivePositioning {
  marketLevel: string;
  atsPassProbability: string;
  recruiterShortlistProbability: string;
  riskOfAutoRejection: string;
  reasoning: string;
  comparisonToAverage: {
    averageATSScore: number;
    yourScore: number;
    percentile: string;
  };
}

/* ============================= */
/* Employment History */
/* ============================= */

export interface EmploymentHistory {
  totalYearsExperience: number;
  currentlyEmployed: boolean;
  employmentGaps: string[];
  jobHoppingRisk: string;
  careerProgression: "Positive" | "Stable" | "Unclear" | "Unknown";
  notes: string;
}



export const utils_service = "http://localhost:5002/api/utils";
