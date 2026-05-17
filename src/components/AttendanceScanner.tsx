import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { apiService } from "../services/apiService";
import { CheckCircle2, XCircle, Loader2, Camera } from "lucide-react";

export default function AttendanceScanner() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );

    scanner.render(
      async (decodedText) => {
        scanner.clear();
        handleCheckIn(decodedText);
      },
      (error) => {
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(e => console.error("Scanner clean failed", e));
    };
  }, []);

  const handleCheckIn = async (qrData: string) => {
    setLoading(true);
    try {
      const result = await apiService.checkIn(qrData);
      setScanResult(result);
    } catch (error: any) {
      setScanResult({ success: false, message: "Server connection failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#111] border border-white/10 rounded-[40px] p-10 max-w-xl mx-auto shadow-2xl relative overflow-hidden">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-[#00ff88]/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Camera className="w-8 h-8 text-[#00ff88]" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter">Event Check-in</h2>
        <p className="text-white/40 text-sm font-black uppercase tracking-widest mt-2 text-[10px]">Scan event QR to mark attendance</p>
      </div>

      <div id="reader" className="overflow-hidden rounded-3xl border-4 border-white/10 bg-black"></div>

      {loading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="w-12 h-12 text-[#00ff88] animate-spin mb-4" />
          <p className="font-black uppercase tracking-widest text-[10px]">Processing...</p>
        </div>
      )}

      {scanResult && (
        <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center space-x-4">
            {scanResult.success ? (
              <CheckCircle2 className="w-8 h-8 text-[#00ff88]" />
            ) : (
              <XCircle className="w-8 h-8 text-red-500" />
            )}
            <div>
              <p className={`font-black uppercase tracking-widest text-xs ${scanResult.success ? 'text-[#00ff88]' : 'text-red-500'}`}>
                {scanResult.success ? 'Check-in Success' : 'Check-in Failed'}
              </p>
              <p className="text-sm text-white/60">{scanResult.message}</p>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full mt-6 py-4 bg-white/5 border border-white/10 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all"
          >
            Scan Next
          </button>
        </div>
      )}
    </div>
  );
}
