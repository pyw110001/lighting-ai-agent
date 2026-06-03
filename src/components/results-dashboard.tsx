"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import {
  Clipboard,
  Download,
  FileText,
  Gauge,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { ANALYSIS_STORAGE_KEY } from "@/lib/agents/analyze-project";
import { ThreeBeamBackground } from "@/components/three-beam-background";
import { DashboardCard } from "@/components/ui/dashboard-card";
import type { AnalysisResult, RiskSeverity } from "@/lib/types";

const severityClass: Record<RiskSeverity, string> = {
  高: "border-red-400/35 bg-red-500/12 text-red-200 shadow-[0_0_22px_rgba(248,113,113,0.18)]",
  中: "border-amber-300/35 bg-amber-400/12 text-amber-100 shadow-[0_0_22px_rgba(251,191,36,0.16)]",
  低: "border-white/12 bg-white/[0.04] text-white/55",
};

export function ResultsDashboard() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [copyState, setCopyState] = useState("复制报告");

  useEffect(() => {
    const loadTimer = window.setTimeout(() => {
      const raw = localStorage.getItem(ANALYSIS_STORAGE_KEY);

      if (raw) {
        setAnalysis(JSON.parse(raw) as AnalysisResult);
      }
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, []);

  async function handleCopy() {
    if (!analysis) return;

    await navigator.clipboard.writeText(analysis.report.markdown);
    setCopyState("已复制");
    window.setTimeout(() => setCopyState("复制报告"), 1600);
  }

  function handleDownload() {
    if (!analysis) return;

    const blob = new Blob([JSON.stringify(analysis, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${analysis.project.projectName}-lighting-analysis.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (!analysis) {
    return (
      <main className="luma-page flex min-h-screen items-center justify-center overflow-hidden px-4 text-white">
        <ThreeBeamBackground />
        <DashboardCard className="relative z-10 max-w-lg p-8 text-center" delay={80}>
          <FileText className="mx-auto text-indigo-200" size={34} />
          <h1 className="mt-4 text-xl font-semibold text-white">暂无分析结果</h1>
          <p className="mt-2 text-sm leading-6 text-white/50">
            请先回到项目输入页，录入空间清单或选择示例项目后生成分析。
          </p>
          <Link href="/" className="primary-button mt-6 inline-flex">
            返回输入页
          </Link>
        </DashboardCard>
      </main>
    );
  }

  const { project, strategy, spaces, risks, report } = analysis;
  const highRiskCount = risks.filter((risk) => risk.severity === "高").length;

  return (
    <main className="luma-page min-h-screen overflow-hidden text-white">
      <ThreeBeamBackground />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
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
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="secondary-button">
              <RefreshCw size={16} />
              重新输入
            </Link>
            <button type="button" onClick={handleCopy} className="secondary-button">
              <Clipboard size={16} />
              {copyState}
            </button>
            <button type="button" onClick={handleDownload} className="primary-button">
              <Download size={16} />
              下载 JSON
            </button>
          </div>
        </header>

        <section className="grid min-h-[420px] items-end gap-8 py-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="animate-rise" style={{ "--card-delay": "90ms" } as CSSProperties}>
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-indigo-200/75">
              <Sparkles size={15} />
              AI Lighting Strategy Report
            </p>
            <h1 className="mt-4 max-w-3xl text-5xl font-semibold leading-tight text-white/90 sm:text-6xl">
              {project.projectName}
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/50">
              生成时间：{new Date(analysis.generatedAt).toLocaleString("zh-CN")}。以下内容为规则模板生成的 MVP 分析，可用于前期讨论和业主汇报初稿。
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricCard label="建筑类型" value={project.buildingType} delay={150} />
            <MetricCard label="项目阶段" value={project.projectStage} delay={210} />
            <MetricCard label="项目面积" value={`${project.projectArea.toLocaleString()}㎡`} delay={270} />
            <MetricCard label="高风险项" value={`${highRiskCount} 项`} delay={330} />
          </div>
        </section>

        <section className="dashboard-grid">
          <DashboardCard delay={380} className="p-6 lg:col-span-7">
            <h2 className="section-title">总体照明策略</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{strategy.concept}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <StrategyBlock title="日光与电光整合" content={strategy.daylightIntegration} />
              <StrategyBlock title="色温与显色策略" content={strategy.colorAndCriStrategy} />
              <StrategyBlock title="节能策略" content={strategy.energySavingStrategy} />
              <StrategyBlock title="健康照明策略" content={strategy.healthyLightingStrategy} />
            </div>
          </DashboardCard>
          <DashboardCard delay={440} glow="violet" className="p-6 lg:col-span-5">
            <h2 className="section-title">智能控制策略</h2>
            <p className="mt-4 text-sm leading-7 text-white/62">{strategy.smartControlStrategy}</p>
            <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
              {["日常", "迎宾/运营", "会议/活动", "清洁", "深夜节能"].map((scene) => (
                <div key={scene} className="scan-row flex items-center justify-between border-b border-white/8 px-3 py-3 last:border-b-0">
                  <span className="text-sm font-medium text-white/70">{scene}</span>
                  <span className="text-xs text-indigo-200">建议预设</span>
                </div>
              ))}
            </div>
          </DashboardCard>
        </section>

        <DashboardCard delay={500} className="mt-6 overflow-visible">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <h2 className="section-title">空间分区指标表</h2>
            <Gauge className="text-indigo-200/60" size={20} />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse text-sm">
              <thead className="bg-white/[0.03] text-left text-xs text-white/38">
                <tr>
                  <th className="table-head">空间</th>
                  <th className="table-head">匹配类型</th>
                  <th className="table-head">面积</th>
                  <th className="table-head">建议照度</th>
                  <th className="table-head">色温</th>
                  <th className="table-head">显色</th>
                  <th className="table-head">推荐灯具</th>
                  <th className="table-head">控制策略</th>
                </tr>
              </thead>
              <tbody>
                {spaces.map((space) => (
                  <tr key={space.id} className="scan-row border-t border-white/8">
                    <td className="table-cell font-medium text-white">{space.name}</td>
                    <td className="table-cell">{space.standardType}</td>
                    <td className="table-cell">{space.area.toLocaleString()}㎡</td>
                    <td className="table-cell">{space.recommendedLux}</td>
                    <td className="table-cell">{space.colorTemperature}</td>
                    <td className="table-cell">{space.cri}</td>
                    <td className="table-cell">{space.fixture}</td>
                    <td className="table-cell">{space.controlStrategy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        <section className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          <DashboardCard delay={560} className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="section-title">风险清单</h2>
              <ShieldAlert className="text-red-200/55" size={20} />
            </div>
            <div className="mt-4 grid gap-3">
              {risks.slice(0, 10).map((risk) => (
                <div key={risk.id} className="risk-card">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-md border px-2 py-1 text-xs font-medium ${severityClass[risk.severity]}`}>
                      {risk.severity}风险
                    </span>
                    <span className="text-sm font-semibold text-white">{risk.spaceName}</span>
                    <span className="text-xs text-white/42">{risk.riskType}</span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/55">{risk.description}</p>
                  <p className="mt-2 text-sm leading-6 text-indigo-100/80">{risk.recommendation}</p>
                </div>
              ))}
            </div>
          </DashboardCard>

          <DashboardCard delay={620} glow="violet" className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <h2 className="section-title">业主汇报 Markdown 预览</h2>
              <button type="button" onClick={handleCopy} className="secondary-button">
                <Clipboard size={16} />
                复制报告
              </button>
            </div>
            <pre className="max-h-[720px] overflow-auto whitespace-pre-wrap p-6 text-sm leading-7 text-white/58">
              {report.markdown}
            </pre>
          </DashboardCard>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <DashboardCard delay={delay} className="metric-card p-5">
      <p className="text-xs text-white/42">{label}</p>
      <p className="metric-value mt-3 text-2xl font-semibold text-white">{value}</p>
    </DashboardCard>
  );
}

function StrategyBlock({ title, content }: { title: string; content: string }) {
  return (
    <div className="module-tile">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-white/52">{content}</p>
    </div>
  );
}
