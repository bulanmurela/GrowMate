"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Masuk = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
      
      if (res.ok) {
        // Simpan token dan data user
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify({
          username: data.username,
          email: data.email
        }));
        
        // Paksa reload halaman untuk update navbar
        window.location.href = "/Beranda";
      } else {
        alert(data.error || "Login gagal");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Terjadi kesalahan jaringan");
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {/* Form Container */}
      <div className="bg-white shadow-lg border-1 rounded-[20px] p-8 max-w-md w-full">
        {/* Kembali */}
        <Link href="/" className="text-sm text-red-500 mb-2 block">
          &larr; Kembali
        </Link>

        {/* Logo */}
        <div className="flex justify-center mb-2">
          <Image src="/assets/LOGO.png" alt="Growmate" width={120} height={40} />
        </div>

        {/* Judul */}
        <h2 className="text-2xl font-bold text-[#00408C] text-center">
          Masuk ke Akun Anda
        </h2>
        <p className="text-[#7D7D7D] text-sm text-center mt-1">
        Akses semua fitur dengan mudah dan menyimpan riwayat aktivitas ke akun Anda
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="mt-6">
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-black">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-[12px] text-black pl-4 border border-black rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-black">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-[12px] text-black pl-4 border border-black rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-black">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-[12px] text-black pl-4 border border-black rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="mt-4 w-full bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] font-semibold py-2 rounded-[20px] transition"
          >
            Masuk
          </button>
        </form>

        {/* Belum punya akun */}
        <p className="text-center text-sm text-black mt-4">
          Belum punya akun?{" "}
          <Link href="/Daftar" className="text-[#E85234] font-semibold">
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Masuk;