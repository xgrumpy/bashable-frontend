import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";

export const SampleNextArrow = ({ onClick }: { onClick?: any }) => {
    return (
        <button
            className="slickarrow absolute hover:text-primary hover:border-primary transition-all duration-200 text-base text-black dark:text-white inline-flex justify-center items-center left-auto right-1/2 -mr-12 lg:mr-0 lg:-right-16 mt-5 lg:-mt-5 top-full lg:top-1/2 h-10 w-10 rounded-full border-borderlight dark:border-border border-2"
            onClick={onClick}
        >
            <HiChevronRight />
        </button>
    );
};

export const SamplePrevArrow = ({ onClick }: { onClick?: any }) => {
    return (
        <button
            className="slickarrow absolute hover:text-primary hover:border-primary transition-all duration-200 text-base text-black dark:text-white inline-flex justify-center items-center -ml-12 lg:ml-0 left-1/2 lg:-left-16 top-full lg:top-1/2 mt-5 lg:-mt-5 h-10 w-10 rounded-full border-borderlight dark:border-border border-2"
            onClick={onClick}
        >
            <HiChevronLeft />
        </button>
    );
};
