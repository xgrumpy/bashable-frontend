import DashboardMenu from "@root/src/component/layout/DashboardMenu";
import Link from "next/link";
import React from "react";

type TDiscordManagemenuLayoutProps = { children: React.ReactNode };

export default function DiscordManagementLayout({ children }: TDiscordManagemenuLayoutProps) {
    return (
        <React.Fragment>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
                            Manage Discord
                        </h2>
                        <div className="flex gap-x-3 gap-y-2 mt-4">
                            <Link href="/dashboard/discord/illegal-words" className="btn btn-sm">
                                Illegal Words
                            </Link>
                            <Link href="/dashboard/discord/user-management" className="btn btn-sm">
                                User Management
                            </Link>
                            <Link href="/dashboard/discord/poll-management" className="btn btn-sm">
                                Poll Management
                            </Link>
                        </div>
                        <span className="block mt-8"></span>
                        {children}
                    </div>
                </section>
            </main>
        </React.Fragment>
    );
}
