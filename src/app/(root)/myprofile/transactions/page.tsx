"use client";

import CustomMessage from "@/component/ui/CustomMessage";
import { useGetProfileTransactions } from "@/hooks/useMyProfile";
import React from "react";
import Skeleton from "react-loading-skeleton";

const UserTransactionsPage = () => {
    const { data, isLoading, isError } = useGetProfileTransactions();

    return (
        <div className="max-w-7xl mx-auto generations mt-10">
            <h4 className="text-2xl font-semibold text-black dark:text-white mb-5">
                Transactions
            </h4>
            <div className="flex flex-wrap mt-8 space-y-2">
                <div className="overflow-x-auto w-full">
                    {isError ? (
                        <CustomMessage msg="Something is wrong!" />
                    ) : data && !data.length ? (
                        <CustomMessage msg="No items to show!" />
                    ) : (data && data.length) || isLoading ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white dark:bg-dark">
                                    <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                        Date
                                    </th>
                                    <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                        Note
                                    </th>
                                    <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                        Credits
                                    </th>
                                    <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <React.Fragment>
                                        {new Array(5)
                                            .fill(0)
                                            .map((_, index) => (
                                                <tr
                                                    key={index}
                                                    className="border-b border-borderlight dark:border-border"
                                                >
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                        <Skeleton width={180} />
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        <Skeleton width={270} />
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                        <Skeleton width={150} />
                                                    </td>
                                                </tr>
                                            ))}
                                    </React.Fragment>
                                ) : (
                                    data.map((transaction: any) => (
                                        <tr
                                            key={transaction.id}
                                            className="border-b border-borderlight dark:border-border"
                                        >
                                            <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                {new Date(
                                                    transaction.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                {transaction.provider ===
                                                "referral"
                                                    ? "Referral Bonus"
                                                    : null}
                                                {transaction.provider ===
                                                "local"
                                                    ? transaction.credits < 0
                                                        ? "Deducted By Admin"
                                                        : "Added By Admin"
                                                    : null}
                                                {transaction.provider ===
                                                "stripe"
                                                    ? "Bought Credits by Card"
                                                    : null}
                                                {transaction.provider ===
                                                "coinbase"
                                                    ? "Bought Credits by Crypto"
                                                    : null}
                                                {transaction.provider === "tip"
                                                    ? transaction.credits < 0
                                                        ? "Given Tip"
                                                        : "Received Tip"
                                                    : null}
                                            </td>
                                            <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                {transaction.credits.toFixed(3)}
                                            </td>
                                            <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                {transaction.status}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default UserTransactionsPage;
