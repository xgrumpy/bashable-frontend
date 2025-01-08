import { useChatContext } from "@root/src/context/chatContext";
import {
    getImageFromMessage,
    getMessageWithoutAttachment,
    imageLoader,
    shimmer,
    toBase64,
} from "@root/src/utils/utils";
import markdown from "@wcj/markdown-to-html";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type IAdminMessageProps = {
    index: number;
    avatar: string | null;
    name: string;
    message: string;
    chatId: string;
    requestImageAbility?: boolean;
};

export default function AdminMessage({
    index,
    name,
    avatar,
    message,
    chatId,
    requestImageAbility = false,
}: IAdminMessageProps) {
    const requestedImage = getImageFromMessage(message);
    const messageWithoutAttachment = getMessageWithoutAttachment(message);

    const [imageFromStore, setImageFromStore] = useState("");
    const { lastRequestedImage } = useChatContext();

    useEffect(() => {
        const lastIndex = lastRequestedImage.findLastIndex((item) => {
            return item.index === index && item.chatId === chatId;
        });
        const stateImage = lastRequestedImage[lastIndex]?.image;
        if (stateImage) {
            setImageFromStore(stateImage);
        }
    }, [lastRequestedImage, index, chatId]);

    return (
        <div className="message-item w-full flex flex-wrap md:flex-nowrap items-start gap-x-4 gap-y-2 py-4 px-4 bg-gray-200 dark:bg-[#111122] bg-opacity-80 rounded relative">
            <Avatar avatar={avatar} name={name} />
            <div className="content w-full">
                <h6 className="text-lg font-bold text-black dark:text-white -mt-1.5">{name}</h6>
                <div className="block typographic">
                    <div
                        /* @ts-ignore */
                        dangerouslySetInnerHTML={{
                            __html: markdown(messageWithoutAttachment?.trim()) as string,
                        }}
                    ></div>
                </div>
                {requestImageAbility ? (
                    <React.Fragment>
                        {imageFromStore ? (
                            <div className="image h-80 w-80 max-w-full relative mt-3">
                                <Image
                                    loader={imageLoader}
                                    src={imageFromStore}
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                        shimmer(500, 500)
                                    )}`}
                                    alt="something"
                                    fill
                                    className="object-cover object-center w-full max-w-full aspect-square"
                                />
                            </div>
                        ) : requestedImage ? (
                            <div className="image h-80 w-80 max-w-full relative mt-3">
                                <Image
                                    loader={imageLoader}
                                    src={requestedImage}
                                    placeholder="blur"
                                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                        shimmer(500, 500)
                                    )}`}
                                    alt="something"
                                    fill
                                    className="object-cover object-center w-full max-w-full aspect-square"
                                />
                            </div>
                        ) : null}
                    </React.Fragment>
                ) : null}
            </div>
        </div>
    );
}

const Avatar = ({
    avatar,
    name,
    large = false,
}: {
    avatar: string | null;
    name: string;
    large?: boolean;
}) => {
    return (
        <div
            title={name}
            className={`avatar relative transition-all text-black dark:text-white hover:border-primary hover:text-primary inline-flex justify-center font-bold items-center uppercase rounded-md border border-black border-opacity-50 dark:border-border dark:border-opacity-100 overflow-hidden grow-0 shrink-0 ${
                large ? "h-20 w-20 basis-20 text-3xl" : "h-12 w-12 basis-12 text-xl"
            }`}
        >
            {avatar ? (
                <Image src={avatar} alt={name} className="h-full w-full" fill />
            ) : (
                <span className="select-none">{name?.trim()[0]}</span>
            )}
        </div>
    );
};
