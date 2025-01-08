"use client";

import AccordionLoader from "@/component/loaders/AccordionLoader";
import Accordions from "@/component/shared/Accordions";
import Title from "@/component/shared/Title";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetFaqs } from "@/hooks/useFaqs";

const Faqs = () => {
    const { data: faqs, isLoading, isError } = useGetFaqs();

    return (
        <div className="section pt-24 md:pt-32 lg:pt-40 pb-24  bg-grey dark:bg-light">
            <div className="max-w-7xl mx-auto">
                <div className="max-w-5xl mx-auto">
                    <Title title="FAQ" subtitle="Frequently Asked Questions" />
                    {isError ? (
                        <CustomMessage msg="Something is wrong!" />
                    ) : isLoading && !faqs ? (
                        <div className="space-y-5">
                            <AccordionLoader open />
                            <AccordionLoader />
                            <AccordionLoader />
                            <AccordionLoader />
                            <AccordionLoader />
                        </div>
                    ) : !isLoading && !isError && !faqs.length ? (
                        <CustomMessage msg="No items to show!" />
                    ) : !isLoading && !isError && faqs.length ? (
                        <Accordions data={faqs} />
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default Faqs;
