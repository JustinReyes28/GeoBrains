import type { Metadata } from "next";

import "./globals.css";
import { Providers } from "@/components/Providers";



export const metadata: Metadata = {
    title: "GeoBrains - Master the World Map",
    description: "Test your geographic knowledge with interactive maps and global competition.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
