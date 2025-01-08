import { IProfileMinimal } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

const getProfileTipSent = async () => {
    const res = await axiosReq.get("/users/tips/sent");
    return res.data;
};

export const useGetProfileTipsSent = () => {
    return useQuery({
        queryKey: ["profiletipsent"],
        queryFn: getProfileTipSent,
    });
};

const getProfileTipReceived = async () => {
    const res = await axiosReq.get("/users/tips/received");
    return res.data;
};

export const useGetProfileTipsReceived = () => {
    return useQuery({
        queryKey: ["profiletipreceived"],
        queryFn: getProfileTipReceived,
    });
};

const getProfileFollowers = async () => {
    const res = await axiosReq.get("/users/followers");
    return res.data;
};

export const useGetProfileFollowers = () => {
    return useQuery<IProfileMinimal[]>({
        queryKey: ["profilefollowers"],
        queryFn: getProfileFollowers,
        select: (data) => {
            return data.map((item: any) => {
                return {
                    ...item.info,
                    following: item.following,
                    followed: true,
                };
            });
        },
    });
};

const getProfileFollowing = async () => {
    const res = await axiosReq.get("/users/following");
    return res.data;
};

export const useGetProfileFollowing = () => {
    return useQuery<IProfileMinimal[]>({
        queryKey: ["profilefollowing"],
        queryFn: getProfileFollowing,
        select: (data) => {
            return data.map((item: any) => {
                return {
                    ...item.info,
                    following: true,
                    followed: item.followed,
                };
            });
        },
    });
};

const getProfileGenerations = async ({
    pageParam = 1,
    limit = 21,
    filterString,
}: {
    pageParam: number;
    limit: number;
    filterString: string;
}) => {
    const res = await axiosReq.get(
        `/users/generations?limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetProfileGenerations = (limit: number, filterString: string) => {
    return useInfiniteQuery({
        queryKey: ["profilegenerations", filterString],
        queryFn: ({ pageParam = 1 }) => getProfileGenerations({ pageParam, limit, filterString }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};

const getMyLikes = async ({
    pageParam = 1,
    limit = 21,
    filterString,
}: {
    pageParam: number;
    limit: number;
    filterString: string;
}) => {
    const res = await axiosReq.get(
        `/users/generations?myLikes=true&limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetMyLikes = (limit: number, filterString: string) => {
    return useInfiniteQuery({
        queryKey: ["profilegenerations", filterString],
        queryFn: ({ pageParam = 1 }) => getMyLikes({ pageParam, limit, filterString }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};

const getProfileTransactions = async () => {
    const res = await axiosReq.get("/users/transactions");
    return res.data;
};

export const useGetProfileTransactions = () => {
    return useQuery({
        queryKey: ["profiletransactions"],
        queryFn: getProfileTransactions,
    });
};
