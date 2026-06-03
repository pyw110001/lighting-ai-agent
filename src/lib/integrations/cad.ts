import type { IntegrationPlaceholderResult } from "@/lib/types";

export interface CadDrawingUpload {
  fileName: string;
  fileType: "dwg" | "dxf" | "pdf";
  size: number;
}

export async function uploadCadDrawings(): Promise<IntegrationPlaceholderResult> {
  return {
    provider: "CAD drawings",
    status: "not_implemented",
    message: "预留CAD图纸上传接口，后续可接入DWG/DXF解析服务。",
  };
}
