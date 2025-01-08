import axiosReq from "@/utils/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

const getShowcaseItems = async ({
    pageParam = 1,
    limit = 21,
    filterString,
}: {
    pageParam: number;
    limit: number;
    filterString: string;
}) => {
    const res = await axiosReq.get(
        `/public/explore?limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetShowcase = (limit: number, filterString: string) => {
    return useInfiniteQuery({
        queryKey: ["showcase", filterString],
        queryFn: ({ pageParam = 1 }) => getShowcaseItems({ pageParam, limit, filterString }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};
