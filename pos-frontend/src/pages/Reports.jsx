import React, { useEffect, useState } from "react";
import BackButton from "../components/shared/BackButton";

const Reports = () => {
    useEffect(() => {
        document.title = "POS | Reports";
    }, []);

    const [reportData, setReportData] = useState({ totalSales: { total: 0, count: 0 }, paymentMethods: [], cashierSales: [] });

    // Mock data for now, later connect to /api/report
    useEffect(() => {
        setReportData({
            totalSales: { total: 15000, count: 45 },
            paymentMethods: [{ _id: "Cash", total: 10000 }, { _id: "Card", total: 5000 }],
            cashierSales: [{ _id: "1", name: "Ali", total: 15000 }]
        });
    }, []);

    return (
        <section className="min-h-[calc(100vh-5rem)] bg-[#1f1f1f] pb-24">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
                <div className="flex items-center gap-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold tracking-wider text-[#f5f5f5]">
                            Sales Reports
                        </h1>
                        <p className="text-sm text-[#ababab]">
                            View sales and performance metrics.
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 py-4 sm:px-6 lg:px-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#202020] p-6">
                        <h2 className="text-sm uppercase tracking-wide text-[#ababab]">Total Sales</h2>
                        <p className="text-3xl font-bold text-[#f5f5f5] mt-2">PKR {reportData.totalSales.total}</p>
                        <p className="text-sm text-[#ababab] mt-1">{reportData.totalSales.count} orders</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#202020] p-6">
                        <h2 className="text-lg font-semibold text-[#f5f5f5] mb-4">By Payment Method</h2>
                        {reportData.paymentMethods.map(pm => (
                            <div key={pm._id || 'unknown'} className="flex justify-between items-center mb-2 border-b border-[#2a2a2a] pb-2">
                                <span className="text-[#ababab]">{pm._id || 'Unknown'}</span>
                                <span className="font-semibold text-[#F6B100]">PKR {pm.total}</span>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-2xl border border-[#2a2a2a] bg-[#202020] p-6">
                        <h2 className="text-lg font-semibold text-[#f5f5f5] mb-4">By Cashier</h2>
                        {reportData.cashierSales.map(cs => (
                            <div key={cs._id} className="flex justify-between items-center mb-2 border-b border-[#2a2a2a] pb-2">
                                <span className="text-[#ababab]">{cs.name}</span>
                                <span className="font-semibold text-[#F6B100]">PKR {cs.total}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reports;
