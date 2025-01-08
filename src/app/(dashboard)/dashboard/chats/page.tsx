import DashboardMenu from "@root/src/component/layout/DashboardMenu";
import React from "react";
import ChatsView from "./_components/ChatsView";

const ChatsViewPage = () => {
    return (
        <React.Fragment>
            <div className="pt-[80px]"></div>
            <main className="content">
                <section className="section pt-24 pb-24 bg-grey dark:bg-light">
                    <div className="max-w-7xl mx-auto">
                        <DashboardMenu />
                        <div className="flex justify-between gap-5 mb-10 items-center">
                            <h4 className="text-2xl font-bold  text-black dark:text-white">
                                Chats
                            </h4>
                        </div>
                        <ChatsView />
                    </div>
                </section>
            </main>
        </React.Fragment>
    );
};

export default ChatsViewPage;
