export type BuildingType =
  | "办公楼"
  | "文化建筑"
  | "商业综合体"
  | "学校"
  | "医院"
  | "交通枢纽"
  | "展馆"
  | "图书馆"
  | "政务中心"
  | "其他";

export type ProjectStage = "概念方案" | "初步设计" | "施工图" | "招投标" | "改造诊断";

export type DesignGoal =
  | "节能"
  | "健康照明"
  | "品牌形象"
  | "夜间识别度"
  | "绿色建筑认证"
  | "WELL"
  | "LEED"
  | "智能控制"
  | "低成本优化";

export type BudgetLevel = "低" | "中" | "高" | "旗舰";

export type StandardSpaceType =
  | "大堂"
  | "走廊"
  | "电梯厅"
  | "办公区"
  | "会议室"
  | "报告厅"
  | "展厅"
  | "图书阅览区"
  | "餐厅"
  | "地下车库"
  | "卫生间"
  | "设备机房"
  | "室外入口"
  | "景观步道"
  | "建筑立面";

export type RiskSeverity = "低" | "中" | "高";

export interface SpaceInput {
  id: string;
  name: string;
  area: number;
  height: number;
  usageHours: string;
  notes: string;
}

export interface ProjectInput {
  projectName: string;
  buildingType: BuildingType;
  projectArea: number;
  projectStage: ProjectStage;
  designGoals: DesignGoal[];
  budgetLevel: BudgetLevel;
  spaces: SpaceInput[];
  ownerConcerns: string;
  painPoints: string;
}

export interface LightingRule {
  recommended_lux: string;
  color_temperature: string;
  cri: string;
  glare_risk: string;
  recommended_fixture: string;
  control_strategy: string;
  design_notes: string[];
  common_risks: string[];
  value_upgrade_points: string[];
}

export interface ClassifiedSpace {
  input: SpaceInput;
  standardType: StandardSpaceType;
  confidence: number;
  matchedKeywords: string[];
  rule: LightingRule;
}

export interface SpaceAnalysis {
  id: string;
  name: string;
  standardType: StandardSpaceType;
  area: number;
  height: number;
  usageHours: string;
  recommendedLux: string;
  colorTemperature: string;
  cri: string;
  fixture: string;
  controlStrategy: string;
  notes: string[];
  valueUpgradePoints: string[];
}

export interface LightingStrategy {
  concept: string;
  daylightIntegration: string;
  keySpaceStrategies: string[];
  colorAndCriStrategy: string;
  smartControlStrategy: string;
  energySavingStrategy: string;
  healthyLightingStrategy: string;
  nextSteps: string[];
}

export interface RiskItem {
  id: string;
  spaceName: string;
  standardType: StandardSpaceType;
  riskType: string;
  severity: RiskSeverity;
  description: string;
  recommendation: string;
}

export interface ReportResult {
  markdown: string;
  servicePackages: string[];
}

export interface AnalysisResult {
  project: ProjectInput;
  generatedAt: string;
  spaces: SpaceAnalysis[];
  strategy: LightingStrategy;
  risks: RiskItem[];
  report: ReportResult;
}

export interface IntegrationPlaceholderResult {
  provider: string;
  status: "not_implemented";
  message: string;
}
