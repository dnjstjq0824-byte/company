"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const INQUIRY_TYPES = [
  "Strategic Partnership",
  "Investor Relations (IR)",
  "Media & Press",
  "Enterprise Technology & API",
  "Global Careers",
  "General Corporate Inquiry",
];

const DEPARTMENTS = [
  "Global Partnership & Alliances",
  "Investor Relations (IR)",
  "Corporate Communications & PR",
  "Technology & Architecture Council",
  "Executive Office",
  "Legal & Regulatory Compliance",
];

// Korean display labels (submitted values stay in English).
const INQUIRY_TYPES_KO = [
  "전략적 파트너십",
  "투자자 관계 (IR)",
  "미디어 & 언론",
  "엔터프라이즈 기술 & API",
  "글로벌 채용",
  "일반 기업 문의",
];

const DEPARTMENTS_KO = [
  "글로벌 파트너십 & 제휴",
  "투자자 관계 (IR)",
  "기업 커뮤니케이션 & PR",
  "기술 & 아키텍처 위원회",
  "경영진 사무실",
  "법무 & 규제 준수",
];

const PRIORITIES = [
  { value: "Normal", en: "Normal — Standard Business Review", ko: "일반 — 표준 업무 검토" },
  { value: "High", en: "High — Active Transaction / RFP", ko: "높음 — 진행 중 거래 / RFP" },
  { value: "Urgent", en: "Urgent — Executive / Regulatory Priority", ko: "긴급 — 경영진 / 규제 우선" },
  { value: "Low", en: "Low — General Informational", ko: "낮음 — 일반 정보성" },
];

