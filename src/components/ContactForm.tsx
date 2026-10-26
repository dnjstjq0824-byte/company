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
  const { locale, t } = useLanguage();

  const validateClient = () => {
    const errors: Record<string, string> = {};
    if (fullName.trim().length < 2) {
      errors.full_name = "Please enter your full name (at least 2 characters).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
    if (!INQUIRY_TYPES.includes(inquiryType)) {
      errors.inquiry_type = "Please select a valid inquiry type.";
    }
    if (subject.trim().length < 3) {
      errors.subject = "Please enter a subject (at least 3 characters).";
    }
    if (message.trim().length < 10) {
      errors.message =
        "Please provide a detailed message (at least 10 characters).";
    }
    if (!privacyConsent) {
      errors.privacy_consent =
        "You must consent to the Privacy Policy before submitting.";
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
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Sarah Jenkins"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.full_name}</p>
          )}
        </div>

        {/* Corporate Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Corporate Email <span className="text-rose-500">*</span>
          </label>
          <input
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
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Company / Organization
          </label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g. Apex Global Systems Ltd."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
        </div>

        {/* Routing Department */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Target Group Department
          </label>
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Inquiry Classification */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Inquiry Category <span className="text-rose-500">*</span>
          </label>
          <select
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Priority Tier */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Engagement Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          >
            <option value="Normal">Normal — Standard Business Review</option>
            <option value="High">High — Active Transaction / RFP</option>
            <option value="Urgent">Urgent — Executive / Regulatory Priority</option>
            <option value="Low">Low — General Informational</option>
          </select>
        </div>

        {/* Subject */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Summary of proposed collaboration or inquiry..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white"
          />
          {fieldErrors.subject && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.subject}</p>
          )}
        </div>

        {/* Detailed Message */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
            Message Body <span className="text-rose-500">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Please detail your scope, requirements, organization background, and timeline..."
            className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-cobalt-500 focus:outline-none dark:border-white/10 dark:bg-obsidian-950 dark:text-white leading-relaxed"
          />
          {fieldErrors.message && (
            <p className="mt-1 text-xs text-rose-500">{fieldErrors.message}</p>
          )}
        </div>

        {/* Privacy Consent Checkbox */}
        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => setPrivacyConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-300 text-cobalt-600 focus:ring-cobalt-500 dark:border-white/20 dark:bg-obsidian-950"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              I consent to Booking Network Global Group processing the submitted corporate data in accordance with the{" "}
              <Link href="/privacy" className="text-cobalt-600 dark:text-cyan-400 underline font-semibold" target="_blank">
                Privacy Policy & Data Governance Charter
              </Link>
              . We do not sell or transfer inquiry information to external commercial parties.
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
              <span>Transmitting Encrypted Payload...</span>
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
