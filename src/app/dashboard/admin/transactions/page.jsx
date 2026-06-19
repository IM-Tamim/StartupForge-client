"use client";
import { useState, useEffect } from "react";
import { FiDollarSign, FiSearch, FiCheckCircle, FiClock } from "react-icons/fi";
import { getPayments } from "@/lib/api/payments";

const statusBadge = {
    paid:    "badge-success",
    pending: "badge-warning",
    failed:  "badge-error",
};

export default function AdminTransactionsPage() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");

    useEffect(() => {
        getPayments()
            .then((data) => setPayments(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = payments.filter((p) =>
        (p.user_email || "").toLowerCase().includes(search.toLowerCase())
    );

    const totalRevenue = payments
        .filter((p) => p.payment_status === "paid")
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
                <div>
                    <h1 className="text-2xl font-black text-base-content">Transactions</h1>
                    <p className="text-sm text-base-content/50 mt-1">
                        {payments.length} transaction{payments.length !== 1 ? "s" : ""} recorded
                    </p>
                </div>

                <div className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-success/20 bg-success/10">
                    <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
                        <FiDollarSign className="text-success" size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-base-content/50">Total Revenue</p>
                        <p className="text-lg font-black text-success">${totalRevenue}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by user email…"
                    className="w-full h-10 pl-11 pr-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <FiDollarSign size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No transactions found.</p>
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block rounded-2xl border border-base-300 bg-base-100 overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-base-300 text-left">
                                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-base-content/40">User</th>
                                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-base-content/40">Amount</th>
                                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-base-content/40">Date</th>
                                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-base-content/40">Status</th>
                                    <th className="px-5 py-3 font-semibold text-xs uppercase tracking-wide text-base-content/40">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p._id} className="border-b border-base-300 last:border-0">
                                        <td className="px-5 py-4 font-medium text-base-content">{p.user_email}</td>
                                        <td className="px-5 py-4 font-bold text-base-content">${p.amount}</td>
                                        <td className="px-5 py-4 text-base-content/50">
                                            {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-US", {
                                                month: "short", day: "numeric", year: "numeric",
                                            }) : "—"}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`badge badge-sm gap-1 capitalize ${statusBadge[p.payment_status] || "badge-ghost"}`}>
                                                {p.payment_status === "paid"
                                                    ? <FiCheckCircle size={10} />
                                                    : <FiClock size={10} />
                                                }
                                                {p.payment_status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-xs text-base-content/40 font-mono truncate max-w-[160px]">
                                            {p.transaction_id}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col gap-3">
                        {filtered.map((p) => (
                            <div key={p._id} className="rounded-2xl border border-base-300 bg-base-100 p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-bold text-base-content text-sm truncate">{p.user_email}</p>
                                    <span className={`badge badge-sm gap-1 capitalize shrink-0 ${statusBadge[p.payment_status] || "badge-ghost"}`}>
                                        {p.payment_status}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-base-content/50">
                                    <span className="font-bold text-base-content">${p.amount}</span>
                                    <span>
                                        {p.paid_at ? new Date(p.paid_at).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", year: "numeric",
                                        }) : "—"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}