import type { IntegrationPlaceholderResult, SpaceInput } from "@/lib/types";

export interface BimRoomDataPayload {
  source: "Revit" | "IFC" | "BIM";
  rooms: SpaceInput[];
}

export async function connectToBimOrRevitRoomData(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "BIM / Revit room data",
    status: "not_implemented",
    message: "预留BIM/Revit房间数据接口，后续可同步房间名称、面积、层高和专业参数。",
  };
}
