import FollowButton from "@/component/elements/FollowButton";
import Image from "next/image";
import Link from "next/link";

type TTopUserItem = {
    avatar: string | null;
    followers: number;
    following: boolean;
    id: string;
    tips: number;
    username: string;
    generations: number;
};
interface IUserItemProps {
    user: TTopUserItem;
    refresh: () => void;
}

const UserItem = ({ user, refresh }: IUserItemProps) => {
    return (
        <div className="flex justify-between items-center flex-wrap gap-4 border border-borderlight dark:border-border p-2 rounded-md w-full">
            <div className="info flex items-center gap-x-1 w-full md:w-auto md:flex-1">
                <Link
                    href={`/profiles/${encodeURIComponent(user.username)}`}
                    className="avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary h-12 w-12 inline-flex justify-center font-bold items-center uppercase rounded-full border-2 border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden"
                >
                    {user.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.username}
                            className="h-full w-full"
                            fill
                        />
                    ) : (
                        <span className="select-none">{user.username?.trim()[0]}</span>
                    )}
                </Link>
                <h6 className="text-base font-semibold">
                    <Link
                        href={`/profiles/${encodeURIComponent(user.username)}`}
                        className="text-black dark:text-white hover:!text-primary"
                    >
                        {user.username}
                    </Link>
                </h6>
            </div>
            <div className="flex justify-between items-center flex-wrap gap-x-7 gap-y-1 md:flex-1">
                <p className="text-center">
                    <strong>{user.followers}</strong> Followers
                </p>
                <p className="text-center">
                    <strong>{user.tips.toFixed(3)}</strong> Received Tips
                </p>
                <p className="text-center">
                    <strong>{user.generations}</strong> Featured/Showcased Generations
                </p>
            </div>
            <div className="md:text-right w-full md:w-auto min-w-[170px]">
                <FollowButton isFollowed={user.following} userId={user.id} refresh={refresh} />
            </div>
        </div>
    );
};

export default UserItem;
