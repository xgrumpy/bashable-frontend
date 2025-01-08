"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import settings from "@/settings";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Link from "next/link";
import React, { SyntheticEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

type TFormData = {
    credits: number;
    usd: number;
    paymentmethod: string;
    autoRecharge: boolean;
};

const BuyCredits = () => {
    const { username, autoRecharge, login, banned } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();

    const [isQuickBuyConfirmationModalOpen, setIsQuickBuyConfirmationModalOpen] =
        useState<boolean>(false);
    const [isAutorecharge, setIsAutorecharge] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [creditsAmount, setCreditsAmount] = useState<number>(0);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormData>();

    const buyWithStripe = (credits: number, autorecharge: boolean) => {
        setIsLoading(true);
        axiosReq
            .post("/buy/stripe", {
                credits: credits,
                autoRecharge: autorecharge,
            })
            .then((res) => {
                if (isQuickBuyConfirmationModalOpen) {
                    setIsQuickBuyConfirmationModalOpen(false);
                }
                if (res.data.action === "processing") {
                    toast.success("Payment is processing!");
                } else if (res.data.action === "redirect") {
                    window.location.replace(res.data.url);
                } else {
                    if (res.data.message) toast.success(res.data.message);
                }
                if (isAutorecharge) {
                    axiosReq
                        .get("/users/login/check")
                        .then((res: any) => {
                            login(res.data);
                        })
                        .catch((err) => console.error(err));
                }
            })
            .catch((err) => {
                toastError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const buyWithCrypto = (credits: number) => {
        setIsLoading(true);
        axiosReq
            .post("/buy/coinbase", {
                credits: credits,
            })
            .then((res) => {
                window.location.replace(res.data.url);
            })
            .catch((err) => {
                toastError(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleUsd = (value: number) => {
        if (value >= 14.99 && value < 49.99) {
            setCreditsAmount(value * 11);
        } else if (value >= 49.99) {
            setCreditsAmount(value * 12);
        } else {
            setCreditsAmount(value * 10);
        }
    };

    const onSubmit = (data: TFormData) => {
        data.paymentmethod === "stripe"
            ? buyWithStripe(creditsAmount, isAutorecharge)
            : buyWithCrypto(creditsAmount);
    };

    const handleQuickBuy = (e: SyntheticEvent, credits: number, type: string) => {
        e.preventDefault();
        if (type === "stripe") {
            if (autoRecharge) {
                setIsQuickBuyConfirmationModalOpen(true);
            } else {
                buyWithStripe(credits, isAutorecharge);
            }
        } else {
            buyWithCrypto(credits);
        }
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <ConfirmationModal
                state={isQuickBuyConfirmationModalOpen}
                acceptHandler={() => buyWithStripe(creditsAmount, true)}
                closeHandler={() => setIsQuickBuyConfirmationModalOpen(false)}
                declineHandler={() => setIsQuickBuyConfirmationModalOpen(false)}
                disabled={isLoading}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to buy credits?
                </h5>
            </ConfirmationModal>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-dark border border-borderlight dark:border-border p-5 md:p-10 rounded-lg">
                                <h4 className="mb-7 text-center text-3xl font-bold text-black dark:text-white">
                                    {username ? "Buy Credits" : "Our Pricing"}
                                </h4>
                                {username && (
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="space-y-6 mt-8 mb-10"
                                    >
                                        <div className="inputbox">
                                            <label htmlFor="">Select payment method</label>
                                            <select {...register("paymentmethod")}>
                                                <option value="stripe">Pay with Card</option>
                                                <option value="crypto">Pay with Crypto</option>
                                            </select>
                                        </div>
                                        <div className="flex flex-wrap md:flex-nowrap gap-x-6 gap-y-4">
                                            <div className="inputbox w-full">
                                                <label className="mb-1.5" htmlFor="">
                                                    USD to purchase
                                                </label>
                                                <input
                                                    type="number"
                                                    placeholder="Enter USD"
                                                    {...register("usd", {
                                                        required: {
                                                            value: true,
                                                            message: "USD is required",
                                                        },
                                                        min: {
                                                            value: 5,
                                                            message: "Minimum 5 required",
                                                        },
                                                    })}
                                                    onChange={(e) =>
                                                        handleUsd(parseInt(e.target.value))
                                                    }
                                                />
                                                {errors.usd?.message && (
                                                    <p className="message text-red-500 mt-2">
                                                        {errors.usd?.message}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="inputbox w-full">
                                                <label className="mb-1.5" htmlFor="">
                                                    Credits that will be redeemed:
                                                </label>
                                                <input
                                                    readOnly
                                                    placeholder="0"
                                                    type="number"
                                                    {...register("credits", {
                                                        required: {
                                                            value: true,
                                                            message: "Credit is required",
                                                        },
                                                        min: {
                                                            value: 50,
                                                            message: "Minimum 50 required",
                                                        },
                                                    })}
                                                    value={creditsAmount}
                                                />
                                                {errors.credits?.message && (
                                                    <p className="message text-red-500 mt-2">
                                                        {errors.credits?.message}
                                                    </p>
                                                )}
                                                <Link
                                                    className="text-secondary underline inline-block mt-1"
                                                    href="/blogs/how-do-credits-work"
                                                >
                                                    How do credits work?
                                                </Link>
                                            </div>
                                        </div>
                                        {!autoRecharge ? (
                                            <div className="autorecharge flex items-center">
                                                <div className="switchbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAutorecharge}
                                                        onChange={() =>
                                                            setIsAutorecharge((prev) => !prev)
                                                        }
                                                        id="enable-autorecharge"
                                                    />
                                                    <label htmlFor="enable-autorecharge"></label>
                                                </div>
                                                <label
                                                    htmlFor="enable-autorecharge"
                                                    className="text-black dark:text-white font-semibold cursor-pointer"
                                                >
                                                    Enable auto-recharge when credits is Zero{" "}
                                                    <small className="font-normal">
                                                        (Does not work for crypto payments.)
                                                    </small>
                                                </label>
                                            </div>
                                        ) : (
                                            <p className="text-yellow-500 font-medium">
                                                You have enabled auto recharge in the Account
                                                Settings
                                            </p>
                                        )}
                                        <div className="text-center flex flex-wrap gap-3">
                                            <button
                                                type="submit"
                                                className="btn"
                                                disabled={isLoading || banned}
                                            >
                                                Pay now
                                            </button>
                                        </div>
                                    </form>
                                )}
                                <h5 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                                    Special Packages
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-between">
                                    {settings.QUICK_BUY_PACKAGES.map((item) => (
                                        <div
                                            key={item.id}
                                            className="item bg-grey dark:bg-light border border-borderlight dark:border-border rounded-lg px-4 py-5 text-center"
                                        >
                                            <h5 className="text-2xl mb-2 font-bold text-black dark:text-white">
                                                ${item.usd}
                                            </h5>
                                            <p>{item.credits} credits</p>
                                            <p>~ {item.approxgen} images*</p>
                                            {username && (
                                                <div className="mt-4 flex justify-center gap-3 flex-wrap">
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            setCreditsAmount(item.credits);
                                                            handleQuickBuy(
                                                                e,
                                                                item.credits,
                                                                "stripe"
                                                            );
                                                        }}
                                                        disabled={isLoading || banned}
                                                    >
                                                        Buy Now
                                                    </button>
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            setCreditsAmount(item.credits);
                                                            handleQuickBuy(
                                                                e,
                                                                item.credits,
                                                                "crypto"
                                                            );
                                                        }}
                                                        disabled={isLoading || banned}
                                                    >
                                                        Buy with Crypto
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {username && (
                                    <React.Fragment>
                                        {!autoRecharge ? (
                                            <div className="autorecharge flex items-center mt-5">
                                                <div className="switchbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAutorecharge}
                                                        onChange={() =>
                                                            setIsAutorecharge((prev) => !prev)
                                                        }
                                                        id="enable-autorecharge"
                                                    />
                                                    <label htmlFor="enable-autorecharge"></label>
                                                </div>
                                                <label
                                                    htmlFor="enable-autorecharge"
                                                    className="text-black dark:text-white font-semibold cursor-pointer"
                                                >
                                                    Enable auto-recharge when credits is Zero{" "}
                                                    <small className="font-normal">
                                                        (Does not work for crypto payments.)
                                                    </small>
                                                </label>
                                            </div>
                                        ) : (
                                            <p className="text-yellow-500 font-medium mt-5">
                                                You have enabled auto recharge in the Account
                                                Settings
                                            </p>
                                        )}
                                    </React.Fragment>
                                )}
                                {!username && (
                                    <div className="text-center mt-8">
                                        <button
                                            className="btn btn-lg"
                                            onClick={() => changeAuthBoxStatus("signup")}
                                        >
                                            Create Account{" "}
                                            <span className="block md:inline text-sm font-semibold opacity-70 lowercase">
                                                (with 5 free starter credits)
                                            </span>
                                        </button>
                                    </div>
                                )}
                                <p className="mt-8">
                                    * Estimate with default settings, actual image count will vary
                                    depending on the generation parameters you select
                                </p>
                                <br></br>
                                <h4 className="mb-2 text-2xl font-semibold text-black dark:text-white">
                                    Earn Credits
                                </h4>
                                <p>
                                    If you aren&apos;t quite ready to spend money yet, we
                                    understand.{" "}
                                    <Link
                                        className="underline hover:text-primary font-semibold"
                                        href="https://bashable.art/blogs/how-to-earn-credits!"
                                    >
                                        Click here to learn how you can earn credits!
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default BuyCredits;
