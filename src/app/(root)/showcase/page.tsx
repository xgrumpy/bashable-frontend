"use client";

import Breadcrumb from "@/component/shared/Breadcrumb";
import InfiniteDataShowcase from "@/component/shared/InfiniteDataShowcase";
import { useGetShowcase } from "@/hooks/useShowcase";
import { useState } from "react";
import FiltersOptions from "./components/FilterOptions";

const ShowcasePage = () => {
    const [filterString, setFilterString] = useState<string>("");

    const { data, fetchNextPage, hasNextPage, isLoading, isError } =
        useGetShowcase(21, filterString);

    return (
        <>
            <Breadcrumb title="Showcase" />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="px-4 md:px-8">
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
                            />
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default ShowcasePage;
