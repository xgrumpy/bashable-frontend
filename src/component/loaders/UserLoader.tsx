import Skeleton from "react-loading-skeleton";

const UserLoader = () => {
    return (
        <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-4 border border-borderlight dark:border-border p-2 rounded-md w-full">
            <div className="user flex items-center gap-x-2">
                <Skeleton circle height={48} width={48} />
                <div className="content">
                    <Skeleton width={150} height={24} />
                    <Skeleton />
                </div>
            </div>
            <div className="text-right">
                <Skeleton width={100} height={40} />
            </div>
        </div>
    );
};

export default UserLoader;
