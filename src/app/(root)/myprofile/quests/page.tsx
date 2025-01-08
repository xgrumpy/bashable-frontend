"use client";

import CustomMessage from "@/component/ui/CustomMessage";
import { useGetQuests } from "@/hooks/useQuests";
import React from "react";
import { RiCheckLine } from "react-icons/ri";

const UserQuestsPage = () => {
    const { data, isLoading, isError, refetch } = useGetQuests();

    // questGetFirstFollowerAchieved: false;
    // questGetFirstFollowerProgress: 0;
    // questGetFirstReferralSignupAchieved: false;
    // questGetFirstReferralSignupProgress: 0;
    // questGetTenFollowerAchieved: false;
    // questGetTenFollowerProgress: 0;
    // questShareOneImageDiscordAchieved: false;
    // questShareOneImageDiscordProgress: 0;
    // questShareOneImageProfileAchieved: false;
    // questShareOneImageProfileProgress: 0;
    // questShareTenImageProfileAchieved: false;
    // questShareTenImageProfileProgress: 0;

    return (
        <div className="max-w-7xl mx-auto generations mt-10">
            <h4 className="text-2xl font-semibold text-black dark:text-white mb-5">My Quests</h4>
            <div className="">
                {isError ? (
                    <CustomMessage msg="Something is wrong!" />
                ) : isLoading ? (
                    <React.Fragment></React.Fragment>
                ) : data ? (
                    <div className="flex flex-wrap mt-8 space-y-5">
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questShareOneImageDiscordAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Share first image on Discord: <strong>+10 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 1) * data.questShareOneImageDiscordProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questShareOneImageDiscordProgress}/1
                                </span>
                            </div>
                        </div>
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questShareOneImageProfileAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Share first image on your profile: <strong>+10 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 1) * data.questShareOneImageProfileProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questShareOneImageProfileProgress}/1
                                </span>
                            </div>
                        </div>
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questShareTenImageProfileAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Share 10 images on your profile: <strong>+10 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 10) * data.questShareTenImageProfileProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questShareTenImageProfileProgress}/10
                                </span>
                            </div>
                        </div>
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questGetFirstFollowerAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Get First Follower: <strong>+10 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 1) * data.questGetFirstFollowerProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questGetFirstFollowerProgress}/1
                                </span>
                            </div>
                        </div>
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questGetTenFollowerAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Get 10 Followers: <strong>+200 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 10) * data.questGetTenFollowerProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questGetTenFollowerProgress}/10
                                </span>
                            </div>
                        </div>
                        <div className="single flex w-full gap-x-8 gap-y-3 items-center">
                            <p
                                className={`flex-1 text-lg flex items-center gap-x-2 ${
                                    data.questGetFirstReferralSignupAchieved ? "text-primary" : ""
                                }`}
                            >
                                <RiCheckLine className="text-2xl" />
                                <span>
                                    Get First Referral Signup: <strong>+10 credits</strong>
                                </span>
                            </p>
                            <div className="flex-1 flex items-center gap-x-4">
                                <div className="progress relative rounded-full overflow-hidden h-6 w-full bg-primary bg-opacity-10">
                                    <span
                                        className="progress-bar absolute inset-0 bg-primary text-center rounded-full"
                                        style={{
                                            width: `${Math.floor(
                                                (100 / 1) * data.questGetFirstReferralSignupProgress
                                            )}%`,
                                        }}
                                    ></span>
                                </div>
                                <span className="text-lg font-bold min-w-[40px] text-right inline-block">
                                    {data.questGetFirstReferralSignupProgress}/1
                                </span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default UserQuestsPage;
