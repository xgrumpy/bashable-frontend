"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import Pagination from "@/component/shared/Pagination";
import { IArticle } from "@/interfaces/general";
import axiosReq from "@/utils/axios";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RiDeleteBin2Line, RiEditBoxLine } from "react-icons/ri";

const Articles = () => {
    const searchParams = useSearchParams();
    const pageNumber = searchParams.get("page");
    const page = pageNumber ? parseInt(pageNumber) : 1;

    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    useEffect(() => {
        axiosReq
            .get(`/admin/articles?limit=10&page=${page}`)
            .then((res) => {
                setArticles(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [page, isUpdate]);

    const handleDelete = (id: string) => {
        axiosReq
            .delete(`/admin/articles/${id}`)
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
                                Articles
                            </h4>
                            <Link href="/dashboard/articles/create" className="btn">
                                Create New
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-white dark:bg-dark">
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-left">
                                            Image
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Create Date
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Title
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-center">
                                            Slug
                                        </th>
                                        <th className="font-medium text-black dark:text-white py-2.5 px-1.5 text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {articles &&
                                        Array.isArray(articles) &&
                                        articles.map((article) => (
                                            <tr
                                                key={article.id}
                                                className="border-b border-borderlight dark:border-border"
                                            >
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                                    <Link
                                                        href={`/blogs/${article.slug}`}
                                                        className="image relative overflow-hidden inline-block h-20 w-24 border border-borderlight dark:border-border rounded-md"
                                                    >
                                                        <Image
                                                            src={article.image}
                                                            className="h-full w-full"
                                                            alt={article.title}
                                                            fill
                                                        />
                                                    </Link>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    <p>
                                                        {new Date(article.createdAt).toDateString()}
                                                    </p>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center max-w-[250px]">
                                                    <Link
                                                        className="text-bodylight dark:text-body hover:text-primary"
                                                        href={`/blogs/${article.slug}`}
                                                    >
                                                        {article.title}
                                                    </Link>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-center">
                                                    <p>{article.slug}</p>
                                                </td>
                                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-right">
                                                    <div className="buttons inline-flex gap-4">
                                                        <Link
                                                            href={`/dashboard/articles/edit?slug=${article.slug}&id=${article.id}`}
                                                            className="h-9 w-9 rounded-full inline-flex justify-center items-center border border-orange-500 text-orange-500"
                                                        >
                                                            <RiEditBoxLine />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(article.id)}
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
                        <Pagination
                            path="/dashboard/articles"
                            page={page}
                            limit={10}
                            length={articles.length}
                        />
                    </div>
                </section>
            </main>
        </>
    );
};

export default Articles;
