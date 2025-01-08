import CustomSelect from "@root/src/component/ui/CustomSelect";
import { TAdminChatSortBy } from "@root/src/interfaces/chat";
import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [sortBy, setSortBy] = useState<TAdminChatSortBy>("chat_recent");
    const [userSearchText, setUserSearchText] = useState<string>("");
    const [botSearchText, setBotSearchText] = useState<string>("");

    useEffect(() => {
        let tempString = `${userSearchText ? `username:${userSearchText},` : ""}${
            botSearchText ? `bot_name:${botSearchText},` : ""
        }`.slice(0, -1);

        setFilterString(
            `${tempString ? `&filter=${tempString}` : ""}${sortBy ? `&sort=${sortBy}` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy, userSearchText, botSearchText]);

    const handleUserTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUserSearchText(e.target.value);
    };

    const handleBotTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        setBotSearchText(e.target.value);
    };

    const debouncedUserTextChange = debounce(handleUserTextChange, 500);
    const debouncedBotTextChange = debounce(handleBotTextChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <div className="flex items-center gap-x-2">
                <h5 className="font-semibold">Sort By:</h5>
                <CustomSelect
                    items={[
                        { text: "Newest", value: "chat_recent" },
                        {
                            text: "Oldest",
                            value: "chat_oldest",
                        },
                        {
                            text: "Most Messages",
                            value: "most_messages",
                        },
                        {
                            text: "Least Messages",
                            value: "least_messages",
                        },
                    ]}
                    current={sortBy}
                    setCurrentValue={setSortBy}
                />
            </div>
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by user name"
                    onChange={debouncedUserTextChange}
                />
            </div>
            <div className="botsearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by bot name"
                    onChange={debouncedBotTextChange}
                />
            </div>
        </div>
    );
};

export default FiltersOptions;
