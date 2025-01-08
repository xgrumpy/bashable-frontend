import { useAppContext } from "@/context/appContext";
import { useAuthContext } from "@/context/authContext";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import { IModel } from "../page";

interface IModelSelectionProps {
    state: boolean;
    closeHandler: () => void;
    models: IModel[];
    slectedModel: string;
    setSlectedModel: (arg: string) => void;
    restrictedPopupOpener: () => void;
}

const ModelSelection = ({
    state,
    closeHandler,
    models,
    slectedModel,
    setSlectedModel,
    restrictedPopupOpener,
}: IModelSelectionProps) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const { username, unrestricted } = useAuthContext();
    const { changeAuthBoxStatus } = useAppContext();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleModelSelect = (model: IModel) => {
        if (model.restricted && !unrestricted) {
            restrictedPopupOpener();
        } else {
            setSlectedModel(model.value);
            closeHandler();
        }
    };

    if (!mounted) return <></>;

    return (
        <>
            {state && (
                <>
                    {createPortal(
                        <div className="modelwrapper fixed inset-0 z-50 bg-opacity-95 bg-dark">
                            <span
                                className="overlay fixed left-0 top-0 h-full w-full z-10"
                                onClick={closeHandler}
                            ></span>
                            <div className="absolute w-full inset-0 overflow-y-auto h-full max-h-full z-20 scrollbar-hidden bg-grey dark:bg-light p-4 md:p-7">
                                <div className="flex justify-between items-center mb-8">
                                    <h4 className="text-black dark:text-white text-2xl font-semibold">
                                        Select Model
                                    </h4>
                                    <button
                                        className="text-xl h-8 w-8 inline-flex justify-center hover:text-red-500 hover:border-red-500 items-center border border-borderlight dark:border-border rounded-md"
                                        onClick={closeHandler}
                                    >
                                        <HiXMark />
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-3">
                                    {models.map((model) => (
                                        <div
                                            key={model.value}
                                            className="relative"
                                        >
                                            <div
                                                className={`item group cursor-pointer relative border aspect-square overflow-hidden rounded-lg ${
                                                    slectedModel === model.value
                                                        ? "border-primary"
                                                        : "border-transparent"
                                                }`}
                                                onClick={() =>
                                                    handleModelSelect(model)
                                                }
                                            >
                                                <div className="relative aspect-square overflow-hidden rounded-lg z-10">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={model.thumbnail}
                                                        alt={model.name}
                                                        className={`object-cover h-full w-full scale-100 transition-all duration-200 group-hover:scale-110 ${
                                                            model.restricted &&
                                                            !unrestricted
                                                                ? "blur-md opacity-50"
                                                                : ""
                                                        }`}
                                                    />
                                                </div>
                                                {model.restricted &&
                                                !unrestricted ? null : (
                                                    <div className="absolute p-4 pt-10 bg-gradient-to-b from-transparent to-dark left-0 top-auto bottom-0 w-full z-20">
                                                        <h5 className="text-base md:text-lg text-white font-semibold capitalize break-all">
                                                            {
                                                                model.name.split(
                                                                    "."
                                                                )[0]
                                                            }
                                                        </h5>
                                                    </div>
                                                )}
                                                {model.restricted &&
                                                    !unrestricted && (
                                                        <span className="absolute left-auto right-0 top-4 z-10 bg-red-500 text-white px-2 py-0.5">
                                                            Restricted
                                                        </span>
                                                    )}
                                            </div>
                                            {!username && model.restricted && (
                                                <div className="absolute w-full px-4 text-center left-0 top-1/2 transform -translate-y-1/2 z-10">
                                                    <button
                                                        className="btn btn-sm"
                                                        onClick={() =>
                                                            changeAuthBoxStatus(
                                                                "signup"
                                                            )
                                                        }
                                                    >
                                                        Create Account to Access
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>,
                        document.getElementById("modal-root") as Element
                    )}
                </>
            )}
        </>
    );
};
export default ModelSelection;
