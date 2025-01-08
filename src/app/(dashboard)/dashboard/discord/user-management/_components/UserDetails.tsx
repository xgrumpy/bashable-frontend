import { useGetConvictedUser } from "@root/src/hooks/admin/useDiscordUser";
import Image from "next/image";
import Link from "next/link";
import { HiPhoto } from "react-icons/hi2";

type TUserDetailsProps = {
    id: string;
};

export default function UserDetails({ id }: TUserDetailsProps) {
    const { data: userDetails } = useGetConvictedUser({
        id,
    });

    return (
        <div className="wrap">
            <h5 className="text-xl font-semibold text-black dark:text-white mb-2">Basic Info:</h5>
            <p>
                Discord Username:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.discordUserName}
                </span>
            </p>
            <p>
                Discord Connected:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.discordConnected ? "YES" : "NO"}
                </span>
            </p>
            <p>
                Available:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.available ? "YES" : "NO"}
                </span>
            </p>

            <p>
                Total Offences:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.offenseCount} times
                </span>
            </p>
            {userDetails?.firstOffenseAt ? (
                <p>
                    First Offense At:{" "}
                    <span className="text-black dark:text-white font-semibold">
                        {new Date(userDetails?.firstOffenseAt).toLocaleString()}
                    </span>
                </p>
            ) : null}
            {userDetails?.lastOffenseAt ? (
                <p>
                    Last Offense At:{" "}
                    <span className="text-black dark:text-white font-semibold">
                        {new Date(userDetails?.lastOffenseAt).toLocaleString()}
                    </span>
                </p>
            ) : null}

            <p>
                Banned:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.banned ? "YES" : "NO"}
                </span>
            </p>
            <p>
                Muted:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.muted ? "YES" : "NO"}
                </span>
            </p>
            <p>
                Total Mutes:{" "}
                <span className="text-black dark:text-white font-semibold">
                    {userDetails?.muteCount} times
                </span>
            </p>
            {userDetails?.lastMutedAt ? (
                <p>
                    Last Muted At:{" "}
                    <span className="text-black dark:text-white font-semibold">
                        {new Date(userDetails?.lastMutedAt).toLocaleString()}
                    </span>
                </p>
            ) : null}
            {userDetails?.lastBanedAt ? (
                <p>
                    Last Banned At:{" "}
                    <span className="text-black dark:text-white font-semibold">
                        {new Date(userDetails?.lastBanedAt).toLocaleString()}
                    </span>
                </p>
            ) : null}

            {userDetails?.user ? (
                <div className="mt-10">
                    <h5 className="text-xl font-semibold text-black dark:text-white mb-2">
                        User Information:
                    </h5>
                    <div className="border border-borderlight dark:border-border py-2 gap-y-4 rounded-md flex items-center justify-between flex-wrap lg:flex-nowrap">
                        <div className="userinfo px-4 border-0 border-borderlight dark:border-border w-full flex-auto lg:w-auto lg:flex-1 lg:border-r">
                            <div className="flex gap-2 flex-wrap lg:flex-nowrap items-center">
                                <div className="image relative overflow-hidden inline-flex justify-center items-center h-16 w-16 flex-grow-0 flex-shrink-0 basis-16 border border-borderlight dark:border-border rounded-full">
                                    {userDetails?.user.avatar ? (
                                        <Image
                                            src={userDetails?.user.avatar}
                                            className="h-full w-full cursor-pointer"
                                            alt={userDetails?.user.username}
                                            fill
                                        />
                                    ) : (
                                        <HiPhoto className="text-xl text-bodylight dark:text-body" />
                                    )}
                                </div>
                                <div className="content">
                                    <h5 className="text-xl font-semibold">
                                        <Link
                                            href={`/dashboard/users/${userDetails?.user.id}`}
                                            className="text-black dark:text-white hover:!text-primary"
                                        >
                                            {userDetails?.user.username}
                                        </Link>
                                    </h5>
                                    {typeof userDetails?.user.likes !== "undefined" && (
                                        <p className="">
                                            Total likes: <strong>{userDetails?.user.likes}</strong>
                                        </p>
                                    )}
                                    <p className="break-all">{userDetails?.user.email}</p>
                                    <div className="flex items-center gap-x-1">
                                        Credits:{" "}
                                        <span className="text-black dark:text-white font-semibold">
                                            {userDetails?.user.credits?.toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="userdetails px-4 border-0 border-borderlight dark:border-border w-full flex-auto md:w-auto md:flex-1 md:border-r">
                            <ul>
                                <li>
                                    Purchased Credits:{" "}
                                    <b>{userDetails?.user.totalCreditsPurchased}</b>
                                </li>
                                <li>
                                    Total Generations: <b>{userDetails?.user.generations}</b>
                                </li>
                                <li>
                                    Blocked Generations: <b>{userDetails?.user.blocks}</b>
                                </li>
                            </ul>
                        </div>
                        <div className="details px-4 border-0 border-borderlight dark:border-border flex-initial md:border-r">
                            <ul className="flex flex-col gap-1 min-w-[200px]">
                                <li>
                                    <Link
                                        href={`/dashboard/users/${userDetails?.user.id}`}
                                        target="_blank"
                                        className="btn btn-sm btn-outline w-auto text-center lg:w-full"
                                    >
                                        User Details
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={`/dashboard/generations?user=${userDetails?.user.email}`}
                                        target="_blank"
                                        className="btn btn-sm btn-outline w-auto text-center lg:w-full"
                                    >
                                        See Generations
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            ) : null}

            {userDetails?.offenseTimestamps.length ? (
                <div className="mt-10">
                    <h5 className="text-xl font-semibold text-black dark:text-white mb-2">
                        Offensive Messages:
                    </h5>
                    <div className="overflow-x-auto ">
                        <table className="border border-borderlight dark:border-border w-full">
                            <thead>
                                <tr className="bg-white dark:bg-dark">
                                    <th className="font-semibold text-black dark:text-white py-2.5 px-1.5 text-left">
                                        Date & Time
                                    </th>
                                    <th className="font-semibold text-black dark:text-white py-2.5 px-1.5 text-left">
                                        Message
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {userDetails?.offenseTimestamps.map((item, index) => (
                                    <tr
                                        key={item}
                                        className="border-b border-borderlight dark:border-border"
                                    >
                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                            {new Date(item).toLocaleString()}
                                        </td>
                                        <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                            {userDetails?.offensiveMessages[index]}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
