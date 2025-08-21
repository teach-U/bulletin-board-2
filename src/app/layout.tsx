import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const noto_sans_jp = Noto_Sans_JP();

export const metadata: Metadata = {
  title: "Bulletin Board App",
  description: "Bulletin Board App by Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto_sans_jp.className} antialiased bg-gray-200`}>
        {children}
      </body>
    </html>
  );
}
