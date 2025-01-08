import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RiAppleLine, RiGoogleFill, RiMicrosoftLine } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";
import EmailVerification from "./EmailVerification";
import Modal from "./Modal";

interface ISignupProps {
    loginHandler: (value: string) => void;
}

type TFormValues = {
    username: string;
    email: string;
    password: string;
    receiveTipEmail: boolean;
    referralCode?: string;
};

const Signup = ({ loginHandler }: ISignupProps) => {
    const [isIpBlockedPopupOpen, setIsIpBlockedPopupOpen] = useState<boolean>(false);
    const [isReferralBoxOpen, setIsReferralBoxOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [verificationMailboxOpen, setVerificationMailboxOpen] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormValues>({
        defaultValues: {
            receiveTipEmail: true,
        },
    });

    const watchEmail = watch("email");

    const onSubmit = (data: TFormValues) => {
        data.receiveTipEmail = data.receiveTipEmail || false;
        setIsLoading(true);
        axiosReq
            .post("/users/signup", data)
            .then((res) => {
                setSuccess(res.data.message);
                setError(false);
                toast.success("Account successfully created");
                setVerificationMailboxOpen(true);
            })
            .catch((err) => {
                setError(err.response.data.message);
                setSuccess(false);
                if (err.response.data.ip_banned) {
                    setIsIpBlockedPopupOpen(true);
                }
                toastError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const googleLogin = () => {
        if (typeof window !== "undefined") {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/users/google/callback`, "_self");
        }
    };

    const discordLogin = () => {
        if (typeof window !== "undefined") {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/users/discord/callback`, "_self");
        }
    };

    const microsoftLogin = () => {
        if (typeof window !== "undefined") {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/users/microsoft/callback`, "_self");
        }
    };

    const appleLogin = () => {
        if (typeof window !== "undefined") {
            window.open(`${process.env.NEXT_PUBLIC_API_URL}/users/apple/callback`, "_self");
        }
    };

    return (
        <>
            <Modal state={isIpBlockedPopupOpen} closeHandler={() => setIsIpBlockedPopupOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <h5 className="text-2xl text-black dark:text-white font-semibold mb-2">
                            You are banned!
                        </h5>
                        <p className="mb-4">
                            This IP has been banned. If you think this was a mistake then please{" "}
                            <Link href="/blogs/how-do-i-contact-support">contact the support.</Link>
                        </p>
                    </div>
                </div>
            </Modal>
            <div className="max-w-lg border border-borderlight dark:border-border mx-auto bg-grey dark:bg-light py-10 px-10 rounded-2xl w-full">
                <h4 className="text-xl text-center font-bold text-black dark:text-white">
                    Sign Up
                </h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
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
                        />
                        {errors.username?.message && (
                            <p className="message text-red-500 mt-2">{errors.username?.message}</p>
                        )}
                    </div>
                    <div className="inputbox">
                        <label htmlFor="">Email address</label>
                        <input
                            type="text"
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
                        />
                        {errors.email?.message && (
                            <p className="message text-red-500 mt-2">{errors.email?.message}</p>
                        )}
                    </div>
                    <div className="inputbox">
                        <label htmlFor="">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: {
                                    value: true,
                                    message: "Password is required",
                                },
                                minLength: {
                                    value: 8,
                                    message: "Mininum 8 characters required",
                                },
                            })}
                        />
                        {errors.password?.message && (
                            <p className="message text-red-500 mt-2">{errors.password?.message}</p>
                        )}
                    </div>
                    <div className="flex items-center">
                        <div className="switchbox">
                            <input
                                type="checkbox"
                                id="have-coupon"
                                onChange={() => setIsReferralBoxOpen(!isReferralBoxOpen)}
                            />
                            <label htmlFor="have-coupon"></label>
                        </div>
                        <label
                            htmlFor="have-coupon"
                            className="text-sm text-bodylight font-semibold dark:text-body cursor-pointer"
                        >
                            Have referral code?
                        </label>
                    </div>
                    {isReferralBoxOpen && (
                        <div className="inputbox">
                            <label htmlFor="">Referral Code</label>
                            <input
                                type="text"
                                placeholder="Enter referral code"
                                {...register("referralCode")}
                            />
                            {errors.referralCode?.message && (
                                <p className="message text-red-500 mt-2">
                                    {errors.referralCode?.message}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex items-center">
                        <div className="switchbox">
                            <input
                                type="checkbox"
                                id="receive-notification"
                                {...register("receiveTipEmail")}
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
                    <div className="text-center">
                        <button type="submit" className="btn" disabled={isLoading}>
                            Sign Up
                        </button>
                    </div>
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
                {verificationMailboxOpen ? <EmailVerification email={watchEmail} /> : null}
                <p className="mt-5">
                    <a href="" className="text-black dark:text-white hover:text-primary">
                        Forgot Password?
                    </a>
                </p>
                <p className="text-bodylight dark:text-body">
                    Already have an account?{" "}
                    <button
                        onClick={() => loginHandler("login")}
                        className="transition-all border-none bg-transparent focus:outline-none focus:border-none outline-none text-black dark:text-white hover:text-primary"
                    >
                        Log in
                    </button>
                </p>
                <span className="text-center block py-6 text-bodylight dark:text-body">or,</span>
                <div className="space-y-3">
                    <button className="btn flex items-center w-full" onClick={googleLogin}>
                        <RiGoogleFill className="mr-1 inline-block text-xl" /> Login with Google
                    </button>
                    <button className="btn flex items-center w-full" onClick={discordLogin}>
                        <RxDiscordLogo className="mr-1 inline-block text-xl" /> Login with Discord
                    </button>
                    <button className="btn flex items-center w-full" onClick={microsoftLogin}>
                        <RiMicrosoftLine className="mr-1 inline-block text-xl" /> Login with
                        Microsoft
                    </button>
                    <button className="btn flex items-center w-full" onClick={appleLogin}>
                        <RiAppleLine className="mr-1 inline-block text-xl" /> Login with Apple
                    </button>
                </div>
            </div>
        </>
    );
};

export default Signup;
