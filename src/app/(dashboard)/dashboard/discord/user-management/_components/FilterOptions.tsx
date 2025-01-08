import { debounce } from "lodash";
import { ChangeEvent, useEffect, useState } from "react";

interface IFilterOptions {
    setFilterString: (str: string) => void;
}

// Convicted Users Filter:
// discordUserId: Input
// discordUserName: Input
// banned: Toggle
// muted: Toggle

const FiltersOptions = ({ setFilterString }: IFilterOptions) => {
    const [banned, setBanned] = useState(false);
    const [muted, setMuted] = useState(false);
    const [discordUserId, setDiscordUserId] = useState("");
    const [discordUserName, setDiscordUserName] = useState("");

    useEffect(() => {
        setFilterString(
            `${discordUserId ? `&discordUserId=${discordUserId}` : ""}${
                discordUserName ? `&discordUserName=${discordUserName}` : ""
            }${banned ? `&banned=true` : ""}${muted ? `&muted=true` : ""}`
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [banned, muted, discordUserId, discordUserName]);

    const handleDiscordUserIdChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDiscordUserId(e.target.value);
    };

    const handleDiscordUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDiscordUserName(e.target.value);
    };

    const debouncedDiscordUserIdChange = debounce(handleDiscordUserIdChange, 500);
    const debouncedDiscordUserNameChange = debounce(handleDiscordUserNameChange, 500);

    return (
        <div className="filters flex items-center flex-wrap gap-x-6 gap-y-3">
            <div className="usersearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by user id"
                    onChange={debouncedDiscordUserIdChange}
                />
            </div>
            <div className="botsearch">
                <input
                    className="!h-10"
                    type="text"
                    placeholder="Search by username"
                    onChange={debouncedDiscordUserNameChange}
                />
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="enable-banned"
                        checked={banned}
                        onChange={() => setBanned((prev) => !prev)}
                    />
                    <label htmlFor="enable-banned"></label>
                </div>
                <label
                    htmlFor="enable-banned"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Banned
                </label>
            </div>
            <div className="flex items-center">
                <div className="switchbox">
                    <input
                        type="checkbox"
                        id="enable-muted"
                        checked={muted}
                        onChange={() => setMuted((prev) => !prev)}
                    />
                    <label htmlFor="enable-muted"></label>
                </div>
                <label
                    htmlFor="enable-muted"
                    className="text-sm font-semibold text-black dark:text-white cursor-pointer"
                >
                    Muted
                </label>
            </div>
        </div>
    );
};

export default FiltersOptions;
