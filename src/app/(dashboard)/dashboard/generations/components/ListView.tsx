"use client";

import PopupImageAdmin from "@/component/shared/PopupImageAdmin";
import { useAuthContext } from "@/context/authContext";
import { IGeneration } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { debounce } from "@/utils/utils";
import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";

interface ListViewProps {
    url: string;
}

const ListView = ({ url }: ListViewProps) => {
    const [data, setData] = useState<IGeneration[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const { role } = useAuthContext();

    const page = useRef<number>(1);
    const noMoreData = useRef(false);
    const fetchUrl = useRef<string>(url);

    const fetchData = debounce(async () => {
        setLoading(true);
        const response = await axiosReq.get(
            `${fetchUrl.current}page=${page.current}`
        );
        const newData: IGeneration[] = await response.data;
        if (newData.length === 0) {
            noMoreData.current = true;
            setLoading(false);
            return;
        }
        setData((prev: any) => [...prev, ...newData]);
        page.current += 1;
        setLoading(false);
    }, 200);

    useEffect(() => {
        fetchUrl.current = url;
        page.current = 1;
        noMoreData.current = false;
        setData([]);
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

    const handleScroll = () => {
        if (!noMoreData.current) {
            if (
                window.innerHeight + document.documentElement.scrollTop ===
                document.documentElement.offsetHeight
            ) {
                fetchData();
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshOnDelete = (id: string) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const refreshOnBlocked = (ids: string[]) => {
        const tempData = data.map((item) => {
            if (ids.includes(item.id)) {
                item.blocked = true;
            }
            return item;
        });
        setData(tempData);
    };

    const handleShowcaseChange = (
        e: ChangeEvent<HTMLInputElement>,
        id: string
    ) => {
        e.preventDefault();
        axiosReq
            .post(`/admin/generations/${id}/showcase`)
            .then((res) => {
                toast.success(res.data.message);
                setData((prev) =>
                    prev.map((item) => {
                        if (item.id === id) {
                            item.showcase = !item.showcase;
                        }
                        return item;
                    })
                );
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <div>
            <div className="generation-items">
                {data &&
                    Array.isArray(data) &&
                    data.map((generation) => (
                        <div
                            key={generation.id}
                            className="mt-2 first:mt-0 border border-borderlight dark:border-border p-2 gap-x-4 gap-y-4 rounded-md flex items-center justify-between flex-wrap 2xl:flex-nowrap"
                        >
                            <div className="image overflow-hidden inline-block h-20 w-20 grow-0 shrink-0 basis-20 max-w-[80px] border border-borderlight dark:border-border rounded-md">
                                <PopupImageAdmin
                                    imageData={generation}
                                    square
                                    hideOptions
                                    deleteIdPasser={refreshOnDelete}
                                    flaggedIdsPasser={refreshOnBlocked}
                                />
                            </div>
                            <div className="prompts text-left flex-grow w-full lg:max-w-xl">
                                <strong className="text-black dark:text-white">
                                    Prompt:{" "}
                                </strong>
                                <h5 className="font-semibold text-lg max-h-[350px] overflow-y-auto">
                                    {generation.prompt}
                                </h5>
                            </div>
                            <div className="prompts text-left flex-grow w-full lg:max-w-xl">
                                <strong className="text-black dark:text-white">
                                    Negative Prompt:{" "}
                                </strong>
                                <p className="max-h-[350px] overflow-y-auto">
                                    {generation.negative_prompt || "N/A"}
                                </p>
                            </div>
                            <ul className="lg:min-w-[200px]">
                                <li>
                                    <strong className="text-black dark:text-white">
                                        Likes:{" "}
                                    </strong>
                                    {generation.likes}
                                </li>
                                <li>
                                    <strong className="text-black dark:text-white">
                                        Downloads:{" "}
                                    </strong>
                                    {generation.downloads}
                                </li>
                                <li>
                                    <strong className="text-black dark:text-white">
                                        Regenerations:{" "}
                                    </strong>
                                    {generation.regenerations}
                                </li>
                                {typeof generation.views !== "undefined" && (
                                    <li>
                                        <strong className="text-black dark:text-white">
                                            Views:{" "}
                                        </strong>
                                        {generation.views}
                                    </li>
                                )}
                            </ul>
                            <ul className="lg:min-w-[200px]">
                                <li>
                                    <strong className="text-black dark:text-white">
                                        User:{" "}
                                    </strong>
                                    {generation.username === "free" ? (
                                        <span className="text-black dark:text-white">
                                            {generation.username}{" "}
                                        </span>
                                    ) : (
                                        <>
                                            <Link
                                                href={`/profiles/${encodeURIComponent(
                                                    generation.username as string
                                                )}`}
                                                className="text-black dark:text-white hover:!text-primary font-semibold underline"
                                            >
                                                {generation.username}
                                            </Link>
                                            {role === "admin" &&
                                                generation.email &&
                                                generation.username !==
                                                    "free" && (
                                                    <span className="text-sm block">
                                                        ({generation.email})
                                                    </span>
                                                )}
                                        </>
                                    )}
                                </li>
                                <li>
                                    <strong className="text-black dark:text-white">
                                        Created At:{" "}
                                    </strong>
                                    {new Date(
                                        generation.createdAt
                                    ).toLocaleDateString()}
                                </li>
                                <li>
                                    <strong className="text-black dark:text-white">
                                        Restricted:{" "}
                                    </strong>
                                    {generation.restricted ? "YES" : "NO"}
                                </li>
                            </ul>
                            <div className="lg:min-w-[150px]">
                                <p>
                                    <strong className="text-black dark:text-white">
                                        Public:{" "}
                                    </strong>
                                    {generation.private ? "NO" : "YES"}
                                </p>
                                {!generation.private && (
                                    <div className="flex items-center mt-3">
                                        <div className="switchbox">
                                            <input
                                                type="checkbox"
                                                name={`showcase-${generation.id}`}
                                                id={`showcase-${generation.id}`}
                                                checked={!!generation.showcase}
                                                onChange={(e) =>
                                                    handleShowcaseChange(
                                                        e,
                                                        generation.id
                                                    )
                                                }
                                            />
                                            <label
                                                htmlFor={`showcase-${generation.id}`}
                                            ></label>
                                        </div>
                                        <label
                                            htmlFor={`showcase-${generation.id}`}
                                        >
                                            Showcase
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
            {data.length <= 0 ? (
                <p className="text-black text-center dark:text-white font-semibold">
                    There is no items to show
                </p>
            ) : (
                <>
                    {noMoreData.current && (
                        <p className="text-center mt-6 text-black dark:text-white font-semibold">
                            You have reached the end
                        </p>
                    )}
                    {loading && (
                        <div className="text-center mt-6">
                            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-2 border-borderlight dark:border-border"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ListView;
