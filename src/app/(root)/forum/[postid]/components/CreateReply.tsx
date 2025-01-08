"use client";

import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { FormEvent, useState } from "react";
import { toast } from "react-hot-toast";

interface ICreateReply {
  postid: string;
  replyToId?: string;
  close?: () => void;
  refresh: () => void;
}

const CreateReply = ({ postid, replyToId, close, refresh }: ICreateReply) => {
  const [content, setContent] = useState<string>("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axiosReq
      .post(`/forum/post/${postid}/comments`, {
        content,
        replyToId,
      })
      .then((res) => {
        setContent("");
        toast.success("Replied successfully");
        refresh();
        close && close();
      })
      .catch((err) => {
        toastError(err);
      });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="replybox space-y-3 pb-7">
      <div className="textbox">
        <textarea
          name="newreply"
          placeholder="Enter reply text here"
          className="h-auto min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <button className="btn">Reply</button>
    </form>
  );
};

export default CreateReply;
