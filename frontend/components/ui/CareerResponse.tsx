"use client";

import {
  Briefcase,
  Target,
  TrendingUp,
  IndianRupee,
  AlertTriangle,
  ShieldCheck,
  BarChart3,
  GraduationCap,
  Building2,
} from "lucide-react";

import { CareerGuideResponse } from "@/type";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { SalaryChart } from "./SalaryChart";

interface Props {
  data: CareerGuideResponse;
}

export const CareerResponse = ({ data }: Props) => {
  const formatSalary = (min: number, max: number) =>
    `₹ ${(min / 100000).toFixed(1)}L - ₹ ${(max / 100000).toFixed(1)}L`;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 px-8 py-12">
      <div className="max-w-[1600px] mx-auto space-y-20">

        {/* PROFILE HEADER */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <Card title="Experience Level">
            {data.profileAssessment?.experienceLevelDetected ?? "N/A"}
          </Card>

          <Card title="Market Position">
            {data.profileAssessment?.marketPositioning ?? "N/A"}
          </Card>

          <div className="flex justify-center">
            <ConfidenceMeter
              value={data.profileAssessment?.confidenceScore ?? 0}
            />
          </div>
        </div>

        {/* SUMMARY */}
        <Section title="Strategic Overview" icon={<Target className="text-blue-600" />}>
          {data.summary}
        </Section>

        {/* JOB + SKILLS GRID */}
        <div className="grid xl:grid-cols-2 gap-16">

          {/* JOB OPTIONS */}
          <Section title="Recommended Roles" icon={<Briefcase className="text-blue-600" />}>
            <div className="space-y-12">

              {data.jobOptions.map((job, i) => (
                <div
                  key={i}
                  className="border rounded-3xl p-8 bg-white dark:bg-zinc-900 shadow-sm space-y-6"
                >
                  <div>
                    <h3 className="text-2xl font-semibold">{job.title}</h3>

                    {job.estimatedSalaryRange && (
                      <p className="text-blue-600 text-sm mt-2 flex items-center gap-2">
                        <IndianRupee size={14} />
                        {formatSalary(
                          job.estimatedSalaryRange.min,
                          job.estimatedSalaryRange.max
                        )}
                      </p>
                    )}
                  </div>

                  {/* Salary Chart */}
                  {job.estimatedSalaryRange && (
                    <SalaryChart
                      min={job.estimatedSalaryRange.min}
                      max={job.estimatedSalaryRange.max}
                    />
                  )}

                  <ul className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
                    {job.responsibilities.map((r, idx) => (
                      <li key={idx}>• {r}</li>
                    ))}
                  </ul>

                  <div className="text-sm space-y-2">
                    <p className="text-blue-600 font-medium">
                      Why: {job.whyGoodFit}
                    </p>
                    <p className="text-muted-foreground">
                      Growth: {job.growthPotential}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          </Section>

          {/* SKILL GAP + ROADMAP */}
          <div className="space-y-16">

            <Section title="Skill Gap Analysis" icon={<BarChart3 className="text-blue-600" />}>
              <div className="grid md:grid-cols-2 gap-8">
                <Box
                  title="Strong Skills"
                  items={data.skillGapAnalysis.strongSkills}
                  positive
                />
                <Box
                  title="Missing Critical Skills"
                  items={data.skillGapAnalysis.missingCriticalSkills}
                />
              </div>
            </Section>

            <Section title="Learning Roadmap" icon={<TrendingUp className="text-blue-600" />}>
              <div className="grid md:grid-cols-3 gap-8">
                <Roadmap title="3 Months" items={data.learningRoadmap["3MonthPlan"]} />
                <Roadmap title="6 Months" items={data.learningRoadmap["6MonthPlan"]} />
                <Roadmap title="12 Months" items={data.learningRoadmap["12MonthPlan"]} />
              </div>
            </Section>

          </div>
        </div>

        {/* CERTIFICATIONS + MARKET */}
        <div className="grid xl:grid-cols-2 gap-16">

          <Section title="Certifications" icon={<GraduationCap className="text-blue-600" />}>
            <div className="space-y-6">
              {data.certifications.map((cert, i) => (
                <div key={i} className="border rounded-xl p-6">
                  <h4 className="font-semibold text-lg">{cert.name}</h4>
                  <p className="text-sm text-muted-foreground mt-2">
                    {cert.priority} • {cert.estimatedTime} • {cert.costEstimate}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Market Intelligence" icon={<Building2 className="text-blue-600" />}>
            <p className="text-sm mb-4">
              Avg Interview Rounds: {data.marketIntelligence.averageInterviewRounds}
            </p>

            <ul className="space-y-2 text-sm">
              {data.marketIntelligence.keyInterviewTopics.map((topic, i) => (
                <li key={i}>• {topic}</li>
              ))}
            </ul>
          </Section>

        </div>

        {/* RISK + FINAL */}
        <div className="grid xl:grid-cols-2 gap-16">

          <Section title="Risk Factors" icon={<AlertTriangle className="text-red-500" />}>
            <ul className="space-y-2 text-sm">
              {data.riskFactors.map((risk, i) => (
                <li key={i}>• {risk}</li>
              ))}
            </ul>
          </Section>

          <Section title="Final Strategic Advice" icon={<ShieldCheck className="text-blue-600" />}>
            {data.finalAdvice}
          </Section>

        </div>

      </div>
    </div>
  );
};

/* ================= UI HELPERS ================= */

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <div className="border rounded-3xl p-8 bg-white dark:bg-zinc-900 shadow-sm">
    <h3 className="text-sm text-muted-foreground mb-3">{title}</h3>
    <p className="text-xl font-semibold">{children}</p>
  </div>
);

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, icon, children }: SectionProps) => (
  <div className="space-y-8">
    <h2 className="text-3xl font-bold flex items-center gap-3">
      {icon}
      {title}
    </h2>
    <div className="text-zinc-700 dark:text-zinc-300 text-sm leading-relaxed">
      {children}
    </div>
  </div>
);

interface BoxProps {
  title: string;
  items: string[];
  positive?: boolean;
}

const Box = ({ title, items, positive }: BoxProps) => (
  <div className="border rounded-2xl p-6 bg-white dark:bg-zinc-900">
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">
      {items.map((item, i) => (
        <li key={i} className={positive ? "text-green-600" : ""}>
          • {item}
        </li>
      ))}
    </ul>
  </div>
);

interface RoadmapProps {
  title: string;
  items: string[];
}

const Roadmap = ({ title, items }: RoadmapProps) => (
  <div className="border rounded-2xl p-6 bg-white dark:bg-zinc-900">
    <h4 className="font-semibold mb-4">{title}</h4>
    <ul className="space-y-2 text-sm">
      {items.map((item, i) => (
        <li key={i}>• {item}</li>
      ))}
    </ul>
  </div>
);
