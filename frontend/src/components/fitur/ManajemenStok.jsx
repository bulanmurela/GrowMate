"use client";

import { useState } from "react";

export default function ManajemenStok() {
  const [produkList, setProdukList] = useState([]);
  const [formData, setFormData] = useState({
    nama: "",
    kategori: "",
    harga: "",
    jumlah: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTambahProduk = () => {
    const newProduk = {
      id: produkList.length + 1,
      ...formData,
      harga: parseInt(formData.harga),
      jumlah: parseInt(formData.jumlah),
    };
    setProdukList([...produkList, newProduk]);
    setFormData({ nama: "", kategori: "", harga: "", jumlah: "" });
  };

  const handleDelete = (id) => {
    setProdukList(produkList.filter((produk) => produk.id !== id));
  };

  
  const [editProdukId, setEditProdukId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    nama: "",
    kategori: "",
    harga: "",
    jumlah: 0,
  });

  const handleEdit = (produk) => {
    setEditProdukId(produk.id);
    setEditFormData({ ...produk });
  };
  
  const handleSimpan = () => {
    const updatedList = produkList.map((item) =>
      item.id === editProdukId
        ? {
            ...item,
            nama: editFormData.nama,
            kategori: editFormData.kategori,
            harga: parseInt(editFormData.harga),
            jumlah: editFormData.jumlah,
          }
        : item
    );
    setProdukList(updatedList);
    setEditProdukId(null);
  };

  const handleIncrement = () => {
    setEditFormData((prev) => ({ ...prev, jumlah: prev.jumlah + 1 }));
  };
  
  const handleDecrement = () => {
    setEditFormData((prev) => ({
      ...prev,
      jumlah: prev.jumlah > 0 ? prev.jumlah - 1 : 0,
    }));
  };  

  return (
    <div className="min-h-screen bg-white pt-[50px] relative px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-10">Manajemen Stok</h1>
      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-[#96ADD6] font-semibold mb-2">+ Tambah Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="nama"
            placeholder="Nama Produk"
            value={formData.nama}
            onChange={handleChange}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl"
          />
          <input
            type="text"
            name="kategori"
            placeholder="Kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl"
          />
          <input
            type="number"
            name="harga"
            placeholder="Harga"
            value={formData.harga}
            onChange={handleChange}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl"
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah"
            value={formData.jumlah}
            onChange={handleChange}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl"
          />
        </div>
        <button
          onClick={handleTambahProduk}
          className="text-[#96ADD6] text-[14px] bg-[#F2D7D3] px-6 py-1 rounded-3xl hover:bg-[#F9B8AF] font-medium"
        >
          Simpan
        </button>
      </div>

      {produkList.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-center text-black bg-[#F2D7D3] rounded-lg overflow-hidden">
                <th className="py-3 px-4 w-[60px] rounded-l-lg">ID</th>
                <th className="py-3 px-4 w-[230px]">Nama Produk</th>
                <th className="py-3 px-4 w-[230px]">Kategori</th>
                <th className="py-3 px-4 w-[150px]">Harga</th>
                <th className="py-3 px-4 w-[100px]">Jumlah</th>
                <th className="py-3 px-4 w-[200px] rounded-r-lg">Action</th>
              </tr>
            </thead>
            <tbody>
                {produkList.map((produk) => (
                    <tr key={produk.id} className="...">
                        <td className="py-2 px-4 text-center text-black w-[60px]">{produk.id}</td>

                        {/* Kondisi jika sedang di-edit */}
                        {editProdukId === produk.id ? (
                        <>
                            <td className="py-2 px-4">
                            <input
                                type="text"
                                value={editFormData.nama}
                                onChange={(e) => setEditFormData({ ...editFormData, nama: e.target.value })}
                                className=" w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black"
                            />
                            </td>
                            <td className="py-2 px-4">
                            <input
                                type="text"
                                value={editFormData.kategori}
                                onChange={(e) => setEditFormData({ ...editFormData, kategori: e.target.value })}
                                className="w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black"
                            />
                            </td>
                            <td className="py-2 px-4 text-center">
                            <input
                                type="number"
                                value={editFormData.harga}
                                onChange={(e) => setEditFormData({ ...editFormData, harga: e.target.value })}
                                className="w-[150px] border border-gray-300 px-2 py-0 rounded-2xl text-black text-center"
                            />
                            </td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center items-center gap-2 w-[100px]">
                                <button onClick={handleDecrement} className="px-2 text-md bg-[#96ADD6] rounded-2xl">-</button>
                                <span>{editFormData.jumlah}</span>
                                <button onClick={handleIncrement} className="px-2 text-md bg-[#96ADD6] rounded-2xl">+</button>
                            </div>
                            </td>
                            <td className="py-2 px-4 text-center">
                            <div className="flex justify-center gap-2 w-[200px]">
                                <button
                                onClick={handleSimpan}
                                className="bg-[#F9B8AF] hover:bg-[#96ADD6] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold"
                                >
                                Simpan
                                </button>
                            </div>
                            </td>
                        </>
                        ) : (
                        <>
                            <td className="py-2 px-4 text-black">{produk.nama}</td>
                            <td className="py-2 px-4 text-black">{produk.kategori}</td>
                            <td className="py-2 px-4 text-center text-black">Rp {produk.harga.toLocaleString()}</td>
                            <td className="py-2 px-4 text-center text-black">{produk.jumlah}</td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(produk)}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold"
                                    >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(produk.id)}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold"
                                    >
                                    Hapus
                                </button>
                            </div>
                            </td>
                        </>
                        )}
                    </tr>
                    ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
