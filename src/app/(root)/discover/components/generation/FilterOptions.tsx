import CustomSelect from "@/component/ui/CustomSelect";
import { ChangeEvent, memo, useEffect, useRef, useState } from "react";
import { debounce, mapModelsToSelectItems } from "@/utils/utils";
import useFetch from "@/hooks/useFetch";
import { useSearchParams } from "next/navigation";
import { useAuthContext } from "@/context/authContext";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const searchParams = useSearchParams();
    const userFromUrl = searchParams.get("user");

    const inputUserRef = useRef<HTMLInputElement | null>(null);

    const [sortBy, setSortBy] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [typeBy, setTypeBy] = useState<string>("");
    const [searchUserText, setSearchUserText] = useState<string>("");
    const [searchPromptText, setSearchPromptText] = useState<string>("");
    const [viewFollowing, setViewFollowing] = useState<boolean>(false);

    const { unrestricted, username } = useAuthContext();
    const { data: models } = useFetch("/generate/checkpoints");

    useEffect(() => {
        setSearchUserText(userFromUrl as string);
        if (inputUserRef.current) {
            // @ts-ignore
            inputUserRef.current.value = userFromUrl;
        }
    }, [userFromUrl]);

    useEffect(() => {
        if (viewFollowing) {
            setSearchUserText("");
        }
        let filters = `${selectedModel ? `model:${selectedModel},` : ""}${
            typeBy ? `type:${typeBy},` : ""
        }${searchPromptText ? `prompt:${searchPromptText},` : ""}`.slice(0, -1);
        setFilterString(
            `${sortBy ? `&sortBy=${sortBy}` : ""}${
                filters ? `&filter=${filters}` : ""
            }${
                searchUserText && !viewFollowing
                    ? `&username=${encodeURIComponent(searchUserText)}`
                    : ""
            }${viewFollowing ? `&following=true` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        sortBy,
        selectedModel,
        typeBy,
        searchUserText,
        searchPromptText,
        viewFollowing,
    ]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchUserText(e.target.value);
    };

    const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchPromptText(e.target.value);
    };

    const debouncedInputChange = debounce(handleTextChange, 500);
    const debouncedPromptChange = debounce(handlePromptChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <CustomSelect
                items={[
                    { text: "Most Recent", value: "" },
                    { text: "Most Liked", value: "likes" },
                    { text: "Randomized", value: "random" },
                ]}
                current={sortBy}
                setCurrentValue={setSortBy}
            />
            <CustomSelect
                items={mapModelsToSelectItems(models, unrestricted)}
                current={selectedModel}
                setCurrentValue={setSelectedModel}
            />
            {unrestricted ? (
                <CustomSelect
                    items={[
                        { text: "Select Type", value: "" },
                        { text: "Restricted Only", value: "nsfw" },
                        { text: "Non-restricted Only", value: "sfw" },
                    ]}
                    current={typeBy}
                    setCurrentValue={setTypeBy}
                />
            ) : null}
            <div className="promptsearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by prompt text"
                    onChange={debouncedPromptChange}
                />
            </div>
            {!viewFollowing && (
                <div className="usersearch">
                    <input
                        ref={inputUserRef}
                        className="!h-10"
                        type="text"
                        placeholder="Search by username"
                        onChange={debouncedInputChange}
                    />
                </div>
            )}
            {username && (
                <div className="flex items-center">
                    <div className="switchbox">
                        <input
                            type="checkbox"
                            id="enable-following-only"
                            checked={viewFollowing}
                            onChange={() => {
                                setViewFollowing(!viewFollowing);
                            }}
                        />
                        <label htmlFor="enable-following-only"></label>
                    </div>
                    <label
                        htmlFor="enable-following-only"
                        className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                    >
                        Following only
                    </label>
                </div>
            )}
        </div>
    );
};

export default memo(FiltersOptions);
