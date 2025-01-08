import ConfirmationModal from "@root/src/component/shared/ConfirmationModal";
import Modal from "@root/src/component/shared/Modal";
import { useDeleteAPoll, useTogglePoolStatus } from "@root/src/hooks/admin/useDiscordPoll";
import { TPoll } from "@root/src/interfaces/adminDiscord";
import Link from "next/link";
import React, { useState } from "react";
import PoolDetails from "./PoolDetails";

type TSinglePoll = {
    data: TPoll;
};

export default function SinglePoll({ data }: TSinglePoll) {
    const { id, createdAt, isOpen, title, totalVotes, postId } = data;

    const [modalDeleteId, setModalDeleteId] = useState("");
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const { mutate: deleteAPoll, isLoading: isLoadingDelete } = useDeleteAPoll();
    const { mutate: togglePollStatus, isLoading: isLoadingToggle } = useTogglePoolStatus();

    const handleDelete = () => {
        deleteAPoll(
            {
                id: id,
            },
            {
                onSuccess: () => {
                    setModalDeleteId("");
                },
            }
        );
    };

    return (
        <React.Fragment>
            <ConfirmationModal
                state={!!modalDeleteId}
                closeHandler={() => setModalDeleteId("")}
                acceptHandler={handleDelete}
                declineHandler={() => setModalDeleteId("")}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete?
                </h5>
            </ConfirmationModal>
            <Modal state={isDetailsModalOpen} closeHandler={() => setIsDetailsModalOpen(false)}>
                <div className="max-w-4xl border border-border mx-auto bg-grey dark:bg-light p-5 md:p-10 rounded-2xl w-full">
                    <PoolDetails id={id} />
                </div>
            </Modal>
            <div className="border border-borderlight dark:border-border py-2 gap-y-4 rounded-md flex items-center justify-between flex-wrap lg:flex-nowrap">
                <div className="px-4 border-0 border-borderlight dark:border-border lg:border-r w-full lg:flex-1">
                    <h6 className="font-semibold">
                        Title: <span className="text-black dark:text-white">{title}</span>
                    </h6>
                    <p>
                        Status:{" "}
                        <span className="font-semibold text-black dark:text-white">
                            {isOpen ? "Open" : "Closed"}
                        </span>
                    </p>
                    <p>
                        Total Votes:{" "}
                        <span className="text-black dark:text-white">{totalVotes}</span>
                    </p>
                    <p>
                        Created At:{" "}
                        <span className="text-black dark:text-white">
                            {new Date(createdAt).toLocaleString()}
                        </span>
                    </p>
                </div>
                <div className="action flex flex-wrap items-center justify-center gap-2 px-4">
                    <Link
                        href={`${process.env.NEXT_PUBLIC_DISCORD_POLL_LINK}${postId}`}
                        target="_blank"
                        className="btn btn-sm btn-outline"
                    >
                        Discord Link
                    </Link>
                    <button className="btn btn-sm" onClick={() => setIsDetailsModalOpen(true)}>
                        View Details
                    </button>
                    <button
                        className="btn btn-sm !bg-yellow-500 !text-black"
                        onClick={() =>
                            togglePollStatus({
                                id: id,
                            })
                        }
                        disabled={isLoadingToggle}
                    >
                        {isOpen ? "Pause" : "Resume"}
                    </button>
                    <button
                        className="btn btn-sm !bg-red-500"
                        onClick={() => setModalDeleteId(id)}
                        disabled={isLoadingDelete}
                    >
                        Delete Poll
                    </button>
                </div>
            </div>
        </React.Fragment>
    );
}
