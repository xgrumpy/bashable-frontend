"use client";

import React, { createContext, useContext, useReducer } from "react";

// Define your initial state and actions here

type AuthBoxStatus = "" | "login" | "signup";

interface MyState {
    darkmode: boolean;
    authBoxStatus: AuthBoxStatus;
    mobileVerifyBoxStatus: boolean;
}

enum MyActionType {
    initTheme = "INIT_THEME",
    toggleDarkMode = "TOGGLE_DARKMODE",
    changeAuthBoxStatus = "CHANGE_AUTHBOX_STATUS",
    changeMobileVerifyBoxStatus = "CHANGE_MOBILE_VERIFYBOX_STATUS",
}

interface MyInitThemeAction {
    type: MyActionType.initTheme;
}

interface MyToggleDarkModeAction {
    type: MyActionType.toggleDarkMode;
}
interface MyChangeAuthBoxStatusAction {
    type: MyActionType.changeAuthBoxStatus;
    payload: AuthBoxStatus;
}
interface MyChangeMobileVerifyBoxStatusAction {
    type: MyActionType.changeMobileVerifyBoxStatus;
    payload: boolean;
}

type MyAction =
    | MyInitThemeAction
    | MyToggleDarkModeAction
    | MyChangeAuthBoxStatusAction
    | MyChangeMobileVerifyBoxStatusAction;

const initialState: MyState = {
    darkmode: true,
    authBoxStatus: "",
    mobileVerifyBoxStatus: false,
};

function reducer(state: MyState, action: MyAction): MyState {
    let html = document.querySelector("html");
    let localTheme = localStorage.getItem("theme") || "dark";

    switch (action.type) {
        case MyActionType.initTheme:
            localStorage.setItem("theme", localTheme);
            html?.classList.remove("light");
            html?.classList.remove("dark");
            html?.classList.add(localTheme);
            return {
                ...state,
                darkmode: localTheme === "dark",
            };

        case MyActionType.toggleDarkMode:
            html?.classList.remove("light");
            html?.classList.remove("dark");

            if (localTheme === "dark") {
                localStorage.setItem("theme", "light");
                html?.classList.add("light");
            } else {
                localStorage.setItem("theme", "dark");
                html?.classList.add("dark");
            }

            return {
                ...state,
                darkmode: localTheme === "dark",
            };

        case MyActionType.changeAuthBoxStatus:
            return {
                ...state,
                authBoxStatus: action.payload,
            };

        case MyActionType.changeMobileVerifyBoxStatus:
            return {
                ...state,
                mobileVerifyBoxStatus: action.payload,
            };

        default:
            throw new Error("Unexpected action");
    }
}

// Define your action creators here
function initTheme(): MyInitThemeAction {
    return { type: MyActionType.initTheme };
}
function toggleDarkMode(): MyToggleDarkModeAction {
    return { type: MyActionType.toggleDarkMode };
}
function changeAuthBoxStatus(value: AuthBoxStatus): MyChangeAuthBoxStatusAction {
    return { type: MyActionType.changeAuthBoxStatus, payload: value };
}
function changeMobileVerifyBoxStatus(value: boolean): MyChangeMobileVerifyBoxStatusAction {
    return { type: MyActionType.changeMobileVerifyBoxStatus, payload: value };
}

// Create a context for your state and dispatch function
interface AppContext extends MyState {
    initTheme: () => void;
    toggleDarkMode: () => void;
    changeAuthBoxStatus: (value: AuthBoxStatus) => void;
    changeMobileVerifyBoxStatus: (value: boolean) => void;
}

const AppContext = createContext<AppContext | undefined>(undefined);

// Create a provider component that wraps your app and passes the context down
const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        ...state,
        initTheme: () => dispatch(initTheme()),
        toggleDarkMode: () => dispatch(toggleDarkMode()),
        changeAuthBoxStatus: (value: AuthBoxStatus) => dispatch(changeAuthBoxStatus(value)),
        changeMobileVerifyBoxStatus: (value: boolean) =>
            dispatch(changeMobileVerifyBoxStatus(value)),
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Create a custom hook to easily use the context in your components
function useAppContext(): AppContext {
    const context = useContext(AppContext);

    if (context === undefined) {
        throw new Error("useAppContext must be used within a AppProvider");
    }

    return context;
}

export { AppContext, AppProvider, useAppContext };
