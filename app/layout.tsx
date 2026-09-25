import type { Metadata } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SetupBanner } from "@/components/SetupBanner";
import "./globals.css";

const sans = Outfit({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: {
    default: "Travvis Multimarcas",
    template: "%s · Travvis Multimarcas",
  },
  description: "Roupas, relógios e bonés. Peça pelo WhatsApp ou pague com Pix e cartão.",
  icons: { icon: "/marca.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${sans.variable} ${serif.variable} flex min-h-screen flex-col font-sans`}>
        <CartProvider>
          <SetupBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
