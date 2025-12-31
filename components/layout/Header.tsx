// Header component

'use client';

import React from 'react';

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const currentDate = new Date().toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 no-print">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                    {subtitle && (
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">{subtitle}</p>
                    )}
                </div>

                <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-gray-500">{currentDate}</p>
                    <p className="text-base sm:text-lg font-semibold text-gray-900">
                        {new Date().toLocaleTimeString('id-ID', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                </div>
            </div>
        </header>
    );
}
