"use client";

import DashboardMenu from "@/component/layout/DashboardMenu";
import { useState } from "react";
import FiltersOptions from "./components/FiltersOptions";
import GridView from "./components/GridView";
import ListView from "./components/ListView";
import ViewMode from "./components/ViewMode";

const Generations = () => {
    const [currentView, setCurrentView] = useState("grid");
    const [filterString, setFilterString] = useState<string>("");

    return (
        <>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                    </div>
                    <div className="px-4 md:px-8">
                        <h2 className="text-3xl font-semibold mb-4 text-black dark:text-white">
                            Generations
                        </h2>
                        <div className="options flex flex-wrap items-center justify-between gap-x-8 gap-y-5 mb-8">
                            <FiltersOptions setFilterString={setFilterString} />
                            <ViewMode currentView={currentView} setCurrentView={setCurrentView} />
                        </div>
                        {currentView === "grid" ? (
                            <GridView
                                url={
                                    filterString
                                        ? `/admin/generations?limit=20${filterString}&`
                                        : `/admin/generations?limit=20&`
                                }
                            />
                        ) : (
                            <ListView
                                url={
                                    filterString
                                        ? `/admin/generations?limit=20${filterString}&`
                                        : `/admin/generations?limit=20&`
                                }
                            />
                        )}
                    </div>
                </section>
            </main>
        </>
    );
};

export default Generations;
