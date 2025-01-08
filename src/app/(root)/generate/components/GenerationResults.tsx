"use client";

import PopupImage from "@/component/shared/PopupImage";
import { useAuthContext } from "@/context/authContext";
import { IImageData } from "@/interfaces/general";
import { toastError } from "@/utils/error";
import { imageUrlToBase64 } from "@/utils/utils";
import { SyntheticEvent, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Typed from "react-typed";
import LoaderPlaceholder from "./LoaderPlaceholder";

export type TResult = IImageData;

interface IGenerationResultsProps {
    isLoading: boolean;
    result: TResult[];
    generationText: string[];
    setResultImages: (prev: TResult[]) => void;
    setUploadImage: (prev: string) => void;
}

const GenerationResults = ({
    isLoading,
    result,
    generationText,
    setResultImages,
    setUploadImage,
}: IGenerationResultsProps) => {
    const [animatedText, setAnimatedText] = useState<string[]>([]);

    const { username } = useAuthContext();

    useEffect(() => {
        setAnimatedText(
            generationText.map((item) =>
                item.trim().replaceAll("\n\n", "<br/>")
            )
        );
    }, [generationText]);

    const refreshOnDelete = (id: string) => {
        setResultImages(result.filter((single) => single.id !== id));
    };

    const handleCreateVariation = (e: SyntheticEvent, url: string) => {
        e.preventDefault();
        imageUrlToBase64(url)
            .then((res) => {
                setUploadImage(res as string);
                toast.success("This image added to image field.");
            })
            .catch((err) => {
                toastError(err);
            });
    };

    return (
        <aside className="col-span-1 lg:col-span-8">
            <div className="sticky top-[110px]">
                <div className="inner">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <LoaderPlaceholder />
                            <LoaderPlaceholder />
                            <LoaderPlaceholder />
                            <LoaderPlaceholder />
                        </div>
                    ) : result && Array.isArray(result) && result.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-4">
                            {result.map((resultItem, index) => (
                                <div key={resultItem.id}>
                                    <div className="relative group">
                                        <PopupImage
                                            key={resultItem.id}
                                            imageData={{
                                                ...resultItem,
                                                username,
                                            }}
                                            deleteIdPasser={refreshOnDelete}
                                            removeRegenerate
                                            noThumbnail
                                        />
                                        <div className="absolute left-0 w-full top-1/2 text-center z-10 transition-all duration-200 invisible opacity-0 group-hover:visible group-hover:opacity-100">
                                            <button
                                                className="btn btn-sm btn-secondary"
                                                onClick={(e) =>
                                                    handleCreateVariation(
                                                        e,
                                                        resultItem.image
                                                    )
                                                }
                                            >
                                                Create Variation
                                            </button>
                                        </div>
                                    </div>
                                    {animatedText[index] ? (
                                        <div className="mt-2">
                                            <Typed
                                                strings={[animatedText[index]]}
                                                typeSpeed={40}
                                                className="text-base font-semibold text-secondary"
                                            />
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center">
                                <h4 className="text-bodylight font-medium dark:text-body text-md p-4 text-center">
                                    Your image will be generated here.
                                </h4>
                            </div>
                            <div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center">
                                <h4 className="text-bodylight font-medium dark:text-body text-md p-4 text-center">
                                    Your image will be generated here.
                                </h4>
                            </div>
                            <div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center">
                                <h4 className="text-bodylight font-medium dark:text-body text-md p-4 text-center">
                                    Your image will be generated here.
                                </h4>
                            </div>
                            <div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center">
                                <h4 className="text-bodylight font-medium dark:text-body text-md p-4 text-center">
                                    Your image will be generated here.
                                </h4>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default GenerationResults;
