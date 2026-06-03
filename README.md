# lighting-ai-agent

`lighting-ai-agent` 是一个面向公建类照明设计顾问、建筑设计院和业主汇报阶段的 Next.js + TypeScript MVP 原型。它不替代专业照明设计师，而是用本地规则库快速生成照明策略、空间指标建议、风险清单、智能控制逻辑和中文 Markdown 汇报初稿。

## 运行方式

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

常用命令：

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## 当前功能

- `/`：项目输入页，支持建筑类型、项目阶段、设计目标、预算等级、空间清单、业主关注点和当前痛点。
- `/results`：分析结果页，展示项目概览、总体策略、空间分区指标表、风险清单、智能控制策略和 Markdown 报告预览。
- 内置 3 个 sample projects：政务服务中心、文化艺术中心、总部办公楼。
- 支持复制 Markdown 报告、下载 JSON 分析结果。
- 分析结果保存在 `localStorage`，刷新结果页后仍可读取最近一次分析。

## 代码结构

- `src/lib/lighting-db/spaces.json`：本地照明规则数据库。
- `src/lib/types.ts`：项目、空间、规则、策略、风险和分析结果 interfaces。
- `src/lib/agents/space-classifier.ts`：空间名称到标准空间类型的规则匹配。
- `src/lib/agents/lighting-strategy-agent.ts`：总体照明策略生成。
- `src/lib/agents/risk-review-agent.ts`：空间风险清单生成。
- `src/lib/agents/report-generator-agent.ts`：业主汇报 Markdown 生成。
- `src/lib/agents/analyze-project.ts`：分析编排入口。
- `src/lib/integrations/*`：CAD、Excel、OpenAI、Radiance/Honeybee、DIALux/Relux、PDF/PPT、BIM/Revit 等预留接口。
- `src/components/project-form.tsx` 和 `src/components/results-dashboard.tsx`：前端交互和展示组件。

## 如何扩展照明数据库

在 `src/lib/lighting-db/spaces.json` 中新增或调整空间类型。每个空间类型需要包含：

```json
{
  "recommended_lux": "300-500 lx",
  "color_temperature": "3500-4000K",
  "cri": "Ra >= 90",
  "glare_risk": "中",
  "recommended_fixture": "低眩光线性灯、筒灯",
  "control_strategy": "日光感应、场景控制",
  "design_notes": ["设计注意点"],
  "common_risks": ["常见风险"],
  "value_upgrade_points": ["价值提升点"]
}
```

如果新增标准空间类型，还需要同步更新 `src/lib/types.ts` 的 `StandardSpaceType`，并在 `src/lib/agents/space-classifier.ts` 的 `keywordMap` 中补充关键词。

## 如何扩展 Agent

- 新增空间分类规则：扩展 `keywordMap`，或将来替换为 embedding / LLM 分类。
- 新增策略模板：在 `lighting-strategy-agent.ts` 中按建筑类型、预算等级、设计目标加入分支。
- 新增风险规则：在 `risk-review-agent.ts` 的候选风险中加入条件、描述和建议。
- 新增报告章节：在 `report-generator-agent.ts` 中调整 Markdown 模板。

## 后续接入方向

- OpenAI API：`src/lib/integrations/openai.ts` 已预留请求接口，可将规则结果作为结构化上下文，交给模型生成更自然的汇报文本。
- CAD 图纸：`src/lib/integrations/cad.ts` 预留 DWG/DXF/PDF 上传入口，后续可接图纸解析服务。
- Excel 房间表：`src/lib/integrations/excel-room-schedule.ts` 预留空间清单解析接口。
- Radiance / Honeybee：`src/lib/integrations/simulation.ts` 预留物理模拟任务接口。
- DIALux / Relux：`src/lib/integrations/simulation.ts` 预留专业照明软件数据交换接口。
- PDF / PPT：`src/lib/integrations/report-export.ts` 预留报告导出、PPT 大纲和灯光概念图提示词接口。
- BIM / Revit：`src/lib/integrations/bim-revit.ts` 预留房间数据同步接口。
