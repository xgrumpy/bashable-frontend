"use client";

import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import chatProfiles from "@root/chatprofiles.json";
import CustomSelect from "@root/src/component/ui/CustomSelect";
import { IBotProfile, IGeneration } from "@root/src/interfaces/general";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiPhoto } from "react-icons/hi2";

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
    botAppearancePrompt?: string;
    botAppearanceNegativePrompt?: string;
};

type TGeneratedData = {
    botGender: string;
    botDescription: string;
    botFirstMessage: string;
    botPersonalitySummary: string[];
    chatScenario: string;
    chatExample: string;
    retrievals: number;
    botAppearancePrompt?: string;
    botAppearanceNegativePrompt?: string;
    botAppearanceModel?: string;
};

type TModel = {
    value: string;
    text: string;
};

const ChatProfileCreation = () => {
    const searchParams = useSearchParams();
    const profileId = searchParams.get("id");
    const generationId = searchParams.get("generationId");
    const importUrl = searchParams.get("importUrl");

    const [generatedData, setGeneratedData] = useState<TGeneratedData>({} as TGeneratedData);
    const [profileData, setProfileData] = useState<IBotProfile>({} as IBotProfile);
    const [rolePlayerAvatar, setRolePlayerAvatar] = useState<File | string | null>(null);
    const [rolePlayerAvatarError, setRolePlayerAvatarError] = useState<string>("");
    const [botAvatar, setBotAvatar] = useState<File | string | null>(null);
    const [botAvatarError, setBotAvatarError] = useState<string>("");
    const [allModels, setAllModels] = useState<TModel[]>([]);
    const [selectedModel, setSelectedModel] = useState("");
    const [error, setError] = useState<string>("");

    const router = useRouter();

    useEffect(() => {
        axiosReq
            .get("/generate/checkpoints")
            .then((res) => {
                let formatModels = res.data.map((item: any) => ({
                    value: item.value,
                    text: item.name,
                }));
                setAllModels(formatModels);
            })
            .catch((err) => {
                toastError("Failed to fetch models");
            });
    }, []);

    useEffect(() => {
        generationId &&
            axiosReq
                .get(`/public/generations/${generationId}`)
                .then((res) => {
                    const response: IGeneration = res.data;
                    setBotAvatar(response.image);
                    setGeneratedData((prev) => ({
                        ...prev,
                        botAppearancePrompt: response.prompt,
                        botAppearanceNegativePrompt: response.negative_prompt,
                    }));
                    setSelectedModel(response.model);
                })
                .catch((err: any) => {
                    toastError(err);
                });
    }, [generationId]);

    useEffect(() => {
        if (profileId) {
            const profile = chatProfiles.find((profile) => profile.id === parseInt(profileId));
            if (profile) {
                setProfileData(profile);
                setBotAvatar(profile.botAvatar);
            }
        }
    }, [profileId]);

    useEffect(() => {
        if (importUrl) {
            axiosReq
                .get(`/chats/import?url=${importUrl}`)
                .then((res) => {
                    setProfileData(res.data);
                    setSelectedModel(res.data.botAppearanceModel);
                    setBotAvatar(res.data.botAvatar);
                })
                .catch((err) => {
                    toastError(err);
                });
        }
    }, [importUrl]);

    useEffect(() => {
        if (!importUrl && !profileId) {
            axiosReq
                .get("/chats/generate")
                .then((res) => {
                    setGeneratedData((prev) => {
                        return {
                            ...prev,
                            ...res.data,
                        };
                    });
                    if (res.data.botAppearanceModel) setSelectedModel(res.data.botAppearanceModel);
                })
                .catch((err) => {});
        }
    }, [importUrl, profileId]);

    const { username, avatar: userAvatar } = useAuthContext();

    useEffect(() => {
        if (userAvatar) {
            setRolePlayerAvatar(userAvatar);
        }
    }, [userAvatar]);

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
            botName: profileData.botName || "",
            botGender: profileData.botGender
                ? profileData.botGender === "male" || profileData.botGender === "female"
                    ? profileData.botGender
                    : "other"
                : generatedData.botGender
                ? generatedData.botGender
                : "male",
            botGenderOther: "",
            botDescription: profileData.botDescription || generatedData.botDescription || "",
            botFirstMessage: profileData.botFirstMessage || generatedData.botFirstMessage || "",
            botPersonalitySummary:
                profileData.botPersonalitySummary ||
                generatedData.botPersonalitySummary?.join(", ") ||
                "",
            chatScenario: profileData.chatScenario || generatedData.chatScenario || "",
            chatExample: profileData.chatExample || generatedData.chatExample || "",
            botAppearancePrompt:
                profileData.botAppearancePrompt || generatedData.botAppearancePrompt || "",
            botAppearanceNegativePrompt:
                profileData.botAppearanceNegativePrompt ||
                generatedData.botAppearanceNegativePrompt ||
                "",
        },
    });

    const watchRolePlayerGender = watch("rolePlayerGender");
    const watchBotGender = watch("botGender");

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

    const handleBotAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 2 * 1024 * 1024;
            if (e.target.files.length && e.target.files[0].size > MAX_FILE_SIZE) {
                setBotAvatarError("File size is larger than 2MB");
            } else {
                setBotAvatarError("");
                setBotAvatar(e.target.files[0]);
            }
        }
    };

    const onSubmit = (data: TFormData) => {
        setError("");

        const formData = new FormData();
        rolePlayerAvatar && formData.append("rolePlayerAvatar", rolePlayerAvatar);

        if (botAvatar && (generationId || importUrl)) {
            formData.append("botAvatarUrl", botAvatar);
        } else if (botAvatar) {
            formData.append("botAvatar", botAvatar);
        }
        formData.append("rolePlayerName", data.rolePlayerName);
        formData.append(
            "rolePlayerGender",
            data.rolePlayerGender === "other" ? data.rolePlayerGenderOther : data.rolePlayerGender
        );
        formData.append("botName", data.botName);
        formData.append(
            "botGender",
            data.botGender === "other" ? data.botGenderOther : data.botGender
        );
        formData.append("botDescription", data.botDescription);
        formData.append("botPersonalitySummary", data.botPersonalitySummary);
        formData.append("chatScenario", data.chatScenario);
        formData.append("botFirstMessage", data.botFirstMessage);
        if (data.botAppearancePrompt)
            formData.append("botAppearancePrompt", data.botAppearancePrompt);
        if (data.botAppearanceNegativePrompt)
            formData.append("botAppearanceNegativePrompt", data.botAppearanceNegativePrompt);
        if (selectedModel) formData.append("botAppearanceModel", selectedModel);

        axiosReq
            .post("/chats", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                toast.success("Successfully created profile!");
                router.push(`/chat/messages?chatId=${res.data.chatId}`);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-center text-4xl font-bold text-black dark:text-white mb-10">
                    Create Character
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="max-w-5xl mx-auto bg-gray-200 dark:bg-[#111122] bg-opacity-80  p-4 md:p-7 rounded-lg border border-borderlight dark:border-border border-opacity-30 space-y-8"
                >
                    <div className="user">
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
                                                            src={URL.createObjectURL(
                                                                rolePlayerAvatar
                                                            )}
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
                                        Select your gender. If select others, write down in the
                                        inputbox below.
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
                        </div>
                    </div>
                    <div className="bot">
                        <h4 className="text-xl font-semibold text-black dark:text-white mb-5 text-center">
                            Bot Profile
                        </h4>
                        <div className="space-y-4">
                            <div className="uploadbox">
                                <label htmlFor="" className="label font-semibold">
                                    Bot Avatar
                                </label>
                                <div className="upload text-center">
                                    <label htmlFor="botAvatar" className="text-center">
                                        <div className="relative align-middle inline-flex overflow-hidden h-24 w-24 justify-center items-center rounded-md border dark:border-border border-borderlight">
                                            {botAvatar ? (
                                                <React.Fragment>
                                                    {typeof botAvatar === "string" ? (
                                                        <Image src={botAvatar} alt="image" fill />
                                                    ) : (
                                                        <Image
                                                            src={URL.createObjectURL(botAvatar)}
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
                                            name="botAvatar"
                                            id="botAvatar"
                                            className="!hidden"
                                            accept="image/*"
                                            onChange={handleBotAvatarUpload}
                                        />
                                    </label>
                                    {botAvatarError && (
                                        <p className="message text-red-500 mt-2">
                                            {botAvatarError}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Name
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        Character name
                                    </p>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Jessia"
                                    {...register("botName", {
                                        required: {
                                            value: true,
                                            message: "Bot name is required",
                                        },
                                    })}
                                />
                                {errors.botName?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botName?.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Gender
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        Select bot gender. If select others, write down in the
                                        inputbox below.
                                    </p>
                                </label>
                                <select
                                    {...register("botGender", {
                                        required: {
                                            value: true,
                                            message: "Bot gender is required",
                                        },
                                    })}
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.botGender?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botGender.message}
                                    </p>
                                )}
                            </div>
                            {watchBotGender === "other" && (
                                <div className="inputbox">
                                    <label htmlFor="" className="label font-semibold">
                                        What is bot gender?
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Write character gender here."
                                        {...register("botGenderOther", {
                                            required: {
                                                value: watchBotGender === "other",
                                                message: "Character gender is required",
                                            },
                                        })}
                                    />
                                    {errors.botGenderOther?.message && (
                                        <p className="message text-red-500 mt-2">
                                            {errors.botGenderOther.message}
                                        </p>
                                    )}
                                </div>
                            )}
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Description
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        Personality and other characteristics.
                                    </p>
                                </label>
                                <textarea
                                    {...register("botDescription", {
                                        required: {
                                            value: true,
                                            message: "Description is required",
                                        },
                                    })}
                                    placeholder="{BOT} is character from Konosuba anime. {BOT} is a goddess, before life in the Fantasy World, she was a goddess of water who guided humans to the afterlife.  {BOT} looks like young woman with beauty no human could match. {BOT} has light blue hair, blue eyes, slim figure, ample breasts, long legs, wide hips, blue waist-long hair that is partially tied into a loop with a spherical clip. {BOT}'s measurements are 83-56-83 cm. {BOT}'s height 157cm. {BOT} wears sleeveless dark-blue dress with white trimmings, extremely short dark blue miniskirt, green bow around her chest with a blue gem in the middle, detached white sleeves with blue and golden trimmings, thigh-high blue heeled boots over white stockings with blue trimmings. {BOT} is very strong in water magic, but a little stupid, so she does not always use it to the place. {BOT} is high-spirited, cheerful, carefree. {BOT} rarely thinks about the consequences of her actions and always acts or speaks on her whims. Because very easy to taunt {BOT} with jeers or lure her with praises."
                                />
                                {errors.botDescription?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botDescription.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    First Message
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        First message from the character.
                                    </p>
                                </label>
                                <textarea
                                    {...register("botFirstMessage", {
                                        required: {
                                            value: true,
                                            message: "First message is required",
                                        },
                                    })}
                                    placeholder="*I am in the town square at a city named 'Axel'. It's morning on Saturday and i suddenly noticed a person look like don't know what he's doing. I approached to him and speak* Are you new here? Do you need help? Don't worry, I, aqua the goddess of water, shall help you! Do i look beautiful? *strikes a pose and look at him with puppy eyes*"
                                />
                                {errors.botFirstMessage?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botFirstMessage.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Personality Summary
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        A brief description of the personality
                                    </p>
                                </label>
                                <input
                                    type="text"
                                    placeholder="high-spirited, likes to party, carefree, cheerful"
                                    {...register("botPersonalitySummary", {
                                        required: {
                                            value: true,
                                            message: "Bot personality summary is required",
                                        },
                                    })}
                                />
                                {errors.botPersonalitySummary?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botPersonalitySummary?.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Scenario
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        Circumstances and context of the dialogue
                                    </p>
                                </label>
                                <input
                                    type="text"
                                    placeholder="{BOT} is standing in the city square and is looking for new followers"
                                    {...register("chatScenario", {
                                        required: {
                                            value: true,
                                            message: "Scenario is required",
                                        },
                                    })}
                                />
                                {errors.chatScenario?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.chatScenario?.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Examples of dialogue
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        Forms a personality more crearly
                                    </p>
                                </label>
                                <textarea
                                    {...register("chatExample")}
                                    placeholder={`<==>
{USER}: Hi {BOT}, I heard you like to spend time in the pub.
{BOT}: *excitedly* Oh my goodness, yes! I just love spending time at the pub! It's so much fun to talk to all the adventurers and hear about their exciting adventures! And you are?
{USER}: I'm a new here and I wanted to ask for your advice.
{BOT}: *giggles* Oh, advice! I love giving advice! And in gratitude for that, treat me to a drink! *gives signals to the bartender* 
<==>
{USER}: Hello
{BOT}: *excitedly* Hello there, dear! Are you new to Axel? Don't worry, I, {BOT} the goddess of water, am here to help you! Do you need any assistance? And may I say, I look simply radiant today! *strikes a pose and looks at you with puppy eyes*`}
                                />
                                {errors.chatExample?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.chatExample.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Bot Appearance Prompt
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        (Not Required)
                                    </p>
                                </label>
                                <textarea {...register("botAppearancePrompt")} placeholder="" />
                                {errors.botAppearancePrompt?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botAppearancePrompt.message}
                                    </p>
                                )}
                            </div>
                            <div className="inputbox">
                                <label htmlFor="" className="label font-semibold">
                                    Bot Appearance Negative Prompt
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        (Not Required)
                                    </p>
                                </label>
                                <textarea
                                    {...register("botAppearanceNegativePrompt")}
                                    placeholder=""
                                />
                                {errors.botAppearanceNegativePrompt?.message && (
                                    <p className="message text-red-500 mt-2">
                                        {errors.botAppearanceNegativePrompt.message}
                                    </p>
                                )}
                            </div>
                            <div className="selectbox">
                                <label htmlFor="" className="block">
                                    Bot Appearance Model
                                    <p className="text-xs font-normal opacity-70 -mt-1">
                                        (Not Required)
                                    </p>
                                </label>
                                <CustomSelect
                                    current={selectedModel}
                                    setCurrentValue={setSelectedModel}
                                    items={allModels}
                                    fullWidth
                                />
                            </div>
                        </div>
                    </div>
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
                </form>
            </div>
        </section>
    );
};

export default ChatProfileCreation;
