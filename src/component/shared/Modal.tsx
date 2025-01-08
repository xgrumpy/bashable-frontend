"use client";

import { KeyboardEvent, ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";

interface IModalProps {
    state: boolean;
    closeHandler: () => void;
    children: ReactNode;
    nonClosable?: boolean;
}

const Modal = ({
    state,
    closeHandler,
    nonClosable = false,
    children,
}: IModalProps) => {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClose = () => {
        if (!nonClosable) {
            closeHandler();
        }
    };

    const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            handleClose();
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
                                onClick={handleClose}
                            ></span>
                            <div className="inner w-full p-5 md:p-10 overflow-y-auto max-h-full z-20 scrollbar-hidden relative">
                                {!nonClosable ? (
                                    <div className="text-center mb-6">
                                        <button
                                            onClick={handleClose}
                                            className="border border-border hover:border-red-500 hover:text-red-500 z-30 transition-all h-8 w-8 rounded-full inline-flex justify-center items-center left-auto right-6 top-3 text-white"
                                        >
                                            <HiXMark />
                                        </button>
                                    </div>
                                ) : null}
                                <span
                                    className="overlay fixed inset-0 h-full w-full -z-10"
                                    onClick={handleClose}
                                ></span>
                                {children}
                            </div>
                        </div>,
                        document.getElementById("modal-root") as Element
                    )}
                </>
            )}
        </>
    );
};

export default Modal;
