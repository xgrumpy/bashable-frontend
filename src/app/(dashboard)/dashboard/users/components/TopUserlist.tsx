import useFetch from "@/hooks/useFetch";
import CustomMessage from "@root/src/component/ui/CustomMessage";
import { useState } from "react";
import UserItem from "./UserItem";

const TopUserlist = () => {
    const [currentTab, setCurrentTab] = useState<"today" | "this_week" | "this_month">("today");

    const { data: result, refresh } = useFetch("/admin/users/top");

    return (
        <div className="topuserlist">
            <h4 className="text-2xl font-bold mb-5 text-black dark:text-white">Top User</h4>
            <div className="tab flex gap-x-3 gap-y-2">
                <button
                    className={`btn btn-sm ${currentTab === "today" ? "" : "btn-outline"}`}
                    onClick={() => setCurrentTab("today")}
                >
                    Today
                </button>
                <button
                    className={`btn btn-sm ${currentTab === "this_week" ? "" : "btn-outline"}`}
                    onClick={() => setCurrentTab("this_week")}
                >
                    This Week
                </button>
                <button
                    className={`btn btn-sm ${currentTab === "this_month" ? "" : "btn-outline"}`}
                    onClick={() => setCurrentTab("this_month")}
                >
                    This Month
                </button>
            </div>
            {result && (
                <div className="tabcontent mt-8">
                    {result[currentTab] ? (
                        <UserItem
                            user={{
                                ...result[currentTab],
                            }}
                            refresh={refresh}
                        />
                    ) : (
                        <CustomMessage msg="There is no top user yet!" />
                    )}
                </div>
            )}
        </div>
    );
};

export default TopUserlist;
