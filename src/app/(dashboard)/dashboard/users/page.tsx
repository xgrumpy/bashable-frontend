"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import Pagination from "@/component/shared/Pagination";
import useFetch from "@/hooks/useFetch";
import { IUser } from "@/interfaces/general";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import FiltersOptions from "./components/FilterOptions";
import TopUserlist from "./components/TopUserlist";
import UserItem from "./components/UserItem";

const UsersList = () => {
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page");
    const page = pageNumber ? parseInt(pageNumber) : 1;

    const [filterString, setFilterString] = useState<string>("");

    const { data: usersList, refresh } = useFetch(
        `/admin/users?limit=100&page=${page}${filterString}`
    );

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <TopUserlist />
                        <span className="block mt-10"></span>
                        <h4 className="text-2xl font-bold mb-5 text-black dark:text-white">
                            Users List
                        </h4>
                        <FiltersOptions setFilterString={setFilterString} />
                        <div className="mt-8 flex-col space-y-2">
                            {usersList &&
                                Array.isArray(usersList) &&
                                usersList.map((user: IUser) => (
                                    <UserItem key={user.id} user={user} refresh={refresh} />
                                ))}
                        </div>
                        <Pagination
                            path="/dashboard/users"
                            page={page}
                            limit={100}
                            length={Array.isArray(usersList) ? usersList.length : 0}
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default UsersList;
