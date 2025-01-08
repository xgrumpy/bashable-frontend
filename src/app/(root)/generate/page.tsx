"use client";

import Modal from "@/component/shared/Modal";
import CustomSelect from "@/component/ui/CustomSelect";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { IGeneration } from "@/interfaces/general";
import settings from "@/settings";
import { stateLastGeneration } from "@/state/LastGenerationState";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { readImageFile } from "@/utils/utils";
import _ from "lodash";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ChangeEvent,
    FocusEvent,
    KeyboardEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { HiChevronDown, HiChevronUp, HiOutlineArrowSmallRight, HiPhoto } from "react-icons/hi2";
import { RiDeleteBin3Line, RiLoader4Line } from "react-icons/ri";
import { useRecoilState } from "recoil";
import RecentCreations from "../components/RecentCreations";
import GenerationResults, { TResult } from "./components/GenerationResults";
import ModelSelection from "./components/ModelSelection";
import PrivateModeController from "./components/PrivateModeController";
import PromptBox from "./components/PromptBox";
import Timer from "./components/Timer";

interface FormValues {
    negative_prompt: string;
    steps: number;
    seed: number;
    cfg_scale: number;
    size?: string;
    image?: string;
    module: string;
    preprocessor?: boolean;
}

export interface IModel {
    name: string;
    thumbnail: string;
    value: string;
    restricted: boolean;
}

interface IControlnet {
    name: string;
    value: string;
}

