
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Filter, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  Download,
  Phone,
  MapPin,
  Building2,
  User as UserIcon,
  X,
  Calendar,
  Zap,
  CheckCircle2,
  Info,
  UserCheck,
  Building,
  ClipboardList,
  UserPlus,
  Share2,
  Briefcase,
  Type as TypeIcon
} from 'lucide-react';
import { Customer, CustomerType, ProjectStatus, ChargerType, User as AppUser, Role, CustomerSource } from '../types';
import { STATUS_COLORS } from '../constants';

interface Props {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  currentUser: AppUser;
  users: AppUser[];
}

type ModalType = 'NONE' | 'ADD' | 'EDIT' | 'VIEW';

const CustomerManagement: React.FC<Props> = ({ customers, setCustomers, currentUser, users }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [activeModal, setActiveModal] = useState<ModalType>('NONE');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomSource, setIsCustomSource] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    type: CustomerType.INDIVIDUAL,
    source: CustomerSource.HOTLINE as string,
    assignedTo: currentUser.id,
    customerNote: '', 
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.phone.includes(searchTerm);
    const matchesType = filterType === 'All' || c.type === filterType;
    const hasPermission = currentUser.role === Role.ADMIN || c.assignedTo === currentUser.id;
    return matchesSearch && matchesType && hasPermission;
  });

  const handleOpenAdd = () => {
    setFormData({ 
      name: '', 
      phone: '', 
      address: '', 
      type: CustomerType.INDIVIDUAL,
      source: CustomerSource.WEBSITE,
      assignedTo: currentUser.id,
      customerNote: '',
    });
    setIsCustomSource(false);
    setActiveModal('ADD');
  };

  const handleOpenEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    const lastNote = customer.notes.length > 0 ? customer.notes[customer.notes.length - 1].note : '';
    
    // Check if current source is one of the standard ones
    const isStandard = Object.values(CustomerSource).includes(customer.source as any);
    setIsCustomSource(!isStandard);

    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      type: customer.type,
      source: customer.source || CustomerSource.WEBSITE,
      assignedTo: customer.assignedTo || currentUser.id,
      customerNote: lastNote,
    });
    setActiveModal('EDIT');
  };

  const handleOpenView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveModal('VIEW');
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Date.now().toString(),
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      type: formData.type,
      source: formData.source,
      chargerType: ChargerType.KW7,
      status: ProjectStatus.NEW,
      location: { lat: 21.0285 + (Math.random() - 0.5) * 0.1, lng: 105.8542 + (Math.random() - 0.5) * 0.1 },
      notes: formData.customerNote ? [{
        id: `note-${Date.now()}`,
        status: ProjectStatus.NEW,
        note: formData.customerNote,
        updatedAt: new Date().toISOString()
      }] : [],
      proposals: [],
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id,
      assignedTo: formData.assignedTo
    };
    setCustomers([newCustomer, ...customers]);
    setActiveModal('NONE');
  };

  const handleUpdateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomer) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomer.id) {
        const updatedNotes = [...c.notes];
        if (formData.customerNote && (!c.notes.length || c.notes[0].note !== formData.customerNote)) {
          updatedNotes.unshift({
            id: `note-${Date.now()}`,
            status: c.status,
            note: formData.customerNote,
            updatedAt: new Date().toISOString()
          });
        }
        return { 
          ...c, 
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          type: formData.type,
          source: formData.source,
          assignedTo: formData.assignedTo,
          notes: updatedNotes
        };
      }
      return c;
    }));
    setActiveModal('NONE');
  };

  const deleteCustomer = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const getUserNameById = (id?: string) => {
    if (!id) return 'Chưa xác định';
    const user = users.find(u => u.id === id);
    return user ? user.fullName : `ID: ${id}`;
  };

  const canEdit = (customer: Customer) => 
    currentUser.role === Role.ADMIN || (currentUser.role === Role.SALES && customer.assignedTo === currentUser.id);

  const canDelete = currentUser.role === Role.ADMIN;

  const standardSources = Object.values(CustomerSource);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm tên, số điện thoại..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="outline-none text-sm bg-transparent font-medium text-gray-700"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">Tất cả khách hàng</option>
              <option value={CustomerType.INDIVIDUAL}>Khách cá nhân</option>
              <option value={CustomerType.BUSINESS}>Khách doanh nghiệp</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 bg-white transition-colors">
            <Download size={18} /> Xuất Excel
          </button>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-vinfast-blue text-white rounded-lg text-sm font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} /> Thêm khách hàng
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nguồn / Phụ trách</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${customer.type === CustomerType.BUSINESS ? 'bg-indigo-500' : 'bg-blue-500'}`}>
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-800">{customer.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full self-start max-w-[140px] truncate" title={customer.source}>
                        {customer.source}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Briefcase size={10} /> {getUserNameById(customer.assignedTo)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-700 font-medium">
                        {new Date(customer.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                      <span className="text-[10px] text-gray-400">Bởi: {getUserNameById(customer.createdBy)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${STATUS_COLORS[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => handleOpenView(customer)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      {canEdit(customer) && (
                        <button 
                          onClick={() => handleOpenEdit(customer)}
                          className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                          title="Sửa thông tin"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => deleteCustomer(customer.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Xóa khách hàng"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(activeModal === 'ADD' || activeModal === 'EDIT') && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
            {/* Modal Header */}
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {activeModal === 'ADD' ? 'Khởi tạo hồ sơ khách hàng' : 'Cập nhật hồ sơ'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Hệ thống ghi nhận nhân sự: <span className="text-blue-600 font-bold">{currentUser.fullName}</span></p>
              </div>
              <button 
                onClick={() => setActiveModal('NONE')} 
                className="hover:bg-gray-100 p-2 rounded-full transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            {/* Tab Switching UI */}
            <div className="px-8 pt-6">
              <div className="bg-gray-100 p-1.5 rounded-2xl flex items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: CustomerType.INDIVIDUAL })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.type === CustomerType.INDIVIDUAL 
                    ? 'bg-white text-blue-700 shadow-sm transform scale-[1.02]' 
                    : 'text-gray-500 hover:bg-gray-200/50'
                  }`}
                >
                  <UserCheck size={18} />
                  Khách hàng Cá nhân
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: CustomerType.BUSINESS })}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
                    formData.type === CustomerType.BUSINESS 
                    ? 'bg-white text-blue-700 shadow-sm transform scale-[1.02]' 
                    : 'text-gray-500 hover:bg-gray-200/50'
                  }`}
                >
                  <Building size={18} />
                  Khách hàng Doanh nghiệp
                </button>
              </div>
            </div>

            <form onSubmit={activeModal === 'ADD' ? handleAddCustomer : handleUpdateCustomer} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    {formData.type === CustomerType.INDIVIDUAL ? 'Họ và tên chủ hộ' : 'Tên pháp nhân doanh nghiệp'}
                  </label>
                  <input 
                    required
                    type="text" 
                    placeholder={formData.type === CustomerType.INDIVIDUAL ? "Ví dụ: Nguyễn Văn A" : "Ví dụ: Công ty CP VinFast"}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Số điện thoại liên hệ</label>
                  <input 
                    required
                    type="tel" 
                    placeholder="09xx xxx xxx"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Nguồn tiếp nhận</label>
                    <button 
                      type="button" 
                      onClick={() => setIsCustomSource(!isCustomSource)}
                      className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {isCustomSource ? 'Chọn từ danh sách' : 'Tự nhập mới'}
                    </button>
                  </div>
                  
                  {isCustomSource ? (
                    <div className="relative">
                      <TypeIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={14} />
                      <input 
                        required
                        type="text" 
                        placeholder="Nhập nguồn mới..."
                        className="w-full pl-10 pr-4 py-2.5 bg-blue-50/50 border border-blue-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                        value={formData.source}
                        onChange={(e) => setFormData({...formData, source: e.target.value})}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <select 
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                      value={standardSources.includes(formData.source as any) ? formData.source : 'Other'}
                      onChange={(e) => {
                        if (e.target.value === 'Other') {
                          setIsCustomSource(true);
                          setFormData({...formData, source: ''});
                        } else {
                          setFormData({...formData, source: e.target.value});
                        }
                      }}
                    >
                      {standardSources.map(s => <option key={s} value={s}>{s}</option>)}
                      <option value="Other">-- Khác (Tự nhập) --</option>
                    </select>
                  )}
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Người phụ trách chính</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
                  >
                    {users.map(u => <option key={u.id} value={u.id}>{u.fullName} ({u.role})</option>)}
                  </select>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Ngày tạo</label>
                  <div className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-bold text-gray-400 flex items-center gap-2 cursor-not-allowed">
                    <Calendar size={16} />
                    {activeModal === 'ADD' ? new Date().toLocaleDateString('vi-VN') : new Date(selectedCustomer?.createdAt || '').toLocaleDateString('vi-VN')}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Địa chỉ lắp đặt</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      required
                      type="text" 
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide flex items-center gap-2">
                    <ClipboardList size={14} /> Ghi chú ban đầu
                  </label>
                  <textarea 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm font-medium h-20 resize-none"
                    value={formData.customerNote}
                    onChange={(e) => setFormData({...formData, customerNote: e.target.value})}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setActiveModal('NONE')} className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Hủy</button>
                <button type="submit" className="flex-1 py-3 bg-vinfast-blue text-white rounded-xl text-sm font-bold hover:bg-blue-800 shadow-xl shadow-blue-200">
                  {activeModal === 'ADD' ? 'Khởi tạo hồ sơ' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {activeModal === 'VIEW' && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-vinfast-blue text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Info size={20} /> Hồ sơ chi tiết khách hàng
              </h3>
              <button onClick={() => setActiveModal('NONE')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-10">
                {/* Profile Section */}
                <div className="flex flex-col items-center text-center space-y-4 md:w-1/3 border-r border-gray-100 pr-8">
                  <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-5xl font-bold text-white shadow-2xl ${selectedCustomer.type === CustomerType.BUSINESS ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                    {selectedCustomer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-900 leading-tight">{selectedCustomer.name}</h4>
                    <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{selectedCustomer.type}</p>
                    <div className="mt-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${STATUS_COLORS[selectedCustomer.status]}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Đường dây liên hệ</p>
                      <p className="text-sm text-gray-800 font-bold flex items-center gap-2"><Phone size={14} className="text-blue-600"/> {selectedCustomer.phone}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nguồn khách hàng</p>
                      <p className="text-sm text-indigo-700 font-bold flex items-center gap-2" title={selectedCustomer.source}><Share2 size={14} className="text-indigo-600"/> <span className="truncate max-w-[150px]">{selectedCustomer.source || 'Chưa cập nhật'}</span></p>
                    </div>
                    <div className="col-span-2 space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Địa chỉ lắp đặt</p>
                      <p className="text-sm text-gray-800 font-bold flex items-center gap-2"><MapPin size={14} className="text-red-500 shrink-0"/> {selectedCustomer.address}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Hệ thống sạc</p>
                      <p className="text-sm text-gray-800 font-bold flex items-center gap-2"><Zap size={14} className="text-amber-500"/> {selectedCustomer.chargerType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ngày tiếp nhận</p>
                      <p className="text-sm text-gray-800 font-bold flex items-center gap-2"><Calendar size={14} className="text-gray-400"/> {new Date(selectedCustomer.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  {/* Governance Section */}
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><UserPlus size={10} /> Người khởi tạo</p>
                        <p className="text-xs font-bold text-gray-700">{getUserNameById(selectedCustomer.createdBy)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><CheckCircle2 size={10} /> Người phụ trách chính</p>
                        <p className="text-xs font-bold text-blue-700">{getUserNameById(selectedCustomer.assignedTo)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {selectedCustomer.notes.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nhật ký ghi chú gần nhất</p>
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-xs text-amber-900 italic font-medium">
                        "{selectedCustomer.notes[0].note}"
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button onClick={() => setActiveModal('NONE')} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200">Đóng</button>
                {canEdit(selectedCustomer) && (
                  <button onClick={() => handleOpenEdit(selectedCustomer)} className="flex-1 py-4 bg-vinfast-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-800 shadow-xl shadow-blue-100">Sửa thông tin</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;
