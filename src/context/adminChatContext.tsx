"use client";

import React, { createContext, useContext, useReducer } from "react";
import { TAdminChatAttachMode } from "../interfaces/chat";

// Define your initial state and actions here
interface MyState {
    chatAttachMode: TAdminChatAttachMode;
    generatedMessage: string;
}

enum MyActionType {
    initChatAttachMode = "INIT_CHAT_ATTACH_MODE",
    changeChatAttachMode = "CHANGE_CHAT_ATTACH_MODE",
    changeGeneratedMessage = "CHANGE_GENERATED_MESSAGE",
}

interface MyInitChatAttachModeAction {
    type: MyActionType.initChatAttachMode;
}

interface MyChangeChatAttachModeAction {
    type: MyActionType.changeChatAttachMode;
    payload: TAdminChatAttachMode;
}

interface MyChangeGeneratedMessageAction {
    type: MyActionType.changeGeneratedMessage;
    payload: string;
}

type MyAction =
    | MyInitChatAttachModeAction
    | MyChangeChatAttachModeAction
    | MyChangeGeneratedMessageAction;

const initialState: MyState = {
    chatAttachMode: "auto-gen-plus-send",
    generatedMessage: "",
};

function reducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case MyActionType.initChatAttachMode:
            let localMode =
                (localStorage.getItem("admin-attach-mode") as TAdminChatAttachMode) ||
                "auto-gen-plus-send";

            return {
                ...state,
                chatAttachMode: localMode,
            };

        case MyActionType.changeChatAttachMode:
            localStorage.setItem("admin-attach-mode", action.payload);
            return {
                ...state,
                chatAttachMode: action.payload,
            };

        case MyActionType.changeGeneratedMessage:
            return {
                ...state,
                generatedMessage: action.payload,
            };

        default:
            throw new Error("Unexpected action");
    }
}

// Define your action creators here
function initChatAttachMode(): MyInitChatAttachModeAction {
    return { type: MyActionType.initChatAttachMode };
}
function changeChatAttachMode(mode: TAdminChatAttachMode): MyChangeChatAttachModeAction {
    return { type: MyActionType.changeChatAttachMode, payload: mode };
}
function changeGeneratedMessage(message: string): MyChangeGeneratedMessageAction {
    return { type: MyActionType.changeGeneratedMessage, payload: message };
}

// Create a context for your state and dispatch function
interface AdminChatContext extends MyState {
    initChatAttachMode: () => void;
    changeChatAttachMode: (mode: TAdminChatAttachMode) => void;
    changeGeneratedMessage: (message: string) => void;
}

const AdminChatContext = createContext<AdminChatContext | undefined>(undefined);

// Create a provider component that wraps your app and passes the context down
const AdminChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        ...state,
        initChatAttachMode: () => dispatch(initChatAttachMode()),
        changeChatAttachMode: (mode: TAdminChatAttachMode) => dispatch(changeChatAttachMode(mode)),
        changeGeneratedMessage: (message: string) => dispatch(changeGeneratedMessage(message)),
    };

    return <AdminChatContext.Provider value={value}>{children}</AdminChatContext.Provider>;
};

// Create a custom hook to easily use the context in your components
function useAdminChatContext(): AdminChatContext {
    const context = useContext(AdminChatContext);

    if (context === undefined) {
        throw new Error("useAdminChatContext must be used within a AdminChatProvider");
    }

    return context;
}

export { AdminChatContext, AdminChatProvider, useAdminChatContext };
