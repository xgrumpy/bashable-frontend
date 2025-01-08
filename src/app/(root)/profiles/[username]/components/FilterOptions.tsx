"use client";

import { useEffect, useState } from "react";
import CustomSelect from "@/component/ui/CustomSelect";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [sortBy, setSortBy] = useState<string>("");

    useEffect(() => {
        setFilterString(`${sortBy ? `&sortBy=${sortBy}` : ""}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [, sortBy]);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <CustomSelect
                items={[
                    { text: "Most Recent", value: "" },
                    {
                        text: "Most Liked",
                        value: "likes",
                    },
                ]}
                current={sortBy}
                setCurrentValue={setSortBy}
            />
        </div>
    );
};

export default FiltersOptions;
