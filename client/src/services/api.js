import {
  mongoApi,
  getPublicProducts,
  getPublicProductById,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  adminGetUsers,
  adminGetOrders,
  patchUserRole,
  bulkUpdateOrders,
} from './mongoApi';

export const getProducts = async () => {
  return await getPublicProducts();
};

export const getProductById = async (id) => {
  return await getPublicProductById(id);
};

// Admin operations
export const getAdminAnalytics = async () => {
  const { data } = await mongoApi.get('/admin/analytics');
  return data;
};

export const getAllUsers = async () => {
  const data = await adminGetUsers();
  return data.map(u => ({ ...u, id: u._id || u.id, createdAt: u.createdAt }));
};

export const updateUserRoleProfile = async (userId, role) => {
  return await patchUserRole(userId, role);
};

export const getAllOrders = async () => {
  const data = await adminGetOrders();
  return data.map(o => ({
    ...o,
    id: o._id || o.id,
    totalPrice: o.totalPrice,
    orderStatus: o.orderStatus,
    createdAt: o.createdAt,
    user: o.user || { name: o.shippingAddress?.name || 'Customer', email: '' },
  }));
};

export const updateOrderStatus = async (id, status) => {
  const { data } = await mongoApi.put(`/admin/orders/${id}/status`, { status });
  return data;
};

export const bulkUpdateOrderStatus = async (orderIds, status) => {
  return await bulkUpdateOrders(orderIds, status);
};

export const createProduct = async (payload) => {
  return await adminCreateProduct(payload);
};

export const updateProduct = async (id, payload) => {
  return await adminUpdateProduct(id, payload);
};

export const deleteProduct = async (id) => {
  return await adminDeleteProduct(id);
};

export const createOrder = async (orderPayload) => {
  const { data } = await mongoApi.post('/orders', orderPayload);
  return data;
};

export const createCheckoutSession = async (products, orderId) => {
  const { data } = await mongoApi.post('/payment/create-checkout-session', { products, orderId });
  return data;
};

export const getAvailableDeliveryBoys = async () => [];

export default mongoApi;
