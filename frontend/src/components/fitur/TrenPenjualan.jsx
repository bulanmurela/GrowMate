"use client";

import { useEffect, useState } from "react";

const TrenPenjualan = () => {
  const [produkTren, setProdukTren] = useState([]);
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [sumberFilter, setSumberFilter] = useState("");
  const [filteredProduk, setFilteredProduk] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // === Ganti bagian ini dengan fetch ke API saat backend sudah siap ===
        const dummyData = [
          { namaProduk: "Masker Wajah", kategori: "Kecantikan", sumber: "Google Trends" },
          { namaProduk: "Sneakers Retro", kategori: "Fashion", sumber: "Twitter" },
          { namaProduk: "Kopi Arabika", kategori: "Minuman", sumber: "Instagram" },
          { namaProduk: "Smartwatch Z1", kategori: "Elektronik", sumber: "Google Trends" },
          { namaProduk: "Kaos Polos Oversize", kategori: "Fashion", sumber: "TikTok" },
          { namaProduk: "Shampoo Herbal", kategori: "Kesehatan", sumber: "Google Trends" },
          { namaProduk: "Game Console X", kategori: "Elektronik", sumber: "Reddit" },
          { namaProduk: "Teh Hijau Premium", kategori: "Minuman", sumber: "Instagram" },
          { namaProduk: "Parfum Floral", kategori: "Kecantikan", sumber: "TikTok" },
          { namaProduk: "Tas Tote Kulit", kategori: "Fashion", sumber: "Twitter" },
        ];

        setProdukTren(dummyData);
      } catch (err) {
        console.error("Gagal mengambil data tren penjualan:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterData = produkTren.filter((item) => {
      return (
        (kategoriFilter === "" || item.kategori === kategoriFilter) &&
        (sumberFilter === "" || item.sumber === sumberFilter)
      );
    });

    setFilteredProduk(filterData);
  }, [kategoriFilter, sumberFilter, produkTren]);

  const kategoriUnik = [...new Set(produkTren.map((item) => item.kategori))];
  const sumberUnik = [...new Set(produkTren.map((item) => item.sumber))];

  return (
    <div className="min-h-screen bg-white pt-[50px] relative px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-6">Tren Penjualan</h1>

      {/* Filter */}
      <div className="flex gap-4 mb-4 mx-23">
        <select
          value={kategoriFilter}
          onChange={(e) => setKategoriFilter(e.target.value)}
          className="text-[#96ADD6] text-sm border rounded-2xl px-2 py-1 w-[160px]"
        >
          <option value="">Semua Kategori</option>
          {kategoriUnik.map((kategori) => (
            <option key={kategori} value={kategori}>
              {kategori}
            </option>
          ))}
        </select>

        <select
          value={sumberFilter}
          onChange={(e) => setSumberFilter(e.target.value)}
          className="text-[#96ADD6] text-sm border rounded-2xl px-2 py-1 w-[160px]"
        >
          <option value="">Semua Sumber</option>
          {sumberUnik.map((sumber) => (
            <option key={sumber} value={sumber}>
              {sumber}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Tren Penjualan */}
      <div className="overflow-x-auto max-w-6xl mx-auto">
        <table className="w-full border-separate border-spacing-y-2">
          <thead className="bg-[#F2EEE9] text-[#E85234] text-center overflow-hidden">
            <tr>
              <th className="px-4 py-2 text-center w-[100px] rounded-tl-lg">Urutan</th>
              <th className="px-4 py-2 text-center w-[250px]">Nama Produk</th>
              <th className="px-4 py-2 text-center w-[250px]">Kategori</th>
              <th className="px-4 py-2 text-center w-[250px] rounded-tl-lg">Sumber</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduk.map((produk, index) => (
              <tr key={index}>
                <td className="text-black text-center">{index + 1}</td>
                <td className="text-black text-center">{produk.namaProduk}</td>
                <td className="text-black text-center">{produk.kategori}</td>
                <td className="text-black text-center">{produk.sumber}</td>
              </tr>
            ))}
            {filteredProduk.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrenPenjualan;