import CustomSelect from "@/component/ui/CustomSelect";
import { memo, useEffect, useState } from "react";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [sortBy, setSortBy] = useState<string>("");

    useEffect(() => {
        setFilterString(`${sortBy ? `&sortBy=${sortBy}` : ""}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <CustomSelect
                items={[
                    { text: "Most Followers", value: "" },
                    { text: "Most Tips", value: "tips" },
                ]}
                current={sortBy}
                setCurrentValue={setSortBy}
            />
        </div>
    );
};

export default memo(FiltersOptions);
