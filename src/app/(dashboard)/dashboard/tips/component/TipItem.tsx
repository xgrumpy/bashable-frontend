import Image from "next/image";
import Link from "next/link";

interface ITipItemProps {
    createdAt: string;
    senderUsername?: string;
    senderAvatar?: string | null;
    receiverUsername?: string;
    receiverAvatar?: string | null;
    amount: number;
}

const TipItem = ({
    createdAt,
    senderUsername,
    senderAvatar,
    receiverUsername,
    receiverAvatar,
    amount,
}: ITipItemProps) => {
    return (
        <div className="flex justify-between items-center flex-wrap gap-4 border border-borderlight dark:border-border p-2 rounded-md w-full">
            <div className="w-full md:w-auto md:flex-1">
                <p>
                    Date:{" "}
                    <strong>{new Date(createdAt).toLocaleDateString()}</strong>
                </p>
                <p>
                    Time:{" "}
                    <strong>{new Date(createdAt).toLocaleTimeString()}</strong>
                </p>
            </div>
            <div className="w-full md:w-auto md:flex-1">
                <h6>Sender :</h6>
                {senderUsername ? (
                    <div className="user flex items-center gap-x-2">
                        <Link
                            href={`/profiles/${encodeURIComponent(
                                senderUsername
                            )}`}
                            className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                        >
                            {senderAvatar ? (
                                <Image
                                    src={senderAvatar}
                                    alt={senderUsername}
                                    className="h-full w-full"
                                    fill
                                />
                            ) : (
                                <span className="select-none">
                                    {senderUsername?.trim()[0]}
                                </span>
                            )}
                        </Link>
                        <h6 className="text-base font-semibold">
                            <Link
                                href={`/profiles/${encodeURIComponent(
                                    senderUsername
                                )}`}
                                className="text-black dark:text-white hover:!text-primary"
                            >
                                {senderUsername}
                            </Link>
                        </h6>
                    </div>
                ) : (
                    <h6 className="text-base font-semibold">Unknown User</h6>
                )}
            </div>
            <div className="w-full md:w-auto md:flex-1">
                <h6>Receiver :</h6>
                {receiverUsername ? (
                    <div className="user flex items-center gap-x-2">
                        <Link
                            href={`/profiles/${encodeURIComponent(
                                receiverUsername
                            )}`}
                            className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                        >
                            {receiverAvatar ? (
                                <Image
                                    src={receiverAvatar}
                                    alt={receiverUsername}
                                    className="h-full w-full"
                                    fill
                                />
                            ) : (
                                <span className="select-none">
                                    {receiverUsername?.trim()[0]}
                                </span>
                            )}
                        </Link>
                        <h6 className="text-base font-semibold">
                            <Link
                                href={`/profiles/${encodeURIComponent(
                                    receiverUsername
                                )}`}
                                className="text-black dark:text-white hover:!text-primary"
                            >
                                {receiverUsername}
                            </Link>
                        </h6>
                    </div>
                ) : (
                    <h6 className="text-base font-semibold">Unknown User</h6>
                )}
            </div>
            <p className="md:text-right w-full md:max-w-[200px]">
                Credits:{" "}
                <strong className="font-bold text-black dark:text-white">
                    {amount.toFixed(3)}
                </strong>
            </p>
        </div>
    );
};

export default TipItem;
