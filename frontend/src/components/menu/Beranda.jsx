export default function Beranda() {
    return (
      <section className="flex flex-col items-center justify-center text-center px-6 md:px-20 flex-1 bg-white">
        <h1 className="text-5xl md:text-6xl font-bold text-[#00408C] mt-22 mb-6 leading-tight">
          Selamat Datang di <br />
          <span className="text-6xl md:text-7xl font-extrabold text-[#00408C]">GrowMate!</span>
        </h1>
        <p className="text-base md:text-base text-black max-w-lg mb-22 leading-8">
          Teman para pengusaha mikro, kecil, dan menengah (UMKM)
          untuk optimalkan penjualan dengan memahami tren pasar,
          analisis penjualan, dan manajemen stok.
        </p>
      </section>
    );
  }
  