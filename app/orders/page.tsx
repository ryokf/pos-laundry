// Orders Management page

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { getAllOrders, saveOrder } from '@/lib/services/storage.service';
import { formatCurrency, formatDateTime } from '@/lib/utils/formatters';
import {
    ORDER_STATUS_LABELS,
    ORDER_STATUS_COLORS,
    PAYMENT_STATUS_LABELS,
    PAYMENT_STATUS_COLORS,
} from '@/lib/constants';

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        loadOrders();
    }, []);

    useEffect(() => {
        filterOrders();
    }, [orders, statusFilter]);

    function loadOrders() {
        const allOrders = getAllOrders();
        setOrders(allOrders.reverse()); // Most recent first
    }

    function filterOrders() {
        if (statusFilter === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(o => o.status === statusFilter));
        }
    }

    function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const updatedOrder = {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
        };

        saveOrder(updatedOrder);
        loadOrders();
    }

    function updatePaymentStatus(orderId: string, newPaymentStatus: PaymentStatus) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        const updatedOrder = {
            ...order,
            paymentStatus: newPaymentStatus,
            amountPaid: newPaymentStatus === PaymentStatus.PAID ? order.total : order.amountPaid,
            updatedAt: new Date().toISOString(),
        };

        saveOrder(updatedOrder);
        loadOrders();
    }

    function getNextStatus(currentStatus: OrderStatus): OrderStatus | null {
        const statusFlow = [
            OrderStatus.RECEIVED,
            OrderStatus.WASHING,
            OrderStatus.IRONING,
            OrderStatus.PACKING,
            OrderStatus.READY,
            OrderStatus.COMPLETED,
        ];

        const currentIndex = statusFlow.indexOf(currentStatus);
        if (currentIndex < statusFlow.length - 1) {
            return statusFlow[currentIndex + 1];
        }
        return null;
    }

    return (
        <div className="min-h-screen">
            <Header title="Daftar Transaksi" subtitle="Kelola dan lacak pesanan" />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Semua Pesanan</h2>

                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={[
                                { value: 'ALL', label: 'Semua Status' },
                                ...Object.values(OrderStatus).map(status => ({
                                    value: status,
                                    label: ORDER_STATUS_LABELS[status],
                                })),
                            ]}
                            className="w-full sm:w-64"
                        />
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Tidak ada pesanan</p>
                            <p className="text-sm mt-2">Pesanan akan muncul di sini</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">No. Order</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Pelanggan</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Total</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Pembayaran</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((order) => {
                                        const nextStatus = getNextStatus(order.status);

                                        return (
                                            <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-3 px-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedOrder(order);
                                                            setShowDetailModal(true);
                                                        }}
                                                        className="font-medium text-blue-600 hover:text-blue-800"
                                                    >
                                                        {order.orderNumber}
                                                    </button>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <p className="font-medium text-gray-900">{order.customerName}</p>
                                                    <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-gray-900">
                                                    {formatCurrency(order.total)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus]}`}>
                                                        {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                                                        {ORDER_STATUS_LABELS[order.status]}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-sm text-gray-600">
                                                    {formatDateTime(order.createdAt)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <div className="flex gap-2">
                                                        {nextStatus && (
                                                            <Button
                                                                size="sm"
                                                                onClick={() => updateOrderStatus(order.id, nextStatus)}
                                                            >
                                                                {ORDER_STATUS_LABELS[nextStatus]}
                                                            </Button>
                                                        )}
                                                        {order.paymentStatus !== PaymentStatus.PAID && (
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => updatePaymentStatus(order.id, PaymentStatus.PAID)}
                                                            >
                                                                Lunas
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title={`Detail Pesanan - ${selectedOrder.orderNumber}`}
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Pelanggan</p>
                                <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                                <p className="text-sm text-gray-600">{selectedOrder.customerPhone}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600">Tanggal</p>
                                <p className="font-semibold text-gray-900">
                                    {formatDateTime(selectedOrder.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-gray-600 mb-2">Item Pesanan</p>
                            <div className="space-y-2">
                                {selectedOrder.items.map((item) => (
                                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{item.serviceName}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} {item.unit} × {formatCurrency(item.pricePerUnit)}
                                                </p>
                                                {item.notes && (
                                                    <p className="text-xs text-gray-500 mt-1">📝 {item.notes}</p>
                                                )}
                                            </div>
                                            <p className="font-semibold text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 space-y-2">
                            <div className="flex justify-between text-gray-700">
                                <span>Subtotal</span>
                                <span className="font-semibold">{formatCurrency(selectedOrder.subtotal)}</span>
                            </div>

                            {selectedOrder.discount > 0 && (
                                <div className="flex justify-between text-gray-700">
                                    <span>Diskon</span>
                                    <span className="font-semibold">-{formatCurrency(selectedOrder.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total</span>
                                <span>{formatCurrency(selectedOrder.total)}</span>
                            </div>

                            <div className="flex justify-between text-gray-700">
                                <span>Dibayar</span>
                                <span className="font-semibold">{formatCurrency(selectedOrder.amountPaid)}</span>
                            </div>
                        </div>

                        {selectedOrder.notes && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                    <strong>Catatan:</strong> {selectedOrder.notes}
                                </p>
                            </div>
                        )}

                        <div className="flex gap-2 pt-4">
                            <Button variant="ghost" onClick={() => setShowDetailModal(false)} className="flex-1">
                                Tutup
                            </Button>
                            <Button onClick={() => window.print()} className="flex-1">
                                Cetak Nota
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
