import { useAuthContext } from "@root/src/context/authContext";
import { useAttachToChat, useLeaveFromChat } from "@root/src/hooks/admin/useChat";
import { TAdminChat } from "@root/src/interfaces/chat";
import { toastError } from "@root/src/utils/error";
import { moderationModeToText } from "@root/src/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

type TChatItemProps = {
    chatData: TAdminChat;
};

const ChatItem = ({ chatData }: TChatItemProps) => {
    const {
        id,
        botName,
        chatLength,
        lastChatAt,
        moderated,
        moderatedAt,
        moderatedBy,
        moderationMode,
        rolePlayerName,
        username,
    } = chatData;

    const router = useRouter();
    const { username: loggedInUsername, role: loggedInRole } = useAuthContext();
    const { mutate, isLoading } = useAttachToChat();
    const { mutate: mutateLeave, isLoading: isLoadingLeave } = useLeaveFromChat();

    const handleParticipate = () => {
        mutate(
            {
                id: id,
                mode: "auto-gen-plus-send",
            },
            {
                onSuccess(data) {
                    toast.success(data.message);
                    router.push(`/dashboard/chats/${id}`);
                },
                onError(error) {
                    toastError(error);
                },
            }
        );
    };

    const handleLeave = () => {
        mutateLeave(
            { id },
            {
                onSuccess(data) {
                    toast.success(data.message);
                },
                onError(error) {
                    toastError(error);
                },
            }
        );
    };

    return (
        <div className="border border-borderlight dark:border-border py-2 gap-y-4 rounded-md flex items-center justify-between flex-wrap lg:flex-nowrap">
            <div className="px-4 border-0 border-borderlight dark:border-border lg:border-r w-full lg:flex-1">
                <h5 className="text-lg font-semibold">
                    Bot Name: <span className="text-black dark:text-white">{botName}</span>
                </h5>
                <h5 className="text-lg font-semibold">
                    Player Name:{" "}
                    <span className="text-black dark:text-white">{rolePlayerName}</span>
                </h5>
                <p>
                    Messages: <span className="text-black dark:text-white">{chatLength}</span>
                </p>
                <p>
                    Ceated By: <span className="text-black dark:text-white">{username}</span>
                </p>
                <p>
                    Last Chat At:{" "}
                    <span className="text-black dark:text-white">
                        {new Date(lastChatAt).toLocaleString()}
                    </span>
                </p>
            </div>
            <div className="px-4 border-0 border-borderlight dark:border-border lg:border-r lg:flex-1">
                <p>
                    Is Moderated:{" "}
                    {moderated ? (
                        <span className="text-green-500">Yes</span>
                    ) : (
                        <span className="text-yellow-500">No</span>
                    )}
                </p>
                {moderatedBy ? (
                    <React.Fragment>
                        <p>
                            Moderated At:{" "}
                            <span className="text-black dark:text-white">
                                {!moderatedAt ? "Never" : new Date(moderatedAt).toLocaleString()}
                            </span>
                        </p>
                        <p>
                            Moderated By:{" "}
                            <span className="text-black dark:text-white">{moderatedBy}</span>
                        </p>
                        <p>
                            Moderation Mode:{" "}
                            <span className="text-black dark:text-white">
                                {moderationModeToText(moderationMode)}
                            </span>
                        </p>
                    </React.Fragment>
                ) : null}
            </div>
            <div className="action flex flex-col items-center justify-center gap-2 px-4">
                {moderated && moderatedBy === "admin" && loggedInRole === "mod" ? (
                    <p className="text-yellow-500">Moderate By Admin</p>
                ) : null}
                {moderated && moderatedBy === loggedInUsername ? (
                    <Link href={`/dashboard/chats/${id}`} className="btn !bg-yellow-500">
                        Continue
                    </Link>
                ) : null}
                {moderated && moderatedBy === loggedInUsername ? (
                    <button className="btn !bg-red-500" onClick={handleLeave}>
                        Leave Chat
                    </button>
                ) : null}
                {moderated && loggedInRole === "admin" && moderatedBy !== "admin" ? (
                    <button className="btn !bg-yellow-500" onClick={handleLeave}>
                        Detach
                    </button>
                ) : null}
                {!moderated ? (
                    <button className="btn" onClick={handleParticipate}>
                        Participate
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default ChatItem;
