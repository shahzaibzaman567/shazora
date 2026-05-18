import { useState, useEffect } from 'react';
import { User, Shield, RefreshCw } from 'lucide-react';
import { getAllUsers, updateUserRoleProfile } from '../../services/api';

const ROLE_OPTIONS = [
  { value: 'customer', label: 'customer' },
  { value: 'admin', label: 'admin' },
];

const ADMIN_OWNER_EMAIL = 'shahzaibzaman465@gmail.com';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRoleProfile(userId, newRole);
      setUsers((prev) =>
        prev.map((u) =>
          String(u._id || u.id) === String(userId) ? { ...u, role: newRole } : u
        )
      );
    } catch (e) {
      console.error(e);
      alert(e.message || 'Could not update role.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:divide-white/5 flex justify-between items-center">
        <h3 className="text-xl font-bold">Registered Users</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Email</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {users.map((user) => (
              <tr key={user._id || user.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                      <User className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-medium">{user.email}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      user.status === 'inactive'
                        ? 'bg-red-500/15 text-red-600 dark:text-red-400'
                        : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {user.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400 hidden sm:block" />
                    <select
                      className="text-xs font-bold rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-secondary px-3 py-2 max-w-[180px]"
                      value={['admin', 'customer', 'delivery_boy'].includes(user.role) ? user.role : 'customer'}
                      disabled={
                        updatingId === String(user._id || user.id) ||
                        user.email?.toLowerCase() === ADMIN_OWNER_EMAIL
                      }
                      onChange={(e) => handleRoleChange(user._id || user.id, e.target.value)}
                    >
                      {ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;
