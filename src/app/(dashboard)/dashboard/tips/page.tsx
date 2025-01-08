"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import React, { useEffect, useState } from "react";
import FiltersOptions from "./component/FiltersOptions";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import Pagination from "@/component/shared/Pagination";
import axiosReq from "@/utils/axios";
import TipItem from "./component/TipItem";

type TUser = {
    avatar: string | null;
    id: string;
    username: string;
};

type TTip = {
    id: string;
    sender: TUser;
    receiver: TUser;
    amount: number;
    createdAt: string;
};

const TipsPage = () => {
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page");
    const page = pageNumber ? parseInt(pageNumber) : 1;

    const [filterString, setFilterString] = useState<string>("");
    const [tips, setTips] = useState<TTip[]>([]);

    useEffect(() => {
        axiosReq
            .get(`/admin/tips?limit=10&page=${page}${filterString}`)
            .then((res) => {
                setTips(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [page, filterString]);

    return (
        <React.Fragment>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <h4 className="text-2xl font-bold mb-5 text-black dark:text-white">
                            Tips
                        </h4>
                        <FiltersOptions setFilterString={setFilterString} />
                        <div className="flex flex-wrap mt-8 space-y-2">
                            {tips &&
                                Array.isArray(tips) &&
                                tips.map((item) => (
                                    <TipItem
                                        key={item.id}
                                        createdAt={item.createdAt}
                                        senderUsername={item.sender?.username}
                                        senderAvatar={item.sender?.avatar}
                                        receiverUsername={
                                            item.receiver?.username
                                        }
                                        receiverAvatar={item.receiver?.avatar}
                                        amount={item.amount}
                                    />
                                ))}
                        </div>
                        <Pagination
                            path="/dashboard/tips"
                            page={page}
                            limit={10}
                            length={tips?.length}
                        />
                    </div>
                </section>
            </main>
        </React.Fragment>
    );
};

export default TipsPage;
