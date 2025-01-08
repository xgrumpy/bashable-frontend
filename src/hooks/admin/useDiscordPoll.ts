import { TPoll, TPoolDetails } from "@root/src/interfaces/adminDiscord";
import axiosReq from "@root/src/utils/axios";
import { toastError } from "@root/src/utils/error";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

// Get all polls
type TGetPollsProps = {
    limit?: number;
    pageParam?: number;
};

const getPolls = async ({ limit = 20, pageParam = 1 }: TGetPollsProps) => {
    const res = await axiosReq.get(`/admin/discord/polls?limit=${limit}&page=${pageParam}`);
    return res.data;
};

export const useGetPolls = ({ limit }: TGetPollsProps) => {
    return useInfiniteQuery({
        queryKey: ["admin", "discord", "polls"],
        queryFn: ({ pageParam = 1 }) => getPolls({ limit, pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
    });
};

// Get single poll
type TGetSinglePollProps = {
    id: string;
};

const getSinglePoll = async ({ id }: TGetSinglePollProps) => {
    const res = await axiosReq.get(`/admin/discord/polls/${id}`);
    return res.data;
};

export const useGetSinglePoll = ({ id }: TGetSinglePollProps) => {
    return useQuery<TPoolDetails>({
        queryKey: ["admin", "discord", "polls", id],
        queryFn: () => getSinglePoll({ id }),
        refetchOnWindowFocus: false,
    });
};

// Delete a poll
type TDeleteAPollProps = {
    id: string;
};

const deleteAPoll = async ({ id }: TDeleteAPollProps) => {
    const res = await axiosReq.delete(`/admin/discord/polls/${id}`);
    return res.data;
};

export const useDeleteAPoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TDeleteAPollProps) => deleteAPoll({ id }),
        onSuccess: (_data, variables) => {
            toast.success("Successfully deleted poll");
            queryClient.setQueryData(["admin", "discord", "polls"], (oldData: any) => {
                if (!oldData) return;
                let newData = oldData.pages.map((page: TPoll[]) => {
                    return page.filter((item) => item.id !== variables.id);
                });
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        },
        onError: (error) => {
            toastError(error);
        },
    });
};

// Toggle poll status
type TTogglePoolStatusProps = {
    id: string;
};

const togglePoolStatus = async ({ id }: TTogglePoolStatusProps) => {
    const res = await axiosReq.post(`/admin/discord/polls/${id}/toggle-status`);
    return res.data;
};

export const useTogglePoolStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TTogglePoolStatusProps) => togglePoolStatus({ id }),
        onSuccess: (_data, variables) => {
            toast.success("Successfully updated poll");
            queryClient.setQueryData(["admin", "discord", "polls"], (oldData: any) => {
                if (!oldData) return;
                let newData = oldData.pages.map((page: TPoll[]) => {
                    return page.map((item) => {
                        if (item.id === variables.id) {
                            return {
                                ...item,
                                isOpen: !item.isOpen,
                            };
                        } else {
                            return item;
                        }
                    });
                });
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        },
        onError: (error) => {
            toastError(error);
        },
    });
};

type TCreatePoll = {
    title: string;
    description: string;
    options: string[] | null;
};
type TCreatePollProps = {
    data: TCreatePoll;
};

const createPoll = async ({ data }: TCreatePollProps) => {
    const res = await axiosReq.post(`/admin/discord/polls`, data);
    return res.data;
};

export const useCreatePoll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ data }: TCreatePollProps) => createPoll({ data }),
        onSuccess: (_data, variables) => {
            toast.success("Successfully created poll");
            queryClient.invalidateQueries({ queryKey: ["admin", "discord", "polls"], exact: true });
        },
        onError: (error) => {
            toastError(error);
        },
    });
};
