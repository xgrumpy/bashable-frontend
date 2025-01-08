import { IGeneration } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const getRecentCreations = async () => {
    const res = await axiosReq.get("/public/showcase");
    return res.data;
};

export const useGetRecentCreations = (isPaused: boolean) => {
    return useQuery<IGeneration[]>({
        queryKey: ["recent-creations"],
        queryFn: getRecentCreations,
        refetchInterval: () => {
            return isPaused ? false : 10000;
        },
    });
};
