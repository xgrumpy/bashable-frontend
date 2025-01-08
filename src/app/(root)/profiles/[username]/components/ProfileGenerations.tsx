"use client";

import InfiniteDataShowcase from "@/component/shared/InfiniteDataShowcase";
import { useGetUserProfileGenerations } from "@/hooks/useUserProfile";
import { useState } from "react";
import FiltersOptions from "./FilterOptions";

interface IProfileGenerationsProps {
    username: string;
}

const ProfileGenerations = ({ username }: IProfileGenerationsProps) => {
    const [filterString, setFilterString] = useState<string>("");

    const { data, fetchNextPage, hasNextPage, isLoading, isError } =
        useGetUserProfileGenerations(username, filterString, 21);

    return (
        <div className="px-4 md:px-8">
            <FiltersOptions setFilterString={setFilterString} />
            <span className="block mb-8"></span>
            <div className="inner">
                <InfiniteDataShowcase
                    data={data}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage || false}
                    isError={isError}
                    isLoading={isLoading}
                    limit={21}
                />
            </div>
        </div>
    );
};

export default ProfileGenerations;
