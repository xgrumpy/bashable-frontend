"use client";

import { useAdminChatContext } from "@root/src/context/adminChatContext";
import { useAuthContext } from "@root/src/context/authContext";
import { useSendMessageToUser } from "@root/src/hooks/admin/useChat";
import { imageLoader, shimmer, toBase64 } from "@root/src/utils/utils";
import { useQueryClient } from "@tanstack/react-query";
import Vocal from "@untemps/react-vocal";
import Image from "next/image";
import { KeyboardEvent, useEffect, useState } from "react";
import { RiMicLine, RiSendPlane2Line } from "react-icons/ri";

type TAdminInputboxProps = {
    lastUserMessage: string;
    isDisable: boolean;
    chatId: string;
    canRequestImage: boolean;
};

const AdminInputbox = ({
    chatId,
    lastUserMessage,
    isDisable,
    canRequestImage,
}: TAdminInputboxProps) => {
    const [inputField, setInputField] = useState<string>("");
    const [image, setImage] = useState("");

    const { updateCredits } = useAuthContext();
    const { chatAttachMode, generatedMessage, changeGeneratedMessage } = useAdminChatContext();

    const queryClient = useQueryClient();
    const { mutate: sendMessageToUser } = useSendMessageToUser();

    useEffect(() => {
        setInputField(generatedMessage);
    }, [generatedMessage]);

    const _onVocalStart = () => {};

    const _onVocalResult = (result: string) => {
        setInputField(result);
    };

    const sendMessage = () => {
        const formattedMessage = image ? inputField.concat(`\r\nattachment:${image}`) : inputField;

        sendMessageToUser(
            {
                id: chatId,
                data: {
                    bot: formattedMessage,
                    user: lastUserMessage,
                    edited: inputField === generatedMessage ? 1 : null,
                },
            },
            {
                onSuccess: (data, variables) => {
                    queryClient.setQueryData(
                        ["admin", "chathistory", variables.id],
                        (oldData?: string[]): string[] => {
                            return [...(oldData || []), variables.data.bot];
                        }
                    );
                    updateCredits({ credits: 0.25, method: "increment" });
                    changeGeneratedMessage("");
                    setInputField("");
                    setImage("");
                },
            }
        );
    };

    const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    };

    if (chatAttachMode === "auto-gen-plus-send") return null;

    return (
        <div className="message-item  even:self-end odd:self-start mt-6 bg-gray-200 dark:bg-[#111122] bg-opacity-80 p-5">
            <div className="relative w-full">
                <textarea
                    placeholder="Enter your message or *narration / stage directions* "
                    value={inputField}
                    onChange={(e) => setInputField(e.target.value)}
                    // @ts-ignore
                    onKeyDown={handleKeydown}
                    disabled={isDisable}
                    className="min-h-[100px] max-h-[100px] bg-gray-300 dark:bg-[#11111f] bg-opacity-80 appearance-none"
                />
                {!isDisable && (
                    <Vocal onStart={_onVocalStart} onResult={_onVocalResult}>
                        {(start: () => void, stop: () => void, isStarted: boolean) => (
                            <button
                                className="absolute left-auto right-0 top-0.5 p-1"
                                onClick={isStarted ? stop : start}
                            >
                                {isStarted ? (
                                    <span className="absolute left-auto right-0 top-0 h-1.5 w-1.5 rounded-full bg-red-500 overflow-hidden"></span>
                                ) : null}
                                <RiMicLine className="text-lg" />
                            </button>
                        )}
                    </Vocal>
                )}
            </div>
            {canRequestImage ? (
                <div className="image mt-3">
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Enter image url here"
                        disabled={isDisable}
                    />
                    {image ? (
                        <div className="image h-80 w-80 max-w-full relative mt-3">
                            <Image
                                loader={imageLoader}
                                src={image}
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                    shimmer(500, 500)
                                )}`}
                                alt="something"
                                fill
                                className="object-cover object-center w-full max-w-full aspect-square"
                            />
                        </div>
                    ) : null}
                </div>
            ) : null}
            <button
                className="btn !inline-flex gap-x-2 items-center mt-3"
                onClick={sendMessage}
                disabled={!inputField || isDisable}
            >
                Send <RiSendPlane2Line />
            </button>
        </div>
    );
};

export default AdminInputbox;
