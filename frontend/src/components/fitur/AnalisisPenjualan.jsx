"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AnalisisPenjualan = () => {
  const [timeSeriesData, setTimeSeriesData] = useState([]);
  const [produktData, setProduktData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [filteredData, setFilteredData] = useState([]);

  // Generate colors for different product lines
  const lineColors = ["#E85234", "#00408C", "#5B9BD5", "#8BC34A", "#9C27B0"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Data produk (hanya 5 produk pertama)
        const produkList = [
          "Masker wawa",
          "Sneakers Retro",
          "Kopi Arabika",
          "Smartwatch Z1",
          "Kaos Polos Oversize"
        ];
        
        // Membuat data dummy untuk 5 hari
        const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];
        
        // Create deliberate sales patterns for each product
        const salesPatterns = {
          "Masker wawa": [350, 280, 420, 380, 450],        // Increasing trend with mid-week dip
          "Sneakers Retro": [200, 320, 380, 410, 390],     // Steady increase with slight drop on Friday
          "Kopi Arabika": [550, 520, 530, 580, 600],       // Consistently high with weekend peak
          "Smartwatch Z1": [180, 210, 190, 280, 320],      // Mid-week boost then weekend peak
          "Kaos Polos Oversize": [400, 380, 350, 390, 450] // U-shaped pattern
        };
        
        // Generate time series data with deliberate patterns
        const generatedData = days.map((day, index) => {
          const dayData = { day };
          
          // Use pre-defined sales patterns
          produkList.forEach(produk => {
            dayData[produk] = salesPatterns[produk][index];
          });
          
          return dayData;
        });
        
        setTimeSeriesData(generatedData);
        setProduktData(produkList);
        
      } catch (err) {
        console.error("Gagal mengambil data tren penjualan:", err);
      }
    };

    fetchData();
  }, []);

  // Filter data based on selected product
  useEffect(() => {
    setFilteredData(timeSeriesData);
  }, [timeSeriesData, selectedProduct]);

  // Calculate total sales for the selected product
  const calculateTotalSales = () => {
    if (timeSeriesData.length === 0) return 0;
    
    if (selectedProduct === "all") {
      // Calculate combined total for all products
      let grandTotal = 0;
      produktData.forEach(product => {
        const productTotal = timeSeriesData.reduce((sum, day) => sum + day[product], 0);
        grandTotal += productTotal;
      });
      return grandTotal;
    } else {
      // Calculate total for selected product
      return timeSeriesData.reduce((sum, day) => sum + day[selectedProduct], 0);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-12 relative px-4">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-6">Tren Penjualan Harian</h1>

      {/* Product Selection Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="text-[#96ADD6] text-sm border rounded-2xl px-4 py-2 w-64"
        >
          <option value="all">Semua Produk</option>
          {produktData.map((produk) => (
            <option key={produk} value={produk}>
              {produk}
            </option>
          ))}
        </select>
      </div>

      {/* Line Chart */}
      <div className="max-w-6xl mx-auto bg-white p-4 rounded-lg shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={filteredData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="day" 
              tick={{fontSize: 12}}
            />
            <YAxis 
              label={{ value: 'Jumlah Penjualan', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
            />
            <Tooltip />
            <Legend />
            {selectedProduct === "all" ? (
              // Show all product lines
              produktData.map((product, index) => (
                <Line 
                  key={product}
                  type="monotone" 
                  dataKey={product} 
                  name={product} 
                  stroke={lineColors[index % lineColors.length]}
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                />
              ))
            ) : (
              // Show only the selected product
              <Line 
                type="monotone" 
                dataKey={selectedProduct} 
                name={selectedProduct} 
                stroke="#E85234"
                activeDot={{ r: 8 }} 
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Info Panel */}
      <div className="max-w-6xl mx-auto mt-6 mb-4">
        <div className="bg-[#F2EEE9] p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-[#00408C] mb-2">Ringkasan Data</h3>
          <p className="text-sm">
            Periode: 5 hari (Senin-Jumat)
          </p>
          <p className="text-sm">
            Total Penjualan {selectedProduct === "all" ? "Semua Produk" : selectedProduct}: <strong>{calculateTotalSales()}</strong> unit
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnalisisPenjualan;