// Mock data initialization for POS Laundry

import {
    Customer,
    Order,
    Expense,
    OrderStatus,
    PaymentStatus,
    PaymentMethod,
    ServiceType,
} from '../types';
import { generateId } from '../utils/formatters';

// Mock Customers
export const MOCK_CUSTOMERS: Customer[] = [
    {
        id: 'cust-001',
        name: 'Budi Santoso',
        phone: '081234567890',
        address: 'Jl. Merdeka No. 123, Jakarta Pusat',
        createdAt: '2024-12-01T08:00:00.000Z',
    },
    {
        id: 'cust-002',
        name: 'Siti Nurhaliza',
        phone: '081298765432',
        address: 'Jl. Sudirman No. 45, Jakarta Selatan',
        createdAt: '2024-12-05T10:30:00.000Z',
    },
    {
        id: 'cust-003',
        name: 'Ahmad Rizki',
        phone: '081356789012',
        address: 'Jl. Gatot Subroto No. 78, Jakarta Barat',
        createdAt: '2024-12-10T14:15:00.000Z',
    },
    {
        id: 'cust-004',
        name: 'Dewi Lestari',
        phone: '081445678901',
        address: 'Jl. Thamrin No. 234, Jakarta Pusat',
        createdAt: '2024-12-12T09:20:00.000Z',
    },
    {
        id: 'cust-005',
        name: 'Eko Prasetyo',
        phone: '081567890123',
        address: 'Jl. Kuningan No. 56, Jakarta Selatan',
        createdAt: '2024-12-15T11:45:00.000Z',
    },
    {
        id: 'cust-006',
        name: 'Fitri Handayani',
        phone: '081678901234',
        address: 'Jl. Rasuna Said No. 89, Jakarta Selatan',
        createdAt: '2024-12-18T13:30:00.000Z',
    },
    {
        id: 'cust-007',
        name: 'Hendra Gunawan',
        phone: '081789012345',
        address: 'Jl. Senopati No. 12, Jakarta Selatan',
        createdAt: '2024-12-20T15:00:00.000Z',
    },
    {
        id: 'cust-008',
        name: 'Indah Permata',
        phone: '081890123456',
        address: 'Jl. Kemang No. 67, Jakarta Selatan',
        createdAt: '2024-12-22T10:00:00.000Z',
    },
];

