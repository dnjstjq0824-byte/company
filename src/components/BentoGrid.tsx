"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Globe2,
  Cpu,
  Layers,
  Zap,
  ArrowUpRight,
  Boxes,
  Scale,
  Lock,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n";

export function BentoGrid() {
  const { locale } = useLanguage();

  return (
    <section className="py-20 bg-slate-50/60 dark:bg-obsidian-900/40 border-y border-slate-200/80 dark:border-white/5 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cobalt-500/20 bg-cobalt-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-cobalt-600 dark:text-cyan-400">
            {locale === "ko" ? "그룹 정체성 & 전략적 지주 거버넌스" : "Group Identity & Institutional Governance"}
          </div>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            {locale === "ko"
              ? "글로벌 IT 플랫폼 지주 및 기술 표준화"
              : "Global IT Platform Holding & Architectural Standardization"}
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {locale === "ko"
              ? "부킹네트워크글로벌그룹은 단순 개별 앱 서비스가 아닌, 전 세계 디지털 인프라와 엔터프라이즈 플랫폼 생태계를 설계하고 엄격히 거버넌스하는 글로벌 기술 지주사입니다."
              : "Booking Network Global Group architects, governs, and scales the mission-critical digital backbones powering next-generation platform ecosystems, institutional cross-border trade, and resilient multi-region cloud infrastructures."}
          </p>
        </div>

        {/* Asymmetric Bento Grid: Row 1 (7:5) */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Bento Card 1 (7 cols): Institutional Tech Holding & Multi-Sector Scalability */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-obsidian-900 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cobalt-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-500 pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cobalt-50 text-cobalt-600 dark:bg-white/10 dark:text-cyan-400">
                <Globe2 className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono font-bold text-cobalt-600 dark:text-cyan-400 uppercase tracking-wider">
                Holding Blueprint
              </span>
            </div>

            <h3 className="mt-6 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {locale === "ko"
                ? "전략적 기술 지주 체계 및 크로스보더 확장성"
                : "Strategic Technology Holding & Cross-Border Scaling"}
            </h3>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko"
                ? "그룹 산하 6대 사업·기술 부문에 표준화된 아키텍처 프레임워크와 자본 스튜어드십을 제공하여, 각 부문이 독립적인 도메인 전문성을 유지하면서도 그룹 공통의 99.999% 가용성 및 제로트러스트 보안 체계를 즉시 누릴 수 있도록 보장합니다."
                : "Providing centralized architectural governance, capital allocation, and zero-trust security standards across our six core technical divisions, allowing specialized vertical platforms to scale globally while inheriting carrier-grade infrastructure resilience."}
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-slate-100 dark:border-white/10">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white block tabular-nums">
                  6
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {locale === "ko" ? "핵심 기술 부문" : "Core Tech Pillars"}
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-cobalt-600 dark:text-cyan-400 block tabular-nums">
                  45+
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {locale === "ko" ? "글로벌 엣지 권역" : "Edge POP Regions"}
                </span>
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-500 block tabular-nums">
                  99.999%
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {locale === "ko" ? "엔터프라이즈 SLA" : "Enterprise SLA"}
                </span>
              </div>
            </div>
          </div>

          {/* Bento Card 2 (5 cols): Sovereign Zero-Trust Security Framework */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-obsidian-900 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-white/10 dark:text-indigo-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Security Core
              </span>
            </div>

            <h3 className="mt-6 text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              {locale === "ko"
                ? "제로트러스트 거버넌스 및 글로벌 규제 준수"
                : "Zero-Trust Architecture & Sovereign Compliance"}
            </h3>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko"
                ? "모든 내부 마이크로서비스와 외부 API 메시 사이에 하드웨어 기반 HSM 암호화와 영지식(Zero-Knowledge) 검증 체계를 적용하여 GDPR, CCPA, PCI-DSS L1을 상시 완벽 충족합니다."
                : "Enforcing hardware HSM key isolation, continuous cryptographic verification, and multi-jurisdictional compliance protocols across all transactional telemetry."}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                SOC 2 Type II
              </span>
              <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                PCI-DSS Level 1
              </span>
              <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                ISO 27001 / 27701
              </span>
              <span className="rounded-lg bg-slate-100 dark:bg-white/5 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                GDPR & PIPA
              </span>
            </div>
          </div>
        </div>

        {/* Bento Grid: Row 2 (4:4:4) */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 3: AI & High-Throughput Stream Intelligence */}
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-obsidian-900 p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-white/10 dark:text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {locale === "ko" ? "실시간 AI 데이터 인텔리전스" : "Real-Time AI Stream Intelligence"}
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko"
                ? "초당 1,200만 건 이상의 이벤트를 스트리밍 처리하며 8ms 미만 시맨틱 벡터 검색과 예측 분석 엔진을 가동합니다."
                : "Ingesting over 12 million events per second with sub-8ms semantic vector retrieval and predictive telemetry."}
            </p>
          </div>

          {/* Card 4: Modular Platform Incubation & Joint Ventures */}
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-obsidian-900 p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-white/10 dark:text-purple-400">
              <Boxes className="h-5 w-5" />
            </div>
            <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {locale === "ko" ? "모듈형 플랫폼 인큐베이션 & JV" : "Modular Platform Incubation & JV"}
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko"
                ? "검증된 엔터프라이즈 디자인 시스템과 마이크로서비스 프레임워크를 기반으로 파트너십 JV 구축 기간을 65% 단축합니다."
                : "Accelerating global joint-venture deployments by 65% utilizing standardized enterprise microservices and design systems."}
            </p>
          </div>

          {/* Card 5: Sustainable ESG & Carbon-Aware Compute */}
          <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-white/10 dark:bg-obsidian-900 p-7 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-white/10 dark:text-emerald-400">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="mt-5 text-lg font-bold text-slate-900 dark:text-white">
              {locale === "ko" ? "탄소 최적화 컴퓨팅 & 기술 윤리" : "Carbon-Aware Computing & ESG"}
            </h4>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko"
                ? "신재생 에너지 비중 88%의 데이터센터 배치와 독립된 AI 윤리위원회의 알고리즘 투명성 감독을 완벽히 이행합니다."
                : "Operating on 88% renewable energy topologies with independent board-level algorithmic ethics oversight."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

