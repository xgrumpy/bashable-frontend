"use client";

import Footer from "@/component/layout/Footer";
import Header from "@/component/layout/Header";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { useNotificationContext } from "@/context/notificationContext";
import axiosReq from "@/utils/axios";
import { ReactNode, useEffect } from "react";
import { Toaster } from "react-hot-toast";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { login, username, role } = useAuthContext();
    const { initTheme } = useAppContext();
    const { initNotifications } = useNotificationContext();

    useEffect(() => {
        initTheme();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axiosReq
            .get("/users/login/check")
            .then((res: any) => {
                login(res.data);
            })
            .catch((err) => console.log(err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (username) {
            axiosReq
                .get("/users/notifications")
                .then((res: any) => {
                    initNotifications(res.data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    return (
        <>
            <Header />
            {username && (role === "admin" || role === "mod") ? (
                <>{children}</>
            ) : (
                <div className="flex justify-center items-center min-h-screen w-full">
                    <h5 className="font-medium text-black dark:text-white text-xl">
                        You are not an admin or moderator
                    </h5>
                </div>
            )}
            <Footer />
            <Toaster position="bottom-center" />
        </>
    );
}
