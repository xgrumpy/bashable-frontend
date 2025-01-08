"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import Modal from "@/component/shared/Modal";
import CustomMessage from "@/component/ui/CustomMessage";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiChevronDown, HiChevronUp, HiPhoto } from "react-icons/hi2";
import { RiDeleteBin6Line } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";

type TFormData = {
    username: string;
    email: string;
    oldPassword?: string;
    password?: string;
    confirmPassword?: string;
    receiveTipEmail: boolean;
    receiveAutoRechargeEmail: boolean;
    autoRecharge: boolean;
    autoRechargeAmount?: number;
};

const EditUser = () => {
    const [isDisconnectPaymentPopupOpen, setIsDisconnectPaymentPopupOpen] =
        useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarError, setAvatarError] = useState<string>("");
    const [changePass, setChangePass] = useState<boolean>(false);
    const [unrestricted, setUnrestricted] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

    const router = useRouter();

    const {
        loginType,
        username: prevUsername,
        email: prevEmail,
        avatar: prevAvatar,
        unrestricted: prevUnrestricted,
        acceptedTerms: prevAcceptedTerms,
        discordConnected,
        login,
        logout,
        referralCode,
        referrals,
        mobileVerified,
        receiveTipEmail,
        receiveAutoRechargeEmail,
        autoRecharge: prevAutoRecharge,
        autoRechargeAmount: prevAutoRechargeAmount,
        restrictedState,
        ageVerified,
        paymentMethodConnected,
        banned,
    } = useAuthContext();

    const { changeMobileVerifyBoxStatus } = useAppContext();

    useEffect(() => {
        if (!prevUsername) {
            router.push("/");
        }
    }, [prevUsername, router]);

    useEffect(() => {
        setUnrestricted(prevUnrestricted);
        setTermsAccepted(prevAcceptedTerms);
    }, [prevUnrestricted, prevAcceptedTerms]);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 2 * 1024 * 1024;
            if (e.target.files[0].size > MAX_FILE_SIZE) {
                setAvatarError("File size is larger than 2MB");
            } else {
                setAvatarError("");
                setAvatar(e.target.files[0]);
            }
        }
    };

    const handleChangePass = (e: SyntheticEvent) => {
        e.preventDefault();
        setChangePass(!changePass);
    };

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormData>({
        values: {
            username: prevUsername,
            email: prevEmail,
            receiveTipEmail: receiveTipEmail || false,
            receiveAutoRechargeEmail: receiveAutoRechargeEmail || false,
            autoRecharge: prevAutoRecharge,
            autoRechargeAmount: prevAutoRechargeAmount,
        },
    });

    let watchAutoRecharge = watch("autoRecharge");

    const onSubmit = (data: TFormData) => {
        const formData = new FormData();
        avatar && formData.append("avatar", avatar);
        formData.append("username", data.username);
        loginType !== "google" &&
            data.oldPassword &&
            formData.append("oldPassword", data.oldPassword || "");
        data.password && formData.append("password", data.password || "");
        data.confirmPassword && formData.append("confirmPassword", data.confirmPassword || "");
        formData.append("receiveTipEmail", data.receiveTipEmail ? "true" : "");
        formData.append("receiveAutoRechargeEmail", data.receiveAutoRechargeEmail ? "true" : "");
        formData.append("autoRecharge", data.autoRecharge ? "true" : "false");
        data.autoRechargeAmount &&
            formData.append(
                "autoRechargeAmount",
                // @ts-ignore
                parseFloat(data.autoRechargeAmount) || 0
            );

        axiosReq
            .post("/users/edit", formData, {
                headers: {
                    "content-type": "multipart/form-data",
                },
            })
            .then((res) => {
                setSuccess(res.data.message);
                setError("");
                toast.success("Successfully updated");
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                setError(err.response.data.message);
                setSuccess("");
                toastError(err);
            });
    };

    const toggleUnrestricted = () => {
        axiosReq
            .get(`/users/unrestrict`)
            .then((res) => {
                setUnrestricted(!unrestricted);
                toast.success(res.data.message);
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.log(err));
                isModalOpen && setIsModalOpen(false);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleAcceptTerms = (e: SyntheticEvent) => {
        axiosReq
            .get("/users/accept")
            .then((res) => {
                setTermsAccepted(true);
                toggleUnrestricted();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleUnrestricted = (e: SyntheticEvent) => {
        e.preventDefault();
        if (banned) return null;

        if (!unrestricted) {
            setIsModalOpen(true);
        } else {
            toggleUnrestricted();
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleDiscordConnect = () => {
        if (typeof window !== "undefined") {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/users/link/discord`, "_self");
        }
    };

    const handleDiscordDisconnect = () => {
        axiosReq
            .get("/users/unlink/discord")
            .then((res) => {
                toast.success(res.data.message);
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleDisconnectPaymentMethod = () => {
        axiosReq
            .post("/buy/detach")
            .then((res) => {
                toast.success("Successfully disconnected payment method!");
                setIsDisconnectPaymentPopupOpen(false);
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.log(err));
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleCopyReferral = () => {
        navigator.clipboard.writeText(referralCode);
        toast.success("Copied referral code");
    };

    const handlePhoneVerify = (e: SyntheticEvent) => {
        e.preventDefault();
        changeMobileVerifyBoxStatus(true);
    };

    const handleDeleteAccount = () => {
        setIsDeleteLoading(true);
        axiosReq
            .delete("/users")
            .then((res) => {
                setIsDeleteModalOpen(false);
                logout();
                router.push("/");
            })
            .catch((err) => {
                toastError(err);
            })
            .finally(() => {
                setIsDeleteLoading(false);
            });
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <ConfirmationModal
                state={isDisconnectPaymentPopupOpen}
                closeHandler={() => setIsDisconnectPaymentPopupOpen(false)}
                acceptHandler={() => handleDisconnectPaymentMethod()}
                declineHandler={() => setIsDisconnectPaymentPopupOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to disconnect current payment methods?
                </h5>
            </ConfirmationModal>
            <Modal state={isModalOpen} closeHandler={closeModal}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-black dark:text-white mb-5">
                        Terms for Unrestricted Mode
                    </h5>
                    <p>
                        By enabling this mode, I recognize that I am 18 years old or more. I assume
                        full responsibility for any content that I generate, download, possess,
                        and/or distribute involving this website. By using the website, I agree to
                        the{" "}
                        <Link href="/terms-conditions" className="underline">
                            Terms of Service
                        </Link>
                        . I understand that website administrators will comply with requests from
                        authorities regarding any content that violates relevant national, federal,
                        state, local, or international law or regulations. I understand that
                        administrators reserve the right to terminate access and report/remove
                        content at thier sole discretion.
                    </p>
                    <div className="flex justify-center items-center gap-5 mt-5">
                        <button className="btn" onClick={handleAcceptTerms}>
                            I Accept
                        </button>
                        <button className="btn" onClick={closeModal}>
                            Decline
                        </button>
                    </div>
                </div>
            </Modal>
            <Modal state={isDeleteModalOpen} closeHandler={() => setIsDeleteModalOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <h5 className="text-lg text-center font-bold text-white">
                        Are you sure, you want to delete your account?
                    </h5>
                    <div className="flex flex-wrap justify-center gap-3 mt-3">
                        <button
                            className="btn !bg-red-500"
                            onClick={handleDeleteAccount}
                            disabled={isDeleteLoading}
                        >
                            Confirm Delete
                        </button>
                        <button className="btn" onClick={() => setIsDeleteModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                    {isDeleteLoading ? (
                        <CustomMessage msg="Please wait!!! Your account is deleting..." />
                    ) : null}
                </div>
            </Modal>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white dark:bg-dark border border-borderlight dark:border-border p-5 md:p-10 rounded-lg">
                                <h2 className="dark:text-white text-black text-3xl font-bold text-center">
                                    <Link
                                        href={`/profiles/${encodeURIComponent(prevUsername)}`}
                                        className="dark:text-white text-black hover:!text-primary"
                                    >
                                        My Account
                                    </Link>
                                </h2>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
                                    <div className="uploadbox">
                                        <div className="upload text-center">
                                            <label htmlFor="avatar" className="text-center">
                                                <div className="relative inline-flex overflow-hidden h-24 w-24 justify-center items-center rounded-full border dark:border-border border-borderlight">
                                                    {avatar ? (
                                                        <Image
                                                            src={URL.createObjectURL(avatar)}
                                                            alt="image"
                                                            fill
                                                        />
                                                    ) : prevAvatar ? (
                                                        <Image
                                                            src={prevAvatar}
                                                            alt="upload image"
                                                            fill
                                                        />
                                                    ) : (
                                                        <HiPhoto className="text-xl text-bodylight dark:text-body" />
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    name="avatar"
                                                    id="avatar"
                                                    className="!hidden"
                                                    accept="image/*"
                                                    onChange={handleUpload}
                                                />
                                            </label>
                                            {avatarError && (
                                                <p className="message text-red-500 mt-2">
                                                    {avatarError}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="inputbox">
                                        <label htmlFor="" className="label">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your username"
                                            {...register("username", {
                                                required: {
                                                    value: true,
                                                    message: "Username is required",
                                                },
                                                minLength: {
                                                    value: 5,
                                                    message: "Mininum 5 characters required",
                                                },
                                                pattern: {
                                                    value: /^[^@\[\]]*$/,
                                                    message:
                                                        "Username contains '@' or '[' or ']', please remove these characters.",
                                                },
                                            })}
                                            disabled={banned}
                                        />
                                        {errors.username?.message && (
                                            <p className="message text-red-500 mt-2">
                                                {errors.username?.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="inputbox">
                                        <label htmlFor="">Email address</label>
                                        <input
                                            type="text"
                                            readOnly={true}
                                            placeholder="Enter email address"
                                            {...register("email", {
                                                required: {
                                                    value: true,
                                                    message: "Email is required",
                                                },
                                                pattern: {
                                                    value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                            disabled={banned}
                                        />
                                        {errors.email?.message && (
                                            <p className="message text-red-500 mt-2">
                                                {errors.email?.message}
                                            </p>
                                        )}
                                    </div>
                                    <div className="changepass">
                                        <button
                                            className="flex items-center w-full gap-2 cursor-pointer font-semibold text-lg text-black dark:text-white"
                                            onClick={(e) => handleChangePass(e)}
                                        >
                                            {changePass ? <HiChevronUp /> : <HiChevronDown />}
                                            Change password
                                        </button>
                                    </div>
                                    {changePass && (
                                        <>
                                            {loginType == "local" && (
                                                <div className="inputbox">
                                                    <label htmlFor="">Old Password</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter your old password"
                                                        {...register("oldPassword", {
                                                            required: {
                                                                value: true,
                                                                message: "Password is required",
                                                            },
                                                            minLength: {
                                                                value: 8,
                                                                message:
                                                                    "Mininum 8 characters required",
                                                            },
                                                        })}
                                                        disabled={banned}
                                                    />
                                                    {errors.oldPassword?.message && (
                                                        <p className="message text-red-500 mt-2">
                                                            {errors.oldPassword?.message}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                            <div className="inputbox">
                                                <label htmlFor="">New Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your new password"
                                                    {...register("password", {
                                                        required: {
                                                            value: true,
                                                            message: "Password is required",
                                                        },
                                                        minLength: {
                                                            value: 8,
                                                            message:
                                                                "Mininum 8 characters required",
                                                        },
                                                    })}
                                                    disabled={banned}
                                                />
                                                {errors.password?.message && (
                                                    <p className="message text-red-500 mt-2">
                                                        {errors.password?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="inputbox">
                                                <label htmlFor="">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    placeholder="Enter your new password again"
                                                    {...register("confirmPassword", {
                                                        required: {
                                                            value: true,
                                                            message: "Password is required",
                                                        },
                                                        minLength: {
                                                            value: 8,
                                                            message:
                                                                "Mininum 8 characters required",
                                                        },
                                                    })}
                                                    disabled={banned}
                                                />
                                                {errors.confirmPassword?.message && (
                                                    <p className="message text-red-500 mt-2">
                                                        {errors.confirmPassword?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                    <div className="flex items-center">
                                        <div className="switchbox">
                                            <input
                                                type="checkbox"
                                                id="receive-notification"
                                                {...register("receiveTipEmail")}
                                                disabled={banned}
                                            />
                                            <label htmlFor="receive-notification"></label>
                                        </div>
                                        <label
                                            htmlFor="receive-notification"
                                            className="text-sm text-bodylight font-semibold dark:text-body cursor-pointer"
                                        >
                                            Email me when I receive a tip.{" "}
                                            <Link
                                                href="/blogs/earning-credits-through-tips"
                                                target="_blank"
                                                className="text-sm underline font-normal hover:text-primary"
                                            >
                                                (What are tips?)
                                            </Link>
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="switchbox">
                                            <input
                                                type="checkbox"
                                                id="receive-notification-autorecharge"
                                                {...register("receiveAutoRechargeEmail")}
                                                disabled={banned}
                                            />
                                            <label htmlFor="receive-notification-autorecharge"></label>
                                        </div>
                                        <label
                                            htmlFor="receive-notification-autorecharge"
                                            className="text-sm text-bodylight font-semibold dark:text-body cursor-pointer"
                                        >
                                            Email me when auto recharge happens.
                                        </label>
                                    </div>
                                    {prevAutoRecharge && (
                                        <React.Fragment>
                                            <div className="flex items-center">
                                                <div className="switchbox">
                                                    <input
                                                        type="checkbox"
                                                        id="autoRecharge"
                                                        {...register("autoRecharge")}
                                                        disabled={banned}
                                                    />
                                                    <label htmlFor="autoRecharge"></label>
                                                </div>
                                                <label
                                                    htmlFor="autoRecharge"
                                                    className="text-sm text-bodylight font-semibold dark:text-body cursor-pointer"
                                                >
                                                    Enable auto-recharge when credits is Zero.
                                                </label>
                                            </div>
                                            <div className="inputbox">
                                                <label htmlFor="" className="label">
                                                    Auto recharge Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter autorecharge amount"
                                                    {...register("autoRechargeAmount", {
                                                        min: {
                                                            value: 50,
                                                            message:
                                                                "Auto recharge amount must be larger or equal to 50.",
                                                        },
                                                    })}
                                                    disabled={!watchAutoRecharge || banned}
                                                />
                                                {errors.autoRechargeAmount?.message && (
                                                    <p className="message text-red-500 mt-2">
                                                        {errors.autoRechargeAmount?.message}
                                                    </p>
                                                )}
                                            </div>
                                        </React.Fragment>
                                    )}
                                    {!banned && (
                                        <div className="text-center">
                                            <button type="submit" className="btn">
                                                Save
                                            </button>
                                        </div>
                                    )}
                                    {success && (
                                        <p className="message bg-green-500 text-green-500 bg-opacity-10 rounded-md px-5 py-2 border border-green-500">
                                            {success}
                                        </p>
                                    )}
                                    {error && (
                                        <p className="message bg-red-500 text-red-500 bg-opacity-10 rounded-md px-5 py-2 border border-red-500">
                                            {error}
                                        </p>
                                    )}
                                </form>
                                <h5 className="font-semibold text-lg text-black dark:text-white mb-5 mt-5">
                                    Options
                                </h5>
                                <div className="space-y-4">
                                    <div className="restrictedmode">
                                        <div className="flex items-center">
                                            <div className="switchbox">
                                                <input
                                                    type="checkbox"
                                                    checked={unrestricted}
                                                    onChange={(e) => handleUnrestricted(e)}
                                                    id="unrestricted-mode-control"
                                                    disabled={restrictedState && !ageVerified}
                                                />
                                                <label htmlFor="unrestricted-mode-control"></label>
                                            </div>
                                            <label
                                                htmlFor="unrestricted-mode-control"
                                                className="text-sm text-bodylight dark:text-body font-semibold"
                                            >
                                                Enable Unrestricted Mode
                                            </label>
                                        </div>
                                        {restrictedState && !ageVerified ? (
                                            <p className="text-yellow-500 block text-sm">
                                                (You are not eligible for enable unrestricted mode.{" "}
                                                <Link
                                                    href="/blogs/content-restrictions-in-your-state"
                                                    className="underline font-semibold"
                                                >
                                                    Click to know details.
                                                </Link>
                                                )
                                            </p>
                                        ) : null}
                                    </div>

                                    {/* <div className="phoneverified">
                                        {!mobileVerified ? (
                                            <button
                                                className="btn btn-outline !flex items-center gap-2"
                                                onClick={handlePhoneVerify}
                                            >
                                                <RiPhoneLine className="text-lg" />
                                                <span>Verify Phone Number</span>
                                            </button>
                                        ) : (
                                            <button className="btn !flex items-center gap-2">
                                                <RiPhoneLine className="text-lg" />
                                                <span>
                                                    Phone number verified
                                                </span>
                                            </button>
                                        )}
                                    </div> */}
                                    <div className="discordconnect">
                                        {!discordConnected ? (
                                            <button
                                                className="btn btn-outline !flex items-center gap-2"
                                                onClick={() => handleDiscordConnect()}
                                                disabled={banned}
                                            >
                                                <RxDiscordLogo className="text-lg" />
                                                <span>Connect to Discord</span>
                                            </button>
                                        ) : (
                                            <button
                                                className="btn !flex items-center gap-2"
                                                onClick={() => handleDiscordDisconnect()}
                                                disabled={banned}
                                            >
                                                <RxDiscordLogo className="text-lg" />
                                                <span>Discord Connected</span>
                                            </button>
                                        )}
                                    </div>
                                    <div className="paymentMethodDisconnect">
                                        {paymentMethodConnected ? (
                                            <button
                                                className="btn !flex items-center gap-2"
                                                onClick={() =>
                                                    setIsDisconnectPaymentPopupOpen(true)
                                                }
                                                disabled={banned}
                                            >
                                                <RxDiscordLogo className="text-lg" />
                                                <span>Disconnect Payment Method</span>
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                                <h5 className="font-semibold text-lg text-black dark:text-white mb-5 mt-5">
                                    Referral
                                </h5>
                                <div className="space-y-4">
                                    <h6 className="font-semibold text-xl">
                                        You have total{" "}
                                        <span className="text-black dark:text-white">
                                            {referrals}
                                        </span>{" "}
                                        referrals and earn{" "}
                                        <span className="text-black dark:text-white">
                                            {referrals *
                                                parseInt(
                                                    process.env
                                                        .NEXT_PUBLIC_EARN_CREDITS_PER_REFERRAL as string
                                                )}{" "}
                                        </span>
                                        credits from referrals.
                                    </h6>
                                    <p>
                                        Your referral code:{" "}
                                        <span className="text-black dark:text-white font-bold text-xl">
                                            {referralCode}
                                        </span>
                                    </p>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={handleCopyReferral}
                                    >
                                        Copy referral code
                                    </button>
                                </div>
                                <h5 className="font-semibold text-lg text-black dark:text-white mb-5 mt-5">
                                    Settings
                                </h5>
                                <div className="space-y-4">
                                    <div className="deleteAccount">
                                        <button
                                            className="btn !bg-red-500 !flex items-center gap-2"
                                            onClick={() => setIsDeleteModalOpen(true)}
                                            disabled={banned}
                                        >
                                            <RiDeleteBin6Line className="text-lg" />
                                            <span>Delete Account</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default EditUser;
