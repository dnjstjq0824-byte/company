"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react";

const INQUIRY_TYPES = [
  "General Inquiry",
  "Business Partnership",
  "Platform Collaboration",
  "Advertising & Marketing",
  "Technical / Website Issue",
  "Other",
];

export function ContactForm({ initialPlatform }: { initialPlatform?: string }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [inquiryType, setInquiryType] = useState(
    initialPlatform ? "Platform Collaboration" : "General Inquiry"
  );
  const [subject, setSubject] = useState(
    initialPlatform ? `Inquiry regarding ${initialPlatform}` : ""
  );
  const [message, setMessage] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submittedMessage, setSubmittedMessage] = useState("");

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
          inquiry_type: inquiryType,
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
          "Thank you for contacting Booking Network Co., Ltd. Your message has been received. Our team will review your inquiry."
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
        "A network error occurred while sending your message. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedMessage) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-8 text-center dark:border-emerald-800/70 dark:bg-emerald-950/30"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-slate-900 dark:text-white">
          Inquiry Received
        </h3>
        <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-slate-700 dark:text-slate-200">
          {submittedMessage}
        </p>
        <button
          type="button"
          onClick={() => setSubmittedMessage("")}
          className="mt-6 inline-flex items-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-navy-900 dark:text-slate-200"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-navy-900 sm:p-9"
    >
      <h2 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
        Send Us a Message
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Fields marked with an asterisk (*) are required.
      </p>

      {errorMessage && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/70 dark:bg-red-950/50 dark:text-red-300"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Honeypot anti-spam field (hidden from real users) */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website_honeypot">Website</label>
        <input
          id="website_honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Full Name *
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            maxLength={120}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Jane Doe"
            aria-invalid={Boolean(fieldErrors.full_name)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
          />
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {fieldErrors.full_name}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Email Address *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            maxLength={160}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@organization.com"
            aria-invalid={Boolean(fieldErrors.email)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
          />
          {fieldErrors.email && (
            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Company / Organization */}
        <div>
          <label
            htmlFor="company"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Company / Organization (Optional)
          </label>
          <input
            id="company"
            name="company"
            type="text"
            maxLength={150}
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Organization Ltd."
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
          />
        </div>

        {/* Inquiry Type */}
        <div>
          <label
            htmlFor="inquiry_type"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Inquiry Type *
          </label>
          <select
            id="inquiry_type"
            name="inquiry_type"
            required
            value={inquiryType}
            onChange={(e) => setInquiryType(e.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {fieldErrors.inquiry_type && (
            <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
              {fieldErrors.inquiry_type}
            </p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="mt-5">
        <label
          htmlFor="subject"
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          Subject *
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          maxLength={200}
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="How can Booking Network Co., Ltd. assist you?"
          aria-invalid={Boolean(fieldErrors.subject)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
        />
        {fieldErrors.subject && (
          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mt-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="message"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Message *
          </label>
          <span className="text-[11px] text-slate-400">
            {message.length} / 5000
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          maxLength={5000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please describe your partnership proposal, platform question, or corporate inquiry..."
          aria-invalid={Boolean(fieldErrors.message)}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-electric-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-navy-950 dark:text-white"
        />
        {fieldErrors.message && (
          <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Privacy Consent */}
      <div className="mt-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={privacyConsent}
            onChange={(e) => setPrivacyConsent(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-electric-600 focus:ring-electric-500"
          />
          <span className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            I consent to <strong>Booking Network Co., Ltd.</strong> collecting
            and processing the information submitted in this form for the
            purpose of reviewing and responding to my inquiry, in accordance
            with the{" "}
            <Link
              href="/privacy"
              className="font-semibold text-electric-600 underline hover:text-electric-700 dark:text-electric-400"
            >
              Privacy Policy
            </Link>
            . *
          </span>
        </label>
        {fieldErrors.privacy_consent && (
          <p className="mt-1.5 text-xs font-medium text-red-600 dark:text-red-400">
            {fieldErrors.privacy_consent}
          </p>
        )}
      </div>

      <div className="mt-7">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-electric-600 px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-electric-700 disabled:opacity-60 sm:w-auto transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending Inquiry...
            </>
          ) : (
            <>
              Submit Inquiry
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}

