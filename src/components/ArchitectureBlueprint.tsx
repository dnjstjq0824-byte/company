"use client";

import {
  Globe,
  Cloud,
  Cpu,
  Network,
  ShieldCheck,
  Server,
  Layers,
  ArrowDown,
  Building2,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function ArchitectureBlueprint() {
  const { locale } = useLanguage();

  return (
    <section className="py-20 bg-obsidian-950 text-white relative overflow-hidden border-t border-white/10">
      {/* Background radial gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cobalt-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
            {locale === "ko" ? "글로벌 아키텍처 블루프린트" : "Enterprise Architecture Blueprint"}
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {locale === "ko"
              ? "계층형 엔터프라이즈 디지털 백본 구조"
              : "Layered Global Digital Backbone Topology"}
          </h2>
          <p className="mt-3 text-base text-slate-400 leading-relaxed">
            {locale === "ko"
              ? "전략적 지주 거버넌스에서 최하단 글로벌 엣지 리전까지 무결하게 연결되는 4계층 엔터프라이즈 아키텍처입니다."
              : "A four-tiered sovereign architecture cascading from strategic holding governance down to distributed edge regions worldwide."}
          </p>
        </div>

        {/* Blueprint Flow Visualization */}
        <div className="mt-14 max-w-5xl mx-auto space-y-5">
          {/* Level 1: Global HQ & Tech Holding */}
          <div className="rounded-3xl border-2 border-cobalt-500/50 bg-gradient-to-r from-obsidian-900 via-obsidian-850 to-obsidian-900 p-6 sm:p-8 shadow-xl shadow-cobalt-500/10 text-center relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cobalt-600 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Tier 01 • Strategic Tech Holding
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cobalt-500/20 text-cyan-400 border border-cyan-500/30">
                  <Building2 className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-extrabold text-white">
                    Booking Network Global Group
                  </h3>
                  <p className="text-xs text-slate-400">
                    {locale === "ko"
                      ? "글로벌 본사 & 전략적 기술 지주 (Global HQ & Institutional Holding)"
                      : "Global HQ, Strategic Holding Governance, Capital Allocation & IP Sovereignty"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 border border-white/10">
                  Executive Committee
                </span>
                <span className="rounded-xl bg-white/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 border border-white/10">
                  Tech Advisory Board
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-cyan-400 border border-white/15">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* Level 2: Core Cloud, Edge & AI Layer */}
          <div className="rounded-3xl border border-white/15 bg-obsidian-900/80 p-6 sm:p-7 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-800 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400 border border-white/10">
              Tier 02 • Core Infrastructure & Data Intelligence
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cobalt-500/20 text-cyan-400">
                  <Cloud className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Global Cloud & Distributed Infrastructure</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Multi-Region Anycast Edge POPs • SDN Mesh • 99.999% SLA Carrier Core
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI & Data Intelligence Engine</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    12M+ Events/sec Streaming ETL • Sub-8ms Vector Search • Predictive Telemetry
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-cyan-400 border border-white/15">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* Level 3: B2B API Mesh & Security Trust Mesh */}
          <div className="rounded-3xl border border-white/15 bg-obsidian-900/80 p-6 sm:p-7 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-800 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400 border border-white/10">
              Tier 03 • Interoperability & Zero-Trust Governance
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400">
                  <Network className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Global B2B Network & API Mesh</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    2.8B+ Daily Calls • Unified GraphQL/gRPC Gateway • 1,400+ Enterprise Connects
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Enterprise FinTech & Trust Architecture</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Zero-Trust Cryptographic Ledger • PCI-DSS L1 • SOC 2 Type II Certified
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-white/10 text-cyan-400 border border-white/15">
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>

          {/* Level 4: Regional Operations Hubs & Ecosystem Scale */}
          <div className="rounded-3xl border border-white/15 bg-obsidian-900/90 p-6 sm:p-7 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-slate-800 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-white/10">
              Tier 04 • Global Regional Operations & Edge Ingress
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="block text-xs font-extrabold text-white">Seoul, KR</span>
                <span className="block text-[11px] text-cyan-400 mt-0.5">APAC Global HQ</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="block text-xs font-extrabold text-white">San Jose, US</span>
                <span className="block text-[11px] text-cyan-400 mt-0.5">North America R&D</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="block text-xs font-extrabold text-white">Frankfurt, DE</span>
                <span className="block text-[11px] text-cyan-400 mt-0.5">Europe Regulatory Hub</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                <span className="block text-xs font-extrabold text-white">Dubai, UAE</span>
                <span className="block text-[11px] text-cyan-400 mt-0.5">MENA Digital Node</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

