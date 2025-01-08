"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import ConfirmationModal from "@/component/shared/ConfirmationModal";
import Modal from "@/component/shared/Modal";
import useFetch from "@/hooks/useFetch";
import axiosReq from "@/utils/axios";
import { toastError } from "@/utils/error";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "react-hot-toast";
import { RiDeleteBin5Line, RiEditLine } from "react-icons/ri";

interface IDomain {
    id: string;
    domain: string;
}

const BlockedDomainsPage = () => {
    const [modalDeleteId, setModadlDeleteId] = useState<string>("");
    const [modalEditItem, setModalEditItem] = useState<IDomain | null>(null);
    const [currentWord, setCurrentWord] = useState<string>("");

    const { data: blockedDomains, refresh } = useFetch("/admin/blocked_domains");

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axiosReq
            .post("/admin/blocked_domains", {
                domain: currentWord,
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
                        domain: e.target.value,
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
                .post(`/admin/blocked_domains/${modalEditItem.id}`, {
                    domain: modalEditItem.domain,
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
            .delete(`/admin/blocked_domains/${modalDeleteId}`)
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
                            onSubmit={handleEdit}
                        >
                            <div className="inputbox w-full">
                                <input
                                    type="text"
                                    placeholder="Enter edited domain"
                                    value={modalEditItem?.domain}
                                    onChange={handleChangeEdit}
                                />
                            </div>
                            <button type="submit" className="btn">
                                Edit
                            </button>
                        </form>
                    </div>
                </div>
            </Modal>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
                            Blocked Domains
                        </h2>
                        <div className="inner">
                            <div className="create">
                                <h5 className="text-base font-semibold text-white mb-2">
                                    Add new domain
                                </h5>
                                <form
                                    className="flex justify-between gap-x-5 items-center"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="inputbox w-full">
                                        <input
                                            type="text"
                                            placeholder="Enter domain you want to add"
                                            value={currentWord}
                                            onChange={(e) => setCurrentWord(e.target.value)}
                                        />
                                    </div>
                                    <button className="btn">Add</button>
                                </form>
                            </div>
                            <div className="showcase flex flex-wrap gap-4 mt-8">
                                {blockedDomains &&
                                    Array.isArray(blockedDomains) &&
                                    blockedDomains.map((singleDomain: IDomain) => (
                                        <div className="relative group" key={singleDomain.id}>
                                            <div className="btn btn-outline !lowercase">
                                                {singleDomain.domain}
                                            </div>
                                            <div className="absolute left-auto -right-3 -top-3 flex gap-1 transition-all duration-200 invisible opacity-0 group-hover:visible group-hover:opacity-100">
                                                <button
                                                    title="Edit"
                                                    className="bg-yellow-500 text-black h-6 w-6 rounded-full overflow-hidden inline-flex justify-center items-center text-sm"
                                                    onClick={() => setModalEditItem(singleDomain)}
                                                >
                                                    <RiEditLine />
                                                </button>
                                                <button
                                                    title="Delete"
                                                    className="bg-red-500 text-white h-6 w-6 rounded-full overflow-hidden inline-flex justify-center items-center text-sm"
                                                    onClick={() =>
                                                        setModadlDeleteId(singleDomain.id)
                                                    }
                                                >
                                                    <RiDeleteBin5Line />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default BlockedDomainsPage;
