import axiosReq from "@root/src/utils/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

type TGetUserGenerationProps = {
    username: string;
    limit?: number;
    pageParam?: number;
};

const getUserGeneration = async ({
    username,
    limit = 21,
    pageParam = 1,
}: TGetUserGenerationProps) => {
    const res = await axiosReq.get(
        `/admin/generations?limit=${limit}&filter=user:${username}&page=${pageParam}`
    );
    return res.data;
};

export const useGetUserGeneration = ({ username, limit }: TGetUserGenerationProps) => {
    return useInfiniteQuery({
        queryKey: ["admin", "generations", username],
        queryFn: ({ pageParam = 1 }) => getUserGeneration({ pageParam, username, limit }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
        cacheTime: 30000,
    });
};
