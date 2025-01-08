import axiosReq from "@/utils/axios";
import { TAdminChat, TAdminChatAttachMode, TAdminChatProfile } from "@root/src/interfaces/chat";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Get all chats
type TGetChatMessagesProps = {
    filterString: string;
    limit?: number;
    pageParam?: number;
};

const getChats = async ({ filterString, limit = 20, pageParam = 1 }: TGetChatMessagesProps) => {
    const res = await axiosReq.get(`/admin/chats?limit=${limit}&page=${pageParam}${filterString}`);
    return res.data;
};

export const useGetChats = ({ filterString, limit }: TGetChatMessagesProps) => {
    return useInfiniteQuery<TAdminChat[]>({
        queryKey: ["admin", "chats", filterString],
        queryFn: ({ pageParam = 1 }) => getChats({ filterString, limit, pageParam }),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.length === limit ? pages.length + 1 : undefined;
        },
        refetchOnWindowFocus: false,
    });
};

// Get Individual chat messages
type TGetChatMessageProps = {
    id: string;
};

const getChatMessages = async ({ id }: TGetChatMessageProps) => {
    const res = await axiosReq.get(`/admin/chats/${id}/history`);
    return res.data;
};

export const useGetChatMessages = ({ id }: TGetChatMessageProps) => {
    return useQuery<string[]>({
        queryKey: ["admin", "chathistory", id],
        queryFn: () => getChatMessages({ id }),
        refetchOnWindowFocus: false,
    });
};

// Get chat profile
type TGetChatProfileProps = {
    id: string;
};

const getChatProfile = async ({ id }: TGetChatProfileProps) => {
    const res = await axiosReq.get(`/admin/chats/${id}`);
    return res.data;
};

export const useGetChatProfile = ({ id }: TGetChatProfileProps) => {
    return useQuery<TAdminChatProfile>({
        queryKey: ["admin", "chatprofile", id],
        queryFn: () => getChatProfile({ id }),
        refetchOnWindowFocus: false,
    });
};

// Participate to a chat
type TAttachToChatProps = {
    id: string;
    mode: TAdminChatAttachMode;
};

const attachToChat = async ({ id, mode }: TAttachToChatProps) => {
    const res = await axiosReq.post(`/admin/chats/${id}/attach?mode=${mode}`);
    return res.data;
};

export const useAttachToChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, mode }: TAttachToChatProps) => attachToChat({ id, mode }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "chats"] });
        },
    });
};

// Detach from a chat
type TLeaveFromChatProps = {
    id: string;
};

const leaveFromChat = async ({ id }: TLeaveFromChatProps) => {
    const res = await axiosReq.post(`/admin/chats/${id}/detach`);
    return res.data;
};

export const useLeaveFromChat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id }: TLeaveFromChatProps) => leaveFromChat({ id }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "chats"] });
        },
    });
};

// Switch chat mode
type TSwitchChatModeProps = {
    id: string;
    mode: TAdminChatAttachMode;
};

const switchChatMode = async ({ id, mode }: TSwitchChatModeProps) => {
    const res = await axiosReq.post(`/admin/chats/${id}/switch-mode?mode=${mode}`);
    return res.data;
};

export const useSwitchChatMode = () => {
    return useMutation({
        mutationFn: ({ id, mode }: TSwitchChatModeProps) => switchChatMode({ id, mode }),
    });
};

// Send message chat
type TSendMessageToUserProps = {
    id: string;
    data: {
        user: string;
        bot: string;
        edited: number | null;
    };
};

const sendMessageToUser = async ({ id, data }: TSendMessageToUserProps) => {
    const res = await axiosReq.post(`/admin/chats/${id}/moderate`, { ...data });
    return res.data;
};

export const useSendMessageToUser = () => {
    return useMutation({
        mutationFn: ({ id, data }: TSendMessageToUserProps) => sendMessageToUser({ id, data }),
    });
};
