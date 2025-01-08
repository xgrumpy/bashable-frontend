import { useAuthContext } from "@/context/authContext";
import axiosReq from "@/utils/axios";
import React, {
    ChangeEvent,
    KeyboardEvent,
    SyntheticEvent,
    memo,
    useEffect,
    useRef,
    useState,
} from "react";

interface IPromptBoxProps {
    promptText: string;
    setPromptText: (text: string) => void;
}

function PromptBox({ promptText, setPromptText }: IPromptBoxProps) {
    const [options, setOptions] = useState<string[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>("");
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const [inputText, setInputText] = useState<string>("");
    const [isRestricteFound, setIsRestricteFound] = useState<boolean>(false);
    const [restrictedKeywords, setRestrictedKeywords] = useState<string[]>([]);
    const [error, setError] = useState<string>("");
    const [inputHtml, setInputHtml] = useState<string>("");

    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    const warningRef = useRef<HTMLDivElement | null>(null);

    const { username } = useAuthContext();

    useEffect(() => {
        setInputText(promptText);
    }, [promptText]);

    useEffect(() => {
        if (inputText) {
            let tempText = inputText
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");
            let wordsArray = tempText.split(" ").map((word: string) => {
                if (restrictedKeywords.includes(word)) {
                    return `<span class="border-b-2 border-yellow-600 dark:border-yellow-300">${word}</span>`;
                } else {
                    return `<span>${word}</span>`;
                }
            });
            setInputHtml(wordsArray.join(" "));
        } else {
            setInputHtml("");
        }
    }, [inputText, restrictedKeywords]);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleTextareaScroll = () => {
        if (warningRef.current && inputRef.current) {
            warningRef.current.scrollTop = inputRef.current.scrollTop;
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
                inputElement.removeEventListener(
                    "scroll",
                    handleTextareaScroll
                );
            }
        };
    }, []);

    const checkRestrictedFound = () => {
        if (inputText) {
            axiosReq.get(`/generate/check?prompt=${inputText}`).then((res) => {
                if (res.data.restricted) {
                    setIsRestricteFound(true);
                    setRestrictedKeywords(res.data.words);
                } else {
                    setIsRestricteFound(false);
                    setRestrictedKeywords([]);
                }
            });
        } else {
            setIsRestricteFound(false);
            setRestrictedKeywords([]);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value;
        setError("");
        if (value.includes("<") || value.includes("(")) {
            const lastIndexOfAngelBracket = value.lastIndexOf("<");
            const lastIndexOfCurlyBracket = value.lastIndexOf("(");
            const lastIndexOfBracket = Math.max(
                lastIndexOfAngelBracket,
                lastIndexOfCurlyBracket
            );
            if (lastIndexOfBracket > -1) {
                const extractedText = value.substring(lastIndexOfBracket);
                // Make a request to the server with the extracted text
                axiosReq
                    .get(`/public/auto-complete?text=${extractedText}`)
                    .then((response) => response.data)
                    .then((data) => {
                        setOptions(data);
                        setShowOptions(true);
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
        setInputText(value);
        setPromptText(value);
        setSelectedOption("");
    };

    const selectCurrentOption = (option: string) => {
        let lastIndexOfAngel = inputText.lastIndexOf("<");
        let lastIndexOfCurly = inputText.lastIndexOf("(");
        let lastIndex =
            lastIndexOfAngel > lastIndexOfCurly
                ? lastIndexOfAngel
                : lastIndexOfCurly;
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
        }

        if (username && (event.key === " " || event.key === "Backspace")) {
            checkRestrictedFound();
            if (!inputText) {
                setInputHtml("");
            }
        }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
        if (!inputText) {
            setError("Prompt text is required");
            checkRestrictedFound();
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

    return (
        <div className="relative">
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
                        className="absolute selection-invisible inset-0 resize-none h-full w-full border-0 p-0 !scrollbar-hidden !text-transparent"
                    />
                    <div
                        ref={warningRef}
                        className="relative pointer-events-none min-h-[180px] z-10 !scrollbar-hidden"
                        dangerouslySetInnerHTML={{ __html: inputHtml }}
                    ></div>
                </div>
            </div>
            {!!error && <p className="text-red-500">{error}</p>}
            {isRestricteFound && restrictedKeywords.length ? (
                <p className="text-yellow-600 dark:text-yellow-300">
                    Will be marked Restricted
                </p>
            ) : null}
            {showOptions && !!options.length && (
                <ul className="border relative z-30 border-borderlight dark:border-border max-h-[250px] overflow-x-hidden overflow-y-auto">
                    {options.map((option) => (
                        <li
                            key={option}
                            className={`px-2 py-0.5  cursor-pointer ${
                                selectedOption === option
                                    ? "!bg-primary !text-white"
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
    );
}

export default memo(PromptBox);
