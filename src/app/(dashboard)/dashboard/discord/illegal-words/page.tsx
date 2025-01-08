"use client";

import ConfirmationModal from "@/component/shared/ConfirmationModal";
import Modal from "@/component/shared/Modal";
import useFetch from "@/hooks/useFetch";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { RiDeleteBin5Line, RiEditLine } from "react-icons/ri";

interface IIllegalWord {
    id: string;
    word: string;
}

const DiscordIllegalWordsPage = () => {
    const [modalDeleteId, setModadlDeleteId] = useState<string>("");
    const [modalEditItem, setModalEditItem] = useState<IIllegalWord | null>(null);
    const [currentWord, setCurrentWord] = useState<string>("");

    const { data: illegalWords, refresh } = useFetch("/admin/discord/banned_words");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axiosReq
            .post("/admin/discord/banned_words", {
                word: currentWord.toLowerCase(),
            })
            .then((res) => {
                setCurrentWord("");
                toast.success(res.data.message);
                refresh();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    const handleChangeEdit = (e: ChangeEvent<HTMLInputElement>) => {
        if (modalEditItem) {
            setModalEditItem((prev) => {
                if (prev) {
                    return {
                        id: prev.id,
                        word: e.target.value,
                    };
                } else {
                    return null;
                }
            });
        }
    };

    const handleEdit = (e: FormEvent) => {
        e.preventDefault();
        if (modalEditItem) {
            axiosReq
                .post(`/admin/discord/banned_words/${modalEditItem.id}`, {
                    word: modalEditItem.word.toLowerCase(),
                })
                .then((res) => {
                    setModalEditItem(null);
                    toast.success(res.data.message);
                    refresh();
                })
                .catch((err) => {
                    toastError(err);
                });
        }
    };

    const handleDelete = () => {
        axiosReq
            .delete(`/admin/discord/banned_words/${modalDeleteId}`)
            .then((res) => {
                setModadlDeleteId("");
                toast.success(res.data.message);
                refresh();
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <>
            <ConfirmationModal
                state={!!modalDeleteId}
                closeHandler={() => setModadlDeleteId("")}
                acceptHandler={handleDelete}
                declineHandler={() => setModadlDeleteId("")}
            >
                <h5 className="text-lg text-center font-bold text-black dark:text-white">
                    Are you sure, you want to delete?
                </h5>
            </ConfirmationModal>
            <Modal state={!!modalEditItem} closeHandler={() => setModalEditItem(null)}>
                <div className="max-w-lg border border-border mx-auto bg-grey dark:bg-light py-5 md:py-10 px-5 md:px-10  rounded-2xl w-full">
                    <div className="edit">
                        <h5 className="text-base font-semibold text-white mb-2">Edit Item</h5>
                        <form
                            className="flex justify-between gap-x-5 items-center"
                            onSubmit={handleSubmit}
                        >
                            <div className="inputbox w-full">
                                <input
                                    type="text"
                                    placeholder="Enter illegal word you want to add"
                                    value={modalEditItem?.word}
                                    onChange={handleChangeEdit}
                                />
                            </div>
                            <button className="btn" onClick={handleEdit}>
                                Edit
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
            <h3 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Illegal Words
            </h3>
            <div className="inner">
                <div className="create">
                    <h5 className="text-base font-semibold text-white mb-2">
                        Add new illegal word
                    </h5>
                    <form
                        className="flex justify-between gap-x-5 items-center"
                        onSubmit={handleSubmit}
                    >
                        <div className="inputbox w-full">
                            <input
                                type="text"
                                placeholder="Enter illegal word you want to add"
                                value={currentWord}
                                onChange={(e) => setCurrentWord(e.target.value)}
                            />
                        </div>
                        <button className="btn">Add</button>
                    </form>
                </div>
                <div className="showcase flex flex-wrap gap-4 mt-8">
                    {illegalWords &&
                        Array.isArray(illegalWords) &&
                        illegalWords.map((singleWord: IIllegalWord) => (
                            <div className="relative group" key={singleWord.id}>
                                <div className="btn btn-outline !lowercase">{singleWord.word}</div>
                                <div className="absolute left-auto -right-3 -top-3 flex gap-1 transition-all duration-200 invisible opacity-0 group-hover:visible group-hover:opacity-100">
                                    <button
                                        title="Edit"
                                        className="bg-yellow-500 text-black h-6 w-6 rounded-full overflow-hidden inline-flex justify-center items-center text-sm"
                                        onClick={() => setModalEditItem(singleWord)}
                                    >
                                        <RiEditLine />
                                    </button>
                                    <button
                                        title="Delete"
                                        className="bg-red-500 text-white h-6 w-6 rounded-full overflow-hidden inline-flex justify-center items-center text-sm"
                                        onClick={() => setModadlDeleteId(singleWord.id)}
                                    >
                                        <RiDeleteBin5Line />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
};

export default DiscordIllegalWordsPage;
