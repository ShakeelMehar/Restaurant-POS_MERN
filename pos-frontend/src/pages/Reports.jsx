import React, { useEffect, useState } from "react";
import BackButton from "../components/shared/BackButton";
import { FiDollarSign, FiCreditCard, FiGlobe, FiShoppingBag, FiUser } from "react-icons/fi";

const PAYMENT_ICONS = {
  Cash:   FiDollarSign,
  Card:   FiCreditCard,
  Online: FiGlobe,
};

const Reports = () => {
  useEffect(() => { document.title = "POS | Reports"; }, []);

  const [reportData] = useState({
    totalSales:     { total: 15000, count: 45 },
    paymentMethods: [
      { _id: "Cash",   total: 10000 },
      { _id: "Card",   total: 5000 },
    ],
    cashierSales:   [{ _id: "1", name: "Ali", total: 15000 }],
  });

  return (
    <section className="min-h-[calc(100dvh-4rem)] bg-background pb-24">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-card/50">
        <BackButton />
        <div>
          <h1 className="text-lg font-extrabold text-foreground tracking-tight">Sales Reports</h1>
          <p className="text-xs text-muted-foreground font-medium">View sales and performance metrics</p>
        </div>
      </div>

      <div className="px-4 py-3 space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div className="bg-card rounded-[14px] border border-border transition-all duration-200 hover:shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px,rgba(0,0,0,0.1)_0_4px_8px] p-6 col-span-1">
            <div className="flex items-start justify-between mb-4">
              <p className="text-sm font-bold text-muted-foreground">Total Sales</p>
              <div className="flex items-center justify-center h-10 w-10 text-xl text-muted-foreground">
                <FiDollarSign />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-foreground">PKR {reportData.totalSales.total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2 font-medium">
              {reportData.totalSales.count} orders placed
            </p>
          </div>
        </div>

        {/* Breakdown cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Payment Methods */}
          <div className="bg-card rounded-[14px] border border-border p-6">
            <h2 className="text-[15px] font-extrabold text-foreground mb-4">By Payment Method</h2>
            <div className="space-y-3">
              {reportData.paymentMethods.map((pm) => {
                const Icon = PAYMENT_ICONS[pm._id] || FiShoppingBag;
                const pct = Math.round((pm.total / reportData.totalSales.total) * 100);
                return (
                  <div key={pm._id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-secondary border border-border text-muted-foreground">
                          <Icon size={13} />
                        </div>
                        <span className="text-sm font-bold text-foreground">{pm._id}</span>
                      </div>
                      <span className="text-sm font-extrabold text-primary">PKR {pm.total.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{pct}% of total</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* By Cashier */}
          <div className="bg-card rounded-[14px] border border-border p-6">
            <h2 className="text-[15px] font-extrabold text-foreground mb-4">By Cashier</h2>
            <div className="space-y-3">
              {reportData.cashierSales.map((cs) => (
                <div key={cs._id} className="flex items-center justify-between p-3 rounded-xl border border-transparent hover:bg-[hsl(var(--surface-soft))] transition-all">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[hsl(var(--surface-strong))] font-semibold text-sm text-foreground">
                      {cs.name?.charAt(0) || <FiUser />}
                    </div>
                    <span className="text-sm font-bold text-foreground">{cs.name}</span>
                  </div>
                  <span className="text-sm font-extrabold text-primary">PKR {cs.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reports;
