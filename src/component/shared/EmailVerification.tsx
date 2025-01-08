import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const EmailVerification = ({ email }: { email: string }) => {
    const [timer, setTimer] = useState<number>(60);
    const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isTimerRunning) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        if (timer === 0) {
            clearInterval(interval as NodeJS.Timeout);
            setIsTimerRunning(false);
        }

        return () => clearInterval(interval as NodeJS.Timeout);
    }, [isTimerRunning, timer]);

    const handleResend = () => {
        axiosReq
            .post("/users/verify/email", {
                email: email,
            })
            .then((res) => {
                toast.success(res.data.message);
                setTimer(60);
                setIsTimerRunning(true);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <div className="verification mt-5">
            <p className="mb-2">Didn&apos;t receive verfication email?</p>
            <button
                className="btn btn-outline"
                onClick={handleResend}
                disabled={isTimerRunning}
            >
                Resend Now
                {isTimerRunning && (
                    <span className="text-xs">
                        ({`${Math.floor(timer / 60)} : ${timer % 60}`})
                    </span>
                )}
            </button>
        </div>
    );
};

export default EmailVerification;
