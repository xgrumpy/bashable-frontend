import Skeleton from "react-loading-skeleton";

const ArticleLoader = () => {
    return (
        <div>
            <Skeleton className="aspect-video" />
            <Skeleton width="90%" height={24} className="mt-5" />
            <Skeleton width="65%" className="mt-3" />
        </div>
    );
};

export default ArticleLoader;
