"use client";

import CustomMessage from "@root/src/component/ui/CustomMessage";
import { useGetChats } from "@root/src/hooks/admin/useChat";
import { TAdminChat } from "@root/src/interfaces/chat";
import { serializeInfiniteData } from "@root/src/utils/utils";
import { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import ChatItem from "./ChatItem";
import FiltersOptions from "./FilterOptions";

const ChatsView = () => {
    const [filterString, setFilterString] = useState("");
    const { data, isLoading, isError, hasNextPage, fetchNextPage } = useGetChats({
        filterString,
    });

    return (
        <div className="chats">
            <FiltersOptions setFilterString={setFilterString} />
            <div className="chatitems mt-8 space-y-2">
                <InfiniteScroll
                    dataLength={serializeInfiniteData(data).length}
                    next={fetchNextPage}
                    hasMore={hasNextPage || false}
                    loader={null}
                >
                    <div className="space-y-4">
                        {!isError &&
                            data?.pages.map((group: any) =>
                                group.map((item: TAdminChat) => (
                                    <ChatItem key={item.id} chatData={item} />
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
        </div>
    );
};

export default ChatsView;
