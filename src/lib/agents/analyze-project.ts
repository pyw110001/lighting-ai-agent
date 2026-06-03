import { classifySpace } from "@/lib/agents/space-classifier";
import { generateLightingStrategy, toSpaceAnalysis } from "@/lib/agents/lighting-strategy-agent";
import { generateReport } from "@/lib/agents/report-generator-agent";
import { generateRiskReview } from "@/lib/agents/risk-review-agent";
import type { AnalysisResult, ProjectInput } from "@/lib/types";

export const ANALYSIS_STORAGE_KEY = "lighting-ai-agent:last-analysis";

export function analyzeProject(project: ProjectInput): AnalysisResult {
  const validSpaces = project.spaces.filter((space) => space.name.trim().length > 0);
  const classifiedSpaces = validSpaces.map(classifySpace);
  const spaces = toSpaceAnalysis(classifiedSpaces);
  const strategy = generateLightingStrategy(project, spaces);
  const risks = generateRiskReview(project, spaces);
  const partialResult = {
    project,
    generatedAt: new Date().toISOString(),
    spaces,
    strategy,
    risks,
  };

  return {
    ...partialResult,
    report: generateReport(project, partialResult),
  };
}
