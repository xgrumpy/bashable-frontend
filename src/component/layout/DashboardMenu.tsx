"use client";

import { useAuthContext } from "@/context/authContext";
import Link from "next/link";

const DashboardMenu = () => {
    const { role } = useAuthContext();

    return (
        <ul className="flex flex-wrap gap-x-4 gap-y-2 mb-10">
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/users?page=1">
                        Users
                    </Link>
                </li>
            )}
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/transactions?page=1">
                        Transactions
                    </Link>
                </li>
            )}
            <li>
                <Link className="btn" href="/dashboard/generations">
                    Generations
                </Link>
            </li>
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/articles?page=1">
                        Articles
                    </Link>
                </li>
            )}
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/faqs">
                        Faqs
                    </Link>
                </li>
            )}
            <li>
                <Link className="btn" href="/dashboard/illegal-words">
                    Illegal Words
                </Link>
            </li>
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/ips?page=1">
                        Ips
                    </Link>
                </li>
            )}
            {role === "admin" && (
                <li>
                    <Link className="btn" href="/dashboard/blocked-domains">
                        Blocked Domains
                    </Link>
                </li>
            )}
            <li>
                <Link className="btn" href="/dashboard/tips?page=1">
                    Tips
                </Link>
            </li>
            <li>
                <Link className="btn" href="/dashboard/chats">
                    Chat Sessions
                </Link>
            </li>
            <li>
                <Link className="btn" href="/dashboard/discord/illegal-words">
                    Manage Discord
                </Link>
            </li>
        </ul>
    );
};

export default DashboardMenu;
