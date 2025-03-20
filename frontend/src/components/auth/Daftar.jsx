"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Daftar = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Data yang dikirim:", formData);
    // TODO: Kirim data ke backend dengan fetch atau axios
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
          Daftarkan Akun Anda
        </h2>
        <p className="text-[#7D7D7D] text-sm text-center mt-1">
          Akses semua fitur dengan mudah dan menyimpan riwayat aktivitas ke akun Anda
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6">
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-black-[12px] pl-4 border rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-black-[12px] pl-4 border rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-1 p-1.5 text-sm text-black-[12px] pl-4 border rounded-[50px] focus:outline-none focus:ring-3 focus:ring-[#F2D7D3]"
              required
            />
          </div>

          {/* Tombol Daftar */}
          <button
            type="submit"
            className="w-full bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] font-semibold py-2 rounded-[20px] transition"
          >
            Daftar
          </button>
        </form>

        {/* Sudah punya akun */}
        <p className="text-center text-sm mt-4">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="text-[#E85234] font-semibold">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Daftar;
