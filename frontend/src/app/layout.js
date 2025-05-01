import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["500", "700"], // Medium & Bold
  style: ["normal", "italic"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "700"], // Medium & Bold
  style: ["normal", "italic"],
});

export const metadata = {
  title: "GrowMate",
  description: "Teman bagi UMKM dalam mengoptimalkan penjualan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${poppins.className} flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}