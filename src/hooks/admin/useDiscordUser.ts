import { TConvictedUser, TConvictedUserDetails } from "@root/src/interfaces/adminDiscord";
import axiosReq from "@root/src/utils/axios";
import { toastError } from "@root/src/utils/error";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

let storedFilterString = "";

// Get convicted users
type TGetConvictedUsersProps = {
    filterString?: string;
    limit?: number;
    pageParam?: number;
};

const getConvictedUsers = async ({
    filterString,
    limit = 20,
    pageParam = 1,
}: TGetConvictedUsersProps) => {
    const res = await axiosReq.get(
        `/admin/discord/convicted_users?limit=${limit}&page=${pageParam}${filterString}`
    );
    return res.data;
};

export const useGetConvictedUsers = ({ filterString, limit }: TGetConvictedUsersProps) => {
    storedFilterString = filterString || "";

    return useInfiniteQuery<TConvictedUser[]>({
        queryKey: ["admin", "discord", "convicted_users", storedFilterString],
        queryFn: ({ pageParam = 1 }) =>
            getConvictedUsers({ filterString: storedFilterString, limit, pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
    });
};

// Get single convicted user
type TGetConvictedUserProps = {
    id: string;
};

const getConvictedUser = async ({ id }: TGetConvictedUserProps) => {
    const res = await axiosReq.get(`/admin/discord/convicted_users/${id}`);
    return res.data;
};

export const useGetConvictedUser = ({ id }: TGetConvictedUserProps) => {
    return useQuery<TConvictedUserDetails>({
        queryKey: ["admin", "discord", "convicted_user", id],
        queryFn: () => getConvictedUser({ id }),
        refetchOnWindowFocus: false,
    });
};

// Toggle mute
type TToggleMuteProps = {
    id: string;
};

const toggleMute = async ({ id }: TToggleMuteProps) => {
    const res = await axiosReq.post(`/admin/discord/convicted_users/${id}/toggle-mute`);
    return res.data;
};

export const useToggleMute = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TToggleMuteProps) => toggleMute({ id }),
        onSuccess: (data, variables) => {
            toast.success(data.message);
            queryClient.setQueryData(
                ["admin", "discord", "convicted_users", storedFilterString],
                (oldData: any) => {
                    if (!oldData) return;
                    let newData = oldData.pages.map((page: TConvictedUser[]) => {
                        return page.map((item) => {
                            if (item.id === variables.id) {
                                return {
                                    ...item,
                                    muteCount: !item.muted ? item.muteCount + 1 : item.muteCount,
                                    lastMutedAt: !item.muted
                                        ? new Date(Date.now()).toISOString()
                                        : item.lastMutedAt,
                                    muted: !item.muted,
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
                }
            );
        },
        onError: (error) => {
            toastError(error);
        },
    });
};

// Toggle ban
type TToggleBanProps = {
    id: string;
};

const toggleBan = async ({ id }: TToggleBanProps) => {
    const res = await axiosReq.post(`/admin/discord/convicted_users/${id}/toggle-ban`);
    return res.data;
};

export const useToggleBan = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TToggleBanProps) => toggleBan({ id }),
        onSuccess: (data, variables) => {
            toast.success(data.message);

            queryClient.setQueryData(
                ["admin", "discord", "convicted_users", storedFilterString],
                (oldData: any) => {
                    if (!oldData) return;
                    let newData = oldData.pages.map((page: TConvictedUser[]) => {
                        return page.map((item) => {
                            if (item.id === variables.id) {
                                return {
                                    ...item,
                                    available: !item.banned ? !item.available : false,
                                    lastBanedAt: !item.banned
                                        ? new Date(Date.now()).toISOString()
                                        : item.lastBanedAt,
                                    banned: !item.banned,
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
                }
            );
        },
        onError: (error) => {
            toastError(error);
        },
    });
};

// Kick a user
type TKickUserProps = {
    id: string;
};

const kickAUser = async ({ id }: TKickUserProps) => {
    const res = await axiosReq.post(`/admin/discord/convicted_users/${id}/kick`);
    return res.data;
};

export const useKickUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TKickUserProps) => kickAUser({ id }),
        onSuccess: (data, variables) => {
            toast.success(data.message);

            queryClient.setQueryData(
                ["admin", "discord", "convicted_users", storedFilterString],
                (oldData: any) => {
                    if (!oldData) return;
                    let newData = oldData.pages.map((page: TConvictedUser[]) => {
                        return page.map((item) => {
                            if (item.id === variables.id) {
                                return {
                                    ...item,
                                    available: false,
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
                }
            );
        },
        onError: (error) => {
            toastError(error);
        },
    });
};

// Clear Offence
type TClearOffenceProps = {
    id: string;
};

const clearOffence = async ({ id }: TClearOffenceProps) => {
    const res = await axiosReq.post(`/admin/discord/convicted_users/${id}/clear`);
    return res.data;
};

export const useClearOffence = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TClearOffenceProps) => clearOffence({ id }),
        onSuccess: (data, variables) => {
            toast.success(data.message);

            queryClient.setQueryData(
                ["admin", "discord", "convicted_users", storedFilterString],
                (oldData: any) => {
                    if (!oldData) return;
                    let newData = oldData.pages.map((page: TConvictedUser[]) => {
                        return page.map((item) => {
                            if (item.id === variables.id) {
                                return {
                                    ...item,
                                    banned: false,
                                    muted: false,
                                    lastOffenseAt: null,
                                    offenseCount: 0,
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
                }
            );
        },
        onError: (error) => {
            toastError(error);
        },
    });
};
