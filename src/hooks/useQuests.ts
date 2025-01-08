import axiosReq from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const getQuests = async () => {
    const res = await axiosReq.get("/users/quests");
    return res.data;
};

export const useGetQuests = () => {
    return useQuery({
        queryKey: ["quests"],
        queryFn: getQuests,
    });
};
