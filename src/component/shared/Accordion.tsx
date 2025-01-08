"use client";

import markdown from "@wcj/markdown-to-html";
import { HiMinus, HiPlus } from "react-icons/hi2";

export interface IAccordion {
  id?: number;
  question: string;
  answer: string;
  priority: number;
}

interface IAccordionProps {
  data: IAccordion;
  current: number;
  setCurrent: (arg0: number) => void;
}

const Accordion = ({ data, current, setCurrent }: IAccordionProps) => {
  function createMarkup(content: string) {
    return { __html: markdown(content) };
  }

  return (
    <div className="faq mt-5 first:mt-0" key={data.priority}>
      <button
        className={`flex items-center justify-between gap-x-3 text-left font-medium  w-full  border-2 rounded-md px-3 sm:px-5 py-3 ${
          current === data.priority
            ? "border-primary bg-primary bg-opacity-80 text-white rounded-b-none"
            : "border-borderlight dark:border-border bg-white dark:bg-dark"
        }`}
        onClick={() =>
          setCurrent(current === data.priority ? -100 : data.priority)
        }
      >
        <span className="text-lg font-semibold">{data.question}</span>
        {current === data.priority ? (
          <HiMinus className="text-lg text-white" />
        ) : (
          <HiPlus className="text-lg text-white" />
        )}
      </button>
      <div
        className={`faqcontent bg-white dark:bg-dark px-4 sm:px-7 text-bodylight dark:text-body py-5 rounded-b-md border-2 border-borderlight dark:border-border border-t-0 ${
          data.priority === current ? "block" : "hidden"
        }`}
      >
        <div className="typographic">
          {/* @ts-ignore */}
          <div dangerouslySetInnerHTML={createMarkup(data.answer)}></div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
