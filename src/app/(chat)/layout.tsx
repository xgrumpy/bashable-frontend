"use client";

import Header from "@/component/layout/Header";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { useNotificationContext } from "@/context/notificationContext";
import { stateLastGeneration } from "@/state/LastGenerationState";
import axiosReq from "@/utils/axios";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { useSetRecoilState } from "recoil";

export default function RootLayout({ children }: { children: ReactNode }) {
    const [notificationOpen, setNotificationOpen] = useState<boolean>(true);

    const { username, mobileVerified, purchasedCredits, login } = useAuthContext();
    const { initTheme, changeMobileVerifyBoxStatus } = useAppContext();
    const { initNotifications } = useNotificationContext();

    const setLastGenerationProps = useSetRecoilState(stateLastGeneration);

    useEffect(() => {
        initTheme();
        const lastGenerationProps =
            localStorage.getItem("last-generation-state") || JSON.stringify("");
        setLastGenerationProps(JSON.parse(lastGenerationProps));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axiosReq
            .get("/users/login/check")
            .then((res: any) => {
                login(res.data);
            })
            .catch((err) => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (username) {
            axiosReq
                .get("/users/notifications")
                .then((res: any) => {
                    initNotifications(res.data);
                })
                .catch((err: any) => {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    const handlePhoneVerify = (e: SyntheticEvent) => {
        e.preventDefault();
        changeMobileVerifyBoxStatus(true);
    };

    return (
        <>
            <Header />
            <div className="min-h-screen">{children}</div>
            <Toaster position="bottom-center" />
            {/* {username &&
                !mobileVerified &&
                !purchasedCredits &&
                notificationOpen && (
                    <div className="fixed left-0 top-auto bottom-0 w-full bg-yellow-400 text-black py-1 text-center cursor-pointer z-30">
                        <p onClick={handlePhoneVerify}>
                            To get additional 4 credits bonus, verify your
                            account with a phone number.{" "}
                            <strong>Click here to verify now.</strong>
                        </p>
                        <button
                            className="absolute left-auto right-1 top-1.5 text-xl"
                            onClick={() => setNotificationOpen(false)}
                        >
                            <HiXMark />
                        </button>
                    </div>
                )} */}
        </>
    );
}
