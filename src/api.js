const BASE = "https://jerrycoder.oggyapi.workers.dev";
const NEXRAY = "https://api.nexray.eu.cc";
const ELITE = "https://eliteprotech-apis.zone.id";

async function request(url, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

async function withFallback(name, urls, validate) {
  const errors = [];
  for (const url of urls) {
    try {
      const data = await request(url);
      if (validate(data)) return { ok: true, data, provider: url };
      errors.push(`invalid response from ${url}`);
    } catch (error) {
      errors.push(`${url}: ${error.message}`);
    }
  }
  return { ok: false, error: `${name} failed on all providers`, details: errors };
}

export const api = {
  facebook: (url) => withFallback("Facebook downloader", [
    `${BASE}/down/fb?url=${encodeURIComponent(url)}`,
    `${NEXRAY}/downloader/facebook?url=${encodeURIComponent(url)}`,
    `${ELITE}/facebook1?url=${encodeURIComponent(url)}`
  ], d => d?.status === "success" || d?.status === true || d?.success === true),

  twitter: (url) => withFallback("Twitter/X downloader", [
    `${BASE}/down/twitter?url=${encodeURIComponent(url)}`,
    `${NEXRAY}/downloader/twitter?url=${encodeURIComponent(url)}`
  ], d => d?.status === "success" || d?.status === true),

  lyrics: (q) => withFallback("Lyrics search", [
    `${BASE}/search/lyrics-v1?q=${encodeURIComponent(q)}`
  ], d => d?.status === "success"),

  aiChat: (q) => withFallback("AI chat", [
    `${BASE}/ai/gpt?q=${encodeURIComponent(q)}`
  ], d => typeof d?.reply === "string"),

  aiImage: (prompt) => withFallback("AI image", [
    `${BASE}/ai/poll?prompt=${encodeURIComponent(prompt)}`
  ], d => d?.status === "success" && typeof d?.image === "string")
};
