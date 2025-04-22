"use client";

import React, { useState } from "react";

export default function PopUpProfil({ onClose }) {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
      username: "growmateteam",
      email: "gmteam@example.com",
      phone: "081234567890",
      address: "Jl. Grafika, UGM",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSave = () => {
        // Simulasi update ke database
        console.log("Data yang disimpan:", user);
        // TODO: Panggil fungsi update ke database di sini (misal pakai fetch/axios)
    
        setIsEditing(false);
      };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black opacity-80 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Popup card */}
      <div className="fixed inset-0 flex justify-center items-center z-50">
        <div
          className="bg-white rounded-lg p-10 w-[90%] max-w-[400px] shadow-xl relative"
          onClick={(e) => e.stopPropagation()} // biar klik di dalam popup gak nutup
        >
          <button
            className="absolute top-3 right-5 text-gray-500 hover:text-red-500 text-xl font-bold"
            onClick={onClose}
          >
            ✕
          </button>
          <h2 className="text-center text-2xl font-bold text-[#00408C] mb-4">
            Profil
          </h2>
          <div className="space-y-4">
          {["username", "email", "phone", "address"].map((field) => (
              <div key={field}>
                <label className="text-xs font-bold text-black capitalize">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className={`w-full px-4 py-2 border rounded-4xl text-[14px] text-black transition-all duration-300 ${
                    isEditing ? "focus:outline-none focus:ring-2 focus:ring-[#F2D7D3]-300 focus:border-pink-400" : ""
                  }`}                                  
                />
              </div>
            ))}
            <div className="flex justify-between mt-8">
              <button
                className={`${
                  isEditing ? "bg-[#F9B8AF]" : "bg-[#F2D7D3]"
                } text-[#E85234] px-8 py-0 rounded-3xl h-9 font-semibold`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? "Simpan" : "Edit"}
              </button>
              <button
                className="bg-[#F2D7D3] text-[#E85234] px-8 py-0 rounded-3xl h-9 font-semibold"
                onClick={onClose}
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
