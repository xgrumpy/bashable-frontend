"use client";

import headerLogoLight from "@/assets/images/logo-light.png";
import headerLogo from "@/assets/images/logo.png";
import PhoneVerify from "@/component/layout/helpers/PhoneVerify";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { useNotificationContext } from "@/context/notificationContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { hasUnread, imageLoader } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun, HiOutlineUser } from "react-icons/hi2";
import { RiSearch2Line } from "react-icons/ri";
import { RxDiscordLogo } from "react-icons/rx";
import Login from "../shared/Login";
import Modal from "../shared/Modal";
import Notificaction from "../shared/Notificaction";
import Signup from "../shared/Signup";

function Header() {
    const [isMounted, setIsMounted] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
    const [sticky, setSticky] = useState<boolean>(false);

    const { username, role, logout, credits, avatar, banned, login, isBetaTester } =
        useAuthContext();
    const {
        darkmode,
        initTheme,
        toggleDarkMode,
        authBoxStatus,
        changeAuthBoxStatus,
        mobileVerifyBoxStatus,
        changeMobileVerifyBoxStatus,
    } = useAppContext();
    const { notifications, addNotification, markAllAsRead } = useNotificationContext();

    const menuRef = useRef<HTMLDivElement>(null);
    const notificationRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
        if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
            setIsNotificationOpen(false);
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setSticky(true);
        } else {
            setSticky(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        if (username) {
            let interval: any;
            interval = setInterval(() => {
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                    })
                    .catch((err) => console.error(err));
            }, 30000);
            return () => clearInterval(interval);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDiscord = () => {
        window.open(process.env.NEXT_PUBLIC_DISCORD_LINK, "_blank");
    };

    const handleDarkToggle = () => {
        toggleDarkMode();
        initTheme();
    };

    const handleLogout = () => {
        axiosReq
            .get("/users/logout")
            .then((_res) => {
                logout();
                router.push("/");
            })
            .catch((err) => console.log(err));
        setIsUserMenuOpen(false);
    };

    const handleMarkAllAsRead = () => {
        axiosReq
            .get("/users/notifications/read")
            .then((res) => {
                markAllAsRead();
                toast.success(res.data.message);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    if (!isMounted) return null;

    return (
        <>
            <Modal
                state={mobileVerifyBoxStatus}
                closeHandler={() => changeMobileVerifyBoxStatus(false)}
            >
                <PhoneVerify closeModal={() => changeMobileVerifyBoxStatus(false)} />
            </Modal>
            <Modal state={!!authBoxStatus} closeHandler={() => changeAuthBoxStatus("")}>
                {authBoxStatus === "signup" ? (
                    <Signup loginHandler={() => changeAuthBoxStatus("login")} />
                ) : null}
                {authBoxStatus === "login" ? (
                    <Login
                        closeHandler={() => changeAuthBoxStatus("")}
                        signupHandler={() => changeAuthBoxStatus("signup")}
                    />
                ) : null}
            </Modal>
            <header
                className={`header z-40 fixed left-0 top-0 w-full right-0 border-b py-4 px-4 md:px-8 ${
                    sticky
                        ? "bg-white dark:bg-dark border-borderlight dark:border-border"
                        : "bg-transparent border-transparent"
                }`}
            >
                <div className="inner relative flex gap-x-3 justify-between items-center">
                    <Link
                        href="/"
                        className="logo flex items-center h-5 text-2xl font-semibold text-black dark:text-white"
                    >
                        {darkmode ? (
                            <Image
                                src={headerLogo.src}
                                height={headerLogo.height}
                                width={headerLogo.width}
                                alt="bashable.art"
                                loading="eager"
                                className="h-full w-auto mr-2"
                            />
                        ) : (
                            <Image
                                src={headerLogoLight.src}
                                height={headerLogoLight.height}
                                width={headerLogoLight.width}
                                alt="bashable.art"
                                loading="eager"
                                className="h-full w-auto mr-2"
                            />
                        )}
                        <span className="hidden md:inline">
                            Bashable<span className="text-primary">.art</span>
                        </span>
                    </Link>
                    <div className="others flex items-center gap-x-3 sm:gap-x-4 md:gap-x-5">
                        <div className="searchuser">
                            <Link
                                href={"/search/user"}
                                className="inline-flex justify-center border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 text-black dark:text-white rounded-full items-center h-10 w-10 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all"
                                title="Search User"
                            >
                                <RiSearch2Line className="text-xl" />
                            </Link>
                        </div>
                        <button
                            onClick={handleDarkToggle}
                            className="inline-flex justify-center border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 text-black dark:text-white rounded-full items-center h-10 w-10 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all"
                        >
                            {darkmode ? (
                                <HiOutlineMoon className="text-xl" />
                            ) : (
                                <HiOutlineSun className="text-2xl" />
                            )}
                        </button>
                        {username ? (
                            <div className="notifications static sm:relative">
                                <button
                                    className="relative inline-flex justify-center border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 text-black dark:text-white rounded-full items-center h-10 w-10 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all"
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                >
                                    <HiOutlineBell className="text-2xl mr-0" />
                                    {notifications &&
                                    notifications.length &&
                                    hasUnread(notifications) ? (
                                        <span className="absolute left-auto -right-0 -top-0 h-2 w-2 bg-red-500 rounded-full">
                                            <span className="absolute bg-red-500 h-3 w-3 rounded-full left-1/2 top-1/2 -ml-1.5 -mt-1.5 animate-ping"></span>
                                        </span>
                                    ) : null}
                                </button>
                                {isNotificationOpen && (
                                    <div
                                        ref={notificationRef}
                                        className="absolute left-auto right-0 top-full mt-4 min-w-[250px] max-w-[320px] bg-white dark:bg-dark border border-borderlight dark:border-border rounded-md z-30"
                                    >
                                        {notifications && notifications.length ? (
                                            <>
                                                <div className="max-h-52 overflow-y-auto">
                                                    {notifications.map((item) => (
                                                        <Notificaction
                                                            key={item.id}
                                                            data={item}
                                                            closeNotifications={() =>
                                                                setIsNotificationOpen(false)
                                                            }
                                                        />
                                                    ))}
                                                </div>
                                                <div className="text-center py-1.5 border-t border-borderlight dark:border-border">
                                                    <button
                                                        className="text-sm font-semibold text-primary"
                                                        onClick={handleMarkAllAsRead}
                                                    >
                                                        Mark all as read
                                                    </button>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="py-1.5 px-3 text-center text-yellow-500">
                                                There is no notifications!
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <button
                            onClick={handleDiscord}
                            className="inline-flex justify-center border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 text-black dark:text-white rounded-full items-center h-10 w-10 hover:text-primary dark:hover:text-primary hover:border-primary dark:hover:border-primary transition-all"
                        >
                            <RxDiscordLogo className="text-xl" />
                        </button>
                        <div className="auth relative">
                            <div className="flex items-center gap-x-2">
                                {username ? (
                                    <div className="userinfo flex gap-2">
                                        <div className="info text-right hidden md:block">
                                            <h6 className="mb-0">
                                                Credits:{" "}
                                                <span className="text-black dark:text-white font-semibold">
                                                    {credits.toFixed(3)}
                                                </span>
                                            </h6>
                                            <div className="flex justify-between gap-2">
                                                {!banned && (
                                                    <Link
                                                        href="/buy-credits"
                                                        className="text-sm font-semibold text-secondary hover:underline"
                                                    >
                                                        Buy Credits
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/blogs/how-to-earn-credits!"
                                                    className="text-sm font-semibold text-secondary hover:underline"
                                                >
                                                    Earn Credits
                                                </Link>
                                            </div>
                                        </div>
                                        <button
                                            className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        >
                                            {avatar ? (
                                                <Image
                                                    loader={imageLoader}
                                                    src={avatar}
                                                    alt={username}
                                                    className="h-full w-full"
                                                    fill
                                                />
                                            ) : (
                                                <span className="select-none">
                                                    {username.trim()[0]}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="userinfo flex items-center gap-2">
                                        <div className="pricing hidden md:block">
                                            <Link
                                                href="/buy-credits"
                                                className="font-semibold text-black dark:text-white hover:!text-secondary"
                                            >
                                                See Pricing
                                            </Link>
                                        </div>
                                        <button
                                            className="avatar transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center items-center rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        >
                                            <HiOutlineUser className="text-2xl mr-0" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {isUserMenuOpen && (
                                <div
                                    ref={menuRef}
                                    className="absolute left-auto right-0 top-full mt-4 min-w-[250px] max-w-[320px] bg-white dark:bg-dark border border-borderlight dark:border-border p-4 rounded-md z-30"
                                >
                                    {username ? (
                                        <div className="block md:hidden transition-all text-black dark:text-white font-medium border-b border-lightborder dark:border-border pb-2 mb-2">
                                            <div className="flex flex-wrap justify-between items-center gap-2">
                                                <span className="">{username}</span>
                                                <span className="text-sm block dark:text-body text-bodylight">
                                                    {credits?.toFixed(3)} Credits
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap justify-between gap-2 mt-1">
                                                {!banned && (
                                                    <Link
                                                        href="/buy-credits"
                                                        className="text-sm font-semibold text-secondary"
                                                    >
                                                        Buy Credits
                                                    </Link>
                                                )}
                                                <Link
                                                    href="/blogs/how-to-earn-credits!"
                                                    className="text-sm font-semibold text-secondary"
                                                >
                                                    Earn Credits
                                                </Link>
                                            </div>
                                        </div>
                                    ) : null}
                                    <ul className="space-y-1">
                                        {username && (role === "admin" || role === "mod") ? (
                                            <li>
                                                <Link
                                                    href="/dashboard"
                                                    className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Dashboard
                                                </Link>
                                            </li>
                                        ) : (
                                            <div className="pricing block md:hidden">
                                                <Link
                                                    href="/buy-credits"
                                                    className="block font-semibold text-black dark:text-white hover:!text-secondary"
                                                >
                                                    See Pricing
                                                </Link>
                                            </div>
                                        )}
                                        {!banned && (
                                            <li>
                                                <Link
                                                    href="/generate"
                                                    className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Generate Image
                                                </Link>
                                            </li>
                                        )}
                                        {!banned && (
                                            <li>
                                                <Link
                                                    href="/upscale"
                                                    className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    Upscale Image
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <Link
                                                href="/showcase"
                                                className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Showcase
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                href="/discover"
                                                className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                Discover
                                            </Link>
                                        </li>
                                        {/* <li>
                                              <Link
                                                href="/forum"
                                                className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                              >
                                                Visit Forum
                                              </Link>
                                            </li> */}
                                        {username ? (
                                            <>
                                                {!banned && (
                                                    <li>
                                                        <Link
                                                            href="/buy-credits"
                                                            className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            Buy Credits
                                                        </Link>
                                                    </li>
                                                )}
                                                <li>
                                                    <Link
                                                        href="/myprofile"
                                                        className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        My Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/account"
                                                        className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        My Account
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        href="/myprofile/quests"
                                                        className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                        onClick={() => setIsUserMenuOpen(false)}
                                                    >
                                                        My Quests
                                                    </Link>
                                                </li>
                                                {/* <li>
                                                    <Link
                                                        href="/myprofile/generations"
                                                        className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                        onClick={() =>
                                                            setIsUserMenuOpen(
                                                                false
                                                            )
                                                        }
                                                    >
                                                        My Generations
                                                    </Link>
                                                </li> */}
                                                {isBetaTester && (
                                                    <li>
                                                        <Link
                                                            href="/chat"
                                                            className="text-bodylight block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                            onClick={() => setIsUserMenuOpen(false)}
                                                        >
                                                            Chatroom
                                                        </Link>
                                                    </li>
                                                )}
                                                <li>
                                                    <button
                                                        className="text-bodylight !block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                        onClick={() => handleLogout()}
                                                    >
                                                        Logout
                                                    </button>
                                                </li>
                                            </>
                                        ) : (
                                            <li>
                                                <button
                                                    className="text-bodylight !block dark:text-body dark:hover:text-primary hover:text-primary text-sm"
                                                    onClick={() => changeAuthBoxStatus("login")}
                                                >
                                                    Login / Create Account
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
