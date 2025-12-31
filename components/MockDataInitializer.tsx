// Component to initialize mock data on app load

'use client';

import { useEffect } from 'react';
import { initializeMockData } from '@/lib/data/mockData';

export default function MockDataInitializer() {
    useEffect(() => {
        initializeMockData();
    }, []);

    return null;
}
