"use client";

import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Dashboard = () => {
    const { role } = useAuthContext();
    const router = useRouter();

    useEffect(() => {
        role === "admin" && router.push("/dashboard/users");
        role === "mod" && router.push("/dashboard/generations");
    }, [role, router]);

    return <main className="min-h-screen"></main>;
};

export default Dashboard;
