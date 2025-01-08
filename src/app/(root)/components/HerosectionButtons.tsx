"use client";

import Link from "next/link";
import { HiOutlineArrowSmallRight } from "react-icons/hi2";
import { useAuthContext } from "@/context/authContext";

const HerosectionButtons = () => {
    const { username } = useAuthContext();

    return (
        <div className="mt-12 inline-flex flex-wrap gap-4 justify-center">
            <Link href="/generate" className="btn btn-lg">
                Generate Image {username ? "" : "For Free"}{" "}
                <HiOutlineArrowSmallRight className="inline text-base align-middle" />
            </Link>
            <Link href="/showcase" className="btn btn-lg btn-secondary">
                Showcase
            </Link>
        </div>
    );
};

export default HerosectionButtons;
