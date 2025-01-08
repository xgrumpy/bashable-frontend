export type TNotificationType =
    | "tip"
    | "recharging_auto"
    | "recharging_auto_failed"
    | "recharged"
    | "quest_completed";

export type INotificationTip = {
    amount: number;
    sender: string;
};

export type INotificationRechargingAuto = {
    credits: number;
};
export type INotificationRechargingAutoFailed = {};
export type INotificationRecharged = {
    credits: number;
    platform: string;
};
export type INotificationQuestComplete = {
    name:
        | "share-one-image-discord"
        | "share-one-image-profile"
        | "share-ten-image-profile"
        | "get-first-referral-signup"
        | "get-first-follower"
        | "get-ten-follower";
    reward: number;
};

export interface INotification {
    data: INotificationTip &
        INotificationRechargingAuto &
        INotificationRechargingAutoFailed &
        INotificationRecharged &
        INotificationQuestComplete;
    createdAt: string;
    id: string;
    read: boolean;
    type: TNotificationType;
}
