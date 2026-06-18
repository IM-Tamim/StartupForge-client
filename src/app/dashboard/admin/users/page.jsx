"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    FiUsers, FiSearch, FiCheck, FiX,
    FiShield, FiShieldOff, FiUserX,
} from "react-icons/fi";
import { getUsers } from "@/lib/api/users";
import { updateUserBlockStatus } from "@/lib/actions/users";

export default function AdminUsersPage() {
    const [users, setUsers]       = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState("");
    const [actingId, setActingId] = useState(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(Array.isArray(data) ? data : []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const handleToggleBlock = async (id, currentBlocked) => {
        setActingId(id);
        try {
            const data = await updateUserBlockStatus(id, !currentBlocked);
            if (data.modifiedCount > 0) {
                toast.success(currentBlocked ? "User unblocked." : "User blocked.");
                setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked: !currentBlocked } : u));
            }
        } catch (err) {
            toast.error(err.message || "Action failed.");
        } finally {
            setActingId(null);
        }
    };

    const filtered = users.filter((u) => {
        const q = search.toLowerCase();
        return (
            (u.name || "").toLowerCase().includes(q) ||
            (u.email || "").toLowerCase().includes(q) ||
            (u.role || "").toLowerCase().includes(q)
        );
    });

    if (loading) return (
        <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg text-secondary" />
        </div>
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-black text-base-content">Manage Users</h1>
                <p className="text-sm text-base-content/50 mt-1">
                    {users.length} registered user{users.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <FiSearch size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 pointer-events-none" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email, or role…"
                    className="w-full h-10 pl-11 pr-4 rounded-xl text-sm bg-base-100 border border-base-300 text-base-content outline-none focus:border-secondary transition-colors"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border border-base-300 bg-base-100 text-base-content/40">
                    <FiUsers size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No users match your search.</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map((user) => {
                        const isBlocked = !!user.isBlocked;
                        return (
                            <div key={user._id} className="rounded-2xl border border-base-300 bg-base-100 p-4 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center shrink-0 text-sm font-bold text-secondary">
                                        {user.image?.startsWith("http") ? (
                                            <img src={user.image} alt="" className="w-full h-full rounded-full object-cover" />
                                        ) : (
                                            (user.name || "U").charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-bold text-base-content text-sm truncate">{user.name || "Unnamed"}</p>
                                        <p className="text-xs text-base-content/50 truncate">{user.email}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="badge badge-sm badge-outline border-base-content/20 text-base-content/60 capitalize">
                                                {user.role || "user"}
                                            </span>
                                            {isBlocked && (
                                                <span className="badge badge-sm badge-error gap-1">
                                                    <FiUserX size={10} /> Blocked
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleToggleBlock(user._id, isBlocked)}
                                    disabled={actingId === user._id}
                                    className={`btn btn-sm rounded-xl gap-1.5 ${
                                        isBlocked
                                            ? "btn-outline btn-success"
                                            : "btn-outline btn-error"
                                    }`}
                                >
                                    {actingId === user._id ? (
                                        <span className="loading loading-spinner loading-xs" />
                                    ) : isBlocked ? (
                                        <><FiShield size={13} /> Unblock</>
                                    ) : (
                                        <><FiShieldOff size={13} /> Block</>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
