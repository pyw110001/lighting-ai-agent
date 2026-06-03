import type {
  ClassifiedSpace,
  LightingStrategy,
  ProjectInput,
  SpaceAnalysis,
} from "@/lib/types";

function budgetTone(budgetLevel: ProjectInput["budgetLevel"]): string {
  const tones: Record<ProjectInput["budgetLevel"], string> = {
    低: "优先采用标准化灯具、简化回路和高性价比控制策略，集中资源解决关键空间体验。",
    中: "在主要公共空间配置更好的显色、低眩光灯具和分区控制，兼顾品质与投资效率。",
    高: "重点空间可配置场景化调光、高显色灯具和精细化控制，为汇报与运营预留弹性。",
    旗舰: "可建立完整的照明叙事、数字化控制和专项模拟验证体系，形成可感知的品牌溢价。",
  };

  return tones[budgetLevel];
}

export function toSpaceAnalysis(classifiedSpaces: ClassifiedSpace[]): SpaceAnalysis[] {
  return classifiedSpaces.map(({ input, standardType, rule }) => ({
    id: input.id,
    name: input.name,
    standardType,
    area: input.area,
    height: input.height,
    usageHours: input.usageHours,
    recommendedLux: rule.recommended_lux,
    colorTemperature: rule.color_temperature,
    cri: rule.cri,
    fixture: rule.recommended_fixture,
    controlStrategy: rule.control_strategy,
    notes: rule.design_notes,
    valueUpgradePoints: rule.value_upgrade_points,
  }));
}

export function generateLightingStrategy(
  project: ProjectInput,
  spaces: SpaceAnalysis[],
): LightingStrategy {
  const targetText =
    project.designGoals.length > 0 ? project.designGoals.join("、") : "基础功能与运营效率";
  const largePublicSpaces = spaces.filter((space) =>
    ["大堂", "报告厅", "展厅", "图书阅览区", "建筑立面"].includes(space.standardType),
  );
  const controlFocus = project.designGoals.includes("智能控制")
    ? "以场景面板、时间表、人员感应与日光感应形成可运营的控制系统。"
    : "先建立清晰的分区回路，再为后续智能控制平台预留协议和点位。";

  return {
    concept: `${project.projectName || "本项目"}建议以“功能清晰、形象克制、运营可控”为总体照明概念。针对${project.buildingType}的公共属性，照明应优先服务空间识别、人员舒适与业主汇报表达，并围绕${targetText}建立分层策略。${budgetTone(project.budgetLevel)}`,
    daylightIntegration:
      "靠近幕墙、天窗和中庭的区域应采用日光感应与恒照度控制，白天降低基础照明输出；深进深区域通过竖向面照明和重点照明补足空间亮度层次，避免单纯提高天花灯具功率。",
    keySpaceStrategies:
      largePublicSpaces.length > 0
        ? largePublicSpaces.slice(0, 5).map(
            (space) =>
              `${space.name}按“${space.standardType}”控制：建议照度${space.recommendedLux}，采用${space.fixture}，并结合${space.controlStrategy}。`,
          )
        : spaces.slice(0, 5).map(
            (space) =>
              `${space.name}按“${space.standardType}”控制：建议照度${space.recommendedLux}，重点关注${space.notes[0]}。`,
          ),
    colorAndCriStrategy:
      "公共形象空间建议控制在3000-4000K之间，办公和阅览空间宜采用3500-4000K；展陈、接待、餐饮等关注材质与肤色表现的空间优先采用Ra>=90的光源。",
    smartControlStrategy: `${controlFocus}重点空间至少预设日常、迎宾、会议/活动、清洁、节能五类场景，夜间区域应设置低照度巡航和安防联动。`,
    energySavingStrategy:
      "节能策略以高效LED、合理照度、分区控制、日光利用和时段调光为核心，避免为追求亮度感而进行全域过度照明。地下车库、走廊、卫生间等长时运行空间应优先部署感应控制。",
    healthyLightingStrategy: project.designGoals.some((goal) =>
      ["健康照明", "WELL"].includes(goal),
    )
      ? "健康照明应控制眩光、频闪和长时间视觉疲劳，办公、阅览和医疗相关空间可进一步评估昼夜节律照明、垂直照度与使用者自主控制。"
      : "健康照明作为基础品质要求纳入：控制眩光、频闪、色容差和照度均匀性，优先解决长时间停留空间的视觉舒适。",
    nextSteps: [
      "结合建筑、室内和机电图纸复核灯位、回路和检修条件。",
      "对大堂、报告厅、展厅、立面等重点空间开展照明效果图或概念图提示词深化。",
      "在初步设计阶段补充照度计算、眩光校核和控制点表。",
      "为绿色建筑、WELL或LEED目标整理照明相关条文响应表。",
    ],
  };
}
