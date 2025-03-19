import Navbar from "@/components/landing/Navbar"; // Sesuaikan path jika perlu
import "./globals.css";
import { Poppins } from "next/font/google";

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
      <body className={poppins.className}>
        <main>{children}</main>
      </body>
    </html>
  );
}
