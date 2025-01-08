"use client";

import Modal from "@/component/shared/Modal";
import CustomSelect from "@/component/ui/CustomSelect";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { findImageName, imageUrlToBase64, readImageFile } from "@/utils/utils";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    ChangeEvent,
    FormEvent,
    SyntheticEvent,
    useEffect,
    useRef,
    useState,
} from "react";
import { HiPhoto } from "react-icons/hi2";
import { RiDeleteBin3Line } from "react-icons/ri";
import LoaderPlaceholder from "./components/LoaderPlaceholder";

const UpscalePage = () => {
    const searchParams = useSearchParams();
    const imageUrl = searchParams.get("url") || "";

    const uploadboxInputRef = useRef<HTMLInputElement>(null);

    const [isEnoughCreditsPopupOpen, setIsEnoughCreditsPopupOpen] =
        useState<boolean>(false);
    const [isLimitReachedPopupOpen, setIsLimitReachedPopupOpen] =
        useState<boolean>(false);
    const [isIpBlockedPopupOpen, setIsIpBlockedPopupOpen] =
        useState<boolean>(false);
    const [isUserBannedPopupOpen, setIsUserBannedPopupOpen] =
        useState<boolean>(false);

    const [uploadedImage, setUploadedImage] = useState<string>("");
    const [uploadedImageError, setUploadedImageError] = useState<string>("");
    const [currentScale, setCurrentScale] = useState<string>("2");
    const [currentVersion, setCurrentVersion] = useState<string>("230528");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [resultImage, setResultImage] = useState<string>("");

    const { username, credits, updateCredits } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();

    useEffect(() => {
        if (username && credits < 0.001) {
            setIsEnoughCreditsPopupOpen(true);
        }
    }, [username, credits]);

    useEffect(() => {
        if (imageUrl) {
            imageUrlToBase64(imageUrl)
                .then((res) => {
                    setUploadedImage(res as string);
                })
                .catch((err) => {
                    toastError(err);
                });
        }
    }, [imageUrl]);

    const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (e.target.files[0].size > MAX_FILE_SIZE) {
                setUploadedImageError("File size is larger than 5MB");
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

    const handleUpscale = (e: FormEvent) => {
        e.preventDefault();

        if (!uploadedImage) {
            toastError("Image is required");
            return;
        }

        if (!currentScale) {
            toastError("Please select a factor");
            return;
        }

        setIsLoading(true);

        axiosReq
            .post("/upscale", {
                image: uploadedImage.replace(
                    "application/octet-stream",
                    "image/png"
                ),
                factor: parseInt(currentScale),
                version: currentVersion,
            })
            .then((res) => {
                setResultImage(res.data.image);
                updateCredits({ credits: res.data.cost });
            })
            .catch((err) => {
                if (err.response?.data) {
                    const {
                        credit_limited,
                        free_limited,
                        ip_banned,
                        user_banned,
                    } = err.response.data;
                    if (credit_limited) {
                        setIsEnoughCreditsPopupOpen(true);
                    } else if (free_limited) {
                        setIsLimitReachedPopupOpen(true);
                    } else if (ip_banned) {
                        setIsIpBlockedPopupOpen(true);
                    } else if (user_banned) {
                        setIsUserBannedPopupOpen(true);
                    } else {
                        toastError(err);
                    }
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const downloadHandler = () => {
        let name = findImageName(resultImage);
        saveAs(resultImage, `${name}.png` || "bashable.png");
    };

    return (
        <>
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
                            5 free upscales limit reached
                        </h5>
                        <p className="mb-4">
                            To continue upscaling for free, create an account.
                        </p>
                        <button
                            className="btn"
                            onClick={() => changeAuthBoxStatus("signup")}
                        >
                            Create Free Account
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal
                state={isIpBlockedPopupOpen}
                closeHandler={() => setIsIpBlockedPopupOpen(false)}
            >
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <p className="mb-4">
                            This IP has been blocked. If you feel this was a
                            mistake and would like a review, please{" "}
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
                            This account is currently suspended due to creation
                            of content deemed illegal. if you would like for us
                            to consider re-activating the account, please{" "}
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
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
                            <aside className="col-span-1 lg:col-span-4">
                                <div className="bg-white dark:bg-dark rounded-lg px-3 sm:px-5 py-8 border border-borderlight dark:border-border">
                                    <h3 className="text-2xl text-black dark:text-white font-semibold mb-8">
                                        Upscale Image
                                        <span className="block h-0.5 rounded-full w-20 bg-gradient-to-tr from-primary to-secondary mt-3"></span>
                                    </h3>
                                    <form
                                        onSubmit={handleUpscale}
                                        className="inner space-y-6 max-w-md mx-auto"
                                    >
                                        <div className="uploadbox">
                                            <label
                                                htmlFor=""
                                                className="block font-semibold"
                                            >
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
                                        <div className="inputbox">
                                            <label
                                                htmlFor=""
                                                className="block font-semibold"
                                            >
                                                Select Factor
                                                {"(" + currentScale + ")"}
                                            </label>
                                            <input
                                                className="w-full"
                                                type="range"
                                                min="2"
                                                max="4"
                                                value={currentScale}
                                                onChange={(e) =>
                                                    setCurrentScale(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="inputbox">
                                            <label
                                                htmlFor=""
                                                className="block font-semibold"
                                            >
                                                Select Version
                                            </label>
                                            <CustomSelect
                                                current={currentVersion}
                                                setCurrentValue={
                                                    setCurrentVersion
                                                }
                                                fullWidth
                                                items={[
                                                    {
                                                        text: "230528",
                                                        value: "230528",
                                                    },
                                                    {
                                                        text: "230501",
                                                        value: "230501",
                                                    },
                                                ]}
                                            />
                                        </div>
                                        <div className="buttonbox">
                                            <button
                                                type="submit"
                                                className="btn"
                                            >
                                                {isLoading
                                                    ? "Upscaling..."
                                                    : "Upscale Now"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </aside>
                            <aside className="col-span-1 lg:col-span-8">
                                <div className="imagebox">
                                    {isLoading ? (
                                        <LoaderPlaceholder />
                                    ) : resultImage ? (
                                        <div className="box relative pointer-events-none inline-flex flex-col overflow-hidden w-full justify-center items-center rounded-md border border-borderlight dark:border-border">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={resultImage}
                                                alt="uploadedimage"
                                                className="w-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center">
                                            <h4 className="text-bodylight font-medium dark:text-body text-xl p-4 text-center">
                                                Your image will be generated
                                                here.
                                            </h4>
                                        </div>
                                    )}
                                </div>
                                {resultImage ? (
                                    <button
                                        className="btn mt-7"
                                        onClick={downloadHandler}
                                    >
                                        Download
                                    </button>
                                ) : null}
                            </aside>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default UpscalePage;
