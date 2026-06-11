import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUser from "@/InitUser";

export const metadata: Metadata = {
  title: "Grocio ",
  description:
    "10 minute grocery delivery app, best grocery selling app in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="w-full min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {" "}
        <Provider>
          <StoreProvider>
            <InitUser />
            {children}
            <Toaster />
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
