import { IModel } from "@/app/(root)/generate/page";
import { ISelectItem } from "@/component/ui/CustomSelect";
import { INotification } from "@/interfaces/notifications";
import { toast } from "react-hot-toast";
import { TAdminChatAttachMode } from "../interfaces/chat";

// Random number between range
export const randomNumber = (min: number = 0, max: number = 100): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

// Debounce function
type Func = (...args: any[]) => void;
export const debounce = <F extends Func>(func: F, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<F>): void => {
        const context = this;

        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
};

// Read markdown file
export const customReadFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = function (event) {
            resolve(event.target?.result as string);
        };
        reader.onerror = function (event) {
            reject(event.target?.error);
        };
        reader.readAsText(file);
    });
};

// Image to base64 encode
export const readImageFile = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            resolve(reader.result as string);
        };
        reader.onerror = function () {
            reject(reader.error);
        };
    });
};

export const findImageName = (str: string) => {
    let arr = str.split("/");
    let findName = arr[arr.length - 1];
    let temp = findName.split(".");
    return temp[0];
};

export const isEmptyObject = (obj: object) => {
    return Object.keys(obj).length ? false : true;
};

export const mapModelsToSelectItems = (items: IModel[], unrestricted: boolean = false) => {
    if (items && items.length) {
        let filteredItems = items.filter((item) => {
            if (unrestricted) {
                return item;
            } else {
                if (!item.restricted) return item;
            }
        });
        let temp = filteredItems.reduce((acc: ISelectItem[], current: IModel) => {
            return [
                ...acc,
                {
                    text: current.name,
                    value: current.value,
                },
            ];
        }, []);
        temp.unshift({
            text: "Select Model",
            value: "",
        });
        return temp;
    }
    return [];
};

export async function imageUrlToBase64(url: string) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.log("Error fetching the image:", error);
    }
}

export const handleClipboard = (text: string, isUrl?: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUrl) {
        toast.success("Copied Url");
    } else {
        toast.success("Copied Text");
    }
};

export const hasUnread = (notifications: INotification[]) => {
    let index = notifications.findIndex((item) => !item.read);
    return index !== -1;
};

export const extractUsername = (str: string) => {
    const regex = /\@\[(.*?)\]/g;
    const matches = str.match(regex);

    if (matches) {
        return matches[1];
    }

    return null;
};

export const serializeInfiniteData = (data: any) => {
    if (data) {
        return data.pages.reduce((acc: any, single: any) => {
            return [...acc, ...single];
        }, []);
    }
    return [];
};

export const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

export const toBase64 = (str: string) =>
    typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

export const imageLoader = ({ src }: { src: string }) => {
    return src;
};

export function getImageFromMessage(message: string) {
    const findImage = message.split("attachment:")[1];
    return findImage ? findImage?.trim() : null;
}

export function getMessageWithoutAttachment(message: string) {
    const findMessage = message.replaceAll(/\[mod:[^\]]+\]/g, "").split("attachment:")[0];
    return findMessage ? findMessage?.trim() : null;
}

export const getFormattedDate = (date: string): string => {
    return `${new Date(date).toLocaleDateString("en-us", {
        day: "2-digit",
    })} ${new Date(date).toLocaleDateString("en-us", {
        month: "short",
    })} ${new Date(date).getFullYear()}`;
};

export const moderationModeToText = (mode: TAdminChatAttachMode): string => {
    const modes = {
        "auto-gen-plus-send": "Auto Generate and Send",
        "auto-gen": "Auto Generate",
        manual: "Manual",
    };

    return modes[mode];
};
