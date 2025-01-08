"use client";

import Article from "@/component/shared/Article";
import Breadcrumb from "@/component/shared/Breadcrumb";
import Pagination from "@/component/shared/Pagination";
import useFetch from "@/hooks/useFetch";
import { IArticle } from "@/interfaces/general";
import { useSearchParams } from "next/navigation";

const Blogs = () => {
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const page = pageNumber ? parseInt(pageNumber) : 1;

  const { data: articles } = useFetch(`/public/articles?limit=9&page=${page}`);

  return (
    <>
      <Breadcrumb title="Our Blogs" />
      <main className="content">
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
          <div className="max-w-7xl mx-auto">
            <div className="blogs grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {articles && Array.isArray(articles) && articles.length ? (
                <>
                  {articles.map((article: IArticle) => (
                    <Article key={article.slug} article={article} />
                  ))}
                </>
              ) : (
                <p>No posts available</p>
              )}
            </div>
            <Pagination
              path="/blogs"
              page={page}
              limit={9}
              length={articles?.length}
            />
          </div>
        </section>
      </main>
    </>
  );
};

export default Blogs;
