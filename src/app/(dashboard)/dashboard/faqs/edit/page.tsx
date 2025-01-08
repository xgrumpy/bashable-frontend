"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axiosReq from "@/utils/axios";
import DashboardMenu from "@/component/layout/DashboardMenu";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { customReadFile } from "@/utils/utils";
import { toastError } from "@/utils/error";
import MarkdownEditor from "@/component/shared/MarkdownEditor";

type TFormValues = {
    question: string;
    priority: number;
};

const EditFaq = () => {
    const searchParams = useSearchParams();
    const faqId = searchParams.get("id");

    const [answer, setAnswer] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");

    const { data: faqData } = useFetch(`/public/faqs/${faqId}`);

    useEffect(() => {
        setAnswer(faqData?.answer);
    }, [faqData]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<TFormValues>({
        values: {
            question: faqData?.question,
            priority: faqData?.priority,
        },
    });

    const handleMarkdownUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const content = await customReadFile(file);
            setAnswer(content);
            toast.success(
                "Successfully uploaded file content and added to your markdown editor"
            );
        } catch (err) {
            toastError(err);
        }
    };

    const onSubmit = (data: TFormValues) => {
        if (!answer) {
            setError("Content is required");
        } else {
            axiosReq
                .post(`/admin/faqs/${faqId}`, {
                    question: data.question,
                    priority: data.priority,
                    answer: answer,
                })
                .then((res) => {
                    setSuccess(res.data.message);
                    setError("");
                    toast.success("Successfully edited");
                })
                .catch((err) => {
                    setError(err.response.data.message);
                    setSuccess("");
                    toastError(err);
                });
        }
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <div className="max-w-2xlborder border-borderlight dark:border-border mx-auto bg-white dark:bg-dark py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                            <h4 className="text-xl text-center font-bold text-black dark:text-white">
                                Edit Faq
                            </h4>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4 mt-8"
                            >
                                <div className="inputbox">
                                    <label htmlFor="">Question</label>
                                    <input
                                        type="text"
                                        placeholder="Enter question"
                                        {...register("question", {
                                            required: {
                                                value: true,
                                                message: "Question is required",
                                            },
                                        })}
                                    />
                                    {errors.question?.message && (
                                        <p className="message text-red-500 mt-2">
                                            {errors.question?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="editorbox">
                                    <label htmlFor="">Answer</label>
                                    <MarkdownEditor
                                        value={answer}
                                        setValue={setAnswer}
                                    />
                                </div>
                                {!answer && (
                                    <div className="mduploadbox">
                                        <span className="block mb-3">Or,</span>
                                        <label
                                            htmlFor="markdownFile"
                                            className="inline-block max-w-[386px] w-full text-center"
                                        >
                                            <div className="relative inline-flex text-center overflow-hidden w-full max-w-[386px] justify-center items-center rounded-lg border border-borderlight dark:border-border">
                                                <div className="text-center">
                                                    <p className="text-sm py-3 text-bodylight dark:text-body">
                                                        Upload your markdown
                                                        (.md) file
                                                    </p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                name="markdownFile"
                                                id="markdownFile"
                                                className="!hidden"
                                                accept=".md"
                                                onChange={handleMarkdownUpload}
                                            />
                                        </label>
                                    </div>
                                )}
                                <div className="inputbox">
                                    <label htmlFor="">
                                        Priority{" "}
                                        <span className="text-sm text-bodylight dark:text-body">
                                            (Low priority item show first)
                                        </span>
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="Enter priority"
                                        {...register("priority", {
                                            required: {
                                                value: true,
                                                message: "Priority is required",
                                            },
                                        })}
                                    />
                                    {errors.priority?.message && (
                                        <p className="message text-red-500 mt-2">
                                            {errors.priority?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn">
                                        Save
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
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default EditFaq;
