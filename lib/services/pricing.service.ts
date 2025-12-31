// Pricing calculation service

import { OrderItem, LaundryService } from '../types';
import { getAllServices } from './storage.service';

export function calculateOrderItemSubtotal(item: OrderItem): number {
    return item.quantity * item.pricePerUnit;
}

export function calculateOrderSubtotal(items: OrderItem[]): number {
    return items.reduce((sum, item) => sum + item.subtotal, 0);
}

export function calculateOrderTotal(subtotal: number, discount: number): number {
    return Math.max(0, subtotal - discount);
}

export function getServiceById(serviceId: string): LaundryService | undefined {
    const services = getAllServices();
    return services.find(s => s.id === serviceId);
}

export function calculateDiscount(subtotal: number, discountValue: number, isPercentage: boolean = false): number {
    if (isPercentage) {
        return Math.round((subtotal * discountValue) / 100);
    }
    return discountValue;
}
