"use client";

import CustomSelect from "@/component/ui/CustomSelect";
import useFetch from "@/hooks/useFetch";
import { debounce, mapModelsToSelectItems } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const searchParams = useSearchParams();
    const userFromUrl = searchParams.get("user");

    const [mode, setMode] = useState<string>("");
    const [restriction, setRestriction] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [showcased, setShowcased] = useState<string>("");
    const [userSearchText, setUserSearchText] = useState<string>("");
    const [promptSearchText, setPromptSearchText] = useState<string>("");
    const [likeSort, setLikeSort] = useState<boolean>(false);
    const [filterUnderReview, setFilterUnderReview] = useState<boolean>(false);
    const [filterUnderReported, setFilterUnderReported] = useState<boolean>(false);

    const inputUserRef = useRef<HTMLInputElement | null>(null);

    const { data: models } = useFetch("/generate/checkpoints");

    useEffect(() => {
        setUserSearchText(userFromUrl as string);
        if (userFromUrl && inputUserRef.current) {
            // @ts-ignore
            inputUserRef.current.value = userFromUrl;
        }
    }, [userFromUrl]);

    useEffect(() => {
        let tempString = `${mode ? `${mode},` : ""}${restriction ? `${restriction},` : ""}${
            showcased ? `${showcased},` : ""
        }${userSearchText ? `user:${userSearchText},` : ""}${
            promptSearchText ? `prompt:${promptSearchText},` : ""
        }${selectedModel ? `model:${selectedModel},` : ""}${
            filterUnderReview ? `under-review,` : ""
        }${filterUnderReported ? `reported,` : ""}`.slice(0, -1);

        setFilterString(
            `${tempString ? `&filter=${tempString}` : ""}${likeSort ? `&sortBy=likes` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        mode,
        restriction,
        showcased,
        selectedModel,
        promptSearchText,
        userSearchText,
        likeSort,
        filterUnderReview,
        filterUnderReported,
    ]);

    const handleUserTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserSearchText(e.target.value);
    };

    const handlePromptTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setPromptSearchText(e.target.value);
    };

    const debouncedPromptTextChange = debounce(handlePromptTextChange, 500);
    const debouncedUserTextChange = debounce(handleUserTextChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <CustomSelect
                items={[
                    { text: "Select Mode", value: "" },
                    {
                        text: "Public",
                        value: "public",
                    },
                    {
                        text: "Private",
                        value: "private",
                    },
                ]}
                current={mode}
                setCurrentValue={setMode}
            />
            <CustomSelect
                items={[
                    {
                        text: "Select Restriction",
                        value: "",
                    },
                    {
                        text: "Restricted",
                        value: "restricted",
                    },
                    {
                        text: "Unrestricted",
                        value: "not-restricted",
                    },
                ]}
                current={restriction}
                setCurrentValue={setRestriction}
            />
            <CustomSelect
                items={[
                    {
                        text: "Select Showcased",
                        value: "",
                    },
                    {
                        text: "Displayed",
                        value: "showcase",
                    },
                    {
                        text: "Not Displayed",
                        value: "not-showcase",
                    },
                ]}
                current={showcased}
                setCurrentValue={setShowcased}
            />
            <div className="optionitem flex items-center gap-2">
                <CustomSelect
                    items={mapModelsToSelectItems(models)}
                    current={selectedModel}
                    setCurrentValue={setSelectedModel}
                />
            </div>
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by prompt text"
                    onChange={debouncedPromptTextChange}
                />
            </div>
            <div className="usersearch">
                <input
                    ref={inputUserRef}
                    className="!h-10"
                    type="text"
                    defaultValue={userFromUrl as string}
                    placeholder="Search by user"
                    onChange={debouncedUserTextChange}
                />
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="enable-likesort"
                        checked={likeSort}
                        onChange={() => setLikeSort(!likeSort)}
                    />
                    <label htmlFor="enable-likesort"></label>
                </div>
                <label
                    htmlFor="enable-likesort"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Sort By Likes
                </label>
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="filter-under-review"
                        checked={filterUnderReview}
                        onChange={() => setFilterUnderReview(!filterUnderReview)}
                    />
                    <label htmlFor="filter-under-review"></label>
                </div>
                <label
                    htmlFor="filter-under-review"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Under Review
                </label>
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="filter-under-reported"
                        checked={filterUnderReported}
                        onChange={() => setFilterUnderReported((prev) => !prev)}
                    />
                    <label htmlFor="filter-under-reported"></label>
                </div>
                <label
                    htmlFor="filter-under-reported"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Review Reported
                </label>
            </div>
        </div>
    );
};

export default FiltersOptions;
