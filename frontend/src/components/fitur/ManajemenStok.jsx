"use client";

import { useState, useEffect } from "react";

// It's good practice to define API_URL outside the component or in a config file
// For Next.js, you'd use process.env.NEXT_PUBLIC_API_URL
// For Create React App, it's process.env.REACT_APP_API_URL
// Let's assume a general approach for now, but you should configure this properly for your setup.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://growmate-app.up.railway.app"; // Fallback if env var isn't set

export default function ManajemenStok() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHariBaru, setLoadingHariBaru] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit_price: "",
    stock: "",
  });
  const [manualDate, setManualDate] = useState('');

  const validateToken = () => {
    const token = localStorage.getItem('token');
    const userItem = localStorage.getItem('user');
    
    if (!token || !userItem) {
      // console.error("Token atau user tidak ditemukan di localStorage");
      return false;
    }
    try {
      const parsedUser = JSON.parse(userItem);
      if (!parsedUser || !parsedUser.username) {
        // console.error("Username tidak ditemukan dalam user data");
        return false;
      }
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp && payload.exp < currentTime) {
          // console.error("Token sudah expired");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return false;
        }
      }
      return { token, user: parsedUser };
    } catch (e) {
      // console.error("Error parsing user data:", e);
      return false;
    }
  };

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const auth = validateToken();
      if (!auth) {
        setError("Token tidak valid. Silakan login ulang.");
        setLoading(false); 
        return;
      }
      
      const { token, user } = auth;
      const username = user.username;
      
      console.log('Fetching products for username:', username);
      console.log('Using token:', token.substring(0, 20) + '...');

      // Using the main branch's logic for fetching products, but with API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/products/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 401) {
          setError("Session expired atau token tidak valid. Silakan login ulang.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else if (response.status === 404) {
          setError("Endpoint tidak ditemukan. Periksa URL API.");
        } else if (response.status === 500) {
          try {
            const errorObj = JSON.parse(errorText);
            setError(`Server error: ${errorObj.error || errorObj.message || 'Internal server error'}`);
          } catch (parseErr) {
            setError(`Server error (500): ${errorText}`);
          }
        } else {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        setLoading(false); 
        return;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        setError('Server tidak mengembalikan data JSON yang valid');
        setLoading(false); 
        return;
      }

      const text = await response.text();
      if (!text.trim()) {
        setProdukList([]);
        setLoading(false); 
        return;
      }

      const data = JSON.parse(text);
      let products = [];
      if (Array.isArray(data)) {
        products = data;
      } else if (data.data && Array.isArray(data.data)) {
        products = data.data;
      } else if (data.products && Array.isArray(data.products)) {
        products = data.products;
      } else if (data.result && Array.isArray(data.result)) {
        products = data.result;
      } else {
        setError("Format data dari server tidak sesuai yang diharapkan");
        setLoading(false); 
        return;
      }
      setProdukList(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Tidak dapat terhubung ke server. Pastikan server berjalan");
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleTambahProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const auth = validateToken();
      if (!auth) {
        setError("Session expired. Silakan login ulang.");
        return;
      }
      
      const { token, user } = auth;

      if (!formData.name.trim() || !formData.category.trim() || !formData.unit_price || !formData.stock) {
        alert("Semua field harus diisi!");
        return;
      }

      const unitPrice = parseInt(formData.unit_price);
      const stock = parseInt(formData.stock);
      
      if (isNaN(unitPrice) || unitPrice <= 0) {
        alert("Harga harus berupa angka yang valid dan lebih dari 0!");
        return;
      }
      
      if (isNaN(stock) || stock < 0) {
        alert("Stok harus berupa angka yang valid dan tidak boleh negatif!");
        return;
      }

      const produkData = {
        name: formData.name.trim(),
        category: formData.category.trim(),
        unit_price: unitPrice,
        stock: stock,
        username: user.username
      };

      console.log('Sending product data:', produkData);

      // Using the main branch's logic for adding products, but with API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/products/create`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(produkData)
      });

      console.log('Create response status:', response.status);
      const responseText = await response.text();
      console.log('Create raw response:', responseText);

      if (!response.ok) {
        if (response.status === 401) {
          setError("Session expired atau token tidak valid. Silakan login ulang.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        throw new Error(`Gagal menambahkan produk: ${response.status} - ${responseText}`);
      }

      setFormData({ name: "", category: "", unit_price: "", stock: "" });
      await fetchProduk();
      alert("Produk berhasil ditambahkan!");
      
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Gagal menambahkan produk: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) {
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const auth = validateToken();
      if (!auth) {
        setError("Session expired. Silakan login ulang.");
        return;
      }
      const { token } = auth;
      
      // Using the main branch's logic for deleting products, but with API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Gagal menghapus produk: ${response.status} - ${text}`);
      }
      setProdukList(produkList.filter((produk) => produk.id !== id));
      alert("Produk berhasil dihapus!");
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(`Gagal menghapus produk: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const [editProdukId, setEditProdukId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    category: "",
    unit_price: "",
    stock: 0,
  });

  const handleEdit = (produk) => {
    setEditProdukId(produk.id);
    setEditFormData({ ...produk }); 
  };
  
  const handleSimpan = async () => {
    try {
      setLoading(true);
      setError(null);
      const auth = validateToken();
      if (!auth) {
        setError("Session expired. Silakan login ulang.");
        return;
      }
      const { token } = auth;
      if (!editFormData.name || editFormData.name.trim() === '') {
        alert('Nama produk tidak boleh kosong!'); return;
      }
      if (!editFormData.category || editFormData.category.trim() === '') {
        alert('Kategori tidak boleh kosong!'); return;
      }
      if (editFormData.unit_price === undefined || editFormData.unit_price === null || editFormData.unit_price === '') {
        alert('Harga tidak boleh kosong!'); return;
      }
      if (editFormData.stock === undefined || editFormData.stock === null || editFormData.stock === '') {
        alert('Stock tidak boleh kosong!'); return;
      }
      const unitPriceNum = parseFloat(editFormData.unit_price);
      const stockNum = parseInt(editFormData.stock);
      if (isNaN(unitPriceNum) || unitPriceNum < 0) {
        alert('Harga harus berupa angka yang valid dan tidak boleh negatif!'); return;
      }
      if (isNaN(stockNum) || stockNum < 0) {
        alert('Stock harus berupa angka yang valid dan tidak boleh negatif!'); return;
      }
      const updateData = {
        name: editFormData.name.trim(),
        category: editFormData.category.trim(),
        unit_price: unitPriceNum,
        stock: stockNum
      };
      
      // Using the main branch's approach for endpoint, but with API_BASE_URL and correct products endpoint
      const response = await fetch(`${API_BASE_URL}/api/products/${editProdukId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      const responseText = await response.text();
      if (!response.ok) {
        try {
          const errorObj = JSON.parse(responseText);
          throw new Error(`Gagal update produk: ${response.status} - ${JSON.stringify(errorObj)}`);
        } catch (parseErr) {
          throw new Error(`Gagal update produk: ${response.status} - ${responseText}`);
        }
      }
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseErr) {
        throw new Error('Response dari server tidak valid');
      }
      const updatedProductFromResult = result.product || result.data || result;
      const finalUpdatedProduct = { ...updatedProductFromResult, id: editProdukId };
      setProdukList(produkList.map((item) =>
          item.id === editProdukId ? finalUpdatedProduct : item
      ));
      setEditProdukId(null);
      setEditFormData({ name: "", category: "", unit_price: "", stock: 0, id: "" });
      alert("Produk berhasil diupdate!");
    } catch (err) {
      console.error("Error updating product:", err);
      setError(`Gagal menyimpan perubahan: ${err.message}`);
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrement = () => {
    setEditFormData((prev) => ({ ...prev, stock: (parseInt(prev.stock, 10) || 0) + 1 }));
  };
  
  const handleDecrement = () => {
    setEditFormData((prev) => ({
      ...prev,
      stock: (parseInt(prev.stock, 10) || 0) > 0 ? (parseInt(prev.stock, 10) || 0) - 1 : 0,
    }));
  };

  const handleRetry = () => {
    fetchProduk();
  };

  const handleHariBaru = async () => {
    if (!manualDate) {
      alert("Silakan pilih tanggal untuk snapshot 'Hari Baru'.");
      return;
    }
    if (produkList.length === 0) {
      alert("Tidak ada produk untuk diproses.");
      return;
    }
    if (!confirm(`Yakin ingin menyimpan snapshot stok untuk tanggal ${manualDate} ke dalam histori?`)) {
      return;
    }
    setLoadingHariBaru(true);
    setError(null);
    const auth = validateToken();
    if (!auth) {
      setError("Session expired. Silakan login ulang.");
      setLoadingHariBaru(false);
      return;
    }
    const { token } = auth;
    const dateString = manualDate;
    const productIds = produkList.map(p => p.id);

    try {
      // Using API_BASE_URL and the correct endpoint for "Hari Baru" (record daily stocks)
      const response = await fetch(`${API_BASE_URL}/api/stocks/record-daily`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: dateString,
          productIds: productIds,
        }),
      });

      const responseText = await response.text(); // Get text first for better error reporting

      if (!response.ok) {
        let errorMessage = responseText;
        if (response.status === 401) {
          setError("Session expired atau token tidak valid. Silakan login ulang.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          try {
            const errorObj = JSON.parse(responseText);
            errorMessage = errorObj.message || responseText;
          } catch (e) {
            // Keep responseText as errorMessage
          }
          setError(`Gagal memproses "Hari Baru": ${errorMessage}`);
        }
        throw new Error(`Gagal memproses "Hari Baru": Status ${response.status} - ${errorMessage}`);
      }
      
      alert(`Snapshot stok untuk tanggal ${dateString} berhasil disimpan untuk ${productIds.length} produk!`);
      setManualDate('');
    } catch (err) {
      console.error('Error processing "Hari Baru":', err);
      if (!error) setError(`Gagal memproses "Hari Baru": ${err.message}`);
    } finally {
      setLoadingHariBaru(false);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-[50px] relative px-4 pb-10">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-10">Manajemen Stok</h1>
      
        {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <strong>Error:</strong> {error}
            </div>
            <button
              onClick={handleRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}

      {(loading || loadingHariBaru) && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
          <div>Loading... {loadingHariBaru && '(Proses Hari Baru)'}</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-[#96ADD6] font-semibold mb-2">+ Tambah Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text" name="name" placeholder="Nama Produk" value={formData.name} onChange={handleChange}
            disabled={loading || loadingHariBaru}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="text" name="category" placeholder="Kategori" value={formData.category} onChange={handleChange}
            disabled={loading || loadingHariBaru}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="number" name="unit_price" placeholder="Harga" value={formData.unit_price} onChange={handleChange}
            disabled={loading || loadingHariBaru}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="number" name="stock" placeholder="Jumlah" value={formData.stock} onChange={handleChange}
            disabled={loading || loadingHariBaru}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
        </div>
        <div className="flex items-center gap-4 mb-4">
            <button
                onClick={handleTambahProduk}
                disabled={loading || loadingHariBaru}
                className="text-[#96ADD6] text-[14px] bg-[#F2D7D3] px-6 py-1 rounded-3xl hover:bg-[#F9B8AF] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
        </div>

        <div className="mt-6 border-t pt-6">
            <h2 className="text-[#00408C] font-semibold mb-3 text-lg">Snapshot Stok Harian (Hari Baru)</h2>
            <div className="flex items-end gap-4">
                <div>
                    <label htmlFor="manualDateInput" className="block text-sm font-medium text-gray-700 mb-1">
                        Pilih Tanggal Snapshot:
                    </label>
                    <input
                        type="date"
                        id="manualDateInput"
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        disabled={loading || loadingHariBaru}
                        className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl focus:ring-[#00408C] focus:border-[#00408C] disabled:opacity-50"
                    />
                </div>
                <button
                    onClick={handleHariBaru}
                    disabled={loadingHariBaru || loading || produkList.length === 0 || !manualDate}
                    className="text-white text-[14px] bg-green-500 px-6 py-2 rounded-3xl hover:bg-green-600 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingHariBaru ? 'Memproses...' : 'Simpan Snapshot (Hari Baru)'}
                </button>
            </div>
             {manualDate && produkList.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                    Akan menyimpan snapshot stok untuk {produkList.length} produk pada tanggal {manualDate}.
                </p>
            )}
        </div>
      </div>

      {!loading && !error && produkList.length === 0 && (
        <div className="max-w-6xl mx-auto text-center py-8">
          <p className="text-gray-500">Belum ada produk. Tambahkan produk pertama Anda!</p>
        </div>
      )}

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
                    <tr key={produk.id} className="bg-white">
                        <td className="py-2 px-4 text-center text-black w-[60px]">{produk.id}</td>
                        {editProdukId === produk.id ? (
                        <>
                            <td className="py-2 px-4">
                            <input type="text" value={editFormData.name} onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                disabled={loading || loadingHariBaru}
                                className=" w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black disabled:opacity-50"
                            /></td>
                            <td className="py-2 px-4">
                            <input type="text" value={editFormData.category} onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                disabled={loading || loadingHariBaru}
                                className="w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black disabled:opacity-50"
                            /></td>
                            <td className="py-2 px-4 text-center">
                            <input type="number" value={editFormData.unit_price} onChange={(e) => setEditFormData({ ...editFormData, unit_price: e.target.value })}
                                disabled={loading || loadingHariBaru}
                                className="w-[150px] border border-gray-300 px-2 py-0 rounded-2xl text-black text-center disabled:opacity-50"
                            /></td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center items-center gap-2 w-[100px]">
                                <button onClick={handleDecrement} disabled={loading || loadingHariBaru} className="px-2 text-md bg-[#96ADD6] rounded-2xl disabled:opacity-50">-</button>
                                <span>{editFormData.stock}</span>
                                <button onClick={handleIncrement} disabled={loading || loadingHariBaru} className="px-2 text-md bg-[#96ADD6] rounded-2xl disabled:opacity-50">+</button>
                            </div></td>
                            <td className="py-2 px-4 text-center">
                            <div className="flex justify-center gap-2 w-[200px]">
                                <button onClick={handleSimpan} disabled={loading || loadingHariBaru}
                                className="bg-[#F9B8AF] hover:bg-[#96ADD6] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >{loading ? 'Menyimpan...' : 'Simpan'}</button>
                                <button onClick={() => setEditProdukId(null)} disabled={loading || loadingHariBaru}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >Batal</button>
                            </div></td>
                        </>
                        ) : (
                        <>
                            <td className="py-2 px-4 text-black">{produk.name}</td>
                            <td className="py-2 px-4 text-black">{produk.category}</td>
                            <td className="py-2 px-4 text-center text-black">Rp {(Number(produk.unit_price) || 0).toLocaleString()}</td>
                            <td className="py-2 px-4 text-center text-black">{Number(produk.stock) || 0}</td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center gap-2">
                                <button onClick={() => handleEdit(produk)} disabled={loading || loadingHariBaru}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >Edit</button>
                                <button onClick={() => handleDelete(produk.id)} disabled={loading || loadingHariBaru}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >Hapus</button>
                            </div></td>
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