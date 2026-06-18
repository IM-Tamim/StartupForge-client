"use client";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FiFileText, FiCheckCircle, FiClock, FiArrowRight, FiBriefcase } from "react-icons/fi";
import { getApplications } from "@/lib/api/applications";

export default function CollaboratorOverviewPage() {
    const { data: session } = authClient.useSession();
    const [stats, setStats] = useState({ total: 0, accepted: 0, pending: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!session?.user) return;
        getApplications({ applicant_email: session.user.email })
            .then((data) => {
                const arr = Array.isArray(data) ? data : data.applications || [];
                setStats({
                    total:    arr.length,
                    accepted: arr.filter((a) => a.status === "accepted").length,
                    pending:  arr.filter((a) => a.status === "pending").length,
                });
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [session]);

    const cards = [
        { label: "Total Applications", value: stats.total,    icon: FiFileText,    color: "text-secondary", bg: "bg-secondary/10" },
        { label: "Accepted",           value: stats.accepted, icon: FiCheckCircle, color: "text-success",   bg: "bg-success/10"   },
        { label: "Pending",            value: stats.pending,  icon: FiClock,       color: "text-warning",   bg: "bg-warning/10"   },
    ];

    const quickLinks = [
        { href: "/opportunities",                          label: "Browse Roles",       desc: "Find your next startup opportunity",   icon: FiBriefcase   },
        { href: "/dashboard/collaborator/my-applications", label: "My Applications",    desc: "Track the status of your applications", icon: FiFileText    },
        { href: "/dashboard/collaborator/profile",         label: "Update Profile",     desc: "Keep your skills and bio up to date",  icon: FiCheckCircle },
    ];

    return (
        <div>
            
        </div>
    );
}
