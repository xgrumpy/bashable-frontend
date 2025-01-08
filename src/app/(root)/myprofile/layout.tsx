"use client";

import { useAuthContext } from "@/context/authContext";
import { ReactNode } from "react";
import UserPrimaryDetails from "./components/UserPrimaryDetails";

const ProfileLayout = ({ children }: { children: ReactNode }) => {
    const { username } = useAuthContext();

    if (!username)
        return (
            <div className="flex justify-center items-center min-h-screen w-full">
                <h5 className="font-medium text-black dark:text-white text-xl">
                    You are not logged in!
                </h5>
            </div>
        );

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <UserPrimaryDetails />
                    </div>
                    {children}
                </section>
            </main>
        </>
    );
};

export default ProfileLayout;
