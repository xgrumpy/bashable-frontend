"use client";

import UserLoader from "@/component/loaders/UserLoader";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetProfileFollowers } from "@/hooks/useMyProfile";
import React from "react";
import UserItem from "../../search/user/components/UserItem";

const UserFollowersPage = () => {
    const { data, isLoading, isError, refetch } = useGetProfileFollowers();

    return (
        <div className="max-w-7xl mx-auto generations mt-10">
            <h4 className="text-2xl font-semibold text-black dark:text-white mb-5">
                My Followers
            </h4>
            <div className="flex flex-wrap mt-8 space-y-2">
                {isError ? (
                    <CustomMessage msg="Something is wrong!" />
                ) : isLoading ? (
                    <React.Fragment>
                        <UserLoader />
                        <UserLoader />
                        <UserLoader />
                    </React.Fragment>
                ) : data && !data.length ? (
                    <CustomMessage msg="No items to show!" />
                ) : data && data.length ? (
                    data.map((user) => (
                        <UserItem
                            key={user.username}
                            data={user}
                            refresh={refetch}
                            showFollowed
                        />
                    ))
                ) : null}
            </div>
        </div>
    );
};

export default UserFollowersPage;