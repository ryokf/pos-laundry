// Cashier page - Fast transaction entry

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import {
    Customer,
    OrderItem,
    ServiceType,
    PaymentMethod,
    PaymentStatus,
    OrderStatus,
} from '@/lib/types';
import {
    getAllCustomers,
    saveCustomer,
    getAllServices,
    saveOrder,
} from '@/lib/services/storage.service';
import {
    calculateOrderItemSubtotal,
    calculateOrderSubtotal,
    calculateOrderTotal,
} from '@/lib/services/pricing.service';
import {
    generateId,
    generateOrderNumber,
    formatCurrency,
    addDays,
} from '@/lib/utils/formatters';
import { validateRequired, validatePhone } from '@/lib/utils/validators';

export default function CashierPage() {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [cart, setCart] = useState<OrderItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [notes, setNotes] = useState('');

    const [showCustomerModal, setShowCustomerModal] = useState(false);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.KILOAN);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [itemNotes, setItemNotes] = useState('');

    const services = getAllServices();
    const filteredServices = services.filter(s => s.type === serviceType);

    const subtotal = calculateOrderSubtotal(cart);
    const total = calculateOrderTotal(subtotal, discount);

    function handleAddToCart() {
        if (!selectedServiceId || !quantity || parseFloat(quantity) <= 0) {
            alert('Pilih layanan dan masukkan jumlah yang valid');
            return;
        }

        const service = services.find(s => s.id === selectedServiceId);
        if (!service) return;

        const item: OrderItem = {
            id: generateId(),
            serviceId: service.id,
            serviceName: service.name,
            quantity: parseFloat(quantity),
            unit: service.unit,
            pricePerUnit: service.price,
            subtotal: 0,
            notes: itemNotes,
        };

        item.subtotal = calculateOrderItemSubtotal(item);

        setCart([...cart, item]);
        setQuantity('');
        setItemNotes('');
        setSelectedServiceId('');
    }

    function handleRemoveFromCart(itemId: string) {
        setCart(cart.filter(item => item.id !== itemId));
    }

    function handleCheckout(paymentMethod: PaymentMethod, amountPaid: number) {
        if (!selectedCustomer) {
            alert('Pilih pelanggan terlebih dahulu');
            return;
        }

        if (cart.length === 0) {
            alert('Keranjang masih kosong');
            return;
        }

        const paymentStatus =
            amountPaid >= total ? PaymentStatus.PAID :
                amountPaid > 0 ? PaymentStatus.PARTIALLY_PAID :
                    PaymentStatus.UNPAID;

        const estimatedDays = Math.max(...cart.map(item => {
            const service = services.find(s => s.id === item.serviceId);
            return service?.estimatedDays || 3;
        }));

        const order = {
            id: generateId(),
            orderNumber: generateOrderNumber(),
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            customerPhone: selectedCustomer.phone,
            items: cart,
            subtotal,
            discount,
            total,
            paymentStatus,
            paymentMethod,
            amountPaid,
            status: OrderStatus.RECEIVED,
            estimatedCompletion: addDays(new Date(), estimatedDays).toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            notes,
        };

        saveOrder(order);

        // Reset form
        setCart([]);
        setDiscount(0);
        setNotes('');
        setSelectedCustomer(null);
        setShowCheckoutModal(false);
        setShowSuccessModal(true);
    }

    return (
        <div className="min-h-screen">
            <Header title="Kasir" subtitle="Transaksi baru" />

            <div className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {/* Left: Service Selection */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer Selection */}
                        <Card>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Pelanggan</h2>
                                <Button
                                    size="sm"
                                    onClick={() => setShowCustomerModal(true)}
                                >
                                    {selectedCustomer ? 'Ganti Pelanggan' : 'Pilih Pelanggan'}
                                </Button>
                            </div>

                            {selectedCustomer ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="font-semibold text-gray-900">{selectedCustomer.name}</p>
                                    <p className="text-sm text-gray-600">{selectedCustomer.phone}</p>
                                    <p className="text-sm text-gray-600">{selectedCustomer.address}</p>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Pilih pelanggan untuk memulai transaksi</p>
                                </div>
                            )}
                        </Card>

                        {/* Service Type Tabs */}
                        <Card>
                            <div className="flex gap-2 mb-6">
                                <Button
                                    variant={serviceType === ServiceType.KILOAN ? 'primary' : 'ghost'}
                                    onClick={() => setServiceType(ServiceType.KILOAN)}
                                    className="flex-1"
                                >
                                    Kiloan
                                </Button>
                                <Button
                                    variant={serviceType === ServiceType.SATUAN ? 'primary' : 'ghost'}
                                    onClick={() => setServiceType(ServiceType.SATUAN)}
                                    className="flex-1"
                                >
                                    Satuan
                                </Button>
                            </div>

                            <div className="space-y-4">
                                <Select
                                    label="Pilih Layanan"
                                    value={selectedServiceId}
                                    onChange={(e) => setSelectedServiceId(e.target.value)}
                                    options={[
                                        { value: '', label: '-- Pilih Layanan --' },
                                        ...filteredServices.map(s => ({
                                            value: s.id,
                                            label: `${s.name} - ${formatCurrency(s.price)}/${s.unit}`,
                                        })),
                                    ]}
                                />

                                <Input
                                    label={`Jumlah (${filteredServices.find(s => s.id === selectedServiceId)?.unit || 'unit'})`}
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="0"
                                />

                                <Textarea
                                    label="Catatan Item (Opsional)"
                                    value={itemNotes}
                                    onChange={(e) => setItemNotes(e.target.value)}
                                    placeholder="Contoh: Baju merah luntur, ada noda di kerah"
                                />

                                <Button onClick={handleAddToCart} className="w-full">
                                    Tambah ke Keranjang
                                </Button>
                            </div>
                        </Card>
                    </div>

                    {/* Right: Cart */}
                    <div className="space-y-6">
                        <Card>
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Keranjang</h2>

                            {cart.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    <p>Keranjang kosong</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.serviceName}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {item.quantity} {item.unit} × {formatCurrency(item.pricePerUnit)}
                                                    </p>
                                                    {item.notes && (
                                                        <p className="text-xs text-gray-500 mt-1">📝 {item.notes}</p>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveFromCart(item.id)}
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                            <p className="text-right font-semibold text-gray-900">
                                                {formatCurrency(item.subtotal)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-200 space-y-3">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal</span>
                                    <span className="font-semibold">{formatCurrency(subtotal)}</span>
                                </div>

                                <Input
                                    label="Diskon"
                                    type="number"
                                    min="0"
                                    value={discount}
                                    onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                />

                                <div className="flex justify-between text-lg font-bold text-gray-900">
                                    <span>Total</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>

                                <Textarea
                                    label="Catatan Pesanan (Opsional)"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Catatan tambahan untuk pesanan ini"
                                />

                                <Button
                                    onClick={() => setShowCheckoutModal(true)}
                                    disabled={cart.length === 0 || !selectedCustomer}
                                    className="w-full"
                                    size="lg"
                                >
                                    Checkout
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Customer Selection Modal */}
            <CustomerModal
                isOpen={showCustomerModal}
                onClose={() => setShowCustomerModal(false)}
                onSelect={(customer) => {
                    setSelectedCustomer(customer);
                    setShowCustomerModal(false);
                }}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                total={total}
                onConfirm={handleCheckout}
            />

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="Transaksi Berhasil"
            >
                <div className="text-center py-6">
                    <div className="text-6xl mb-4">✅</div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                        Transaksi berhasil disimpan!
                    </p>
                    <p className="text-gray-600 mb-6">
                        Pesanan telah ditambahkan ke daftar transaksi
                    </p>
                    <Button onClick={() => setShowSuccessModal(false)}>
                        OK
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

// Customer Selection Modal Component
function CustomerModal({
    isOpen,
    onClose,
    onSelect,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (customer: Customer) => void;
}) {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        address: '',
    });

    useEffect(() => {
        if (isOpen) {
            setCustomers(getAllCustomers());
        }
    }, [isOpen]);

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
    );

    function handleAddCustomer() {
        if (!validateRequired(newCustomer.name)) {
            alert('Nama pelanggan harus diisi');
            return;
        }

        if (!validatePhone(newCustomer.phone)) {
            alert('Nomor telepon tidak valid');
            return;
        }

        const customer: Customer = {
            id: generateId(),
            ...newCustomer,
            createdAt: new Date().toISOString(),
        };

        saveCustomer(customer);
        setCustomers([...customers, customer]);
        onSelect(customer);
        setShowAddForm(false);
        setNewCustomer({ name: '', phone: '', address: '' });
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Pilih Pelanggan" size="lg">
            {!showAddForm ? (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Cari nama atau nomor telepon..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1"
                        />
                        <Button onClick={() => setShowAddForm(true)}>
                            + Tambah Baru
                        </Button>
                    </div>

                    <div className="max-h-96 overflow-y-auto space-y-2">
                        {filteredCustomers.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <p>Tidak ada pelanggan ditemukan</p>
                            </div>
                        ) : (
                            filteredCustomers.map((customer) => (
                                <button
                                    key={customer.id}
                                    onClick={() => onSelect(customer)}
                                    className="w-full text-left p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <p className="font-semibold text-gray-900">{customer.name}</p>
                                    <p className="text-sm text-gray-600">{customer.phone}</p>
                                    <p className="text-sm text-gray-500">{customer.address}</p>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <Input
                        label="Nama Pelanggan *"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="Nama lengkap"
                    />

                    <Input
                        label="Nomor Telepon *"
                        type="tel"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                    />

                    <Textarea
                        label="Alamat"
                        value={newCustomer.address}
                        onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                        placeholder="Alamat lengkap"
                    />

                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setShowAddForm(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={handleAddCustomer} className="flex-1">
                            Simpan
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
}

// Checkout Modal Component
function CheckoutModal({
    isOpen,
    onClose,
    total,
    onConfirm,
}: {
    isOpen: boolean;
    onClose: () => void;
    total: number;
    onConfirm: (paymentMethod: PaymentMethod, amountPaid: number) => void;
}) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [amountPaid, setAmountPaid] = useState(total);

    useEffect(() => {
        setAmountPaid(total);
    }, [total]);

    const change = amountPaid - total;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Checkout">
            <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Total Pembayaran</p>
                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(total)}</p>
                </div>

                <Select
                    label="Metode Pembayaran"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    options={[
                        { value: PaymentMethod.CASH, label: 'Tunai' },
                        { value: PaymentMethod.QRIS, label: 'QRIS' },
                        { value: PaymentMethod.TRANSFER, label: 'Transfer Bank' },
                    ]}
                />

                <Input
                    label="Jumlah Dibayar"
                    type="number"
                    min="0"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                />

                {change >= 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-700">Kembalian</p>
                        <p className="text-xl font-bold text-green-900">{formatCurrency(change)}</p>
                    </div>
                )}

                {change < 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-700">Kurang Bayar</p>
                        <p className="text-xl font-bold text-yellow-900">{formatCurrency(Math.abs(change))}</p>
                    </div>
                )}

                <div className="flex gap-2 pt-4">
                    <Button variant="ghost" onClick={onClose} className="flex-1">
                        Batal
                    </Button>
                    <Button
                        onClick={() => onConfirm(paymentMethod, amountPaid)}
                        className="flex-1"
                    >
                        Konfirmasi
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
