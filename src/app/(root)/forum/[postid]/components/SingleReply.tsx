"use client";

import Modal from "@/component/shared/Modal";
import { IReply } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { useEffect, useState, FormEvent } from "react";
import { toast } from "react-hot-toast";
import { RiCloseLine, RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";
import CreateReply from "./CreateReply";
import { useAuthContext } from "@/context/authContext";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { toastError } from "@/utils/error";
import ConfirmationModal from "@/component/shared/ConfirmationModal";

interface ISingleReplyProps {
    reply: IReply;
    postId: string;
    refresh: () => void;
}

const SingleReply = ({ reply, postId, refresh }: ISingleReplyProps) => {
    const [isOpenReply, setIsOpenReply] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [editContent, setEditContent] = useState<string>("");
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

    const { email } = useAuthContext();

    useEffect(() => {
        setEditContent(reply.content);
    }, [reply.content]);

    const handleDelete = async (e: FormEvent) => {
        try {
            const response = await axiosReq.delete(
                `/forum/post/${postId}/comments/${reply.id}`
            );
            toast.success("Successfully deleted");
            setConfirmDelete(false);
            refresh();
        } catch (err: any) {
            toastError(err);
        }
    };

    const handleEdit = (e: FormEvent) => {
        e.preventDefault();
        axiosReq
            .post(`/forum/post/${postId}/comments/${reply.id}`, {
                content: editContent,
            })
            .then((res) => {
                setIsEdit(false);
                toast.success("Edited successfully");
                refresh();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <ConfirmationModal
                state={confirmDelete}
                closeHandler={() => setConfirmDelete(false)}
                acceptHandler={handleDelete}
                declineHandler={() => setConfirmDelete(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete this reply?
                </h5>
            </ConfirmationModal>
            <article className="singlereply pl-4 md:pl-5 bg-white dark:bg-dark border-l border-borderlight dark:border-border">
                <div className="inner py-5">
                    <div className="flex gap-3 items-start mb-2">
                        <span className="image rounded-full overflow-hidden relative h-10 w-10 basis-10 grow-0 shrink-0">
                            <Image
                                src={reply.user.avatar}
                                alt={reply.user.username}
                                fill
                                className="object-cover"
                            />
                        </span>
                        <div className="-mt-1.5">
                            <h5 className="text-lg text-black dark:text-white font-medium">
                                {reply.user.username}
                            </h5>
                            <p className="text-sm">
                                Posted on :{" "}
                                <span className="text-black dark:text-white font-semibold">
                                    {formatDistanceToNow(
                                        new Date(reply.createdAt)
                                    )}{" "}
                                    ago
                                </span>
                            </p>
                        </div>
                    </div>
                    {isEdit ? (
                        <form
                            onSubmit={(e) => handleEdit(e)}
                            className="replybox space-y-3 mt-2"
                        >
                            <div className="textbox">
                                <textarea
                                    name="newreply"
                                    id=""
                                    placeholder="Enter reply text here"
                                    className="h-auto min-h-[100px]"
                                    value={editContent}
                                    onChange={(e) =>
                                        setEditContent(e.target.value)
                                    }
                                ></textarea>
                            </div>
                            <button className="btn btn-sm">Edit</button>
                        </form>
                    ) : (
                        <p className="mt-3">{reply.content}</p>
                    )}
                    {email && (
                        <div className="mt-4 options flex gap-x-5">
                            <button
                                className="font-medium text-sm text-black dark:text-white"
                                onClick={() => setIsOpenReply(!isOpenReply)}
                            >
                                {isOpenReply ? "Cancel Reply" : "Reply"}
                            </button>
                            {reply.user.email === email && (
                                <>
                                    {isEdit ? (
                                        <button
                                            className="flex text-orange-500 items-center gap-x-1 font-medium text-sm"
                                            onClick={() => setIsEdit(false)}
                                        >
                                            Cancel Edit
                                        </button>
                                    ) : (
                                        <button
                                            className="flex text-orange-500 items-center gap-x-1 font-medium text-sm"
                                            onClick={() => setIsEdit(true)}
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        className="flex items-center text-red-500 gap-x-1 font-medium text-sm"
                                        onClick={() => setConfirmDelete(true)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
                {isOpenReply && (
                    <CreateReply
                        postid={postId}
                        replyToId={reply.id}
                        refresh={refresh}
                        close={() => setIsOpenReply(false)}
                    />
                )}
                {reply.replies &&
                    Array.isArray(reply.replies) &&
                    reply.replies.map((replyItem) => (
                        <SingleReply
                            key={replyItem.id}
                            postId={postId}
                            reply={replyItem}
                            refresh={refresh}
                        />
                    ))}
            </article>
        </>
    );
};

export default SingleReply;
