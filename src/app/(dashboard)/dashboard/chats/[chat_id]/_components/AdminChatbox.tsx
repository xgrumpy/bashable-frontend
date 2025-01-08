"use client";

import chatProfiles from "@root/chatprofiles.json";
import AdminMessage from "@root/src/component/chat/AdminMessage";
import { useGetChatMessages, useGetChatProfile } from "@root/src/hooks/admin/useChat";
import { useGetUser } from "@root/src/hooks/useUserProfile";
import React, { useEffect, useRef } from "react";
import AdminChatboxHead from "./AdminChatboxHead";
import AdminInputbox from "./AdminInputbox";

type TAdminChatboxProps = {
    id: string;
};

export default function AdminChatbox({ id }: TAdminChatboxProps) {
    const repliesRef = useRef<HTMLDivElement>(null);

    const { data: messages } = useGetChatMessages({ id });
    const { data: chatProfile } = useGetChatProfile({ id });
    const { data: userData } = useGetUser({ username: chatProfile?.username || "" });

    useEffect(() => {
        if (typeof window !== "undefined") {
            if (repliesRef.current) {
                window.scrollTo(0, window.innerHeight);
                repliesRef.current.scrollTo(0, repliesRef.current.scrollHeight + 500);
            }
        }
    }, [messages]);

    const botLocalAvatar = chatProfiles.find(
        (single) => single.botName === chatProfile?.botName
    )?.botAvatar;

    return (
        <React.Fragment>
            {messages && messages.length ? (
                <AdminChatboxHead id={id} isChangeDisable={messages.length % 2 === 0} />
            ) : null}
            <div>
                {!messages || !messages.length ? (
                    <h5 className="text-2xl font-semibold text-white">
                        No messages yet. Start your conversation.
                    </h5>
                ) : (
                    <React.Fragment>
                        <div
                            ref={repliesRef}
                            className="replies flex flex-col gap-y-4 max-h-[65vh] overflow-y-auto"
                        >
                            {chatProfile &&
                                messages &&
                                messages.map((message, index) => (
                                    <React.Fragment key={index}>
                                        {index % 2 === 0 ? (
                                            <AdminMessage
                                                index={index}
                                                message={message}
                                                name={chatProfile.botName}
                                                avatar={
                                                    chatProfile.botAvatar || botLocalAvatar || ""
                                                }
                                                chatId={id}
                                                requestImageAbility={!!chatProfile.canRequestImage}
                                            />
                                        ) : (
                                            <AdminMessage
                                                index={index}
                                                message={message}
                                                name={chatProfile.rolePlayerName}
                                                avatar={
                                                    chatProfile.rolePlayerAvatar ||
                                                    userData?.avatar ||
                                                    ""
                                                }
                                                chatId={id}
                                                requestImageAbility={!!chatProfile.canRequestImage}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                        </div>
                        <AdminInputbox
                            chatId={id}
                            lastUserMessage={messages[messages.length - 1]}
                            isDisable={messages.length % 2 !== 0}
                            canRequestImage={chatProfile?.canRequestImage || false}
                        />
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
}
