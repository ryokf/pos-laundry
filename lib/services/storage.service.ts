// LocalStorage service for data persistence

import {
    Order,
    Customer,
    Expense,
    LaundryService,
    StoreSettings,
    User,
} from '../types';
import { DEFAULT_SERVICES } from '../constants';

const STORAGE_KEYS = {
    ORDERS: 'pos-laundry-orders',
    CUSTOMERS: 'pos-laundry-customers',
    EXPENSES: 'pos-laundry-expenses',
    SERVICES: 'pos-laundry-services',
    SETTINGS: 'pos-laundry-settings',
    USERS: 'pos-laundry-users',
    CURRENT_USER: 'pos-laundry-current-user',
};

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading ${key} from storage:`, error);
        return defaultValue;
    }
}

function saveToStorage<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error saving ${key} to storage:`, error);
    }
}

// Orders
export function getAllOrders(): Order[] {
    return getFromStorage<Order[]>(STORAGE_KEYS.ORDERS, []);
}

export function saveOrder(order: Order): void {
    const orders = getAllOrders();
    const existingIndex = orders.findIndex(o => o.id === order.id);

    if (existingIndex >= 0) {
        orders[existingIndex] = order;
    } else {
        orders.push(order);
    }

    saveToStorage(STORAGE_KEYS.ORDERS, orders);
}

export function getOrderById(id: string): Order | undefined {
    const orders = getAllOrders();
    return orders.find(o => o.id === id);
}

// Customers
export function getAllCustomers(): Customer[] {
    return getFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, []);
}

export function saveCustomer(customer: Customer): void {
    const customers = getAllCustomers();
    const existingIndex = customers.findIndex(c => c.id === customer.id);

    if (existingIndex >= 0) {
        customers[existingIndex] = customer;
    } else {
        customers.push(customer);
    }

    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
}

export function getCustomerById(id: string): Customer | undefined {
    const customers = getAllCustomers();
    return customers.find(c => c.id === id);
}

// Expenses
export function getAllExpenses(): Expense[] {
    return getFromStorage<Expense[]>(STORAGE_KEYS.EXPENSES, []);
}

export function saveExpense(expense: Expense): void {
    const expenses = getAllExpenses();
    expenses.push(expense);
    saveToStorage(STORAGE_KEYS.EXPENSES, expenses);
}

// Services
export function getAllServices(): LaundryService[] {
    const services = getFromStorage<LaundryService[]>(STORAGE_KEYS.SERVICES, []);

    // Initialize with default services if empty
    if (services.length === 0) {
        saveToStorage(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
        return DEFAULT_SERVICES;
    }

    return services;
}

export function saveService(service: LaundryService): void {
    const services = getAllServices();
    const existingIndex = services.findIndex(s => s.id === service.id);

    if (existingIndex >= 0) {
        services[existingIndex] = service;
    } else {
        services.push(service);
    }

    saveToStorage(STORAGE_KEYS.SERVICES, services);
}

export function deleteService(id: string): void {
    const services = getAllServices();
    const filtered = services.filter(s => s.id !== id);
    saveToStorage(STORAGE_KEYS.SERVICES, filtered);
}

// Settings
export function getStoreSettings(): StoreSettings {
    return getFromStorage<StoreSettings>(STORAGE_KEYS.SETTINGS, {
        name: 'Laundry Bersih',
        address: 'Jl. Contoh No. 123',
        phone: '081234567890',
        receiptFooter: 'Barang yang tidak diambil dalam 1 bulan bukan tanggung jawab kami',
    });
}

export function saveStoreSettings(settings: StoreSettings): void {
    saveToStorage(STORAGE_KEYS.SETTINGS, settings);
}

// Users
export function getAllUsers(): User[] {
    return getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
}

export function saveUser(user: User): void {
    const users = getAllUsers();
    const existingIndex = users.findIndex(u => u.id === user.id);

    if (existingIndex >= 0) {
        users[existingIndex] = user;
    } else {
        users.push(user);
    }

    saveToStorage(STORAGE_KEYS.USERS, users);
}

export function getCurrentUser(): User | null {
    return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null);
}

export function setCurrentUser(user: User | null): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER, user);
}
