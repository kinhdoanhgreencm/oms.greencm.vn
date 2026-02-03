
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  FileText, 
  Settings,
  LogOut,
  Bell,
  Menu,
  ShieldCheck,
  ChevronDown,
  Zap
} from 'lucide-react';
import { ViewType, Customer, Role, User, ChargerModel } from './types';
import { MOCK_CUSTOMERS, MOCK_USERS, MOCK_CHARGERS } from './constants';
import Dashboard from './components/Dashboard';
import CustomerManagement from './components/CustomerManagement';
import ProgressTracking from './components/ProgressTracking';
import ConsultationPlans from './components/ConsultationPlans';
import UserManagement from './components/UserManagement';
import ChargerCatalog from './components/ChargerCatalog';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewType>('DASHBOARD');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [chargers, setChargers] = useState<ChargerModel[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  useEffect(() => {
    // Load local storage data or defaults
    const savedCustomers = localStorage.getItem('vinfast_crm_customers');
    const savedUsers = localStorage.getItem('vinfast_crm_users');
    const savedChargers = localStorage.getItem('vinfast_crm_chargers');
    
    if (savedCustomers) setCustomers(JSON.parse(savedCustomers));
    else setCustomers(MOCK_CUSTOMERS as any);

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else setUsers(MOCK_USERS as any);

    if (savedChargers) setChargers(JSON.parse(savedChargers));
    else setChargers(MOCK_CHARGERS as any);

    // Default to first user (Admin) for demo
    const allUsers = JSON.parse(savedUsers || '[]');
    const defaultUser = allUsers.length > 0 ? allUsers[0] : MOCK_USERS[0];
    setCurrentUser(defaultUser);
    
    setLoading(false);
  }, []);

  useEffect(() => {
    if (customers.length > 0) localStorage.setItem('vinfast_crm_customers', JSON.stringify(customers));
    if (users.length > 0) localStorage.setItem('vinfast_crm_users', JSON.stringify(users));
    if (chargers.length > 0) localStorage.setItem('vinfast_crm_chargers', JSON.stringify(chargers));
  }, [customers, users, chargers]);

  // Sidebar dynamic items based on Role
  const navItems = [
    { id: 'DASHBOARD', icon: <LayoutDashboard size={20} />, label: 'Tổng quan', roles: [Role.ADMIN, Role.SALES] },
    { id: 'CUSTOMERS', icon: <Users size={20} />, label: 'Khách hàng', roles: [Role.ADMIN, Role.SALES] },
    { id: 'PROGRESS', icon: <Activity size={20} />, label: 'Tiến độ', roles: [Role.ADMIN, Role.SALES, Role.TECHNICIAN] },
    { id: 'PROPOSALS', icon: <FileText size={20} />, label: 'Phương án', roles: [Role.ADMIN, Role.SALES] },
    { id: 'CHARGERS', icon: <Zap size={20} />, label: 'Trụ sạc', roles: [Role.ADMIN, Role.SALES, Role.TECHNICIAN] },
    { id: 'USERS', icon: <ShieldCheck size={20} />, label: 'Quản trị User', roles: [Role.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  const renderView = () => {
    if (!currentUser) return null;

    switch (activeView) {
      case 'DASHBOARD': return <Dashboard customers={customers} />;
      case 'CUSTOMERS': return <CustomerManagement customers={customers} setCustomers={setCustomers} currentUser={currentUser} users={users} />;
      case 'PROGRESS': return <ProgressTracking customers={customers} setCustomers={setCustomers} currentUser={currentUser} />;
      case 'PROPOSALS': return <ConsultationPlans customers={customers} setCustomers={setCustomers} currentUser={currentUser} />;
      case 'CHARGERS': return <ChargerCatalog chargers={chargers} setChargers={setChargers} currentUser={currentUser} />;
      case 'USERS': return <UserManagement users={users} setUsers={setUsers} />;
      default: return <Dashboard customers={customers} />;
    }
  };

  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    setShowRoleSwitcher(false);
    // Auto-switch to a valid view for the new role if current is invalid
    const validViews = navItems.filter(i => i.roles.includes(user.role)).map(i => i.id);
    if (!validViews.includes(activeView)) {
      setActiveView(validViews[0] as ViewType);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vinfast-blue"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-30`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-vinfast-blue p-2 rounded-lg shrink-0 w-11 h-11 flex items-center justify-center">
            <div className="text-white font-bold text-xl tracking-tighter">V</div>
          </div>
          {isSidebarOpen && <span className="font-bold text-lg text-[#004182] whitespace-nowrap">VinFast EV-CRM</span>}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {filteredNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-colors ${
                activeView === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              {isSidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-4 px-3 py-3 text-gray-500 hover:bg-gray-100 rounded-lg">
            <Settings size={20} />
            {isSidebarOpen && <span className="font-medium">Cài đặt</span>}
          </button>
          <button className="w-full flex items-center gap-4 px-3 py-3 text-red-500 hover:bg-red-50 rounded-lg mt-1">
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Đăng xuất</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-500 hover:text-gray-800">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              {navItems.find(i => i.id === activeView)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Demo Role Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-700 border border-blue-100 hover:bg-blue-50 transition-colors"
              >
                <ShieldCheck size={16} />
                Role: {currentUser?.role}
                <ChevronDown size={14} />
              </button>
              {showRoleSwitcher && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 p-2 z-50">
                  <p className="text-[10px] uppercase font-bold text-gray-400 px-2 py-1">Chuyển vai trò Demo</p>
                  {users.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => handleSwitchUser(u)}
                      className={`w-full text-left px-2 py-2 rounded-lg text-sm ${currentUser?.id === u.id ? 'bg-blue-50 text-blue-600 font-bold' : 'hover:bg-gray-50'}`}
                    >
                      {u.fullName} ({u.role})
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="relative text-gray-500 hover:text-gray-800">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">3</span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800 leading-none">{currentUser?.fullName}</p>
                <p className="text-xs text-gray-500 mt-1">{currentUser?.role}</p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${currentUser?.role === Role.ADMIN ? 'bg-blue-600' : currentUser?.role === Role.SALES ? 'bg-green-600' : 'bg-purple-600'}`}>
                {currentUser?.fullName.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
