import spacesData from "@/lib/lighting-db/spaces.json";
import type {
  ClassifiedSpace,
  LightingRule,
  SpaceInput,
  StandardSpaceType,
} from "@/lib/types";

const lightingRules = spacesData as Record<StandardSpaceType, LightingRule>;

const keywordMap: Record<StandardSpaceType, string[]> = {
  大堂: ["大堂", "门厅", "前厅", "接待", "入口大厅", "共享大厅"],
  走廊: ["走廊", "通道", "连廊", "过道"],
  电梯厅: ["电梯", "候梯", "梯厅"],
  办公区: ["办公", "工位", "开放办公", "办公室", "工作区"],
  会议室: ["会议", "洽谈", "董事会", "会客"],
  报告厅: ["报告厅", "多功能厅", "礼堂", "讲堂", "发布厅", "演讲"],
  展厅: ["展厅", "展览", "展示", "陈列", "序厅"],
  图书阅览区: ["阅览", "图书", "书库", "自习", "学习"],
  餐厅: ["餐厅", "食堂", "咖啡", "茶水", "就餐"],
  地下车库: ["车库", "停车", "坡道", "地下"],
  卫生间: ["卫生间", "洗手间", "盥洗", "厕所"],
  设备机房: ["机房", "配电", "设备", "水泵", "空调机房", "弱电"],
  室外入口: ["室外入口", "雨棚", "门廊", "主入口", "广场入口"],
  景观步道: ["景观", "步道", "庭院", "园路", "连桥"],
  建筑立面: ["立面", "幕墙", "外立面", "夜景", "泛光"],
};

export function classifySpace(space: SpaceInput): ClassifiedSpace {
  const normalizedName = space.name.trim().toLowerCase();
  let bestType: StandardSpaceType = "办公区";
  let bestScore = 0;
  let matchedKeywords: string[] = [];

  for (const [standardType, keywords] of Object.entries(keywordMap) as [
    StandardSpaceType,
    string[],
  ][]) {
    const matches = keywords.filter((keyword) =>
      normalizedName.includes(keyword.toLowerCase()),
    );
    const score = matches.reduce((total, keyword) => total + keyword.length, 0);

    if (score > bestScore) {
      bestScore = score;
      bestType = standardType;
      matchedKeywords = matches;
    }
  }

  if (bestScore === 0 && normalizedName.includes("厅")) {
    bestType = "大堂";
    matchedKeywords = ["厅"];
    bestScore = 1;
  }

  return {
    input: space,
    standardType: bestType,
    confidence: Math.min(0.95, bestScore > 0 ? 0.55 + bestScore / 20 : 0.35),
    matchedKeywords,
    rule: lightingRules[bestType],
  };
}

export function getLightingRules(): Record<StandardSpaceType, LightingRule> {
  return lightingRules;
}
