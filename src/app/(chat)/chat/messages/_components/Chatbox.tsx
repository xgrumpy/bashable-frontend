"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import { useAuthContext } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import chatProfiles from "@root/chatprofiles.json";
import Message from "@root/src/component/chat/Message";
import { IChatProfile } from "@root/src/interfaces/general";
import Vocal from "@untemps/react-vocal";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
    KeyboardEvent,
    SyntheticEvent,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { toast } from "react-hot-toast";
import { RiMicLine, RiSendPlane2Line } from "react-icons/ri";

const Chatbox = () => {
    const searchParams = useSearchParams();
    const chatId = searchParams.get("chatId") || "";

    const [isClearChatModalOpen, setIsClearChatModalOpen] = useState<boolean>(false);
    const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState<boolean>(false);
    const [deleteChatId, setDeleteChatId] = useState<string>("");
    const [profileDetails, setProfileDetails] = useState<IChatProfile>({} as IChatProfile);

    const [inputField, setInputField] = useState<string>("");

    const _onVocalStart = () => {};

    const _onVocalResult = (result: string) => {
        setInputField(result);
    };

    const {
        profiles,
        messages,
        initMessages,
        addMessage,
        isTyping,
        isTypingOn,
        isTypingOff,
        initProfiles,
        clearLastRequestedImage,
    } = useChatContext();
    const { avatar: userAvatar } = useAuthContext();

    const repliesRef = useRef<HTMLDivElement>(null);
    const refInputBox = useRef<HTMLTextAreaElement>(null);

    const router = useRouter();

    useEffect(() => {
        clearLastRequestedImage();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useLayoutEffect(() => {
        if (typeof window !== "undefined") {
            if (repliesRef.current) {
                window.scrollTo(0, window.innerHeight);
                repliesRef.current.scrollTo(0, repliesRef.current.scrollHeight + 500);
            }
        }
    }, [profiles, messages, isTyping]);

    useEffect(() => {
        axiosReq
            .get(`/chats`)
            .then((res) => {
                let modifiedData = res.data.map((item: IChatProfile) => {
                    return {
                        ...item,
                        botAvatar:
                            item.botAvatar && item.botAvatar !== "null"
                                ? item.botAvatar
                                : chatProfiles.find((profile) => profile.botName === item.botName)
                                      ?.botAvatar,
                    };
                });
                initProfiles(modifiedData);

                let filteredProfileData = res.data.find((item: IChatProfile) => item.id === chatId);
                if (!filteredProfileData.botAvatar || filteredProfileData.botAvatar === "null") {
                    filteredProfileData.botAvatar = chatProfiles.find(
                        (profile) => profile.botName === filteredProfileData.botName
                    )?.botAvatar;
                }
                setProfileDetails(filteredProfileData);
            })
            .catch((err) => {
                console.log(err);
            });
        axiosReq
            .get(`/chats/${chatId}/messages`)
            .then((res) => {
                initMessages(res.data);
            })
            .catch((err) => {
                toastError(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId]);

    useEffect(() => {
        if (!isTyping && refInputBox.current) {
            refInputBox.current?.focus();
        }
    }, [isTyping]);

    const sendMessage = () => {
        axiosReq
            .post(`/chats/${chatId}/messages`, {
                message: inputField,
            })
            .then((res) => {
                addMessage(inputField);
                setInputField("");
                isTypingOn();
            })
            .catch((err) => {
                isTypingOff();
                toastError(err);
            });
    };

    const handleKeydown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    };

    const handleClearChat = () => {
        axiosReq
            .delete(`/chats/${deleteChatId}/messages`)
            .then((res) => {
                toast.success("Successfully deleted all messages!");
                setIsClearChatModalOpen(false);
                axiosReq
                    .get(`/chats/${chatId}/messages`)
                    .then((res) => {
                        initMessages(res.data);
                    })
                    .catch((err) => {
                        toastError(err);
                    });
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleDeleteProfiles = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .delete(`/chats/${deleteChatId}`)
            .then((res) => {
                setIsDeleteChatModalOpen(false);
                toast.success("Successfully delete profiles!");
                router.push("/chat");
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <React.Fragment>
            <ConfirmationModal
                state={isClearChatModalOpen}
                closeHandler={() => setIsClearChatModalOpen(false)}
                acceptHandler={handleClearChat}
                declineHandler={() => setIsClearChatModalOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to clear the chat?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isDeleteChatModalOpen}
                closeHandler={() => setIsDeleteChatModalOpen(false)}
                acceptHandler={handleDeleteProfiles}
                declineHandler={() => setIsDeleteChatModalOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete the chat?
                </h5>
            </ConfirmationModal>
            <section className="section py-16">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-10">
                        <div className="botprofile text-center mb-5">
                            <Avatar
                                avatar={profileDetails?.botAvatar || null}
                                name={profileDetails?.botName || ""}
                                large
                            />
                            <h4 className="text-2xl font-semibold text-black dark:text-white mt-2">
                                {profileDetails?.botName}
                            </h4>
                        </div>
                        <div className="actions flex gap-2 justify-center">
                            <Link href="/chat" className="btn btn-sm btn-outline !rounded-full">
                                Return to Lobby
                            </Link>
                            <button
                                className="btn btn-sm !bg-opacity-80 !rounded-full"
                                onClick={() => {
                                    setDeleteChatId(chatId);
                                    setIsClearChatModalOpen(true);
                                }}
                            >
                                New Chat
                            </button>
                        </div>
                    </div>
                    {!messages || !messages.length ? (
                        <h5 className="text-2xl font-semibold text-white">
                            No messages yet. Start your conversation.
                        </h5>
                    ) : null}
                    <div
                        ref={repliesRef}
                        className="replies flex flex-col gap-y-4 max-h-[65vh] overflow-y-auto"
                    >
                        {messages &&
                            messages.map((message, index) => (
                                <React.Fragment key={index}>
                                    {index % 2 === 0 ? (
                                        <Message
                                            index={index}
                                            message={message}
                                            name={profileDetails.botName}
                                            avatar={profileDetails.botAvatar}
                                            chatId={chatId}
                                            requestImageAbility={!!profileDetails.canRequestImage}
                                        />
                                    ) : (
                                        <Message
                                            index={index}
                                            message={message}
                                            name={profileDetails.rolePlayerName}
                                            avatar={profileDetails.rolePlayerAvatar || userAvatar}
                                            chatId={chatId}
                                            requestImageAbility={!!profileDetails.canRequestImage}
                                        />
                                    )}
                                </React.Fragment>
                            ))}
                        {isTyping ? (
                            <div className="message-item w-full flex items-start gap-x-4 py-4 px-4 bg-gray-200 dark:bg-[#111122] bg-opacity-80 rounded">
                                <Avatar
                                    avatar={profileDetails?.botAvatar || null}
                                    name={profileDetails?.botName || ""}
                                />
                                <div className="content">
                                    <h6 className="text-lg font-bold text-black dark:text-white -mt-1.5">
                                        {profileDetails?.botName}
                                    </h6>
                                    <span className="block opacity-60">Typing</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                    <div className="message-item w-full flex items-center gap-x-2 even:self-end odd:self-start mt-6 bg-gray-200 dark:bg-[#111122] bg-opacity-80 p-5">
                        <div className="relative w-full">
                            <textarea
                                ref={refInputBox}
                                placeholder="Enter your message or *narration / stage directions* "
                                value={inputField}
                                onChange={(e) => setInputField(e.target.value)}
                                // @ts-ignore
                                onKeyDown={handleKeydown}
                                disabled={isTyping}
                                className="min-h-[100px] max-h-[100px] bg-gray-300 dark:bg-[#11111f] bg-opacity-80 appearance-none"
                            />
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
                        </div>

                        <button
                            className="inline-flex h-12 w-16 grow-0 shrink-0 basis-16 bg-primary text-white rounded-full justify-center items-center text-lg disabled:opacity-75"
                            onClick={sendMessage}
                            disabled={!!!inputField}
                        >
                            <RiSendPlane2Line className="align-middle" />
                        </button>
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default Chatbox;

const Avatar = ({
    avatar,
    name,
    large = false,
}: {
    avatar: string | null;
    name: string;
    large?: boolean;
}) => {
    return (
        <div
            title={name}
            className={`avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary inline-flex justify-center font-bold items-center uppercase rounded-md border border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden grow-0 shrink-0 ${
                large ? "h-20 w-20 basis-20 text-3xl" : "h-12 w-12 basis-12 text-xl"
            }`}
        >
            {avatar ? (
                <Image src={avatar} alt={name} className="h-full w-full" fill />
            ) : (
                <span className="select-none">{name.trim()[0]}</span>
            )}
        </div>
    );
};
