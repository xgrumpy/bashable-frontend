"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { HiPhoto } from "react-icons/hi2";
import axiosReq from "@/utils/axios";
import Image from "next/image";
import DashboardMenu from "@/component/layout/DashboardMenu";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { customReadFile } from "@/utils/utils";
import { toastError } from "@/utils/error";
import MarkdownEditor from "@/component/shared/MarkdownEditor";

type TFormValues = {
    title: string;
};

const EditArticle = () => {
    const searchParams = useSearchParams();
    const slug = searchParams.get("slug");
    const articleId = searchParams.get("id");

    const [success, setSuccess] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [articleImage, setArticleImage] = useState<File | null>(null);
    const [articleImageError, setArticleImageError] = useState<string>("");
    const [content, setContent] = useState("hello");

    const { data: articleData } = useFetch(`/public/articles/${slug}`);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<TFormValues>({
        values: {
            title: articleData?.title,
        },
    });

    useEffect(() => {
        setContent(articleData?.content);
    }, [articleData]);

    const handleUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files !== null) {
            const MAX_FILE_SIZE = 5 * 1024 * 1024;
            if (e.target.files[0].size > MAX_FILE_SIZE) {
                setArticleImageError("File size is larger than 5MB");
            } else {
                setArticleImageError("");
                setArticleImage(e.target.files[0]);
            }
        }
    };

    const handleMarkdownUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const content = await customReadFile(file);
            setContent(content);
            toast.success(
                "Successfully uploaded file content and added to your markdown editor"
            );
        } catch (err) {
            toastError(err);
        }
    };

    const onSubmit = (data: TFormValues) => {
        if (!content) {
            setError("Content is required");
        } else {
            const formData = new FormData();
            formData.append("image", articleImage || "");
            formData.append("title", data.title);
            formData.append("content", content || "");

            axiosReq
                .post(`/admin/articles/${articleId}`, formData, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    setSuccess(res.data.message);
                    setError("");
                    toast.success("Successfully updated");
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
                        <div className="border border-borderlight dark:border-border mx-auto bg-white dark:bg-dark py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                            <h4 className="text-xl text-center font-bold text-black dark:text-white">
                                Edit Article
                            </h4>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4 mt-8"
                            >
                                <div className="uploadbox">
                                    <div className="upload text-center">
                                        <label
                                            htmlFor="articleImage"
                                            className="inline-block max-w-[386px] w-full text-center"
                                        >
                                            <div className="relative inline-flex text-center overflow-hidden w-full max-w-[386px] aspect-video justify-center items-center rounded-lg border border-borderlight dark:border-border">
                                                {articleImage ? (
                                                    <Image
                                                        src={URL.createObjectURL(
                                                            articleImage
                                                        )}
                                                        alt="upload image"
                                                        fill
                                                    />
                                                ) : articleData?.image ? (
                                                    <Image
                                                        src={articleData?.image}
                                                        alt="upload image"
                                                        fill
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <HiPhoto className="text-3xl text-bodylight dark:text-body inline-block" />
                                                        <p className="text-sm mt-4 text-bodylight dark:text-body">
                                                            Upload image ratio
                                                            1200 * 675
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                name="articleImage"
                                                id="articleImage"
                                                className="!hidden"
                                                accept="image/*"
                                                onChange={handleUpload}
                                            />
                                        </label>
                                        {articleImageError && (
                                            <p className="message text-red-500 mt-2">
                                                {articleImageError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="inputbox">
                                    <label htmlFor="">Title</label>
                                    <input
                                        type="text"
                                        placeholder="Enter your title"
                                        {...register("title", {
                                            required: {
                                                value: true,
                                                message: "Title is required",
                                            },
                                            minLength: {
                                                value: 8,
                                                message:
                                                    "Mininum 8 characters required",
                                            },
                                        })}
                                    />
                                    {errors.title?.message && (
                                        <p className="message text-red-500 mt-2">
                                            {errors.title?.message}
                                        </p>
                                    )}
                                </div>
                                <div className="editorbox">
                                    <label htmlFor="">Content</label>
                                    <MarkdownEditor
                                        value={content}
                                        setValue={setContent}
                                    />
                                </div>
                                {!content && (
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
                                <div className="text-center">
                                    <button type="submit" className="btn">
                                        Update
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

export default EditArticle;
