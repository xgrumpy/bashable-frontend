import Skeleton from "react-loading-skeleton";

const TopUserLoader = () => {
    return (
        <div className="flex justify-between items-center flex-wrap gap-4 border border-borderlight dark:border-border p-2 rounded-md w-full">
            <div className="info flex items-center gap-x-1 w-full md:w-auto md:flex-1">
                <Skeleton circle height={48} width={48} />
                <Skeleton width={150} height={24} />
            </div>
            <div className="flex justify-between items-center flex-wrap gap-x-7 gap-y-1 md:flex-1">
                <Skeleton width={150} />
                <Skeleton width={150} />
                <Skeleton width={150} />
            </div>
            <div className="md:text-right w-full md:w-auto min-w-[170px]">
                <Skeleton width={100} height={40} />
            </div>
        </div>
    );
};

export default TopUserLoader;
