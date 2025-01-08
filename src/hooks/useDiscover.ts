import axiosReq from "@/utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const getTopUsers = async (filterString: string, extended: boolean) => {
    const res = await axiosReq.get(
        `/public/discover/users?${filterString}${extended ? "&extended=true" : ""}`
    );
    return res.data;
};

export const useGetTopUsers = (filterString: string, extended: boolean) => {
    return useQuery({
        queryKey: ["topusers", filterString, extended],
        queryFn: () => getTopUsers(filterString, extended),
        cacheTime: 60000,
        keepPreviousData: true,
    });
};

const getDiscoverItems = async ({
    pageParam = 1,
    limit = 21,
    filterString,
}: {
    pageParam: number;
    limit: number;
    filterString: string;
}) => {
    const res = await axiosReq.get(
        `/public/discover/generations?limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetDiscoverItems = (limit: number, filterString: string) => {
    return useInfiniteQuery({
        queryKey: ["discover", filterString],
        queryFn: ({ pageParam = 1 }) => getDiscoverItems({ pageParam, limit, filterString }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};
