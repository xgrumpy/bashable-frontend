"use client";

import { useAuthContext } from "@/context/authContext";
import CustomMessage from "@root/src/component/ui/CustomMessage";
import Image from "next/image";
import React, { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
    const { username } = useAuthContext();

    return (
        <React.Fragment>
            <div className="pt-[80px]"></div>
            <main className="content relative">
                <div className="heroimage select-none overflow-hidden absolute left-0 top-0 h-full w-full">
                    <div className="overlay absolute left-0 top-0 h-full w-full bg-white dark:bg-dark opacity-80 dark:opacity-90 z-10"></div>
                    <Image
                        src="/images/hero-images.webp"
                        alt="Bashable.art"
                        fill
                        className="object-center object-cover min-h-full min-w-full opacity-50"
                    />
                </div>
                <div className="chat-wrapper relative z-30 min-h-screen">
                    {username ? (
                        children
                    ) : (
                        <div className="flex justify-center items-center min-h-screen w-full">
                            <CustomMessage msg="You are not logged in. Please login to see this page." />
                        </div>
                    )}
                </div>
            </main>
        </React.Fragment>
    );
};

export default Layout;
