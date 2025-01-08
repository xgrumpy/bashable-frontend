import { useAuthContext } from "@/context/authContext";
import Link from "next/link";
import { ChangeEvent, useEffect } from "react";

interface IPrivateModeControllerProps {
    value: boolean;
    setValue: (value: boolean) => void;
}

const PrivateModeController = ({
    value,
    setValue,
}: IPrivateModeControllerProps) => {
    const { username } = useAuthContext();

    const getPrivateMode = () => {
        if (username) {
            if (localStorage.getItem("generate-private-mode") === null) {
                return true;
            } else {
                if (localStorage.getItem("generate-private-mode") === "true") {
                    return true;
                } else {
                    return false;
                }
            }
        } else {
            return false;
        }
    };

    useEffect(() => {
        setValue(getPrivateMode());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePrivateChange = (e: ChangeEvent<HTMLInputElement>) => {
        localStorage.setItem(
            "generate-private-mode",
            e.target.checked ? "true" : "false"
        );
        username ? setValue(e.target.checked) : setValue(false);
    };

    return (
        <>
            {username && (
                <div className="switchbox">
                    <div className="flex items-center">
                        <div className="switchbox">
                            <input
                                type="checkbox"
                                checked={value}
                                onChange={handlePrivateChange}
                                id="private-mode-control"
                            />
                            <label htmlFor="private-mode-control"></label>
                        </div>
                        <label
                            htmlFor="private-mode-control"
                            className="text-black dark:text-white font-semibold cursor-pointer"
                        >
                            Private Mode
                        </label>
                    </div>
                    <Link
                        target="_blank"
                        href="/blogs/what-is-private-mode"
                        className="text-sm text-bodylight dark:text-body underline hover:!text-primary"
                    >
                        What is this?
                    </Link>
                </div>
            )}
        </>
    );
};

export default PrivateModeController;
