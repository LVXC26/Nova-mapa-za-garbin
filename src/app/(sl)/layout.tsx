import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "../globals.css";
import { sl } from "@/content/sl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CustomCursor } from "@/components/CustomCursor";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: sl.meta.title,
  description: sl.meta.description,
};

export default function SlRootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sl"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CustomCursor />
        <Header content={sl.nav} homeHref="/" />
        <main className="flex-1">{children}</main>
        <Footer nav={sl.nav} contact={sl.contact} footer={sl.footer} homeHref="/" />
      </body>
    </html>
  );
}
