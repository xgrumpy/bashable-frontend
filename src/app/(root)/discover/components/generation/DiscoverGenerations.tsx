"use client";

import InfiniteDataShowcase from "@/component/shared/InfiniteDataShowcase";
import { useGetDiscoverItems } from "@/hooks/useDiscover";
import React, { useState } from "react";
import FiltersOptions from "./FilterOptions";

const DiscoverGenerations = () => {
    const [filterString, setFilterString] = useState<string>("");

    const { data, fetchNextPage, hasNextPage, isLoading, isError } = useGetDiscoverItems(
        21,
        filterString
    );

    return (
        <React.Fragment>
            <div className="options mb-10">
                <FiltersOptions setFilterString={setFilterString} />
            </div>
            <div className="inner">
                <InfiniteDataShowcase
                    data={data}
                    fetchNextPage={fetchNextPage}
                    hasNextPage={hasNextPage || false}
                    isLoading={isLoading}
                    isError={isError}
                    removeDelete
                    showcaseVisible
                />
            </div>
        </React.Fragment>
    );
};

export default DiscoverGenerations;
