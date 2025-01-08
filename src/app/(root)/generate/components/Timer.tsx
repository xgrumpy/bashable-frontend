"use client";

import { useEffect, useState } from "react";

const Timer = ({ start = 10 }: { start?: number }) => {
    const [timer, setTimer] = useState<number>(start);

    useEffect(() => {
        let intervalId: any;

        intervalId = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [timer, setTimer]);

    return (
        <span className="inline-flex justify-center items-center text-xl font-semibold text-black dark:text-white border-2 border-borderlight dark:border-border rounded-full overflow-hidden h-10 w-10">
            {timer}
        </span>
    );
};

export default Timer;