export default function Generate() {
    const searchParams = useSearchParams();
    const generationId = searchParams.get("generationId");
    const promptFromUrl = searchParams.get("prompt") || "";
    const negativePromptFromUrl = searchParams.get("negative_prompt") || "";
    const modelFromUrl = searchParams.get("model") || "";

    const refSubmitBtn = useRef<HTMLButtonElement>(null);
    const uploadboxInputRef = useRef<HTMLInputElement>(null);

    const [isModelSelectModalOpen, setIsModelSelectModalOpen] = useState<boolean>(false);
    const [isRestrictedPopupOpen, setIsRestrictedPopupOpen] = useState<boolean>(false);
    const [isRestrictedModelOpen, setIsRestrictedModelOpen] = useState<boolean>(false);
    const [isRegenerateRestrictedModelOpen, setIsRegenerateRestrictedModelOpen] =
        useState<boolean>(false);
    const [isEnoughCreditsPopupOpen, setIsEnoughCreditsPopupOpen] = useState<boolean>(false);
    const [isFreeUserPopupOpen, setIsFreeUserPopupOpen] = useState<boolean>(false);
    const [isLimitReachedPopupOpen, setIsLimitReachedPopupOpen] = useState<boolean>(false);
    const [isIllegalPopupOpen, setIsIllegalPopupOpen] = useState<boolean>(false);
    const [isIpBlockedPopupOpen, setIsIpBlockedPopupOpen] = useState<boolean>(false);
    const [isUserBannedPopupOpen, setIsUserBannedPopupOpen] = useState<boolean>(false);
    const [isSameGenerationPopup, setIsSameGenerationPopup] = useState<boolean>(false);

    const [prevParams, setPrevParams] = useState<IGeneration>({} as IGeneration);

    const [promptText, setPromptText] = useState<string>("");
    const [models, setModels] = useState<IModel[]>([]);
    const [privateMode, setPrivateMode] = useState<boolean>(false);
    const [slectedModel, setSlectedModel] = useState<string>("");
    const [selectedSampler, setSelectedSampler] = useState<string>("Euler a");

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>("");
    const [warning, setWarning] = useState<string>("");
    const [generationText, setGenerationText] = useState<string[]>([]);
    const [resultImages, setResultImages] = useState<TResult[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string>("");
    const [uploadedImageError, setUploadedImageError] = useState<string>("");

    const [estimatedCost, setEstimatedCost] = useState(0);

    const [advancedOptionOpen, setAdvancedOptionOpen] = useState<boolean>(false);

    const { GENERATION_SIZES, CONTROLNET_ITEMS, DEFAULT_MODEL_VALUE } = settings;
    const { username, credits, unrestricted, autoRecharge, updateCredits } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();
    const [lastGenerationState, setLastGenerationState] = useRecoilState(stateLastGeneration);

    const handleKeyDownGenerate = (ev: KeyboardEvent) => {
        if (ev.ctrlKey && ev.key === "Enter") {
            refSubmitBtn.current?.click();
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDownGenerate as any);
        return () => {
            document.removeEventListener("keydown", handleKeyDownGenerate as any);
        };
    }, []);

    useEffect(() => {
        if (username && credits <= 0 && !autoRecharge) {
            setIsEnoughCreditsPopupOpen(true);
        }
    }, [username, credits, autoRecharge]);

    useEffect(() => {
        generationId &&
            axiosReq
                .get(`/public/generations/${generationId}`)
                .then((res) => {
                    setPromptText(res.data.prompt);
                    setPrevParams({
                        ...res.data,
                        size: `${res.data.width}*${res.data.height}`,
                    });
                })
                .catch((err: any) => {
                    if (err.response?.data?.restricted_prompt) {
                        setIsRestrictedPopupOpen(true);
                    } else if (err.response?.data?.restricted_model) {
                        setIsRegenerateRestrictedModelOpen(true);
                    } else {
                        toastError(err);
                    }
                });
    }, [generationId]);

    useEffect(() => {
        setPromptText(prevParams.prompt);
    }, [prevParams.prompt]);

    useEffect(() => {
        setPromptText(promptFromUrl);
    }, [promptFromUrl]);

    useEffect(() => {
        if (prevParams.sampler) {
            setSelectedSampler(prevParams.sampler);
        }
    }, [prevParams.sampler]);

    useEffect(() => {
        axiosReq.get("/generate/checkpoints").then((res) => {
            setModels(res.data);
            if (prevParams.model || modelFromUrl) {
                let findRegenerationModel: IModel = res.data.find(
                    (item: IModel) => item.value === (prevParams.model || modelFromUrl)
                );

                if (findRegenerationModel.restricted && !unrestricted) {
                    setIsRestrictedModelOpen(true);
                    setSlectedModel(DEFAULT_MODEL_VALUE);
                } else {
                    setSlectedModel(prevParams.model || modelFromUrl);
                }
            } else {
                setSlectedModel(DEFAULT_MODEL_VALUE);
            }
        });
    }, [modelFromUrl, prevParams.model, DEFAULT_MODEL_VALUE, unrestricted]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<FormValues>({
        values: {
            steps: prevParams.steps || 20,
            negative_prompt: prevParams.negative_prompt || negativePromptFromUrl || "",
            seed: prevParams.seed || -1,
            cfg_scale: prevParams.cfg_scale || 7,
            size: prevParams.size || GENERATION_SIZES[0].value,
            module: "none",
            preprocessor: false,
        },
    });

    const watchStepCount = watch("steps");
    const watchCfgScale = watch("cfg_scale");
    const watchPreprocessor = watch("preprocessor");
    const watchModule = watch("module");
    const watchSize = watch("size");

    useEffect(() => {
        let values = {
            width: watchSize ? parseInt(watchSize.split("*")[0].trim()) : 0,
            height: watchSize ? parseInt(watchSize.split("*")[1].trim()) : 0,
            steps: watchStepCount,
        };
        axiosReq
            .get(
                `/generate/cost?width=${values.width}&height=${values.height}&steps=${values.steps}`
            )
            .then((res) => {
                setEstimatedCost(privateMode ? res.data.cost * 1.2 : res.data.cost);
            })
            .catch((err) => {
                toastError(err);
            });
    }, [watchSize, watchStepCount, privateMode]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 2 * 1024 * 1024;
            if (e.target.files[0].size > MAX_FILE_SIZE) {
                setUploadedImageError("File size is larger than 2MB");
            } else {
                setUploadedImageError("");
                let img = e.target.files[0];
                const base64Image = img ? await readImageFile(img) : "";
                setUploadedImage(base64Image);
            }
        }
    };

    const handleImageFieldClear = (e: SyntheticEvent) => {
        e.preventDefault();
        if (uploadboxInputRef?.current?.value) {
            uploadboxInputRef.current.value = "";
        }
        setUploadedImage("");
    };

    const generateRequest = async (data: FormValues) => {
        if (!slectedModel) {
            setError("Model is required");
            return;
        }

        if (!selectedSampler) {
            setError("Sampler is required");
            return;
        }

        if (!promptText) {
            setError("Prompt text is required");
            return;
        }
        const values = {
            ...data,
            sampler: selectedSampler,
            prompt: promptText,
            width: data?.size
                ? parseInt(data.size.split("*")[0].trim())
                : parseInt(GENERATION_SIZES[0].value.split("*")[0].trim()),
            height: data?.size
                ? parseInt(data.size.split("*")[1].trim())
                : parseInt(GENERATION_SIZES[0].value.split("*")[1].trim()),
            model: slectedModel,
            private: privateMode,
        };

        delete values.size;

        if (values.seed !== -1 && _.isEqual(lastGenerationState, values)) {
            setIsSameGenerationPopup(true);
            return;
        }

        setResultImages([]);
        setGenerationText([]);
        setError(null);
        setIsLoading(true);

        axiosReq
            .post("/generate", {
                ...values,
                image: uploadedImage.replace("application/octet-stream", "image/png") || null,
            })
            .then((res) => {
                localStorage.setItem("last-generation-state", JSON.stringify(values));
                setLastGenerationState(values);
                updateCredits({ credits: res.data.cost });
                setResultImages(res.data.generations);
                if (res.data.response && res.data.response.length) {
                    setGenerationText(res.data.response);
                } else {
                    setGenerationText([]);
                }
                if (generationId) {
                    axiosReq
                        .get(`/public/generations/${generationId}/regenerate`)
                        .then((res) => {
                            return;
                        })
                        .catch((err) => {
                            toastError(err);
                        });
                }
            })
            .catch((err) => {
                const {
                    credit_limited,
                    free_limited,
                    restricted_prompt,
                    restricted_model,
                    illegal_prompt,
                    ip_banned,
                    user_banned,
                } = err.response.data;
                if (credit_limited) {
                    setIsEnoughCreditsPopupOpen(true);
                } else if (free_limited) {
                    setIsLimitReachedPopupOpen(true);
                } else if (restricted_prompt) {
                    setIsRestrictedPopupOpen(true);
                } else if (illegal_prompt) {
                    setIsIllegalPopupOpen(true);
                } else if (user_banned) {
                    setIsUserBannedPopupOpen(true);
                } else if (ip_banned) {
                    setIsIpBlockedPopupOpen(true);
                } else if (restricted_model) {
                    setIsRestrictedModelOpen(true);
                } else {
                    setError(err.response.data.message);
                    toastError(err);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        if (!username) {
            setIsFreeUserPopupOpen(true);
            setTimeout(() => {
                setIsFreeUserPopupOpen(false);
                generateRequest(data);
            }, 10000);
        } else {
            generateRequest(data);
        }
    };

    const handleModelBox = (event: SyntheticEvent) => {
        event.preventDefault();
        setIsModelSelectModalOpen(true);
    };

    const handleAdvanceOption = (event: SyntheticEvent) => {
        event.preventDefault();
        setAdvancedOptionOpen(!advancedOptionOpen);
    };

    const handleStepChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue("steps", parseInt(e.target.value));
    };

    const handleCfgScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue("cfg_scale", parseInt(e.target.value));
    };

    const handleSeedFix = (e: FocusEvent<HTMLInputElement>) => {
        if (parseInt(e.target.value) === 0) {
            setValue("seed", 0);
        } else if (!e.target.value) {
            setValue("seed", -1);
        } else {
            setValue("seed", parseInt(e.target.value));
        }
    };

    const handleSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== "512*512") {
            if (username) {
                setValue("size", e.target.value);
            } else {
                toastError("Please login to select this item.");
                setValue("size", "512*512");
            }
        } else {
            setValue("size", "512*512");
        }
    };

    const handleCreateFreeAccount = (e: SyntheticEvent) => {
        e.preventDefault();
        changeAuthBoxStatus("signup");
    };

    const handleCreateVariation = (value: string) => {
        setUploadedImage(value);
        setAdvancedOptionOpen(true);
        setValue("module", "none");
    };

    const handleWarning = (warning: string) => {
        setWarning(warning);
    };

    const handleSuggest = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .get("/generate/prompt")
            .then((res) => {
                setPromptText(res.data.prompt);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <Modal
                state={isRestrictedPopupOpen}
                closeHandler={() => setIsRestrictedPopupOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        {username ? (
                            <p>
                                Not what you were looking for? Please enable{" "}
                                <Link
                                    href="/account"
                                    className="underline hover:text-primary font-semibold"
                                >
                                    Restricted Mode
                                </Link>{" "}
                                to access restricted words and models. Learn more about{" "}
                                <Link
                                    href="/blogs/what-is-unrestricted-mode"
                                    className="underline hover:text-primary font-semibold"
                                >
                                    unresctricted mode.
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Please sign up to generate this kind of images and enjoy our
                                platform to the fullest.
                            </p>
                        )}
                        {!username ? (
                            <>
                                <br />
                                <button className="btn" onClick={handleCreateFreeAccount}>
                                    Create Free Account
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </Modal>
            <Modal
                state={isRestrictedModelOpen}
                closeHandler={() => setIsRestrictedModelOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        {username ? (
                            <p>
                                To use this type of model please enable{" "}
                                <Link
                                    href="/account"
                                    className="underline hover:text-primary font-semibold"
                                >
                                    unrestricted mode
                                </Link>
                                . Learn more about{" "}
                                <Link
                                    href="/blogs/what-is-unrestricted-mode"
                                    className="underline hover:text-primary font-semibold"
                                >
                                    unresctricted mode.
                                </Link>
                            </p>
                        ) : (
                            <p>
                                Please sign up to use this kind of model and enjoy our platform to
                                the fullest.
                            </p>
                        )}
                        {!username ? (
                            <>
                                <br />
                                <button className="btn" onClick={handleCreateFreeAccount}>
                                    Create Free Account
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </Modal>
            <Modal
                state={isRegenerateRestrictedModelOpen}
                closeHandler={() => setIsRegenerateRestrictedModelOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>
                            This prompt used a restricted model. To use this model, you must have an
                            account and enable{" "}
                            <Link
                                href="/blogs/what-is-unrestricted-mode"
                                className="underline hover:text-primary font-semibold"
                            >
                                unresctricted mode.
                            </Link>
                        </p>
                        {!username ? (
                            <>
                                <br />
                                <button className="btn" onClick={handleCreateFreeAccount}>
                                    Create Free Account
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </Modal>
            <Modal state={isIllegalPopupOpen} closeHandler={() => setIsIllegalPopupOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>Stop, you are trying to generate something that is Illegal.</p>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isSameGenerationPopup}
                closeHandler={() => setIsSameGenerationPopup(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-yellow-500 text-black py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>
                            It looks like you are using the same parameters with the same seed. This
                            will generate the exact same images again. If you would like to see
                            variations using the same prompt, consider setting the seed to -1 (under
                            Advanced Options) which will randomize the image generator and give you
                            a new batch
                        </p>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isFreeUserPopupOpen}
                closeHandler={() => setIsFreeUserPopupOpen(false)}
                nonClosable
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <Timer />
                        <p className="mt-5">
                            To skip the wait, and access restricted prompt words and models sign up
                            for a free account.
                        </p>
                        <br />
                        <button className="btn" onClick={handleCreateFreeAccount}>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isEnoughCreditsPopupOpen}
                closeHandler={() => setIsEnoughCreditsPopupOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <h5 className="text-2xl text-black dark:text-white font-semibold mb-2">
                            No more credits!
                        </h5>
                        <p>
                            <Link
                                href="/buy-credits"
                                className="underline hover:text-primary font-semibold"
                            >
                                Click here to buy credits
                            </Link>{" "}
                            or{" "}
                            <Link
                                href="/blogs/how-to-earn-credits!"
                                className="underline hover:text-primary font-semibold"
                            >
                                Earn more!
                            </Link>
                        </p>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isLimitReachedPopupOpen}
                closeHandler={() => setIsLimitReachedPopupOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <h5 className="text-2xl text-black dark:text-white font-semibold mb-2">
                            25 generations limit reached
                        </h5>
                        <p className="mb-4">
                            To continue generating for free (and access restricted models), create
                            an account.
                        </p>
                        <button className="btn" onClick={handleCreateFreeAccount}>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal state={isIpBlockedPopupOpen} closeHandler={() => setIsIpBlockedPopupOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p className="mb-4">
                            This IP has been blocked. If you feel this was a mistake and would like
                            a review, please{" "}
                            <Link
                                href="/blogs/how-do-i-contact-support"
                                className="underline hover:text-primary font-semibold"
                            >
                                contact the support.
                            </Link>
                        </p>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isUserBannedPopupOpen}
                closeHandler={() => setIsUserBannedPopupOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>
                            This account is currently suspended due to creation of content deemed
                            illegal. if you would like for us to consider re-activating the account,
                            please{" "}
                            <Link
                                href="/blogs/how-do-i-contact-support"
                                className="underline hover:text-primary font-semibold"
                            >
                                contact support
                            </Link>{" "}
                            for a review.
                        </p>
                    </div>
                </div>
            </Modal>
            <ModelSelection
                state={isModelSelectModalOpen}
                closeHandler={() => setIsModelSelectModalOpen(false)}
                models={models}
                slectedModel={slectedModel}
                setSlectedModel={setSlectedModel}
                restrictedPopupOpener={() => setIsRestrictedModelOpen(true)}
            />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                            <aside className="col-span-1 lg:col-span-4">
                                <div className="bg-white dark:bg-dark rounded-lg px-3 sm:px-5 py-8 border border-borderlight dark:border-border">
                                    <h3 className="text-2xl text-black dark:text-white font-semibold mb-8">
                                        Generate Images
                                        <span className="block h-0.5 rounded-full w-20 bg-gradient-to-tr from-primary to-secondary mt-3"></span>
                                    </h3>
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                        <div className="selectmodel">
                                            <label htmlFor="">Select Model</label>
                                            <button
                                                className="border border-borderlight dark:border-border w-full text-left rounded-md px-3 py-3 overflow-hidden"
                                                onClick={handleModelBox}
                                            >
                                                <strong className="text-black dark:text-white font-medium">
                                                    Model:
                                                </strong>{" "}
                                                <span className="text-ellipsis overflow-hidden">
                                                    {slectedModel.split(".")[0]}
                                                </span>
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <div className="flex items-center justify-between flex-wrap gap-1 mb-2">
                                                <label htmlFor="">Prompt text*</label>
                                                <button
                                                    className="btn btn-sm !bg-secondary"
                                                    onClick={(e) => handleSuggest(e)}
                                                >
                                                    Suggest
                                                </button>
                                            </div>
                                            <PromptBox
                                                promptText={promptText}
                                                setPromptText={setPromptText}
                                                handleWarning={handleWarning}
                                            />
                                        </div>
                                        <div className="inputbox">
                                            <label htmlFor="">Exclude elments</label>
                                            <textarea
                                                {...register("negative_prompt", {
                                                    maxLength: {
                                                        value: 2000,
                                                        message:
                                                            "Exclude elements can't be more than 2000 characters",
                                                    },
                                                })}
                                                placeholder="eg: Disfigured, blurry, etc."
                                            />
                                            {errors.negative_prompt?.message && (
                                                <p className="message text-red-500 mt-2">
                                                    {errors.negative_prompt?.message}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="flex items-center justify-between gap-x-2 font-semibold"
                                            onClick={handleAdvanceOption}
                                        >
                                            {advancedOptionOpen ? (
                                                <HiChevronUp className="text-xl" />
                                            ) : (
                                                <HiChevronDown className="text-xl" />
                                            )}
                                            <span>Advanced Options</span>
                                        </button>
                                        {advancedOptionOpen && (
                                            <div className="advanced space-y-5">
                                                <div className="inputbox">
                                                    <label htmlFor="">
                                                        Select Size{" "}
                                                        <span className="text-sm text-bodylight dark:text-body">
                                                            (width * height)
                                                        </span>
                                                    </label>
                                                    <select
                                                        {...register("size")}
                                                        onChange={(e) => handleSizeChange(e)}
                                                    >
                                                        {GENERATION_SIZES.map((item) => (
                                                            <option
                                                                key={item.id}
                                                                value={item.value}
                                                            >
                                                                {item.value} ({item.ratio})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {errors.size?.message && (
                                                        <p className="message text-red-500 mt-2">
                                                            {errors.size?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="inputbox">
                                                    <label htmlFor="" className="block">
                                                        Step count {"(" + watchStepCount + ")"}
                                                    </label>
                                                    <input
                                                        className="w-full"
                                                        type="range"
                                                        min="1"
                                                        max="50"
                                                        {...register("steps")}
                                                        onChange={handleStepChange}
                                                    />
                                                    {errors.steps?.message && (
                                                        <p className="message text-red-500 mt-2">
                                                            {errors.steps?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="inputbox">
                                                    <label htmlFor="" className="block">
                                                        Prompt Weight {"(" + watchCfgScale + ")"}
                                                    </label>
                                                    <input
                                                        className="w-full"
                                                        type="range"
                                                        min="0"
                                                        max="15"
                                                        {...register("cfg_scale")}
                                                        onChange={handleCfgScaleChange}
                                                    />
                                                    {errors.cfg_scale?.message && (
                                                        <p className="message text-red-500 mt-2">
                                                            {errors.cfg_scale?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="inputbox">
                                                    <label htmlFor="" className="block">
                                                        Seed
                                                    </label>
                                                    <input
                                                        className="w-full appearance-none"
                                                        type="number"
                                                        {...register("seed")}
                                                        onBlur={handleSeedFix}
                                                    />
                                                    {errors.seed?.message && (
                                                        <p className="message text-red-500 mt-2">
                                                            {errors.seed?.message}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="inputbox">
                                                    <label htmlFor="" className="block">
                                                        Sampler
                                                    </label>
                                                    <CustomSelect
                                                        current={selectedSampler}
                                                        setCurrentValue={setSelectedSampler}
                                                        items={[
                                                            {
                                                                value: "Euler a",
                                                                text: "Euler a",
                                                            },
                                                            {
                                                                value: "Euler",
                                                                text: "Euler",
                                                            },
                                                            {
                                                                value: "DPM++ 2S a Karras",
                                                                text: "DPM++ 2S a Karras",
                                                            },
                                                        ]}
                                                        fullWidth
                                                    />
                                                </div>
                                                <div className="uploadbox">
                                                    <label htmlFor="" className="block">
                                                        Upload image
                                                    </label>
                                                    <label
                                                        htmlFor="uploadedimage"
                                                        className="text-center relative w-full"
                                                    >
                                                        {uploadedImage ? (
                                                            <div className="box relative pointer-events-none inline-flex flex-col overflow-hidden w-full max-w-md justify-center items-center rounded-md border border-borderlight dark:border-border">
                                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                                <img
                                                                    src={uploadedImage}
                                                                    alt="uploadedimage"
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="box relative pointer-events-none inline-flex flex-col overflow-hidden h-44 w-full justify-center items-center rounded-md border border-borderlight dark:border-border">
                                                                <HiPhoto className="text-3xl text-bodylight dark:text-body" />
                                                                <p className="text-sm text-bodylight dark:text-body text-opacity-50">
                                                                    Choose photo
                                                                </p>
                                                            </div>
                                                        )}
                                                        <input
                                                            ref={uploadboxInputRef}
                                                            type="file"
                                                            name="uploadedimage"
                                                            id="uploadedimage"
                                                            className="!hidden"
                                                            accept="image/*"
                                                            multiple={false}
                                                            onChange={handleUpload}
                                                        />
                                                        <button
                                                            className="absolute left-auto right-2 top-2 border bg-white dark:bg-dark border-borderlight dark:border-border h-9 w-9 flex justify-center items-center rounded-md"
                                                            onClick={(e) =>
                                                                handleImageFieldClear(e)
                                                            }
                                                        >
                                                            <RiDeleteBin3Line />
                                                        </button>
                                                    </label>
                                                    {uploadedImageError && (
                                                        <p className="message text-red-500 mt-2">
                                                            {uploadedImageError}
                                                        </p>
                                                    )}
                                                </div>
                                                {uploadedImage && (
                                                    <>
                                                        <div className="switchbox">
                                                            <div className="flex items-center">
                                                                <div className="switchbox">
                                                                    <input
                                                                        type="checkbox"
                                                                        id="enable-preprocessor"
                                                                        disabled={
                                                                            watchModule === "none"
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        {...register(
                                                                            "preprocessor"
                                                                        )}
                                                                        onChange={() => {
                                                                            if (
                                                                                watchModule ===
                                                                                "none"
                                                                            ) {
                                                                                setValue(
                                                                                    "preprocessor",
                                                                                    false
                                                                                );
                                                                            } else {
                                                                                setValue(
                                                                                    "preprocessor",
                                                                                    !watchPreprocessor
                                                                                );
                                                                            }
                                                                        }}
                                                                    />
                                                                    <label htmlFor="enable-preprocessor"></label>
                                                                </div>
                                                                <label
                                                                    htmlFor="enable-preprocessor"
                                                                    className="text-sm text-bodylight dark:text-body cursor-pointer"
                                                                >
                                                                    Enable Preprocessor
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div className="inputbox">
                                                            <label htmlFor="">
                                                                Select Image Mode
                                                            </label>
                                                            <select
                                                                {...register("module")}
                                                                onChange={(e) => {
                                                                    setValue(
                                                                        "module",
                                                                        e.target.value
                                                                    );
                                                                    if (e.target.value === "none") {
                                                                        setValue(
                                                                            "preprocessor",
                                                                            false
                                                                        );
                                                                    } else {
                                                                        setValue(
                                                                            "preprocessor",
                                                                            true
                                                                        );
                                                                    }
                                                                }}
                                                            >
                                                                <option value="none">
                                                                    img2img
                                                                </option>
                                                                {CONTROLNET_ITEMS.map(
                                                                    (item: IControlnet) => (
                                                                        <option
                                                                            key={item.value}
                                                                            value={item.value}
                                                                        >
                                                                            {item.name}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                            {errors.module?.message && (
                                                                <p className="message text-red-500 mt-2">
                                                                    {errors.module?.message}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                                <PrivateModeController
                                                    value={privateMode}
                                                    setValue={setPrivateMode}
                                                />
                                            </div>
                                        )}
                                        <div className="generatebutton !mt-8">
                                            <button
                                                ref={refSubmitBtn}
                                                type="submit"
                                                className="btn btn-lg block w-full"
                                                disabled={isLoading}
                                            >
                                                {isLoading ? (
                                                    <span className="flex items-center gap-x-1">
                                                        <span className="text-xl">
                                                            <RiLoader4Line className="animate-spin" />
                                                        </span>
                                                        Generating Image
                                                    </span>
                                                ) : (
                                                    <span>
                                                        Generate{" "}
                                                        <HiOutlineArrowSmallRight className="inline text-base align-middle" />
                                                    </span>
                                                )}
                                            </button>
                                            <p className="mt-3 text-sm opacity-50">
                                                Estimated generation cost:{" "}
                                                <span className="font-bold">
                                                    {estimatedCost.toFixed(3)}
                                                </span>
                                            </p>
                                            {warning ? (
                                                <p className="text-yellow-600 dark:text-yellow-300">
                                                    {warning}
                                                </p>
                                            ) : null}
                                        </div>
                                        {error && (
                                            <p className="message bg-red-500 text-red-500 bg-opacity-10 rounded-md px-5 py-2 border border-red-500">
                                                {error}
                                            </p>
                                        )}
                                    </form>
                                </div>
                            </aside>
                            <GenerationResults
                                isLoading={isLoading}
                                result={resultImages}
                                setResultImages={setResultImages}
                                generationText={generationText}
                                setUploadImage={handleCreateVariation}
                            />
                        </div>
                        <div className="pt-16 md:pt-20">
                            <h3 className="text-3xl font-semibold text-black dark:text-white mb-8">
                                Recent Generations
                            </h3>
                            <RecentCreations limit={20} />
                            {username ? (
                                <div className="text-center mt-10">
                                    <Link href="/myprofile/generations" className="btn">
                                        My Generations
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
