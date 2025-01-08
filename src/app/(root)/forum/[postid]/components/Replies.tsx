"use client";

import SingleReply from "./SingleReply";
import useFetch from "@/hooks/useFetch";
import { IReply } from "@/interfaces/general";
import CreateReply from "./CreateReply";

interface IRepliesProps {
  postid: string;
}

const Replies = ({ postid }: IRepliesProps) => {
  const { data: replies, refresh } = useFetch(`/forum/post/${postid}/comments`);

  return (
    <div className="replies mt-7">
      <h5 className="text-xl mb-4 font-semibold text-black dark:text-white">
        Create a reply
      </h5>
      <CreateReply postid={postid} refresh={refresh} />
      <h5 className="text-xl mb-4 font-semibold text-black dark:text-white">
        Replies
      </h5>
      <div className="replieswrapper">
        {replies &&
          Array.isArray(replies) &&
          replies.map((item: IReply) => (
            <SingleReply
              key={item.id}
              postId={postid}
              reply={item}
              refresh={refresh}
            />
          ))}
      </div>
    </div>
  );
};

export default Replies;
