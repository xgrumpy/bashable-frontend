import Title from "@/component/shared/Title";
import Articles from "./components/Articles";
import Compare from "./components/Compare";
import Faqs from "./components/Faqs";
import Herosection from "./components/Herosection";
import RecentCreations from "./components/RecentCreations";
// import Testimonials from "./components/Testimonials";

export default function Home() {
    return (
        <main className="content">
            <Herosection />
            <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-white dark:bg-dark">
                <div className="max-w-7xl mx-auto">
                    <Title
                        title="Recent Creations"
                        subtitle="Recent Generations"
                    />
                    <RecentCreations />
                </div>
            </section>
            <Compare />
            {/* <Testimonials /> */}
            <Articles />
            <Faqs />
        </main>
    );
}
