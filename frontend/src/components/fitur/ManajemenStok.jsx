"use client";

import { useState, useEffect } from "react";

export default function ManajemenStok() {
  const [produkList, setProdukList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit_price: "",
    stock: "",
  });

  const fetchProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validasi token
      const auth = validateToken();
      if (!auth) {
        setError("Token tidak valid. Silakan login ulang.");
        return;
      }
      
      const { token, user } = auth;
      const username = user.username;
      
      console.log('Fetching products for username:', username);
      console.log('Using token:', token.substring(0, 20) + '...');

      const response = await fetch(`http://localhost:5000/api/products/${username}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      console.log('Fetch response status:', response.status);
      console.log('Fetch response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Fetch error response:', errorText);
        
        // Handle specific error codes
        if (response.status === 401) {
          setError("Session expired atau token tidak valid. Silakan login ulang.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        } else if (response.status === 404) {
          setError("Endpoint tidak ditemukan. Periksa URL API.");
          return;
        } else if (response.status === 500) {
          // Parse error message from server
          try {
            const errorObj = JSON.parse(errorText);
            setError(`Server error: ${errorObj.error || errorObj.message || 'Internal server error'}`);
          } catch (parseErr) {
            setError(`Server error (500): ${errorText}`);
          }
          return;
        }
        
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      // Check content type
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Response bukan JSON:', text);
        setError('Server tidak mengembalikan data JSON yang valid');
        return;
      }

      const text = await response.text();
      console.log('Fetch raw response:', text);

      // Handle empty response
      if (!text.trim()) {
        console.warn("Response kosong dari server");
        setProdukList([]);
        return;
      }

      const data = JSON.parse(text);
      console.log("Data produk dari server:", data);

      // Handle different response formats
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
        console.warn("Format data tidak dikenali:", data);
        setError("Format data dari server tidak sesuai yang diharapkan");
        return;
      }

      console.log("Final products array:", products);
      setProdukList(products);

    } catch (error) {
      console.error("Error fetching products:", error);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setError("Tidak dapat terhubung ke server. Pastikan server berjalan di http://localhost:5000");
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

  // Helper function untuk validasi token
  const validateToken = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
      console.error("Token atau user tidak ditemukan di localStorage");
      return false;
    }
    
    try {
      const parsedUser = JSON.parse(user);
      if (!parsedUser.username) {
        console.error("Username tidak ditemukan dalam user data");
        return false;
      }
      
      // Check token expiration
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
          console.error("Token sudah expired");
          return false;
        }
      }
      
      return { token, user: parsedUser };
    } catch (e) {
      console.error("Error parsing user data:", e);
      return false;
    }
  };

  const handleTambahProduk = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validasi token
      const auth = validateToken();
      if (!auth) {
        setError("Session expired. Silakan login ulang.");
        return;
      }
      
      const { token, user } = auth;

      // Validasi input
      if (!formData.name.trim() || !formData.category.trim() || !formData.unit_price || !formData.stock) {
        alert("Semua field harus diisi!");
        return;
      }

      // Validasi angka
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

      const response = await fetch('http://localhost:5000/api/products/create', {
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
        console.error('Create error response:', responseText);
        
        if (response.status === 401) {
          setError("Session expired atau token tidak valid. Silakan login ulang.");
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return;
        }
        
        throw new Error(`Gagal menambahkan produk: ${response.status} - ${responseText}`);
      }

      // Reset form
      setFormData({ name: "", category: "", unit_price: "", stock: "" });
      
      // Refresh data produk
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
      
      // Fix: Use correct endpoint for deleting specific product
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
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

      // Update state without fetching again
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
    
    console.log('=== HANDLE SIMPAN DEBUG ===');
    console.log('Edit Product ID:', editProdukId);
    console.log('Edit Form Data:', editFormData);
    
    const auth = validateToken();
    if (!auth) {
      setError("Session expired. Silakan login ulang.");
      return;
    }

    const { token } = auth;

    // Validasi data sebelum dikirim
    if (!editFormData.name || editFormData.name.trim() === '') {
      alert('Nama produk tidak boleh kosong!');
      return;
    }

    if (!editFormData.category || editFormData.category.trim() === '') {
      alert('Kategori tidak boleh kosong!');
      return;
    }

    if (!editFormData.unit_price || editFormData.unit_price === '') {
      alert('Harga tidak boleh kosong!');
      return;
    }

    if (editFormData.stock === undefined || editFormData.stock === null || editFormData.stock === '') {
      alert('Stock tidak boleh kosong!');
      return;
    }

    // Validasi tipe data
    const unitPriceNum = parseFloat(editFormData.unit_price);
    const stockNum = parseInt(editFormData.stock);

    if (isNaN(unitPriceNum) || unitPriceNum < 0) {
      alert('Harga harus berupa angka yang valid dan tidak boleh negatif!');
      return;
    }

    if (isNaN(stockNum) || stockNum < 0) {
      alert('Stock harus berupa angka yang valid dan tidak boleh negatif!');
      return;
    }

    // Prepare data dengan validasi yang ketat
    const updateData = {
      name: editFormData.name.trim(),
      category: editFormData.category.trim(),
      unit_price: unitPriceNum,
      stock: stockNum
    };

    console.log('Sending update data:', updateData);
    console.log('Update URL:', `http://localhost:5000/api/products/${editProdukId}`);

    const response = await fetch(`http://localhost:5000/api/products/${editProdukId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    console.log('Update response status:', response.status);
    console.log('Update response headers:', [...response.headers.entries()]);

    // Handle response
    const responseText = await response.text();
    console.log('Update raw response:', responseText);

    if (!response.ok) {
      console.error('Update error response:', responseText);
      
      // Parse error jika memungkinkan
      try {
        const errorObj = JSON.parse(responseText);
        throw new Error(`Gagal update produk: ${response.status} - ${JSON.stringify(errorObj)}`);
      } catch (parseErr) {
        throw new Error(`Gagal update produk: ${response.status} - ${responseText}`);
      }
    }

    // Parse successful response
    let result;
    try {
      result = JSON.parse(responseText);
      console.log('Parsed update result:', result);
    } catch (parseErr) {
      console.error('Error parsing success response:', parseErr);
      throw new Error('Response dari server tidak valid');
    }

    // Update state
    const updatedProduct = result.product || result;
    console.log('Updated product data:', updatedProduct);

    const updatedList = produkList.map((item) =>
      item.id === editProdukId ? updatedProduct : item
    );
    
    setProdukList(updatedList);
    setEditProdukId(null);
    
    // Reset edit form
    setEditFormData({
      name: "",
      category: "",
      unit_price: "",
      stock: 0,
    });

    alert("Produk berhasil diupdate!");
    
  } catch (err) {
    console.error('=== HANDLE SIMPAN ERROR ===');
    console.error("Error updating product:", err);
    console.error("Error stack:", err.stack);
    
    setError(`Gagal menyimpan perubahan: ${err.message}`);
    alert(`Error: ${err.message}`);
  } finally {
    setLoading(false);
  }
};

  const handleIncrement = () => {
    setEditFormData((prev) => ({ ...prev, stock: prev.stock + 1 }));
  };
  
  const handleDecrement = () => {
    setEditFormData((prev) => ({
      ...prev,
      stock: prev.stock > 0 ? prev.stock - 1 : 0,
    }));
  };

  // Function to retry fetching data
  const handleRetry = () => {
    fetchProduk();
  };

  return (
    <div className="min-h-screen bg-white pt-[50px] relative px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-10">Manajemen Stok</h1>
      
      {/* Error Display */}
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

      {/* Loading Indicator */}
      {loading && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-lg text-center">
          <div>Loading...</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-8">
        <h2 className="text-[#96ADD6] font-semibold mb-2">+ Tambah Produk</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Produk"
            value={formData.name}
            onChange={handleChange}
            disabled={loading}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="text"
            name="category"
            placeholder="Kategori"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="number"
            name="unit_price"
            placeholder="Harga"
            value={formData.unit_price}
            onChange={handleChange}
            disabled={loading}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
          <input
            type="number"
            name="stock"
            placeholder="Jumlah"
            value={formData.stock}
            onChange={handleChange}
            disabled={loading}
            className="border border-black text-black text-[14px] px-3 py-2 rounded-2xl disabled:opacity-50"
          />
        </div>
        <button
          onClick={handleTambahProduk}
          disabled={loading}
          className="text-[#96ADD6] text-[14px] bg-[#F2D7D3] px-6 py-1 rounded-3xl hover:bg-[#F9B8AF] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {/* Table or Empty State */}
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

                        {/* Kondisi jika sedang di-edit */}
                        {editProdukId === produk.id ? (
                        <>
                            <td className="py-2 px-4">
                            <input
                                type="text"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                className=" w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black"
                            />
                            </td>
                            <td className="py-2 px-4">
                            <input
                                type="text"
                                value={editFormData.category}
                                onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                className="w-[230px] border border-gray-300 px-2 py-0 rounded-2xl text-black"
                            />
                            </td>
                            <td className="py-2 px-4 text-center">
                            <input
                                type="number"
                                value={editFormData.unit_price}
                                onChange={(e) => setEditFormData({ ...editFormData, unit_price: e.target.value })}
                                className="w-[150px] border border-gray-300 px-2 py-0 rounded-2xl text-black text-center"
                            />
                            </td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center items-center gap-2 w-[100px]">
                                <button onClick={handleDecrement} className="px-2 text-md bg-[#96ADD6] rounded-2xl">-</button>
                                <span>{editFormData.stock}</span>
                                <button onClick={handleIncrement} className="px-2 text-md bg-[#96ADD6] rounded-2xl">+</button>
                            </div>
                            </td>
                            <td className="py-2 px-4 text-center">
                            <div className="flex justify-center gap-2 w-[200px]">
                                <button
                                onClick={handleSimpan}
                                disabled={loading}
                                className="bg-[#F9B8AF] hover:bg-[#96ADD6] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >
                                {loading ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                onClick={() => setEditProdukId(null)}
                                disabled={loading}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                >
                                Batal
                                </button>
                            </div>
                            </td>
                        </>
                        ) : (
                        <>
                            <td className="py-2 px-4 text-black">{produk.name}</td>
                            <td className="py-2 px-4 text-black">{produk.category}</td>
                            <td className="py-2 px-4 text-center text-black">
                              Rp {(produk.unit_price || 0).toLocaleString()}
                            </td>
                            <td className="py-2 px-4 text-center text-black">{produk.stock || 0}</td>
                            <td className="py-2 px-4 text-center text-black">
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handleEdit(produk)}
                                    disabled={loading}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
                                    >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(produk.id)}
                                    disabled={loading}
                                    className="bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] px-4 py-1 rounded-full text-xs font-semibold disabled:opacity-50"
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