import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Award, Send, Loader2, Check, Copy, AlertCircle, ShieldCheck, FileCheck } from "lucide-react";
import { gasApi } from "../services/gasApi";

// Fixed internal Event ID for this certificate data collection portal
export const FIXED_CERTIFICATE_EVENT_ID = "GFG-MU-CERT-2026";

export default function CertificateDataEntry() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [successResult, setSuccessResult] = useState<{
    registration_id: string;
    attendance_id?: string;
    name: string;
    email: string;
  } | null>(null);

  const [copiedRegId, setCopiedRegId] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend validation
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await gasApi.submitCertificateData({
        name: trimmedName,
        email: trimmedEmail,
        event_id: FIXED_CERTIFICATE_EVENT_ID
      });

      if (res && res.success) {
        setSuccessResult({
          registration_id: res.registration_id || `REG-CERT-${Date.now()}`,
          attendance_id: res.attendance_id,
          name: trimmedName,
          email: trimmedEmail
        });
      } else {
        setError(res?.error || res?.message || "Submission failed. Please try again.");
      }
    } catch (err: any) {
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setError(null);
    setSuccessResult(null);
    setCopiedRegId(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] py-12 md:py-20 px-4 sm:px-6 relative select-none">
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10 space-y-8">
        
        {/* Institutional Branding Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E2DC] font-mono text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span className="font-bold text-[#111318] uppercase tracking-wider">
              GEEKSFORGEEKS × MARWADI UNIVERSITY
            </span>
          </div>
          <span className="text-[#8B9198] uppercase tracking-widest hidden sm:inline">
            CERTIFICATE REGISTRY
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-8 sm:p-12 shadow-[0_4px_25px_rgba(17,19,24,0.04)] relative overflow-hidden">
          
          {/* Subtle Accent Bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-[#00A86B]" />

          {/* Form Header Info */}
          <div className="space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-widest text-[#00A86B] font-bold">
              <Award className="w-3.5 h-3.5" />
              <span>OFFICIAL CERTIFICATE DATA ENTRY</span>
            </div>

            <h1 className="font-editorial text-3xl sm:text-4xl font-black text-[#111318] tracking-tight">
              Participant Information Entry
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#555B63] leading-relaxed">
              Please enter your full legal name and official email address to register your verified credentials for certificate generation. Submissions are securely recorded into the chapter Attendance registry.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {successResult ? (
              /* SUCCESS STATE */
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6 pt-2"
              >
                <div className="p-6 bg-[#FAF9F5] border border-[#00A86B]/40 space-y-5">
                  <div className="flex items-center space-x-3 text-[#00A86B]">
                    <div className="w-10 h-10 rounded-full bg-[#00A86B]/10 border border-[#00A86B] flex items-center justify-center">
                      <Check className="w-5 h-5 text-[#00A86B]" />
                    </div>
                    <div>
                      <h2 className="font-editorial text-xl font-bold text-[#111318]">
                        Certificate Data Submitted
                      </h2>
                      <p className="font-mono text-[10px] text-[#00A86B] uppercase font-bold tracking-wider">
                        STATUS: DONE · APPENDED TO ATTENDANCE REGISTRY
                      </p>
                    </div>
                  </div>

                  {/* Submission Details */}
                  <div className="pt-4 border-t border-[#E2E2DC] font-mono text-xs space-y-3">
                    <div className="flex items-center justify-between bg-[#FFFFFF] p-3 border border-[#E2E2DC]">
                      <div>
                        <span className="text-[9px] text-[#8B9198] uppercase block">YOUR REGISTRATION ID</span>
                        <span className="font-bold text-sm text-[#111318]">{successResult.registration_id}</span>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(successResult.registration_id);
                          setCopiedRegId(true);
                          setTimeout(() => setCopiedRegId(false), 2000);
                        }}
                        className="px-2.5 py-1.5 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#F4F4F0] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        {copiedRegId ? <Check className="w-3 h-3 text-[#00A86B]" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedRegId ? "COPIED" : "COPY ID"}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">PARTICIPANT NAME</span>
                        <span className="font-bold text-[#111318] block truncate">{successResult.name}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">EMAIL ADDRESS</span>
                        <span className="font-bold text-[#111318] block truncate">{successResult.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>Submit Another Participant Entry</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* INPUT FORM STATE */
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs font-mono flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name Input */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8B9198] mb-1.5 font-bold">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={submitting}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="Enter your full legal name (e.g. Meet Khakhkhar)"
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E2E2DC] text-[#111318] font-sans text-xs sm:text-sm focus:outline-none focus:border-[#111318] disabled:opacity-50"
                  />
                  <span className="font-mono text-[9px] text-[#8B9198] mt-1 block">
                    This exact name will be rendered onto your generated certificate.
                  </span>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8B9198] mb-1.5 font-bold">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    disabled={submitting}
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder="student@marwadiuniversity.ac.in"
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-[#E2E2DC] text-[#111318] font-sans text-xs sm:text-sm focus:outline-none focus:border-[#111318] disabled:opacity-50"
                  />
                  <span className="font-mono text-[9px] text-[#8B9198] mt-1 block">
                    Use your active university or personal email address for certificate delivery.
                  </span>
                </div>

                {/* Submit Action */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" />
                        <span>Submitting Certificate Data...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>SUBMIT CERTIFICATE DATA →</span>
                      </>
                    )}
                  </button>
                </div>

              </motion.form>
            )}
          </AnimatePresence>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-[#E2E2DC] flex items-center justify-between font-mono text-[10px] text-[#8B9198]">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B]" />
              <span>DIRECT GOOGLE SHEETS REGISTRY TRANSMISSION</span>
            </div>
            <span>MODE: BY-OWN</span>
          </div>

        </div>

      </div>
    </div>
  );
}
