"use client";

import { INotification } from "@/interfaces/notifications";
import React, { createContext, useContext, useReducer } from "react";

// Define your initial state and actions here
interface MyState {
    notifications: INotification[];
}

enum MyActionType {
    initNotifications = "INIT_NOTIFICATIONS",
    addNotification = "ADD_NOTIFICATION",
    markAsRead = "MARK_AS_READ",
    markAllAsRead = "MARK_ALL_AS_READ",
}

interface MyInitNotificationAction {
    type: MyActionType.initNotifications;
    payload: INotification[];
}

interface MyAddNotificationAction {
    type: MyActionType.addNotification;
    payload: INotification;
}

interface MyMarkAsReadAction {
    type: MyActionType.markAsRead;
    payload: string;
}
interface MyMarkAllAsReadAction {
    type: MyActionType.markAllAsRead;
}

type MyAction =
    | MyInitNotificationAction
    | MyAddNotificationAction
    | MyMarkAsReadAction
    | MyMarkAllAsReadAction;

const initialState: MyState = {
    notifications: [],
};

function reducer(state: MyState, action: MyAction): MyState {
    switch (action.type) {
        case MyActionType.initNotifications:
            return {
                notifications: action.payload,
            };

        case MyActionType.addNotification:
            return {
                notifications: [action.payload, ...state.notifications],
            };

        case MyActionType.markAsRead:
            return {
                notifications: state.notifications.map((item) => {
                    if (item.id === action.payload) {
                        return {
                            ...item,
                            read: true,
                        };
                    } else {
                        return item;
                    }
                }),
            };

        case MyActionType.markAllAsRead:
            return {
                notifications: state.notifications.map((item) => {
                    return {
                        ...item,
                        read: true,
                    };
                }),
            };

        default:
            throw new Error("Unexpected action");
    }
}

// Define your action creators here
function initNotifications(items: INotification[]): MyInitNotificationAction {
    return { type: MyActionType.initNotifications, payload: items };
}
function addNotification(item: INotification): MyAddNotificationAction {
    return { type: MyActionType.addNotification, payload: item };
}
function markAsRead(id: string): MyMarkAsReadAction {
    return { type: MyActionType.markAsRead, payload: id };
}
function markAllAsRead(): MyMarkAllAsReadAction {
    return { type: MyActionType.markAllAsRead };
}

// Create a context for your state and dispatch function
interface NotificationContext extends MyState {
    initNotifications: (items: INotification[]) => void;
    addNotification: (item: INotification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContext | undefined>(undefined);

// Create a provider component that wraps your app and passes the context down
const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = {
        ...state,
        initNotifications: (items: INotification[]) => dispatch(initNotifications(items)),
        addNotification: (item: INotification) => dispatch(addNotification(item)),
        markAsRead: (id: string) => dispatch(markAsRead(id)),
        markAllAsRead: () => dispatch(markAllAsRead()),
    };

    return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Create a custom hook to easily use the context in your components
function useNotificationContext(): NotificationContext {
    const context = useContext(NotificationContext);

    if (context === undefined) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }

    return context;
}

export { NotificationContext, NotificationProvider, useNotificationContext };
