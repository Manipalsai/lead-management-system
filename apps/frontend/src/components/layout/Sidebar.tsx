import { NavLink } from 'react-router-dom';
import logo from '../../assets/tensorgo-logo.png';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
      {/* LOGO */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain scale-125" />
          </div>
          <span className="font-bold text-xl tracking-wide">TensorGo</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <NavLink
          to="/dashboard"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          <span className="font-medium">Dashboard</span>
        </NavLink>

        <NavLink
          to="/leads"
          className={({ isActive }: { isActive: boolean }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`
          }
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span className="font-medium">Leads</span>
        </NavLink>

        <div className="pt-4 mt-4 border-t border-slate-700">
          <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Settings
          </p>
          <NavLink
            to="/settings"
            className={({ isActive }: { isActive: boolean }) =>
              `px-4 py-2 flex items-center gap-3 transition-colors ${isActive
                ? 'text-indigo-400 font-medium'
                : 'text-slate-500 hover:text-white'
              }`
            }
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-slate-700">
        {/* We can use real user data here later if needed, but for now keep static or remove if confusing */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
            {/* user?.name?.charAt(0) || 'U' */}
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">User</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

