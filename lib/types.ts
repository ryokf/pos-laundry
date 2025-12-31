// Core type definitions for POS Laundry system

export enum ServiceType {
    KILOAN = 'KILOAN',
    SATUAN = 'SATUAN',
}

export enum OrderStatus {
    RECEIVED = 'RECEIVED',
    WASHING = 'WASHING',
    IRONING = 'IRONING',
    PACKING = 'PACKING',
    READY = 'READY',
    COMPLETED = 'COMPLETED',
}

export enum PaymentStatus {
    UNPAID = 'UNPAID',
    PARTIALLY_PAID = 'PARTIALLY_PAID',
    PAID = 'PAID',
}

export enum PaymentMethod {
    CASH = 'CASH',
    QRIS = 'QRIS',
    TRANSFER = 'TRANSFER',
}

export enum UserRole {
    ADMIN = 'ADMIN',
    CASHIER = 'CASHIER',
}

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address: string;
    createdAt: string;
}

export interface LaundryService {
    id: string;
    name: string;
    type: ServiceType;
    price: number;
    unit: string; // 'kg' or 'pcs'
    estimatedDays: number;
}

export interface OrderItem {
    id: string;
    serviceId: string;
    serviceName: string;
    quantity: number;
    unit: string;
    pricePerUnit: number;
    subtotal: number;
    notes?: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    customerId: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    subtotal: number;
    discount: number;
    total: number;
    paymentStatus: PaymentStatus;
    paymentMethod?: PaymentMethod;
    amountPaid: number;
    status: OrderStatus;
    estimatedCompletion: string;
    createdAt: string;
    updatedAt: string;
    notes?: string;
}

export interface Expense {
    id: string;
    category: string;
    amount: number;
    description: string;
    date: string;
    createdAt: string;
}

export interface User {
    id: string;
    name: string;
    username: string;
    role: UserRole;
    createdAt: string;
}

export interface StoreSettings {
    name: string;
    address: string;
    phone: string;
    receiptFooter: string;
}

export interface DashboardStats {
    todayRevenue: number;
    todayOrders: number;
    todayCompleted: number;
    ordersByStatus: Record<OrderStatus, number>;
}
