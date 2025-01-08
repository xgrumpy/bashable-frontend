import dynamic from "next/dynamic";
import { useCallback, useMemo } from "react";
import { SimpleMDEReactProps } from "react-simplemde-editor";

const DynamicSimpleMdeReact = dynamic(() =>
    import("react-simplemde-editor").then((res) => res.SimpleMdeReact)
);

interface IMarkdownEditorProps {
    value: string;
    setValue: (value: string) => void;
}

const MarkdownEditor = ({ value, setValue }: IMarkdownEditorProps) => {
    const onChange = useCallback(
        (value: string) => {
            setValue(value);
        },
        [setValue]
    );

    const mdeOptions = useMemo(() => {
        return {
            autofocus: false,
            spellChecker: false,
            uploadImage: false,
            previewClass: ["editor-preview", "typographic"],
            onToggleFullScreen: (status: boolean) => {
                if (typeof window !== "undefined") {
                    let wrapper = document.querySelector(".EasyMDEContainer") as HTMLElement;
                    if (status) {
                        if (wrapper) wrapper.style.cssText = "position:relative;z-index:9999";
                    } else {
                        if (wrapper) wrapper.style.cssText = "";
                    }
                }
            },
        } as SimpleMDEReactProps;
    }, []);

    return <DynamicSimpleMdeReact options={mdeOptions} value={value} onChange={onChange} />;
};

export default MarkdownEditor;
