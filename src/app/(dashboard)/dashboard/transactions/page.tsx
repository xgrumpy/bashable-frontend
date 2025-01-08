"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import Pagination from "@/component/shared/Pagination";
import { ITransaction } from "@/interfaces/general";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FiltersOptions from "./component/FilterOptions";
import useFetch from "@/hooks/useFetch";

const Transactions = () => {
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page");
    const page = pageNumber ? parseInt(pageNumber) : 1;

    const [filterString, setFilterString] = useState<string>("");

    const { data: transactions } = useFetch(
        `/admin/transactions?limit=20&page=${page}${filterString}`
    );

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <h2 className="text-3xl font-semibold mb-5 text-black dark:text-white">
                            Transactions
                        </h2>
                        <FiltersOptions setFilterString={setFilterString} />
                        <div className="overflow-x-auto mt-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white dark:bg-dark">
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                            Date
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Provider
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Username
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Email
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Note
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                            Credits
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions &&
                                        Array.isArray(transactions) &&
                                        transactions.map(
                                            (
                                                transaction: ITransaction,
                                                key
                                            ) => (
                                                <tr
                                                    key={key}
                                                    className="border-b border-borderlight dark:border-border"
                                                >
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                        {new Date(
                                                            transaction.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {transaction.provider}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {transaction.username}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {transaction.email}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {transaction.note}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                        {transaction.credits.toFixed(
                                                            3
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            path="/dashboard/transactions"
                            page={page}
                            limit={20}
                            length={
                                Array.isArray(transactions)
                                    ? transactions.length
                                    : 0
                            }
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Transactions;
