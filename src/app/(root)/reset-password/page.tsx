"use client";

import axiosReq from "@/utils/axios";
import { useAuthContext } from "@root/src/context/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type TFormValues = {
    password: string;
    confirmPassword: string;
};

const ResetPassword = () => {
    const searchParams = useSearchParams();
    const resetToken = searchParams.get("token");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const router = useRouter();
    const { login } = useAuthContext();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TFormValues>();

    const onSubmit = (data: TFormValues) => {
        setErrorMessage("");
        setSuccessMessage("");
        if (data.password !== data.confirmPassword) {
            setErrorMessage("Confirm password not match!");
            return;
        }
        axiosReq
            .post("/users/forget-password/reset", {
                ...data,
                token: resetToken,
            })
            .then((res) => {
                reset();
                axiosReq
                    .get("/users/login/check")
                    .then((res: any) => {
                        login(res.data);
                        router.push("/");
                    })
                    .catch(() => {});
            })
            .catch((err) => {
                setSuccessMessage("");
                setErrorMessage(err?.response?.data?.message);
            });
    };

    return (
        <main className="content">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-center items-center min-h-screen w-full flex-col gap-4">
                    <h5 className="font-medium text-black dark:text-white text-xl">
                        Reset your password.
                    </h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        <div className="inputbox">
                            <input
                                type="password"
                                placeholder="Enter new password"
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
                                <p className="message text-red-500 mt-2">
                                    {errors.password?.message}
                                </p>
                            )}
                        </div>
                        <div className="inputbox">
                            <input
                                type="password"
                                placeholder="Confirm your password"
                                {...register("confirmPassword", {
                                    required: {
                                        value: true,
                                        message: "Confirm password is required",
                                    },
                                    minLength: {
                                        value: 8,
                                        message: "Mininum 8 characters required",
                                    },
                                })}
                            />
                            {errors.confirmPassword?.message && (
                                <p className="message text-red-500 mt-2">
                                    {errors.confirmPassword?.message}
                                </p>
                            )}
                        </div>
                        <div className="inputbox text-center">
                            <button type="submit" className="btn" disabled={isSubmitting}>
                                Submit
                            </button>
                        </div>
                        {successMessage && (
                            <p className="message bg-green-500 text-green-500 bg-opacity-10 rounded-md px-5 py-2 border border-green-500">
                                {successMessage}
                            </p>
                        )}
                        {errorMessage && (
                            <p className="message bg-red-500 text-red-500 bg-opacity-10 rounded-md px-5 py-2 border border-red-500">
                                {errorMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
