"use client";

import { useState } from "react";
import TipsReceived from "./components/TipsReceived";
import TipsSent from "./components/TipsSent";

const UserProfile = () => {
    const [currentTab, setCurrentTab] = useState<"sent" | "received">("sent");
    return (
        <div className="max-w-7xl mx-auto generations mt-10">
            <h4 className="text-2xl font-semibold text-black dark:text-white mb-5">
                Tips
            </h4>
            <div className="mt-5">
                <div className="flex gap-x-3 gap-y-2 flex-wrap">
                    <button
                        className={`btn ${
                            currentTab === "sent" ? "" : "btn-outline"
                        }`}
                        onClick={() => setCurrentTab("sent")}
                    >
                        Sent
                    </button>
                    <button
                        className={`btn ${
                            currentTab === "received" ? "" : "btn-outline"
                        }`}
                        onClick={() => setCurrentTab("received")}
                    >
                        Received
                    </button>
                </div>
                <div className="content mt-5">
                    {currentTab === "sent" && <TipsSent />}
                    {currentTab === "received" && <TipsReceived />}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
