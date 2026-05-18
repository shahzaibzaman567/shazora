import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import {
  createProduct as insforgeCreateProduct,
  deleteProduct as insforgeDeleteProduct,
  getProducts as getInsforgeProducts,
  updateProduct as insforgeUpdateProduct,
} from '../../services/api';
import { useToast } from '../../context/ToastContext.jsx';

const emptyForm = () => ({
  name: '',
  price: '',
  category: 'men',
  image: '',
  description: '',
  countInStock: '10',
});

const ProductManager = () => {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getInsforgeProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
      showToast(
        error.response?.data?.message || error.message || 'Could not load products',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const productRowId = (p) => p.id || p._id;

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await insforgeDeleteProduct(id);
      showToast('Product deleted');
      fetchProducts();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceNum = Number(formData.price);
    const stockNum = Number(formData.countInStock);
    if (!formData.name.trim() || Number.isNaN(priceNum)) {
      showToast('Please enter valid name and price', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        price: priceNum,
        countInStock: Number.isNaN(stockNum) ? 0 : stockNum,
      };
      if (editingProduct) {
        await insforgeUpdateProduct(productRowId(editingProduct), payload);
        showToast('Product updated');
      } else {
        await insforgeCreateProduct(payload);
        showToast('Product created');
      }
      await fetchProducts();
      closeModal();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save product', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        price: String(product.price ?? ''),
        category: product.category || 'men',
        image: product.image || '',
        description: product.description || '',
        countInStock: String(product.countInStock ?? product.count_in_stock ?? 10),
      });
    } else {
      setEditingProduct(null);
      setFormData(emptyForm());
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(
    (p) =>
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl glass outline-none focus:ring-2 focus:ring-accent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={() => openModal()}
          className="bg-gradient-custom px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Product</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Price</th>
              <th className="px-6 py-4 font-semibold">Stock</th>
              <th className="px-6 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {filteredProducts.map((product) => (
              <tr key={productRowId(product)} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={product.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                    <span className="font-semibold">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 capitalize">{product.category}</td>
                <td className="px-6 py-4 font-bold text-accent">${product.price}</td>
                <td className="px-6 py-4 text-sm">{product.countInStock ?? '—'}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => openModal(product)}
                      className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(productRowId(product))}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProducts.length === 0 && (
          <p className="px-6 py-12 text-center text-slate-500">No products match your search.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass w-full max-w-lg rounded-3xl p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-6 top-6 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                type="text"
                placeholder="Product Name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="flex gap-4">
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  className="w-1/2 px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                <select
                  className="w-1/2 px-4 py-3 rounded-xl bg-slate-900 text-white border border-white/20 outline-none font-bold cursor-pointer"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="men" className="bg-slate-900">
                    Men
                  </option>
                  <option value="women" className="bg-slate-900">
                    Women
                  </option>
                </select>
              </div>
              <input
                type="number"
                min="0"
                placeholder="Stock count"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none"
                value={formData.countInStock}
                onChange={(e) => setFormData({ ...formData, countInStock: e.target.value })}
              />
              <input
                required
                type="text"
                placeholder="Image URL"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 outline-none h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-custom py-4 rounded-xl font-bold disabled:opacity-60"
              >
                {submitting ? 'Saving…' : editingProduct ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