// Mock Orders
export const MOCK_ORDERS: Order[] = [
    {
        id: 'order-001',
        orderNumber: 'LND24123001',
        customerId: 'cust-001',
        customerName: 'Budi Santoso',
        customerPhone: '081234567890',
        items: [
            {
                id: 'item-001',
                serviceId: 'cuci-setrika',
                serviceName: 'Cuci Setrika',
                quantity: 5,
                unit: 'kg',
                pricePerUnit: 7000,
                subtotal: 35000,
                notes: 'Pisahkan baju putih dan berwarna',
            },
        ],
        subtotal: 35000,
        discount: 0,
        total: 35000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        amountPaid: 35000,
        status: OrderStatus.COMPLETED,
        estimatedCompletion: '2025-01-03T17:00:00.000Z',
        createdAt: '2024-12-28T09:00:00.000Z',
        updatedAt: '2024-12-30T16:00:00.000Z',
    },
    {
        id: 'order-002',
        orderNumber: 'LND24123002',
        customerId: 'cust-002',
        customerName: 'Siti Nurhaliza',
        customerPhone: '081298765432',
        items: [
            {
                id: 'item-002',
                serviceId: 'cuci-express',
                serviceName: 'Cuci Express (1 Hari)',
                quantity: 3,
                unit: 'kg',
                pricePerUnit: 12000,
                subtotal: 36000,
            },
            {
                id: 'item-003',
                serviceId: 'bedcover-double',
                serviceName: 'Bedcover Double',
                quantity: 1,
                unit: 'pcs',
                pricePerUnit: 25000,
                subtotal: 25000,
            },
        ],
        subtotal: 61000,
        discount: 5000,
        total: 56000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.QRIS,
        amountPaid: 56000,
        status: OrderStatus.READY,
        estimatedCompletion: '2024-12-30T17:00:00.000Z',
        createdAt: '2024-12-29T10:30:00.000Z',
        updatedAt: '2024-12-30T14:00:00.000Z',
    },
    {
        id: 'order-003',
        orderNumber: 'LND24123003',
        customerId: 'cust-003',
        customerName: 'Ahmad Rizki',
        customerPhone: '081356789012',
        items: [
            {
                id: 'item-004',
                serviceId: 'jas',
                serviceName: 'Jas',
                quantity: 2,
                unit: 'pcs',
                pricePerUnit: 30000,
                subtotal: 60000,
                notes: 'Hati-hati dengan kancing',
            },
        ],
        subtotal: 60000,
        discount: 0,
        total: 60000,
        paymentStatus: PaymentStatus.PARTIALLY_PAID,
        paymentMethod: PaymentMethod.CASH,
        amountPaid: 30000,
        status: OrderStatus.PACKING,
        estimatedCompletion: '2025-01-02T17:00:00.000Z',
        createdAt: '2024-12-29T14:00:00.000Z',
        updatedAt: '2024-12-30T11:00:00.000Z',
    },
    {
        id: 'order-004',
        orderNumber: 'LND24123004',
        customerId: 'cust-004',
        customerName: 'Dewi Lestari',
        customerPhone: '081445678901',
        items: [
            {
                id: 'item-005',
                serviceId: 'cuci-kering',
                serviceName: 'Cuci Kering',
                quantity: 7,
                unit: 'kg',
                pricePerUnit: 5000,
                subtotal: 35000,
            },
        ],
        subtotal: 35000,
        discount: 0,
        total: 35000,
        paymentStatus: PaymentStatus.UNPAID,
        amountPaid: 0,
        status: OrderStatus.IRONING,
        estimatedCompletion: '2025-01-02T17:00:00.000Z',
        createdAt: '2024-12-30T08:00:00.000Z',
        updatedAt: '2024-12-30T13:00:00.000Z',
    },
    {
        id: 'order-005',
        orderNumber: 'LND24123005',
        customerId: 'cust-005',
        customerName: 'Eko Prasetyo',
        customerPhone: '081567890123',
        items: [
            {
                id: 'item-006',
                serviceId: 'sepatu',
                serviceName: 'Sepatu',
                quantity: 3,
                unit: 'pcs',
                pricePerUnit: 25000,
                subtotal: 75000,
            },
        ],
        subtotal: 75000,
        discount: 10000,
        total: 65000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.TRANSFER,
        amountPaid: 65000,
        status: OrderStatus.WASHING,
        estimatedCompletion: '2025-01-01T17:00:00.000Z',
        createdAt: '2024-12-30T11:00:00.000Z',
        updatedAt: '2024-12-30T11:30:00.000Z',
    },
    {
        id: 'order-006',
        orderNumber: 'LND24123106',
        customerId: 'cust-006',
        customerName: 'Fitri Handayani',
        customerPhone: '081678901234',
        items: [
            {
                id: 'item-007',
                serviceId: 'cuci-setrika',
                serviceName: 'Cuci Setrika',
                quantity: 4,
                unit: 'kg',
                pricePerUnit: 7000,
                subtotal: 28000,
            },
            {
                id: 'item-008',
                serviceId: 'selimut',
                serviceName: 'Selimut',
                quantity: 2,
                unit: 'pcs',
                pricePerUnit: 12000,
                subtotal: 24000,
            },
        ],
        subtotal: 52000,
        discount: 0,
        total: 52000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        amountPaid: 52000,
        status: OrderStatus.RECEIVED,
        estimatedCompletion: '2025-01-03T17:00:00.000Z',
        createdAt: '2024-12-31T09:00:00.000Z',
        updatedAt: '2024-12-31T09:00:00.000Z',
    },
    {
        id: 'order-007',
        orderNumber: 'LND24123107',
        customerId: 'cust-007',
        customerName: 'Hendra Gunawan',
        customerPhone: '081789012345',
        items: [
            {
                id: 'item-009',
                serviceId: 'cuci-kilat',
                serviceName: 'Cuci Kilat (6 Jam)',
                quantity: 2,
                unit: 'kg',
                pricePerUnit: 20000,
                subtotal: 40000,
                notes: 'Butuh cepat untuk acara malam ini',
            },
        ],
        subtotal: 40000,
        discount: 0,
        total: 40000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.QRIS,
        amountPaid: 40000,
        status: OrderStatus.READY,
        estimatedCompletion: '2024-12-31T15:00:00.000Z',
        createdAt: '2024-12-31T09:30:00.000Z',
        updatedAt: '2024-12-31T14:30:00.000Z',
    },
    {
        id: 'order-008',
        orderNumber: 'LND24123108',
        customerId: 'cust-008',
        customerName: 'Indah Permata',
        customerPhone: '081890123456',
        items: [
            {
                id: 'item-010',
                serviceId: 'bedcover-single',
                serviceName: 'Bedcover Single',
                quantity: 2,
                unit: 'pcs',
                pricePerUnit: 15000,
                subtotal: 30000,
            },
            {
                id: 'item-011',
                serviceId: 'tas',
                serviceName: 'Tas',
                quantity: 1,
                unit: 'pcs',
                pricePerUnit: 20000,
                subtotal: 20000,
            },
        ],
        subtotal: 50000,
        discount: 5000,
        total: 45000,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        amountPaid: 45000,
        status: OrderStatus.WASHING,
        estimatedCompletion: '2025-01-03T17:00:00.000Z',
        createdAt: '2024-12-31T10:00:00.000Z',
        updatedAt: '2024-12-31T10:30:00.000Z',
    },
];

