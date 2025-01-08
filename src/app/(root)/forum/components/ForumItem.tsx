"use client";

import { IForumPost } from "@/interfaces/general";
import { RiReplyLine } from "react-icons/ri";
import ForumItemOption from "./ForumItemOption";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/authContext";
import { formatDistanceToNow } from "date-fns";
import { HiPhoto } from "react-icons/hi2";

interface IForumItemProps {
  forum: IForumPost;
  refresh: () => void;
  gridStyle?: boolean;
}

const ForumItem = ({ forum, refresh, gridStyle = false }: IForumItemProps) => {
  const { email } = useAuthContext();

  return (
    <article className="forumitem" key={forum.id}>
      <Link
        href={`/forum/${forum.id}`}
        className={`inner flex ${
          gridStyle
            ? "flex-col gap-5"
            : "items-start gap-8 flex-wrap md:flex-nowrap"
        }`}
      >
        {forum?.generation?.image || forum?.image ? (
          <div
            className={`aspect-video border border-borderlight dark:border-border flex justify-center items-center  rounded-lg overflow-hidden relative ${
              gridStyle
                ? ""
                : "w-full flex-grow-0 flex-shrink-0 md:basis-[320px] max-w-none md:max-w-xs"
            }`}
          >
            <Image
              src={forum?.generation?.image || forum?.image || ""}
              alt={forum.title}
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`aspect-video border bg-white dark:bg-dark border-borderlight dark:border-border flex justify-center items-center  rounded-lg overflow-hidden relative ${
              gridStyle
                ? ""
                : "w-full flex-grow-0 flex-shrink-0 md:basis-[320px] max-w-none md:max-w-xs"
            }`}
          >
            <div className="text-center">
              <HiPhoto className="text-3xl text-bodylight dark:text-body inline-block" />
              <p className="text-md mt-1 text-bodylight dark:text-body">
                No Photo
              </p>
            </div>
          </div>
        )}
        <div className="forumcontent w-full">
          <div className="author">
            <h5
              title={forum.title}
              className="text-xl mb-2 text-black dark:text-white font-semibold excerpt-2"
            >
              {forum.title}
            </h5>
            <div className="flex flex-wrap justify-between gap-x-8 gap-y-2">
              <p className="">
                Posted by :{" "}
                <span className="text-black dark:text-white font-semibold">
                  {forum.user.username}
                </span>
              </p>
              <p className="">
                Posted on :{" "}
                <span className="text-black dark:text-white font-semibold">
                  {formatDistanceToNow(new Date(forum.createdAt))} ago
                </span>
              </p>
            </div>
          </div>
          {!gridStyle && (
            <p className="mt-4 excerpt-2 max-h-12 overflow-hidden">
              {forum.content}
            </p>
          )}
          <p
            className={`flex items-center gap-x-1 text-black dark:text-white font-medium ${
              gridStyle ? "mt-3" : "mt-5"
            }`}
          >
            <RiReplyLine className="text-lg" />
            {forum.commentCount} Replies
          </p>
        </div>
      </Link>
      {forum.user.email === email && (
        <ForumItemOption
          id={forum.id}
          email={forum.user.email}
          refresh={refresh}
        />
      )}
    </article>
  );
};

export default ForumItem;
