"use client";

import { defaultConfig } from "next/dist/server/config-shared";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  // State untuk cek apakah user sudah login
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Cek status login dari localStorage saat pertama kali komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("token"); // Contoh cek token login
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <nav className="flex justify-between items-center px-12 shadow-md  bg-white backdrop-blur-lg z-50 h-[90px]">
      <div className="flex items-center">
        <img src="/assets/LOGO.png" alt="GrowMate Logo" width={200} className="h-[36px]"
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-12 text-black font-medium">
          <li>
            <Link href="/Beranda" className="hover:text-[#F9B8AF] hover:font-semibold transition">Beranda</Link>
          </li>
          <li>
            <Link href="/Fitur-Section" className="hover:text-[#F9B8AF] hover:font-semibold transition">Fitur</Link>
          </li>
          <li>
            <Link href="#tentang-kami" className="hover:text-[#F9B8AF] hover:font-semibold transition">Tentang Kami</Link>
          </li>
        </ul>
      </div>

      {/* Tombol Daftar & Masuk (di kanan) */}
      {!isLoggedIn ? (
        <div className="flex gap-2 md:justify-center h-[35px]">
        <Link
          href="/Daftar"
          className="flex items-center bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] text-sm font-semibold px-8 py-4 rounded-[20px] transition"
        >
          Daftar
        </Link>
        <Link
          href="/Masuk"
          className="flex items-center bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] text-sm font-semibold px-8 py-4 rounded-[20px] transition"
        >
          Masuk
        </Link>
      </div>
      ) : null}

    </nav>
  );
}