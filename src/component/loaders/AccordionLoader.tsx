import Skeleton from "react-loading-skeleton";

const AccordionLoader = ({ open = false }: { open?: boolean }) => {
    return (
        <div>
            <Skeleton height={40} />
            {open && <Skeleton height={150} />}
        </div>
    );
};

export default AccordionLoader;
