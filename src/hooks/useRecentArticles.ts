import { IArticle } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export const getLatestArticles = async () => {
    const res = await axiosReq.get(`/public/articles`, {
        params: {
            page: 1,
            limit: 15,
        },
    });
    return res.data;
};

export const useGetRecentArticles = () => {
    return useQuery<IArticle[]>({
        queryKey: ["latest-articles"],
        queryFn: () => getLatestArticles(),
    });
};
