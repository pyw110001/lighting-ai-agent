import type { ProjectInput, RiskItem, RiskSeverity, SpaceAnalysis } from "@/lib/types";

function severityFrom(space: SpaceAnalysis, riskType: string, context: string): RiskSeverity {
  const highRiskSpaces = ["办公区", "会议室", "报告厅", "展厅", "图书阅览区", "建筑立面"];

  if (
    highRiskSpaces.includes(space.standardType) &&
    ["眩光风险", "频闪风险", "夜景过亮或光污染风险"].includes(riskType)
  ) {
    return "高";
  }

  if (space.height > 6 || space.area > 1000 || context.includes("眩光") || context.includes("维护")) {
    return "高";
  }

  if (space.area > 300 || space.usageHours.includes("夜") || space.usageHours.includes("24")) {
    return "中";
  }

  return "低";
}

export function generateRiskReview(project: ProjectInput, spaces: SpaceAnalysis[]): RiskItem[] {
  const risks: RiskItem[] = [];
  const context = `${project.painPoints} ${project.ownerConcerns}`;

  spaces.forEach((space, index) => {
    const candidates = [
      {
        riskType: "眩光风险",
        when: ["办公区", "会议室", "报告厅", "展厅", "图书阅览区", "室外入口", "建筑立面"].includes(space.standardType),
        description: `${space.name}存在视线方向直射、屏幕反射或高亮立面造成眩光的可能。`,
        recommendation: "优先选用低眩光灯具，复核UGR或观察角，并控制重点照明投射方向。",
      },
      {
        riskType: "照度不足或过度照明",
        when: space.area > 0,
        description: `${space.name}若仅按经验布灯，可能出现重点区域不足、非重点区域过亮的问题。`,
        recommendation: `以${space.recommendedLux}为初始目标，并在深化阶段通过照度计算校核均匀性。`,
      },
      {
        riskType: "频闪风险",
        when:
          ["办公区", "会议室", "图书阅览区"].includes(space.standardType) ||
          project.designGoals.includes("健康照明"),
        description: `${space.name}属于长时间停留或视觉任务空间，低品质驱动可能带来频闪与疲劳风险。`,
        recommendation: "要求灯具提供频闪指标或测试报告，优先采用高品质恒流驱动。",
      },
      {
        riskType: "控制回路不合理",
        when: space.area > 200 || space.usageHours.includes("夜") || project.designGoals.includes("智能控制"),
        description: `${space.name}使用时段和功能分区可能较复杂，单一回路会影响运营和节能。`,
        recommendation: "按使用场景、日光条件和运营时段拆分回路，并预留控制协议接口。",
      },
      {
        riskType: "后期维护困难",
        when: space.height > 4.5 || ["大堂", "报告厅", "展厅", "建筑立面", "室外入口"].includes(space.standardType),
        description: `${space.name}层高或安装条件较复杂，后期检修、更换和清洁成本可能偏高。`,
        recommendation: "在方案阶段同步确认检修方式、驱动位置、防护等级和备品备件策略。",
      },
      {
        riskType: "灯具选型与空间气质不匹配",
        when:
          ["大堂", "展厅", "餐厅", "建筑立面", "室外入口"].includes(space.standardType) ||
          project.designGoals.includes("品牌形象"),
        description: `${space.name}承担形象表达，灯具外观、色温和光束控制若处理不当会削弱空间品质。`,
        recommendation: "建立灯具样板和效果参照，重点空间在汇报阶段提供灯光概念图或样板段。",
      },
      {
        riskType: "与建筑、室内、机电、消防、导视、多媒体冲突",
        when: true,
        description: `${space.name}灯位、喷淋、风口、检修口、导视和多媒体设备之间存在综合协调风险。`,
        recommendation: "在初步设计前建立跨专业灯位协调表，并对重点天花进行综合排布。",
      },
      {
        riskType: "夜景过亮或光污染风险",
        when:
          ["建筑立面", "室外入口", "景观步道"].includes(space.standardType) ||
          project.designGoals.includes("夜间识别度"),
        description: `${space.name}若亮度等级和投射方向控制不足，可能造成扰民、眩光或不符合城市夜景管控。`,
        recommendation: "按城市夜景要求设定亮度上限，配置深夜节能模式并避免上射光溢散。",
      },
    ];

    candidates
      .filter((candidate) => candidate.when)
      .slice(0, 4)
      .forEach((candidate, candidateIndex) => {
        risks.push({
          id: `risk-${index}-${candidateIndex}`,
          spaceName: space.name,
          standardType: space.standardType,
          riskType: candidate.riskType,
          severity: severityFrom(space, candidate.riskType, context),
          description: candidate.description,
          recommendation: candidate.recommendation,
        });
      });
  });

  return risks;
}
