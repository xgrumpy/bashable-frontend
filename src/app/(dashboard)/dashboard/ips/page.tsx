"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import FiltersOptions from "./component/FiltersOptions";
import { SyntheticEvent, useState } from "react";
import Pagination from "@/component/shared/Pagination";
import { IIpAddress } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { toast } from "react-hot-toast";

const IpsPage = () => {
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page");
    const page = pageNumber ? parseInt(pageNumber) : 1;

    const [filterString, setFilterString] = useState<string>("");

    const { data: ipAddresses } = useFetch(
        `/admin/ips?limit=20&page=${page}${filterString}`
    );

    const handleBlockIp = (e: SyntheticEvent, id: string) => {
        axiosReq
            .post(`/admin/ips/${id}/ban`)
            .then((res) => {
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <h4 className="text-2xl font-bold mb-5 text-black dark:text-white">
                            Ip Management
                        </h4>
                        <FiltersOptions setFilterString={setFilterString} />
                        <div className="overflow-x-auto mt-8">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white dark:bg-dark">
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                            Ip Address
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Generations
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Upscales
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Accounts Created
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Blocks
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ipAddresses &&
                                        Array.isArray(ipAddresses) &&
                                        ipAddresses.map((item: IIpAddress) => (
                                            <tr
                                                key={item.id}
                                                className="border-b border-borderlight dark:border-border"
                                            >
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                    {item.address}
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    {item.generations}
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    {item.upscales}
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    {item.accountsCreated}
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    {item.blocks}
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                    <button
                                                        className="btn btn-sm btn-outline"
                                                        onClick={(e) =>
                                                            handleBlockIp(
                                                                e,
                                                                item.id
                                                            )
                                                        }
                                                    >
                                                        {item.banned
                                                            ? "Unblock"
                                                            : "Block"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination
                            path="/dashboard/ips"
                            page={page}
                            limit={20}
                            length={
                                Array.isArray(ipAddresses)
                                    ? ipAddresses.length
                                    : 0
                            }
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default IpsPage;
