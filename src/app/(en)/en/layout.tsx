import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat } from "next/font/google";
import "../../globals.css";
import { en } from "@/content/en";
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
  title: en.meta.title,
  description: en.meta.description,
};

export default function EnRootLayout({ children }: LayoutProps<"/en">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <CustomCursor />
        <Header content={en.nav} homeHref="/en" />
        <main className="flex-1">{children}</main>
        <Footer nav={en.nav} contact={en.contact} footer={en.footer} homeHref="/en" />
      </body>
    </html>
  );
}
