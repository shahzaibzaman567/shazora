import axios from 'axios';

const viteEnv = import.meta.env || {};
const baseURL = viteEnv.VITE_API_BASE_URL || 'http://localhost:5001/api';
export const mongoBaseURL = baseURL;
export const mongoOrigin = new URL(baseURL).origin;
export const googleAuthStartUrl =
  viteEnv.VITE_GOOGLE_AUTH_START_URL || `${mongoOrigin}/api/auth/google`;
export const authSessionApi = axios.create({
  baseURL: `${mongoOrigin}/api/auth`,
  withCredentials: true,
});
export const hasMongoAuthToken = () => Boolean(localStorage.getItem('shazora_jwt'));
export const isMongoConfigured = () => Boolean(baseURL);
export const shouldUseMongoAdmin = () => isMongoConfigured() && hasMongoAuthToken();

/** Axios instance for Mongo/Express API (JWT in localStorage + cookies) */
export const mongoApi = axios.create({
  baseURL,
  withCredentials: true,
});

mongoApi.interceptors.request.use((config) => {
  const t = localStorage.getItem('shazora_jwt');
  if (t) {
    config.headers.Authorization = `Bearer ${t}`;
  }
  return config;
});

// Response interceptor for global error handling
mongoApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    
    // Auto-logout on 401
    if (status === 401 && hasMongoAuthToken()) {
      localStorage.removeItem('shazora_jwt');
      // Redirect to login if window is available
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Return a cleaner error message
    const message = error.response?.data?.message || error.message || 'Server error';
    return Promise.reject(new Error(message));
  }
);

/** --- Users --- */
export async function mongoLogin(email, password) {
  const { data } = await mongoApi.post('/users/login', { email, password });
  if (data.token) localStorage.setItem('shazora_jwt', data.token);
  return normalizeUser(data);
}

export async function mongoFetchProfile() {
  const { data } = await mongoApi.get('/users/profile');
  return normalizeUser(data);
}

export async function fetchSessionProfile() {
  const { data } = await authSessionApi.get('/me');
  return normalizeUser(data);
}

export async function mongoLogout() {
  localStorage.removeItem('shazora_jwt');
}

export async function sessionLogout() {
  await authSessionApi.post('/logout');
}

/** --- Admin --- */
export async function adminGetUsers() {
  const { data } = await mongoApi.get('/admin/users');
  return data;
}

export async function adminGetOrders() {
  const { data } = await mongoApi.get('/admin/orders');
  return data;
}



export async function patchUserRole(userId, role) {
  const { data } = await mongoApi.patch(`/users/${userId}/role`, { role });
  return data;
}

export async function bulkUpdateOrders(orderIds, status) {
  const { data } = await mongoApi.patch('/orders/bulk-update', { orderIds, status });
  return data;
}





function normalizeUser(raw) {
  if (!raw) return null;
  const id = raw._id || raw.id;
  return {
    ...raw,
    id,
    _id: raw._id || id,
  };
}

export function normalizeProduct(raw) {
  if (!raw) return null;
  const id = raw._id != null ? String(raw._id) : String(raw.id ?? '');
  return {
    ...raw,
    id,
    _id: raw._id ?? raw.id,
    countInStock: raw.countInStock ?? raw.count_in_stock ?? 0,
    price: typeof raw.price === 'number' ? raw.price : Number(raw.price) || 0,
    createdAt: raw.createdAt,
  };
}

export async function getPublicProducts() {
  const { data } = await mongoApi.get('/products');
  const list = Array.isArray(data) ? data : [];
  return list.map(normalizeProduct);
}

export async function getPublicProductById(id) {
  const { data } = await mongoApi.get(`/products/${encodeURIComponent(id)}`);
  return normalizeProduct(data);
}

function buildProductPayload(body) {
  return {
    name: String(body.name || '').trim(),
    price: Number(body.price),
    category: String(body.category || 'men').trim(),
    image: String(body.image || '').trim(),
    description: String(body.description || '').trim(),
    brand: String(body.brand || 'Shazora').trim(),
    countInStock: Number(body.countInStock ?? 0),
  };
}

export async function adminCreateProduct(body) {
  const { data } = await mongoApi.post('/products', buildProductPayload(body));
  return normalizeProduct(data);
}

export async function adminUpdateProduct(id, body) {
  const { data } = await mongoApi.put(
    `/products/${encodeURIComponent(id)}`,
    buildProductPayload(body)
  );
  return normalizeProduct(data);
}

export async function adminDeleteProduct(id) {
  await mongoApi.delete(`/products/${encodeURIComponent(id)}`);
}
