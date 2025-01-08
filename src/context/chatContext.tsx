"use client";

import React, { createContext, useContext, useReducer } from "react";
import { IChatRequestedImage } from "../interfaces/chat";
import { IChatProfile } from "../interfaces/general";

// Define your initial state and actions here
interface MyState {
    isTyping: boolean;
    profiles: IChatProfile[] | null;
    messages: string[];
    isRequesting: number | boolean;
    lastRequestedImage: IChatRequestedImage[];
}

enum MyActionType {
    isTypingOn = "IS_TYPING_ON",
    isTypingOff = "IS_TYPING_OFF",
    initProfiles = "INIT_PROFILES",
    initMessages = "INIT_MESSAGES",
    addMessage = "ADD_MESSAGE",
    isRequestImageOn = "IS_REQUEST_IMAGE_ON",
    isRequestImageOff = "IS_REQUEST_IMAGE_OFF",
    addRequestedImage = "ADD_IMAGE_ON_REQUEST",
    clearLastRequestedImage = "CLEAR_LAST_REQUESTED_IMAGE",
}

interface MyIsTypingOnAction {
    type: MyActionType.isTypingOn;
}
interface MyIsTypingOffAction {
    type: MyActionType.isTypingOff;
}
interface MyInitProfilesAction {
    type: MyActionType.initProfiles;
    payload: IChatProfile[];
}

interface MyInitMessagesAction {
    type: MyActionType.initMessages;
    payload: string[];
}

interface MyAddMessageAction {
    type: MyActionType.addMessage;
    payload: string;
}
interface MyAddImageOnRequestAction {
    type: MyActionType.addRequestedImage;
    payload: IChatRequestedImage;
}
interface MyIsRequestImageOnAction {
    type: MyActionType.isRequestImageOn;
    payload: number;
}
interface MyIsRequestImageOffAction {
    type: MyActionType.isRequestImageOff;
}

interface MyClearLastRequestedImageAction {
    type: MyActionType.clearLastRequestedImage;
}

type MyAction =
    | MyIsTypingOnAction
    | MyIsTypingOffAction
    | MyInitProfilesAction
    | MyInitMessagesAction
    | MyAddMessageAction
    | MyAddImageOnRequestAction
    | MyIsRequestImageOnAction
    | MyIsRequestImageOffAction
    | MyClearLastRequestedImageAction;

const initialState: MyState = {
    isTyping: false,
    profiles: [],
    messages: [],
    isRequesting: false,
    lastRequestedImage: [],
};

function reducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case MyActionType.isTypingOn:
            return {
                ...state,
                isTyping: true,
            };

        case MyActionType.isTypingOff:
            return {
                ...state,
                isTyping: false,
            };

        case MyActionType.initProfiles:
            return {
                ...state,
                profiles: action.payload,
            };

        case MyActionType.initMessages:
            return {
                ...state,
                messages: action.payload,
            };

        case MyActionType.addMessage:
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        case MyActionType.isRequestImageOn:
            return {
                ...state,
                isRequesting: action.payload,
            };

        case MyActionType.isRequestImageOff:
            return {
                ...state,
                isRequesting: false,
            };

        case MyActionType.addRequestedImage:
            return {
                ...state,
                lastRequestedImage: [...state.lastRequestedImage, action.payload],
            };

        case MyActionType.clearLastRequestedImage:
            return {
                ...state,
                lastRequestedImage: [],
            };

        default:
            throw new Error("Unexpected action");
    }
}

// Define your action creators here
function isTypingOn(): MyIsTypingOnAction {
    return { type: MyActionType.isTypingOn };
}
function isTypingOff(): MyIsTypingOffAction {
    return { type: MyActionType.isTypingOff };
}
function initProfiles(profiles: IChatProfile[]): MyInitProfilesAction {
    return { type: MyActionType.initProfiles, payload: profiles };
}
function initMessages(items: string[]): MyInitMessagesAction {
    return { type: MyActionType.initMessages, payload: items };
}
function addMessage(item: string): MyAddMessageAction {
    return { type: MyActionType.addMessage, payload: item };
}
function isRequestImageOn(index: number): MyIsRequestImageOnAction {
    return { type: MyActionType.isRequestImageOn, payload: index };
}
function isRequestImageOff(): MyIsRequestImageOffAction {
    return { type: MyActionType.isRequestImageOff };
}
function addRequestedImage(data: IChatRequestedImage): MyAddImageOnRequestAction {
    return {
        type: MyActionType.addRequestedImage,
        payload: data,
    };
}

function clearLastRequestedImage(): MyClearLastRequestedImageAction {
    return {
        type: MyActionType.clearLastRequestedImage,
    };
}

// Create a context for your state and dispatch function
interface ChatContext extends MyState {
    isTypingOn: () => void;
    isTypingOff: () => void;
    initProfiles: (profiles: IChatProfile[]) => void;
    initMessages: (items: string[]) => void;
    addMessage: (item: string) => void;
    isRequestImageOn: (index: number) => void;
    isRequestImageOff: () => void;
    addRequestedImage: (data: IChatRequestedImage) => void;
    clearLastRequestedImage: () => void;
}

const ChatContext = createContext<ChatContext | undefined>(undefined);

// Create a provider component that wraps your app and passes the context down
const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        ...state,
        isTypingOn: () => dispatch(isTypingOn()),
        isTypingOff: () => dispatch(isTypingOff()),
        initProfiles: (profiles: IChatProfile[]) => dispatch(initProfiles(profiles)),
        initMessages: (items: string[]) => dispatch(initMessages(items)),
        addMessage: (item: string) => dispatch(addMessage(item)),
        isRequestImageOn: (index: number) => dispatch(isRequestImageOn(index)),
        isRequestImageOff: () => dispatch(isRequestImageOff()),
        addRequestedImage: (data: IChatRequestedImage) => dispatch(addRequestedImage(data)),
        clearLastRequestedImage: () => dispatch(clearLastRequestedImage()),
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Create a custom hook to easily use the context in your components
function useChatContext(): ChatContext {
    const context = useContext(ChatContext);

    if (context === undefined) {
        throw new Error("useChatContext must be used within a ChatProvider");
    }

    return context;
}

export { ChatContext, ChatProvider, useChatContext };
