import { IUser } from "./general";

export type TPoll = {
    id: string;
    postId: string;
    title: string;
    description: string;
    totalVotes: number;
    isOpen: boolean;
    createdAt: string;
};

export type TPoolDetails = TPoll & {
    options: string[];
    votes: number[];
};

export type TConvictedUser = {
    id: string;
    discordConnected: boolean;
    discordUserName: string;
    offenseCount: number;
    muteCount: number;
    muted: boolean;
    banned: boolean;
    available: boolean;
    lastOffenseAt: string | null;
    lastMutedAt: string | null;
    lastBanedAt: string | null;
    firstOffenseAt: string;
};

export type TConvictedUserDetails = TConvictedUser & {
    user: IUser;
    discordUserId: string;
    offensiveMessages: string[];
    offenseTimestamps: number[];
};
