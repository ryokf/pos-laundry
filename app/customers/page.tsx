// Customers Management page

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { Customer, Order } from '@/lib/types';
import { getAllCustomers, saveCustomer, getAllOrders } from '@/lib/services/storage.service';
import { formatCurrency, formatDate, generateId } from '@/lib/utils/formatters';
import { validateRequired, validatePhone } from '@/lib/utils/validators';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    function loadCustomers() {
        setCustomers(getAllCustomers());
    }

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    function handleSaveCustomer() {
        if (!validateRequired(formData.name)) {
            alert('Nama pelanggan harus diisi');
            return;
        }

        if (!validatePhone(formData.phone)) {
            alert('Nomor telepon tidak valid');
            return;
        }

        const customer: Customer = {
            id: generateId(),
            ...formData,
            createdAt: new Date().toISOString(),
        };

        saveCustomer(customer);
        loadCustomers();
        setShowAddModal(false);
        setFormData({ name: '', phone: '', address: '' });
    }

    function getCustomerStats(customerId: string) {
        const orders = getAllOrders().filter(o => o.customerId === customerId);
        const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);

        return {
            totalOrders: orders.length,
            totalSpent,
            orders,
        };
    }

    return (
        <div className="min-h-screen">
            <Header title="Pelanggan" subtitle="Kelola database pelanggan" />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900">Daftar Pelanggan</h2>

                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                            <Input
                                placeholder="Cari nama atau nomor..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64"
                            />
                            <Button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto">
                                + Tambah Pelanggan
                            </Button>
                        </div>
                    </div>

                    {filteredCustomers.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Tidak ada pelanggan</p>
                            <p className="text-sm mt-2">Tambahkan pelanggan baru untuk memulai</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCustomers.map((customer) => {
                                const stats = getCustomerStats(customer.id);

                                return (
                                    <button
                                        key={customer.id}
                                        onClick={() => {
                                            setSelectedCustomer(customer);
                                            setShowDetailModal(true);
                                        }}
                                        className="text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">{customer.name}</p>
                                                <p className="text-sm text-gray-600">{customer.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Total Transaksi</p>
                                                <p className="font-bold text-blue-600">{stats.totalOrders}x</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{customer.address}</p>
                                        <div className="pt-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">Total Belanja</p>
                                            <p className="font-semibold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>

            {/* Add Customer Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Tambah Pelanggan Baru"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Pelanggan *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Nama lengkap"
                    />

                    <Input
                        label="Nomor Telepon *"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                    />

                    <Textarea
                        label="Alamat"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="Alamat lengkap"
                    />

                    <div className="flex gap-2 pt-4">
                        <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={handleSaveCustomer} className="flex-1">
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Customer Detail Modal */}
            {selectedCustomer && (
                <Modal
                    isOpen={showDetailModal}
                    onClose={() => setShowDetailModal(false)}
                    title="Detail Pelanggan"
                    size="lg"
                >
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <p className="font-semibold text-gray-900 text-lg">{selectedCustomer.name}</p>
                            <p className="text-gray-600">{selectedCustomer.phone}</p>
                            <p className="text-gray-600">{selectedCustomer.address}</p>
                        </div>

                        {(() => {
                            const stats = getCustomerStats(selectedCustomer.id);

                            return (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Total Transaksi</p>
                                            <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Total Belanja</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {formatCurrency(stats.totalSpent)}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-3">Riwayat Transaksi</h3>
                                        {stats.orders.length === 0 ? (
                                            <p className="text-center py-8 text-gray-500">Belum ada transaksi</p>
                                        ) : (
                                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                                {stats.orders.reverse().map((order) => (
                                                    <div key={order.id} className="bg-gray-50 rounded-lg p-3">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{order.orderNumber}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {formatDate(order.createdAt)}
                                                                </p>
                                                            </div>
                                                            <p className="font-semibold text-gray-900">
                                                                {formatCurrency(order.total)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </>
                            );
                        })()}

                        <Button onClick={() => setShowDetailModal(false)} className="w-full">
                            Tutup
                        </Button>
                    </div>
                </Modal>
            )}
        </div>
    );
}
