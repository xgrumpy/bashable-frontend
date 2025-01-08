"use client";

import InfiniteDataShowcase from "@/component/shared/InfiniteDataShowcase";
import { useGetProfileGenerations } from "@/hooks/useMyProfile";
import React, { useState } from "react";
import FiltersOptions from "./components/FilterOptions";

const MyGenerations = () => {
    const [filterString, setFilterString] = useState<string>("");

    const { data, fetchNextPage, hasNextPage, isLoading, isError } = useGetProfileGenerations(
        21,
        filterString
    );

    return (
        <React.Fragment>
            <div className="max-w-7xl mx-auto generations mt-10">
                <h4 className="text-2xl font-semibold text-black dark:text-white mb-5">
                    My Generations
                </h4>
            </div>
            <div className="px-4 md:px-8 mt-8">
                <div className="options mb-10">
                    <FiltersOptions setFilterString={setFilterString} />
                </div>
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
        </React.Fragment>
    );
};

export default MyGenerations;
