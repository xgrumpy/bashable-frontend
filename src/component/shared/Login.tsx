import { useAuthContext } from "@/context/authContext";
import { useNotificationContext } from "@/context/notificationContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { RiAppleLine, RiGoogleFill, RiMicrosoftLine } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";
import EmailVerification from "./EmailVerification";
import Modal from "./Modal";

interface ILoginProps {
    signupHandler: (value: string) => void;
    closeHandler: () => void;
}

type TFormValues = {
    email: string;
    password: string;
};

const Login = ({ signupHandler, closeHandler }: ILoginProps) => {
    const [isIpBlockedPopupOpen, setIsIpBlockedPopupOpen] = useState<boolean>(false);
    const [isBannedPopupOpen, setIsBannedPopupOpen] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [verificationMailboxOpen, setVerificationMailboxOpen] = useState<boolean>(false);

    const { login } = useAuthContext();
    const { initNotifications } = useNotificationContext();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormValues>();

    const watchEmail = watch("email");

    const onSubmit = (data: TFormValues) => {
        setIsLoading(true);
        axiosReq
            .post("/users/signin", {
                email: data.email,
                password: data.password,
            })
            .then((res) => {
                if (res.data.banned) {
                    setIsBannedPopupOpen(true);
                }
                delete res.data.message;
                login(res.data);
                setSuccess(res.data.message);
                setError(null);
                toast.success("Successfully Logged In");
                closeHandler();
                axiosReq
                    .get("/users/notifications")
                    .then((res: any) => {
                        initNotifications(res.data);
                    })
                    .catch((err: any) => {
                        console.log(err);
                    });
            })
            .catch((err) => {
                setSuccess(null);
                if (err?.response?.data?.emailNotVerified) {
                    setError("Email is not verified!");
                    setVerificationMailboxOpen(true);
                } else if (err?.response?.data?.deleted) {
                    setError("Account was deleted!");
                } else if (err?.response?.data?.ip_banned) {
                    setIsIpBlockedPopupOpen(true);
                } else {
                    setError(err?.response?.data?.message);
                    toastError(err);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const forgotPasswordHandler = (e: SyntheticEvent) => {
        e.preventDefault();
        router.push("/forgot-password");
        closeHandler();
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
            <Modal state={isBannedPopupOpen} closeHandler={() => setIsBannedPopupOpen(false)}>
                <div className="max-w-lg border border-border mx-auto bg-red-950 py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="text-center">
                        <h5 className="text-lg text-center font-bold text-black dark:text-white mb-2">
                            This account has been suspended.{" "}
                            <Link
                                href="/blogs/how-do-i-contact-support"
                                className="underline hover:text-primary"
                            >
                                Please contact support
                            </Link>
                        </h5>
                        <button className="btn mt-5" onClick={() => setIsBannedPopupOpen(false)}>
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
            <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                <h4 className="text-xl text-center font-bold text-black dark:text-white">Log In</h4>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-8">
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
                    <div className="text-center">
                        <button type="submit" className="btn" tabIndex={1} disabled={isLoading}>
                            Log In
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
                <p className="mt-5 text-bodylight dark:text-body">
                    Not have an account?{" "}
                    <button
                        onClick={() => signupHandler("signup")}
                        className="transition-all border-none bg-transparent focus:outline-none focus:border-none outline-none text-black dark:text-white hover:text-primary"
                    >
                        Create now
                    </button>
                </p>
                <p className="mt-1 text-bodylight dark:text-body">
                    <button
                        onClick={forgotPasswordHandler}
                        className="transition-all border-none bg-transparent focus:outline-none focus:border-none outline-none text-black dark:text-white hover:text-primary"
                    >
                        Forgot your password?
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

export default Login;
