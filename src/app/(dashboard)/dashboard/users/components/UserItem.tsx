import ConfirmationModal from "@/component/shared/ConfirmationModal";
import { IUser } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import Image from "next/image";
import Link from "next/link";
import { ChangeEvent, KeyboardEvent, SyntheticEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import { HiPhoto } from "react-icons/hi2";
import { RiEditLine } from "react-icons/ri";

interface IUserItemProps {
    user: IUser;
    refresh: () => void;
}

const UserItem = ({ user, refresh }: IUserItemProps) => {
    const [isModerator, setIsModerator] = useState(false);
    const [isBetaTester, setIsBetaTester] = useState(false);
    const [isModeratorPopupOpen, setIsModeratorPopupOpen] = useState<boolean>(false);
    const [isBetaTesterPopupOpen, setIsBetaTesterPopupOpen] = useState(false);
    const [creditEditBox, setCreditEditBox] = useState<string>("");
    const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
    const [confirmBlock, setConfirmBlock] = useState<boolean>(false);

    const editRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setIsModerator(user.role === "mod" || false);
        setIsBetaTester(user?.isBetaTester || false);
    }, [user.role, user.isBetaTester]);

    const handleClickOutside = (event: MouseEvent) => {
        if (event.target !== editRef.current) {
            if (document.activeElement !== editRef.current) {
                setCreditEditBox("");
            }
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        try {
            const response = await axiosReq.delete(`/admin/users/${user.id}`);
            toast.success(response.data.message);
            setConfirmDelete(false);
            refresh();
        } catch (err: any) {
            toastError(err);
        }
    };

    const updateCredits = async (id: string, value: number) => {
        try {
            const response = await axiosReq.post(`/admin/users/${id}`, {
                credits: value,
            });
            toast.success(response.data.message);
            refresh();
        } catch (err: any) {
            toastError(err);
        }
    };

    const handleCreditBlur = async (e: ChangeEvent<HTMLInputElement>, id: string) => {
        await updateCredits(id, parseFloat(e.target.value));
        setCreditEditBox("");
    };

    const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>, id: string) => {
        if (e.key === "Enter") {
            await updateCredits(id, parseFloat(e.currentTarget.value));
            setCreditEditBox("");
        }
    };

    const handleBlockUser = (e: SyntheticEvent) => {
        axiosReq
            .post(`/admin/users/${user.id}/ban`)
            .then((res) => {
                toast.success(res.data.message);
                setConfirmBlock(false);
                refresh();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleModerator = () => {
        axiosReq
            .post(`/admin/users/${user.id}/mod`)
            .then((res) => {
                toast.success(res.data.message);
                setIsModerator(!isModerator);
                setIsModeratorPopupOpen(false);
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleBetaTester = () => {
        axiosReq
            .post(`/admin/users/${user.id}/beta`)
            .then((res) => {
                toast.success(res.data.message);
                setIsBetaTester(!isBetaTester);
                setIsBetaTesterPopupOpen(false);
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
                    Are you sure, you want to delete this user?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={confirmBlock}
                closeHandler={() => setConfirmBlock(false)}
                acceptHandler={handleBlockUser}
                declineHandler={() => setConfirmBlock(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to {user.banned ? "unblock" : "block"} this user?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isModeratorPopupOpen}
                closeHandler={() => setIsModeratorPopupOpen(false)}
                acceptHandler={handleModerator}
                declineHandler={() => setIsModeratorPopupOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to make him {isModerator ? "normal user" : "moderator"}?
                </h5>
            </ConfirmationModal>
            <ConfirmationModal
                state={isBetaTesterPopupOpen}
                closeHandler={() => setIsBetaTesterPopupOpen(false)}
                acceptHandler={handleBetaTester}
                declineHandler={() => setIsBetaTesterPopupOpen(false)}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure you want to{" "}
                    {isBetaTester ? "remove him a beta tester?" : "make him a beta tester?"}?
                </h5>
            </ConfirmationModal>
            <div
                key={user.id}
                className="border border-borderlight dark:border-border py-2 gap-y-4 rounded-md flex items-center justify-between flex-wrap lg:flex-nowrap"
            >
                <div className="userinfo px-4 border-0 border-borderlight dark:border-border w-full flex-auto lg:w-auto lg:flex-1 lg:border-r">
                    <div className="flex gap-2 flex-wrap lg:flex-nowrap items-center">
                        <div className="image relative overflow-hidden inline-flex justify-center items-center h-20 w-20 flex-grow-0 flex-shrink-0 basis-20 border border-borderlight dark:border-border rounded-full">
                            {user.avatar ? (
                                <Image
                                    src={user.avatar}
                                    className="h-full w-full cursor-pointer"
                                    alt={user.username}
                                    fill
                                />
                            ) : (
                                <HiPhoto className="text-xl text-bodylight dark:text-body" />
                            )}
                        </div>
                        <div className="content">
                            <h5 className="text-xl font-semibold">
                                <Link
                                    href={`/dashboard/users/${user.id}`}
                                    className="text-black dark:text-white hover:!text-primary"
                                >
                                    {user.username}
                                </Link>
                            </h5>
                            {typeof user.likes !== "undefined" && (
                                <p className="">
                                    Total likes: <strong>{user.likes}</strong>
                                </p>
                            )}
                            <p className="break-all">{user.email}</p>
                            <div className="flex items-center gap-x-1">
                                Credits:{" "}
                                <div className="inline-flex justify-center items-center gap-2">
                                    {creditEditBox !== user.id ? (
                                        <>
                                            <span className="text-black dark:text-white font-semibold">
                                                {user.credits?.toFixed(3)}
                                            </span>
                                            <button
                                                onClick={() => setCreditEditBox(user?.id as string)}
                                            >
                                                <RiEditLine />
                                            </button>
                                        </>
                                    ) : (
                                        <input
                                            ref={editRef}
                                            type="number"
                                            className="max-w-[80px] inline-block px-2 !h-8 text-center"
                                            defaultValue={user.credits.toFixed(3)}
                                            onBlur={(e) => handleCreditBlur(e, user?.id as string)}
                                            onKeyDown={(e) => handleKeyDown(e, user?.id as string)}
                                        />
                                    )}
                                </div>
                            </div>
                            {isBetaTester ? (
                                <span className="inline-block bg-primary text-white text-sm px-2 py-0.5 mt-1">
                                    Beta Tester
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>
                <div className="userdetails px-4 border-0 border-borderlight dark:border-border w-full flex-auto md:w-auto md:flex-1 md:border-r">
                    <ul>
                        <li>
                            Purchased Credits: <b>{user.totalCreditsPurchased}</b>
                        </li>
                        <li>
                            Total Generations: <b>{user.generations}</b>
                        </li>
                        <li>
                            Blocked Generations: <b>{user.blocks}</b>
                        </li>
                    </ul>
                </div>
                <div className="details px-4 border-0 border-borderlight dark:border-border flex-initial md:border-r">
                    <ul className="flex flex-col gap-1 min-w-[200px]">
                        <li>
                            <Link
                                href={`/dashboard/users/${user.id}`}
                                className="btn btn-sm btn-outline w-auto text-center lg:w-full"
                            >
                                User Details
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={`/dashboard/generations?user=${user.email}`}
                                className="btn btn-sm btn-outline w-auto text-center lg:w-full"
                            >
                                See Generations
                            </Link>
                        </li>
                        <li>
                            <button
                                className="btn !border-yellow-500 !text-yellow-500 btn-sm btn-outline w-auto text-center lg:w-full"
                                onClick={() => setIsModeratorPopupOpen(true)}
                            >
                                {isModerator ? "Make User" : "Make Moderator"}
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn !border-yellow-500 !text-yellow-500 btn-sm btn-outline w-auto text-center lg:w-full"
                                onClick={() => setIsBetaTesterPopupOpen(true)}
                            >
                                {isBetaTester ? "Remove Beta Tester" : "Make Beta Tester"}
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="blockdelete px-4">
                    <ul className="flex flex-col gap-2">
                        <li>
                            <button
                                className="btn btn-sm w-full !bg-yellow-500 !text-black"
                                onClick={() => setConfirmBlock(true)}
                            >
                                {user.banned ? "Unblock" : "Block"}
                            </button>
                        </li>
                        <li>
                            <button
                                className="btn btn-sm w-full !bg-red-500 !text-white"
                                onClick={() => setConfirmDelete(true)}
                            >
                                Delete
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default UserItem;
