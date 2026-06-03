import type { IntegrationPlaceholderResult, SpaceInput } from "@/lib/types";

export interface RoomScheduleParseResult {
  spaces: SpaceInput[];
  warnings: string[];
}

export async function parseRoomScheduleFromExcel(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "Excel room schedule",
    status: "not_implemented",
    message: "预留Excel房间表解析接口，后续可映射空间名称、面积、层高和使用时段。",
  };
}
