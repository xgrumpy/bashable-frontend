import Breadcrumb from "@/component/shared/Breadcrumb";
import Image from "next/image";

const AboutPage = () => {
    return (
        <>
            <Breadcrumb title="About" />
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <div className="max-w-3xl mx-auto">
                            <div className="image relative aspect-video overflow-hidden rounded-md mb-6">
                                <Image
                                    src="/images/about-image.webp"
                                    alt="bashable.art"
                                    className="w-full object-cover"
                                    fill
                                />
                            </div>
                            <div className="content space-y-2.5">
                                <h3 className="text-2xl font-semibold text-black dark:text-white">
                                    Welcome to Bashable.art
                                </h3>
                                <h6 className="text-lg font-semibold">
                                    Generative AI is incredibly empowering to allow individuals to
                                    explore and express thier imagination. Our goal is to make these
                                    tools accessible and afforadable to everyone. So, we created
                                    bashable.art to help enable that mission.
                                </h6>
                                <ul className="styledlist">
                                    <li>
                                        No recurring subscription fees. Your credits never expire.
                                        No subscriptions.
                                    </li>
                                    <li>
                                        Cheaper than buying a GPU. Cheaper than renting a cloud
                                        instance.
                                    </li>
                                    <li>
                                        Only pay for the processing time you use. Don’t pay for idle
                                        time.
                                    </li>
                                </ul>
                                <p className="text-lg">
                                    While we are starting with generated imagery, we hope to expand
                                    our tools overtime to cover a variety of popular workflows. If
                                    you have a suggestion of something you would like to see
                                    supported. Please join our{" "}
                                    <a
                                        href={process.env.NEXT_PUBLIC_DISCORD_LINK}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-semibold underline hover:text-primary"
                                    >
                                        Discord Community
                                    </a>{" "}
                                    to share your thoughts and ideas.
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
