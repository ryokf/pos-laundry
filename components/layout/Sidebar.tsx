// Sidebar navigation component

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface NavItem {
    name: string;
    href: string;
    icon: string;
}

const navItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Kasir', href: '/cashier', icon: '💰' },
    { name: 'Transaksi', href: '/orders', icon: '📋' },
    { name: 'Pelanggan', href: '/customers', icon: '👥' },
    { name: 'Laporan', href: '/reports', icon: '📈' },
    { name: 'Pengaturan', href: '/settings', icon: '⚙️' },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Floating Menu Button - Mobile Only */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="fixed bottom-6 right-6 z-50 lg:hidden bg-gradient-to-br from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 no-print"
                aria-label="Toggle Menu"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMobileMenuOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Overlay for mobile */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden no-print animate-fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Desktop: Left, Mobile: Right slide-in */}
            <aside className={`
        fixed top-0 h-screen w-72 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl z-40 no-print transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'right-0' : '-right-72'}
        lg:left-0 lg:right-auto lg:translate-x-0 lg:w-64
      `}>
                <div className="p-6 border-b border-blue-700">
                    <div className="flex items-center justify-between lg:justify-start">
                        <div>
                            <h1 className="text-2xl font-bold mb-1">🧺 POS Laundry</h1>
                            <p className="text-blue-200 text-sm">Sistem Kasir Modern</p>
                        </div>
                        {/* Close button - Mobile only */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="lg:hidden text-blue-200 hover:text-white p-2"
                            aria-label="Close Menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <nav className="px-3 py-4 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-white text-blue-900 shadow-lg scale-105'
                                        : 'text-blue-100 hover:bg-blue-700 hover:text-white hover:scale-102'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-blue-700 bg-blue-900">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center">
                            <span className="text-lg">👤</span>
                        </div>
                        <div>
                            <p className="font-medium">Admin</p>
                            <p className="text-xs text-blue-200">Super Admin</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
