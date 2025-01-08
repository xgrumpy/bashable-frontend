"use client";

import React, { createContext, useContext, useReducer } from "react";

// Define your initial state and actions here

interface IUpdateCreditPayload {
    credits: number;
    method?: "decrement" | "increment";
}

interface MyState {
    username: string;
    email: string;
    credits: number;
    role: string;
    avatar: string;
    loginType: string;
    unrestricted: boolean;
    acceptedTerms: boolean;
    discordConnected: boolean;
    referralCode: string;
    referrals: number;
    followers: number;
    following: number;
    emailVerified: boolean;
    mobile: string;
    mobileVerified: boolean;
    purchasedCredits: boolean;
    receiveTipEmail: boolean;
    autoRecharge: boolean;
    autoRechargeAmount: number;
    restrictedState: boolean;
    ageVerified: boolean;
    paymentMethodConnected: boolean;
    banned: boolean;
    receiveAutoRechargeEmail: boolean;
    botEnabled: boolean;
    isBetaTester: boolean;
}

enum MyActionType {
    LoggingIn = "LOGGING_IN",
    LoggingOut = "LOGGING_OUT",
    UpdateCredits = "UPDATE_CREDITS",
    UpdateImage = "UPDATE_IMAGE",
    UpdateBotEnabled = "UPDATE_BOT_ENABLED",
}

interface MyLoggindInAction {
    type: MyActionType.LoggingIn;
    payload: any;
}

interface MyLoggingOutAction {
    type: MyActionType.LoggingOut;
}

interface MyUpdateCreditsAction {
    type: MyActionType.UpdateCredits;
    payload: IUpdateCreditPayload;
}

interface MyUpdateBotEnabledAction {
    type: MyActionType.UpdateBotEnabled;
    payload: boolean;
}

type MyAction =
    | MyLoggindInAction
    | MyLoggingOutAction
    | MyUpdateCreditsAction
    | MyUpdateBotEnabledAction;

const initialState: MyState = {
    username: "",
    email: "",
    credits: 0,
    role: "",
    avatar: "",
    loginType: "",
    unrestricted: false,
    acceptedTerms: false,
    discordConnected: false,
    referralCode: "",
    referrals: 0,
    followers: 0,
    following: 0,
    emailVerified: false,
    mobile: "",
    mobileVerified: false,
    purchasedCredits: false,
    receiveTipEmail: false,
    autoRecharge: false,
    autoRechargeAmount: 0,
    restrictedState: false,
    ageVerified: false,
    paymentMethodConnected: false,
    banned: false,
    receiveAutoRechargeEmail: false,
    botEnabled: false,
    isBetaTester: false,
};

function reducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case MyActionType.LoggingIn:
            return { ...state, ...action.payload };

        case MyActionType.LoggingOut:
            return initialState;

        case MyActionType.UpdateCredits:
            if (action.payload.method === "increment") {
                return {
                    ...state,
                    credits: state.credits + action.payload.credits,
                };
            } else {
                return {
                    ...state,
                    credits: state.credits - action.payload.credits,
                };
            }

        case MyActionType.UpdateBotEnabled:
            return {
                ...state,
                botEnabled: action.payload || !state.botEnabled,
            };

        default:
            throw new Error("Unexpected action");
    }
}

// Define your action creators here
function login(value: MyState): MyLoggindInAction {
    return { type: MyActionType.LoggingIn, payload: value };
}

function logout(): MyLoggingOutAction {
    return { type: MyActionType.LoggingOut };
}

function updateCredits(value: IUpdateCreditPayload): MyUpdateCreditsAction {
    return {
        type: MyActionType.UpdateCredits,
        payload: value,
    };
}

function updateBotEnabled(value: boolean): MyUpdateBotEnabledAction {
    return {
        type: MyActionType.UpdateBotEnabled,
        payload: value,
    };
}

// Create a context for your state and dispatch function
interface AuthContext extends MyState {
    login: (value: MyState) => void;
    logout: () => void;
    updateCredits: (value: IUpdateCreditPayload) => void;
    updateBotEnabled: (value: boolean) => void;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);

// Create a provider component that wraps your app and passes the context down
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        ...state,
        login: (value: any) => dispatch(login(value)),
        logout: () => dispatch(logout()),
        updateCredits: (value: IUpdateCreditPayload) => dispatch(updateCredits(value)),
        updateBotEnabled: (value: boolean) => dispatch(updateBotEnabled(value)),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Create a custom hook to easily use the context in your components
function useAuthContext(): AuthContext {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAppContext must be used within a AuthProvider");
    }

    return context;
}

export { AuthContext, AuthProvider, useAuthContext };
