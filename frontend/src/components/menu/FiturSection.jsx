import Link from "next/link";

export default function Fitur() {
    return (
      <section className="flex flex-col items-center text-center px-6 md:px-20 py-6 bg-white">
        {/* Judul */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#00408C] mb-6">Fitur</h1>
        
        {/* Kontainer Fitur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-5xl mb-12">
          {/* Fitur 1: Tren Penjualan */}
          <Link href="/tren-penjualan" className="group">
            <div className="bg-white shadow-lg rounded-[20px] p-8 border border-black flex flex-col items-center">
                <img src="/assets/TrenFeature.jpg" alt="Tren Penjualan" className="w-24 h-24 mb-4 rounded-full" />
                <h3 className="text-[20px] font-semibold text-black">Tren Penjualan</h3>
                <p className="text-black text-[14px] font-light leading-8 mt-2 ml-4 mr-4">
                Informasi tren penjualan produk dari berbagai sosial media berdasarkan review, ulasan, atau popularitas.
                </p>
            </div>
          </Link>
  
          {/* Fitur 2: Analisis Penjualan */}
          <Link href="/analisis-penjualan" className="group">
            <div className="bg-white shadow-lg rounded-[20px] p-8 border border-black flex flex-col items-center">
                <img src="/assets/SellingAnalysis.jpg" alt="Analisis Penjualan" className="w-24 h-24 mb-4 rounded-full" />
                <h3 className="text-[20px] font-semibold text-black">Analisis Penjualan</h3>
                <p className="text-black text-[14px] font-light leading-8 mt-2 ml-4 mr-4">
                Analisis data hasil penjualan Anda dan memproyeksikan-nya dalam dashboard interaktif.
                </p>
            </div>
          </Link>
  
          {/* Fitur 3: Manajemen Stok */}
          <Link href="/manajemen-stok" className="group">
            <div className="bg-white shadow-lg rounded-[20px] p-8 border border-black flex flex-col items-center">
                <img src="/assets/StokManage.jpg" alt="Manajemen Stok" className="w-24 h-24 mb-4 rounded-full" />
                <h3 className="text-[20px] font-semibold text-black">Manajemen Stok</h3>
                <p className="text-black text-[14px] font-light leading-8 mt-2 ml-4 mr-4">
                Evaluasi jumlah stok untuk mendapatkan informasi produk yang <i>overstock</i>, <i>understock</i>, dan <i>stockout</i>.
                </p>
            </div>
          </Link>
        </div>
      </section>
    );
  }
  