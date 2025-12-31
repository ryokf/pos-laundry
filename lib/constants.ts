// Application constants

import { LaundryService, ServiceType, OrderStatus, PaymentStatus } from './types';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    [OrderStatus.RECEIVED]: 'Diterima',
    [OrderStatus.WASHING]: 'Sedang Dicuci',
    [OrderStatus.IRONING]: 'Sedang Disetrika',
    [OrderStatus.PACKING]: 'Packing',
    [OrderStatus.READY]: 'Siap Diambil',
    [OrderStatus.COMPLETED]: 'Selesai',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: 'Belum Lunas',
    [PaymentStatus.PARTIALLY_PAID]: 'DP',
    [PaymentStatus.PAID]: 'Lunas',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    [OrderStatus.RECEIVED]: 'bg-blue-100 text-blue-800',
    [OrderStatus.WASHING]: 'bg-purple-100 text-purple-800',
    [OrderStatus.IRONING]: 'bg-orange-100 text-orange-800',
    [OrderStatus.PACKING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.READY]: 'bg-green-100 text-green-800',
    [OrderStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
    [PaymentStatus.UNPAID]: 'bg-red-100 text-red-800',
    [PaymentStatus.PARTIALLY_PAID]: 'bg-yellow-100 text-yellow-800',
    [PaymentStatus.PAID]: 'bg-green-100 text-green-800',
};

// Default laundry services
export const DEFAULT_SERVICES: LaundryService[] = [
    // Kiloan services
    {
        id: 'cuci-kering',
        name: 'Cuci Kering',
        type: ServiceType.KILOAN,
        price: 5000,
        unit: 'kg',
        estimatedDays: 3,
    },
    {
        id: 'cuci-setrika',
        name: 'Cuci Setrika',
        type: ServiceType.KILOAN,
        price: 7000,
        unit: 'kg',
        estimatedDays: 3,
    },
    {
        id: 'cuci-express',
        name: 'Cuci Express (1 Hari)',
        type: ServiceType.KILOAN,
        price: 12000,
        unit: 'kg',
        estimatedDays: 1,
    },
    {
        id: 'cuci-kilat',
        name: 'Cuci Kilat (6 Jam)',
        type: ServiceType.KILOAN,
        price: 20000,
        unit: 'kg',
        estimatedDays: 0,
    },
    // Satuan services
    {
        id: 'bedcover-single',
        name: 'Bedcover Single',
        type: ServiceType.SATUAN,
        price: 15000,
        unit: 'pcs',
        estimatedDays: 3,
    },
    {
        id: 'bedcover-double',
        name: 'Bedcover Double',
        type: ServiceType.SATUAN,
        price: 25000,
        unit: 'pcs',
        estimatedDays: 3,
    },
    {
        id: 'selimut',
        name: 'Selimut',
        type: ServiceType.SATUAN,
        price: 12000,
        unit: 'pcs',
        estimatedDays: 3,
    },
    {
        id: 'jas',
        name: 'Jas',
        type: ServiceType.SATUAN,
        price: 30000,
        unit: 'pcs',
        estimatedDays: 3,
    },
    {
        id: 'sepatu',
        name: 'Sepatu',
        type: ServiceType.SATUAN,
        price: 25000,
        unit: 'pcs',
        estimatedDays: 2,
    },
    {
        id: 'tas',
        name: 'Tas',
        type: ServiceType.SATUAN,
        price: 20000,
        unit: 'pcs',
        estimatedDays: 2,
    },
];

export const EXPENSE_CATEGORIES = [
    'Deterjen',
    'Parfum',
    'Listrik',
    'Air',
    'Gaji Pegawai',
    'Sewa Ruko',
    'Perawatan Mesin',
    'Lain-lain',
];
