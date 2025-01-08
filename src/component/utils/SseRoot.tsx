"use client";

import { useAuthContext } from "@/context/authContext";
import { useNotificationContext } from "@/context/notificationContext";
import { useAdminChatContext } from "@root/src/context/adminChatContext";
import { useChatContext } from "@root/src/context/chatContext";
import { IChatRequestedImage } from "@root/src/interfaces/chat";
import { toastError } from "@root/src/utils/error";
import { getMessageWithoutAttachment } from "@root/src/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type TSseRootProps = {
    children: React.ReactNode;
};

const SseRoot = ({ children }: TSseRootProps) => {
    const router = useRouter();

    const { username, updateCredits } = useAuthContext();
    const { addNotification } = useNotificationContext();
    const { isTypingOff, addMessage, addRequestedImage, isRequestImageOff } = useChatContext();
    const { changeGeneratedMessage } = useAdminChatContext();

    const queryClient = useQueryClient();

    useEffect(() => {
        if (username) {
            const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/sse`, {
                withCredentials: true,
            });

            eventSource.addEventListener("tip", (event) => {
                const eventData = JSON.parse(event.data);
                addNotification({
                    data: eventData.data,
                    createdAt: eventData.createdAt,
                    id: eventData.id,
                    read: false,
                    type: "tip",
                });

                updateCredits({
                    credits: eventData.data.amount,
                    method: "increment",
                });
            });

            eventSource.addEventListener("recharging_auto", (event) => {
                const eventData = JSON.parse(event.data);
                addNotification({
                    data: eventData.data,
                    createdAt: eventData.createdAt,
                    id: eventData.id,
                    read: false,
                    type: "recharging_auto",
                });
            });

            eventSource.addEventListener("recharging_auto_failed", (event) => {
                const eventData = JSON.parse(event.data);
                addNotification({
                    data: eventData.data,
                    createdAt: eventData.createdAt,
                    id: eventData.id,
                    read: false,
                    type: "recharging_auto_failed",
                });
            });

            eventSource.addEventListener("recharged", (event) => {
                const eventData = JSON.parse(event.data);
                addNotification({
                    data: eventData.data,
                    createdAt: eventData.createdAt,
                    id: eventData.id,
                    read: false,
                    type: "recharged",
                });
                updateCredits({
                    credits: parseFloat(eventData.data.credits),
                    method: "increment",
                });
            });

            eventSource.addEventListener("quest_completed", (event) => {
                const eventData = JSON.parse(event.data);
                addNotification({
                    data: eventData.data,
                    createdAt: eventData.createdAt,
                    id: eventData.id,
                    read: false,
                    type: "quest_completed",
                });
                updateCredits({
                    credits: parseFloat(eventData.data.reward),
                    method: "increment",
                });
            });

            eventSource.addEventListener("chat_reply", (event) => {
                const eventData = JSON.parse(event.data);
                isTypingOff();
                addMessage(eventData.reply);
                if (eventData.cost) {
                    updateCredits({
                        credits: eventData.cost,
                        method: "decrement",
                    });
                }
            });

            eventSource.addEventListener("chat_attachment", (event) => {
                const eventData: IChatRequestedImage = JSON.parse(event.data);
                isRequestImageOff();
                updateCredits({
                    credits: eventData.cost,
                    method: "decrement",
                });
                addRequestedImage({ ...eventData });
                if (!eventData.image) {
                    toastError("Unable to receive image");
                }
            });

            eventSource.addEventListener("chat_bot_response", (event) => {
                const eventData = JSON.parse(event.data);

                if (localStorage.getItem("admin-attach-mode") === "auto-gen") {
                    changeGeneratedMessage(eventData.message);
                } else if (localStorage.getItem("admin-attach-mode") === "auto-gen-plus-send") {
                    queryClient.setQueryData(
                        ["admin", "chathistory", eventData.chatId],
                        (oldData?: string[]): string[] => {
                            return [...(oldData || []), eventData.message];
                        }
                    );
                } else {
                    return;
                }
            });

            eventSource.addEventListener("chat_user_message", (event) => {
                const eventData = JSON.parse(event.data);
                queryClient.setQueryData(
                    ["admin", "chathistory", eventData.chatId],
                    (oldData?: string[]): string[] => {
                        return [...(oldData || []), eventData.message];
                    }
                );
            });

            eventSource.addEventListener("chat_requested_attachment", (event) => {
                const eventData = JSON.parse(event.data);
                queryClient.setQueryData(
                    ["admin", "chathistory", eventData.chatId],
                    (oldData?: string[]): string[] => {
                        const tempData = [...(oldData || [])];
                        const thisMessage =
                            getMessageWithoutAttachment(tempData[eventData.index]) || "";

                        tempData[eventData.index] = thisMessage.concat(
                            `\r\nattachment:${eventData.image}`
                        );

                        return tempData;
                    }
                );
            });

            eventSource.addEventListener("chat_detached_by_admin", (event) => {
                toastError("You are detached by admin");
                queryClient.invalidateQueries({ queryKey: ["admin", "chats"] });
                router.push("/dashboard/chats");
            });

            // eventSource.addEventListener("recharging_auto", (event) => {});

            return () => {
                eventSource.close();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    return <React.Fragment>{children}</React.Fragment>;
};

export default SseRoot;
