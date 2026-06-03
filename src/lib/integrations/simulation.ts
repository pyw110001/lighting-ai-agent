import type { IntegrationPlaceholderResult, SpaceInput } from "@/lib/types";

export interface LightingSimulationRequest {
  engine: "Radiance" | "Honeybee" | "DIALux" | "Relux";
  spaces: SpaceInput[];
}

export async function connectToRadianceOrHoneybee(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "Radiance / Honeybee",
    status: "not_implemented",
    message: "预留物理照明模拟接口，后续可生成照度、眩光和日光分析任务。",
  };
}

export async function connectToDialuxOrRelux(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "DIALux / Relux",
    status: "not_implemented",
    message: "预留专业照明软件接口，后续可导出房间和灯具计算数据。",
  };
}
