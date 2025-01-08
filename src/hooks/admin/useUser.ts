import { IUser } from "@root/src/interfaces/general";
import axiosReq from "@root/src/utils/axios";
import { useQuery } from "@tanstack/react-query";

type TGetUserProps = {
    id: string;
};

export const getUser = async ({ id }: TGetUserProps) => {
    const res = await axiosReq.get(`/admin/users/${id}`);
    return res.data;
};

export const useGetUser = ({ id }: TGetUserProps) => {
    return useQuery<IUser>({
        queryKey: ["admin", "user", id],
        queryFn: () => getUser({ id }),
        refetchOnWindowFocus: false,
    });
};
