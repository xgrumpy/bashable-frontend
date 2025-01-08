"use client";

import CustomMessage from "@root/src/component/ui/CustomMessage";
import { useGetConvictedUsers } from "@root/src/hooks/admin/useDiscordUser";
import { TConvictedUser } from "@root/src/interfaces/adminDiscord";
import { serializeInfiniteData } from "@root/src/utils/utils";
import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import FiltersOptions from "./_components/FilterOptions";
import UserItem from "./_components/UserItem";

export default function DiscordUserManagementPage() {
    const [filterString, setFilterString] = useState("");

    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useGetConvictedUsers({
        filterString,
    });

    return (
        <React.Fragment>
            <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                User Management
            </h3>
            <FiltersOptions setFilterString={setFilterString} />
            <div className="inner mt-8">
                <InfiniteScroll
                    dataLength={serializeInfiniteData(data).length}
                    next={fetchNextPage}
                    hasMore={hasNextPage || false}
                    loader={null}
                >
                    <div className="space-y-4">
                        {!isError &&
                            data?.pages.map((group: any) =>
                                group.map((item: TConvictedUser) => (
                                    <UserItem key={item.id} data={item} />
                                ))
                            )}
                        {isError && <CustomMessage msg="Something is wrong!" />}
                        {!isLoading && !isError && !hasNextPage ? (
                            serializeInfiniteData(data).length ? (
                                <CustomMessage msg="You reached the end!" />
                            ) : (
                                <CustomMessage msg="There is no items to show!" />
                            )
                        ) : null}
                    </div>
                </InfiniteScroll>
            </div>
        </React.Fragment>
    );
}
