"use client";

import MarkdownEditorWithoutImageList from "@root/src/component/shared/MarkdownEditorWithoutImageList";
import { useCreatePoll } from "@root/src/hooks/admin/useDiscordPoll";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent, SyntheticEvent, useState } from "react";
import { FiPlusCircle, FiX } from "react-icons/fi";

type TOption = {
    id: number;
    text: string;
};

const CreatePollPage = () => {
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [useUpvoteDownvote, setUseUpvoteDownvote] = useState(true);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState<string>("");
    const [options, setOptions] = useState<TOption[]>([
        {
            id: 1,
            text: "",
        },
        { id: 2, text: "" },
    ]);

    const router = useRouter();
    const { mutate: createPoll, isLoading } = useCreatePoll();

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!title) {
            setError("Title is required");
            return;
        }

        if (!content) {
            setError("Content is required");
            return;
        }

        const convertOptions = options.reduce((acc: string[], item) => {
            if (item.text.trim()) {
                acc.push(item.text.trim());
            }
            return acc;
        }, []);

        if (!useUpvoteDownvote && convertOptions.length < 2) {
            setError("Minimum 2 option is required");
            return;
        }

        const sanitizedData = {
            title: title,
            description: content,
            options: useUpvoteDownvote ? null : convertOptions,
        };

        createPoll(
            {
                data: sanitizedData,
            },
            {
                onSuccess(data, variables, context) {
                    setError("");
                    router.push("/dashboard/discord/poll-management");
                },
            }
        );
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, id: number) => {
        e.preventDefault();
        setOptions((prev) => {
            return prev.map((item) => {
                if (item.id === id) {
                    return {
                        id: id,
                        text: e.target.value,
                    };
                } else {
                    return item;
                }
            });
        });
    };

    const handleDeleteOption = (e: SyntheticEvent, id: number) => {
        e.preventDefault();
        setOptions((prev) => prev.filter((item) => item.id !== id));
    };

    const handleAddOption = (e: SyntheticEvent) => {
        e.preventDefault();
        setOptions((prev) => [...prev, { id: prev.length + 100, text: "" }]);
    };

    return (
        <React.Fragment>
            <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Create New Poll
            </h3>
            <form onSubmit={onSubmit} className="space-y-4 mt-8">
                <div className="inputbox">
                    <label htmlFor="">Title</label>
                    <input
                        type="text"
                        placeholder="Enter your title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="editorbox">
                    <label htmlFor="">Content</label>
                    <MarkdownEditorWithoutImageList value={content} setValue={setContent} />
                </div>
                <div className="flex items-center">
                    <div className="switchbox">
                        <input
                            type="checkbox"
                            id="enable-upvote-downvote"
                            checked={useUpvoteDownvote}
                            onChange={() => setUseUpvoteDownvote((prev) => !prev)}
                        />
                        <label htmlFor="enable-upvote-downvote"></label>
                    </div>
                    <label
                        htmlFor="enable-upvote-downvote"
                        className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                    >
                        Use Upvote/Downvote
                    </label>
                </div>
                {useUpvoteDownvote ? null : (
                    <div className="options">
                        <label htmlFor="">Options</label>
                        <div className="options-wrapper space-y-2">
                            {options.map((item) => (
                                <div key={item.id} className="option flex items-center gap-x-2">
                                    <input
                                        value={item.text}
                                        type="text"
                                        placeholder="Option Text"
                                        onChange={(e) => handleChange(e, item.id)}
                                    />
                                    <button
                                        className="text-red-500"
                                        onClick={(e) => handleDeleteOption(e, item.id)}
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            className="btn btn-sm mt-2 gap-x-1 !inline-flex items-center"
                            onClick={(e) => handleAddOption(e)}
                        >
                            <span>Add</span>
                            <FiPlusCircle className="text-lg" />
                        </button>
                    </div>
                )}
                <div className="text-center">
                    <button type="submit" className="btn" disabled={isLoading}>
                        Create
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
        </React.Fragment>
    );
};

export default CreatePollPage;
