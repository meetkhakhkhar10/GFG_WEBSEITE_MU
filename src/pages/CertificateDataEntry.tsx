import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Award, Send, Loader2, Check, Copy, AlertCircle, ShieldCheck, FileCheck, Download, Printer, QrCode as QrIcon } from "lucide-react";
import QRCode from "qrcode";
import { gasApi } from "../services/gasApi";

// Fixed default internal Event ID for certificate data collection portal
export const DEFAULT_CERTIFICATE_EVENT_ID = "GFG-MU-CERT-2026";

export default function CertificateDataEntry() {
  const [searchParams] = useSearchParams();
  const eventIdFromUrl = searchParams.get("event_id") || searchParams.get("event") || DEFAULT_CERTIFICATE_EVENT_ID;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [successResult, setSuccessResult] = useState<{
    registration_id: string;
    attendance_id?: string;
    name: string;
    email: string;
    event_id: string;
  } | null>(null);

  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedRegId, setCopiedRegId] = useState(false);

  // Generate QR code whenever successResult changes
  useEffect(() => {
    if (successResult?.registration_id) {
      // Structured QR payload encoding the registration_id
      const qrPayload = JSON.stringify({
        type: "CERTIFICATE_ATTENDANCE",
        registration_id: successResult.registration_id
      });

      QRCode.toDataURL(qrPayload, {
        width: 300,
        margin: 2,
        color: {
          dark: "#111318",
          light: "#FFFFFF"
        }
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => {
          console.error("Failed to generate QR code:", err);
          // Fallback to simple registration ID string
          QRCode.toDataURL(successResult.registration_id, { width: 300, margin: 2 })
            .then((url) => setQrDataUrl(url))
            .catch(() => {});
        });
    } else {
      setQrDataUrl(null);
    }
  }, [successResult?.registration_id]);

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
        event_id: eventIdFromUrl
      });

      if (res && res.success) {
        setSuccessResult({
          registration_id: res.registration_id || `REG-CERT-${Date.now()}`,
          attendance_id: res.attendance_id,
          name: trimmedName,
          email: trimmedEmail,
          event_id: eventIdFromUrl
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
    setQrDataUrl(null);
    setCopiedRegId(false);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !successResult) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `QR_${successResult.registration_id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintQr = () => {
    if (!qrDataUrl) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance QR - ${successResult?.registration_id}</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .qr-card { border: 2px solid #111318; display: inline-block; padding: 30px; }
            h2 { margin: 0 0 10px; font-size: 20px; }
            p { margin: 5px 0; font-size: 14px; color: #555; }
            img { width: 220px; height: 220px; margin: 20px 0; }
            .reg-id { font-family: monospace; font-weight: bold; font-size: 18px; color: #00A86B; }
          </style>
        </head>
        <body>
          <div class="qr-card">
            <h2>OFFICIAL CERTIFICATE ATTENDANCE QR</h2>
            <p><strong>Participant:</strong> ${successResult?.name}</p>
            <p><strong>Email:</strong> ${successResult?.email}</p>
            <img src="${qrDataUrl}" alt="QR Code" />
            <div class="reg-id">${successResult?.registration_id}</div>
            <p style="font-size:11px; margin-top:15px;">Show this QR code to the attendance coordinator</p>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
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
              /* SUCCESS STATE WITH QR CODE */
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
                        <span className="text-[9px] text-[#8B9198] uppercase block">PARTICIPANT</span>
                        <span className="font-bold text-[#111318] block truncate">{successResult.name}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">MAIL ADDRESS</span>
                        <span className="font-bold text-[#111318] block truncate">{successResult.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* YOUR ATTENDANCE QR SECTION */}
                  <div className="pt-4 border-t border-[#E2E2DC] space-y-4 text-center">
                    <div className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-[#111318] font-bold">
                      <QrIcon className="w-3.5 h-3.5 text-[#00A86B]" />
                      <span>YOUR ATTENDANCE QR</span>
                    </div>

                    {qrDataUrl ? (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="p-3 bg-[#FFFFFF] border-2 border-[#111318] rounded-none inline-block shadow-md">
                          <img
                            src={qrDataUrl}
                            alt={`Attendance QR for ${successResult.registration_id}`}
                            className="w-48 h-48 sm:w-56 sm:h-56 object-contain block mx-auto"
                          />
                        </div>
                        <p className="font-sans text-xs text-[#555B63]">
                          Show this QR code to the attendance coordinator.
                        </p>

                        <div className="flex items-center justify-center gap-3 pt-2">
                          <button
                            onClick={handleDownloadQr}
                            className="px-4 py-2.5 bg-[#00A86B] hover:bg-[#111318] text-[#FFFFFF] font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>DOWNLOAD QR</span>
                          </button>
                          <button
                            onClick={handlePrintQr}
                            className="px-4 py-2.5 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#FFFFFF] border border-[#E2E2DC] font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>PRINT QR</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-8 font-mono text-xs text-[#8B9198] flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" />
                        <span>Generating Attendance QR Code...</span>
                      </div>
                    )}
                  </div>

                </div>

                <div className="pt-2">
                  <button
                    onClick={handleReset}
                    className="w-full py-3.5 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <FileCheck className="w-4 h-4" />
                    <span>SUBMIT ANOTHER PARTICIPANT ENTRY</span>
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
