import axiosReq from "@/utils/axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { IUser } from "../interfaces/general";

type TGetUserProps = {
    username: string;
};

export const getUser = async ({ username }: TGetUserProps) => {
    const res = await axiosReq.get(`/users/profile/${encodeURIComponent(username)}`);
    return res.data;
};

export const useGetUser = ({ username }: TGetUserProps) => {
    return useQuery<IUser>({
        queryKey: ["admin", "user", username],
        queryFn: () => getUser({ username }),
        refetchOnWindowFocus: false,
    });
};

const getUserProfileGenerations = async ({
    pageParam = 1,
    username,
    limit = 21,
    filterString,
}: {
    pageParam: number;
    username: string;
    limit: number;
    filterString: string;
}) => {
    const res = await axiosReq.get(
        `/users/profile/${username}/generations?limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetUserProfileGenerations = (
    username: string,
    filterString: string,
    limit: number
) => {
    return useInfiniteQuery({
        queryKey: ["profilegenerations", filterString],
        queryFn: ({ pageParam = 1 }) =>
            getUserProfileGenerations({
                pageParam,
                username,
                limit,
                filterString,
            }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};
