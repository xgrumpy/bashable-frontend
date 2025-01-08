"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import Modal from "@/component/shared/Modal";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { IGeneration } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { debounce, handleClipboard, imageLoader, shimmer, toBase64 } from "@/utils/utils";
import { saveAs } from "file-saver";
import _ from "lodash";
import { FacebookShareButton, RedditShareButton } from "next-share";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineChatBubbleLeftRight, HiOutlineShare } from "react-icons/hi2";
import { MdBlock, MdOutlineAppBlocking } from "react-icons/md";
import {
    RiClipboardLine,
    RiDeleteBinLine,
    RiDownload2Line,
    RiErrorWarningLine,
    RiFacebookFill,
    RiFlag2Line,
    RiHeartLine,
    RiLockLine,
    RiLockUnlockLine,
    RiRedditLine,
    RiRepeatLine,
    RiStarLine,
    RiUploadLine,
} from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";
interface IDetailsView {
    generationid: string;
}

const DetailsView = ({ generationid }: IDetailsView) => {
    const [imageData, setImageData] = useState<IGeneration>({} as IGeneration);

    useEffect(() => {
        axiosReq
            .get(`/public/generations/${generationid}/view`)
            .then((res) => {
                return;
            })
            .catch((err) => {
                console.log(err);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axiosReq
            .get(`/public/generations/${generationid}`)
            .then((res) => {
                setImageData(res.data);
            })
            .catch((err) => {
                if (err.response.data.restricted_prompt) {
                    setIsRestrictedPopupOpen(true);
                } else if (err.response.data.restricted_model) {
                    setIsRestrictedModelOpen(true);
                } else {
                    toastError(err);
                }
            });
    }, [generationid]);

    const {
        id,
        image,
        prompt,
        negative_prompt,
        createdAt,
        model,
        height,
        width,
        steps,
        seed,
        cfg_scale,
        sampler,
        liked,
        private: imagePrivate,
        restricted,
        blocked,
        showcase,
        regenerations,
        downloads,
        likes,
        ip,
        email,
        tags,
        username: imageUsername,
        module: imageModule,
        views,
        featured,
    } = imageData;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isShareModelOpen, setIsShareModelOpen] = useState<boolean>(false);
    const [isDiscordModalOpen, setIsDiscordModalOpen] = useState<boolean>(false);
    const [isLikeFreePopupOpen, setIsLikeFreePopupOpen] = useState<boolean>(false);
    const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
    const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
    const [isRestrictedPopupOpen, setIsRestrictedPopupOpen] = useState<boolean>(false);
    const [isRestrictedModelOpen, setIsRestrictedModelOpen] = useState<boolean>(false);

    const [isRestrict, setIsRestrict] = useState<boolean>(restricted);
    const [isUnderReview, setIsUnderReview] = useState(tags?.includes("under_review"));
    const [isUnderReported, setIsUnderReported] = useState(tags?.includes("reported"));
    const [isFlagged, setIsFlagged] = useState<boolean>(blocked);
    const [isShowcase, setIsShowcase] = useState<boolean>(showcase);
    const [isFavourite, setIsFavourite] = useState<boolean>(liked);
    const [isFeatured, setIsFeatured] = useState<boolean>(featured || false);
    const [isPrivate, setIsPrivate] = useState<boolean>(imagePrivate);
    const [downloadCount, setDownloadCount] = useState<number>(downloads);
    const [likesCount, setLikesCount] = useState<number>(likes);
    const [promptShowMore, setPromptShowMore] = useState<boolean>(false);
    const [negativePromptShowMore, setNegativePromptShowMore] = useState<boolean>(false);

    const flagButtonRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (isFlagModalOpen) {
            flagButtonRef.current && flagButtonRef.current?.focus();
        }
    }, [isFlagModalOpen]);

    const { username, role, banned, discordConnected, isBetaTester } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();
    const router = useRouter();

    const toggleFavourite = () => {
        axiosReq
            .get(`/generate/${id}/like`)
            .then((res) => {
                if (isFavourite) {
                    setLikesCount((prev) => prev - 1);
                } else {
                    setLikesCount((prev) => prev + 1);
                }
                setIsFavourite(!isFavourite);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const debouncedToggleFavourite = debounce(toggleFavourite, 1000);

    const handleToggleFavourite = (e: SyntheticEvent) => {
        e.preventDefault();
        if (!username) {
            setIsLikeFreePopupOpen(true);
        } else {
            debouncedToggleFavourite();
        }
    };

    const handleTogglePrivate = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .get(`/generate/${id}/private`)
            .then((res) => {
                setIsPrivate((prev) => !prev);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleRestricted = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .post(`/admin/generations/${id}/restrict`)
            .then((res) => {
                setIsRestrict(!isRestrict);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleFlagged = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .post(`/admin/generations/${id}/tags/illegal`)
            .then((res) => {
                setIsFlagged(true);
                toast.success(res.data.message);
                isFlagModalOpen && setIsFlagModalOpen(false);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleFlaggedReview = (e: SyntheticEvent) => {
        axiosReq
            .post(`/admin/generations/${id}/tags/review`)
            .then((res) => {
                setIsUnderReview(!isUnderReview);
                toast.success(res.data.message);
                if (role === "admin") {
                    setIsFlagModalOpen(false);
                }
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleToggleShowcase = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .post(`/admin/generations/${id}/showcase`)
            .then((res) => {
                setIsShowcase(!isShowcase);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleDeleteGeneration = (e: SyntheticEvent) => {
        e.preventDefault();
        axiosReq
            .delete(`/users/generations/${id}`)
            .then((res) => {
                toast.success("Generation Deleted");
                isDeleteModalOpen && setIsDeleteModalOpen(false);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleRegenerate = (id: string) => {
        router.push(`/generate?generationId=${id}`);
    };

    const downloadHandler = (id: string, path: string) => {
        axiosReq
            .get(`/public/generations/${id}/download`)
            .then((res) => {
                if (res.status === 200) {
                    setDownloadCount((prev) => prev + 1);
                    saveAs(path, `${id}.png` || "bashable.png");
                }
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const shareDiscord = () => {
        axiosReq
            .post(`/generate/${id}/share`)
            .then((res) => {
                toast.success(res.data.message);
                if (restricted) {
                    window.open(process.env.NEXT_PUBLIC_DISCORD_CHANNEL_LINK_RESTRICTED, "_blank");
                } else {
                    window.open(process.env.NEXT_PUBLIC_DISCORD_LINK, "_blank");
                }
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleShareDiscord = () => {
        if (isPrivate) {
            toastError("Can't share a private image.");
        } else {
            if (discordConnected) {
                shareDiscord();
            } else {
                setIsDiscordModalOpen(true);
            }
        }
    };

    const handleBlockGeneration = () => {
        axiosReq
            .post(`/admin/generations/${id}/block`)
            .then((res) => {
                setIsBlockModalOpen(false);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleSignUpOpen = () => {
        isLikeFreePopupOpen && setIsLikeFreePopupOpen(false);
        changeAuthBoxStatus("signup");
    };

    const handleUpscale = (url: string) => {
        router.push(`/upscale?url=${url}`);
    };

    const handleFeature = () => {
        axiosReq
            .get(`/generate/${id}/feature`)
            .then((res) => {
                toast.success(res.data.message);
                setIsFeatured((prev) => !prev);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleReportImage = () => {
        axiosReq
            .get(`/generate/${id}/report`)
            .then((res) => {
                setIsUnderReported(false);
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <Modal
                state={isRestrictedModelOpen}
                closeHandler={() => setIsRestrictedModelOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p>
                            This prompt used a restricted model. To view this model, you must have
                            an account and{" "}
                            <Link
                                href="/blogs/what-is-unrestricted-mode"
                                className="underline hover:text-primary font-semibold"
                            >
                                unresctricted mode
                            </Link>{" "}
                            enabled.
                        </p>
                        {!username ? (
                            <>
                                <br />
                                <button
                                    className="btn"
                                    onClick={() => changeAuthBoxStatus("signup")}
                                >
                                    Create Free Account
                                </button>
                            </>
                        ) : null}
                    </div>
                </div>
            </Modal>
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
                            <>
                                <p>
                                    Please sign up to view this kind of images and enjoy our
                                    platform to the fullest.
                                </p>
                                <br />
                                <button
                                    className="btn"
                                    onClick={() => changeAuthBoxStatus("signup")}
                                >
                                    Create Free Account
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </Modal>
            <ConfirmationModal
                state={isDeleteModalOpen}
                closeHandler={() => setIsDeleteModalOpen(false)}
                acceptHandler={handleDeleteGeneration}
                declineHandler={() => setIsDeleteModalOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete?
                </h5>
            </ConfirmationModal>
            <Modal state={isDiscordModalOpen} closeHandler={() => setIsDiscordModalOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-black dark:text-white">
                        You are not connected to discord! Please go connect with discord first on
                        the{" "}
                        <Link href="/account" className="underline">
                            account page.
                        </Link>
                    </h5>
                </div>
            </Modal>
            <Modal state={isFlagModalOpen} closeHandler={() => setIsFlagModalOpen(false)}>
                <div className="max-w-xl border border-border mx-auto bg-grey dark:bg-light p-5 md:p-10 rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-black dark:text-white">
                        Please choose an action below.
                    </h5>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button
                            className="btn !bg-red-500"
                            onClick={handleFlagged}
                            ref={flagButtonRef}
                        >
                            Flag Image
                        </button>
                        {isUnderReview && role === "admin" && (
                            <button
                                className="btn !bg-yellow-500 !text-black"
                                onClick={handleFlaggedReview}
                            >
                                Keep Image
                            </button>
                        )}
                        <button className="btn" onClick={() => setIsFlagModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
            <ConfirmationModal
                state={isBlockModalOpen}
                closeHandler={() => setIsBlockModalOpen(false)}
                acceptHandler={handleBlockGeneration}
                declineHandler={() => setIsBlockModalOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to block this user and his IP with all his generations?
                </h5>
            </ConfirmationModal>
            <Modal state={isLikeFreePopupOpen} closeHandler={() => setIsLikeFreePopupOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p className="text-black dark:text-white">
                            To like images, you must create a free account.
                        </p>
                        <button className="btn mt-4" onClick={handleSignUpOpen}>
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isShareModelOpen}
                closeHandler={() => {
                    setIsShareModelOpen(false);
                }}
            >
                <div className="max-w-md border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10 rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-black dark:text-white">
                        Select where you want to share?
                    </h5>
                    <div className="sharebuttons-wrap flex flex-col gap-3 flex-wrap items-center mt-5">
                        {username === imageUsername && (
                            <button
                                className={`!inline-flex justify-center items-center gap-x-1 w-full ${
                                    isFeatured ? "btn" : "btn btn-secondary"
                                }`}
                                onClick={handleFeature}
                            >
                                {isFeatured ? "Remove from my Profile" : "Share to my Profile"}
                            </button>
                        )}
                        <button
                            className="btn !inline-flex justify-center items-center gap-x-1 w-full !bg-[#5865f2]"
                            onClick={handleShareDiscord}
                        >
                            <RxDiscordLogo className="text-lg" />
                            Share on Discord
                        </button>
                        <FacebookShareButton
                            url={`${process.env.NEXT_PUBLIC_SITE_URL}/generationdetails/${id}`}
                            quote={prompt}
                            hashtag={"#bashable.art"}
                        >
                            <span className="btn !inline-flex justify-center items-center gap-x-1 w-full !bg-[#1877f2]">
                                <RiFacebookFill className="text-lg" />
                                Share on Facebook
                            </span>
                        </FacebookShareButton>
                        <RedditShareButton
                            url={`${process.env.NEXT_PUBLIC_SITE_URL}/generationdetails/${id}`}
                            title={prompt}
                        >
                            <span className="btn !inline-flex justify-center items-center gap-x-1 w-full !bg-[#1877f2]">
                                <RiRedditLine className="text-lg" />
                                Share on Reddit
                            </span>
                        </RedditShareButton>
                    </div>
                </div>
            </Modal>
            <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-white dark:bg-dark">
                {_.isEmpty(imageData) ? null : (
                    <div className="max-w-7xl mx-auto">
                        <div className="p-3 bg-white dark:bg-dark border border-border rounded-lg flex flex-wrap items-center gap-8">
                            <div className="flex-auto md:flex-1 self-auto relative overflow-hidden bg-white dark:bg-dark w-auto rounded-md flex justify-center items-center">
                                <Image
                                    src={image}
                                    loader={imageLoader}
                                    alt={blocked ? "Illegal Generation" : prompt}
                                    className="w-full h-auto"
                                    height={height}
                                    width={width}
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                        shimmer(width, height)
                                    )}`}
                                    sizes="100vw"
                                />
                            </div>
                            <div className="flex-auto md:flex-1">
                                <div className="group relative mb-4">
                                    <h5 className="text-2xl font-medium text-black dark:text-white">
                                        {prompt?.length < 80 ? (
                                            <span>{prompt}</span>
                                        ) : (
                                            <>
                                                {promptShowMore ? (
                                                    <span>
                                                        {prompt}{" "}
                                                        <button
                                                            className="text-secondary"
                                                            onClick={() => setPromptShowMore(false)}
                                                        >
                                                            show less
                                                        </button>
                                                    </span>
                                                ) : (
                                                    <span>
                                                        {prompt?.slice(0, 80)}
                                                        {"... "}
                                                        <button
                                                            className="text-secondary"
                                                            onClick={() => setPromptShowMore(true)}
                                                        >
                                                            show more
                                                        </button>
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </h5>
                                    <button
                                        title="Copy Prompt Text"
                                        className="inline-flex text-secondary items-center gap-x-1"
                                        onClick={() => handleClipboard(prompt)}
                                    >
                                        <RiClipboardLine /> Copy Prompt Text
                                    </button>
                                </div>
                                {negative_prompt && (
                                    <div className="group relative mb-4">
                                        <h6 className="text-lg font-medium">
                                            Negative Prompt:{" "}
                                            <span className="text-black dark:text-white">
                                                {negative_prompt.length < 100 ? (
                                                    <span>{negative_prompt}</span>
                                                ) : (
                                                    <>
                                                        {negativePromptShowMore ? (
                                                            <span>
                                                                {negative_prompt}{" "}
                                                                <button
                                                                    className="text-secondary"
                                                                    onClick={() =>
                                                                        setNegativePromptShowMore(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    show less
                                                                </button>
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {negative_prompt.slice(0, 100)}
                                                                {"... "}
                                                                <button
                                                                    className="text-secondary"
                                                                    onClick={() =>
                                                                        setNegativePromptShowMore(
                                                                            true
                                                                        )
                                                                    }
                                                                >
                                                                    show more
                                                                </button>
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                            </span>
                                        </h6>
                                        <button
                                            title="Copy Prompt Text"
                                            className="inline-flex text-secondary items-center gap-x-1"
                                            onClick={() => handleClipboard(negative_prompt)}
                                        >
                                            <RiClipboardLine /> Copy Negative Prompt Text
                                        </button>
                                    </div>
                                )}
                                <ul>
                                    {typeof createdAt !== "undefined" && (
                                        <li>
                                            Generated On:{" "}
                                            <span className="text-black dark:text-white">
                                                {new Date(createdAt).toLocaleString()}
                                            </span>
                                        </li>
                                    )}
                                    {typeof model !== "undefined" && (
                                        <li>
                                            Model:{" "}
                                            <span className="text-black dark:text-white capitalize">
                                                {model?.split("_").join(" ") || "Default"}
                                            </span>
                                        </li>
                                    )}
                                    {typeof height !== "undefined" && (
                                        <li>
                                            Height:{" "}
                                            <span className="text-black dark:text-white">
                                                {height}
                                            </span>
                                        </li>
                                    )}
                                    {typeof width !== "undefined" && (
                                        <li>
                                            Width:{" "}
                                            <span className="text-black dark:text-white">
                                                {width}
                                            </span>
                                        </li>
                                    )}
                                    {typeof steps !== "undefined" && (
                                        <li>
                                            Steps:{" "}
                                            <span className="text-black dark:text-white">
                                                {steps}
                                            </span>
                                        </li>
                                    )}
                                    {typeof seed !== "undefined" && (
                                        <li>
                                            Seed:{" "}
                                            <span className="text-black dark:text-white">
                                                {seed}
                                            </span>
                                        </li>
                                    )}
                                    {typeof cfg_scale !== "undefined" && (
                                        <li>
                                            Prompt Weight:{" "}
                                            <span className="text-black dark:text-white">
                                                {cfg_scale}
                                            </span>
                                        </li>
                                    )}
                                    {typeof sampler !== "undefined" && (
                                        <li>
                                            Sampler:{" "}
                                            <span className="text-black dark:text-white">
                                                {sampler}
                                            </span>
                                        </li>
                                    )}
                                    {typeof imageModule !== "undefined" && (
                                        <li>
                                            Module:{" "}
                                            <span className="text-black dark:text-white">
                                                {imageModule}
                                            </span>
                                        </li>
                                    )}
                                    {typeof regenerations !== "undefined" && (
                                        <li>
                                            Regenerations:{" "}
                                            <span className="text-black dark:text-white">
                                                {regenerations}
                                            </span>
                                        </li>
                                    )}
                                    {typeof downloads !== "undefined" && (
                                        <li>
                                            Downloads:{" "}
                                            <span className="text-black dark:text-white">
                                                {downloads}
                                            </span>
                                        </li>
                                    )}
                                    {typeof likes !== "undefined" && (
                                        <li>
                                            Likes:{" "}
                                            <span className="text-black dark:text-white">
                                                {likes}
                                            </span>
                                        </li>
                                    )}
                                    {typeof imagePrivate !== "undefined" && (
                                        <li>
                                            Private:{" "}
                                            <span className="text-black dark:text-white">
                                                {isPrivate ? "Yes" : "No"}
                                            </span>
                                        </li>
                                    )}
                                    {typeof restricted !== "undefined" && (
                                        <li>
                                            Restricted:{" "}
                                            <span className="text-black dark:text-white">
                                                {restricted ? "Yes" : "No"}
                                            </span>
                                        </li>
                                    )}
                                    {typeof ip !== "undefined" && (
                                        <li>
                                            Ip Address:{" "}
                                            <span className="text-black dark:text-white">{ip}</span>
                                        </li>
                                    )}
                                    {typeof views !== "undefined" && (
                                        <li>
                                            Views:{" "}
                                            <span className="text-black dark:text-white">
                                                {views}
                                            </span>
                                        </li>
                                    )}
                                    {typeof imageUsername !== "undefined" && (
                                        <li>
                                            User:{" "}
                                            {imageUsername === "free" ? (
                                                <span className="text-black dark:text-white">
                                                    {imageUsername}
                                                </span>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={`/profiles/${encodeURIComponent(
                                                            imageUsername
                                                        )}`}
                                                        className="text-black dark:text-white hover:!text-primary font-semibold underline"
                                                    >
                                                        {imageUsername}
                                                        {role === "admin" && email && (
                                                            <span className="text-sm">
                                                                ({email})
                                                            </span>
                                                        )}
                                                    </Link>
                                                </>
                                            )}
                                        </li>
                                    )}
                                </ul>
                                <div className="relative flex flex-wrap gap-4 z-20 mt-6">
                                    <div className="userroles flex flex-wrap gap-2">
                                        {/* Private Button */}
                                        {!blocked && username === imageUsername && !banned && (
                                            <button
                                                title={isPrivate ? "Make Public" : "Make Private"}
                                                className={`relative text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                    isPrivate
                                                        ? "bg-primary !border-primary !text-white !hover:text-white"
                                                        : "bgransparent border-borderlight dark:border-border"
                                                }`}
                                                onClick={(e) => handleTogglePrivate(e)}
                                            >
                                                {isPrivate ? <RiLockLine /> : <RiLockUnlockLine />}
                                            </button>
                                        )}
                                        {/* Favourite Button */}
                                        {!blocked && !banned && (
                                            <button
                                                title="Make Favourite"
                                                className={`relative text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                    isFavourite
                                                        ? "bg-primary !border-primary !text-white !hover:text-white"
                                                        : "bgransparent border-borderlight dark:border-border"
                                                }`}
                                                onClick={handleToggleFavourite}
                                            >
                                                <RiHeartLine />
                                                {typeof likes !== "undefined" ? (
                                                    <span className="absolute inline-flex justify-center items-center left-auto right-0 top-0 bg-primary rounded-full h-5 min-w-[20px] -mt-2 -mr-2 text-xs text-white">
                                                        {likesCount}
                                                    </span>
                                                ) : null}
                                            </button>
                                        )}
                                        {/* Share to discord button */}
                                        {username && !isFlagged && !banned && (
                                            <button
                                                title="Share Now"
                                                className="gap-3 z-20 text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => {
                                                    setIsShareModelOpen((prev) => !prev);
                                                }}
                                                disabled={isPrivate}
                                            >
                                                <HiOutlineShare />
                                            </button>
                                        )}
                                        {/* Regenerate button */}
                                        {!blocked && !banned && (
                                            <button
                                                title="Regenerate with params"
                                                className="text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => handleRegenerate(id)}
                                            >
                                                <RiRepeatLine />
                                            </button>
                                        )}
                                        {/* Create Chat */}
                                        {isBetaTester && username && !blocked && (
                                            <Link
                                                href={`/chat/create?generationId=${id}`}
                                                title="Create Chat Profile"
                                                className="text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                            >
                                                <HiOutlineChatBubbleLeftRight />
                                            </Link>
                                        )}
                                        {/* Upscale button */}
                                        {!blocked && !banned && (
                                            <button
                                                title="Upscale Now"
                                                className="text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => handleUpscale(image)}
                                            >
                                                <RiUploadLine />
                                            </button>
                                        )}
                                        {/* Download button */}
                                        {!blocked && (
                                            <button
                                                title="Download"
                                                className="relative z-20 text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => downloadHandler(id, image)}
                                            >
                                                <RiDownload2Line />
                                                {typeof downloads !== "undefined" ? (
                                                    <span className="absolute inline-flex justify-center items-center left-auto right-0 top-0 bg-primary rounded-full h-5 min-w-[20px] -mt-2 -mr-2 text-xs text-white">
                                                        {downloadCount}
                                                    </span>
                                                ) : null}
                                            </button>
                                        )}
                                    </div>
                                    {/* Delete Button */}
                                    {!blocked &&
                                        (imageUsername === username || role === "admin") &&
                                        !banned && (
                                            <button
                                                title="Delete"
                                                className="text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => setIsDeleteModalOpen(true)}
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        )}
                                    <div className="adminroles flex flex-wrap gap-2">
                                        {/* Flagged Button */}
                                        {!isFlagged && role === "admin" && (
                                            <button
                                                title="Toggle Flagged"
                                                className={`text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                    isFlagged
                                                        ? "bg-primary !border-primary hover:text-white"
                                                        : "bg-transparent border-white"
                                                }`}
                                                onClick={(e) => setIsFlagModalOpen(true)}
                                            >
                                                <RiFlag2Line />
                                            </button>
                                        )}
                                        {/* Flagged review button */}
                                        {!isFlagged && role === "mod" && (
                                            <button
                                                title="Set for review"
                                                className={`text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                    isUnderReview
                                                        ? "bg-primary !border-primary hover:text-white"
                                                        : "bg-transparent border-white"
                                                }`}
                                                onClick={handleFlaggedReview}
                                            >
                                                <RiFlag2Line />
                                            </button>
                                        )}
                                        {/* Report Image Button */}
                                        {role !== "admin" &&
                                            role !== "mod" &&
                                            !!username &&
                                            !banned && (
                                                <button
                                                    title="Report this Image"
                                                    className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                                    onClick={handleReportImage}
                                                >
                                                    <RiFlag2Line />
                                                </button>
                                            )}
                                        {/* Restricted Button */}
                                        {!isFlagged && role === "admin" && (
                                            <button
                                                title="Toggle Restricted"
                                                className={`text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                    isRestrict
                                                        ? "bg-primary !border-primary hover:text-white"
                                                        : "bg-transparent border-white"
                                                }`}
                                                onClick={(e) => handleRestricted(e)}
                                            >
                                                <MdBlock />
                                            </button>
                                        )}
                                        {/* Block Button */}
                                        {!isFlagged && role === "admin" && (
                                            <button
                                                title="Block Generation"
                                                className="text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary"
                                                onClick={() => setIsBlockModalOpen(true)}
                                            >
                                                <MdOutlineAppBlocking />
                                            </button>
                                        )}
                                        {/* Showcase Button */}
                                        {!isFlagged &&
                                            !imagePrivate &&
                                            (role === "admin" || role === "mod") && (
                                                <button
                                                    title="Showcase Visibility"
                                                    className={`text-bodylight dark:text-body h-10 w-10 border border-borderlight dark:border-border rounded-md inline-flex text-lg justify-center items-center hover:border-primary hover:text-primary ${
                                                        isShowcase
                                                            ? "bg-primary !border-primary hover:text-white"
                                                            : "bg-transparent border-white"
                                                    }`}
                                                    onClick={(e) => handleToggleShowcase(e)}
                                                >
                                                    <RiStarLine />
                                                </button>
                                            )}
                                    </div>
                                </div>
                                {!banned && (
                                    <React.Fragment>
                                        {role !== "admin" && role !== "mod" && !!username ? (
                                            <div className="mt-5">
                                                <button
                                                    className="inline-flex items-center gap-x-1 font-semibold text-yellow-500"
                                                    onClick={handleReportImage}
                                                >
                                                    Report this image{" "}
                                                    <RiErrorWarningLine className="text-lg" />
                                                </button>
                                            </div>
                                        ) : isUnderReported ? (
                                            <div className="mt-5">
                                                <button
                                                    className="inline-flex items-center gap-x-1 font-semibold text-yellow-500"
                                                    onClick={handleReportImage}
                                                >
                                                    Remove report from this image{" "}
                                                    <RiErrorWarningLine className="text-lg" />
                                                </button>
                                            </div>
                                        ) : null}
                                    </React.Fragment>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
};

export default DetailsView;
