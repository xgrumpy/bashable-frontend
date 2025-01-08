import { ChangeEvent, useEffect, useState } from "react";
import { debounce } from "@/utils/utils";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [searchUserText, setSearchUserText] = useState<string>("");
    const [isBanned, setIsBanned] = useState<boolean>(false);
    const [isModerator, setIsModerator] = useState<boolean>(false);

    useEffect(() => {
        setFilterString(
            `${
                searchUserText
                    ? `&find=${encodeURIComponent(searchUserText)}`
                    : ""
            }${isBanned ? `&banned=true` : ""}${isModerator ? `&role=mod` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchUserText, isBanned, isModerator]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchUserText(e.target.value);
    };

    const debouncedInputChange = debounce(handleTextChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search username or email"
                    onChange={debouncedInputChange}
                />
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="enable-banned-filter"
                        checked={isBanned}
                        onChange={() => setIsBanned(!isBanned)}
                    />
                    <label htmlFor="enable-banned-filter"></label>
                </div>
                <label
                    htmlFor="enable-banned-filter"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Banned Only
                </label>
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="moderator-only-filter"
                        checked={isModerator}
                        onChange={() => setIsModerator(!isModerator)}
                    />
                    <label htmlFor="moderator-only-filter"></label>
                </div>
                <label
                    htmlFor="moderator-only-filter"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Moderators Only
                </label>
            </div>
        </div>
    );
};

export default FiltersOptions;
