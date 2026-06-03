import type { AnalysisResult, ProjectInput, ReportResult, RiskItem, SpaceAnalysis } from "@/lib/types";

function buildSpaceTable(spaces: SpaceAnalysis[]): string {
  const rows = spaces.map(
    (space) =>
      `| ${space.name} | ${space.standardType} | ${space.recommendedLux} | ${space.colorTemperature} | ${space.cri} | ${space.controlStrategy} |`,
  );

  return [
    "| 空间 | 标准类型 | 建议照度 | 色温 | 显色 | 控制策略 |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
  ].join("\n");
}

function buildRiskList(risks: RiskItem[]): string {
  return risks
    .slice(0, 12)
    .map(
      (risk) =>
        `- **${risk.severity}风险｜${risk.spaceName}｜${risk.riskType}**：${risk.description} 建议：${risk.recommendation}`,
    )
    .join("\n");
}

export function generateReport(
  project: ProjectInput,
  analysis: Omit<AnalysisResult, "report">,
): ReportResult {
  const servicePackages = [
    "重点空间照明概念深化包：大堂、报告厅、展厅、立面等空间形成灯光叙事、灯具意向和场景清单。",
    "绿色与健康照明专项包：响应绿色建筑、WELL、LEED相关条文，补充眩光、频闪、节能和使用者舒适度策略。",
    "智能控制与运营策略包：输出场景矩阵、回路建议、控制点表和运营时段策略。",
    "跨专业协调与风险审查包：对建筑、室内、机电、消防、导视、多媒体界面进行灯位和控制风险复核。",
  ];

  const markdown = `# ${project.projectName || "公建项目"}照明设计策略分析报告

## 一、项目概况

- 建筑类型：${project.buildingType}
- 项目面积：${project.projectArea || 0} 平方米
- 项目阶段：${project.projectStage}
- 设计目标：${project.designGoals.length > 0 ? project.designGoals.join("、") : "基础照明品质提升"}
- 预算等级：${project.budgetLevel}
- 业主关注点：${project.ownerConcerns || "待进一步访谈确认"}
- 当前痛点：${project.painPoints || "暂无明确痛点"}

## 二、照明设计核心判断

${analysis.strategy.concept}

## 三、空间分区策略表

${buildSpaceTable(analysis.spaces)}

## 四、重点空间设计建议

${analysis.strategy.keySpaceStrategies.map((item) => `- ${item}`).join("\n")}

## 五、智能控制与运营策略

${analysis.strategy.smartControlStrategy}

建议至少建立“日常、迎宾/运营、会议/活动、清洁、节能/深夜”五类基础场景，并在后续深化阶段形成控制回路与点位表。

## 六、节能与绿色建筑价值

${analysis.strategy.energySavingStrategy}

${analysis.strategy.healthyLightingStrategy}

## 七、风险清单

${buildRiskList(analysis.risks)}

## 八、后续工作建议

${analysis.strategy.nextSteps.map((item) => `- ${item}`).join("\n")}

## 九、可提升设计溢价的专项服务包

${servicePackages.map((item) => `- ${item}`).join("\n")}
`;

  return {
    markdown,
    servicePackages,
  };
}
