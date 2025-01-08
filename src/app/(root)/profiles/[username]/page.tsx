"use client";

import FollowButton from "@/component/elements/FollowButton";
import Modal from "@/component/shared/Modal";
import { useAuthContext } from "@/context/authContext";
import { IProfile } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProfileGenerations from "./components/ProfileGenerations";
import TipSendbox from "./components/TipSendbox";

const UserProfile = ({ params }: any) => {
    const { username: usernameFromUrl } = params;
    const [isFollowed, setIsFollowed] = useState<boolean>(false);
    const [userData, setUserData] = useState<IProfile>({} as IProfile);
    const [refreshCount, setRefreshCount] = useState<number>(1);

    const [isTipBoxOpen, setIsTipBoxOpen] = useState<boolean>(false);
    const [isNotPurchasedWarningOpen, setIsNotPurchasedWarningOpen] = useState<boolean>(false);

    const { username, purchasedCredits, banned } = useAuthContext();

    useEffect(() => {
        axiosReq
            .get(`/users/profile/${usernameFromUrl}`)
            .then((res) => {
                setUserData(res.data);
                setIsFollowed(res.data.followed);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [usernameFromUrl, refreshCount]);

    const handleGiveTip = () => {
        if (purchasedCredits) {
            setIsTipBoxOpen(true);
        } else {
            setIsNotPurchasedWarningOpen(true);
        }
    };

    const refresh = () => {
        setRefreshCount((prev) => prev + 1);
    };

    return (
        <>
            <Modal state={isTipBoxOpen} closeHandler={() => setIsTipBoxOpen(false)}>
                <TipSendbox userid={userData.id} closeHandler={() => setIsTipBoxOpen(false)} />
            </Modal>
            <Modal
                state={isNotPurchasedWarningOpen}
                closeHandler={() => setIsNotPurchasedWarningOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-yellow-500 text-black py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>
                            You have to purchase credits at least 1 time for give tips. Please{" "}
                            <Link href="/buy-credits" className="underline font-semibold">
                                purchase credits
                            </Link>{" "}
                            and try again!
                        </p>
                    </div>
                </div>
            </Modal>

            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex gap-6 flex-wrap">
                            <div className="avatar relative text-4xl text-black dark:text-white h-24 w-24 basis-24 grow-0 shrink-0 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden">
                                {userData.avatar ? (
                                    <Image
                                        src={userData.avatar}
                                        alt={userData.username}
                                        className="h-full w-full"
                                        fill
                                    />
                                ) : (
                                    <span className="select-none">
                                        {userData.username?.trim()[0]}
                                    </span>
                                )}
                            </div>
                            <div className="content">
                                <h3 className="text-2xl font-bold text-black dark:text-white ">
                                    {userData.username}
                                </h3>
                                <p>
                                    <strong>Joined on bashable </strong>
                                    {userData?.createdAt && (
                                        <span className="text-black dark:text-white">
                                            {formatDistanceToNow(new Date(userData?.createdAt))} ago
                                        </span>
                                    )}
                                </p>
                                <div className="flex gap-x-10 gap-y-1 flex-wrap my-2">
                                    <p>
                                        <strong>{userData.generations}</strong> Generations
                                    </p>
                                    <p>
                                        <strong>{userData.upscales}</strong> Upscales
                                    </p>
                                    <p>
                                        <strong>{userData.followersNum}</strong> Followers
                                    </p>
                                    <p>
                                        <strong>{userData.followingNum}</strong> Following
                                    </p>
                                </div>
                                {username !== usernameFromUrl && !banned ? (
                                    <div className="flex gap-x-5 gap-y-2 flex-wrap mt-4">
                                        <FollowButton
                                            isFollowed={isFollowed}
                                            userId={userData.id}
                                            refresh={refresh}
                                        />
                                        {username && (
                                            <button
                                                className="btn btn-outline"
                                                onClick={handleGiveTip}
                                            >
                                                Give Tip
                                            </button>
                                        )}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <span className="block mt-16"></span>
                    <ProfileGenerations username={usernameFromUrl} />
                </section>
            </main>
        </>
    );
};

export default UserProfile;
