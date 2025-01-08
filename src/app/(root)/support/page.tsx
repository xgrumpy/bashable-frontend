import Breadcrumb from "@/component/shared/Breadcrumb";
import Image from "next/image";

const AboutPage = () => {
    return (
        <>
            <Breadcrumb title="Support" />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl mx-auto">
                            <div className="image relative aspect-video overflow-hidden rounded-md mb-6">
                                <Image
                                    src="/images/support.webp"
                                    alt="bashable.art"
                                    className="w-full object-cover"
                                    fill
                                />
                            </div>
                            <div className="content space-y-2.5">
                                <h3 className="text-2xl font-semibold text-black dark:text-white">
                                    How do I contact support?
                                </h3>
                                <p className="text-lg">
                                    The best path for support is our{" "}
                                    <a
                                        href={
                                            process.env.NEXT_PUBLIC_DISCORD_LINK
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold underline hover:text-primary"
                                    >
                                        Discord Server
                                    </a>{" "}
                                    where moderators and community members may
                                    be able to help answers questions, offer
                                    suggestions, or track bug fixes/feature
                                    requests. If you have issues related
                                    specificlly to your account, you can email{" "}
                                    <a
                                        href="mailto:support@bashable.art"
                                        className="font-semibold underline hover:text-primary"
                                    >
                                        support@bashable.art
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default AboutPage;
