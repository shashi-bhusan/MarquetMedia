import type { Metadata } from "next";
import { Libre_Baskerville, Montserrat } from "next/font/google";
import "./globals.css";
import { PerformanceInitializer } from "@/components/PerformanceInitializer";
import { ThemeProvider } from "@/providers/ThemeProvider";

const baskerville = Libre_Baskerville({
  variable: "--font-baskerville",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap", // Add font-display: swap for better performance
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap", // Add font-display: swap for better performance
});

export const metadata: Metadata = {
  title: "Marquet Media - Creative Media House",
  description: "We're a creative media house helping brands grow through influencer collaborations, graphic design, and business development.",
  keywords: "creative media, branding, marketing, Jharkhand, East India, design agency",
  authors: [{ name: "Marquet Media" }],
  openGraph: {
    title: "Marquet Media - Creative Media House",
    description: "Elevate Your Brand. Quietly Powerful. Creatively Bold.",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/MARQUET.svg" as="image" type="image/svg+xml" />
        <link rel="preload" href="/marquetmedia.mp4" as="video" type="video/mp4" />
        <link rel="preload" href="/image.png" as="image" type="image/png" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Viewport meta tag for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${baskerville.variable} ${montserrat.variable} antialiased text-smooth`}
      >
        <ThemeProvider>
          <PerformanceInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