export function ContactForm({ initialPlatform }: { initialPlatform?: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [department, setDepartment] = useState("Global Partnership & Alliances");
  const [inquiryType, setInquiryType] = useState(
    initialPlatform ? "Strategic Partnership" : "Strategic Partnership"
  );
  const [priority, setPriority] = useState("Normal");
  const [subject, setSubject] = useState(
    initialPlatform ? `Strategic inquiry regarding ${initialPlatform}` : ""
  );
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedMessage, setSubmittedMessage] = useState("");
  const { locale } = useLanguage();

  const validateClient = () => {
    const ko = locale === "ko";
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 2) {
      errors.full_name = ko
        ? "성함을 입력해 주세요 (2자 이상)."
        : "Please enter your full name (at least 2 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errors.email = ko
        ? "유효한 이메일 주소를 입력해 주세요."
        : "Please enter a valid email address.";
    }
    if (!INQUIRY_TYPES.includes(inquiryType)) {
      errors.inquiry_type = ko
        ? "유효한 문의 유형을 선택해 주세요."
        : "Please select a valid inquiry type.";
    }
    if (subject.trim().length < 3) {
      errors.subject = ko
        ? "제목을 입력해 주세요 (3자 이상)."
        : "Please enter a subject (at least 3 characters).";
    }
    if (message.trim().length < 10) {
      errors.message = ko
        ? "상세 내용을 입력해 주세요 (10자 이상)."
        : "Please provide a detailed message (at least 10 characters).";
    }
    if (!privacyConsent) {
      errors.privacy_consent = ko
        ? "제출 전에 개인정보 처리방침에 동의해 주세요."
        : "You must consent to the Privacy Policy before submitting.";
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrorMessage("");
    if (!validateClient()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          company: company.trim(),
          department: department.trim(),
          inquiry_type: inquiryType,
          priority,
          subject: subject.trim(),
          message: message.trim(),
          privacy_consent: privacyConsent,
          website_honeypot: honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.fieldErrors) {
          setFieldErrors(data.fieldErrors);
        }
        setErrorMessage(
          data.error || "Unable to submit your inquiry. Please check the form."
        );
        setSubmitting(false);
        return;
      }

      setSubmittedMessage(
        data.message ||
          "Thank you for contacting Booking Network Global Group. Your inquiry has been received."
      );
      setFullName("");
      setEmail("");
      setCompany("");
      setSubject("");
      setMessage("");
      setPrivacyConsent(false);
      setFieldErrors({});
    } catch {
      setErrorMessage(
        "A network error occurred. Please try again or email contact@bookingnetwork.com directly."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedMessage) {
    return (
      <div className="rounded-3xl border border-emerald-500/20 bg-emerald-50/50 p-8 dark:border-emerald-500/30 dark:bg-emerald-950/20 text-center animate-in fade-in duration-300">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white">
          {locale === "ko" ? "문의가 정상 접수되었습니다" : "Inquiry Successfully Logged"}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
          {submittedMessage}
        </p>
        <button
          type="button"
          onClick={() => setSubmittedMessage("")}
          className="mt-6 rounded-xl bg-cobalt-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cobalt-500 transition-colors"
        >
          {locale === "ko" ? "추가 문의 작성하기" : "Submit Another Inquiry"}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200/90 bg-white p-7 sm:p-10 shadow-sm dark:border-white/10 dark:bg-obsidian-900"
    >
      {/* Honeypot anti-bot hidden field */}
      <input
        type="text"
        name="website_honeypot"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
        {locale === "ko" ? "공식 제휴 및 기업 문의 양식" : "Enterprise Inquiry Submission"}
      </h2>
      <p className="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
        {locale === "ko"
          ? "모든 제출 내용은 암호화되어 해당 거버넌스 부서로 직접 전달됩니다."
          : "All submissions are securely encrypted, timestamped, and routed to the corresponding group division."}
      </p>

      {errorMessage && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 dark:border-rose-500/30 dark:bg-rose-950/30 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label htmlFor="cf-name" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "성함" : "Full Name"} <span className="text-rose-500">*</span>
          </label>
          <input
            id="cf-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={locale === "ko" ? "예: 홍길동" : "e.g. Sarah Jenkins"}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.full_name}</p>
          )}
        </div>

        {/* Corporate Email */}
        <div>
          <label htmlFor="cf-email" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "기업 이메일" : "Corporate Email"} <span className="text-rose-500">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@enterprise.com"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.email}</p>
          )}
        </div>

        {/* Company / Organization */}
        <div>
          <label htmlFor="cf-company" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "기업 / 기관명" : "Company / Organization"}
          </label>
          <input
            id="cf-company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={locale === "ko" ? "예: 에이펙스글로벌시스템즈" : "e.g. Apex Global Systems Ltd."}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
        </div>

        {/* Routing Department */}
        <div>
          <label htmlFor="cf-department" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "담당 그룹 부서" : "Target Group Department"}
          </label>
          <select
            id="cf-department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            {DEPARTMENTS.map((dept, i) => (
              <option key={dept} value={dept}>
                {locale === "ko" ? DEPARTMENTS_KO[i] : dept}
              </option>
            ))}
          </select>
        </div>

        {/* Inquiry Classification */}
        <div>
          <label htmlFor="cf-inquiry-type" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "문의 분류" : "Inquiry Category"} <span className="text-rose-500">*</span>
          </label>
          <select
            id="cf-inquiry-type"
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            {INQUIRY_TYPES.map((type, i) => (
              <option key={type} value={type}>
                {locale === "ko" ? INQUIRY_TYPES_KO[i] : type}
              </option>
            ))}
          </select>
          {fieldErrors.inquiry_type && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.inquiry_type}</p>
          )}
        </div>

        {/* Priority Tier */}
        <div>
          <label htmlFor="cf-priority" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "문의 우선순위" : "Engagement Priority"}
          </label>
          <select
            id="cf-priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            {PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>
                {locale === "ko" ? p.ko : p.en}
              </option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div className="sm:col-span-2">
          <label htmlFor="cf-subject" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "제목" : "Subject"} <span className="text-rose-500">*</span>
          </label>
          <input
            id="cf-subject"
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={locale === "ko" ? "제안하는 협력 또는 문의 요약..." : "Summary of proposed collaboration or inquiry..."}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
          {fieldErrors.subject && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Detailed Message */}
        <div className="sm:col-span-2">
          <label htmlFor="cf-message" className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            {locale === "ko" ? "상세 내용" : "Message Body"} <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="cf-message"
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={locale === "ko" ? "범위, 요구사항, 기관 배경 및 일정을 상세히 적어주세요..." : "Please detail your scope, requirements, organization background, and timeline..."}
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white leading-relaxed"
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.message}</p>
          )}
        </div>

        {/* Privacy Consent Checkbox */}
        <div className="sm:col-span-2">
          <label htmlFor="cf-consent" className="flex items-start gap-3 cursor-pointer">
            <input
              id="cf-consent"
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cobalt-600 focus:ring-cobalt-500 dark:border-white/20 dark:bg-obsidian-950"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {locale === "ko" ? (
                <>
                  제출한 기업 데이터가{" "}
                  <Link href="/privacy" className="text-cobalt-600 dark:text-cyan-400 underline font-semibold" target="_blank">
                    개인정보 처리방침 및 데이터 거버넌스 헌장
                  </Link>
                  에 따라 처리되는 것에 동의합니다. 문의 정보를 외부 영리 단체에 판매하거나 이전하지 않습니다.
                </>
              ) : (
                <>
                  I consent to Booking Network Global Group processing the submitted corporate data in accordance with the{" "}
                  <Link href="/privacy" className="text-cobalt-600 dark:text-cyan-400 underline font-semibold" target="_blank">
                    Privacy Policy & Data Governance Charter
                  </Link>
                  . We do not sell or transfer inquiry information to external commercial parties.
                </>
              )}
            </span>
          </label>
          {fieldErrors.privacy_consent && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.privacy_consent}</p>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-2xl bg-cobalt-600 px-7 py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-cobalt-600/25 hover:bg-cobalt-500 disabled:opacity-50 transition-all hover:scale-[1.02]"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{locale === "ko" ? "암호화 전송 중..." : "Transmitting Encrypted Payload..."}</span>
            </>
          ) : (
            <>
              <span>{locale === "ko" ? "문의 접수하기" : "Transmit Strategic Inquiry"}</span>
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
