"use client";

import useFetch from "@/hooks/useFetch";
import ForumItem from "../components/ForumItem";
import Replies from "./components/Replies";
import Breadcrumb from "@/component/shared/Breadcrumb";
import { formatDistanceToNow } from "date-fns";

const ForumPostDetails = ({ params }: any) => {
  const { postid } = params;
  const { data: forumPost, refresh } = useFetch(`/forum/post/${postid}`);

  return (
    <>
      <Breadcrumb title={forumPost?.title} />
      <main className="content">
        <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
          <div className="max-w-7xl mx-auto">
            <div className="inner">
              <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 mb-7">
                {forumPost?.user?.username ? (
                  <p>
                    Posted by :{" "}
                    <span className="text-black dark:text-white font-semibold">
                      {forumPost?.user?.username}
                    </span>
                  </p>
                ) : null}
                {forumPost?.commentCount === 0 || forumPost?.commentCount ? (
                  <p>
                    Replies :{" "}
                    <span className="text-black dark:text-white font-semibold">
                      {forumPost?.commentCount}
                    </span>
                  </p>
                ) : null}
                {forumPost?.createdAt ? (
                  <p>
                    Posted on :{" "}
                    <span className="text-black dark:text-white font-semibold">
                      {formatDistanceToNow(new Date(forumPost?.createdAt))} ago
                    </span>
                  </p>
                ) : null}
              </div>
              {forumPost?.generation?.image || forumPost?.image ? (
                <div className="flex justify-center items-center overflow-hidden mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={forumPost?.generation?.image || forumPost?.image || ""}
                    alt={forumPost?.title}
                    className="object-contain aspect-video max-h-[500px] rounded-lg overflow-hidden"
                  />
                </div>
              ) : null}
              <p>{forumPost?.content}</p>
              {forumPost?.id && <Replies postid={forumPost?.id} />}
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default ForumPostDetails;
