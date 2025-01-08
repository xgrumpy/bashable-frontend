"use client";

import InfiniteDataShowcaseAdmin from "@root/src/component/shared/InfiniteDataShowcaseAdmin";
import { useGetUserGeneration } from "@root/src/hooks/admin/useGeneration";
import Link from "next/link";
import React from "react";

type TProfileGenerationProps = { username: string };

const ProfileGeneration = ({ username }: TProfileGenerationProps) => {
    const { data, fetchNextPage, hasNextPage, isLoading, isError } = useGetUserGeneration({
        username: username,
    });

    return (
        <React.Fragment>
            <h5 className="text-black dark:text-white font-semibold text-lg mb-5 text-center">
                Generations of{" "}
                <Link
                    target="_blank"
                    className="text-secondary"
                    href={`/dashboard/generations?user=${username}`}
                >
                    {username}
                </Link>
            </h5>
            <InfiniteDataShowcaseAdmin
                data={data}
                fetchNextPage={fetchNextPage}
                hasNextPage={hasNextPage || false}
                isLoading={isLoading}
                isError={isError}
            />
        </React.Fragment>
    );
};

export default ProfileGeneration;
