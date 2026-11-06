"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "ko";

interface Translations {
  nav: {
    home: string;
    overview: string;
    divisions: string;
    network: string;
    newsroom: string;
    contact: string;
    admin: string;
  };
  filters: {
    all: string;
    pressRelease: string;
    irGovernance: string;
    technology: string;
    globalNotice: string;
    allDivisions: string;
    groupCoreInfra: string;
    groupAiData: string;
    groupB2bApi: string;
    groupFintech: string;
    groupIncubation: string;
    groupEsg: string;
    allStatuses: string;
    statusCoreArch: string;
    statusLive: string;
    statusExpanding: string;
    statusRnd: string;
    statusComingSoon: string;
    statusInDev: string;
    statusUnavailable: string;
  };
  cookie: {
    title: string;
    lead: string;
    privacyPolicy: string;
    tail: string;
    essentialOnly: string;
    acceptAll: string;
  };
  footer: {
    backboneStatus: string;
  };
  brand: {
    groupName: string;
    badge: string;
    tagline: string;
  };
  actions: {
    exploreDivisions: string;
    contactIR: string;
    readMore: string;
    viewAll: string;
    backToNewsroom: string;
    backToDivisions: string;
    initiateInquiry: string;
    search: string;
  };
  common: {
    featured: string;
    publishedOn: string;
    category: string;
    status: string;
    allCategories: string;
    globalBackbone: string;
    architectureBlueprint: string;
    coreDivisionsHeading: string;
    coreDivisionsSubtitle: string;
    governanceHeading: string;
    latestNewsHeading: string;
    latestNewsSubtitle: string;
    metricsEdge: string;
    metricsAvailability: string;
    metricsLatency: string;
    metricsZTA: string;
    footerCopyright: string;
  };
}

