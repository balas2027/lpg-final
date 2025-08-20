import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavLink, useLocation } from 'react-router-dom';
import { Role } from '../types';

// --- ICONS ---
const GasFlameIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12.378 1.602a.75.75 0 00-.756 0L3.322 6.034a.75.75 0 00-.322.648v7.634c0 .327.16.633.428.825l8.25 6.021a.75.75 0 00.944 0l8.25-6.021a.75.75 0 00.428-.825V6.682a.75.75 0 00-.322-.648L12.378 1.602zM12 7.5c-2.347 0-4.25 1.903-4.25 4.25S9.653 16 12 16s4.25-1.903 4.25-4.25S14.347 7.5 12 7.5z" />
    </svg>
);
const MapPinIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);
const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
);
const LogoutIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
);
const MenuIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);
const CloseIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SidebarContent = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const getLinkClass = (path: string): string => {
        const isActive = location.pathname === path;
        return `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 relative ${
            isActive
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
        }`;
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 text-white">
            <div className="flex items-center justify-center h-20 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-2 rounded-lg">
                        <GasFlameIcon className="h-7 w-7 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-wider">LPG Shield</span>
                </div>
            </div>
            
            <nav className="flex-1 px-4 py-6 space-y-2">
                 {user?.role === Role.ADMIN ? (
                    <>
                        <NavLink to="/admin" className={getLinkClass('/admin')}>
                            <MapPinIcon className="h-5 w-5" />
                            Dashboard
                        </NavLink>
                        <NavLink to="/admin/stats" className={getLinkClass('/admin/stats')}>
                            <ChartBarIcon className="h-5 w-5" />
                            Statistics
                        </NavLink>
                    </>
                ) : (
                    <NavLink to="/" className={getLinkClass('/')}>
                        <MapPinIcon className="h-5 w-5" />
                        Dashboard
                    </NavLink>
                )}
            </nav>

            <div className="px-4 py-4 border-t border-slate-800">
                <div className="text-center mb-4">
                    <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                    <p className="text-xs text-slate-400">{user?.role}</p>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800/80 text-slate-300 hover:bg-red-600 hover:text-white font-medium py-2 px-3 rounded-lg transition-colors duration-300 ease-in-out border border-slate-700 hover:border-red-500"
                >
                    <LogoutIcon className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar & Overlay */}
             <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
                {/* Overlay */}
                <div 
                    className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                ></div>

                {/* Sidebar */}
                 <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="absolute top-0 right-0 -mr-12 pt-2">
                        <button
                            type="button"
                            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <CloseIcon className="h-6 w-6 text-white" />
                        </button>
                    </div>
                    <SidebarContent />
                </div>
            </div>

            <div className="lg:pl-64 flex flex-col flex-1">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200">
                    <button
                        type="button"
                        className="px-4 border-r border-slate-200 text-slate-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between items-center">
                       <span className="text-lg font-bold text-slate-800 tracking-wider">LPG Shield</span>
                    </div>
                </div>

                <main className="flex-1">
                    <div className="py-8 px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;