import { useEffect, useMemo, useState } from 'react';
import { CheckSquare, RefreshCw, Search, X } from 'lucide-react';
import { bulkUpdateOrderStatus, getAllOrders } from '../../services/api';

const STATUS_STYLES = {
  pending: 'bg-slate-500/10 text-slate-500 border-slate-500/20',
  assigned: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const STATUS_OPTIONS = [
  { value: 'pending', label: 'pending' },
  { value: 'delivered', label: 'delivered' },
  { value: 'cancelled', label: 'cancelled' },
];

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('pending');
  const [bulkLoading, setBulkLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const data = await getAllOrders();
      setOrders(data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      const msg = error.response?.data?.message || error.message || 'Failed to load orders.';
      setFetchError(msg);
    } finally {
      setLoading(false);
    }
  };



  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const q = searchTerm.toLowerCase().replace('shz-', '');
    return orders.filter((o) => {
      const oid = (o._id || o.id || '').toString().toLowerCase();
      const short = oid.slice(-12);
      return oid.includes(q) || short.includes(q);
    });
  }, [orders, searchTerm]);

  const allVisibleSelected =
    filteredOrders.length > 0 &&
    filteredOrders.every((o) => selectedOrderIds.includes(String(o._id || o.id)));

  const toggleSelectionMode = () => {
    setSelectionMode((prev) => {
      if (prev) setSelectedOrderIds([]);
      return !prev;
    });
  };

  const toggleOrderSelection = (orderId) => {
    const id = String(orderId);
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedOrderIds((prev) =>
        prev.filter((id) => !filteredOrders.some((o) => String(o._id || o.id) === id))
      );
      return;
    }
    setSelectedOrderIds((prev) => [
      ...new Set([...prev, ...filteredOrders.map((o) => String(o._id || o.id))]),
    ]);
  };

  const handleBulkStatusApply = async () => {
    if (!selectedOrderIds.length) return;
    setBulkLoading(true);
    try {
      await bulkUpdateOrderStatus(selectedOrderIds, bulkStatus);
      await fetchOrders();
      setSelectedOrderIds([]);
    } catch (error) {
      console.error('Bulk status update failed:', error);
      alert('Failed to update selected orders.');
    } finally {
      setBulkLoading(false);
    }
  };
  if (fetchError && !loading && orders.length === 0) {
    return (
      <div className="glass rounded-3xl p-10 text-center space-y-4">
        <p className="text-red-500 font-bold">{fetchError}</p>
        <button
          type="button"
          onClick={fetchOrders}
          className="px-6 py-3 rounded-2xl bg-accent text-white text-xs font-black uppercase tracking-widest"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by Order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl glass outline-none focus:ring-2 focus:ring-accent text-sm font-bold"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={toggleSelectionMode}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-colors ${
              selectionMode
                ? 'bg-accent text-white'
                : 'text-slate-500 border border-slate-200 dark:border-white/10 hover:text-accent'
            }`}
          >
            {selectionMode ? <X className="w-3.5 h-3.5" /> : <CheckSquare className="w-3.5 h-3.5" />}
            {selectionMode ? 'Exit Selection' : 'Select Orders'}
          </button>
          <span className="text-sm text-slate-500">
            {filteredOrders.length} of {orders.length} orders
          </span>
        </div>
      </div>

      <div className="glass rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center">
          <h3 className="text-xl font-bold">All Orders</h3>
          <button
            type="button"
            onClick={fetchOrders}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-accent transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                {selectionMode && (
                  <th className="px-5 py-4 font-semibold">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={handleSelectAllVisible}
                      aria-label="Select all visible orders"
                    />
                  </th>
                )}
                <th className="px-5 py-4 font-semibold">Order ID</th>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Delivery Boy</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredOrders.map((order) => {
                const oid = String(order._id || order.id);
                const selected = selectedOrderIds.includes(oid);
                const statusKey = String(order.status || order.orderStatus || 'pending').toLowerCase();

                return (
                  <tr
                    key={oid}
                    className={`transition-colors cursor-pointer ${
                      selected
                        ? 'bg-accent/10 hover:bg-accent/15'
                        : 'hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                    onClick={() => {
                      if (!selectionMode) {
                        setSelectionMode(true);
                        setSelectedOrderIds([oid]);
                        return;
                      }
                      toggleOrderSelection(oid);
                    }}
                  >
                    {selectionMode && (
                      <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleOrderSelection(oid)}
                          aria-label={`Select order ${oid}`}
                        />
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <div>
                        <code className="font-mono text-xs text-accent font-bold">
                          SHZ-{oid.slice(-8).toUpperCase()}
                        </code>
                        <p className="text-[10px] text-slate-400 mt-0.5">…{oid.slice(-4)}</p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm font-bold">{order.user?.name || 'Customer'}</p>
                      {order.user?.email && (
                        <p className="text-[10px] text-slate-400">{order.user.email}</p>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-[10px] text-slate-400">—</span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-500">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          STATUS_STYLES[statusKey] || STATUS_STYLES.pending
                        }`}
                      >
                        {statusKey}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={selectionMode ? 6 : 5} className="px-6 py-12 text-center text-slate-500">
                    {searchTerm ? `No orders found matching "${searchTerm}"` : 'No orders found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectionMode && selectedOrderIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[min(96vw,960px)] glass rounded-2xl border border-accent/20 shadow-2xl shadow-accent/20 p-4 z-50">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <p className="text-sm font-bold">
              {selectedOrderIds.length} order{selectedOrderIds.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={handleSelectAllVisible}
                className="px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-accent"
              >
                {allVisibleSelected ? 'Unselect Visible' : 'Select All Visible'}
              </button>
              <select
                className="px-3 py-2 rounded-xl bg-slate-900 border border-white/20 text-white text-xs font-bold"
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleBulkStatusApply}
                disabled={bulkLoading}
                className="px-3 py-2 rounded-xl bg-accent text-white text-xs font-black uppercase tracking-widest disabled:opacity-60"
              >
                Apply Status
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManager;
