/**
 * In-memory cache with 2-minute TTL for Firestore data.
 * Makes opening admin sections instant when data was loaded recently.
 */
const TTL_MS = 2 * 60 * 1000; // 2 minutes
const store = new Map();

export function getCached(key) {
  const entry = store.get(key);
  if (!entry || Date.now() > entry.expires) return null;
  return entry.data;
}

export function setCache(key, data) {
  store.set(key, { data, expires: Date.now() + TTL_MS });
}

export function invalidateCache(key) {
  store.delete(key);
}
