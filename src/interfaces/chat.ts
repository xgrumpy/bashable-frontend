export interface IChatRequestedImage {
    chatId: string;
    image: string;
    index: number;
    cost: number;
}

export type TAdminChatAttachMode = "auto-gen-plus-send" | "auto-gen" | "manual";

export type TAdminChat = {
    botName: string;
    chatLength: number;
    id: string;
    lastChatAt: string;
    moderated: boolean;
    moderatedAt: string | null;
    moderatedBy: string | null;
    moderationMode: TAdminChatAttachMode;
    rolePlayerName: string;
    username: string;
};

export type TAdminChatSortBy = "chat_recent" | "chat_oldest" | "most_messages" | "least_messages";

export type TAdminChatProfile = {
    id: string;
    botAppearanceModel: string;
    botAppearanceNegativePrompt: string;
    botAppearancePrompt: string;
    botAvatar: string;
    botFirstMessage: string;
    botGender: string;
    botName: string;
    botSystemMessage: string;
    canRequestImage: boolean;
    chatLength: number;
    rolePlayerAvatar: string;
    rolePlayerGender: string;
    rolePlayerName: string;
    username: string;
};
