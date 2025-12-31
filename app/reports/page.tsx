// Reports page - Financial reporting

'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import { Expense } from '@/lib/types';
import { getAllOrders, getAllExpenses, saveExpense } from '@/lib/services/storage.service';
import { formatCurrency, formatDate, generateId } from '@/lib/utils/formatters';
import { EXPENSE_CATEGORIES } from '@/lib/constants';

type DateRange = 'today' | 'week' | 'month' | 'all';

export default function ReportsPage() {
    const [dateRange, setDateRange] = useState<DateRange>('month');
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);

    const [expenseForm, setExpenseForm] = useState({
        category: EXPENSE_CATEGORIES[0],
        amount: '',
        description: '',
    });

    useEffect(() => {
        loadExpenses();
    }, []);

    function loadExpenses() {
        setExpenses(getAllExpenses());
    }

    function getFilteredData() {
        const now = new Date();
        const orders = getAllOrders();

        let startDate: Date;

        switch (dateRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            default:
                startDate = new Date(0);
        }

        const filteredOrders = orders.filter(
            o => new Date(o.createdAt) >= startDate
        );

        const filteredExpenses = expenses.filter(
            e => new Date(e.date) >= startDate
        );

        const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0);
        const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
        const profit = totalRevenue - totalExpenses;

        return {
            totalRevenue,
            totalExpenses,
            profit,
            orderCount: filteredOrders.length,
            filteredExpenses,
        };
    }

    function handleAddExpense() {
        if (!expenseForm.amount || parseFloat(expenseForm.amount) <= 0) {
            alert('Jumlah pengeluaran harus diisi');
            return;
        }

        const expense: Expense = {
            id: generateId(),
            category: expenseForm.category,
            amount: parseFloat(expenseForm.amount),
            description: expenseForm.description,
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
        };

        saveExpense(expense);
        loadExpenses();
        setShowExpenseModal(false);
        setExpenseForm({
            category: EXPENSE_CATEGORIES[0],
            amount: '',
            description: '',
        });
    }

    const data = getFilteredData();

    return (
        <div className="min-h-screen">
            <Header title="Laporan Keuangan" subtitle="Analisis pemasukan dan pengeluaran" />

            <div className="p-4 sm:p-6 lg:p-8 space-y-4 lg:space-y-6">
                {/* Date Range Filter */}
                <Card>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Periode Laporan</h2>
                        <Select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value as DateRange)}
                            options={[
                                { value: 'today', label: 'Hari Ini' },
                                { value: 'week', label: '7 Hari Terakhir' },
                                { value: 'month', label: 'Bulan Ini' },
                                { value: 'all', label: 'Semua Waktu' },
                            ]}
                            className="w-full sm:w-48"
                        />
                    </div>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                    <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Pemasukan</p>
                                <p className="text-3xl font-bold mt-2">{formatCurrency(data.totalRevenue)}</p>
                                <p className="text-green-100 text-sm mt-1">{data.orderCount} transaksi</p>
                            </div>
                            <div className="text-5xl opacity-20">💵</div>
                        </div>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Pengeluaran</p>
                                <p className="text-3xl font-bold mt-2">{formatCurrency(data.totalExpenses)}</p>
                                <p className="text-red-100 text-sm mt-1">{data.filteredExpenses.length} item</p>
                            </div>
                            <div className="text-5xl opacity-20">💸</div>
                        </div>
                    </Card>

                    <Card className={`bg-gradient-to-br ${data.profit >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`${data.profit >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium`}>
                                    {data.profit >= 0 ? 'Laba' : 'Rugi'}
                                </p>
                                <p className="text-3xl font-bold mt-2">{formatCurrency(Math.abs(data.profit))}</p>
                            </div>
                            <div className="text-5xl opacity-20">{data.profit >= 0 ? '📈' : '📉'}</div>
                        </div>
                    </Card>
                </div>

                {/* Expenses List */}
                <Card>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Daftar Pengeluaran</h2>
                        <Button onClick={() => setShowExpenseModal(true)}>
                            + Tambah Pengeluaran
                        </Button>
                    </div>

                    {data.filteredExpenses.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">Tidak ada pengeluaran</p>
                            <p className="text-sm mt-2">Tambahkan pengeluaran untuk melacak biaya operasional</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tanggal</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Kategori</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Keterangan</th>
                                        <th className="text-right py-3 px-4 font-semibold text-gray-700">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.filteredExpenses.reverse().map((expense) => (
                                        <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-700">
                                                {formatDate(expense.date)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {expense.category}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">{expense.description}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-red-600">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>

            {/* Add Expense Modal */}
            <Modal
                isOpen={showExpenseModal}
                onClose={() => setShowExpenseModal(false)}
                title="Tambah Pengeluaran"
            >
                <div className="space-y-4">
                    <Select
                        label="Kategori"
                        value={expenseForm.category}
                        onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                        options={EXPENSE_CATEGORIES.map(cat => ({ value: cat, label: cat }))}
                    />

                    <Input
                        label="Jumlah *"
                        type="number"
                        min="0"
                        value={expenseForm.amount}
                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                        placeholder="0"
                    />

                    <Textarea
                        label="Keterangan"
                        value={expenseForm.description}
                        onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                        placeholder="Deskripsi pengeluaran"
                    />

                    <div className="flex gap-2 pt-4">
                        <Button variant="ghost" onClick={() => setShowExpenseModal(false)} className="flex-1">
                            Batal
                        </Button>
                        <Button onClick={handleAddExpense} className="flex-1">
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
