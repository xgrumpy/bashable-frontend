"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="text-center">
            <h2 className="text-3xl">Something went wrong!</h2>
            <button className="btn mt-3" onClick={() => reset()}>
                Try again
            </button>
        </div>
    );
}