// Mock Expenses
export const MOCK_EXPENSES: Expense[] = [
    {
        id: 'exp-001',
        category: 'Deterjen',
        amount: 250000,
        description: 'Beli deterjen Attack 5kg x 5 pcs',
        date: '2024-12-20T08:00:00.000Z',
        createdAt: '2024-12-20T08:00:00.000Z',
    },
    {
        id: 'exp-002',
        category: 'Parfum',
        amount: 150000,
        description: 'Pewangi pakaian Molto 3 botol',
        date: '2024-12-20T08:30:00.000Z',
        createdAt: '2024-12-20T08:30:00.000Z',
    },
    {
        id: 'exp-003',
        category: 'Listrik',
        amount: 800000,
        description: 'Bayar tagihan listrik bulan Desember',
        date: '2024-12-22T10:00:00.000Z',
        createdAt: '2024-12-22T10:00:00.000Z',
    },
    {
        id: 'exp-004',
        category: 'Air',
        amount: 200000,
        description: 'Bayar tagihan air PDAM',
        date: '2024-12-22T10:30:00.000Z',
        createdAt: '2024-12-22T10:30:00.000Z',
    },
    {
        id: 'exp-005',
        category: 'Gaji Pegawai',
        amount: 3000000,
        description: 'Gaji 2 pegawai bulan Desember',
        date: '2024-12-25T09:00:00.000Z',
        createdAt: '2024-12-25T09:00:00.000Z',
    },
    {
        id: 'exp-006',
        category: 'Sewa Ruko',
        amount: 5000000,
        description: 'Sewa ruko bulan Januari 2025',
        date: '2024-12-26T14:00:00.000Z',
        createdAt: '2024-12-26T14:00:00.000Z',
    },
    {
        id: 'exp-007',
        category: 'Perawatan Mesin',
        amount: 500000,
        description: 'Service mesin cuci dan setrika',
        date: '2024-12-28T11:00:00.000Z',
        createdAt: '2024-12-28T11:00:00.000Z',
    },
    {
        id: 'exp-008',
        category: 'Deterjen',
        amount: 180000,
        description: 'Beli deterjen Rinso 3kg x 3 pcs',
        date: '2024-12-29T09:00:00.000Z',
        createdAt: '2024-12-29T09:00:00.000Z',
    },
    {
        id: 'exp-009',
        category: 'Lain-lain',
        amount: 100000,
        description: 'Beli hanger plastik 100 pcs',
        date: '2024-12-30T10:00:00.000Z',
        createdAt: '2024-12-30T10:00:00.000Z',
    },
];

// Function to initialize mock data
export function initializeMockData() {
    if (typeof window === 'undefined') return;

    // Check if data already exists
    const existingOrders = localStorage.getItem('pos-laundry-orders');
    const existingCustomers = localStorage.getItem('pos-laundry-customers');
    const existingExpenses = localStorage.getItem('pos-laundry-expenses');

    // Only initialize if no data exists
    if (!existingCustomers) {
        localStorage.setItem('pos-laundry-customers', JSON.stringify(MOCK_CUSTOMERS));
        console.log('✅ Mock customers initialized');
    }

    if (!existingOrders) {
        localStorage.setItem('pos-laundry-orders', JSON.stringify(MOCK_ORDERS));
        console.log('✅ Mock orders initialized');
    }

    if (!existingExpenses) {
        localStorage.setItem('pos-laundry-expenses', JSON.stringify(MOCK_EXPENSES));
        console.log('✅ Mock expenses initialized');
    }
}
