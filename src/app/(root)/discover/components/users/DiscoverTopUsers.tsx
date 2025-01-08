"use client";

import TopUserLoader from "@/component/loaders/TopUserLoader";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetTopUsers } from "@/hooks/useDiscover";
import React, { useState } from "react";
import FilterOptions from "./FilterOptions";
import UserItem from "./UserItem";

const DiscoverTopUsers = () => {
    const [isViewMore, setIsViewMore] = useState<boolean>(false);
    const [filterString, setFilterString] = useState<string>("");

    const { data, isLoading, isError, refetch } = useGetTopUsers(filterString, isViewMore);

    return (
        <div className="top-users space-y-2">
            <FilterOptions setFilterString={setFilterString} />
            <React.Fragment>
                {isError && <CustomMessage msg="Something is wrong" />}
                {!data && !isError && isLoading && (
                    <React.Fragment>
                        <TopUserLoader />
                        <TopUserLoader />
                        <TopUserLoader />
                        <TopUserLoader />
                        <TopUserLoader />
                    </React.Fragment>
                )}
                {!isError &&
                    !isLoading &&
                    data.map((user: any) => (
                        <UserItem key={user.id} user={user} refresh={refetch} />
                    ))}
                {!isError && !isLoading && (
                    <div className="text-center">
                        <button className="btn mt-7" onClick={() => setIsViewMore((prev) => !prev)}>
                            {isViewMore ? "View Less" : "View More"}
                        </button>
                    </div>
                )}
            </React.Fragment>
        </div>
    );
};

export default DiscoverTopUsers;
