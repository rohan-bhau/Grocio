import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";

export const metadata: Metadata = {
  title: "Grocio ",
  description: "10 minute grocery delivery app, best grocery selling app in Bangladesh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-[200vh] flex flex-col bg-linear-to-b from-[#0BA360]/10 to-[#3CBA92]/30">
        <Provider>
          <StoreProvider>{children}</StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
