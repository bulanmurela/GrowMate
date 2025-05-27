"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PopUpProfil({ onClose }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({
      username: "",
      email: "",
      phone: "",
      address: "",
    });

    useEffect(() => {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setUser((prev) => ({
            ...prev,
            username: parsed.username || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            address: parsed.address || "",
          }));
        } catch (e) {
          console.error("Gagal parse user:", e);
        }
      }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
      };
    
      const handleSave = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            throw new Error("Token tidak ditemukan, silakan login kembali");
          }

          // Debug: Log the data being sent
          console.log("Data being sent:", {
            username: user.username,
            email: user.email,
            phone: user.phone,
            address: user.address
          });

          const response = await fetch("/api/users/update", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              username: user.username,
              email: user.email,
              phone: user.phone || "", // handle null value
              address: user.address || ""
            })
          });

          // Debug: Log the raw response
          console.log("Raw response:", response);

          // First check if response is OK before parsing JSON
          if (!response.ok) {
            const errorData = await response.text(); // Get response as text first
            try {
              // Try to parse as JSON if possible
              const jsonError = JSON.parse(errorData);
              throw new Error(jsonError.message || "Update gagal tanpa pesan error");
            } catch {
              // If not JSON, use the raw text
              throw new Error(errorData || "Update gagal tanpa pesan error");
            }
          }


          const data = await response.json();
      
          if (!response.ok) {
            throw new Error(data.message || "Update gagal tanpa pesan error");
          }
      
          localStorage.setItem("user", JSON.stringify({
              username: response.data.username,
              email: response.data.email,
              phone: response.data.phone,
              address: response.data.address,
          }));

          
          setIsEditing(false);
          alert("Profil berhasil diperbarui!");
      
        } catch (error) {
          console.error("Detail error:", error);
          alert(`Gagal menyimpan: ${error.message}`);
        }
      };

      const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
        onClose();
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
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
