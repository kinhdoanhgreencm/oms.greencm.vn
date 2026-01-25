
import React, { useState } from 'react';
import { Customer, TechnicalProposal, User, Role } from '../types';
import { 
  FileText, 
  ChevronRight, 
  Download, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  PlusCircle,
  Save,
  CheckCircle,
  Zap
} from 'lucide-react';

interface Props {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  currentUser: User;
}

const ConsultationPlans: React.FC<Props> = ({ customers, setCustomers, currentUser }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposalId, setEditingProposalId] = useState<string | null>(null);
  
  // Local state for proposal form
  const [proposalForm, setProposalForm] = useState<{
    title: string;
    items: { description: string; quantity: number; unit: string; price: number }[];
  }>({
    title: '',
    items: [{ description: '', quantity: 1, unit: 'Bộ', price: 0 }]
  });

  // RBAC: Filter customers visible to the current user
  const visibleCustomers = customers.filter(c => {
    if (currentUser.role === Role.ADMIN) return true;
    return c.assignedTo === currentUser.id || c.createdBy === currentUser.id;
  });

  const selectedCustomer = visibleCustomers.find(c => c.id === selectedCustomerId);

  const handleOpenAdd = () => {
    setEditingProposalId(null);
    setProposalForm({
      title: 'Phương án kỹ thuật mới',
      items: [{ description: '', quantity: 1, unit: 'Bộ', price: 0 }]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (proposal: TechnicalProposal) => {
    setEditingProposalId(proposal.id);
    setProposalForm({
      title: proposal.title,
      items: [...proposal.items]
    });
    setIsModalOpen(true);
  };

  const handleAddItem = () => {
    setProposalForm({
      ...proposalForm,
      items: [...proposalForm.items, { description: '', quantity: 1, unit: 'Bộ', price: 0 }]
    });
  };

  const handleRemoveItem = (index: number) => {
    setProposalForm({
      ...proposalForm,
      items: proposalForm.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...proposalForm.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setProposalForm({ ...proposalForm, items: newItems });
  };

  const handleSaveProposal = () => {
    if (!selectedCustomerId) return;
    
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        let updatedProposals = [...c.proposals];
        if (editingProposalId) {
          updatedProposals = updatedProposals.map(p => 
            p.id === editingProposalId 
            ? { ...p, title: proposalForm.title, items: proposalForm.items } 
            : p
          );
        } else {
          const newProposal: TechnicalProposal = {
            id: `p-${Date.now()}`,
            title: proposalForm.title,
            items: proposalForm.items,
            createdAt: new Date().toISOString()
          };
          updatedProposals.unshift(newProposal);
        }
        return { ...c, proposals: updatedProposals };
      }
      return c;
    }));
    
    setIsModalOpen(false);
  };

  const handleDeleteProposal = (proposalId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa phương án này?')) return;
    
    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        return { ...c, proposals: c.proposals.filter(p => p.id !== proposalId) };
      }
      return c;
    }));
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      {/* Sidebar List */}
      <div className="w-full lg:w-1/3 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">Danh sách dự án</h3>
          <p className="text-xs text-gray-500 mt-1">
            {currentUser.role === Role.ADMIN ? 'Tất cả khách hàng hệ thống' : 'Khách hàng bạn phụ trách'}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {visibleCustomers.length > 0 ? (
            visibleCustomers.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCustomerId(c.id)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex items-center justify-between border-b border-gray-50 ${selectedCustomerId === c.id ? 'bg-blue-50 border-blue-200' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${c.type === 'Doanh nghiệp' ? 'bg-indigo-500' : 'bg-blue-500'}`}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.proposals.length} phương án đã lập</p>
                  </div>
                </div>
                <ChevronRight size={18} className={selectedCustomerId === c.id ? 'text-blue-500' : 'text-gray-300'} />
              </button>
            ))
          ) : (
            <div className="p-12 text-center text-gray-400">
              <p className="text-sm font-medium">Không tìm thấy khách hàng nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {selectedCustomer ? (
          <div className="flex flex-col h-full gap-6">
            {/* Project Header */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Phương án Kỹ thuật</h3>
                  <p className="text-sm text-gray-500">{selectedCustomer.name} - {selectedCustomer.address}</p>
                </div>
              </div>
              <button 
                onClick={handleOpenAdd}
                className="flex items-center gap-2 px-4 py-2 bg-vinfast-blue text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-800 transition-all"
              >
                <Plus size={18} /> Thêm phương án mới
              </button>
            </div>

            {/* Proposals List */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-6">
              {selectedCustomer.proposals.length > 0 ? (
                selectedCustomer.proposals.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <div>
                        <h4 className="text-base font-bold text-gray-800 flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          {p.title}
                        </h4>
                        <p className="text-[11px] text-gray-400 mt-0.5">Ngày tạo: {new Date(p.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleOpenEdit(p)}
                          className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteProposal(p.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100">
                          <Download size={14} /> PDF
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-0">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/30 border-b border-gray-100">
                          <tr>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Hạng mục</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">ĐVT</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">SL</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-40">Đơn giá</th>
                            <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-40">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {p.items.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-3 text-sm font-medium text-gray-700">{item.description}</td>
                              <td className="px-6 py-3 text-sm text-gray-600 text-center">{item.unit}</td>
                              <td className="px-6 py-3 text-sm text-gray-600 text-center">{item.quantity}</td>
                              <td className="px-6 py-3 text-sm text-gray-600 text-right">{item.price.toLocaleString('vi-VN')} đ</td>
                              <td className="px-6 py-3 text-sm font-bold text-gray-800 text-right">{(item.quantity * item.price).toLocaleString('vi-VN')} đ</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-blue-50/30">
                          <tr>
                            <td colSpan={4} className="px-6 py-4 text-right font-black text-gray-500 text-xs uppercase tracking-widest">TỔNG CỘNG TẠM TÍNH</td>
                            <td className="px-6 py-4 text-right font-black text-blue-700 text-base">{calculateTotal(p.items).toLocaleString('vi-VN')} đ</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-64 bg-white rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center p-8">
                  <FileText size={32} className="text-gray-300 mb-2" />
                  <p className="text-sm font-bold text-gray-400">Chưa có phương án nào được lập</p>
                  <button 
                    onClick={handleOpenAdd}
                    className="mt-4 text-sm text-blue-600 font-bold hover:underline"
                  >
                    + Tạo phương án đầu tiên ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="h-full bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center p-12">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-6">
              <Zap size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Chưa chọn khách hàng</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Vui lòng chọn một khách hàng từ danh sách bên trái để quản lý các phương án kỹ thuật và báo giá vật tư.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-200">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-vinfast-blue text-white shrink-0">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <FileText size={20} /> {editingProposalId ? 'Cập nhật phương án' : 'Khởi tạo phương án mới'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tên phương án</label>
                  <input 
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={proposalForm.title}
                    onChange={(e) => setProposalForm({ ...proposalForm, title: e.target.value })}
                    placeholder="Ví dụ: Phương án thi công hầm B1"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Danh mục vật tư & thiết bị</label>
                    <button 
                      onClick={handleAddItem}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                    >
                      <PlusCircle size={14} /> Thêm hạng mục
                    </button>
                  </div>

                  <div className="border border-gray-100 rounded-2xl overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Mô tả hạng mục</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">ĐVT</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center w-24">SL</th>
                          <th className="px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right w-40">Đơn giá</th>
                          <th className="px-4 py-3 w-12"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {proposalForm.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2">
                              <input 
                                type="text"
                                className="w-full px-3 py-2 bg-white border border-transparent rounded-lg text-sm focus:border-blue-200 outline-none"
                                value={item.description}
                                onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                                placeholder="Tên vật tư..."
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="text"
                                className="w-full px-3 py-2 bg-white border border-transparent rounded-lg text-sm text-center focus:border-blue-200 outline-none"
                                value={item.unit}
                                onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-transparent rounded-lg text-sm text-center focus:border-blue-200 outline-none"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(idx, 'quantity', parseInt(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-2">
                              <input 
                                type="number"
                                className="w-full px-3 py-2 bg-white border border-transparent rounded-lg text-sm text-right focus:border-blue-200 outline-none font-bold text-blue-700"
                                value={item.price}
                                onChange={(e) => handleItemChange(idx, 'price', parseInt(e.target.value) || 0)}
                              />
                            </td>
                            <td className="p-2 text-center">
                              <button 
                                onClick={() => handleRemoveItem(idx)}
                                className="p-1 text-gray-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-blue-50 rounded-2xl border border-blue-100">
                   <p className="text-sm font-bold text-blue-800 uppercase tracking-widest">Tổng thành tiền tạm tính:</p>
                   <p className="text-2xl font-black text-blue-700">{calculateTotal(proposalForm.items).toLocaleString('vi-VN')} đ</p>
                </div>
              </div>
            </div>

            <div className="px-8 py-6 border-t border-gray-100 flex gap-4 bg-gray-50 shrink-0">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSaveProposal}
                className="flex-1 py-3 bg-vinfast-blue text-white rounded-xl text-sm font-bold hover:bg-blue-800 shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Save size={18} /> {editingProposalId ? 'Cập nhật ngay' : 'Xác nhận tạo phương án'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPlans;
