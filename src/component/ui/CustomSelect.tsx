import { useEffect, useRef, useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

export interface ISelectItem {
    text: string;
    value: string;
}

interface ICustomSelectProps {
    items: ISelectItem[];
    current: string;
    setCurrentValue: (arg: any) => void;
    fullWidth?: boolean;
    placeholder?: string;
}

const CustomSelect = ({
    items,
    current,
    setCurrentValue,
    fullWidth = false,
    placeholder = "Select",
}: ICustomSelectProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const findCurrentText = (): string => {
        let temp = items.find((item) => item.value === current);
        return temp?.text ?? placeholder;
    };

    const handleSetItem = (value: string) => {
        setCurrentValue(value);
        setIsOpen(false);
    };

    return (
        <div
            ref={menuRef}
            className={`customselect relative ${
                fullWidth ? "w-full block" : "w-auto inline-block"
            }`}
        >
            <button
                className="py-2 border border-borderlight dark:border-border px-3 rounded-md flex justify-between items-center gap-x-2 font-semibold text-black dark:text-white whitespace-nowrap w-full"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen);
                }}
            >
                <span>{findCurrentText()}</span>
                <HiChevronDown />
            </button>
            {isOpen && (
                <ul className="absolute z-30 rounded-md overflow-hidden left-0 top-full bg-grey dark:bg-dark border border-borderlight dark:border-border min-w-[150px]">
                    {items &&
                        Array.isArray(items) &&
                        items.map((single) => (
                            <li
                                key={single.value}
                                onClick={() => handleSetItem(single.value)}
                                className={`px-3 py-1.5 border-b select-none last:border-none border-borderlight dark:border-border border-opacity-50 cursor-pointer hover:bg-primary hover:bg-opacity-5 ${
                                    single.value === current
                                        ? "text-primary"
                                        : "text-black dark:text-white"
                                }`}
                                tabIndex={1}
                            >
                                {single.text}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};

export default CustomSelect;
