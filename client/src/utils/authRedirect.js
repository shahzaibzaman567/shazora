/** Same-origin relative path only (open-redirect safe). */
export const RETURN_TO_STORAGE_KEY = 'shazora_return_to';

export function sanitizeInternalPath(raw) {
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().split(/[\n\r]/)[0];
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null;
  return trimmed;
}

/** React Router may pass `from` as a string path or a Location-like object (e.g. from ProtectedRoute). */
export function pathFromRouterFrom(from) {
  if (!from) return null;
  if (typeof from === 'string') return sanitizeInternalPath(from);
  if (typeof from === 'object' && typeof from.pathname === 'string') {
    const path = from.pathname + (from.search || '') + (from.hash || '');
    return sanitizeInternalPath(path);
  }
  return null;
}

export function peekStoredReturnTo() {
  try {
    return sanitizeInternalPath(sessionStorage.getItem(RETURN_TO_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function clearStoredReturnTo() {
  try {
    sessionStorage.removeItem(RETURN_TO_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Parse ?redirect=checkout or ?redirect=/checkout from login URL (open-redirect safe). */
export function pathFromRedirectQuery(search) {
  if (!search || typeof search !== 'string') return null;
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const raw = params.get('redirect');
  if (!raw) return null;
  const decoded = decodeURIComponent(raw.trim());
  if (decoded === 'checkout') return '/checkout';
  return sanitizeInternalPath(decoded);
}
