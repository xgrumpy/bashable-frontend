"use client";

import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { debounce } from "@/utils/utils";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface ITipsendboxProps {
    userid: string;
    closeHandler: () => void;
}

const TipSendbox = ({ userid, closeHandler }: ITipsendboxProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [tipAmount, setTipAmount] = useState<number>(0);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const { login } = useAuthContext();

    const handleTipSend = () => {
        if (tipAmount <= 0) {
            setErrorMsg("Invalid amount");
        } else {
            setErrorMsg("");
            setIsLoading(true);
            axiosReq
                .post(`/users/${userid}/tip`, {
                    amount: tipAmount,
                })
                .then((res) => {
                    toast.success(res.data.message);
                    setTipAmount(0);
                    closeHandler();
                    axiosReq
                        .get("/users/login/check")
                        .then((res: any) => {
                            login(res.data);
                        })
                        .catch((err) => console.error(err));
                })
                .catch((err) => {
                    toastError(err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    };

    const debouncedHandleTipSend = debounce(handleTipSend, 1000);

    return (
        <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
            <div className="text-center">
                <h5 className="text-2xl text-black dark:text-white font-semibold mb-4">
                    How many credits would you like to tip?
                </h5>
                <div className="inputbox">
                    <input
                        type="number"
                        value={tipAmount}
                        onChange={(e) =>
                            setTipAmount(parseFloat(e.target.value))
                        }
                        placeholder="Enter credit amount"
                    />
                </div>
                <div className="quickfill mt-4">
                    <strong>Quick Tips: </strong>
                    <div className="inline-flex gap-x-2 ml-2">
                        <button
                            className="border border-borderlight dark:border-border px-2 rounded-md text-center font-semibold"
                            onClick={() => setTipAmount(1)}
                        >
                            1
                        </button>
                        <button
                            className="border border-borderlight dark:border-border px-2 rounded-md text-center font-semibold"
                            onClick={() => setTipAmount(5)}
                        >
                            5
                        </button>
                        <button
                            className="border border-borderlight dark:border-border px-2 rounded-md text-center font-semibold"
                            onClick={() => setTipAmount(10)}
                        >
                            10
                        </button>
                    </div>
                </div>
                <div className="flex gap-x-5 justify-center mt-5">
                    <button
                        className="btn"
                        onClick={debouncedHandleTipSend}
                        disabled={isLoading}
                    >
                        Send
                    </button>
                    <button className="btn btn-outline" onClick={closeHandler}>
                        Cancel
                    </button>
                </div>
                {errorMsg && (
                    <p className="message text-red-500 mt-2">{errorMsg}</p>
                )}
            </div>
        </div>
    );
};

export default TipSendbox;
