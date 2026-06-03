"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  Check,
  Grid3X3,
  Plus,
  Sparkles,
  Trash2,
  WandSparkles,
  Zap,
} from "lucide-react";
import { analyzeProject, ANALYSIS_STORAGE_KEY } from "@/lib/agents/analyze-project";
import { sampleProjects } from "@/lib/samples/sample-projects";
import { ThreeBeamBackground } from "@/components/three-beam-background";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DarkSelect } from "@/components/ui/dark-select";
import type {
  BudgetLevel,
  BuildingType,
  DesignGoal,
  ProjectInput,
  ProjectStage,
  SpaceInput,
} from "@/lib/types";

const buildingTypes: BuildingType[] = [
  "办公楼",
  "文化建筑",
  "商业综合体",
  "学校",
  "医院",
  "交通枢纽",
  "展馆",
  "图书馆",
  "政务中心",
  "其他",
];
const projectStages: ProjectStage[] = ["概念方案", "初步设计", "施工图", "招投标", "改造诊断"];
const designGoals: DesignGoal[] = [
  "节能",
  "健康照明",
  "品牌形象",
  "夜间识别度",
  "绿色建筑认证",
  "WELL",
  "LEED",
  "智能控制",
  "低成本优化",
];
const budgetLevels: BudgetLevel[] = ["低", "中", "高", "旗舰"];

function createSpace(): SpaceInput {
  return {
    id: crypto.randomUUID(),
    name: "",
    area: 0,
    height: 3,
    usageHours: "",
    notes: "",
  };
}

const initialProject: ProjectInput = {
  projectName: "",
  buildingType: "办公楼",
  projectArea: 0,
  projectStage: "概念方案",
  designGoals: ["节能", "智能控制"],
  budgetLevel: "中",
  spaces: [{ id: "initial-space", name: "", area: 0, height: 3, usageHours: "", notes: "" }],
  ownerConcerns: "",
  painPoints: "",
};

