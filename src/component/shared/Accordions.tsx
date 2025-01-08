"use client";

import { useState } from "react";
import Accordion, { IAccordion } from "./Accordion";

interface IAccordionProps {
    data: IAccordion[];
}

const Accordions = ({ data: accordions }: IAccordionProps) => {
    const [current, setCurrent] = useState<number>(1);

    return (
        <div className="faqs">
            {accordions && Array.isArray(accordions) && accordions.length ? (
                <>
                    {accordions.map((accordion) => (
                        <Accordion
                            key={accordion.priority}
                            current={current}
                            setCurrent={setCurrent}
                            data={accordion}
                        />
                    ))}
                </>
            ) : null}
        </div>
    );
};

export default Accordions;
