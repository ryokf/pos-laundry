// Dashboard page

'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import { getAllOrders } from '@/lib/services/storage.service';
import { Order, OrderStatus, DashboardStats } from '@/lib/types';
import { formatCurrency } from '@/lib/utils/formatters';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/constants';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats>({
        todayRevenue: 0,
        todayOrders: 0,
        todayCompleted: 0,
        ordersByStatus: {
            [OrderStatus.RECEIVED]: 0,
            [OrderStatus.WASHING]: 0,
            [OrderStatus.IRONING]: 0,
            [OrderStatus.PACKING]: 0,
            [OrderStatus.READY]: 0,
            [OrderStatus.COMPLETED]: 0,
        },
    });

    const [recentOrders, setRecentOrders] = useState<Order[]>([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    function loadDashboardData() {
        const orders = getAllOrders();
        const today = new Date().toDateString();

        const todayOrders = orders.filter(
            (order) => new Date(order.createdAt).toDateString() === today
        );

        const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
        const todayCompleted = todayOrders.filter(
            (order) => order.status === OrderStatus.COMPLETED
        ).length;

        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {} as Record<OrderStatus, number>);

        setStats({
            todayRevenue,
            todayOrders: todayOrders.length,
            todayCompleted,
            ordersByStatus,
        });

        setRecentOrders(orders.slice(-10).reverse());
    }

    return (
        <div className="min-h-screen">
            <Header title="Dashboard" subtitle="Ringkasan bisnis hari ini" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Omzet Hari Ini</p>
                                <p className="text-3xl font-bold mt-2">{formatCurrency(stats.todayRevenue)}</p>
                            </div>
                            <div className="text-5xl opacity-20">💰</div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm font-medium">Pesanan Masuk</p>
                                <p className="text-3xl font-bold mt-2">{stats.todayOrders}</p>
                            </div>
                            <div className="text-5xl opacity-20">📦</div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Pesanan Selesai</p>
                                <p className="text-3xl font-bold mt-2">{stats.todayCompleted}</p>
                            </div>
                            <div className="text-5xl opacity-20">✅</div>
                        </div>
                    </Card>
                </div>

                {/* Order Status Overview */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Status Pesanan</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Object.values(OrderStatus).map((status) => (
                            <div
                                key={status}
                                className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200"
                            >
                                <p className="text-2xl font-bold text-gray-900">
                                    {stats.ordersByStatus[status] || 0}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {ORDER_STATUS_LABELS[status]}
                                </p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Pesanan Terbaru</h2>
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Belum ada pesanan</p>
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
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 font-medium text-gray-900">{order.orderNumber}</td>
                                            <td className="py-3 px-4 text-gray-700">{order.customerName}</td>
                                            <td className="py-3 px-4 font-semibold text-gray-900">
                                                {formatCurrency(order.total)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ORDER_STATUS_COLORS[order.status]}`}>
                                                    {ORDER_STATUS_LABELS[order.status]}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div >
    );
}
