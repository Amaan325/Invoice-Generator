import React, { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import InvoicePDF from './InvoicePDF';

const InvoiceForm = () => {
    // Pre-filled demo data for testing
    const [orderNo, setOrderNo] = useState('INV-2026-0522-017');
    const [customerName, setCustomerName] = useState('The Hamilton Family Office');
    const [phoneNumber, setPhoneNumber] = useState('+44 20 7123 4567');
    const [address, setAddress] = useState('25 Berkeley Square\nMayfair, London W1J 6QF\nUnited Kingdom');
    const [attention, setAttention] = useState('Mr. Edward Hamilton');
    const [email, setEmail] = useState('ehamilton@hamiltonfq.com');
    const [date, setDate] = useState('May 22, 2026');
    const [dueDate, setDueDate] = useState('June 21, 2026');
    const [items, setItems] = useState([
        {
            id: 1,
            name: 'Round Brilliant Cut Diamond',
            description: '3.02 ct | D Color | VVS2 Clarity | Excellent Cut | GIA Certificate No. 2487136210 | Origin: Botswana',
            quantity: 1,
            price: 210000
        },
        {
            id: 2,
            name: 'Cushion Cut Diamond',
            description: '2.01 ct | F Color | VS1 Clarity | Ideal Cut | GIA Certificate No. 5298473921 | Origin: Lesotho',
            quantity: 3,
            price: 125000
        },
        {
            id: 3,
            name: 'Emerald Cut Diamond',
            description: '4.50 ct | H Color | VVS1 Clarity | Excellent Cut | GIA Certificate No. 9876543210 | Origin: Namibia',
            quantity: 1,
            price: 195000
        },
        {
            id: 4,
            name: 'Princess Cut Diamond',
            description: '2.75 ct | E Color | VS2 Clarity | Very Good Cut | GIA Certificate No. 1234567890 | Origin: Canada',
            quantity: 1,
            price: 89000
        },
        {
            id: 5,
            name: 'Oval Cut Diamond',
            description: '5.10 ct | G Color | IF Clarity | Excellent Cut | GIA Certificate No. 3456789012 | Origin: South Africa',
            quantity: 1,
            price: 310000
        }
    ]);
    const [nextId, setNextId] = useState(6);
    const [isGenerating, setIsGenerating] = useState(false);

    const addItem = () => {
        setItems([...items, { id: nextId, name: '', description: '', quantity: 1, price: 0 }]);
        setNextId(nextId + 1);
    };

    const removeItem = (id) => {
        if (items.length > 1) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const updateItem = (id, field, value) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        ));
    };

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    };

    const handleExportPDF = async () => {
        if (!orderNo || !customerName) {
            alert('Please fill in Order No and Customer Name');
            return;
        }

        if (items.some(item => !item.name || item.quantity <= 0 || item.price < 0)) {
            alert('Please fill in all item details correctly');
            return;
        }

        setIsGenerating(true);
        try {
            const netTotal = calculateTotal();
            const vat = netTotal * 0.065;
            const grossTotal = netTotal + vat;

            const invoiceData = {
                orderNo: orderNo,
                customerName: customerName,
                phoneNumber: phoneNumber,
                address: address,
                date: date,
                dueDate: dueDate,
                attention: attention,
                email: email,
                items: items.filter(item => item.name).map((item, index) => ({
                    sno: index + 1,
                    name: item.name,
                    description: item.description || "Premium quality gemstone",
                    quantity: item.quantity,
                    price: item.price
                })),
                netTotal: netTotal,
                vat: vat,
                grossTotal: grossTotal,
                verifiedBy: "*Verified by: 75% gold Vetted on Worthserse, Austria",
                contactPhone: "+43 664 1488753",
                contactEmail: "info@veristone.eu",
                website: "www.veristone.eu"
            };

            const blob = await pdf(<InvoicePDF data={invoiceData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_${orderNo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            {/* Premium Header */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                            <span className="text-sm font-medium text-white/90">Premium Invoice Generator</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
                            Create Professional Invoices
                        </h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            Generate elegant, premium invoices for your high-value transactions with just a few clicks
                        </p>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Main Content */}
            <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Total Items</p>
                                <p className="text-2xl font-bold text-slate-900">{items.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">Net Total</p>
                                <p className="text-2xl font-bold text-slate-900">€{calculateTotal().toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-500 mb-1">VAT (6.5%)</p>
                                <p className="text-2xl font-bold text-slate-900">€{(calculateTotal() * 0.065).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11.172a2 2 0 011.414.586l2.828 2.828a2 2 0 01.586 1.414V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-white/70 mb-1">Gross Total</p>
                                <p className="text-2xl font-bold text-white">€{(calculateTotal() * 1.065).toLocaleString()}</p>
                            </div>
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200 bg-slate-50/50 px-6 md:px-8 py-5">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Invoice Information</h2>
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* Order & Customer Information */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Order Number <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={orderNo}
                                            onChange={(e) => setOrderNo(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="e.g., INV-2026-0522-017"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Customer Name <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="The Hamilton Family Office"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="+44 20 7123 4567"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="client@example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute top-3 left-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            rows="4"
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50 resize-none"
                                            placeholder="25 Berkeley Square&#10;Mayfair, London W1J 6QF&#10;United Kingdom"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Attention (Person Name)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            value={attention}
                                            onChange={(e) => setAttention(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="Mr. Edward Hamilton"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Invoice Date
                                        </label>
                                        <input
                                            type="text"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="May 22, 2026"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Due Date
                                        </label>
                                        <input
                                            type="text"
                                            value={dueDate}
                                            onChange={(e) => setDueDate(e.target.value)}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 bg-slate-50/50"
                                            placeholder="June 21, 2026"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Section */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>
                                    <h2 className="text-lg font-semibold text-slate-900">Invoice Items</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="group px-5 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm font-medium"
                                >
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Item
                                </button>
                            </div>

                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Item Name</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Quantity</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Unit Price (€)</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total (€)</th>
                                            <th className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {items.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.name}
                                                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                        placeholder="Round Brilliant Cut Diamond"
                                                    />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <input
                                                        type="text"
                                                        value={item.description}
                                                        onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                        placeholder="3.02 ct | D Color | VVS2 Clarity"
                                                    />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                    />
                                                </td>
                                                <td className="px-5 py-3">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all duration-200 text-sm"
                                                    />
                                                </td>
                                                <td className="px-5 py-3 text-slate-900 font-semibold">
                                                    €{(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </td>
                                                <td className="px-5 py-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="text-slate-400 hover:text-red-600 transition-colors disabled:opacity-50"
                                                        disabled={items.length === 1}
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => {
                                    setOrderNo('INV-2026-0522-017');
                                    setCustomerName('The Hamilton Family Office');
                                    setPhoneNumber('+44 20 7123 4567');
                                    setAddress('25 Berkeley Square\nMayfair, London W1J 6QF\nUnited Kingdom');
                                    setAttention('Mr. Edward Hamilton');
                                    setEmail('ehamilton@hamiltonfq.com');
                                    setDate('May 22, 2026');
                                    setDueDate('June 21, 2026');
                                    setItems([
                                        {
                                            id: 1,
                                            name: 'Round Brilliant Cut Diamond',
                                            description: '3.02 ct | D Color | VVS2 Clarity | Excellent Cut | GIA Certificate No. 2487136210 | Origin: Botswana',
                                            quantity: 1,
                                            price: 210000
                                        },
                                        {
                                            id: 2,
                                            name: 'Cushion Cut Diamond',
                                            description: '2.01 ct | F Color | VS1 Clarity | Ideal Cut | GIA Certificate No. 5298473921 | Origin: Lesotho',
                                            quantity: 3,
                                            price: 125000
                                        },
                                        {
                                            id: 3,
                                            name: 'Emerald Cut Diamond',
                                            description: '4.50 ct | H Color | VVS1 Clarity | Excellent Cut | GIA Certificate No. 9876543210 | Origin: Namibia',
                                            quantity: 1,
                                            price: 195000
                                        },
                                        {
                                            id: 4,
                                            name: 'Princess Cut Diamond',
                                            description: '2.75 ct | E Color | VS2 Clarity | Very Good Cut | GIA Certificate No. 1234567890 | Origin: Canada',
                                            quantity: 1,
                                            price: 89000
                                        },
                                        {
                                            id: 5,
                                            name: 'Oval Cut Diamond',
                                            description: '5.10 ct | G Color | IF Clarity | Excellent Cut | GIA Certificate No. 3456789012 | Origin: South Africa',
                                            quantity: 1,
                                            price: 310000
                                        }
                                    ]);
                                    setNextId(6);
                                }}
                                className="px-6 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                            >
                                Reset to Demo
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setOrderNo('');
                                    setCustomerName('');
                                    setPhoneNumber('');
                                    setAddress('');
                                    setAttention('');
                                    setEmail('');
                                    setDate('May 22, 2026');
                                    setDueDate('June 21, 2026');
                                    setItems([{ id: 1, name: '', description: '', quantity: 1, price: 0 }]);
                                    setNextId(2);
                                }}
                                className="px-6 py-2.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-200 font-medium"
                            >
                                Clear Form
                            </button>
                            <button
                                type="button"
                                onClick={handleExportPDF}
                                disabled={!orderNo || !customerName || isGenerating || items.some(item => !item.name || item.quantity <= 0 || item.price < 0)}
                                className="px-8 py-2.5 bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isGenerating ? (
                                    <>
                                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        Export PDF
                                    </>
                                )}
                            </button>
                        </div>

                        <p className="text-xs text-slate-500 mt-6 text-center">
                            <span className="inline-flex items-center gap-1">🔒 All information is processed locally</span>
                            <span className="mx-2">•</span>
                            <span>Order Number and Customer Name are required</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceForm;