"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { debounce } from "@/utils/utils";
import { useSearchParams } from "next/navigation";
import CustomSelect from "@/component/ui/CustomSelect";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const searchParams = useSearchParams();
    const userFromUrl = searchParams.get("user") || "";

    const [provider, setProvider] = useState("");
    const [searchText, setSearchText] = useState<string>(userFromUrl);

    useEffect(() => {
        setFilterString(
            `${searchText ? `&user=${encodeURIComponent(searchText)}` : ""}${
                provider ? `&provider=${provider}` : ""
            }`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchText, provider]);

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
    };

    const debouncedInputChange = debounce(handleTextChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <CustomSelect
                items={[
                    { text: "All", value: "" },
                    {
                        text: "Stripe",
                        value: "stripe",
                    },
                    {
                        text: "Coinbase",
                        value: "coinbase",
                    },
                    {
                        text: "Local",
                        value: "local",
                    },
                    {
                        text: "Referral",
                        value: "referral",
                    },
                    {
                        text: "Tips",
                        value: "tip",
                    },
                ]}
                current={provider}
                setCurrentValue={setProvider}
            />
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    defaultValue={userFromUrl}
                    placeholder="Search username/email"
                    onChange={debouncedInputChange}
                />
            </div>
        </div>
    );
};

export default FiltersOptions;
