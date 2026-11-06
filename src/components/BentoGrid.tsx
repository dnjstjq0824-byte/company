"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import { SectionHeader } from "./SectionHeader";

export function BentoGrid() {
  const { locale } = useLanguage();
  const ko = locale === "ko";

  const mandates = [
    {
      no: "01",
      title: ko ? "전략적 기술 지주 체계" : "Strategic Technology Holding",
      body: ko
        ? "그룹 산하 6대 사업·기술 부문에 표준화된 아키텍처 프레임워크와 자본 스튜어드십을 제공하여, 각 부문이 독립적인 도메인 전문성을 유지하면서도 그룹 공통의 99.999% 가용성 및 제로트러스트 보안 체계를 즉시 누릴 수 있도록 보장합니다."
        : "Providing centralized architectural governance, capital allocation, and zero-trust security standards across our six core technical divisions, allowing specialized vertical platforms to scale globally while inheriting carrier-grade infrastructure resilience.",
    },
    {
      no: "02",
      title: ko ? "제로트러스트 거버넌스" : "Zero-Trust Governance",
      body: ko
        ? "모든 내부 마이크로서비스와 외부 API 메시 사이에 하드웨어 기반 HSM 암호화와 영지식 검증 체계를 적용하여 GDPR, CCPA, PCI-DSS L1을 상시 충족합니다."
        : "Enforcing hardware HSM key isolation, continuous cryptographic verification, and multi-jurisdictional compliance protocols across all transactional telemetry.",
      tags: ["SOC 2 Type II", "PCI-DSS Level 1", "ISO 27001 / 27701", "GDPR & PIPA"],
    },
    {
      no: "03",
      title: ko ? "실시간 AI 데이터 인텔리전스" : "Real-Time AI Stream Intelligence",
      body: ko
        ? "초당 1,200만 건 이상의 이벤트를 스트리밍 처리하며 8ms 미만 시맨틱 벡터 검색과 예측 분석 엔진을 가동합니다."
        : "Ingesting over 12 million events per second with sub-8ms semantic vector retrieval and predictive telemetry.",
    },
    {
      no: "04",
      title: ko ? "모듈형 플랫폼 인큐베이션" : "Modular Platform Incubation",
      body: ko
        ? "검증된 엔터프라이즈 디자인 시스템과 마이크로서비스 프레임워크를 기반으로 파트너십 JV 구축 기간을 65% 단축합니다."
        : "Accelerating global joint-venture deployments by 65% utilizing standardized enterprise microservices and design systems.",
    },
    {
      no: "05",
      title: ko ? "탄소 최적화 컴퓨팅" : "Carbon-Aware Computing",
      body: ko
        ? "신재생 에너지 비중 88%의 데이터센터 배치와 독립된 AI 윤리위원회의 알고리즘 투명성 감독을 이행합니다."
        : "Operating on 88% renewable energy topologies with independent board-level algorithmic ethics oversight.",
    },
  ];

  const stats = [
    { value: "6", label: ko ? "핵심 기술 부문" : "Core Tech Pillars" },
    { value: "45+", label: ko ? "글로벌 엣지 권역" : "Edge POP Regions" },
    { value: "99.999%", label: ko ? "엔터프라이즈 SLA" : "Enterprise SLA" },
  ];

  return (
    <section className="border-y border-slate-200/80 bg-slate-50/60 py-20 transition-colors dark:border-white/5 dark:bg-obsidian-900/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          index="01"
          eyebrow={ko ? "그룹 정체성" : "Group Identity"}
          title={
            ko
              ? "글로벌 IT 플랫폼 지주 및 기술 표준화"
              : "Global IT Platform Holding & Architectural Standardization"
          }
          description={
            ko
              ? "부킹네트워크글로벌그룹은 단순 개별 앱 서비스가 아닌, 전 세계 디지털 인프라와 엔터프라이즈 플랫폼 생태계를 설계하고 엄격히 거버넌스하는 글로벌 기술 지주사입니다."
              : "Booking Network Global Group architects, governs, and scales the mission-critical digital backbones powering next-generation platform ecosystems, institutional cross-border trade, and resilient multi-region cloud infrastructures."
          }
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {ko ? "그룹 원장" : "Group Ledger"}
              </p>
              <dl className="mt-4 border-t border-slate-200 dark:border-white/10">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-baseline justify-between gap-4 border-b border-slate-200 py-4 dark:border-white/10"
                  >
                    <dt className="text-xs text-slate-500 dark:text-slate-400">
                      {stat.label}
                    </dt>
                    <dd className="font-mono text-2xl font-extrabold tabular-nums text-slate-900 dark:text-white">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-cobalt-600 hover:text-cobalt-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              >
                <span>{ko ? "거버넌스 헌장 읽기" : "Read the governance charter"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <ol className="lg:col-span-8">
            {mandates.map((item) => (
              <li
                key={item.no}
                className="grid grid-cols-[auto_1fr] gap-5 border-t border-slate-200 py-7 first:border-t-0 first:pt-0 dark:border-white/10 sm:gap-8"
              >
                <span className="font-mono text-sm font-bold tabular-nums text-cobalt-600 dark:text-cyan-400">
                  {item.no}
                </span>
                <div>
                  <h3 className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.body}
                  </p>
                  {item.tags && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold text-slate-700 dark:bg-white/5 dark:text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
