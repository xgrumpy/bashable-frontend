"use client";

import axiosReq from "@/utils/axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type TFormValues = {
    email: string;
};

const ForgotPassword = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

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
        axiosReq
            .post("/users/forget-password/request", data)
            .then((res) => {
                reset();
                setErrorMessage("");
                setSuccessMessage(res.data.message);
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
                        Did you forget your password? Enter the email for the account.
                    </h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
                        <div className="inputbox">
                            <input
                                type="text"
                                placeholder="Type email here..."
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

export default ForgotPassword;
