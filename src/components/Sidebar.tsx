import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Workflow, 
  Database, 
  Bug, 
  BookOpen, 
  ChevronLeft, 
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed,
  onLogout
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Mission Control', icon: LayoutDashboard, num: 'MC' },
    { id: 'roadmap', label: 'Roadmap', icon: Map, num: '01' },
    { id: 'architecture', label: 'Architecture', icon: Workflow, num: '02' },
    { id: 'database', label: 'Database Design', icon: Database, num: '03' },
    { id: 'bugs', label: 'Bug Tracker', icon: Bug, num: '04' },
    { id: 'journal', label: 'Dev Journal', icon: BookOpen, num: '05' }
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#09090B] border-b border-white/10 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-purple-400 flex items-center justify-center font-bold text-white shadow-lg">
            P
          </div>
          <span className="font-display font-bold tracking-tight text-white text-base">
            PickHer <span className="font-medium opacity-50 underline decoration-[#7C3AED] underline-offset-4 text-xs">MC</span>
          </span>
        </div>
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-slate-400 hover:text-white p-1"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/95 flex flex-col justify-between pt-16 pb-6 px-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/5 text-white font-medium border border-white/5' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isActive ? (
                      <div className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                    ) : (
                      <span className="text-xs font-mono opacity-50">{item.num}</span>
                    )}
                    <Icon size={16} className="text-slate-400" />
                    <span className="font-sans text-sm">{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div>
            <button
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
              className="w-full text-center py-2.5 rounded-lg border border-white/10 text-xs text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all font-mono"
            >
              LOCK TERMINAL
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden md:flex flex-col justify-between h-screen sticky top-0 bg-[#09090B] border-r border-white/10 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } shrink-0 p-6 z-20`}
      >
        <div className="space-y-8">
          {/* Logo / Header */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-purple-400 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
                P
              </div>
              {!collapsed && (
                <span className="text-xl font-bold tracking-tight text-white font-display">
                  PickHer <span className="font-medium opacity-50 underline decoration-[#7C3AED] underline-offset-4">MC</span>
                </span>
              )}
            </div>

            {!collapsed && (
              <button 
                onClick={() => setCollapsed(true)}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronLeft size={14} />
              </button>
            )}
          </div>

          {collapsed && (
            <div className="flex justify-center">
              <button 
                onClick={() => setCollapsed(false)}
                className="p-1.5 rounded-lg border border-white/5 hover:border-white/10 bg-white/5 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg transition-all duration-200 cursor-pointer ${
                    collapsed ? 'justify-center p-3' : 'px-3 py-2 gap-3'
                  } ${
                    isActive 
                      ? 'bg-white/5 text-white border border-white/5 font-medium' 
                      : 'text-slate-400 border border-transparent hover:text-white hover:bg-white/5'
                  }`}
                >
                  {collapsed ? (
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  ) : (
                    <div className="flex items-center gap-3 w-full">
                      {isActive ? (
                        <div className="h-1.5 w-1.5 rounded-full bg-[#7C3AED]" />
                      ) : (
                        <span className="text-xs font-mono opacity-50 w-4">{item.num}</span>
                      )}
                      <Icon size={16} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="font-sans text-sm">{item.label}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="space-y-4">
          {!collapsed ? (
            <div className="rounded-xl bg-purple-500/10 p-4 border border-purple-500/20 font-mono text-[10px] text-slate-400 space-y-1.5">
              <div className="flex justify-between">
                <span>STATION:</span>
                <span className="text-white">M-CONTROL-01</span>
              </div>
              <div className="flex justify-between">
                <span>DB INGRESS:</span>
                <span className="text-emerald-400">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span>REPLICA:</span>
                <span className="text-white">POSTGRES</span>
              </div>
            </div>
          ) : null}
          
          <button
            onClick={onLogout}
            className={`w-full flex items-center justify-center py-2 border border-white/10 text-[10px] tracking-wider font-mono rounded-lg text-white hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-all cursor-pointer ${
              collapsed ? 'px-0' : 'px-4'
            }`}
          >
            {collapsed ? 'LOCK' : 'LOCK TERMINAL'}
          </button>
        </div>
      </aside>
    </>
  );
}
