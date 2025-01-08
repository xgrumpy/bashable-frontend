import axiosReq from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

const getFaqs = async () => {
    const res = await axiosReq.get("/public/faqs");
    return res.data;
};

export const useGetFaqs = () => {
    return useQuery({
        queryKey: ["faqs"],
        queryFn: getFaqs,
    });
};
