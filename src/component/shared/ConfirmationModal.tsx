"use client";

import { KeyboardEvent, ReactNode, SyntheticEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

interface IModalProps {
    state: boolean;
    closeHandler: () => void;
    children: ReactNode;
    acceptHandler: (event: SyntheticEvent) => void;
    declineHandler: (event?: SyntheticEvent) => void;
    disabled?: boolean;
}

const ConfirmationModal = ({
    state,
    closeHandler,
    acceptHandler,
    declineHandler,
    children,
    disabled = false,
}: IModalProps) => {
    const [mounted, setMounted] = useState<boolean>(false);

    const acceptHandlerRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setMounted(true);
        acceptHandlerRef.current?.focus();
    }, []);

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            closeHandler();
        }
        if (e.key === "Enter") {
            acceptHandlerRef.current?.click();
            closeHandler();
        }
        return;
    };

    useEffect(() => {
        window.addEventListener("keydown", handleKeydown as any);
        return () => {
            window.removeEventListener("keydown", handleKeydown as any);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) return <></>;

    return (
        <>
            {state && (
                <>
                    {createPortal(
                        <div className="fixed flex justify-center items-center h-screen w-full left-0 top-0 z-50  bg-opacity-95 bg-dark">
                            <span
                                className="overlay fixed left-0 top-0 h-full w-full z-10"
                                onClick={closeHandler}
                            ></span>
                            <div className="inner w-full p-5 md:p-10 overflow-y-auto max-h-full z-20 scrollbar-hidden relative">
                                <div className="text-center mb-6">
                                    <button
                                        onClick={closeHandler}
                                        className="border border-border hover:border-red-500 hover:text-red-500 z-30 transition-all h-8 w-8 rounded-full inline-flex justify-center items-center left-auto right-6 top-3 text-white"
                                    >
                                        <HiXMark />
                                    </button>
                                </div>
                                <span
                                    className="overlay fixed inset-0 h-full w-full -z-10"
                                    onClick={closeHandler}
                                ></span>
                                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light p-5 md:p-10 rounded-2xl w-full">
                                    {children}
                                    <div className="flex justify-center items-center gap-5 mt-5">
                                        <button
                                            ref={acceptHandlerRef}
                                            className="btn"
                                            onClick={acceptHandler}
                                            disabled={disabled}
                                        >
                                            Sure
                                        </button>
                                        <button className="btn" onClick={declineHandler}>
                                            Cancel
                                        </button>
                                    </div>
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

export default ConfirmationModal;
