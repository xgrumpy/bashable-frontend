"use client";

import { IImageData } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { debounce } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";

interface InfiniteGenerationsProps {
    selectedImage: IImageData | null;
    handleSelectImage: (imageData: IImageData) => void;
}

const InfiniteGenerations = ({
    selectedImage,
    handleSelectImage,
}: InfiniteGenerationsProps) => {
    const [data, setData] = useState<IImageData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const page = useRef<number>(1);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const noMoreData = useRef<boolean>(false);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchData = debounce(async () => {
        setLoading(true);
        const response = await axiosReq.get(
            `/users/generations?limit=5&page=${page.current}`
        );
        const newData: IImageData[] = await response.data;
        if (newData.length === 0) {
            noMoreData.current = true;
            setLoading(false);
            return;
        }
        setData((prev: any) => [...prev, ...newData]);
        page.current += 1;
        setLoading(false);
    }, 100);

    const handleScroll = () => {
        const myElement = wrapperRef?.current;
        if (!noMoreData.current && myElement) {
            const scrollTop = myElement.scrollTop;
            const scrollHeight = myElement.scrollHeight;
            const clientHeight = myElement.clientHeight;

            if (scrollTop + clientHeight >= scrollHeight - 100) {
                fetchData();
            }
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={wrapperRef}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 md:gap-2 max-h-[500px] overflow-y-auto">
                {data &&
                    Array.isArray(data) &&
                    data.map((item, key) => (
                        <div
                            key={item.id}
                            className={`rounded-lg relative overflow-hidden cursor-pointer border-4 ${
                                selectedImage?.id === item.id
                                    ? "border-primary"
                                    : "border-transparent"
                            }`}
                            onClick={() => handleSelectImage(item)}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={item.image}
                                alt={item.prompt}
                                className="object-cover aspect-square"
                            />
                        </div>
                    ))}
            </div>
            {data.length <= 0 ? (
                <p className="text-black text-center dark:text-white font-semibold">
                    There is no items to show
                </p>
            ) : (
                <>
                    {noMoreData.current && (
                        <p className="text-center mt-6 text-black dark:text-white font-semibold">
                            You have reached the end
                        </p>
                    )}
                    {loading && (
                        <div className="text-center mt-6">
                            <div className="inline-block animate-spin rounded-full h-20 w-20 border-b-2 border-borderlight dark:border-border"></div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default InfiniteGenerations;
