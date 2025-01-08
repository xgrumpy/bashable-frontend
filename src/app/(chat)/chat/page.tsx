"use client";

import { useAuthContext } from "@/context/authContext";
import { useChatContext } from "@/context/chatContext";
import axiosReq from "@/utils/axios";
import chatProfiles from "@root/chatprofiles.json";
import ConfirmationModal from "@root/src/component/shared/ConfirmationModal";
import Modal from "@root/src/component/shared/Modal";
import CustomMessage from "@root/src/component/ui/CustomMessage";
import { IChatProfile } from "@root/src/interfaces/general";
import { toastError } from "@root/src/utils/error";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { HiArrowDownTray, HiOutlineChatBubbleLeftRight, HiPhoto, HiPlus } from "react-icons/hi2";
import { RiDeleteBinLine } from "react-icons/ri";

type TFormData = {
    rolePlayerName: string;
    rolePlayerGender: string;
    rolePlayerGenderOther: string;
    botDescription: string;
    botName: string;
    botFirstMessage: string;
    botPersonalitySummary: string;
    chatScenario: string;
    chatExample: string;
    botGender: string;
    botGenderOther: string;
};

const ChatPage = () => {
    const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
    const [importUrl, setImportUrl] = useState<string>("");

    const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState<boolean>(false);
    const [deleteChatId, setDeleteChatId] = useState<string>("");

    const [rolePlayerAvatar, setRolePlayerAvatar] = useState<File | string | null>(null);
    const [rolePlayerAvatarError, setRolePlayerAvatarError] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState<boolean>(false);

    const { initProfiles, profiles } = useChatContext();

    const { username, avatar: userAvatar } = useAuthContext();

    const router = useRouter();

    useEffect(() => {
        if (userAvatar) {
            setRolePlayerAvatar(userAvatar);
        }
    }, [userAvatar]);

    useEffect(() => {
        axiosReq
            .get("/chats")
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
            })
            .catch((err) => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormData>({
        values: {
            rolePlayerName: username,
            rolePlayerGender: "male" || "",
            rolePlayerGenderOther: "",
            botName: "",
            botGender: "",
            botGenderOther: "",
            botDescription: "",
            botFirstMessage: "",
            botPersonalitySummary: "",
            chatScenario: "",
            chatExample: "",
        },
    });
    const watchRolePlayerGender = watch("rolePlayerGender");

    const handleRolePlayerAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 2 * 1024 * 1024;
            if (e.target.files.length && e.target.files[0].size > MAX_FILE_SIZE) {
                setRolePlayerAvatarError("File size is larger than 2MB");
            } else {
                setRolePlayerAvatarError("");
                setRolePlayerAvatar(e.target.files[0]);
            }
        }
    };

    const onSubmit = (data: TFormData) => {
        setError("");

        const botProfile = chatProfiles.find((profile) => profile.id === selectedId);

        if (!botProfile) {
            setError("Please select a bot first!");
            return;
        }

        const formData = new FormData();
        rolePlayerAvatar && formData.append("rolePlayerAvatar", rolePlayerAvatar);
        formData.append("botAvatar", botProfile.botAvatar);
        formData.append("rolePlayerName", data.rolePlayerName);
        formData.append(
            "rolePlayerGender",
            data.rolePlayerGender === "other" ? data.rolePlayerGenderOther : data.rolePlayerGender
        );
        formData.append("botName", botProfile.botName);
        formData.append("botGender", botProfile.botGender);
        formData.append("botDescription", botProfile.botDescription);
        formData.append("botPersonalitySummary", botProfile.botPersonalitySummary);
        formData.append("chatScenario", botProfile.chatScenario);
        formData.append("botFirstMessage", botProfile.botFirstMessage);
        formData.append("chatExample", botProfile.chatExample);

        axiosReq
            .post("/chats", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                toast.success("Successfully created profile!");
                setIsCreateUserModalOpen(false);
                router.push(`/chat/messages?chatId=${res.data.chatId}`);
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
                let modifiedProfiles = profiles?.filter((item) => item.id !== deleteChatId);
                initProfiles(modifiedProfiles || []);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <React.Fragment>
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
            <Modal
                state={isCreateUserModalOpen}
                closeHandler={() => setIsCreateUserModalOpen(false)}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full"
                >
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-5 text-center">
                        User Profile
                    </h4>
                    <div className="space-y-4">
                        <div className="uploadbox">
                            <label htmlFor="" className="label font-semibold">
                                User Avatar
                            </label>
                            <div className="upload text-center">
                                <label htmlFor="rolePlayerAvatar" className="text-center">
                                    <div className="relative align-middle inline-flex overflow-hidden h-24 w-24 justify-center items-center rounded-md border dark:border-border border-borderlight">
                                        {rolePlayerAvatar ? (
                                            <React.Fragment>
                                                {typeof rolePlayerAvatar === "string" ? (
                                                    <Image
                                                        src={rolePlayerAvatar}
                                                        alt="image"
                                                        fill
                                                    />
                                                ) : (
                                                    <Image
                                                        src={URL.createObjectURL(rolePlayerAvatar)}
                                                        alt="image"
                                                        fill
                                                    />
                                                )}
                                            </React.Fragment>
                                        ) : (
                                            <HiPhoto className="text-xl text-bodylight dark:text-body" />
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        name="rolePlayerAvatar"
                                        id="rolePlayerAvatar"
                                        className="!hidden"
                                        accept="image/*"
                                        onChange={handleRolePlayerAvatarUpload}
                                    />
                                </label>
                                {rolePlayerAvatarError && (
                                    <p className="message text-red-500 mt-2">
                                        {rolePlayerAvatarError}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="inputbox">
                            <label htmlFor="" className="label font-semibold">
                                Name
                                <p className="text-xs font-normal opacity-70 -mt-1">
                                    Your name. Default is your profile username.
                                </p>
                            </label>
                            <input
                                type="text"
                                placeholder=""
                                {...register("rolePlayerName", {
                                    required: {
                                        value: true,
                                        message: "Name is required",
                                    },
                                })}
                            />
                            {errors.rolePlayerName?.message && (
                                <p className="message text-red-500 mt-2">
                                    {errors.rolePlayerName.message}
                                </p>
                            )}
                        </div>
                        <div className="inputbox">
                            <label htmlFor="" className="label font-semibold">
                                Gender
                                <p className="text-xs font-normal opacity-70 -mt-1">
                                    Select your gender. If select others, write down in the inputbox
                                    below.
                                </p>
                            </label>
                            <select
                                {...register("rolePlayerGender", {
                                    required: {
                                        value: true,
                                        message: "Your gender is required",
                                    },
                                })}
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.rolePlayerGender?.message && (
                                <p className="message text-red-500 mt-2">
                                    {errors.rolePlayerGender.message}
                                </p>
                            )}
                        </div>
                        {watchRolePlayerGender === "other" && (
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    What is your gender?
                                </label>
                                <input
                                    type="text"
                                    placeholder="Write your gender here."
                                    {...register("rolePlayerGenderOther", {
                                        required: {
                                            value: watchRolePlayerGender === "other",
                                            message: "Your gender is required",
                                        },
                                    })}
                                />
                                {errors.rolePlayerGenderOther?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.rolePlayerGenderOther.message}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="form-footer">
                            <div className="text-center mt-8">
                                <button type="submit" className="btn">
                                    Create
                                </button>
                            </div>
                            {error ? (
                                <p className="message text-red-500 mt-2 text-center">{error}</p>
                            ) : null}
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal state={isImportModalOpen} closeHandler={() => setIsImportModalOpen(false)}>
                <div className="max-w-3xl border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <h4 className="text-xl font-semibold text-black dark:text-white mb-5 text-center">
                        Enter Import URL
                    </h4>
                    <div className="inputbox">
                        <input
                            type="text"
                            placeholder="Enter your URL here..."
                            value={importUrl}
                            onChange={(e) => setImportUrl(e.target.value)}
                        />
                    </div>
                    <div className="text-center mt-4">
                        <Link href={`/chat/create?importUrl=${importUrl}`} className="btn">
                            Import
                        </Link>
                    </div>
                    <div className="description mt-8">
                        <h5 className="text-xl text-black dark:text-white font-medium">
                            Supported sites :
                        </h5>
                        <ul className="styledlist mt-3">
                            <li>
                                <a
                                    href="https://www.chub.ai/characters"
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="hover:underline hover:text-primary"
                                >
                                    chub.ai
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </Modal>
            <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-center text-4xl font-bold text-black dark:text-white mb-10">
                        Chat Profiles
                    </h2>
                    {!profiles?.length ? (
                        <CustomMessage msg="You do not have any profiles yet. Create one below." />
                    ) : null}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        {profiles?.map((profile) => (
                            <div
                                key={profile.id}
                                className="single group relative bg-gray-200 dark:bg-[#111122] bg-opacity-80 text-center overflow-hidden align-middle rounded-md border border-black border-opacity-50 dark:border-border dark:border-opacity-100"
                            >
                                <div className="avatar relative z-10 transition-all text-black dark:text-white hover:border-primary hover:text-primary inline-flex justify-center font-bold items-center uppercase overflow-hidden grow-0 shrink-0 aspect-square w-full align-middle">
                                    {profile.botAvatar && profile.botAvatar !== "null" ? (
                                        <Image
                                            src={profile.botAvatar}
                                            alt={profile.botName}
                                            className="h-full w-full"
                                            fill
                                        />
                                    ) : (
                                        <span className="select-none text-6xl">
                                            {profile.botName.trim()[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="content px-4 py-8 absolute flex flex-col justify-center items-center inset-0 h-full w-full bg-black bg-opacity-80 z-20 transition-all duration-500 translate-y-full group-hover:translate-y-0">
                                    <h4 className="text-2xl font-semibold text-white">
                                        {profile.botName}
                                    </h4>
                                    <p className="text-white">
                                        Last chat:{" "}
                                        <strong>
                                            {formatDistanceToNow(new Date(profile.lastChatAt))} ago
                                        </strong>
                                    </p>
                                    <div className="flex justify-center flex-wrap gap-3 mt-6">
                                        <Link
                                            title="Continue Chat"
                                            href={`/chat/messages?chatId=${profile.id}`}
                                            className="text-white dark:text-white h-10 w-10 border border-white dark:border-white rounded-md inline-flex text-lg justify-center items-center hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary"
                                        >
                                            <HiOutlineChatBubbleLeftRight />
                                        </Link>
                                        <button
                                            title="Delete"
                                            className="text-white dark:text-white h-10 w-10 border border-white dark:border-white rounded-md inline-flex text-lg justify-center items-center hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary"
                                            onClick={() => {
                                                setDeleteChatId(profile.id);
                                                setIsDeleteChatModalOpen(true);
                                            }}
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <br />
                    <br />
                    <br />
                    <h2 className="text-center text-4xl font-bold text-black dark:text-white mb-10">
                        Create Profiles
                    </h2>
                    {!chatProfiles?.length ? (
                        <p className="text-center text-yellow-500">There is no items</p>
                    ) : null}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
                        <div className="single bg-gray-200 dark:bg-[#111122] bg-opacity-80 px-4 py-8 rounded-lg border border-borderlight dark:border-border border-opacity-30 space-y-3 text-center">
                            <Link
                                href="/chat/create"
                                className="relative inline-flex overflow-hidden h-20 w-20 justify-center items-center rounded-md border dark:border-border border-borderlight"
                            >
                                <HiPlus className="text-4xl" />
                            </Link>
                            <h4 className="text-2xl font-semibold text-black dark:text-white">
                                Custom Profile
                            </h4>
                            <div className="inline-flex flex-wrap gap-3 !mt-6">
                                <Link href="/chat/create" className="btn btn-sm">
                                    Create Now
                                </Link>
                            </div>
                        </div>
                        <div className="single bg-gray-200 dark:bg-[#111122] bg-opacity-80 px-4 py-8 rounded-lg border border-borderlight dark:border-border border-opacity-30 space-y-3 text-center">
                            <button
                                className="relative inline-flex overflow-hidden h-20 w-20 justify-center items-center rounded-md border dark:border-border border-borderlight"
                                onClick={() => setIsImportModalOpen(true)}
                            >
                                <HiArrowDownTray className="text-4xl" />
                            </button>
                            <h4 className="text-2xl font-semibold text-black dark:text-white">
                                Import Profile
                            </h4>
                            <div className="inline-flex flex-wrap gap-3 !mt-6">
                                <button
                                    className="btn btn-sm"
                                    onClick={() => setIsImportModalOpen(true)}
                                >
                                    Import Now
                                </button>
                            </div>
                        </div>
                        {chatProfiles.map((profile) => (
                            <div
                                key={profile.id}
                                className="single group relative bg-gray-200 dark:bg-[#111122] bg-opacity-80 text-center overflow-hidden align-middle rounded-md border border-black border-opacity-50 dark:border-border dark:border-opacity-100"
                            >
                                <div className="avatar relative z-10 transition-all text-black dark:text-white hover:border-primary hover:text-primary inline-flex justify-center font-bold items-center uppercase overflow-hidden grow-0 shrink-0 aspect-square w-full align-middle">
                                    {profile.botAvatar && profile.botAvatar !== "null" ? (
                                        <Image
                                            src={profile.botAvatar}
                                            alt={profile.botName}
                                            className="h-full w-full"
                                            fill
                                        />
                                    ) : (
                                        <span className="select-none text-6xl">
                                            {profile.botName.trim()[0]}
                                        </span>
                                    )}
                                </div>
                                <div className="content px-4 py-8 absolute flex flex-col justify-center items-center inset-0 h-full w-full bg-black bg-opacity-80 z-20 transition-all duration-500 translate-y-full group-hover:translate-y-0">
                                    <h4 className="text-2xl font-semibold text-white">
                                        {profile.botName}
                                    </h4>
                                    <div className="flex justify-center flex-wrap gap-3 mt-6">
                                        <button
                                            title="Chat Now"
                                            className="text-white dark:text-white h-10 w-10 border border-white dark:border-white rounded-md inline-flex text-lg justify-center items-center hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary"
                                            onClick={() => {
                                                setSelectedId(profile.id);
                                                setIsCreateUserModalOpen(true);
                                            }}
                                        >
                                            <HiOutlineChatBubbleLeftRight />
                                        </button>
                                        <Link
                                            title="Customize"
                                            href={`/chat/create?id=${profile.id}`}
                                            className="text-white dark:text-white h-10 w-10 border border-white dark:border-white rounded-md inline-flex text-lg justify-center items-center hover:border-primary dark:hover:border-primary hover:text-primary dark:hover:text-primary"
                                        >
                                            <FiEdit />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </React.Fragment>
    );
};

export default ChatPage;

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
