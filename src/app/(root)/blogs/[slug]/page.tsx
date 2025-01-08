"use client";

import useFetch from "@/hooks/useFetch";
import markdown from "@wcj/markdown-to-html";
import { formatDistanceToNow } from "date-fns";

const BlogDetails = ({ params }: any) => {
    const slug = params.slug;

    const { data: article, loading } = useFetch(`/public/articles/${slug}`);

    function createMarkup() {
        return { __html: markdown(article?.content) };
    }

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        {article && !loading && (
                            <div className="max-w-4xl mx-auto">
                                <article className="article space-y-4">
                                    <div className="relative overflow-hidden rounded-xl bg-grey dark:bg-light">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={article?.image}
                                            alt={article?.title}
                                            className="h-auto max-h-[500px] w-full overflow-hidden rounded-xl"
                                        />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-semibold text-black dark:text-white">
                                        {article?.title}
                                    </h2>
                                    <p className="text-sm text-bodylight dark:text-body">
                                        Published on:{" "}
                                        {article?.createdAt && (
                                            <span className="text-black dark:text-white">
                                                {formatDistanceToNow(
                                                    new Date(article?.createdAt)
                                                )}{" "}
                                                ago
                                            </span>
                                        )}
                                    </p>
                                    <div className="typographic">
                                        {/* @ts-ignore */}
                                        <div
                                            /* @ts-ignore */
                                            dangerouslySetInnerHTML={createMarkup()}
                                        ></div>
                                    </div>
                                </article>
                            </div>
                        )}
                        {!article && !loading && (
                            <div className="text-center">
                                <p>Article not found</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default BlogDetails;
