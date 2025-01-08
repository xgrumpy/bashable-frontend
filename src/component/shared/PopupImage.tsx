import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { IGeneration } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { debounce, handleClipboard, imageLoader, shimmer, toBase64 } from "@/utils/utils";
import { saveAs } from "file-saver";
import { FacebookShareButton, RedditShareButton } from "next-share";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineChatBubbleLeftRight, HiOutlineShare } from "react-icons/hi2";
import {
    RiClipboardLine,
    RiDeleteBinLine,
    RiDownload2Line,
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
import ConfirmationModal from "./ConfirmationModal";
import Modal from "./Modal";

interface IPopupImageProps {
    imageData: IGeneration;
    refresh?: () => void;
    square?: boolean;
    hideOptions?: boolean;
    deleteIdPasser?: (id: string) => void;
    modalStatePasser?: (state: boolean) => void;
    noThumbnail?: boolean;
    removeDelete?: boolean;
    removeRegenerate?: boolean;
    flaggedIdsPasser?: (ids: string[]) => void;
    showcaseVisible?: boolean;
}

const PopupImage = ({
    imageData,
    refresh,
    square = false,
    hideOptions = false,
    removeDelete = false,
    removeRegenerate = false,
    deleteIdPasser,
    modalStatePasser,
    noThumbnail,
    flaggedIdsPasser,
    showcaseVisible = false,
}: IPopupImageProps) => {
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
        module: imageModule,
        username: imageUsername,
        downloads,
        likes,
        blocked,
        thumbnail,
        restricted,
        views,
        regenerations,
        featured,
        showcase,
        tags,
    } = imageData;

    const [isFlagModalOpen, setIsFlagModalOpen] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isShareModelOpen, setIsShareModelOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [isDiscordModalOpen, setIsDiscordModalOpen] = useState<boolean>(false);
    const [isLikeFreePopupOpen, setIsLikeFreePopupOpen] = useState<boolean>(false);
    const [isUnderReview, setIsUnderReview] = useState<boolean>(
        tags?.includes("under_review") || false
    );
    const [isFlagged, setIsFlagged] = useState<boolean>(blocked || false);
    const [isFeatured, setIsFeatured] = useState<boolean>(featured || false);
    const [isFavourite, setIsFavourite] = useState<boolean>(liked || false);
    const [isPrivate, setIsPrivate] = useState<boolean>(imagePrivate || false);
    const [isShowcase, setIsShowcase] = useState<boolean>(showcase || false);
    const [downloadCount, setDownloadCount] = useState<number>(downloads);
    const [likesCount, setLikesCount] = useState<number>(likes);
    const [promptShowMore, setPromptShowMore] = useState<boolean>(false);
    const [negativePromptShowMore, setNegativePromptShowMore] = useState<boolean>(false);

    const flagButtonRef = useRef<HTMLButtonElement | null>(null);
    const thumbnailRef = useRef<HTMLImageElement>(null);

    const { username, role, banned, discordConnected, isBetaTester } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isFlagModalOpen) {
            flagButtonRef.current && flagButtonRef.current?.focus();
        }
    }, [isFlagModalOpen]);

    useEffect(() => {
        setIsFlagged(blocked);
    }, [blocked]);

    const openModalHandler = () => {
        setIsModalOpen(true);
        modalStatePasser && modalStatePasser(true);
    };

    const closeModalHandler = () => {
        setIsModalOpen(false);
        modalStatePasser && modalStatePasser(false);
    };

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
                refresh && refresh();
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
                refresh && refresh();
                deleteIdPasser && deleteIdPasser(id);
                toast.success("Generation Deleted");
                isDeleteModalOpen && setIsDeleteModalOpen(false);
                closeModalHandler();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleRegenerate = (id: string) => {
        isModalOpen && setIsModalOpen(false);
        router.push(`/generate?generationId=${id}`);
        if (pathname === "/generate") {
            window.scrollTo({
                top: 0,
            });
        }
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

    const handleSignUpOpen = () => {
        isLikeFreePopupOpen && setIsLikeFreePopupOpen(false);
        changeAuthBoxStatus("signup");
    };

    const handleUpscale = (url: string) => {
        router.push(`/upscale?url=${url}`);
    };

    const handleMouseEnter = () => {
        if (thumbnailRef.current?.src) thumbnailRef.current.src = image;
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
                toast.success(res.data.message);
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
                refresh && refresh();
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
                flaggedIdsPasser && flaggedIdsPasser(res.data.generationIds);
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

    return (
        <React.Fragment>
            <Modal state={isModalOpen} closeHandler={closeModalHandler}>
                <div className="p-4 md:p-5 max-w-7xl mx-auto bg-white dark:bg-dark border border-border rounded-lg flex flex-wrap items-center gap-8">
                    <div className="flex-auto md:flex-1 self-auto relative overflow-hidden bg-white dark:bg-dark w-auto rounded flex justify-center items-center">
                        <Image
                            src={image}
                            loader={imageLoader}
                            alt={isFlagged ? "Illegal Generation" : prompt}
                            height={height}
                            width={width}
                            className="w-full h-auto"
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
                                                {prompt.slice(0, 80)}
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
                                                                setNegativePromptShowMore(false)
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
                                                                setNegativePromptShowMore(true)
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
                                    <span className="text-black dark:text-white">{height}</span>
                                </li>
                            )}
                            {typeof width !== "undefined" && (
                                <li>
                                    Width:{" "}
                                    <span className="text-black dark:text-white">{width}</span>
                                </li>
                            )}
                            {typeof steps !== "undefined" && (
                                <li>
                                    Steps:{" "}
                                    <span className="text-black dark:text-white">{steps}</span>
                                </li>
                            )}
                            {typeof seed !== "undefined" && (
                                <li>
                                    Seed: <span className="text-black dark:text-white">{seed}</span>
                                </li>
                            )}
                            {typeof cfg_scale !== "undefined" && (
                                <li>
                                    Prompt Weight:{" "}
                                    <span className="text-black dark:text-white">{cfg_scale}</span>
                                </li>
                            )}
                            {typeof sampler !== "undefined" && (
                                <li>
                                    Sampler:{" "}
                                    <span className="text-black dark:text-white">{sampler}</span>
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
                                    <span className="text-black dark:text-white">{downloads}</span>
                                </li>
                            )}
                            {typeof likes !== "undefined" && (
                                <li>
                                    Likes:{" "}
                                    <span className="text-black dark:text-white">{likes}</span>
                                </li>
                            )}
                            {typeof imagePrivate !== "undefined" && (
                                <li>
                                    Private:{" "}
                                    <span className="text-black dark:text-white">
                                        {imagePrivate ? "Yes" : "No"}
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
                            {typeof views !== "undefined" && (
                                <li>
                                    Views:{" "}
                                    <span className="text-black dark:text-white">{views}</span>
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
                                            </Link>
                                        </>
                                    )}
                                </li>
                            )}
                        </ul>
                        {!hideOptions && (
                            <div className="relative flex flex-wrap gap-2 z-20 mt-6">
                                {/* Private Button */}
                                {!isFlagged && username === imageUsername && !banned && (
                                    <button
                                        title={isPrivate ? "Make Public" : "Make Private"}
                                        className={`relative text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                            isPrivate
                                                ? "bg-primary !border-primary !text-white !hover:text-white"
                                                : "bg-transparent border-borderlight dark:border-border"
                                        }`}
                                        onClick={(e) => handleTogglePrivate(e)}
                                    >
                                        {isPrivate ? <RiLockLine /> : <RiLockUnlockLine />}
                                    </button>
                                )}
                                {/* Favourite Button */}
                                {!isFlagged && !banned && (
                                    <button
                                        title="Make Favourite"
                                        className={`relative text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                            isFavourite
                                                ? "bg-primary !border-primary !text-white !hover:text-white"
                                                : "bg-transparent border-borderlight dark:border-border"
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
                                        className="gap-3 z-20 text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                        onClick={() => {
                                            setIsShareModelOpen((prev) => !prev);
                                            modalStatePasser && modalStatePasser(true);
                                        }}
                                        disabled={isPrivate}
                                    >
                                        <HiOutlineShare />
                                    </button>
                                )}
                                {/* Regenerate button */}
                                {!isFlagged && !removeRegenerate && !banned && (
                                    <button
                                        title="Regenerate with params"
                                        className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
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
                                        className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                    >
                                        <HiOutlineChatBubbleLeftRight />
                                    </Link>
                                )}
                                {/* Upscale button */}
                                {!isFlagged && !banned && (
                                    <button
                                        title="Upscale Now"
                                        className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                        onClick={() => handleUpscale(image)}
                                    >
                                        <RiUploadLine />
                                    </button>
                                )}
                                {/* Download button */}
                                {!isFlagged && (
                                    <button
                                        title="Download"
                                        className="relative z-20 text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
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
                                {/* Delete Button */}
                                {(imageUsername === username || role === "admin") &&
                                    !removeDelete &&
                                    !banned && (
                                        <button
                                            title="Delete"
                                            className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                            onClick={() => setIsDeleteModalOpen(true)}
                                        >
                                            <RiDeleteBinLine />
                                        </button>
                                    )}
                                {/* Showcase Button */}
                                {!isFlagged &&
                                    !isPrivate &&
                                    (showcaseVisible || isFeatured) &&
                                    (role === "admin" || role === "mod") && (
                                        <button
                                            title="Showcase Visibility"
                                            className={`relative text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                                isShowcase
                                                    ? "bg-primary !border-primary !text-white !hover:text-white"
                                                    : "bg-transparent border-borderlight dark:border-border"
                                            }`}
                                            onClick={(e) => handleToggleShowcase(e)}
                                        >
                                            <RiStarLine />
                                        </button>
                                    )}
                                {/* Flagged Button */}
                                {!isFlagged &&
                                    (showcaseVisible || isFeatured) &&
                                    role === "admin" && (
                                        <button
                                            title="Toggle Flagged"
                                            className={`relative text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                                isFlagged
                                                    ? "bg-primary !border-primary !text-white !hover:text-white"
                                                    : "bg-transparent border-borderlight dark:border-border"
                                            }`}
                                            onClick={(e) => setIsFlagModalOpen(true)}
                                        >
                                            <RiFlag2Line />
                                        </button>
                                    )}
                                {/* Flagged review button */}
                                {!isFlagged &&
                                    (showcaseVisible || isFeatured) &&
                                    role === "mod" && (
                                        <button
                                            title="Set for review"
                                            className={`relative text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                                isUnderReview
                                                    ? "bg-primary !border-primary !text-white !hover:text-white"
                                                    : "bg-transparent border-borderlight dark:border-border"
                                            }`}
                                            onClick={handleFlaggedReview}
                                        >
                                            <RiFlag2Line />
                                        </button>
                                    )}
                                {/* Report Image Button */}
                                {role !== "admin" && role !== "mod" && !!username && !banned && (
                                    <button
                                        title="Report this Image"
                                        className="text-bodylight dark:text-body h-8 w-8 border border-borderlight dark:border-border rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                        onClick={handleReportImage}
                                    >
                                        <RiFlag2Line />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="mt-5">
                            <button
                                className="inline-flex items-center gap-x-1 font-semibold text-secondary"
                                onClick={() =>
                                    handleClipboard(
                                        `${process.env.NEXT_PUBLIC_SITE_URL}/generationdetails/${id}`,
                                        true
                                    )
                                }
                            >
                                Copy image url <RiClipboardLine />
                            </button>
                        </div>
                        {/* {role !== "admin" && !!username && !banned && (
                            <div className="mt-3">
                                <button
                                    className="inline-flex items-center gap-x-1 font-semibold text-secondary"
                                    onClick={handleReportImage}
                                >
                                    Report this image <RiErrorWarningLine className="text-lg" />
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>
            </Modal>
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
                    modalStatePasser && modalStatePasser(false);
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
            <Modal state={isFlagModalOpen} closeHandler={() => setIsFlagModalOpen(false)}>
                <div className="max-w-xl border border-border mx-auto bg-grey dark:bg-light p-5 md:p-10 rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-black dark:text-white">
                        Please choose an action below.
                    </h5>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button
                            ref={flagButtonRef}
                            className="btn !bg-red-500"
                            onClick={handleFlagged}
                        >
                            Flag Image
                        </button>
                        {isUnderReview && (
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
            <div
                className="group w-full cursor-pointer relative border border-borderlight dark:border-border overflow-hidden rounded"
                onMouseEnter={handleMouseEnter}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <Image
                    ref={thumbnailRef}
                    loader={imageLoader}
                    src={(isFlagged || noThumbnail ? image : thumbnail) || ""}
                    height={height}
                    width={width}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`}
                    sizes="100vw"
                    alt={isFlagged ? "Illegal Generation" : prompt}
                    className={`object-cover w-full cursor-pointer ${
                        square ? "aspect-square" : ""
                    }`}
                />
                <div
                    onClick={openModalHandler}
                    className="absolute inset-0 bg-black bg-opacity-75 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible"
                ></div>
                {!hideOptions && (
                    <React.Fragment>
                        <div className="absolute left-3 top-3 flex flex-wrap gap-2 z-20 transition-all duration-200 -translate-y-20 group-hover:translate-y-0">
                            {/* Favourite Button */}
                            {!isFlagged && !banned && (
                                <button
                                    title="Make Favourite"
                                    className={`relative text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                        isFavourite
                                            ? "bg-primary !border-primary hover:text-white dark:text-white"
                                            : "bg-transparent border-white dark:border-white"
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
                            {/* Regenerate button */}
                            {!isFlagged && !removeRegenerate && !banned && (
                                <button
                                    title="Regenerate with params"
                                    className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                    onClick={() => handleRegenerate(id)}
                                >
                                    <RiRepeatLine />
                                </button>
                            )}
                        </div>
                        <div className="absolute left-3 top-auto bottom-3 flex flex-wrap gap-2 z-20 transition-all duration-200 translate-y-20 group-hover:translate-y-0">
                            {/* Share Now */}
                            {username && !isFlagged && !banned && (
                                <button
                                    title="Share Now"
                                    className="gap-3 z-20 text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                    onClick={() => {
                                        setIsShareModelOpen((prev) => !prev);
                                        modalStatePasser && modalStatePasser(true);
                                    }}
                                    disabled={isPrivate}
                                >
                                    <HiOutlineShare />
                                </button>
                            )}
                            {/* Download button */}
                            {!isFlagged && (
                                <button
                                    title="Download"
                                    className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
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
                        <div className="absolute left-auto right-3 top-3 flex flex-wrap gap-2 z-20 transition-all duration-200 -translate-y-20 group-hover:translate-y-0">
                            {/*  Create Chat Profile */}
                            {isBetaTester && username && !blocked && (
                                <Link
                                    href={`/chat/create?generationId=${id}`}
                                    title="Create Chat Profile"
                                    className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                >
                                    <HiOutlineChatBubbleLeftRight />
                                </Link>
                            )}
                            {/* Upscale button */}
                            {!isFlagged && !banned && (
                                <button
                                    title="Upscale Now"
                                    className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                    onClick={() => handleUpscale(image)}
                                >
                                    <RiUploadLine />
                                </button>
                            )}
                            {/* Showcase Button */}
                            {!isFlagged &&
                                !isPrivate &&
                                (showcaseVisible || isFeatured) &&
                                (role === "admin" || role === "mod") && (
                                    <button
                                        title="Showcase Visibility"
                                        className={`text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                            isShowcase
                                                ? "bg-primary !border-primary hover:text-white"
                                                : "bg-transparent border-white"
                                        }`}
                                        onClick={(e) => handleToggleShowcase(e)}
                                    >
                                        <RiStarLine />
                                    </button>
                                )}
                            {/* Flagged Button */}
                            {!isFlagged && (showcaseVisible || isFeatured) && role === "admin" && (
                                <button
                                    title="Toggle Flagged"
                                    className={`text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
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
                            {!isFlagged && (showcaseVisible || isFeatured) && role === "mod" && (
                                <button
                                    title="Set for review"
                                    className={`text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                        isUnderReview
                                            ? "bg-primary !border-primary hover:text-white"
                                            : "bg-transparent border-white"
                                    }`}
                                    onClick={handleFlaggedReview}
                                >
                                    <RiFlag2Line />
                                </button>
                            )}
                            {role !== "admin" && role !== "mod" && !!username && !banned && (
                                <button
                                    title="Report this Image"
                                    className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                    onClick={handleReportImage}
                                >
                                    <RiFlag2Line />
                                </button>
                            )}
                        </div>
                        <div className="absolute left-auto right-3 top-auto bottom-3 flex flex-wrap gap-2 z-20 transition-all duration-200 translate-y-20 group-hover:translate-y-0">
                            {/* Private Button */}
                            {!isFlagged &&
                                username === imageUsername &&
                                !removeDelete &&
                                !banned && (
                                    <button
                                        title={isPrivate ? "Make Public" : "Make Private"}
                                        className={`relative text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary ${
                                            isPrivate
                                                ? "bg-primary !border-primary !text-white !hover:text-white"
                                                : "bg-transparent border-borderlight dark:border-border"
                                        }`}
                                        onClick={(e) => handleTogglePrivate(e)}
                                    >
                                        {isPrivate ? <RiLockLine /> : <RiLockUnlockLine />}
                                    </button>
                                )}
                            {/* Delete Button */}
                            {(username === imageUsername || role === "admin") &&
                                !removeDelete &&
                                !banned && (
                                    <button
                                        title="Delete"
                                        className="text-white dark:text-white h-8 w-8 border border-white dark:border-white rounded inline-flex text-base justify-center items-center hover:border-primary hover:text-primary"
                                        onClick={() => setIsDeleteModalOpen(true)}
                                    >
                                        <RiDeleteBinLine />
                                    </button>
                                )}
                        </div>
                        <div className="indicators flex flex-col items-end gap-0.5 absolute left-auto right-0 transition-all duration-200  top-1/2 transform -translate-y-1/2 z-20">
                            {isFeatured && (
                                <span className="bg-blue-500 px-1 py0.5 text-white text-sm text-right">
                                    Featured
                                </span>
                            )}
                        </div>
                    </React.Fragment>
                )}
            </div>
        </React.Fragment>
    );
};

export default PopupImage;
