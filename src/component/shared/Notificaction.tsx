import { useNotificationContext } from "@/context/notificationContext";
import { INotification } from "@/interfaces/notifications";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface INotificationProps {
    data: INotification;
    closeNotifications: () => void;
}

const Notificaction = ({ data, closeNotifications }: INotificationProps) => {
    const { markAsRead } = useNotificationContext();

    const handleMarkAsRead = () => {
        axiosReq
            .get(`/users/notifications/${data.id}/read`)
            .then((res) => {
                markAsRead(data.id);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    if (data.type === "tip") {
        return (
            <div
                className={`notification space-y-1 border-b border-borderlight dark:border-border border-opacity-40 dark:border-opacity-40 py-1.5 px-3 text-sm cursor-pointer ${
                    data.read ? "" : "bg-primary bg-opacity-10"
                }`}
                onClick={handleMarkAsRead}
            >
                <div className="flex justify-between flex-wrap gap-x-2 items-center">
                    <strong className="font-strong text-primary">Tip Received</strong>
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(data.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm text-black dark:text-white">
                    You have received {data.data.amount} credits as tip from{" "}
                    {data?.data?.sender ? (
                        <Link
                            href={`/profiles/${encodeURIComponent(data.data.sender)}`}
                            className="font-semibold text-black dark:text-white hover:!text-primary"
                            onClick={closeNotifications}
                        >
                            {data.data.sender}
                        </Link>
                    ) : (
                        <p className="font-semibold text-black dark:text-white">Unknown User</p>
                    )}
                </p>
            </div>
        );
    }

    if (data.type === "recharging_auto") {
        return (
            <div
                className={`notification space-y-1 border-b border-borderlight dark:border-border border-opacity-40 dark:border-opacity-40 py-1.5 px-3 text-sm cursor-pointer ${
                    data.read ? "" : "bg-primary bg-opacity-10"
                }`}
                onClick={handleMarkAsRead}
            >
                <div className="flex justify-between flex-wrap gap-x-2 items-center">
                    <strong className="font-strong text-yellow-500">
                        Automatically recharging
                    </strong>
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(data.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm text-black dark:text-white">
                    Automatically recharging <strong>{data.data.credits}</strong> credits.
                </p>
            </div>
        );
    }

    if (data.type === "recharging_auto_failed") {
        return (
            <div
                className={`notification space-y-1 border-b border-borderlight dark:border-border border-opacity-40 dark:border-opacity-40 py-1.5 px-3 text-sm cursor-pointer ${
                    data.read ? "" : "bg-primary bg-opacity-10"
                }`}
                onClick={handleMarkAsRead}
            >
                <div className="flex justify-between flex-wrap gap-x-2 items-center">
                    <strong className="font-strong text-red-500">
                        Automatically recharging failed
                    </strong>
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(data.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm text-black dark:text-white">Could not recharge.</p>
            </div>
        );
    }

    if (data.type === "recharged") {
        return (
            <div
                className={`notification space-y-1 border-b border-borderlight dark:border-border border-opacity-40 dark:border-opacity-40 py-1.5 px-3 text-sm cursor-pointer ${
                    data.read ? "" : "bg-primary bg-opacity-10"
                }`}
                onClick={handleMarkAsRead}
            >
                <div className="flex justify-between flex-wrap gap-x-2 items-center">
                    <strong className="font-strong text-primary">Recharged</strong>
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(data.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm text-black dark:text-white">
                    Successfully recharged <strong>{data.data.credits}</strong> credits using{" "}
                    <strong>{data.data.platform}</strong>.
                </p>
            </div>
        );
    }

    if (data.type === "quest_completed") {
        return (
            <div
                className={`notification space-y-1 border-b border-borderlight dark:border-border border-opacity-40 dark:border-opacity-40 py-1.5 px-3 text-sm cursor-pointer ${
                    data.read ? "" : "bg-primary bg-opacity-10"
                }`}
                onClick={handleMarkAsRead}
            >
                <div className="flex justify-between flex-wrap gap-x-2 items-center">
                    <strong className="font-strong text-primary">Quest Completed</strong>
                    <span className="text-xs">
                        {formatDistanceToNow(new Date(data.createdAt))} ago
                    </span>
                </div>
                <p className="text-sm text-black dark:text-white">
                    You have successfully completed the{" "}
                    <strong>
                        {data.data.name === "share-one-image-discord" ? (
                            "Share first image on Discord"
                        ) : data.data.name === "share-one-image-profile" ? (
                            "Share first image on your profile"
                        ) : data.data.name === "share-ten-image-profile" ? (
                            "Share 10 images on your profile"
                        ) : data.data.name === "get-first-follower" ? (
                            <Link
                                href="/myprofile/followers"
                                className="font-semibold text-black dark:text-white hover:!text-primary"
                                onClick={closeNotifications}
                            >
                                Get first follower
                            </Link>
                        ) : data.data.name === "get-ten-follower" ? (
                            <Link
                                href="/myprofile/followers"
                                className="font-semibold text-black dark:text-white hover:!text-primary"
                                onClick={closeNotifications}
                            >
                                Get 10 followers
                            </Link>
                        ) : data.data.name === "get-first-referral-signup" ? (
                            <Link
                                href="/myprofile"
                                className="font-semibold text-black dark:text-white hover:!text-primary"
                                onClick={closeNotifications}
                            >
                                Get first referral signup
                            </Link>
                        ) : null}
                    </strong>{" "}
                    quest and earned <strong>{data.data.reward}</strong> credits as reward.
                </p>
            </div>
        );
    }

    return null;
};

export default Notificaction;
