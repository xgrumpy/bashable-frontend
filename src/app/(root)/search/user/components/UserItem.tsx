"use client";

import FollowButton from "@/component/elements/FollowButton";
import { IProfileMinimal } from "@/interfaces/general";
import { imageLoader } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

interface IUserItemProps {
    data: IProfileMinimal;
    refresh?: () => void;
    showFollowed?: boolean;
    showFollowing?: boolean;
}

const UserItem = ({
    data,
    refresh,
    showFollowed,
    showFollowing,
}: IUserItemProps) => {
    return (
        <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-4 border border-borderlight dark:border-border p-2 rounded-md w-full">
            <div className="user flex items-center gap-x-2">
                <Link
                    href={`/profiles/${encodeURIComponent(data.username)}`}
                    className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                >
                    {data.avatar ? (
                        <Image
                            loader={imageLoader}
                            src={data.avatar}
                            alt={data.username}
                            className="h-full w-full"
                            fill
                        />
                    ) : (
                        <span className="select-none">
                            {data.username?.trim()[0]}
                        </span>
                    )}
                </Link>
                <div className="content">
                    <h6 className="text-base font-semibold">
                        <Link
                            href={`/profiles/${encodeURIComponent(
                                data.username
                            )}`}
                            className="text-black dark:text-white hover:!text-primary"
                        >
                            {data.username}
                        </Link>
                    </h6>
                    {data.following && showFollowed && (
                        <p className="text-xs">Also following him</p>
                    )}
                    {data.followed && showFollowing && (
                        <p className="text-xs">Also followed you</p>
                    )}
                </div>
            </div>
            <div className="text-right">
                <FollowButton
                    isFollowed={data.following}
                    userId={data.id}
                    refresh={refresh}
                />
            </div>
        </div>
    );
};

export default UserItem;
