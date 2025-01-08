import { ChangeEvent, useEffect, useState } from "react";
import { debounce } from "@/utils/utils";
import { useSearchParams } from "next/navigation";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const searchParams = useSearchParams();
    const userFromUrl = searchParams.get("username") || "";

    const [searchText, setSearchText] = useState<string>(userFromUrl);

    useEffect(() => {
        setFilterString(`${searchText ? `&username=${searchText}` : ""}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText]);

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
                    defaultValue={userFromUrl}
                    placeholder="Search username"
                    onChange={debouncedInputChange}
                />
            </div>
        </div>
    );
};

export default FiltersOptions;
