"use client";

import ArticleLoader from "@/component/loaders/ArticleLoader";
import Article from "@/component/shared/Article";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/component/shared/SlickArrows";
import Title from "@/component/shared/Title";
import CustomMessage from "@/component/ui/CustomMessage";
import { useGetRecentArticles } from "@/hooks/useRecentArticles";
import React from "react";
import Slider from "react-slick";

const blogSliderSettings = {
    infinite: true,
    speed: 1000,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    useCss: true,
    easing: "ease",
    autoplay: true,
    pauseOnHover: false,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
            },
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 1,
            },
        },
    ],
};

const Articles = () => {
    const { data: articles, isLoading, isError } = useGetRecentArticles();

    return (
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-white dark:bg-dark w-full overflow-hidden">
            <div className="max-w-7xl w-full mx-auto">
                <Title title="Articles" subtitle="Latest Posts" />
                {isError ? (
                    <CustomMessage msg="Something is wrong!" />
                ) : isLoading && !articles ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                        <ArticleLoader />
                        <ArticleLoader />
                        <ArticleLoader />
                    </div>
                ) : !isError && !isLoading && !articles.length ? (
                    <CustomMessage msg="Not items to show!" />
                ) : !isError && !isLoading && articles.length ? (
                    <React.Fragment>
                        {articles.length > 3 ? (
                            <Slider
                                {...blogSliderSettings}
                                className="articles-slider"
                            >
                                {articles.map((article) => (
                                    <Article
                                        key={article.slug}
                                        article={article}
                                    />
                                ))}
                            </Slider>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                                {articles.map((article) => (
                                    <Article
                                        key={article.slug}
                                        article={article}
                                    />
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ) : null}
            </div>
        </section>
    );
};

export default Articles;
