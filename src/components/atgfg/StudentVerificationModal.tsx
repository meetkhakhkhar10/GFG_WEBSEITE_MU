import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  Building,
  Award,
  ExternalLink,
  Sparkles,
  Clock
} from "lucide-react";
import { AtgfgRegistration } from "@/src/services/atgfgApi";

interface Props {
  isOpen: boolean;
  registration: AtgfgRegistration | null;
  notFoundId?: string | null;
  loading?: boolean;
  onClose: () => void;
  onMarkAttendance: (registrationId: string) => Promise<{ success: boolean; duplicate?: boolean; message?: string; error?: string }>;
}

export default function StudentVerificationModal({
  isOpen,
  registration,
  notFoundId,
  loading = false,
  onClose,
  onMarkAttendance,
}: Props) {
  const [processing, setProcessing] = useState(false);
  const [actionResult, setActionResult] = useState<{
    type: "success" | "duplicate" | "error";
    message: string;
    timestamp?: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleMark = async () => {
    if (!registration) return;
    setProcessing(true);
    setActionResult(null);

    try {
      const res = await onMarkAttendance(registration.registration_id);
      if (res.success) {
        setActionResult({
          type: "success",
          message: res.message || "Attendance Marked Successfully",
          timestamp: new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        });
      } else if (res.duplicate) {
        setActionResult({
          type: "duplicate",
          message: res.message || "Attendance Already Marked",
        });
      } else {
        setActionResult({
          type: "error",
          message: res.error || "Failed to mark attendance",
        });
      }
    } catch (err: any) {
      setActionResult({
        type: "error",
        message: err?.message || "An error occurred while marking attendance",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-white my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wide">
                  Student <span className="text-[#00ff88]">Verification</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Verify registration credentials & mark present</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Loading View */}
          {loading && (
            <div className="p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#00ff88] animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Retrieving registration details from Google Sheets...</p>
            </div>
          )}

          {/* Not Found View */}
          {!loading && !registration && (
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto">
                <XCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase text-rose-400 tracking-wide">Registration Not Found</h4>
                {notFoundId && (
                  <p className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg inline-block mt-2 border border-slate-800">
                    ID: {notFoundId}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  Please verify the QR code or registration ID. No matching record exists in the Google Sheet.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Close Verification
              </button>
            </div>
          )}

          {/* Registration Details View */}
          {!loading && registration && (
            <div className="p-6 space-y-6">
              {/* Registration Status Header Banner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl gap-3">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-slate-400 block tracking-widest">
                    REGISTRATION VERIFIED
                  </span>
                  <div className="text-lg font-black text-white mt-0.5">{registration.name}</div>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                      registration.status === "CONFIRMED"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                        : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }`}
                  >
                    {registration.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                      registration.attendance_status === "PRESENT"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-[#00ff88]"
                        : "bg-slate-800 border-slate-700 text-slate-400"
                    }`}
                  >
                    {registration.attendance_status === "PRESENT" ? "PRESENT ✓" : "NOT MARKED"}
                  </span>
                </div>
              </div>

              {/* Action Banners / Feedback */}
              {actionResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border flex items-start space-x-3 text-xs leading-relaxed ${
                    actionResult.type === "success"
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                      : actionResult.type === "duplicate"
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                      : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                  }`}
                >
                  {actionResult.type === "success" && <CheckCircle2 className="w-5 h-5 text-[#00ff88] shrink-0 mt-0.5" />}
                  {actionResult.type === "duplicate" && <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
                  {actionResult.type === "error" && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                  <div>
                    <div className="font-bold uppercase tracking-wider">{actionResult.message}</div>
                    {actionResult.timestamp && (
                      <div className="text-[10px] text-emerald-400 font-mono mt-1">
                        Time: {actionResult.timestamp}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Unconfirmed Warning */}
              {registration.status !== "CONFIRMED" && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center space-x-3 text-amber-300 text-xs">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold uppercase block">Registration Not Confirmed</span>
                    <span>Attendance cannot be marked for non-confirmed registrations.</span>
                  </div>
                </div>
              )}

              {/* Duplicate Warning */}
              {registration.attendance_status === "PRESENT" && !actionResult && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center space-x-3 text-amber-300 text-xs">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-bold uppercase block">Attendance already marked.</span>
                    <span>This student has already been marked present for this registration ID.</span>
                  </div>
                </div>
              )}

              {/* Student Detail Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Registration ID
                  </span>
                  <span className="font-mono text-emerald-400 font-bold block select-all">
                    {registration.registration_id}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Event ID
                  </span>
                  <span className="font-mono text-white font-bold block">
                    {registration.event_id || "N/A"}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-emerald-400" /> Email Address
                  </span>
                  <span className="text-slate-200 font-medium block truncate">
                    {registration.email || "N/A"}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400" /> Phone Number
                  </span>
                  <span className="text-slate-200 font-medium block">
                    {registration.phone || "N/A"}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <GraduationCap className="w-3 h-3 text-emerald-400" /> Enrollment Number
                  </span>
                  <span className="font-mono text-slate-200 font-medium block">
                    {registration.enrollment_number || "N/A"}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3 text-emerald-400" /> Department / Year
                  </span>
                  <span className="text-slate-200 font-medium block">
                    {registration.department || "N/A"} {registration.year ? `(Yr ${registration.year})` : ""}
                  </span>
                </div>

                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 col-span-1 sm:col-span-2">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    College / Institution
                  </span>
                  <span className="text-slate-200 font-medium block">
                    {registration.college || "Marwadi University"}
                  </span>
                </div>

                {/* Certificate Section */}
                <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1 col-span-1 sm:col-span-2 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" /> Certificate Status
                    </span>
                    <span className="text-slate-300 font-bold text-xs uppercase block mt-0.5">
                      {registration.certificate_status}
                    </span>
                  </div>
                  {registration.certificate_url && registration.certificate_url !== "blank" && (
                    <a
                      href={registration.certificate_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <span>VIEW CERTIFICATE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {registration.status === "CONFIRMED" && registration.attendance_status !== "PRESENT" ? (
                  <button
                    type="button"
                    onClick={handleMark}
                    disabled={processing}
                    className="w-full h-12 bg-emerald-500 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        <span>MARKING ATTENDANCE...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>MARK ATTENDANCE</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full h-12 bg-slate-800 text-slate-500 font-bold uppercase text-xs tracking-wider rounded-xl flex items-center justify-center space-x-2 cursor-not-allowed"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {registration.attendance_status === "PRESENT"
                        ? "Attendance already marked."
                        : "REGISTRATION NOT CONFIRMED"}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-32 h-12 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-xs tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
