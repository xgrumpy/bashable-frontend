import CustomSelect from "@/component/ui/CustomSelect";
import { useAuthContext } from "@/context/authContext";
import useFetch from "@/hooks/useFetch";
import { debounce, mapModelsToSelectItems } from "@/utils/utils";
import { ChangeEvent, useEffect, useState } from "react";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [sortBy, setSortBy] = useState<string>("");
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [searchPromptText, setSearchPromptText] = useState<string>("");
    const [featuredOnly, setFeaturedOnly] = useState<boolean>(false);

    const { unrestricted } = useAuthContext();
    const { data: models } = useFetch("/generate/checkpoints");

    useEffect(() => {
        let filters = `${selectedModel ? `model:${selectedModel},` : ""}${
            searchPromptText ? `prompt:${searchPromptText},` : ""
        }${featuredOnly ? `featured,` : ""}`.slice(0, -1);
        setFilterString(
            `${sortBy ? `&sortBy=${sortBy}` : ""}${filters ? `&filter=${filters}` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, selectedModel, searchPromptText, featuredOnly]);

    const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchPromptText(e.target.value);
    };

    const debouncedPromptChange = debounce(handlePromptChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <div className="optionitem flex items-center gap-2">
                <CustomSelect
                    items={[
                        { text: "Most Recent", value: "" },
                        { text: "Most Liked", value: "likes" },
                    ]}
                    current={sortBy}
                    setCurrentValue={setSortBy}
                />
            </div>
            <div className="optionitem flex items-center gap-2">
                <CustomSelect
                    items={mapModelsToSelectItems(models, unrestricted)}
                    current={selectedModel}
                    setCurrentValue={setSelectedModel}
                />
            </div>
            <div className="promptsearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by prompt text"
                    onChange={debouncedPromptChange}
                />
            </div>
            <div className="featured">
                <div className="flex items-center">
                    <div className="switchbox">
                        <input
                            type="checkbox"
                            id="enable-featured-only"
                            checked={featuredOnly}
                            onChange={() => setFeaturedOnly((prev) => !prev)}
                        />
                        <label htmlFor="enable-featured-only"></label>
                    </div>
                    <label
                        htmlFor="enable-featured-only"
                        className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                    >
                        Featured Only
                    </label>
                </div>
            </div>
        </div>
    );
};

export default FiltersOptions;
