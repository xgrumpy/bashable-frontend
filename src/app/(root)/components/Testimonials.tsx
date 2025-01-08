import Testimonial from "@/component/shared/Testimonial";
import Title from "@/component/shared/Title";

const Testimonials = () => {
  return (
    <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-white dark:bg-dark">
      <div className="max-w-7xl mx-auto">
        <Title
          title="Testimonials"
          subtitle="What our customers say about us"
        />
        <div className="testimonials grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <Testimonial />
          <Testimonial />
          <Testimonial />
          <Testimonial />
          <Testimonial />
          <Testimonial />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
