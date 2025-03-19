import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-white">
      {/* Bagian Kiri - Teks */}
      <div className="text-center md:text-left max-w-lg ml-6">
        <h3 className="text-lg text-gray-500 font-medium">Selamat Datang di</h3>
        <h1 className="text-5xl font-extrabold text-blue-900 mt-2">GrowMate</h1>
        <p className="text-gray-700 mt-4">
          Teman para pengusaha mikro, kecil, dan menengah (UMKM) untuk
          optimalkan penjualan dengan memahami tren pasar, analisis penjualan,
          dan manajemen stok.
        </p>
        {/* Tombol Daftar dan Masuk */}
        <div className="mt-6 flex gap-4 justify-center md:justify-start">
          <Link
            href="/daftar"
            className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition"
          >
            Daftar
          </Link>
          <Link
            href="/masuk"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition"
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
