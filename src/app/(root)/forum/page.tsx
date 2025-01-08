"use client";

import useFetch from "@/hooks/useFetch";
import ForumItem from "./components/ForumItem";
import Link from "next/link";
import { BsGrid, BsListTask } from "react-icons/bs";
import Breadcrumb from "@/component/shared/Breadcrumb";
import Pagination from "@/component/shared/Pagination";
import { useState } from "react";
import { useAuthContext } from "@/context/authContext";
import { useSearchParams } from "next/navigation";

const ForumPosts = () => {
  const searchParams = useSearchParams();
  const pageNumber = searchParams.get("page");
  const page = pageNumber ? parseInt(pageNumber) : 1;

  const [currentView, setCurrentView] = useState("list");

  const { username } = useAuthContext();
  const { data: forumPosts, refresh } = useFetch(`/forum?limit=9&page=${page}`);

  return (
    <>
      <Breadcrumb title="Our Forum" />
      <main className="content">
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
          <div className="max-w-7xl mx-auto">
            <div className="inner">
              <div className="flex justify-between gap-x-8 gap-y-5 flex-wrap border-b border-borderlight dark:border-border pb-8 mb-8">
                {username && (
                  <Link href="/forum/create" className="btn">
                    Create new post
                  </Link>
                )}
                <div className="viewmode flex rounded-md overflow-hidden">
                  <button
                    title="List View"
                    className={`px-4 py-2.5 text-white text-xl ${
                      currentView === "list" ? "bg-primary" : "bg-dark"
                    }`}
                    onClick={() => setCurrentView("list")}
                  >
                    <BsListTask />
                  </button>
                  <button
                    title="List View"
                    className={`px-4 py-2.5 text-white text-xl ${
                      currentView === "grid" ? "bg-primary" : "bg-dark"
                    }`}
                    onClick={() => setCurrentView("grid")}
                  >
                    <BsGrid />
                  </button>
                </div>
              </div>
              <div
                className={`forum-wrapper grid ${
                  currentView === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "grid-cols-1 gap-10"
                }`}
              >
                {forumPosts &&
                  Array.isArray(forumPosts) &&
                  forumPosts.map((forumPostsItem) => (
                    <ForumItem
                      key={forumPostsItem.id}
                      forum={forumPostsItem}
                      refresh={refresh}
                      gridStyle={currentView === "grid" ? true : false}
                    />
                  ))}
              </div>
              <Pagination
                path="/forum"
                limit={9}
                page={page}
                length={forumPosts?.length}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ForumPosts;
