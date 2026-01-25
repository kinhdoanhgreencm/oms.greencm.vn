
import React from 'react';
import { 
  Users, 
  Activity, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Customer, ProjectStatus, ChargerType } from '../types';

interface DashboardProps {
  customers: Customer[];
}

const Dashboard: React.FC<DashboardProps> = ({ customers }) => {
  const statusCounts = customers.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chargerCounts = customers.reduce((acc, c) => {
    acc[c.chargerType] = (acc[c.chargerType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
  const chargerData = Object.entries(chargerCounts).map(([name, value]) => ({ name, value }));

  const COLORS_LIST = ['#004182', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const stats = [
    { label: 'Tổng khách hàng', value: customers.length, icon: <Users className="text-blue-600" />, trend: '+12%', bg: 'bg-blue-50' },
    { label: 'Đang triển khai', value: customers.filter(c => c.status === ProjectStatus.INSTALLING).length, icon: <Activity className="text-orange-600" />, trend: '+5%', bg: 'bg-orange-50' },
    { label: 'Hoàn thành', value: customers.filter(c => c.status === ProjectStatus.COMPLETED).length, icon: <CheckCircle2 className="text-green-600" />, trend: '+8%', bg: 'bg-green-50' },
    { label: 'Nhu cầu 7kW', value: customers.filter(c => c.chargerType === ChargerType.KW7).length, icon: <Zap className="text-yellow-600" />, trend: '+2%', bg: 'bg-yellow-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
              <p className="text-xs font-semibold text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp size={12} /> {stat.trend} <span className="text-gray-400 font-normal">so với tháng trước</span>
              </p>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Tiến độ dự án</h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>30 ngày qua</option>
              <option>90 ngày qua</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_LIST[index % COLORS_LIST.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-8">Loại trạm sạc</h3>
          <div className="h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chargerData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chargerData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS_LIST[index % COLORS_LIST.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-sm text-gray-500">Tổng cộng</p>
              <p className="text-2xl font-bold text-gray-800">{customers.length}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {chargerData.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_LIST[idx] }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">Hoạt động gần đây</h3>
          <button className="text-blue-600 text-sm font-semibold hover:underline">Xem tất cả</button>
        </div>
        <div className="divide-y divide-gray-100">
          {customers.slice(0, 5).map((customer, idx) => (
            <div key={idx} className="p-4 hover:bg-gray-50 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Clock size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">Cập nhật tiến độ: {customer.name}</p>
                <p className="text-xs text-gray-500 mt-1">Trạng thái: {customer.status} • {customer.address}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">2 giờ trước</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
