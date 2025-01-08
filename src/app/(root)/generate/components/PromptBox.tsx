import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import {
    ChangeEvent,
    KeyboardEvent,
    SyntheticEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

interface IPromptBoxProps {
    promptText: string;
    setPromptText: (text: string) => void;
    handleWarning: (text: string) => void;
}

function PromptBox({ promptText, setPromptText, handleWarning }: IPromptBoxProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("");
    const [restrictedKeywords, setRestrictedKeywords] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [inputHtml, setInputHtml] = useState<string>("");

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const warningRef = useRef<HTMLDivElement | null>(null);

    const { username } = useAuthContext();

    const checkRestrictedFound = useCallback(() => {
        if (username && inputText) {
            axiosReq.get(`/generate/check?prompt=${inputText}`).then((res) => {
                if (res.data.restricted) {
                    handleWarning("Will be marked as restricted!");
                    setRestrictedKeywords(res.data.words);
                } else {
                    handleWarning("");
                    setRestrictedKeywords([]);
                }
            });
        } else {
            handleWarning("");
            setRestrictedKeywords([]);
        }
    }, [handleWarning, inputText, username]);

    useEffect(() => {
        if (promptText) setError("");
        checkRestrictedFound();
        setInputText(promptText);
    }, [promptText, checkRestrictedFound]);

    useEffect(() => {
        if (inputText) {
            let tempText = inputText
                .replace(/\s\s+/g, " ")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            restrictedKeywords.forEach((word: string) => {
                const regex = new RegExp(`\\b${word}\\b`, "gi");
                const replacement = `<span class="break-words border-b-2 border-yellow-600 dark:border-yellow-300 text-transparent">${word}</span>`;
                tempText = tempText.replace(regex, replacement);
            });

            setInputHtml(tempText);
        } else {
            setInputHtml("");
        }
    }, [inputText, restrictedKeywords]);

    const handleTextareaScroll = () => {
        if (warningRef.current && inputRef.current) {
            inputRef.current.scrollTop = warningRef.current.scrollTop;
        }
    };

    useEffect(() => {
        let inputElement = inputRef.current;
        let warningElement = warningRef.current;

        if (inputElement && warningElement) {
            inputElement.addEventListener("scroll", handleTextareaScroll);
        }

        return () => {
            if (inputElement && warningElement) {
                inputElement.removeEventListener("scroll", handleTextareaScroll);
            }
        };
    }, []);

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value.replace(/\s\s+/g, " ");
        setError("");
        if (value.includes("<") || value.includes("(")) {
            const lastIndexOfAngelBracket = value.lastIndexOf("<");
            const lastIndexOfCurlyBracket = value.lastIndexOf("(");
            const lastIndexOfBracket = Math.max(lastIndexOfAngelBracket, lastIndexOfCurlyBracket);
            if (lastIndexOfBracket > -1) {
                const extractedText = value.substring(lastIndexOfBracket);
                // Make a request to the server with the extracted text
                axiosReq
                    .get(`/public/auto-complete?text=${extractedText}`)
                    .then((response) => response.data)
                    .then((data) => {
                        setOptions(data);
                        setShowOptions(true);
                        setSelectedOption(data[0]);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                setOptions([]);
                setShowOptions(false);
            }
        } else {
            setOptions([]);
            setShowOptions(false);
        }
        setInputText(value.trimStart());
        setPromptText(value.trimStart());
        setSelectedOption("");
    };

    const selectCurrentOption = (option: string) => {
        let lastIndexOfAngel = inputText.lastIndexOf("<");
        let lastIndexOfCurly = inputText.lastIndexOf("(");
        let lastIndex = lastIndexOfAngel > lastIndexOfCurly ? lastIndexOfAngel : lastIndexOfCurly;
        const value = inputText.substring(0, lastIndex);
        const autocompletedValue = `${value}${option}`;
        setInputText(autocompletedValue);
        setPromptText(autocompletedValue);
        setShowOptions(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (showOptions) {
            if (event.key === "ArrowUp") {
                // Up arrow
                event.preventDefault();
                const index = options.indexOf(selectedOption as never);
                if (index > 0) {
                    setSelectedOption(options[index - 1]);
                } else {
                    setSelectedOption(options[options.length - 1]);
                }
            } else if (event.key === "ArrowDown") {
                // Down arrow
                event.preventDefault();
                const index = options.indexOf(selectedOption as never);
                if (index === -1 || index === options.length - 1) {
                    setSelectedOption(options[0]);
                } else {
                    setSelectedOption(options[index + 1]);
                }
            } else if (event.key === "Enter" || event.key === "Tab") {
                // Enter or Tab
                event.preventDefault();
                if (selectedOption) {
                    selectCurrentOption(selectedOption);
                }
            }
        } else {
            if (event.key === "Enter") {
                event.preventDefault();
            }
        }

        if (username && (event.key === " " || event.key === "Backspace")) {
            checkRestrictedFound();
            if (!inputText) {
                setInputHtml("");
            }
        }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        if (username) {
            checkRestrictedFound();
        }
        if (!inputText) {
            setError("Prompt text is required");
        } else {
            setError("");
        }
    };

    const handleOptionClick = (e: SyntheticEvent, option: string) => {
        e.preventDefault();
        setSelectedOption(option);
        selectCurrentOption(option);
        inputRef.current?.focus();
    };

    const handleBlur = (e: SyntheticEvent) => {
        e.preventDefault();
        setTimeout(() => {
            if (!inputText) {
                setError("Prompt text is required");
            } else {
                setError("");
            }
            setOptions([]);
            setShowOptions(false);
            checkRestrictedFound();
        }, 100);
    };

    useEffect(() => {
        if (listRef.current) {
            const activeItem = listRef.current.querySelector(".active") as HTMLElement;

            if (activeItem) {
                const containerHeight = listRef.current.offsetHeight;
                const itemHeight = activeItem.offsetHeight;
                const itemOffsetTop = activeItem.offsetTop;

                // Scroll only if the active item is outside the visible area
                if (itemOffsetTop < listRef.current.scrollTop) {
                    listRef.current.scrollTop = itemOffsetTop;
                } else if (
                    itemOffsetTop + itemHeight >
                    listRef.current.scrollTop + containerHeight
                ) {
                    listRef.current.scrollTop = itemOffsetTop + itemHeight - containerHeight;
                }
            }
        }
    }, [selectedOption]);

    return (
        <div className="relative z-10">
            <div className="relative border border-borderlight dark:border-border rounded-md px-3 md:px-4 py-2 md:py-3">
                <div className="inner relative">
                    <textarea
                        ref={inputRef}
                        value={inputText}
                        onKeyDown={handleKeyDown}
                        onKeyUp={handleKeyUp}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="eg: The most beautiful place in the world"
                        className="absolute break-words inset-0 resize-none overflow-hidden h-full w-full border-0 p-0 !scrollbar-hidden"
                    />
                    <div
                        ref={warningRef}
                        className="relative pointer-events-none min-h-[180px] z-10 !scrollbar-hidden break-words text-transparent"
                        dangerouslySetInnerHTML={{ __html: inputHtml }}
                    ></div>
                </div>
                {showOptions && !!options.length && (
                    <ul
                        ref={listRef}
                        className="absolute left-0 w-full top-full z-40 border border-borderlight dark:border-border bg-grey dark:bg-light h-[250px] overflow-x-hidden overflow-y-auto"
                    >
                        {options.map((option) => (
                            <li
                                key={option}
                                className={`px-2 py-0.5  cursor-pointer ${
                                    selectedOption === option
                                        ? "!bg-primary !text-white active"
                                        : "hover:!bg-primary hover:!text-white bg-grey dark:bg-light"
                                }`}
                                onClick={(e) => handleOptionClick(e, option)}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {!!error && <p className="text-red-500">{error}</p>}
        </div>
    );
}

export default PromptBox;
