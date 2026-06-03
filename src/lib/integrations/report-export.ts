import type { AnalysisResult, IntegrationPlaceholderResult } from "@/lib/types";

export interface ReportExportRequest {
  analysis: AnalysisResult;
  format: "pdf" | "ppt-outline" | "concept-image-prompts";
}

export async function exportPdfReport(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "PDF report export",
    status: "not_implemented",
    message: "预留PDF报告导出接口，后续可接入服务端渲染或浏览器打印模板。",
  };
}

export async function exportPptOutline(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "PPT outline export",
    status: "not_implemented",
    message: "预留PPT大纲导出接口，后续可转换为业主汇报页结构。",
  };
}

export async function generateLightingConceptImagePrompts(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "Lighting concept image prompts",
    status: "not_implemented",
    message: "预留灯光概念图提示词生成接口，后续可接入图像生成或效果图流程。",
  };
}
