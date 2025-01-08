"use client";

import Breadcrumb from "@/component/shared/Breadcrumb";
import { IProfileMinimal } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { debounce } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import UserItem from "./components/UserItem";

const UserSearch = () => {
    const searchParams = useSearchParams();
    const usernameFromUrl = searchParams.get("username") || "";
    const [searchText, setSearchText] = useState<string>(usernameFromUrl);
    const [searchResult, setSearchResult] = useState<IProfileMinimal[]>([]);
    const [refreshCount, setRefreshCount] = useState<number>(1);

    const inputUserRef = useRef<HTMLInputElement>(null);

    const refresh = () => {
        setRefreshCount((prev) => prev + 1);
    };

    useEffect(() => {
        if (inputUserRef.current) {
            // @ts-ignore
            inputUserRef.current.value = usernameFromUrl;
        }
    }, [usernameFromUrl]);

    useEffect(() => {
        if (searchText) {
            axiosReq
                .get(`/users?username=${encodeURIComponent(searchText)}`)
                .then((res) => {
                    setSearchResult(res.data);
                })
                .catch((err) => {
                    toastError(err);
                });
        }
    }, [searchText, refreshCount]);

    const handleSearchTextChagne = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const debouncedSearchTextChange = debounce(handleSearchTextChagne, 500);

    return (
        <>
            <Breadcrumb title="Search User" />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="inputbox">
                            <label htmlFor="" className="font-semibold">
                                Search by username
                            </label>
                            <input
                                ref={inputUserRef}
                                type="text"
                                onChange={debouncedSearchTextChange}
                                placeholder="Search username here..."
                                className="w-full"
                            />
                        </div>
                        <div className="flex flex-wrap mt-8 space-y-2">
                            {searchResult.map((user: IProfileMinimal) => (
                                <UserItem
                                    key={user.username}
                                    data={user}
                                    refresh={refresh}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default UserSearch;
