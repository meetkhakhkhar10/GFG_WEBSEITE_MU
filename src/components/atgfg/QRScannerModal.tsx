import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Html5Qrcode } from "html5-qrcode";
import {
  Camera,
  X,
  RefreshCw,
  AlertTriangle,
  QrCode,
  Search,
  CheckCircle2,
  Lock,
  Smartphone,
  VideoOff
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScanResult: (registrationId: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanResult }: Props) {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [activeTab, setActiveTab] = useState<"camera" | "manual">("camera");
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const readerElementId = "atgfg-qr-reader-element";

  // Discover camera devices
  useEffect(() => {
    if (isOpen && activeTab === "camera") {
      Html5Qrcode.getCameras()
        .then((devices) => {
          if (devices && devices.length > 0) {
            setCameras(devices);
            // Default to back/environment camera if available
            const backCam = devices.find(
              (d) => d.label.toLowerCase().includes("back") || d.label.toLowerCase().includes("environment")
            );
            setSelectedCameraId(backCam ? backCam.id : devices[0].id);
          } else {
            setCameraError("No camera devices found on this device.");
          }
        })
        .catch((err) => {
          console.warn("Camera list fetch error:", err);
          setCameraError("Unable to access device camera. Please grant camera permissions or use manual ID entry.");
        });
    }
  }, [isOpen, activeTab]);

  // Start Scanner
  const startScanner = async (camId?: string) => {
    setCameraError(null);
    try {
      if (scannerRef.current) {
        if (scannerRef.current.isScanning) {
          await scannerRef.current.stop();
        }
      } else {
        scannerRef.current = new Html5Qrcode(readerElementId);
      }

      const cameraIdToUse = camId || selectedCameraId;
      const cameraConfig = cameraIdToUse
        ? cameraIdToUse
        : { facingMode: "environment" };

      await scannerRef.current.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          // Successfully scanned QR Code
          handleScannedText(decodedText);
        },
        (_errorMessage) => {
          // Silent scan frame error (expected while searching)
        }
      );

      setScanning(true);
    } catch (err: any) {
      console.error("Scanner launch failure:", err);
      setScanning(false);
      setCameraError(
        err?.message ||
          "Camera access permission was denied or camera is currently in use by another app."
      );
    }
  };

  // Stop Scanner
  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
      } catch (e) {
        console.warn("Scanner stop notice:", e);
      }
    }
    setScanning(false);
  };

  const handleScannedText = (text: string) => {
    const scannedValue = String(text || "").replace(/\u00A0/g, " ").trim();
    console.log("SCANNED QR:", text);
    console.log("NORMALIZED REGISTRATION ID:", scannedValue);

    // Stop scanner and trigger parent callback
    stopScanner();
    onScanResult(scannedValue);
  };

  // Auto start scanner when camera tab selected and camera available
  useEffect(() => {
    if (isOpen && activeTab === "camera" && selectedCameraId && !scanning) {
      const timer = setTimeout(() => {
        startScanner(selectedCameraId);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (!isOpen || activeTab !== "camera") {
      stopScanner();
    }
  }, [isOpen, activeTab, selectedCameraId]);

  // Clean up on unmount or modal close
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const scannedValue = String(manualInput || "").replace(/\u00A0/g, " ").trim();
    if (scannedValue) {
      console.log("SCANNED QR:", manualInput);
      console.log("NORMALIZED REGISTRATION ID:", scannedValue);
      onScanResult(scannedValue);
      setManualInput("");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-[#0F172A] border border-emerald-500/30 rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#00ff88]">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black uppercase tracking-wide">
                  Attendance <span className="text-[#00ff88]">Scanner</span>
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">Scan student registration QR code</p>
              </div>
            </div>
            <button
              onClick={() => {
                stopScanner();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex border-b border-slate-800 bg-slate-950 p-1.5 gap-1">
            <button
              onClick={() => setActiveTab("camera")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === "camera"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Scan</span>
            </button>
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                activeTab === "manual"
                  ? "bg-emerald-500 text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Manual ID</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5 overflow-y-auto">
            {activeTab === "camera" && (
              <div className="space-y-4">
                {/* Camera selector if multiple cameras available */}
                {cameras.length > 1 && (
                  <div className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select
                      value={selectedCameraId}
                      onChange={(e) => {
                        setSelectedCameraId(e.target.value);
                        startScanner(e.target.value);
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                    >
                      {cameras.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label || `Camera (${c.id.slice(0, 8)})`}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* QR Scanner Frame Container */}
                <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
                  <div id={readerElementId} className="w-full h-full object-cover"></div>

                  {!scanning && !cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950/90 z-10">
                      <Camera className="w-12 h-12 text-emerald-400 mb-3 animate-pulse" />
                      <p className="text-xs font-bold text-slate-200">Initializing camera viewport...</p>
                      <button
                        onClick={() => startScanner()}
                        className="mt-4 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black uppercase rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        Start Camera
                      </button>
                    </div>
                  )}

                  {/* Camera Error View */}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-950 z-20 space-y-3">
                      <VideoOff className="w-12 h-12 text-rose-500 mb-1" />
                      <h4 className="text-sm font-bold text-rose-400 uppercase tracking-wide">Camera Unavailable</h4>
                      <p className="text-xs text-slate-300 leading-relaxed max-w-xs">{cameraError}</p>
                      <button
                        onClick={() => setActiveTab("manual")}
                        className="mt-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-black uppercase rounded-xl hover:bg-emerald-400 transition-colors cursor-pointer"
                      >
                        Use Manual ID Entry
                      </button>
                    </div>
                  )}

                  {/* Scanning Guide HUD Overlay */}
                  {scanning && (
                    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col items-center justify-between p-6">
                      <div className="w-full text-center bg-slate-900/80 backdrop-blur-sm py-1.5 rounded-full border border-emerald-500/30">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest animate-pulse">
                          ● Align QR code within frame
                        </span>
                      </div>
                      <div className="w-56 h-56 border-2 border-dashed border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(0,255,136,0.2)]">
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-400"></div>
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-400"></div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-400"></div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">Camera Active • Auto Scanning</div>
                    </div>
                  )}
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between pt-1">
                  {scanning ? (
                    <button
                      type="button"
                      onClick={stopScanner}
                      className="w-full py-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Stop Camera
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startScanner()}
                      className="w-full py-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                    >
                      Restart Camera
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "manual" && (
              <form onSubmit={handleManualSubmit} className="space-y-4 py-2">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 tracking-wider mb-2">
                    Enter Registration ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. REG-1788698620536-209"
                      className="w-full h-12 bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-xl px-4 text-sm font-mono text-emerald-400 placeholder:text-slate-600 outline-none uppercase transition-colors"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Enter the exact Registration_ID provided on the student's pass or confirmation email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="w-full h-12 bg-emerald-500 disabled:opacity-40 text-slate-950 font-black uppercase text-xs tracking-wider rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Verify Registration</span>
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
