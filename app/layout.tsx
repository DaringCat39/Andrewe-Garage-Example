import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.andrewsgarage.co.uk"),
  title: "Andrew's Garage | MOT, Servicing & Vehicle Repairs in Solihull",
  description:
    "Independent garage in Solihull for MOT testing, vehicle servicing, diagnostics, brakes, tyres and mechanical repairs. Clear advice and straightforward estimates.",
  keywords: [
    "garage Solihull",
    "MOT Solihull",
    "car servicing Solihull",
    "vehicle diagnostics",
    "car repairs",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "/",
    siteName: "Andrew's Garage",
    title: "Andrew's Garage | Vehicle Care, Properly Explained",
    description:
      "MOT testing, servicing, diagnostics and mechanical repairs from an independent Solihull workshop.",
    images: [
      {
        url: "/images/workshop-hero.png",
        width: 1661,
        height: 947,
        alt: "Andrew's Garage workshop",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Andrew's Garage | Vehicle Care, Properly Explained",
    description:
      "Independent MOT testing, servicing, diagnostics and mechanical repairs in Solihull.",
    images: ["/images/workshop-hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  category: "automotive",
};

export const viewport: Viewport = {
  themeColor: "#17201d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" className="h-full scroll-smooth antialiased">
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[200] -translate-y-24 rounded-full bg-lime px-5 py-3 text-sm font-bold text-dark transition focus:translate-y-0"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
