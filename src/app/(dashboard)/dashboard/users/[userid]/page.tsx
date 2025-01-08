"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import ConfirmationModal from "@/component/shared/ConfirmationModal";
import PopupImageAdmin from "@/component/shared/PopupImageAdmin";
import { IGeneration, ITransaction, IUser } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const UserDetails = ({ params }: any) => {
    const { userid } = params;
    const [isModerator, setIsModerator] = useState<boolean>(false);
    const [isModeratorPopupOpen, setIsModeratorPopupOpen] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [userTransactions, setUserTransactions] = useState<ITransaction[]>([]);
    const [userGenerations, setUserGenerations] = useState<IGeneration[]>([]);
    const [currentPageGeneration, setCurrentPageGeneration] = useState(1);
    const [currentPageTransaction, setCurrentPageTransaction] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userRes = await axiosReq.get(`/admin/users/${userid}`);
                setUser(userRes.data);
                setIsModerator(userRes.data.role === "mod");
                const transactionRes = await axiosReq.get(
                    `/admin/users/${userRes.data.email}/transactions?limit=20&page=${currentPageTransaction}`
                );
                setUserTransactions(transactionRes.data);
                const generationsRes = await axiosReq.get(
                    `/admin/users/${userRes.data.email}/generations?limit=20&page=${currentPageGeneration}`
                );
                setUserGenerations(generationsRes.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [userid, currentPageGeneration, currentPageTransaction]);

    const handleModerator = () => {
        axiosReq
            .post(`/admin/users/${user?.id}/mod`)
            .then((res) => {
                toast.success(res.data.message);
                setIsModerator(!isModerator);
                setIsModeratorPopupOpen(false);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <ConfirmationModal
                state={isModeratorPopupOpen}
                closeHandler={() => setIsModeratorPopupOpen(false)}
                acceptHandler={handleModerator}
                declineHandler={() => setIsModeratorPopupOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to make him {isModerator ? "normal user" : "moderator"}?
                </h5>
            </ConfirmationModal>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <div className="userinfo">
                            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-black dark:text-white">
                                <Link
                                    href={`/dashboard/generations?user=${user?.email}`}
                                    className="hover:text-primary"
                                >
                                    {user?.username}
                                </Link>
                            </h2>
                            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-bodylight dark:text-body">
                                {user?.email}
                            </h2>
                            <div className="flex flex-wrap gap-y-3 gap-x-10">
                                <h2 className="text-xl text-bodylight dark:text-body">
                                    Credits:{" "}
                                    <span className="font-medium text-black dark:text-white">
                                        {user?.credits.toFixed(3)}
                                    </span>
                                </h2>
                                <h2 className="text-xl text-bodylight dark:text-body">
                                    Total Purchased Credits:{" "}
                                    <span className="font-medium text-black dark:text-white">
                                        {user?.totalCreditsPurchased.toFixed(3)}
                                    </span>
                                </h2>
                                <h2 className="text-xl text-bodylight dark:text-body">
                                    Generations:{" "}
                                    <span className="font-medium text-black dark:text-white">
                                        {user?.generations}
                                    </span>
                                </h2>
                                <h2 className="text-xl text-bodylight dark:text-body">
                                    Transactions:{" "}
                                    <span className="font-medium text-black dark:text-white">
                                        {user?.transactions}
                                    </span>
                                </h2>
                                <h2 className="text-xl text-bodylight dark:text-body">
                                    Blocked Generations:{" "}
                                    <span className="font-medium text-black dark:text-white">
                                        {user?.blocks}
                                    </span>
                                </h2>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-8">
                                <Link
                                    href={`/dashboard/generations?user=${user?.email}`}
                                    className="btn btn-outline"
                                >
                                    See Generations
                                </Link>
                                <Link
                                    href={`/dashboard/transactions?user=${user?.email}`}
                                    className="btn btn-outline"
                                >
                                    See Transactions
                                </Link>
                                <button
                                    className="btn !border-yellow-500 !text-yellow-500 btn-outline"
                                    onClick={() => setIsModeratorPopupOpen(true)}
                                >
                                    {isModerator ? "Make User" : "Make Moderator"}
                                </button>
                            </div>
                        </div>
                        <div className="mt-10">
                            <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
                                Transactions
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white dark:bg-dark">
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                                Date
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
                                        {userTransactions &&
                                            Array.isArray(userTransactions) &&
                                            userTransactions.map(
                                                (transaction: ITransaction, key) => (
                                                    <tr
                                                        key={key}
                                                        className="border-b border-borderlight dark:border-border"
                                                    >
                                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                            {new Date(
                                                                transaction.createdAt
                                                            ).toLocaleString()}
                                                        </td>
                                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                            {transaction.email}
                                                        </td>
                                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                            {transaction.note}
                                                        </td>
                                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                            {transaction.credits.toFixed(3)}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-10 gap-x-4 gap-y-2">
                                {currentPageTransaction > 1 && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={() =>
                                            setCurrentPageTransaction((prev) => prev - 1)
                                        }
                                    >
                                        Prev
                                    </button>
                                )}
                                {Array.isArray(userTransactions) &&
                                    userTransactions.length === 20 && (
                                        <button
                                            className="btn btn-sm"
                                            onClick={() =>
                                                setCurrentPageTransaction((prev) => prev + 1)
                                            }
                                        >
                                            Next
                                        </button>
                                    )}
                            </div>
                        </div>
                        <div className="mt-14">
                            <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
                                Generations
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-white dark:bg-dark">
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                                Date
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Prompt
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Negative Prompt
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Likes
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Downloads
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Regenerations
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                                Status
                                            </th>
                                            <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                                Image
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userGenerations &&
                                            Array.isArray(userGenerations) &&
                                            userGenerations.map((generation: IGeneration, key) => (
                                                <tr
                                                    key={key}
                                                    className="border-b border-borderlight dark:border-border"
                                                >
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                        {new Date(
                                                            generation.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.prompt}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.negative_prompt || "N/A"}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.likes}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.downloads}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.regenerations}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                        {generation.private ? "Private" : "Public"}
                                                    </td>
                                                    <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                        <div className="image relative overflow-hidden inline-block h-20 w-20 border border-border rounded-md">
                                                            <PopupImageAdmin
                                                                imageData={generation}
                                                                square
                                                                hideOptions
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-center mt-10 gap-x-4 gap-y-2">
                                {currentPageGeneration > 1 && (
                                    <button
                                        className="btn btn-sm"
                                        onClick={() => setCurrentPageGeneration((prev) => prev - 1)}
                                    >
                                        Prev
                                    </button>
                                )}
                                {Array.isArray(userGenerations) &&
                                    userGenerations.length === 20 && (
                                        <button
                                            className="btn btn-sm"
                                            onClick={() =>
                                                setCurrentPageGeneration((prev) => prev + 1)
                                            }
                                        >
                                            Next
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default UserDetails;
