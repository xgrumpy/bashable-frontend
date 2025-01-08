import Image from "next/image";
import { RiDoubleQuotesR } from "react-icons/ri";

const Testimonial = () => {
  return (
    <div className="testimonial overflow-hidden relative bg-grey dark:bg-light p-5 rounded-lg border transition-all border-borderlight dark:border-border hover:border-primary">
      <p className="text-bodylight dark:text-body text-lg">
        &quot;Your software is really easy to use. We are an e-commerce company.
        Before using your website, we had to art image with photo editing tools
        all night. Now your website makes life easier.&quot;
      </p>
      <div className="author flex gap-x-3 mt-5">
        <div className="image relative h-12 w-12 rounded-full">
          <Image
            src="/images/author.png"
            alt="Jonathon Doe"
            className="object-contain"
            fill
          />
        </div>
        <div className="content">
          <h5 className="text-lg text-black dark:text-white font-medium">
            Jonathon Doe
          </h5>
          <p className="text-sm text-bodylight dark:text-body text-opacity-90 dark:text-opacity-60">
            E-commerce, Amazon
          </p>
        </div>
      </div>
      <span className="icon text-[12vw] absolute left-auto -right-12 top-auto -bottom-16 text-bodylight dark:text-body opacity-[0.03]">
        <RiDoubleQuotesR />
      </span>
    </div>
  );
};

export default Testimonial;
