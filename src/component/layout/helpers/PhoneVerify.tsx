import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Timer from "@/app/(root)/generate/components/Timer";

interface IPhoneVerifyProps {
    closeModal: () => void;
}

const PhoneVerify = ({ closeModal }: IPhoneVerifyProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [phoneNumber, setPhoneNumber] = useState<any>("");
    const [error, setError] = useState<string>("");
    const [isOtpboxOpen, setIsOtpboxOpen] = useState<boolean>(false);
    const [otp, setOtp] = useState<string>("");
    const [timer, setTimer] = useState(120);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    const { login } = useAuthContext();

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

    const sendMobileNumber = () => {
        setIsLoading(true);
        axiosReq
            .post(`/users/verify/mobile/request`, {
                mobile: phoneNumber,
            })
            .then((res) => {
                setError("");
                toast.success(res.data.message);
                setIsOtpboxOpen(true);
                setIsLoading(false);
                setTimer(120);
                setIsTimerRunning(true);
            })
            .catch((err) => {
                setIsLoading(false);
                toastError(err);
                setError(err.response?.data?.message || "Something is wrong");
            });
    };

    const handleNumberVerify = (e: SyntheticEvent) => {
        e.preventDefault();
        setError("");
        if (!phoneNumber) {
            setError("Phone Number required");
        } else if (isValidPhoneNumber(phoneNumber) === false) {
            setError("Not a valid phone number");
        } else {
            sendMobileNumber();
        }
    };

    const handleResend = (e: SyntheticEvent) => {
        e.preventDefault();
        sendMobileNumber();
    };

    const handleOtpVerify = (e: FormEvent) => {
        e.preventDefault();
        setError("");
        if (!otp) {
            setError("Otp number needed");
        } else {
            setIsLoading(true);
            axiosReq
                .post(`/users/verify/mobile/`, {
                    code: otp,
                })
                .then((res) => {
                    setError("");
                    toast.success(res.data.message);
                    setIsLoading(false);
                    axiosReq
                        .get("/users/login/check")
                        .then((res: any) => {
                            login(res.data);
                        })
                        .catch((err) => console.error(err));

                    closeModal();
                })
                .catch((err) => {
                    setIsLoading(false);
                    toastError(err);
                    setError(
                        err.response?.data?.message || "Something is wrong"
                    );
                    setOtp("");
                });
        }
    };

    const handleHaveOtp = (e: SyntheticEvent) => {
        e.preventDefault();
        setIsOtpboxOpen(true);
    };

    return (
        <div className="max-w-lg border border-border mx-auto bg-dark py-4 md:py-8 px-4 md:px-8  rounded-2xl w-full">
            {!isOtpboxOpen ? (
                <div className="numberform text-center">
                    <div className="inputbox">
                        <label htmlFor="" className="font-semibold mb-3">
                            To activate your account, please enter a valid phone
                            number that can receive a One-Time-Passcode through
                            SMS.
                        </label>
                        <PhoneInput
                            placeholder="Enter phone number"
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                        />
                    </div>
                    <div className="flex mt-4 gap-x-3 gap-y-2 justify-center">
                        <button
                            className="btn"
                            onClick={handleNumberVerify}
                            disabled={isLoading}
                        >
                            Send OTP
                        </button>
                        <button
                            className="btn"
                            onClick={handleHaveOtp}
                            disabled={isLoading}
                        >
                            Have an otp
                        </button>
                    </div>
                </div>
            ) : (
                <div className="numberform text-center">
                    <div className="inputbox">
                        <label
                            htmlFor=""
                            className="font-semibold text-lg mb-3"
                        >
                            Please enter the OTP code sent to the phone number
                            you provided.
                        </label>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter otp number here..."
                        />
                    </div>
                    <div className="text-left">
                        <button
                            className="mt-1 text-sm"
                            onClick={() => setIsOtpboxOpen(false)}
                            disabled={isLoading}
                        >
                            Change Phone Number
                        </button>
                    </div>
                    <div className="mt-4 flex justify-center items-center gap-x-3 gap-y-2">
                        {isValidPhoneNumber(phoneNumber) && (
                            <button
                                className="btn"
                                onClick={handleResend}
                                disabled={isLoading || isTimerRunning}
                            >
                                Resend Code{" "}
                                {isTimerRunning && (
                                    <span className="text-xs">
                                        (
                                        {`${Math.floor(timer / 60)} : ${
                                            timer % 60
                                        }`}
                                        )
                                    </span>
                                )}
                            </button>
                        )}
                        <button
                            className="btn"
                            onClick={handleOtpVerify}
                            disabled={isLoading}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            )}
            {!!error && (
                <p className="text-red-500 mt-2 text-center">{error}</p>
            )}
        </div>
    );
};

export default PhoneVerify;
