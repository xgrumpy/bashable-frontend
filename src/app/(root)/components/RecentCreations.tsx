"use client";

import PopupImage from "@/component/shared/PopupImage";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetRecentCreations } from "@/hooks/useRecentCreations";
import { memo, useState } from "react";
import Skeleton from "react-loading-skeleton";

const RecentCreations = ({ limit = 25 }: { limit?: number }) => {
    const [isPaused, setIsPaused] = useState<boolean>(false);

    const {
        data: recentCreations,
        isLoading,
        isError,
        refetch,
    } = useGetRecentCreations(isPaused);

    const modalStateReceiver = (state: boolean) => {
        setIsPaused(state);
    };

    return (
        <div className="recentcreation">
            {isError ? (
                <CustomMessage msg="Something is wrong!" />
            ) : isLoading && !recentCreations ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {new Array(25).fill(0).map((_, index) => (
                        <Skeleton key={index} className="aspect-square" />
                    ))}
                </div>
            ) : !isLoading && !isError && !recentCreations.length ? (
                <CustomMessage msg="No items to show!" />
            ) : !isLoading && !isError && recentCreations.length ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {recentCreations.slice(0, limit).map((item) => (
                        <div key={item.id}>
                            <PopupImage
                                imageData={item}
                                refresh={refetch}
                                removeDelete
                                square
                                modalStatePasser={modalStateReceiver}
                            />
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default memo(RecentCreations);