const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      home: "Home",
      overview: "Group Overview",
      divisions: "Business & Technology",
      network: "Global Network",
      newsroom: "Newsroom & IR",
      contact: "Partnership & Contact",
      admin: "Admin",
    },
    filters: {
      all: "All",
      pressRelease: "Press Release",
      irGovernance: "IR & Governance",
      technology: "Technology",
      globalNotice: "Global Notice",
      allDivisions: "All Divisions",
      groupCoreInfra: "Core Infrastructure",
      groupAiData: "AI & Big Data",
      groupB2bApi: "B2B Platform & API",
      groupFintech: "FinTech & Cybersecurity",
      groupIncubation: "Platform Incubation",
      groupEsg: "ESG & Governance",
      allStatuses: "All Operational Statuses",
      statusCoreArch: "Core Architecture",
      statusLive: "Live",
      statusExpanding: "Expanding",
      statusRnd: "R&D Phase",
      statusComingSoon: "Coming Soon",
      statusInDev: "In Development",
      statusUnavailable: "Temporarily Unavailable",
    },
    cookie: {
      title: "Privacy & Cookie Preferences",
      lead: "Booking Network Global Group uses strictly necessary technical storage to remember your display and privacy preferences. Non-essential cookies remain disabled unless you explicitly opt in. Read our",
      privacyPolicy: "Privacy Policy",
      tail: "for details.",
      essentialOnly: "Essential Only",
      acceptAll: "Accept All",
    },
    footer: {
      backboneStatus: "Backbone Status: 99.999% SLA Operational",
    },
    brand: {
      groupName: "Booking Network Global Group",
      badge: "GLOBAL IT PLATFORM GROUP",
      tagline: "Architecting the Global Digital Backbone. Connecting Next-Generation Platforms.",
    },
    actions: {
      exploreDivisions: "Explore Core Divisions",
      contactIR: "Global Partnerships & IR",
      readMore: "Explore Division",
      viewAll: "View All Publications",
      backToNewsroom: "← Back to Newsroom & IR",
      backToDivisions: "← Back to All Divisions",
      initiateInquiry: "Initiate Strategic Inquiry",
      search: "Search...",
    },
    common: {
      featured: "Featured Release",
      publishedOn: "Published",
      category: "Category",
      status: "Operational Status",
      allCategories: "All Categories",
      globalBackbone: "Global Network Topology",
      architectureBlueprint: "Enterprise Architecture Blueprint",
      coreDivisionsHeading: "6 Core Business & Technology Divisions",
      coreDivisionsSubtitle:
        "Engineered for sovereign operational resilience, sub-millisecond edge latency, and zero-trust data governance.",
      governanceHeading: "Institutional Governance & Strategic Mandate",
      latestNewsHeading: "Latest Group Newsroom & IR Highlights",
      latestNewsSubtitle: "Official press announcements, institutional briefings, and technological whitepapers.",
      metricsEdge: "45+ Edge Regions",
      metricsAvailability: "99.999% Enterprise SLA",
      metricsLatency: "<15ms Global Latency",
      metricsZTA: "100% Zero-Trust Mesh",
      footerCopyright: `© ${new Date().getFullYear()} Booking Network Global Group. All rights reserved.`,
    },
  },
  ko: {
    nav: {
      home: "홈",
      overview: "그룹 소개",
      divisions: "핵심 사업·기술",
      network: "글로벌 네트워크",
      newsroom: "뉴스룸 & IR",
      contact: "제휴 & 문의",
      admin: "관리자",
    },
    filters: {
      all: "전체 보기",
      pressRelease: "보도자료",
      irGovernance: "IR & 거버넌스",
      technology: "기술",
      globalNotice: "글로벌 공지",
      allDivisions: "전체 부문",
      groupCoreInfra: "핵심 인프라",
      groupAiData: "AI & 빅데이터",
      groupB2bApi: "B2B 플랫폼 & API",
      groupFintech: "핀테크 & 사이버보안",
      groupIncubation: "플랫폼 인큐베이션",
      groupEsg: "ESG & 거버넌스",
      allStatuses: "전체 운영 상태",
      statusCoreArch: "핵심 아키텍처",
      statusLive: "운영 중",
      statusExpanding: "확장 중",
      statusRnd: "R&D 단계",
      statusComingSoon: "출시 예정",
      statusInDev: "개발 중",
      statusUnavailable: "일시 중단",
    },
    cookie: {
      title: "개인정보 & 쿠키 설정",
      lead: "부킹네트워크글로벌그룹은 표시 및 개인정보 설정을 기억하기 위해 필수 기술 저장소만 사용합니다. 명시적으로 동의하지 않는 한 비필수 쿠키는 비활성화됩니다. 자세한 내용은",
      privacyPolicy: "개인정보 처리방침",
      tail: "을 확인하세요.",
      essentialOnly: "필수만 허용",
      acceptAll: "전체 허용",
    },
    footer: {
      backboneStatus: "백본 상태: 99.999% SLA 정상 운영 중",
    },
    brand: {
      groupName: "부킹네트워크글로벌그룹",
      badge: "글로벌 IT 플랫폼 그룹",
      tagline: "글로벌 디지털 백본을 설계하고, 차세대 플랫폼 생태계를 연결합니다.",
    },
    actions: {
      exploreDivisions: "핵심 기술 부문 보기",
      contactIR: "글로벌 제휴 & IR 문의",
      readMore: "상세 아키텍처 보기",
      viewAll: "전체 공시·보도자료 보기",
      backToNewsroom: "← 뉴스룸 & IR 목록으로",
      backToDivisions: "← 전체 기술 부문으로",
      initiateInquiry: "전략적 제휴 문의하기",
      search: "검색...",
    },
    common: {
      featured: "주요 공식 발표",
      publishedOn: "발행일",
      category: "분야",
      status: "운영 상태",
      allCategories: "전체 카테고리",
      globalBackbone: "글로벌 네트워크 토폴로지",
      architectureBlueprint: "엔터프라이즈 아키텍처 블루프린트",
      coreDivisionsHeading: "6대 글로벌 핵심 사업·기술 부문",
      coreDivisionsSubtitle:
        "초저지연 글로벌 엣지, 제로트러스트 보안 거버넌스 및 캐리어급 가용성 기준을 충족하는 인프라 생태계입니다.",
      governanceHeading: "그룹 거버넌스 및 전략적 지주 체계",
      latestNewsHeading: "그룹 뉴스룸 & IR 공식 발표",
      latestNewsSubtitle: "공식 보도자료, 투자자 브리핑 및 기술 백서 최신 소식입니다.",
      metricsEdge: "45개 이상 글로벌 권역",
      metricsAvailability: "99.999% 캐리어급 가용성",
      metricsLatency: "15ms 미만 글로벌 지연율",
      metricsZTA: "100% 제로트러스트 적용",
      footerCopyright: `© ${new Date().getFullYear()} 부킹네트워크글로벌그룹 (Booking Network Global Group). All rights reserved.`,
    },
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  t: translations.en,
});

export function LanguageProvider({
  children,
  initialLocale = "en",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bng_locale") as Locale;
      if (saved === "en" || saved === "ko") {
        setLocaleState(saved);
        return;
      }
      const match = document.cookie.match(/bng_locale=([^;]+)/);
      if (match && (match[1] === "en" || match[1] === "ko")) {
        setLocaleState(match[1] as Locale);
      }
    } catch {
      // fallback
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("bng_locale", newLocale);
      document.cookie = `bng_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

