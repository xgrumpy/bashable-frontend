import { useGetSinglePoll } from "@root/src/hooks/admin/useDiscordPoll";
import markdown from "@wcj/markdown-to-html";

type TPoolDetailsProps = {
    id: string;
};

export default function PoolDetails({ id }: TPoolDetailsProps) {
    const { data: poolData } = useGetSinglePoll({ id });

    return (
        <div className="pooldata">
            <h6 className="font-semibold">
                Title: <span className="text-black dark:text-white">{poolData?.title}</span>
            </h6>
            <p>
                Total Votes:{" "}
                <span className="text-black dark:text-white">{poolData?.totalVotes}</span>
            </p>
            <p>
                Status:{" "}
                <span className="font-semibold text-black dark:text-white">
                    {poolData?.isOpen ? "Open" : "Closed"}
                </span>
            </p>
            <p>
                Created At:{" "}
                <span className="text-black dark:text-white">
                    {poolData?.createdAt ? new Date(poolData.createdAt).toLocaleString() : null}
                </span>
            </p>
            <br />
            <h6 className="font-semibold text-black dark:text-white">Description: </h6>
            <div className="block typographic">
                <div
                    /* @ts-ignore */
                    dangerouslySetInnerHTML={{
                        __html: markdown(poolData?.description?.trim()) as string,
                    }}
                ></div>
            </div>
            <br />
            <h6 className="font-semibold text-black dark:text-white">Distribution: </h6>
            <div className="overflow-x-auto mt-3">
                <table className="border border-borderlight dark:border-border w-full">
                    <thead>
                        <tr className="bg-white dark:bg-dark">
                            <th className="font-semibold text-black dark:text-white py-2.5 px-1.5 text-left">
                                Option
                            </th>
                            <th className="font-semibold text-black dark:text-white py-2.5 px-1.5 text-left">
                                Votes
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {poolData?.options.map((item, index) => (
                            <tr
                                key={item}
                                className="border-b border-borderlight dark:border-border"
                            >
                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                    {item}
                                </td>
                                <td className="text-bodylight dark:text-body px-1.5 py-1.5 text-left">
                                    {poolData?.votes[index]}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
