"use client";

import { defaultConfig } from "next/dist/server/config-shared";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import ProfilePopup from "@/components/menu/PopUpProfile";

export default function Navbar() {
  // State untuk cek apakah user sudah login
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const pathname = usePathname(); // Ambil path sekarang

  // // Cek status login dari localStorage saat pertama kali komponen dimuat
  // useEffect(() => {
  //   const token = localStorage.getItem("token"); // Contoh cek token login
  //   if (token) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const handleProfileClick = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  return (
    <>
      <nav className="flex justify-between items-center px-12 shadow-md  bg-white backdrop-blur-lg z-50 h-[90px]">
        <Link href="/">
          <div className="flex items-center">
            <img src="/assets/LOGO.png" alt="GrowMate Logo" width={200} className="h-[36px]"
            />
          </div>
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex space-x-12 text-black font-medium">
            <li>
              <Link
                href="/Beranda"
                className={`hover:text-[#F9B8AF] hover:font-semibold transition ${
                  pathname === "/Beranda" ? "font-bold text-[#00408C]" : ""
                }`}
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/Fitur-Section"
                className={`hover:text-[#F9B8AF] hover:font-semibold transition ${
                  pathname === "/Fitur-Section" ? "font-bold text-[#00408C]" : ""
                }`}
              >
                Fitur
              </Link>
            </li>
            <li>
              <Link
                href="/Tentang-Kami"
                className={`hover:text-[#F9B8AF] hover:font-semibold transition ${
                  pathname === "/Tentang-Kami" ? "font-bold text-[#00408C]" : ""
                }`}
              >
                Tentang Kami
              </Link>
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
        ) : (
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleProfileClick}
          >
            <button className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] font-normal text-[14px] px-8 py-2 rounded-[20px] transition">
              johndoe
            </button>
            <img
              src="/assets/ikonProfil.png"
              alt="Profile Icon"
              className="w-9 h-9 rounded-full"
            />
          </div>

        )}
      </nav>

      {showProfile && <ProfilePopup onClose={closeProfile} />}
    </>
  );
}