import React from "react";
import AdminChatbox from "./_components/AdminChatbox";

type TAdminChatPageProps = {
    params: {
        chat_id: string;
    };
};

const AdminChatPage = ({ params: { chat_id } }: TAdminChatPageProps) => {
    return (
        <React.Fragment>
            <div className="pt-[80px]"></div>
            <section className="section py-16">
                <div className="max-w-7xl mx-auto">
                    <AdminChatbox id={chat_id} />
                </div>
            </section>
        </React.Fragment>
    );
};

export default AdminChatPage;
