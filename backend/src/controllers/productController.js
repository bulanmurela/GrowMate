const Product = require('../models/Product');
const StockChange = require('../models/StockChanges');
const pool = require('../config/database');

// Create a product
const createProduct = async (req, res) => {
  const { name, unit_price, stock, category } = req.body;
  const username = req.user?.username; // dari token / middleware auth

  if (!username) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const newProduct = await Product.create({
      name,
      unit_price,
      stock,
      category,
      username,
    });
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    console.error('Error creating product:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all products - USING SEQUELIZE
const getAllProducts = async (req, res) => {
  try {
    // Frontend mengirim username sebagai route parameter, bukan query
    const { username } = req.params;
    
    console.log('Getting products for username:', username);
    console.log('Request user from token:', req.user);
    
    // Validasi username
    if (!username) {
      return res.status(400).json({ 
        error: 'Username parameter is required',
        message: 'Username tidak ditemukan dalam request'
      });
    }

    // Verifikasi bahwa user yang request adalah pemilik data
    if (req.user && req.user.username !== username) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'Anda tidak memiliki akses ke data user lain'
      });
    }

    // Ambil produk menggunakan Sequelize
    const products = await Product.findAll({ 
      where: { username },
      order: [['id', 'ASC']],
      raw: true // Menghasilkan plain object, bukan instance Sequelize
    });

    console.log('Found products:', products?.length || 0);
    console.log('Products data:', products);

    // Response dengan data yang sudah clean
    res.status(200).json(products || []);
    
  } catch (err) {
    console.error('Error getting products:', err);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({ 
      error: 'Gagal mengambil produk',
      message: err.message,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// Delete product by ID - USING SEQUELIZE
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const username = req.user?.username;

  try {
    console.log('Deleting product ID:', id, 'for user:', username);

    // Cari produk yang akan dihapus dengan Sequelize
    const whereCondition = { id: parseInt(id) };
    if (username) {
      whereCondition.username = username; // Tambahkan ownership check
    }

    const product = await Product.findOne({ where: whereCondition });

    if (!product) {
      return res.status(404).json({ 
        message: 'Produk tidak ditemukan atau Anda tidak memiliki akses' 
      });
    }

    // Hapus produk
    await product.destroy();

    console.log('Product deleted:', product.toJSON());
    res.status(200).json({ 
      message: 'Produk berhasil dihapus',
      deleted_product: product.toJSON()
    });
    
  } catch (err) {
    console.error('Error deleting product:', err.message);
    res.status(500).json({ 
      message: 'Gagal menghapus produk', 
      error: err.message 
    });
  }
};

// Update product by ID - USING SEQUELIZE (FIXED)
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, unit_price, stock, category } = req.body;
  const username = req.user?.username;

  try {

    // Validasi ID produk
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        message: 'ID produk tidak valid'
      });
    }

    // Validasi input - pastikan semua field ada dan valid
    if (!name || name.trim() === '') {
      return res.status(400).json({
        message: 'Nama produk tidak boleh kosong'
      });
    }

    if (!category || category.trim() === '') {
      return res.status(400).json({
        message: 'Kategori tidak boleh kosong'
      });
    }

    if (unit_price === undefined || unit_price === null || unit_price === '') {
      return res.status(400).json({
        message: 'Unit price harus diisi'
      });
    }

    if (stock === undefined || stock === null || stock === '') {
      return res.status(400).json({
        message: 'Stock harus diisi'
      });
    }

    // Validasi dan konversi tipe data
    const parsedUnitPrice = parseFloat(unit_price);
    const parsedStock = parseInt(stock);
    const parsedId = parseInt(id);

    if (isNaN(parsedUnitPrice) || parsedUnitPrice < 0) {
      return res.status(400).json({
        message: 'Unit price harus berupa angka yang valid dan tidak boleh negatif'
      });
    }

    if (isNaN(parsedStock) || parsedStock < 0) {
      return res.status(400).json({
        message: 'Stock harus berupa angka yang valid dan tidak boleh negatif'
      });
    }

    // Siapkan data yang sudah divalidasi
    const cleanName = name.trim();
    const cleanCategory = category.trim();

    // PERBAIKAN UTAMA: Gunakan Sequelize untuk update
    const whereCondition = { id: parsedId };
    if (username) {
      whereCondition.username = username; // Tambahkan ownership check
    }

    console.log('Where condition:', whereCondition);

    // Cari produk yang akan diupdate
    const product = await Product.findOne({ where: whereCondition });

    if (!product) {
      return res.status(404).json({ 
        message: 'Produk tidak ditemukan atau Anda tidak memiliki akses untuk mengupdate produk ini' 
      });
    }

    console.log('Found product to update:', product.toJSON());

    // Update produk menggunakan Sequelize
    const updatedProduct = await product.update({
      name: cleanName,
      unit_price: parsedUnitPrice,
      stock: parsedStock,
      category: cleanCategory
    });

    console.log('Product updated successfully:', updatedProduct.toJSON());

    res.status(200).json({ 
      message: 'Produk berhasil diperbarui', 
      product: updatedProduct.toJSON() 
    });
    
    if (!product) {
      return res.status(404).json({ error: "Produk tidak ditemukan" });
    }

    // Simpan stok lama
    const oldStock = product.stock;

    // Update produk
    await product.update({
      name,
      category_id,
      unit_price,
      stock,
    });

    // Jika stok berubah, catat ke tabel stock_changes
    if (oldStock !== stock) {
      await StockChange.create({
        product_id: product.id,
        username,
        old_stock: oldStock,
        new_stock: stock,
        change: stock - oldStock,
      });
    }
    
  } catch (err) {
    
    // res.status(500).json({ 
    //   message: 'Gagal memperbarui produk', 
    //   error: err.message,
    //   debug_info: {
    //     error_name: err.name,
    //     received_params: req.body,
    //     product_id: req.params.id
    //   }
    // });
  }
};

// Export sebagai CommonJS
module.exports = {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct
};