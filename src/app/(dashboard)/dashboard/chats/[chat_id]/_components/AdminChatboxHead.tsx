"use client";

import Modal from "@root/src/component/shared/Modal";
import CustomSelect from "@root/src/component/ui/CustomSelect";
import { useAdminChatContext } from "@root/src/context/adminChatContext";
import {
    useGetChatProfile,
    useLeaveFromChat,
    useSwitchChatMode,
} from "@root/src/hooks/admin/useChat";
import { TAdminChatAttachMode } from "@root/src/interfaces/chat";
import { toastError } from "@root/src/utils/error";
import { moderationModeToText } from "@root/src/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ProfileGeneration from "./ProfileGeneration";

type TAdminCHatboxHeadProps = {
    id: string;
    isChangeDisable: boolean;
};

const AdminChatboxHead = ({ id, isChangeDisable }: TAdminCHatboxHeadProps) => {
    const [isViewProfileOpen, setIsViewProfileOpen] = useState(false);
    const [isViewGenerations, setIsViewGenerations] = useState(false);

    const router = useRouter();
    const { chatAttachMode, initChatAttachMode, changeChatAttachMode } = useAdminChatContext();

    const { data: profile } = useGetChatProfile({ id });
    const { mutate: mutateSwitchMode } = useSwitchChatMode();
    const { mutate: mutateLeave, isLoading: isLoadingLeave } = useLeaveFromChat();

    // prettier-ignore
    const generateLink = `${profile?.botAppearancePrompt ? `&prompt=${profile?.botAppearancePrompt}` : ""}${profile?.botAppearanceNegativePrompt? `&negative_prompt=${profile?.botAppearanceNegativePrompt}`: ""}${profile?.botAppearanceModel? `&model=${profile?.botAppearanceModel}`: ""}`;

    useEffect(() => {
        if (typeof window !== "undefined") {
            initChatAttachMode();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeHandler = (mode: TAdminChatAttachMode) => {
        if (isChangeDisable) {
            toastError("Please send a message before leaving.");
        } else {
            mutateSwitchMode(
                { id, mode },
                {
                    onSuccess: () => {
                        changeChatAttachMode(mode);
                    },
                    onError: (error) => {
                        toastError(error);
                    },
                }
            );
        }
    };

    const handleLeave = () => {
        if (isChangeDisable) {
            toastError("Please send a message before leaving.");
        } else {
            mutateLeave(
                { id },
                {
                    onSuccess(data) {
                        toast.success(data.message);
                        changeChatAttachMode("auto-gen-plus-send");
                        router.push("/dashboard/chats");
                    },
                    onError(error) {
                        toastError(error);
                    },
                }
            );
        }
    };

    return (
        <React.Fragment>
            <Modal state={isViewProfileOpen} closeHandler={() => setIsViewProfileOpen(false)}>
                <div className="max-w-3xl border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full space-y-3">
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Username: </p>
                        <p>{profile?.username}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Messages: </p>
                        <p>{profile?.chatLength}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Role Player Name: </p>
                        <p>{profile?.rolePlayerName}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Bot Name: </p>
                        <p>{profile?.botName}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Bot Gender: </p>
                        <p>{profile?.botGender ?? "N/A"}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Bot First Message: </p>
                        <p>{profile?.botFirstMessage ?? "N/A"}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Bot System Message: </p>
                        <p>{profile?.botSystemMessage ?? "N/A"}</p>
                    </div>
                    <div className="single flex gap-x-2 flex-wrap">
                        <p className="text-white font-medium">Request image ability: </p>
                        <p>{profile?.canRequestImage ? "Yes" : "No"}</p>
                    </div>
                    {profile?.canRequestImage ? (
                        <React.Fragment>
                            <div className="single flex gap-x-2 flex-wrap">
                                <p className="text-white font-medium">Bot Appearance Prompt: </p>
                                <p>{profile?.botAppearancePrompt ?? "N/A"}</p>
                            </div>
                            <div className="single flex gap-x-2 flex-wrap">
                                <p className="text-white font-medium">
                                    Bot Appearance Negative Prompt:{" "}
                                </p>
                                <p>{profile?.botAppearanceNegativePrompt ?? "N/A"}</p>
                            </div>
                            <div className="single flex gap-x-2 flex-wrap">
                                <p className="text-white font-medium">Bot Appearance Model: </p>
                                <p>{profile?.botAppearanceModel ?? "N/A"}</p>
                            </div>
                        </React.Fragment>
                    ) : null}
                </div>
            </Modal>
            <Modal state={isViewGenerations} closeHandler={() => setIsViewGenerations(false)}>
                <div className="max-w-3xl border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <ProfileGeneration username={profile?.username || ""} />
                </div>
            </Modal>
            <div className="chatboxhead">
                <div className="chatinfo flex gap-x-8 gap-y-2 flex-wrap justify-between items-center">
                    <h4 className="text-xl font-semibold">
                        Bot Name:{" "}
                        <span className="text-black dark:text-white">{profile?.botName}</span>
                    </h4>
                    <h4 className="text-xl font-semibold">
                        Player Name:{" "}
                        <span className="text-black dark:text-white">
                            {profile?.rolePlayerName}
                        </span>
                    </h4>
                </div>
                <div className="options flex gap-5 flex-wrap justify-between items-center mt-6">
                    <button className="btn" onClick={() => setIsViewGenerations(true)}>
                        User Generations
                    </button>
                    <Link href={`/generate?${generateLink}`} className="btn" target="_blank">
                        Generate Image
                    </Link>
                    <button className="btn" onClick={() => setIsViewProfileOpen(true)}>
                        Chat Profile
                    </button>
                    <button
                        className="btn !bg-red-500"
                        onClick={handleLeave}
                        disabled={isLoadingLeave}
                    >
                        Leave Chat
                    </button>
                </div>
                <div className="mode flex gap-x-8 gap-y-3 flex-wrap justify-between mt-4 items-center">
                    <p>
                        Moderation Mode:{" "}
                        <span className="text-black dark:text-white">
                            {moderationModeToText(chatAttachMode)}
                        </span>
                    </p>
                    <div className="flex items-center gap-x-2">
                        <h5 className="font-semibold">Switch Mode: </h5>
                        <CustomSelect
                            items={[
                                { text: "Auto Generate and Send", value: "auto-gen-plus-send" },
                                {
                                    text: "Auto Generate",
                                    value: "auto-gen",
                                },
                                {
                                    text: "Manual",
                                    value: "manual",
                                },
                            ]}
                            current={chatAttachMode}
                            setCurrentValue={changeHandler}
                        />
                    </div>
                </div>
                <span className="block my-10 border-b border-borderlight dark:border-border"></span>
            </div>
        </React.Fragment>
    );
};

export default AdminChatboxHead;
