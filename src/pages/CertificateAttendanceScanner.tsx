import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";
import { 
  ShieldCheck, LogOut, Camera, CheckCircle2, AlertTriangle, 
  XCircle, UserCheck, Loader2, Lock, QrCode as QrIcon, Search, Upload, Keyboard
} from "lucide-react";
import { gasApi } from "../services/gasApi";

interface ScanResultState {
  type: "success" | "already_verified" | "not_found" | "invalid_qr" | "error";
  registration_id?: string;
  name?: string;
  email?: string;
  status?: string;
  marked_by?: string;
  message?: string;
  timestamp: string;
}

export default function CertificateAttendanceScanner() {
  // Session State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("cert_scanner_token"));
  const [scannerIdentity, setScannerIdentity] = useState<string | null>(() => localStorage.getItem("cert_scanner_identity"));

  // Login Form State
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Scanner State
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [processingScan, setProcessingScan] = useState(false);
  const [lastScanResult, setLastScanResult] = useState<ScanResultState | null>(null);

  // Manual Input State
  const [manualRegId, setManualRegId] = useState("");
  const [activeTab, setActiveTab] = useState<"camera" | "manual" | "upload">("camera");

  // References
  const html5QrcodeRef = useRef<Html5Qrcode | null>(null);
  const lastScannedIdRef = useRef<string | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Cleanup camera on unmount or logout
  useEffect(() => {
    return () => {
      stopCameraScanner();
    };
  }, []);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);

    const cleanId = loginId.trim();
    const cleanPass = password.trim();

    try {
      const res = await gasApi.certificateScannerLogin(cleanId, cleanPass);
      if (res && res.success && res.token && res.scannerIdentity) {
        setToken(res.token);
        setScannerIdentity(res.scannerIdentity);
        localStorage.setItem("cert_scanner_token", res.token);
        localStorage.setItem("cert_scanner_identity", res.scannerIdentity);
        setLoginId("");
        setPassword("");
      } else {
        setLoginError("INVALID LOGIN ID OR PASSWORD");
      }
    } catch {
      setLoginError("INVALID LOGIN ID OR PASSWORD");
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    stopCameraScanner();
    setToken(null);
    setScannerIdentity(null);
    localStorage.removeItem("cert_scanner_token");
    localStorage.removeItem("cert_scanner_identity");
    setLastScanResult(null);
    setCameraError(null);
  };

  // Start Camera Scanner with robust device/facingMode fallbacks
  const startCameraScanner = async () => {
    setCameraError(null);
    const element = document.getElementById("cert-qr-reader");
    if (!element) return;

    try {
      if (html5QrcodeRef.current) {
        await stopCameraScanner();
      }

      const scanner = new Html5Qrcode("cert-qr-reader");
      html5QrcodeRef.current = scanner;

      let cameraConfig: any = { facingMode: "environment" };

      // Query available camera devices if possible
      try {
        const cameras = await Html5Qrcode.getCameras();
        if (cameras && cameras.length > 0) {
          // Prefer back camera if found
          const backCam = cameras.find(c => 
            c.label.toLowerCase().includes("back") || 
            c.label.toLowerCase().includes("rear") || 
            c.label.toLowerCase().includes("environment")
          );
          cameraConfig = backCam ? backCam.id : cameras[0].id;
        }
      } catch (camListErr) {
        console.warn("Camera enumeration notice, using default config:", camListErr);
      }

      const qrConfig = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      try {
        await scanner.start(cameraConfig, qrConfig, onQrCodeSuccess, () => {});
      } catch (firstErr) {
        console.warn("First camera start attempt failed, trying facingMode user:", firstErr);
        await scanner.start({ facingMode: "user" }, qrConfig, onQrCodeSuccess, () => {});
      }

      setIsScanning(true);
    } catch (err: any) {
      console.error("Camera start error:", err);
      setIsScanning(false);
      setCameraError(
        "CAMERA ACCESS DENIED OR UNAVAILABLE. Camera permission is blocked by your browser or device settings. You can still verify attendance using Manual ID Entry or QR Image Upload below."
      );
    }
  };

  // Stop Camera Scanner
  const stopCameraScanner = async () => {
    if (html5QrcodeRef.current) {
      try {
        if (html5QrcodeRef.current.isScanning) {
          await html5QrcodeRef.current.stop();
        }
        html5QrcodeRef.current.clear();
      } catch (err) {
        console.warn("Camera stop notice:", err);
      } finally {
        html5QrcodeRef.current = null;
        setIsScanning(false);
      }
    }
  };

  // Process Scanned QR Payload or Registration ID string
  const processRegistrationVerification = async (targetRegId: string) => {
    if (!targetRegId || processingScan || !token) return;

    const now = Date.now();
    let rawText = targetRegId.trim();

    // Parse structured JSON if present
    let regId = rawText;
    if (rawText.startsWith("{") && rawText.endsWith("}")) {
      try {
        const parsed = JSON.parse(rawText);
        if (parsed && parsed.registration_id) {
          regId = String(parsed.registration_id).trim();
        }
      } catch {}
    }

    // Cooldown / Debounce check for camera
    if (lastScannedIdRef.current === regId && now - lastScannedTimeRef.current < 2500) {
      return;
    }

    lastScannedIdRef.current = regId;
    lastScannedTimeRef.current = now;

    setProcessingScan(true);

    try {
      const res = await gasApi.scanCertificateQr(regId, token);
      const currentTime = new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

      if (res && res.success) {
        setLastScanResult({
          type: "success",
          registration_id: res.registration_id || regId,
          name: res.name || "Participant",
          email: res.email || "",
          status: "DONE",
          marked_by: res.marked_by || scannerIdentity || "Coordinator",
          message: "ATTENDANCE VERIFIED",
          timestamp: currentTime
        });
        setManualRegId("");
      } else if (res && res.alreadyVerified) {
        setLastScanResult({
          type: "already_verified",
          registration_id: res.registration_id || regId,
          name: res.name || "Participant",
          email: res.email || "",
          marked_by: res.marked_by || "Previous Coordinator",
          message: "ALREADY VERIFIED",
          timestamp: currentTime
        });
      } else if (res && res.notFound) {
        setLastScanResult({
          type: "not_found",
          registration_id: regId,
          message: "REGISTRATION NOT FOUND",
          timestamp: currentTime
        });
      } else if (res && res.invalidQr) {
        setLastScanResult({
          type: "invalid_qr",
          registration_id: regId,
          message: "INVALID QR CODE",
          timestamp: currentTime
        });
      } else {
        setLastScanResult({
          type: "error",
          registration_id: regId,
          message: res?.error || res?.message || "Verification failed. Please try again.",
          timestamp: currentTime
        });
      }
    } catch (err: any) {
      setLastScanResult({
        type: "error",
        registration_id: regId,
        message: err?.message || "Scan verification error.",
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      setProcessingScan(false);
    }
  };

  const onQrCodeSuccess = (decodedText: string) => {
    processRegistrationVerification(decodedText);
  };

  // Handle Manual Submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualRegId.trim()) return;
    processRegistrationVerification(manualRegId.trim());
  };

  // Handle QR File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const tempScanner = new Html5Qrcode("cert-qr-reader-temp");
      const decodedResult = await tempScanner.scanFile(file, true);
      tempScanner.clear();
      processRegistrationVerification(decodedResult);
    } catch (err) {
      setLastScanResult({
        type: "invalid_qr",
        message: "No valid QR code detected in the uploaded image.",
        timestamp: new Date().toLocaleTimeString()
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // If NOT logged in -> Show LOGIN SCREEN
  if (!token || !scannerIdentity) {
    return (
      <div className="min-h-screen bg-[#F4F4F0] text-[#111318] py-16 px-4 sm:px-6 flex items-center justify-center relative select-none">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF9F5] border border-[#E2E2DC] font-mono text-[10px] uppercase tracking-widest text-[#00A86B] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>OFFICIAL ATTENDANCE PORTAL</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl font-black tracking-tight text-[#111318]">
              CERTIFICATE ATTENDANCE SCANNER
            </h1>
            <p className="font-mono text-xs text-[#8B9198] uppercase tracking-wider">
              Authorized Login
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-[#FFFFFF] border border-[#111318] p-8 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-[#00A86B]" />

            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8B9198] mb-1.5 font-bold">
                  Login ID *
                </label>
                <input
                  type="text"
                  required
                  disabled={loggingIn}
                  value={loginId}
                  onChange={(e) => {
                    setLoginId(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter scanner login ID"
                  className="w-full px-3.5 py-3 bg-[#FAF9F5] border border-[#E2E2DC] text-[#111318] font-sans text-xs sm:text-sm focus:outline-none focus:border-[#111318] disabled:opacity-50"
                  autoCapitalize="none"
                  autoComplete="username"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8B9198] mb-1.5 font-bold">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  disabled={loggingIn}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (loginError) setLoginError(null);
                  }}
                  placeholder="Enter password"
                  className="w-full px-3.5 py-3 bg-[#FAF9F5] border border-[#E2E2DC] text-[#111318] font-sans text-xs sm:text-sm focus:outline-none focus:border-[#111318] disabled:opacity-50"
                  autoComplete="current-password"
                />
              </div>

              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-4 bg-[#111318] hover:bg-[#00A86B] text-[#F4F4F0] font-mono text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
              >
                {loggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>LOGIN</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-[#E2E2DC] text-center font-mono text-[10px] text-[#8B9198]">
              RESTRICTED COORDINATOR ACCESS ONLY
            </div>
          </div>

        </div>
      </div>
    );
  }

  // LOGGED IN SCANNER INTERFACE
  return (
    <div className="min-h-screen bg-[#F4F4F0] text-[#111318] py-8 px-4 sm:px-6 relative select-none">
      <div className="absolute inset-0 bg-technical-grid opacity-50 pointer-events-none" />

      {/* Hidden container for QR file scanning */}
      <div id="cert-qr-reader-temp" className="hidden" />

      <div className="max-w-3xl mx-auto relative z-10 space-y-6">
        
        {/* Top Coordinator Session Header */}
        <div className="bg-[#FFFFFF] border border-[#111318] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#00A86B]/10 border border-[#00A86B] flex items-center justify-center text-[#00A86B] shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] text-[#8B9198] uppercase block">
                AUTHORIZED ATTENDANCE COORDINATOR
              </span>
              <span className="font-editorial text-lg font-black text-[#111318]">
                Logged in as: <span className="text-[#00A86B]">{scannerIdentity}</span>
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 bg-[#FAF9F5] hover:bg-[#111318] text-[#111318] hover:text-[#FFFFFF] border border-[#E2E2DC] font-mono text-xs uppercase tracking-wider transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>

        {/* Main Scanner Card */}
        <div className="bg-[#FFFFFF] border border-[#E2E2DC] p-6 sm:p-8 shadow-[0_4px_20px_rgba(17,19,24,0.04)] space-y-6">
          
          <div className="space-y-1 text-center sm:text-left">
            <h2 className="font-editorial text-2xl font-black text-[#111318] tracking-tight">
              CERTIFICATE ATTENDANCE SCANNER
            </h2>
            <p className="font-sans text-xs text-[#555B63]">
              Scan participant QR codes to verify certificate attendance.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-[#E2E2DC] font-mono text-xs uppercase font-bold">
            <button
              onClick={() => setActiveTab("camera")}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "camera"
                  ? "border-[#00A86B] text-[#00A86B] bg-[#FAF9F5]"
                  : "border-transparent text-[#8B9198] hover:text-[#111318]"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Reader</span>
            </button>
            <button
              onClick={() => {
                stopCameraScanner();
                setActiveTab("manual");
              }}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "manual"
                  ? "border-[#00A86B] text-[#00A86B] bg-[#FAF9F5]"
                  : "border-transparent text-[#8B9198] hover:text-[#111318]"
              }`}
            >
              <Keyboard className="w-4 h-4" />
              <span>Manual Entry</span>
            </button>
            <button
              onClick={() => {
                stopCameraScanner();
                setActiveTab("upload");
              }}
              className={`px-4 py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === "upload"
                  ? "border-[#00A86B] text-[#00A86B] bg-[#FAF9F5]"
                  : "border-transparent text-[#8B9198] hover:text-[#111318]"
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload QR</span>
            </button>
          </div>

          {/* TAB 1: CAMERA SCANNER */}
          {activeTab === "camera" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                {!isScanning ? (
                  <button
                    onClick={startCameraScanner}
                    className="px-6 py-3 bg-[#00A86B] hover:bg-[#111318] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>START SCANNER</span>
                  </button>
                ) : (
                  <button
                    onClick={stopCameraScanner}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                    <span>STOP SCANNER</span>
                  </button>
                )}

                {processingScan && (
                  <div className="font-mono text-xs text-[#00A86B] uppercase font-bold flex items-center gap-2 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>VERIFYING REGISTRATION...</span>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="p-4 bg-amber-50 border border-amber-300 text-amber-900 font-mono text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold uppercase text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>CAMERA ACCESS REQUIREMENT & GUIDANCE</span>
                  </div>
                  <p className="font-sans text-xs text-amber-900 leading-relaxed">
                    Camera access was blocked or denied by browser/device permissions.
                  </p>
                  <div className="pt-1 text-[11px] space-y-1 font-mono text-amber-800">
                    <p>• <strong>Chrome / Edge:</strong> Click the lock/tune icon in the browser address bar $\rightarrow$ Enable "Camera" $\rightarrow$ Refresh page.</p>
                    <p>• <strong>Alternative:</strong> Use the "Manual Entry" tab above to type or paste the participant Registration ID directly.</p>
                  </div>
                </div>
              )}

              {/* Html5Qrcode Reader Stage */}
              <div className="relative bg-[#FAF9F5] border-2 border-dashed border-[#E2E2DC] p-2 min-h-[280px] flex items-center justify-center overflow-hidden">
                <div id="cert-qr-reader" className="w-full max-w-sm mx-auto overflow-hidden" />

                {!isScanning && (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#FAF9F5] border border-[#E2E2DC] mx-auto flex items-center justify-center text-[#8B9198]">
                      <QrIcon className="w-6 h-6" />
                    </div>
                    <p className="font-mono text-xs text-[#8B9198] uppercase">
                      Click "START SCANNER" to begin camera scanning, or use Manual Entry tab.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MANUAL REGISTRATION ID ENTRY */}
          {activeTab === "manual" && (
            <form onSubmit={handleManualSubmit} className="space-y-4 p-4 bg-[#FAF9F5] border border-[#E2E2DC]">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8B9198] mb-1.5 font-bold">
                  REGISTRATION ID *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    disabled={processingScan}
                    value={manualRegId}
                    onChange={(e) => setManualRegId(e.target.value)}
                    placeholder="e.g. REG-CERT-363967"
                    className="flex-1 px-3.5 py-3 bg-[#FFFFFF] border border-[#E2E2DC] text-[#111318] font-mono text-xs sm:text-sm focus:outline-none focus:border-[#111318]"
                  />
                  <button
                    type="submit"
                    disabled={processingScan || !manualRegId.trim()}
                    className="px-6 py-3 bg-[#111318] hover:bg-[#00A86B] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shrink-0"
                  >
                    {processingScan ? <Loader2 className="w-4 h-4 animate-spin text-[#00A86B]" /> : <Search className="w-4 h-4" />}
                    <span>VERIFY ATTENDANCE</span>
                  </button>
                </div>
              </div>
              <p className="font-mono text-[10px] text-[#8B9198]">
                Enter the unique Registration ID generated during participant certificate data entry.
              </p>
            </form>
          )}

          {/* TAB 3: QR IMAGE FILE UPLOAD */}
          {activeTab === "upload" && (
            <div className="p-8 bg-[#FAF9F5] border-2 border-dashed border-[#E2E2DC] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#FFFFFF] border border-[#E2E2DC] mx-auto flex items-center justify-center text-[#00A86B]">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-editorial text-lg font-bold text-[#111318]">
                  Upload Participant QR Image
                </h4>
                <p className="font-sans text-xs text-[#555B63]">
                  Select or drop a saved QR image file from your device.
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="qr-file-input"
              />
              <label
                htmlFor="qr-file-input"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#111318] hover:bg-[#00A86B] text-[#FFFFFF] font-mono text-xs uppercase tracking-widest transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>SELECT QR IMAGE FILE</span>
              </label>
            </div>
          )}

          {/* SCAN RESULT CONFIRMATION CARD */}
          <AnimatePresence mode="wait">
            {lastScanResult && (
              <motion.div
                key={lastScanResult.timestamp + (lastScanResult.registration_id || "res")}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -10 }}
                className="pt-2"
              >
                {lastScanResult.type === "success" && (
                  /* ATTENDANCE VERIFIED */
                  <div className="p-6 bg-[#00A86B]/10 border-2 border-[#00A86B] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-[#00A86B] font-mono text-xs uppercase font-black tracking-widest">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>ATTENDANCE VERIFIED</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#8B9198]">{lastScanResult.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">PARTICIPANT</span>
                        <span className="font-bold text-sm text-[#111318] block truncate">{lastScanResult.name}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">REGISTRATION ID</span>
                        <span className="font-bold text-sm text-[#00A86B] block truncate">{lastScanResult.registration_id}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">STATUS</span>
                        <span className="font-bold text-[#111318] block">{lastScanResult.status}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">MARKED BY</span>
                        <span className="font-bold text-[#00A86B] block truncate">{lastScanResult.marked_by}</span>
                      </div>
                    </div>
                  </div>
                )}

                {lastScanResult.type === "already_verified" && (
                  /* ALREADY VERIFIED */
                  <div className="p-6 bg-amber-500/10 border-2 border-amber-500 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-amber-700 font-mono text-xs uppercase font-black tracking-widest">
                        <AlertTriangle className="w-5 h-5 shrink-0" />
                        <span>ALREADY VERIFIED</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#8B9198]">{lastScanResult.timestamp}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs pt-1">
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">PARTICIPANT</span>
                        <span className="font-bold text-sm text-[#111318] block truncate">{lastScanResult.name}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC]">
                        <span className="text-[9px] text-[#8B9198] uppercase block">REGISTRATION ID</span>
                        <span className="font-bold text-sm text-amber-700 block truncate">{lastScanResult.registration_id}</span>
                      </div>
                      <div className="p-3 bg-[#FFFFFF] border border-[#E2E2DC] sm:col-span-2">
                        <span className="text-[9px] text-[#8B9198] uppercase block">ALREADY MARKED BY</span>
                        <span className="font-bold text-amber-800 block truncate">{lastScanResult.marked_by}</span>
                      </div>
                    </div>
                  </div>
                )}

                {lastScanResult.type === "not_found" && (
                  /* REGISTRATION NOT FOUND */
                  <div className="p-6 bg-red-50 border-2 border-red-500 space-y-3 text-red-900">
                    <div className="flex items-center space-x-2 font-mono text-xs uppercase font-black tracking-widest text-red-700">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span>REGISTRATION NOT FOUND</span>
                    </div>
                    <p className="font-sans text-xs text-red-800">
                      No certificate data entry was found for Registration ID: <strong className="font-mono">{lastScanResult.registration_id}</strong>.
                    </p>
                  </div>
                )}

                {lastScanResult.type === "invalid_qr" && (
                  /* INVALID QR CODE */
                  <div className="p-6 bg-red-50 border-2 border-red-500 space-y-3 text-red-900">
                    <div className="flex items-center space-x-2 font-mono text-xs uppercase font-black tracking-widest text-red-700">
                      <XCircle className="w-5 h-5 shrink-0" />
                      <span>INVALID QR CODE</span>
                    </div>
                    <p className="font-sans text-xs text-red-800">
                      {lastScanResult.message || "This QR code is not a valid certificate attendance code."}
                    </p>
                  </div>
                )}

                {lastScanResult.type === "error" && (
                  /* ERROR */
                  <div className="p-6 bg-red-50 border border-red-300 space-y-2 text-red-900 font-mono text-xs">
                    <div className="flex items-center space-x-2 uppercase font-bold text-red-700">
                      <XCircle className="w-4 h-4 shrink-0" />
                      <span>VERIFICATION ERROR</span>
                    </div>
                    <p className="font-sans text-xs">{lastScanResult.message}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}
