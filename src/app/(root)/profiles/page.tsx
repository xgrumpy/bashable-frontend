"use client";

import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProflePage = () => {
    const { username } = useAuthContext();
    const router = useRouter();
    useEffect(() => {
        if (username) {
            router.push(`/profiles/${encodeURIComponent(username)}`);
        } else {
            router.push("/discover?redirect=true");
        }
    }, [username, router]);

    return <main className="min-h-screen"></main>;
};

export default ProflePage;
