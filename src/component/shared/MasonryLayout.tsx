"use client";

import PopupImage from "@/component/shared/PopupImage";
import { IGeneration } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { debounce } from "@/utils/utils";
import { useEffect, useRef, useState } from "react";
import Masonry from "react-masonry-css";
import PopupImageAdmin from "./PopupImageAdmin";

const defaultBreakpoints = {
    default: 7,
    1790: 6,
    1536: 5,
    1320: 4,
    1024: 3,
    768: 2,
    540: 1,
};

interface IMasonryProps {
    url: string;
    adminPage?: boolean;
    removeDeleteButton?: boolean;
    breakpoints?: {};
}

const MasonryLayout = ({
    breakpoints = defaultBreakpoints,
    url,
    adminPage = false,
    removeDeleteButton = false,
}: IMasonryProps) => {
    const [data, setData] = useState<IGeneration[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const page = useRef<number>(1);
    const noMoreData = useRef(false);
    const fetchUrl = useRef<string>(url);

    const fetchData = debounce(() => {
        setLoading(true);
        let createUrl = `${fetchUrl.current}page=${page.current}`;
        axiosReq
            .get(createUrl)
            .then((res) => {
                if (res.data.length === 0) {
                    noMoreData.current = true;
                    setLoading(false);
                    return;
                }
                const newData: IGeneration[] = res.data;
                setData((prev: any) => [...prev, ...newData]);
                page.current += 1;
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, 500);

    useEffect(() => {
        if (url) {
            fetchUrl.current = url;
            page.current = 1;
            noMoreData.current = false;
            setData([]);
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url]);

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

    const refreshOnDelete = (id: string) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    const refreshOnFlagged = (ids: string[]) => {
        const tempData = data.map((item) => {
            if (ids.includes(item.id)) {
                item.blocked = true;
            }
            return item;
        });
        setData(tempData);
    };

    return (
        <>
            <div className="wrapper" ref={wrapperRef}>
                <Masonry
                    breakpointCols={breakpoints}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {data &&
                        Array.isArray(data) &&
                        data.map((item) => (
                            <div className="item" key={item.id}>
                                {adminPage ? (
                                    <PopupImageAdmin
                                        imageData={item}
                                        deleteIdPasser={refreshOnDelete}
                                        flaggedIdsPasser={refreshOnFlagged}
                                    />
                                ) : (
                                    <PopupImage
                                        imageData={item}
                                        removeDelete={removeDeleteButton}
                                        deleteIdPasser={refreshOnDelete}
                                    />
                                )}
                            </div>
                        ))}
                </Masonry>
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
        </>
    );
};

export default MasonryLayout;
