import ClientRoot from "@/component/utils/ClientRoot";
import { AppProvider } from "@/context/appContext";
import { AuthProvider } from "@/context/authContext";
import { NotificationProvider } from "@/context/notificationContext";
import "easymde/dist/easymde.min.css";
import type { Metadata } from "next";
import Script from "next/script";
import { ReactNode } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import "react-phone-number-input/style.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import { AdminChatProvider } from "../context/adminChatContext";
import { ChatProvider } from "../context/chatContext";
import "../styles/globals.css";

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
    title: "Bashable.art",
    description: "Bashable is an AI tool to generate beautiful realstic images.",
    openGraph: {
        type: "website",
        url: process.env.NEXT_PUBLIC_SITE_URL,
        siteName: "Bashable.art",
        title: "Bashable.art",
        description: "Bashable is an AI tool to generate beautiful realstic images",
        images: "/images/hero-images.webp",
    },
    other: {
        RATING: "RTA-5042-1996-1400-1577-RTA",
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" className="dark">
            <head>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-QWFXGTWD21"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
						window.dataLayer = window.dataLayer || [];
						function gtag(){window.dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-QWFXGTWD21');
                    `}
                </Script>
            </head>
            <body>
                <div id="modal-root"></div>
                <AuthProvider>
                    <AppProvider>
                        <NotificationProvider>
                            <AdminChatProvider>
                                <ChatProvider>
                                    <ClientRoot>{children}</ClientRoot>
                                </ChatProvider>
                            </AdminChatProvider>
                        </NotificationProvider>
                    </AppProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
