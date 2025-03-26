const Footer = () => {
    return (
      <footer
        className="relative bg-white text-white py-8 bg-no-repeat bg-top"
        style={{
          backgroundImage: "url('/assets/Wave.png')",
          backgroundSize: "cover",
        }}
      >
        {/* Footer Content */}
        <div className="container mx-auto mt-4 px-12 flex justify-between items-center">
          {/* Logo & Nama */}
          <div className="flex items-center gap-2">
            <img src="/assets/LOGO.png" alt="Growmate" className="w-[150px]" />
          </div>
  
          {/* Copyright */}
          <p className="text-[#F2EEE9] text-sm">
            2025 &copy; Copyright
          </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  