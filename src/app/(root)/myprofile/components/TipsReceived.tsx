"use client";

import TipLoaders from "@/component/loaders/TipLoaders";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetProfileTipsReceived } from "@/hooks/useMyProfile";
import React from "react";
import TipItem from "./TipItem";

const TipsReceived = () => {
    const { data, isLoading, isError } = useGetProfileTipsReceived();

    return (
        <div className="tips-sent space-y-2">
            {isError ? (
                <CustomMessage msg="Something is wrong!" />
            ) : isLoading ? (
                <React.Fragment>
                    <TipLoaders />
                    <TipLoaders />
                    <TipLoaders />
                </React.Fragment>
            ) : !data.length ? (
                <CustomMessage msg="Not items to show!" />
            ) : data.length ? (
                data.map((item: any) => (
                    <TipItem
                        key={item.id}
                        id={item.id}
                        amount={item.amount}
                        createdAt={item.createdAt}
                        avatar={item.receiver?.avatar}
                        username={item.receiver?.username}
                    />
                ))
            ) : null}
        </div>
    );
};

export default TipsReceived;
