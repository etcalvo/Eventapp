import { writeFileSync } from "node:fs";
import { createHash } from "node:crypto";

const buildId = createHash("md5")
  .update(Date.now().toString())
  .digest("hex")
  .slice(0, 8);

const CACHE_NAME = `bc-events-${buildId}`;
const BASE_PATH = "/Eventapp";

const sw = `// Auto-generated at build time — do not edit manually.
// Build: ${buildId}
const CACHE_NAME = "${CACHE_NAME}";
const BASE_PATH = "${BASE_PATH}";

const PRECACHE_URLS = [
  \`\${BASE_PATH}/\`,
  \`\${BASE_PATH}/icons/icon-192x192.png\`,
  \`\${BASE_PATH}/icons/icon-512x512.png\`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Network-first for Supabase API calls
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // Cache-first for static assets
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // Network-first for navigation and everything else
  event.respondWith(networkFirst(event.request));
});

function isStaticAsset(pathname) {
  return /\\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/i.test(pathname);
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      return caches.match(\`\${BASE_PATH}/\`);
    }
    return new Response("Offline", { status: 503 });
  }
}
`;

writeFileSync("public/sw.js", sw);
console.log(`Generated sw.js with build ID: ${buildId}`);
