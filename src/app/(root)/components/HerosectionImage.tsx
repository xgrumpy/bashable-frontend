"use client";

import { shimmer, toBase64 } from "@/utils/utils";
import Image from "next/image";

const HerosectionImage = () => {
    return (
        <div className="heroimage select-none overflow-hidden absolute inset-0">
            <div className="overlay absolute inset-0 bg-white dark:bg-dark opacity-80 dark:opacity-90 z-10"></div>
            <Image
                src="/images/hero-images.webp"
                alt="Bashable.art"
                fill={true}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(1920, 860)
                )}`}
                quality={60}
                className="object-cover object-center w-full h-full"
            />
        </div>
    );
};

export default HerosectionImage;
