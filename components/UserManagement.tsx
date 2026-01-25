
import React, { useState } from 'react';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  Shield, 
  Mail, 
  Calendar,
  X,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { User, Role } from '../types';

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const UserManagement: React.FC<Props> = ({ users, setUsers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: Role.SALES,
  });

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `u${Date.now()}`,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: true,
      assignedCustomers: [],
      createdAt: new Date().toISOString()
    };
    setUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ fullName: '', email: '', role: Role.SALES });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: !u.status } : u
    ));
  };

  const deleteUser = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const getRoleBadge = (role: Role) => {
    const configs = {
      [Role.ADMIN]: 'bg-red-100 text-red-700',
      [Role.SALES]: 'bg-green-100 text-green-700',
      [Role.TECHNICIAN]: 'bg-purple-100 text-purple-700'
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${configs[role]}`}>{role}</span>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quản trị nhân sự</h2>
          <p className="text-sm text-gray-500">Quản lý tài khoản và phân quyền hệ thống CRM</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm nhân viên..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm w-64 outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-vinfast-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            <UserPlus size={18} /> Thêm nhân sự
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Họ và tên</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quyền hạn</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 border border-gray-200">
                      {user.fullName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{user.fullName}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail size={12} /> {user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getRoleBadge(user.role)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                    onClick={() => toggleUserStatus(user.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold ${user.status ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {user.status ? <ToggleRight className="text-green-500" /> : <ToggleLeft />}
                    {user.status ? 'Hoạt động' : 'Đã khóa'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <p className="text-xs text-gray-500 flex items-center gap-1"><Calendar size={12} /> {new Date(user.createdAt).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit2 size={16} />
                    </button>
                    {user.role !== Role.ADMIN && (
                      <button 
                        onClick={() => deleteUser(user.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-vinfast-blue text-white">
              <h3 className="text-lg font-bold flex items-center gap-2"><UserPlus size={20} /> Tạo tài khoản nhân sự</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-1 rounded"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (Đăng nhập)</label>
                <input 
                  required
                  type="email" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cấp quyền (Roles)</label>
                <select 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                >
                  <option value={Role.SALES}>Sales (Nhân viên kinh doanh)</option>
                  <option value={Role.TECHNICIAN}>Technician (Kỹ thuật viên)</option>
                  <option value={Role.ADMIN}>Admin (Quản trị viên)</option>
                </select>
                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-[10px] font-bold text-blue-700 uppercase mb-1 flex items-center gap-1"><Shield size={10} /> Quyền hạn dự kiến:</p>
                  <p className="text-[11px] text-blue-600 leading-tight">
                    {formData.role === Role.SALES ? 'Quản lý khách hàng của mình, tạo phương án báo giá, cập nhật tiến độ.' : 
                     formData.role === Role.TECHNICIAN ? 'Xem vị trí bản đồ, khảo sát thực tế, cập nhật tình trạng lắp đặt.' : 
                     'Toàn quyền quản trị hệ thống, nhân sự và xem báo cáo tổng quát.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-2 bg-vinfast-blue text-white rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-200">Kích hoạt tài khoản</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
