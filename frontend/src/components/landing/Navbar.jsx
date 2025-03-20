"use client";

import { defaultConfig } from "next/dist/server/config-shared";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-12 py-0 shadow-md  bg-white/90 backdrop-blur-lg z-50 h-[100px]">
      <div className="flex items-center">
        <img src="/assets/LOGO.png" alt="GrowMate Logo" width={200} className="h-[36px]"
        />
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="flex space-x-12 text-black font-medium">
          <li>
            <Link href="#beranda" className="hover:text-[#F9B8AF] hover:font-semibold transition">Beranda</Link>
          </li>
          <li>
            <Link href="#fitur" className="hover:text-[#F9B8AF] hover:font-semibold transition">Fitur</Link>
          </li>
          <li>
            <Link href="#tentang-kami" className="hover:text-[#F9B8AF] hover:font-semibold transition">Tentang Kami</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}