"use client";

import CustomMessage from "@root/src/component/ui/CustomMessage";
import { useGetPolls } from "@root/src/hooks/admin/useDiscordPoll";
import { TPoll } from "@root/src/interfaces/adminDiscord";
import { serializeInfiniteData } from "@root/src/utils/utils";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SinglePoll from "./_components/SinglePoll";

export default function DiscordPollManagement() {
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useGetPolls({});

    return (
        <React.Fragment>
            <div className="flex justify-between gap-5 mb-10 items-center">
                <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                    Poll Management
                </h3>
                <Link href="/dashboard/discord/poll-management/create" className="btn">
                    Create New
                </Link>
            </div>
            <div className="inner">
                <InfiniteScroll
                    dataLength={serializeInfiniteData(data).length}
                    next={fetchNextPage}
                    hasMore={hasNextPage || false}
                    loader={null}
                >
                    <div className="space-y-4">
                        {!isError &&
                            data?.pages.map((group: any) =>
                                group.map((item: TPoll) => <SinglePoll key={item.id} data={item} />)
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
