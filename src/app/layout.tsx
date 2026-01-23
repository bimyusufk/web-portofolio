import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { PersonJsonLd, WebSiteJsonLd } from "@/components/json-ld";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bim Yusuf — Portfolio",
    template: "%s | Bim Yusuf",
  },
  description:
    "Personal portfolio and research hub for Bim Yusuf — Full-stack developer, researcher, and technologist building impactful software solutions.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  keywords: ["Bim Yusuf", "portfolio", "developer", "researcher", "software engineer", "full-stack"],
  authors: [{ name: "Bim Yusuf" }],
  creator: "Bim Yusuf",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bim Yusuf Portfolio",
    title: "Bim Yusuf — Portfolio",
    description:
      "Personal portfolio and research hub for Bim Yusuf — Full-stack developer, researcher, and technologist building impactful software solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bim Yusuf — Portfolio",
    description:
      "Personal portfolio and research hub for Bim Yusuf — Full-stack developer, researcher, and technologist.",
    creator: "@bimyusuf",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PersonJsonLd
          name="Bim Yusuf"
          url="https://bimyusuf.com"
          jobTitle="Full-Stack Developer & Researcher"
          description="Full-stack developer, researcher, and technologist building impactful software solutions."
          sameAs={[
            "https://github.com/bimyusuf",
            "https://linkedin.com/in/bimyusuf",
          ]}
        />
        <WebSiteJsonLd
          name="Bim Yusuf Portfolio"
          url="https://bimyusuf.com"
          description="Personal portfolio and research hub for Bim Yusuf"
        />
      </head>
      <body className={`${inter.variable} antialiased bg-surface text-slate-900`}>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
