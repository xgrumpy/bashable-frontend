import { ChangeEvent, useEffect, useState } from "react";
import { debounce } from "@/utils/utils";
import { useSearchParams } from "next/navigation";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const searchParams = useSearchParams();
    const ipFromUrl = searchParams.get("ip") || "";

    const [searchText, setSearchText] = useState<string>(ipFromUrl);
    const [filterBanned, setFilterBanned] = useState<boolean>(false);

    useEffect(() => {
        setFilterString(
            `${searchText ? `&ip=${searchText}` : ""}${
                filterBanned ? `&banned=${filterBanned}` : ""
            }`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, filterBanned]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const debouncedInputChange = debounce(handleTextChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    defaultValue={ipFromUrl}
                    placeholder="Search ip address"
                    onChange={debouncedInputChange}
                />
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="only-banned"
                        checked={filterBanned}
                        onChange={() => setFilterBanned(!filterBanned)}
                    />
                    <label htmlFor="only-banned"></label>
                </div>
                <label
                    htmlFor="only-banned"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Banned
                </label>
            </div>
        </div>
    );
};

export default FiltersOptions;
