import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      {/* Bagian Kiri - Teks */}
      <div className="text-center md:text-center max-w-lg ml-10">
        <h3 className="text-[#96ADD6] text-[20px] font-semibold">Selamat Datang di</h3>
        <h1 className="text-7xl font-extrabold text-[#00408C] mt-4">GrowMate</h1>
        <p className="text-black mt-6 font-nunito leading-6">
          Teman para pengusaha mikro, kecil, dan menengah (UMKM) untuk
          optimalkan penjualan dengan memahami tren pasar, analisis penjualan,
          dan manajemen stok.
        </p>
        {/* Tombol Daftar dan Masuk */}
        <div className="mt-8 flex gap-16 md:justify-center h-[45px]">
          <Link
            href="/Daftar"
            className="flex items-center bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] font-bold px-8 py-4 rounded-[20px] transition"
          >
            Daftar
          </Link>
          <Link
            href="/Masuk"
            className="flex items-center bg-[#F2D7D3] hover:bg-[#F9B8AF] text-[#E85234] font-bold px-8 py-4 rounded-[20px] transition"
          >
            Masuk
          </Link>
        </div>
      </div>

      {/* Bagian Kanan - Gambar */}
      <div className="mr-14 md:mt-0">
        <Image
          src="/assets/Landing.jpg" // Gantilah dengan path gambar sesuai struktur project kamu
          alt="Ilustrasi UMKM"
          width={400}
          height={350}
          className="rounded-[100px] shadow-lg"
        />
      </div>
    </section>
  );
};

export default HeroSection;
