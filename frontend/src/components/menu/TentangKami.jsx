// src/app/TentangKami/page.jsx

import React from "react";

const TentangKami = () => {
  return (
    <div className="flex flex-col justify-between bg-white text-black">
      {/* Konten Utama */}
      <main className="px-6 md:px-20 lg:px-40 py-14">
        <h1 className="text-2xl md:text-2xl font-bold text-[#00408C] mb-4">Tentang Kami</h1>

        <p className="text-justify text-[15px] mb-12">
          Kami adalah kelompok 12 Proyek Senior Teknologi Informasi yang mengangkat kepedulian terhadap
          pertumbuhan dan pengelolaan bisnis UMKM di era digital. Website ini dirancang untuk membantu
          pelaku usaha dalam mengelola stok produk, memantau tren penjualan di pasar, dan memahami
          bagaimana analisis penjualan mereka.
        </p>

        {/* Tujuan Pengembangan */}
        <h2 className="text-2xl font-bold text-[#00408C] mb-4">Tujuan Pengembangan</h2>

        <p className="text-justify text-[15px] mb-12">
        Dengan menggabungkan kemudahan dalam manajemen produk dan data tren penjualan dari berbagai
          sumber, kami berharap dapat memberikan solusi digital yang praktis, modern, dan mudah digunakan
          oleh siapapun. Website <span className="font-semibold">GrowMate</span> diharapkan dapat menjadi
          teknologi andalan bagi UMKM dengan meningkatkan produktivitas dan mendukung pengambilan keputusan
          berbasis data.
        </p>

        {/* Anggota Tim */}
        <h2 className="text-center text-2xl font-bold text-[#00408C] mb-4">Anggota Tim</h2>
        <div className="grid md:grid-cols-3 gap-0 text-center">
          <div>
            <p className="font-semibold">Tsabitah Inayah</p>
            <p className="text-sm">22/498733/TK/54717</p>
          </div>
          <div>
            <p className="font-semibold">Bulan Aprilia Putri Murela</p>
            <p className="text-sm">22/500326/TK/54834</p>
          </div>
          <div>
            <p className="font-semibold">Sakti Cahya Buana</p>
            <p className="text-sm">22/503237/TK/54974</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TentangKami;
