import { IGeneration } from "@/interfaces/general";
import { serializeInfiniteData } from "@/utils/utils";
import InfiniteScroll from "react-infinite-scroll-component";
import Skeleton from "react-loading-skeleton";
import Masonry from "react-masonry-css";
import CustomMessage from "../ui/CustomMessage";
import PopupImageAdmin from "./PopupImageAdmin";

interface IInfiniteDataShowcaseProps {
    data: any;
    fetchNextPage: () => void;
    hasNextPage: boolean;
    isLoading: boolean;
    isError: boolean;
    limit?: number;
    breakpointCols?: {};
}

const InfiniteDataShowcaseAdmin = ({
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
    limit = 21,
    breakpointCols = {
        default: 7,
        1790: 6,
        1536: 5,
        1320: 4,
        1024: 3,
        768: 2,
        540: 1,
    },
}: IInfiniteDataShowcaseProps) => {
    return (
        <InfiniteScroll
            dataLength={serializeInfiniteData(data).length}
            next={fetchNextPage}
            hasMore={hasNextPage}
            loader={null}
        >
            <Masonry
                breakpointCols={breakpointCols}
                className="my-masonry-grid"
                columnClassName="my-masonry-grid_column"
            >
                {!isError &&
                    data?.pages.map((group: any) =>
                        group.map((item: IGeneration) => (
                            <PopupImageAdmin key={item.id} imageData={item} />
                        ))
                    )}
                {isLoading &&
                    new Array(limit)
                        .fill(0)
                        .map((_, index) => <Skeleton key={index} className="aspect-square mb-3" />)}
            </Masonry>
            {isError && <CustomMessage msg="Something is wrong!" />}
            {!isLoading && !isError && !hasNextPage ? (
                serializeInfiniteData(data).length ? (
                    <CustomMessage msg="You reached the end!" />
                ) : (
                    <CustomMessage msg="There is no items to show!" />
                )
            ) : null}
        </InfiniteScroll>
    );
};

export default InfiniteDataShowcaseAdmin;
