/**
 * Safe fetch utility for GFG x Marwadi University platform.
 * Prevents "Unexpected token '<', <!DOCTYPE... is not valid JSON" errors when endpoints return HTML
 * (e.g., during 404s, SPA redirects, or unconfigured Netlify backend functions).
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
  isHtmlFallback?: boolean;
}

export async function safeFetchJson<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
    const targetUrl = endpoint.startsWith("http")
      ? endpoint
      : endpoint.startsWith("/")
      ? `${apiBase}${endpoint}`
      : `${apiBase}/${endpoint}`;

    const response = await fetch(targetUrl, options);

    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.toLowerCase().includes("application/json");

    if (!isJson) {
      const text = await response.text();
      const isHtml = text.trim().toLowerCase().startsWith("<!doctype html") || text.trim().toLowerCase().startsWith("<html");
      console.warn(
        `⚠️ [SafeFetch] Received non-JSON response from ${targetUrl} (Status: ${response.status}, Content-Type: '${contentType}')`
      );
      return {
        ok: false,
        status: response.status,
        error: `Invalid response format from server (${response.status})`,
        isHtmlFallback: isHtml
      };
    }

    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      data
    };
  } catch (err: any) {
    console.error(`❌ [SafeFetch] Network exception while requesting ${endpoint}:`, err);
    return {
      ok: false,
      status: 500,
      error: err.message || "Network request failed"
    };
  }
}
