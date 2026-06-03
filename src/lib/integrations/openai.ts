import type { IntegrationPlaceholderResult, ProjectInput } from "@/lib/types";

export interface OpenAiLightingRequest {
  project: ProjectInput;
  prompt: string;
}

export async function connectToOpenAiApi(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "OpenAI API",
    status: "not_implemented",
    message: "预留OpenAI API接口，后续可将规则结果与大模型生成文本结合。",
  };
}
