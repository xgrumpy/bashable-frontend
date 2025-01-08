import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ITipItemProps {
    id: string;
    amount: number;
    createdAt: string;
    username?: string;
    avatar?: string;
}

const TipItem = ({
    id,
    username,
    avatar,
    amount,
    createdAt,
}: ITipItemProps) => {
    return (
        <div
            className="signle flex justify-between items-center flex-wrap gap-x-3 border border-borderlight dark:border-border p-2 rounded-md overflow-hidden"
            key={id}
        >
            <div className="user flex items-center gap-x-2 w-full md:w-auto md:flex-1">
                {username ? (
                    <React.Fragment>
                        <Link
                            href={`/profiles/${encodeURIComponent(username)}`}
                            className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 basis-12 grow-0 shrink-0 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                        >
                            {avatar ? (
                                <Image
                                    src={avatar}
                                    alt={username}
                                    className="h-full w-full"
                                    fill
                                />
                            ) : (
                                <span className="select-none">
                                    {username?.trim()[0]}
                                </span>
                            )}
                        </Link>
                        <h6 className="font-semibold">
                            <Link
                                href={`/profiles/${encodeURIComponent(
                                    username
                                )}`}
                                className="block text-black dark:text-white hover:!text-primary"
                            >
                                {username}
                            </Link>
                        </h6>
                    </React.Fragment>
                ) : (
                    <h6 className="font-semibold text-black dark:text-white">
                        Unknown User
                    </h6>
                )}
            </div>
            <p className="text-center">
                Amount: <strong>{amount.toFixed(3)}</strong>
            </p>
            <p className="md:flex-1 text-right">
                Date: <strong>{new Date(createdAt).toLocaleString()}</strong>
            </p>
        </div>
    );
};

export default TipItem;
