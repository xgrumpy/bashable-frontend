export interface IImageData {
    id: string;
    image: string;
    prompt: string;
    negative_prompt: string;
    createdAt: string;
    model: string;
    height: number;
    width: number;
    steps: number;
    seed: number;
    cfg_scale: number;
    sampler: string;
    liked: boolean;
    restricted: boolean;
    blocked: boolean;
    private: boolean;
    module: string;
    likes: number;
    downloads: number;
    views: number;
    username?: string;
    thumbnail?: string;
    email?: string;
    tags?: string[];
    showcase: boolean;
    size: string;
    featured?: boolean;
}

export interface IArticle {
    id: string;
    title: string;
    image: string;
    slug: string;
    createdAt: string;
    content?: string;
}

export interface IFaq {
    id: string;
    question: string;
    answer: string;
    priority: number;
}

export interface IUser {
    id?: string;
    avatar: string | null;
    createdAt: string;
    credits: number;
    email: string;
    generations: number;
    totalCreditsPurchased: number;
    transactions: number;
    username: string;
    role: string;
    blocks?: number;
    banned?: boolean;
    likes?: number;
    isBetaTester?: boolean;
    updatedAt?: string;
}

export interface ITransaction {
    createdAt: string;
    credits: number;
    provider: string;
    username: string;
    email: string;
    note: string;
}

export interface IGeneration extends IImageData {
    private: boolean;
    regenerations?: number;
    ip?: string;
}

export interface IForumPost {
    id: string;
    user: {
        username: string;
        email: string;
    };
    generation?: IGeneration;
    image?: string;
    title: string;
    content: string;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface IReply {
    id: string;
    content: string;
    user: {
        username: string;
        email: string;
        avatar: string;
    };
    createdAt: string;
    updatedAt: string;
    replies: IReply[];
}

export interface IIpAddress {
    id: string;
    address: string;
    generations: number;
    upscales: number;
    accountsCreated: number;
    banned: boolean;
    blocks: number;
}

export interface IProfile {
    avatar: string | null;
    createdAt: string;
    followed: boolean;
    followersNum: number;
    followingNum: number;
    generations: number;
    id: string;
    showcased: IImageData[];
    upscales: number;
    username: string;
}

export interface IProfileMinimal {
    id: string;
    username: string;
    avatar: string | null;
    following: boolean;
    followed?: boolean;
}

export interface IBotProfile {
    botAvatar: string;
    botName: string;
    botDescription: string;
    botFirstMessage: string;
    botPersonalitySummary: string;
    chatScenario: string;
    chatExample: string;
    botGender: string;
    botAppearancePrompt?: string;
    botAppearanceNegativePrompt?: string;
    botAppearanceModel?: string;
}

export interface IChatProfile {
    id: string;
    rolePlayerName: string;
    rolePlayerAvatar: string | null;
    rolePlayerGender: string;
    botName: string;
    botAvatar: string | null;
    botGender: string;
    lastChatAt: string;
    canRequestImage?: boolean | null;
}
