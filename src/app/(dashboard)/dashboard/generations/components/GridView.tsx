import MasonryLayout from "@/component/shared/MasonryLayout";

interface GridViewProps {
    url: string;
}

const GridView = ({ url }: GridViewProps) => {
    return (
        <div className="inner">
            <MasonryLayout
                breakpoints={{
                    default: 7,
                    1790: 6,
                    1536: 5,
                    1320: 4,
                    1024: 3,
                    768: 2,
                    540: 1,
                }}
                url={url}
                adminPage
            />
        </div>
    );
};

export default GridView;
