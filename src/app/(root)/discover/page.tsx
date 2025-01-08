"use client";

import Breadcrumb from "@/component/shared/Breadcrumb";
import Modal from "@/component/shared/Modal";
import { useAppContext } from "@/context/appContext";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import DiscoverGenerations from "./components/generation/DiscoverGenerations";
import DiscoverTopUsers from "./components/users/DiscoverTopUsers";

const Discover = () => {
    const searchParams = useSearchParams();
    const isRedirect = searchParams.get("redirect");
    const [isRedirectModalOpen, setIsRedirectModalOpen] =
        useState<boolean>(false);
    const { changeAuthBoxStatus } = useAppContext();

    useEffect(() => {
        if (isRedirect) {
            setIsRedirectModalOpen(true);
        }
    }, [isRedirect]);

    return (
        <React.Fragment>
            <Modal
                state={isRedirectModalOpen}
                closeHandler={() => setIsRedirectModalOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 rounded-2xl w-full">
                    <div className="text-center">
                        <h6 className="text-lg text-semibold">
                            Please create an account to build your own profile
                            page.
                        </h6>
                        <br />
                        <button
                            className="btn"
                            onClick={() => changeAuthBoxStatus("signup")}
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
            <Breadcrumb title="Discover" />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="px-4 md:px-8">
                        <h3 className="font-semibold text-3xl text-black dark:text-white mb-4">
                            Top Users
                        </h3>
                        <DiscoverTopUsers />
                    </div>
                    <span className="block mt-20"></span>
                    <div className="px-4 md:px-8">
                        <h3 className="font-semibold text-3xl text-black dark:text-white mb-4">
                            Generations
                        </h3>
                        <DiscoverGenerations />
                    </div>
                </section>
            </main>
        </React.Fragment>
    );
};

export default Discover;
