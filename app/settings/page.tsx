// Settings page - System configuration

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { LaundryService, ServiceType, StoreSettings } from '@/lib/types';
import {
    getAllServices,
    saveService,
    deleteService,
    getStoreSettings,
    saveStoreSettings,
} from '@/lib/services/storage.service';
import { formatCurrency, generateId } from '@/lib/utils/formatters';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'pricing' | 'store'>('pricing');
    const [services, setServices] = useState<LaundryService[]>([]);
    const [showServiceModal, setShowServiceModal] = useState(false);
    const [storeSettings, setStoreSettings] = useState<StoreSettings>({
        name: '',
        address: '',
        phone: '',
        receiptFooter: '',
    });

    const [serviceForm, setServiceForm] = useState({
        name: '',
        type: ServiceType.KILOAN,
        price: '',
        unit: 'kg',
        estimatedDays: '3',
    });

    useEffect(() => {
        loadServices();
        loadStoreSettings();
    }, []);

    function loadServices() {
        setServices(getAllServices());
    }

    function loadStoreSettings() {
        setStoreSettings(getStoreSettings());
    }

    function handleSaveService() {
        if (!serviceForm.name || !serviceForm.price || parseFloat(serviceForm.price) <= 0) {
            alert('Nama dan harga layanan harus diisi');
            return;
        }

        const service: LaundryService = {
            id: generateId(),
            name: serviceForm.name,
            type: serviceForm.type,
            price: parseFloat(serviceForm.price),
            unit: serviceForm.unit,
            estimatedDays: parseInt(serviceForm.estimatedDays),
        };

        saveService(service);
        loadServices();
        setShowServiceModal(false);
        setServiceForm({
            name: '',
            type: ServiceType.KILOAN,
            price: '',
            unit: 'kg',
            estimatedDays: '3',
        });
    }

    function handleDeleteService(id: string) {
        if (confirm('Yakin ingin menghapus layanan ini?')) {
            deleteService(id);
            loadServices();
        }
    }

    function handleSaveStoreSettings() {
        if (!storeSettings.name || !storeSettings.phone) {
            alert('Nama toko dan nomor telepon harus diisi');
            return;
        }

        saveStoreSettings(storeSettings);
        alert('Pengaturan toko berhasil disimpan');
    }

    const kiloServices = services.filter(s => s.type === ServiceType.KILOAN);
    const satuanServices = services.filter(s => s.type === ServiceType.SATUAN);

    return (
        <div className="min-h-screen">
            <Header title="Pengaturan" subtitle="Konfigurasi sistem" />

            <div className="p-4 sm:p-6 lg:p-8">
                <Card>
                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('pricing')}
                            className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${activeTab === 'pricing'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Manajemen Harga
                        </button>
                        <button
                            onClick={() => setActiveTab('store')}
                            className={`px-4 py-2 font-medium transition-all whitespace-nowrap ${activeTab === 'store'
                                    ? 'text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            Profil Toko
                        </button>
                    </div>

                    {/* Pricing Tab */}
                    {activeTab === 'pricing' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Daftar Layanan & Harga</h2>
                                <Button onClick={() => setShowServiceModal(true)}>
                                    + Tambah Layanan
                                </Button>
                            </div>

                            {/* Kiloan Services */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Layanan Kiloan</h3>
                                <div className="space-y-2">
                                    {kiloServices.map((service) => (
                                        <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Estimasi: {service.estimatedDays} hari
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-bold text-gray-900">
                                                    {formatCurrency(service.price)}/{service.unit}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDeleteService(service.id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Satuan Services */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">Layanan Satuan</h3>
                                <div className="space-y-2">
                                    {satuanServices.map((service) => (
                                        <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">{service.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Estimasi: {service.estimatedDays} hari
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-bold text-gray-900">
                                                    {formatCurrency(service.price)}/{service.unit}
                                                </p>
                                                <Button
                                                    size="sm"
                                                    variant="danger"
                                                    onClick={() => handleDeleteService(service.id)}
                                                >
                                                    Hapus
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Store Settings Tab */}
                    {activeTab === 'store' && (
                        <div className="space-y-6 max-w-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Informasi Toko</h2>

                            <Input
                                label="Nama Toko *"
                                value={storeSettings.name}
                                onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                                placeholder="Nama laundry Anda"
                            />

                            <Textarea
                                label="Alamat"
                                value={storeSettings.address}
                                onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                                placeholder="Alamat lengkap toko"
                            />

                            <Input
                                label="Nomor Telepon *"
                                type="tel"
                                value={storeSettings.phone}
                                onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                                placeholder="08xxxxxxxxxx"
                            />

                            <Textarea
                                label="Footer Nota"
                                value={storeSettings.receiptFooter}
                                onChange={(e) => setStoreSettings({ ...storeSettings, receiptFooter: e.target.value })}
                                placeholder="Pesan yang akan muncul di bagian bawah nota"
                                helperText="Contoh: Barang yang tidak diambil dalam 1 bulan bukan tanggung jawab kami"
                            />

                            <Button onClick={handleSaveStoreSettings} className="w-full">
                                Simpan Pengaturan
                            </Button>
                        </div>
                    )}
                </Card>
            </div>

            {/* Add Service Modal */}
            <Modal
                isOpen={showServiceModal}
                onClose={() => setShowServiceModal(false)}
                title="Tambah Layanan Baru"
            >
                <div className="space-y-4">
                    <Input
                        label="Nama Layanan *"
                        value={serviceForm.name}
                        onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                        placeholder="Contoh: Cuci Setrika"
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tipe Layanan
                            </label>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={serviceForm.type === ServiceType.KILOAN ? 'primary' : 'ghost'}
                                    onClick={() => setServiceForm({ ...serviceForm, type: ServiceType.KILOAN, unit: 'kg' })}
                                    className="flex-1"
                                >
                                    Kiloan
                                </Button>
                                <Button
                                    size="sm"
                                    variant={serviceForm.type === ServiceType.SATUAN ? 'primary' : 'ghost'}
                                    onClick={() => setServiceForm({ ...serviceForm, type: ServiceType.SATUAN, unit: 'pcs' })}
                                    className="flex-1"
                                >
                                    Satuan
                                </Button>
                            </div>
                        </div>

                        <Input
                            label="Harga *"
                            type="number"
                            min="0"
                            value={serviceForm.price}
                            onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                            placeholder="0"
                        />
                    </div>

                    <Input
                        label="Estimasi Pengerjaan (hari)"
                        type="number"
                        min="0"
                        value={serviceForm.estimatedDays}
                        onChange={(e) => setServiceForm({ ...serviceForm, estimatedDays: e.target.value })}
                    />

                    <div className="flex gap-2 pt-4">
                        <Button variant="ghost" onClick={() => setShowServiceModal(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={handleSaveService} className="flex-1">
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