export function ProjectForm() {
  const router = useRouter();
  const [project, setProject] = useState<ProjectInput>(initialProject);

  const validSpaceCount = useMemo(
    () => project.spaces.filter((space) => space.name.trim()).length,
    [project.spaces],
  );

  function updateProject<K extends keyof ProjectInput>(key: K, value: ProjectInput[K]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  function updateSpace(id: string, patch: Partial<SpaceInput>) {
    setProject((current) => ({
      ...current,
      spaces: current.spaces.map((space) => (space.id === id ? { ...space, ...patch } : space)),
    }));
  }

  function toggleGoal(goal: DesignGoal) {
    setProject((current) => {
      const exists = current.designGoals.includes(goal);

      return {
        ...current,
        designGoals: exists
          ? current.designGoals.filter((item) => item !== goal)
          : [...current.designGoals, goal],
      };
    });
  }

  function loadSample(sample: ProjectInput) {
    setProject({
      ...sample,
      spaces: sample.spaces.map((space) => ({ ...space })),
    });
  }

  function handleAnalyze() {
    const normalizedProject: ProjectInput = {
      ...project,
      projectName: project.projectName.trim() || "未命名公建项目",
      spaces: project.spaces.filter((space) => space.name.trim()),
    };
    const analysis = analyzeProject(normalizedProject);
    localStorage.setItem(ANALYSIS_STORAGE_KEY, JSON.stringify(analysis));
    router.push("/results");
  }

  return (
    <main className="luma-page min-h-screen overflow-hidden text-white">
      <ThreeBeamBackground />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-5 sm:px-6 lg:px-8">
        <header className="luma-nav animate-rise" style={{ "--card-delay": "0ms" } as CSSProperties}>
          <div className="flex items-center gap-3">
            <div className="brand-mark">
              <Zap size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-base font-semibold text-white">lighting-ai-agent</p>
              <p className="text-xs text-white/45">Powered by Zys</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-white/45 md:flex">
            <a className="text-white" href="#project">项目输入</a>
            <a href="#samples">示例项目</a>
            <a href="#spaces">空间清单</a>
            <a href="#owner">业主关注</a>
          </nav>
          <span className="glow-pill">MVP Prototype</span>
        </header>

        <section className="grid min-h-[520px] items-center gap-10 py-10 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="animate-rise" style={{ "--card-delay": "90ms" } as CSSProperties}>
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-indigo-100/75">
              <Sparkles size={14} />
              Modular lighting intelligence dashboard
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-white/90 sm:text-6xl">
              照明策略分析，
              <span className="block text-white">Powered by AI</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/55">
              面向公建前期方案、业主汇报和设计顾问评审，快速生成空间指标、场景策略、控制逻辑、风险清单与中文报告。
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <button type="button" onClick={handleAnalyze} disabled={validSpaceCount === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-45">
                <WandSparkles size={18} />
                生成照明分析
              </button>
              <a href="#project" className="secondary-button">
                <Grid3X3 size={17} />
                编辑项目输入
              </a>
            </div>
          </div>

          <DashboardCard id="project" delay={150} glow="violet" className="p-5">
            <div className="mb-5 flex flex-col gap-4 border-b border-white/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs uppercase text-indigo-200/70">Project Input</p>
                <h2 className="mt-1 text-xl font-semibold text-white">项目基础信息</h2>
              </div>
              <div className="grid w-full grid-cols-3 gap-2 text-center text-xs text-white/50 sm:w-auto">
                <Metric label="空间" value={validSpaceCount.toString()} />
                <Metric label="目标" value={project.designGoals.length.toString()} />
                <Metric label="预算" value={project.budgetLevel} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="field-label">项目名称</span>
                <input className="field-input" value={project.projectName} onChange={(event) => updateProject("projectName", event.target.value)} placeholder="例如：某市政务服务中心" />
              </label>
              <label className="block">
                <span className="field-label">项目面积（㎡）</span>
                <input className="field-input" type="number" value={project.projectArea || ""} onChange={(event) => updateProject("projectArea", Number(event.target.value))} placeholder="42000" />
              </label>
              <label className="block">
                <span className="field-label">建筑类型</span>
                <DarkSelect ariaLabel="选择建筑类型" options={buildingTypes} value={project.buildingType} onChange={(value) => updateProject("buildingType", value)} />
              </label>
              <label className="block">
                <span className="field-label">项目阶段</span>
                <DarkSelect ariaLabel="选择项目阶段" options={projectStages} value={project.projectStage} onChange={(value) => updateProject("projectStage", value)} />
              </label>
            </div>
          </DashboardCard>
        </section>

        <section className="dashboard-grid">
          <DashboardCard id="samples" delay={220} className="p-5 lg:col-span-7">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase text-indigo-200/70">Sample Projects</p>
                <h2 className="mt-1 text-xl font-semibold text-white">示例项目</h2>
              </div>
              <BarChart3 className="text-indigo-200/60" size={20} />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {sampleProjects.map((sample) => (
                <button key={sample.projectName} type="button" onClick={() => loadSample(sample)} className="sample-card">
                  <span className="text-sm font-semibold text-white">{sample.projectName}</span>
                  <span className="mt-2 block text-xs leading-5 text-white/45">
                    {sample.buildingType} / {sample.projectStage} / {sample.projectArea.toLocaleString()}㎡
                  </span>
                </button>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard delay={280} glow="violet" className="p-5 lg:col-span-5">
            <span className="field-label">设计目标</span>
            <div className="flex flex-wrap gap-2">
              {designGoals.map((goal) => {
                const selected = project.designGoals.includes(goal);

                return (
                  <button key={goal} type="button" onClick={() => toggleGoal(goal)} className={selected ? "goal-chip-selected" : "goal-chip"}>
                    {selected && <Check size={14} />}
                    {goal}
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <span className="field-label">预算等级</span>
              <div className="grid grid-cols-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                {budgetLevels.map((level) => (
                  <button key={level} type="button" onClick={() => updateProject("budgetLevel", level)} className={`budget-segment ${project.budgetLevel === level ? "budget-segment-active" : ""}`}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </DashboardCard>
        </section>

        <DashboardCard id="spaces" delay={340} className="overflow-visible">
          <div className="flex flex-col gap-3 border-b border-white/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase text-indigo-200/70">Room Schedule</p>
              <h2 className="mt-1 text-xl font-semibold text-white">空间清单</h2>
            </div>
            <button type="button" onClick={() => updateProject("spaces", [...project.spaces, createSpace()])} className="secondary-button">
              <Plus size={16} />
              增加空间
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px] border-collapse text-sm">
              <thead className="bg-white/[0.03] text-left text-xs text-white/38">
                <tr>
                  <th className="table-head">空间名称</th>
                  <th className="table-head">面积</th>
                  <th className="table-head">层高</th>
                  <th className="table-head">使用时段</th>
                  <th className="table-head">备注</th>
                  <th className="table-head w-16">操作</th>
                </tr>
              </thead>
              <tbody>
                {project.spaces.map((space) => (
                  <tr key={space.id} className="scan-row border-t border-white/8">
                    <td className="table-cell"><input className="table-input" value={space.name} onChange={(event) => updateSpace(space.id, { name: event.target.value })} placeholder="大堂 / 办公区 / 展厅" /></td>
                    <td className="table-cell"><input className="table-input" type="number" value={space.area || ""} onChange={(event) => updateSpace(space.id, { area: Number(event.target.value) })} placeholder="㎡" /></td>
                    <td className="table-cell"><input className="table-input" type="number" value={space.height || ""} onChange={(event) => updateSpace(space.id, { height: Number(event.target.value) })} placeholder="m" /></td>
                    <td className="table-cell"><input className="table-input" value={space.usageHours} onChange={(event) => updateSpace(space.id, { usageHours: event.target.value })} placeholder="08:00-20:00" /></td>
                    <td className="table-cell"><input className="table-input" value={space.notes} onChange={(event) => updateSpace(space.id, { notes: event.target.value })} placeholder="高峰人流 / 视频会议 / 夜景展示" /></td>
                    <td className="table-cell">
                      <button type="button" aria-label="删除空间" onClick={() => updateProject("spaces", project.spaces.length > 1 ? project.spaces.filter((item) => item.id !== space.id) : [createSpace()])} className="icon-button">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <section id="owner" className="grid gap-5 lg:grid-cols-2">
          <DashboardCard delay={400} className="p-5">
            <label className="block">
              <span className="field-label">业主关注点</span>
              <textarea className="field-textarea" value={project.ownerConcerns} onChange={(event) => updateProject("ownerConcerns", event.target.value)} placeholder="例如：形成城市形象、控制运营成本、满足绿色建筑认证..." />
            </label>
          </DashboardCard>
          <DashboardCard delay={460} glow="violet" className="p-5">
            <label className="block">
              <span className="field-label">当前痛点</span>
              <textarea className="field-textarea" value={project.painPoints} onChange={(event) => updateProject("painPoints", event.target.value)} placeholder="例如：眩光、空间过暗、回路粗放、灯具维护困难、夜景过亮..." />
            </label>
          </DashboardCard>
        </section>

        <div className="sticky bottom-0 z-20 rounded-lg border border-white/10 bg-black/70 p-4 shadow-[0_0_60px_rgba(79,70,229,0.25)] backdrop-blur-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-white/45">本地规则模板分析 / 暂不调用真实外部 API</p>
            <button type="button" onClick={handleAnalyze} disabled={validSpaceCount === 0} className="primary-button disabled:cursor-not-allowed disabled:opacity-45">
              <WandSparkles size={17} />
              开始分析
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-tile">
      <strong className="block text-base text-white">{value}</strong>
      <span>{label}</span>
    </div>
  );
}
