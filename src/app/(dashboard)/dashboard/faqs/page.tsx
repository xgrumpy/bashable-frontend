"use client";

import { useEffect, useState } from "react";
import { RiDeleteBin2Line, RiEditBoxLine } from "react-icons/ri";
import axiosReq from "@/utils/axios";
import DashboardMenu from "@/component/layout/DashboardMenu";
import { IFaq } from "@/interfaces/general";
import Link from "next/link";

const Faqs = () => {
    const [faqs, setFaqs] = useState<IFaq[]>([]);
    const [editableFaq, setEditableFaq] = useState<IFaq | null>(null);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const faqsRes = await axiosReq.get(`/admin/faqs`);
                setFaqs(faqsRes.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchData();
    }, [isUpdate, editableFaq]);

    const handleEdit = (faq: IFaq) => {
        setEditableFaq(faq);
    };

    const handleDelete = (id: string) => {
        axiosReq
            .delete(`/admin/faqs/${id}`)
            .then((res) => {
                setIsUpdate(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <div className="flex justify-between gap-5 mb-10 items-center">
                            <h4 className="text-2xl font-bold  text-black dark:text-white">
                                Faqs
                            </h4>
                            <Link href="/dashboard/faqs/create" className="btn">
                                Create New
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white dark:bg-dark">
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                            Question
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                            Answer
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Priority
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faqs &&
                                        Array.isArray(faqs) &&
                                        faqs.map((faq) => (
                                            <tr
                                                key={faq.id}
                                                className="border-b border-borderlight dark:border-border"
                                            >
                                                <td className="text-bodylight dark:text-body px-1.5 py-3 text-left">
                                                    <p>{faq.question}</p>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-3 text-left max-w-xs">
                                                    <p className="excerpt-3">
                                                        {faq.answer}
                                                    </p>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-3 text-center">
                                                    <p>{faq.priority}</p>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-3 text-right">
                                                    <div className="buttons inline-flex gap-4">
                                                        <Link
                                                            href={`/dashboard/faqs/edit?id=${faq.id}`}
                                                            onClick={() =>
                                                                handleEdit(faq)
                                                            }
                                                            className="h-9 w-9 rounded-full inline-flex justify-center items-center border border-orange-500 text-orange-500"
                                                        >
                                                            <RiEditBoxLine />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    faq.id
                                                                )
                                                            }
                                                            className="h-9 w-9 rounded-full inline-flex justify-center items-center border border-red-500 text-red-500"
                                                        >
                                                            <RiDeleteBin2Line />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Faqs;
