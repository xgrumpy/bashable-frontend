"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import Modal from "@/component/shared/Modal";
import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { RiDeleteBin3Line, RiEdit2Line } from "react-icons/ri";

interface IForumItemOptionProps {
    id: string;
    email: string;
    refresh: () => void;
}

const ForumItemOption = ({ id, email, refresh }: IForumItemOptionProps) => {
    const [confirmDelete, setConfirmDelete] = useState<string>("");
    const { email: loggedInUserEmail } = useAuthContext();

    const handleDelete = async () => {
        try {
            const response = await axiosReq.delete(
                `/forum/post/${confirmDelete}`
            );
            toast.success("Successfully deleted");
            setConfirmDelete("");
            refresh();
        } catch (err: any) {
            toastError(err);
        }
    };

    if (email !== loggedInUserEmail) return null;

    return (
        <>
            <ConfirmationModal
                state={Boolean(confirmDelete)}
                closeHandler={() => setConfirmDelete("")}
                acceptHandler={handleDelete}
                declineHandler={() => setConfirmDelete("")}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete this post?
                </h5>
            </ConfirmationModal>
            <div className="mt-4 options flex gap-x-5">
                <Link
                    href={`/forum/edit?postid=${id}`}
                    className="flex text-orange-500 items-center gap-x-1 font-medium"
                >
                    <RiEdit2Line className="text-lg" />
                    Edit Post
                </Link>
                <button
                    className="flex items-center text-red-500 gap-x-1 font-medium"
                    onClick={() => setConfirmDelete(id)}
                >
                    <RiDeleteBin3Line className="text-lg" />
                    Delete Post
                </button>
            </div>
        </>
    );
};

export default ForumItemOption;
