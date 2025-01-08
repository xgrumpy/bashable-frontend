"use client";

import { useAuthContext } from "@/context/authContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { SkeletonTheme } from "react-loading-skeleton";
import { RecoilRoot } from "recoil";
import Modal from "../shared/Modal";
import SseRoot from "./SseRoot";

interface IClientRootProps {
    children: ReactNode;
}

const queryClient = new QueryClient();

const ClientRoot = ({ children }: IClientRootProps) => {
    const [bannedUserPopupOpen, setBannedUserPopupOpen] = useState<boolean>(false);

    const { banned } = useAuthContext();

    const pathname = usePathname();

    useEffect(() => {
        if (banned) {
            setBannedUserPopupOpen(true);
        }
    }, [pathname, banned]);

    return (
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={false} />
                <Modal
                    state={bannedUserPopupOpen}
                    closeHandler={() => setBannedUserPopupOpen(false)}
                >
                    <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                        <div className="text-center">
                            <h5 className="text-lg text-center font-bold text-black dark:text-white mb-2">
                                This account has been suspended.{" "}
                                <Link
                                    href="/blogs/how-do-i-contact-support"
                                    className="underline hover:text-primary"
                                >
                                    Please contact support
                                </Link>
                            </h5>
                            <button
                                className="btn mt-5"
                                onClick={() => setBannedUserPopupOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </Modal>
                <SkeletonTheme baseColor="#282a41" highlightColor="#515582">
                    <SseRoot>{children}</SseRoot>
                </SkeletonTheme>
            </QueryClientProvider>
        </RecoilRoot>
    );
};

export default ClientRoot;
