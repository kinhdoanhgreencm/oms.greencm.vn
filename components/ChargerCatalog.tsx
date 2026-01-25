
import React, { useState } from 'react';
import { 
  Zap, 
  ShieldCheck, 
  Tag, 
  Info, 
  Filter, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Save, 
  PlusCircle, 
  MinusCircle 
} from 'lucide-react';
import { ChargerModel, ChargerBrand, User, Role } from '../types';

interface Props {
  chargers: ChargerModel[];
  setChargers: React.Dispatch<React.SetStateAction<ChargerModel[]>>;
  currentUser: User;
}

type ModalType = 'NONE' | 'ADD' | 'EDIT';

const ChargerCatalog: React.FC<Props> = ({ chargers, setChargers, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState<'All' | ChargerBrand>('All');
  const [activeModal, setActiveModal] = useState<ModalType>('NONE');
  const [selectedCharger, setSelectedCharger] = useState<ChargerModel | null>(null);
  
  const [formData, setFormData] = useState<Omit<ChargerModel, 'id'>>({
    name: '',
    power: '',
    type: 'AC',
    brand: ChargerBrand.CHARGECORE,
    price: 0,
    features: ['']
  });

  const filteredChargers = chargers.filter(charger => {
    const matchesSearch = charger.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || charger.brand === brandFilter;
    return matchesSearch && matchesBrand;
  });

  const isAdmin = currentUser.role === Role.ADMIN;

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      power: '',
      type: 'AC',
      brand: ChargerBrand.CHARGECORE,
      price: 0,
      features: ['']
    });
    setActiveModal('ADD');
  };

  const handleOpenEdit = (charger: ChargerModel) => {
    setSelectedCharger(charger);
    setFormData({
      name: charger.name,
      power: charger.power,
      type: charger.type,
      brand: charger.brand,
      price: charger.price,
      features: [...charger.features]
    });
    setActiveModal('EDIT');
  };

  const handleAddFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const handleRemoveFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeModal === 'ADD') {
      const newCharger: ChargerModel = {
        ...formData,
        id: `c-${Date.now()}`,
        features: formData.features.filter(f => f.trim() !== '')
      };
      setChargers([newCharger, ...chargers]);
    } else if (activeModal === 'EDIT' && selectedCharger) {
      setChargers(prev => prev.map(c => 
        c.id === selectedCharger.id 
        ? { ...formData, id: c.id, features: formData.features.filter(f => f.trim() !== '') } 
        : c
      ));
    }
    setActiveModal('NONE');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa trụ sạc này khỏi danh mục hệ thống?')) {
      setChargers(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Danh mục Trụ sạc</h2>
          <p className="text-sm text-gray-500">Quản lý và cập nhật danh sách trụ sạc hệ thống</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Tìm loại trụ..."
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              className="outline-none text-sm bg-transparent font-medium text-gray-700"
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value as any)}
            >
              <option value="All">Tất cả hãng</option>
              <option value={ChargerBrand.CHARGECORE}>{ChargerBrand.CHARGECORE}</option>
              <option value={ChargerBrand.STARCHARGE}>{ChargerBrand.STARCHARGE}</option>
            </select>
          </div>
          {isAdmin && (
            <button 
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2 bg-vinfast-blue text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-800 transition-all"
            >
              <Plus size={18} /> Thêm trụ mới
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredChargers.map((charger) => (
          <div key={charger.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col group relative">
            {/* Header image/placeholder */}
            <div className={`h-32 flex items-center justify-center relative overflow-hidden ${charger.type === 'DC' ? 'bg-blue-600' : 'bg-green-600'}`}>
              <Zap size={48} className="text-white opacity-20 absolute right-[-10px] bottom-[-10px] transform rotate-12" />
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-white flex flex-col items-center">
                <span className="text-2xl font-black">{charger.power}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest">{charger.type} CHARGER</span>
              </div>
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${charger.brand === ChargerBrand.STARCHARGE ? 'bg-amber-400 text-amber-900' : 'bg-white text-blue-900'}`}>
                  {charger.brand}
                </span>
              </div>
              
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleOpenEdit(charger)}
                    className="p-1.5 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/40 transition-all"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button 
                    onClick={() => handleDelete(charger.id)}
                    className="p-1.5 bg-red-500/80 backdrop-blur-md text-white rounded-lg hover:bg-red-600 transition-all"
                    title="Xóa"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {charger.name}
              </h3>
              
              <div className="space-y-2 mb-6">
                {charger.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                    <ShieldCheck size={14} className="text-green-500 shrink-0" />
                    <span className="truncate">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Giá niêm yết</span>
                  <span className="text-lg font-black text-blue-800">
                    {charger.price.toLocaleString('vi-VN')} đ
                  </span>
                </div>
                <button className="p-2 bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all" title="Xem chi tiết kỹ thuật">
                  <Info size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredChargers.length === 0 && (
        <div className="h-64 flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <Zap size={48} className="text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-400">Không tìm thấy trụ sạc phù hợp</h3>
          <button 
            onClick={() => {setSearchTerm(''); setBrandFilter('All');}}
            className="mt-2 text-blue-600 text-sm font-bold hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Add / Edit Modal */}
      {activeModal !== 'NONE' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 border border-gray-100">
            <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between bg-vinfast-blue text-white">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Zap size={20} /> {activeModal === 'ADD' ? 'Thêm trụ sạc mới' : 'Cập nhật thiết bị'}
              </h3>
              <button onClick={() => setActiveModal('NONE')} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Tên thiết bị</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ví dụ: Trụ sạc DC 20kW (Link)"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Công suất (kW)</label>
                  <input 
                    required
                    type="text"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.power}
                    onChange={(e) => setFormData({ ...formData, power: e.target.value })}
                    placeholder="Ví dụ: 20kW"
                  />
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Loại dòng điện</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'AC' | 'DC' })}
                  >
                    <option value="AC">AC (Dòng xoay chiều)</option>
                    <option value="DC">DC (Dòng một chiều - Sạc nhanh)</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Hãng sản xuất</label>
                  <select 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value as ChargerBrand })}
                  >
                    <option value={ChargerBrand.CHARGECORE}>Chargecore</option>
                    <option value={ChargerBrand.STARCHARGE}>Starcharge</option>
                  </select>
                </div>

                <div className="col-span-1">
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Giá niêm yết (đ)</label>
                  <input 
                    required
                    type="number"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tính năng nổi bật</label>
                    <button 
                      type="button" 
                      onClick={handleAddFeature}
                      className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline"
                    >
                      <PlusCircle size={12} /> Thêm tính năng
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, idx) => (
                      <div key={idx} className="flex gap-2">
                        <input 
                          type="text"
                          className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-blue-200 text-xs"
                          value={feature}
                          onChange={(e) => handleFeatureChange(idx, e.target.value)}
                          placeholder="Ví dụ: Tự động ngắt khi đầy"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="p-2 text-gray-300 hover:text-red-500"
                        >
                          <MinusCircle size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setActiveModal('NONE')} 
                  className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-vinfast-blue text-white rounded-xl text-sm font-bold hover:bg-blue-800 shadow-xl shadow-blue-100 flex items-center justify-center gap-2 transition-all"
                >
                  <Save size={18} /> {activeModal === 'ADD' ? 'Tạo thiết bị' : 'Lưu cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChargerCatalog;
