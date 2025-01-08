"use client";

import { useAuthContext } from "@/context/authContext";
import { handleClipboard } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

const UserPrimaryDetails = () => {
    const {
        avatar,
        username,
        email,
        credits,
        followers,
        following,
        unrestricted,
        referrals,
        discordConnected,
        referralCode,
        banned,
    } = useAuthContext();

    return (
        <div className="flex gap-6 flex-wrap">
            <Link
                href={banned ? "/" : `/profiles/${encodeURIComponent(username)}`}
                className="avatar relative text-4xl text-black dark:text-white h-24 w-24 basis-24 grow-0 shrink-0 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
            >
                {avatar ? (
                    <Image src={avatar} alt={username} className="h-full w-full" fill />
                ) : (
                    <span className="select-none">{username?.trim()[0]}</span>
                )}
            </Link>
            <div className="content">
                <h3 className="text-2xl font-bold text-black dark:text-white ">
                    <Link
                        href={banned ? "/" : `/profiles/${encodeURIComponent(username)}`}
                        className="text-black dark:text-white hover:!text-primary"
                    >
                        {username}
                    </Link>
                </h3>
                <p>
                    Email: <strong>{email}</strong>
                </p>
                <p>
                    Credits: <strong>{credits.toFixed(3)}</strong>
                </p>
                <p>
                    Unrestricted: <strong>{unrestricted ? "Yes" : "No"}</strong>
                </p>
                <p>
                    Referrals: <strong>{referrals}</strong>
                </p>
                <p>
                    Discord Connected: <strong>{discordConnected ? "Yes" : "No"}</strong>
                </p>
                <p>
                    Referral Code:{" "}
                    <strong title="Click to copy" onClick={() => handleClipboard(referralCode)}>
                        {referralCode}
                    </strong>
                </p>
                {/* <div className="flex gap-x-5 gap-y-2 flex-wrap mt-4">
                    <Link href="/account" className="btn btn-sm btn-outline">
                        Edit Account
                    </Link>
                </div> */}
                <div className="flex gap-3 flex-wrap mt-4">
                    {!banned && (
                        <Link
                            href={`/profiles/${encodeURIComponent(username)}`}
                            className="btn btn-sm"
                        >
                            View Public Profile
                        </Link>
                    )}
                    <Link href="/myprofile/followers" className="btn btn-sm">
                        {followers} Followers
                    </Link>
                    <Link href="/myprofile/following" className="btn btn-sm">
                        {following} Following
                    </Link>
                    <Link href="/myprofile" className="btn btn-sm">
                        Tips
                    </Link>
                    {!banned && (
                        <Link href="/myprofile/generations" className="btn btn-sm">
                            My Generations
                        </Link>
                    )}
                    <Link href="/myprofile/transactions" className="btn btn-sm">
                        Transactions
                    </Link>
                    <Link href="/myprofile/quests" className="btn btn-sm">
                        Quests
                    </Link>
                    <Link href="/myprofile/mylikes" className="btn btn-sm">
                        My Likes
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default UserPrimaryDetails;
