"use client";

import { useState } from "react";
import {
  Cloud,
  Cpu,
  Network,
  ShieldCheck,
  Activity,
  CheckCircle2,
  Server,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

interface LayerInfo {
  id: string;
  name: string;
  nameKr: string;
  icon: typeof Cloud;
  metric: string;
  status: string;
  description: string;
  descriptionKr: string;
  color: string;
}

const LAYERS: LayerInfo[] = [
  {
    id: "edge",
    name: "Cloud Edge Backbone",
    nameKr: "클라우드 엣지 백본",
    icon: Cloud,
    metric: "45+ POPs • <15ms",
    status: "99.999% SLA Operational",
    description: "Distributed Multi-Region Anycast Edge Nodes with autonomous BGP route healing.",
    descriptionKr: "자율 BGP 라우팅 힐링을 갖춘 전 세계 45개 이상 멀티리전 애니캐스트 엣지 노드입니다.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    id: "ai",
    name: "AI & Vector Core",
    nameKr: "AI & 벡터 코어",
    icon: Cpu,
    metric: "12M ev/s • <8ms",
    status: "Active Vector Ingestion",
    description: "Sub-millisecond semantic search, cross-border matching, and automated predictive telemetry.",
    descriptionKr: "마이크로초 시맨틱 검색, 크로스보더 매칭 및 자동화된 예측 텔레메트리를 처리합니다.",
    color: "from-cyan-400 to-teal-400",
  },
  {
    id: "mesh",
    name: "B2B API Mesh Gateway",
    nameKr: "B2B API 메시 게이트웨이",
    icon: Network,
    metric: "2.8B calls/day",
    status: "1,400+ Enterprise Partners",
    description: "Unified GraphQL & gRPC interconnect protocol enabling real-time global trade interoperability.",
    descriptionKr: "실시간 글로벌 무역 상호운용성을 제공하는 통합 GraphQL 및 gRPC 인터커넥트 메시입니다.",
    color: "from-indigo-500 to-purple-400",
  },
  {
    id: "trust",
    name: "Zero-Trust Security Mesh",
    nameKr: "제로트러스트 보안 거버넌스",
    icon: ShieldCheck,
    metric: "SOC 2 • PCI-DSS L1",
    status: "100% End-to-End Cryptography",
    description: "Hardware HSM key isolation, zero-knowledge verification, and continuous policy audit.",
    descriptionKr: "하드웨어 HSM 키 격리, 영지식 증명 검증 및 연속적인 감사 추적 거버넌스를 실행합니다.",
    color: "from-emerald-400 to-cyan-400",
  },
];

const NODES = [
  { city: "Seoul", label: "Global HQ", ping: "8ms", status: "Nominal", top: "34%", left: "78%" },
  { city: "San Jose", label: "US R&D", ping: "14ms", status: "Nominal", top: "38%", left: "20%" },
  { city: "Frankfurt", label: "EU Hub", ping: "22ms", status: "Nominal", top: "30%", left: "50%" },
  { city: "Dubai", label: "MENA Node", ping: "31ms", status: "Nominal", top: "48%", left: "62%" },
];

export function NetworkTopologyMatrix() {
  const [activeLayer, setActiveLayer] = useState<string>("edge");
  const { locale } = useLanguage();

  const currentLayer = LAYERS.find((l) => l.id === activeLayer) || LAYERS[0];
  const IconComponent = currentLayer.icon;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-slate-700/80 bg-obsidian-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">
      {/* Top Controller Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt-500/20 text-cyan-400 border border-cyan-500/30">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                {locale === "ko" ? "글로벌 네트워크 매트릭스" : "Global Network Topology Matrix"}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                ● Live 99.999%
              </span>
            </div>
            <p className="text-sm font-semibold text-white">
              {locale === "ko" ? "실시간 백본 아키텍처 제어반" : "Real-Time Backbone Architecture Telemetry"}
            </p>
          </div>
        </div>

        {/* Global Key Stats Bar */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-300">
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10">
            <Server className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-white font-bold">45</span>
            <span className="text-slate-400">Edge POPs</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 border border-white/10">
            <Zap className="h-3.5 w-3.5 text-cobalt-400" />
            <span className="text-white font-bold">&lt;15ms</span>
            <span className="text-slate-400">Latency</span>
          </div>
        </div>
      </div>

      {/* Layer Navigation Tabs */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {LAYERS.map((layer) => {
          const ItemIcon = layer.icon;
          const isActive = layer.id === activeLayer;
          return (
            <button
              key={layer.id}
              type="button"
              onClick={() => setActiveLayer(layer.id)}
              className={`flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all duration-200 border ${
                isActive
                  ? "bg-white/10 border-cyan-400/50 shadow-md shadow-cyan-500/10 text-white"
                  : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 w-full">
                <ItemIcon className={`h-4 w-4 shrink-0 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span className="text-xs font-bold truncate">
                  {locale === "ko" ? layer.nameKr : layer.name}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                {layer.metric}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Global Network Map Visual */}
      <div className="relative mt-6 h-64 sm:h-72 w-full overflow-hidden rounded-2xl border border-white/10 bg-obsidian-950/80 p-4">
        {/* SVG Mesh Grid Background */}
        <svg
          className="absolute inset-0 h-full w-full stroke-white/5 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern id="mesh-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 32V.5H32" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#mesh-grid)" />
        </svg>

        {/* Global Connection Arc Vectors */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          {/* Seoul to San Jose Arc */}
          <path
            d="M 78% 34% Q 50% 15% 20% 38%"
            stroke="rgba(6, 182, 212, 0.4)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="4 4"
            className="animate-pulse"
          />
          {/* Seoul to Frankfurt Arc */}
          <path
            d="M 78% 34% Q 65% 10% 50% 30%"
            stroke="rgba(37, 99, 235, 0.5)"
            strokeWidth="2"
            fill="none"
          />
          {/* Frankfurt to Dubai Arc */}
          <path
            d="M 50% 30% Q 55% 42% 62% 48%"
            stroke="rgba(99, 102, 241, 0.5)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Dubai to Seoul Arc */}
          <path
            d="M 62% 48% Q 72% 45% 78% 34%"
            stroke="rgba(16, 185, 129, 0.4)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>

        {/* Pulsing Nodes */}
        {NODES.map((node) => (
          <div
            key={node.city}
            className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ top: node.top, left: node.left }}
          >
            <div className="relative flex items-center justify-center">
              <span className="absolute h-8 w-8 rounded-full bg-cyan-400/20 animate-ping duration-1000" />
              <span className="relative flex h-3.5 w-3.5 rounded-full bg-cyan-400 border-2 border-obsidian-950 shadow-lg shadow-cyan-400/50" />
            </div>
            <div className="mt-1 rounded-md bg-obsidian-900/90 border border-white/10 px-2 py-0.5 text-center shadow-lg backdrop-blur-md">
              <span className="block text-[10px] font-bold text-white whitespace-nowrap">
                {node.city}
              </span>
              <span className="block text-[9px] font-mono text-cyan-400 tabular-nums">
                {node.label} • {node.ping}
              </span>
            </div>
          </div>
        ))}

        {/* Active Layer Dynamic Card Overlay */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md rounded-xl border border-white/15 bg-obsidian-900/90 p-3.5 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg bg-gradient-to-r ${currentLayer.color} text-obsidian-950`}>
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-white block">
                {locale === "ko" ? currentLayer.nameKr : currentLayer.name}
              </span>
              <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {currentLayer.status}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed mt-1">
            {locale === "ko" ? currentLayer.descriptionKr : currentLayer.description}
          </p>
        </div>
      </div>
    </div>
  );
}

