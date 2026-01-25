
import React, { useState } from 'react';
import { Customer, ProjectStatus, User as AppUser, Role } from '../types';
import { STATUS_COLORS } from '../constants';
import { 
  ChevronRight, 
  MessageSquare, 
  History, 
  User, 
  Zap, 
  PlusCircle, 
  Calendar,
  Search,
  Lock
} from 'lucide-react';

interface Props {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  currentUser: AppUser;
}

const ProgressTracking: React.FC<Props> = ({ customers, setCustomers, currentUser }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');

  const statuses = Object.values(ProjectStatus);

  const updateStatus = (id: string, newStatus: ProjectStatus) => {
    // RBAC check
    if (currentUser.role === Role.TECHNICIAN) {
      const allowed = [ProjectStatus.SURVEYED, ProjectStatus.INSTALLING, ProjectStatus.COMPLETED];
      if (!allowed.includes(newStatus)) {
        alert('Kỹ thuật viên chỉ có quyền cập nhật Khảo sát/Lắp đặt/Hoàn thành.');
        return;
      }
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newNote = {
          id: Date.now().toString(),
          status: newStatus,
          note: `Cập nhật bởi ${currentUser.fullName}: Chuyển trạng thái sang ${newStatus}`,
          updatedAt: new Date().toISOString()
        };
        return { ...c, status: newStatus, notes: [newNote, ...c.notes] };
      }
      return c;
    }));
  };

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !noteText.trim()) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === selectedCustomerId) {
        const newNote = {
          id: Date.now().toString(),
          status: c.status,
          note: `${currentUser.fullName}: ${noteText}`,
          updatedAt: new Date().toISOString()
        };
        return { ...c, notes: [newNote, ...c.notes] };
      }
      return c;
    }));
    setNoteText('');
  };

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Filter project cards by visibility
  const visibleCustomers = customers.filter(c => 
    currentUser.role === Role.ADMIN || c.assignedTo === currentUser.id
  );

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Quy trình triển khai</h2>
          <p className="text-sm text-gray-500">Quản lý các giai đoạn từ khảo sát đến hoàn thành</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-500">
          <Search size={16} />
          <input type="text" placeholder="Lọc dự án..." className="outline-none" />
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map(status => (
          <div key={status} className="flex-shrink-0 w-80 flex flex-col gap-4">
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-200 border-l-4" style={{ borderLeftColor: '#004182' }}>
              <h3 className="text-sm font-bold text-gray-700">{status}</h3>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {visibleCustomers.filter(c => c.status === status).length}
              </span>
            </div>
            
            <div className="flex-1 flex flex-col gap-3">
              {visibleCustomers.filter(c => c.status === status).map(customer => (
                <div 
                  key={customer.id} 
                  onClick={() => setSelectedCustomerId(customer.id)}
                  className={`bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all group ${selectedCustomerId === customer.id ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400">#CUST-{customer.id.substring(0, 4)}</span>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-indigo-100 border-2 border-white"></div>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{customer.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{customer.address}</p>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded">
                      <Zap size={12} className="text-blue-500" /> {customer.chargerType}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
              
              {currentUser.role !== Role.TECHNICIAN && (
                <button className="py-2 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 flex items-center justify-center hover:border-blue-300 hover:text-blue-400 transition-colors">
                  <PlusCircle size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      {selectedCustomer && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-vinfast-blue text-white">
            <div>
              <h3 className="font-bold text-lg leading-tight">{selectedCustomer.name}</h3>
              <p className="text-xs text-white/70">ID: {selectedCustomer.id} | Phân phối cho: {selectedCustomer.assignedTo || 'Chưa giao'}</p>
            </div>
            <button onClick={() => setSelectedCustomerId(null)} className="p-1 hover:bg-white/10 rounded">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <section>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                Cập nhật trạng thái
                {currentUser.role === Role.TECHNICIAN && <Lock size={12} />}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {statuses.map(s => {
                  const isLocked = currentUser.role === Role.TECHNICIAN && 
                    ![ProjectStatus.SURVEYED, ProjectStatus.INSTALLING, ProjectStatus.COMPLETED].includes(s);
                  
                  return (
                    <button
                      key={s}
                      disabled={isLocked}
                      onClick={() => updateStatus(selectedCustomer.id, s)}
                      className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                        selectedCustomer.status === s 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                        : isLocked ? 'bg-gray-100 text-gray-300 cursor-not-allowed opacity-50' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {s}
                      {isLocked && <Lock size={14} />}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lịch sử chăm sóc</h4>
                <History size={16} className="text-gray-300" />
              </div>
              
              <form onSubmit={addNote} className="mb-6">
                <textarea 
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none h-24"
                  placeholder="Nhập ghi chú hoặc kết quả khảo sát..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button 
                  type="submit"
                  className="w-full mt-2 bg-vinfast-blue text-white py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-sm"
                >
                  Lưu nhật ký
                </button>
              </form>

              <div className="space-y-4">
                {selectedCustomer.notes.map(note => (
                  <div key={note.id} className="relative pl-6 pb-4 border-l border-gray-100 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white"></div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">{note.status}</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-1"><Calendar size={10} /> {new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed">{note.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracking;
