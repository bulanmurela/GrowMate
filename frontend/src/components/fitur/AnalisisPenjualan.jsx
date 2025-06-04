"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Helper function to validate token (ensure this is correctly imported or defined if it's in a shared utility)
const validateToken = () => {
  const token = localStorage.getItem('token');
  const userItem = localStorage.getItem('user');
  if (!token || !userItem) {
    console.error("validateToken: Token or user not found in localStorage.");
    return false;
  }
  try {
    const parsedUser = JSON.parse(userItem);
    if (!parsedUser || !parsedUser.username) { 
      console.error("validateToken: Username not found in parsed user data.");
      return false;
    }
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        console.error("validateToken: Token has expired.");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
    }
    return { token, user: parsedUser };
  } catch (e) {
    console.error("validateToken: Error parsing user data or token.", e);
    return false;
  }
};

const AnalisisPenjualan = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [forecastData, setForecastData] = useState([]);
  const [combinedChartData, setCombinedChartData] = useState([]);
  const [produktData, setProduktData] = useState([]); // Stores array of product name strings
  const [selectedProduct, setSelectedProduct] = useState("all"); // Stores the selected product name string
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  const lineColors = ["#E85234", "#00408C", "#5B9BD5", "#8BC34A", "#9C27B0", "#FFC107", "#795548"];
  const forecastLineColors = ["#F4A261", "#2A9D8F", "#E9C46A", "#264653", "#E76F51", "#A2D2FF", "#8D6E63"];

  const fetchAnalisisData = async (fetchForecasts = true) => {
    console.log("fetchAnalisisData called, fetchForecasts:", fetchForecasts);
    setLoading(true);
    setError(null);
    const auth = validateToken();
    if (!auth) {
      setError("Sesi tidak valid atau telah berakhir. Silakan login ulang.");
      setLoading(false);
      return;
    }
    const { token } = auth;

    try {
      // Fetch product names only if not already fetched
      if (produktData.length === 0) {
        console.log("Fetching product names from /api/analysis/product-names...");
        const API_URL = process.env.REACT_APP_API_URL;
        const res = await fetch(`${API_URL}/api/analysis/product-names`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log("Product names response status:", res.status);
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Gagal mengambil daftar produk: ${res.status} - ${errorText}`);
        }
        const productNamesData = await res.json();
        console.log("Product names data received:", productNamesData);
        setProduktData(Array.isArray(productNamesData) ? productNamesData : []);
      }

      console.log("Fetching historical stock trends from /api/analysis/stock-trends...");
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(`${API_URL}/api/analysis/stock-trends`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      console.log("Historical Stock trends response status:", trendsResponse.status);
      if (!trendsResponse.ok) {
        const errorText = await trendsResponse.text();
        throw new Error(`Gagal mengambil data tren stok: ${trendsResponse.status} - ${errorText}`);
      }
      const historicalTrendsData = await trendsResponse.json();
      console.log("Historical Stock trends data received:", historicalTrendsData);
      setHistoricalData(historicalTrendsData && Array.isArray(historicalTrendsData) ? historicalTrendsData : []);

      if (fetchForecasts) {
        console.log("Fetching forecast data from /api/analysis/forecast-data...");
        const API_URL = process.env.REACT_APP_API_URL;
        const res = await fetch(`${API_URL}/api/analysis/forecast-data`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log("Forecast data response status:", forecastResponse.status);
        if (!forecastResponse.ok) {
          const errorText = await forecastResponse.text();
          if (forecastResponse.status === 404) { // Handle 404 gracefully for forecast data
            console.warn("Forecast data not found (404), setting to empty array.");
            setForecastData([]);
          } else {
             throw new Error(`Gagal mengambil data forecast: ${forecastResponse.status} - ${errorText}`);
          }
        } else {
            const forecastJsonData = await forecastResponse.json();
            console.log("Forecast data received:", forecastJsonData);
            setForecastData(forecastJsonData && Array.isArray(forecastJsonData) ? forecastJsonData : []);
        }
      }

    } catch (err) {
      console.error("Gagal mengambil data analisis:", err);
      setError(err.message || "Gagal mengambil data analisis.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalisisData(true); // Fetch both historical and forecast initially
  }, []);

  // Effect to combine historical and forecast data
  useEffect(() => {
    console.log("Attempting to combine data. Historical:", historicalData, "Forecast:", forecastData);
    const combined = new Map();

    (historicalData || []).forEach(dayData => {
      const dateStr = dayData.date;
      if (!dateStr) return; // Skip if date is missing
      if (!combined.has(dateStr)) {
        combined.set(dateStr, { date: dateStr });
      }
      const entry = combined.get(dateStr);
      Object.keys(dayData).forEach(key => {
        if (key !== 'date') {
          entry[key] = dayData[key];
        }
      });
    });

    (forecastData || []).forEach(dayData => {
      const dateStr = dayData.date;
      if (!dateStr) return; // Skip if date is missing
      if (!combined.has(dateStr)) {
        combined.set(dateStr, { date: dateStr });
      }
      const entry = combined.get(dateStr);
      Object.keys(dayData).forEach(key => {
        if (key !== 'date') {
          entry[key] = dayData[key]; // Keys like "ProductName_forecast"
        }
      });
    });
    
    const sortedCombinedData = Array.from(combined.values()).sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log("Combined and sorted chart data:", sortedCombinedData);
    setCombinedChartData(sortedCombinedData);

  }, [historicalData, forecastData]);


  const calculateTotalStock = () => {
    if (!historicalData || historicalData.length === 0 || !produktData || produktData.length === 0) return 0;
    let total = 0;
    if (selectedProduct === "all") {
      historicalData.forEach(dayData => {
        produktData.forEach(productName => {
          total += Number(dayData[productName]) || 0;
        });
      });
    } else {
      if (produktData.includes(selectedProduct)) {
        historicalData.forEach(dayData => {
          total += Number(dayData[selectedProduct]) || 0;
        });
      }
    }
    return total;
  };

  const handleGenerateForecasts = async () => {
    if (!confirm("Memulai proses pembuatan forecast bisa memakan waktu beberapa menit dan akan menimpa forecast sebelumnya. Lanjutkan?")) {
        return;
    }
    setLoadingForecast(true);
    setError(null);
    const auth = validateToken();
    if (!auth) {
        setError("Sesi tidak valid. Silakan login ulang.");
        setLoadingForecast(false);
        return;
    }
    const { token } = auth;
    try {
        console.log("Calling /api/forecast/generate to trigger Python script");
        const API_URL = process.env.REACT_APP_API_URL;
        const res = await fetch(`${API_URL}/api/forecast/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("Forecast generation response status:", response.status);
        const result = await res.json();
        if (!res.ok) {
            console.error("Forecast generation failed:", result);
            throw new Error(result.message || result.error || `Gagal membuat forecast: Status ${response.status}`);
        }
        console.log("Forecast generation successful:", result);
        alert(result.message || "Proses forecast berhasil dijalankan! Data forecast akan dimuat ulang.");
        fetchAnalisisData(true); // Refetch all data including new forecasts
        
    } catch (err) {
        console.error('Error generating forecasts:', err);
        const errorMessage = err.message || "Terjadi kesalahan saat membuat forecast.";
        setError(`Error saat membuat forecast: ${errorMessage}`);
    } finally {
        setLoadingForecast(false);
    }
  };

  const xAxisDataKey = combinedChartData.length > 0 && combinedChartData[0] ? 
                       Object.keys(combinedChartData[0]).find(key => key.toLowerCase() === 'date' || key.toLowerCase() === 'day') || 'date' 
                       : 'date';

  return (
    <div className="min-h-screen bg-white pt-12 relative px-4 pb-10">
      <h1 className="text-4xl font-extrabold text-center text-[#00408C] mb-6">Analisis & Prediksi Stok</h1>

      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          Error: {error} <button onClick={() => fetchAnalisisData(true)} className="ml-4 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Coba Lagi</button>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-6 text-center">
        <button
          onClick={handleGenerateForecasts}
          disabled={loadingForecast || loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50"
        >
          {loadingForecast ? "Memproses Forecast..." : "Generate Forecast Mingguan"}
        </button>
      </div>

      <div className="flex justify-center mb-6">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          disabled={loading || loadingForecast || produktData.length === 0}
          className="text-[#96ADD6] text-sm border rounded-2xl px-4 py-2 w-64 disabled:opacity-50 bg-white"
        >
          <option value="all">Semua Produk</option>
          {produktData.map((productName) => (
            <option key={productName} value={productName}>
              {productName}
            </option>
          ))}
        </select>
      </div>

      {(loading && combinedChartData.length === 0) && <div className="text-center py-10">Loading data...</div>}
      {!loading && combinedChartData.length === 0 && !error && (
        <div className="text-center text-gray-500 py-10">
            Tidak ada data historis atau prediksi untuk ditampilkan. <br/> 
            Pastikan Anda telah mencatat stok harian dan men-generate forecast.
        </div>
      )}
      
      {!loading && combinedChartData.length > 0 && (
        <div className="max-w-6xl mx-auto bg-white p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={combinedChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xAxisDataKey}
                tick={{fontSize: 12}}
              />
              <YAxis 
                label={{ value: 'Jumlah Stok', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                tickFormatter={(value) => Number.isInteger(value) ? value : ''}
                allowDecimals={false}
              />
              <Tooltip />
              <Legend />
              {selectedProduct === "all" ? (
                produktData.flatMap((productName, index) => [
                  combinedChartData.some(d => d.hasOwnProperty(productName)) && ( // Check if historical dataKey exists
                    <Line 
                      key={`${productName}_hist`} type="monotone" dataKey={productName} name={`${productName} (Histori)`}
                      stroke={lineColors[index % lineColors.length]} activeDot={{ r: 6 }} strokeWidth={2} connectNulls 
                    />
                  ),
                  combinedChartData.some(d => d.hasOwnProperty(`${productName}_forecast`)) && ( // Check if forecast dataKey exists
                    <Line 
                      key={`${productName}_forecast`} type="monotone" dataKey={`${productName}_forecast`} name={`${productName} (Prediksi)`}
                      stroke={forecastLineColors[index % forecastLineColors.length]} strokeDasharray="5 5"
                      activeDot={{ r: 6 }} strokeWidth={2} connectNulls 
                    />
                  )
                ].filter(Boolean)) // Filter out null/false values if a key doesn't exist
              ) : (
                produktData.includes(selectedProduct) && [
                    combinedChartData.some(d => d.hasOwnProperty(selectedProduct)) && (
                        <Line 
                            key={`${selectedProduct}_hist`} type="monotone" dataKey={selectedProduct} name={`${selectedProduct} (Histori)`}
                            stroke={lineColors[produktData.indexOf(selectedProduct) % lineColors.length || 0]}
                            activeDot={{ r: 6 }} strokeWidth={2} connectNulls
                        />
                    ),
                    combinedChartData.some(d => d.hasOwnProperty(`${selectedProduct}_forecast`)) && (
                        <Line 
                            key={`${selectedProduct}_forecast`} type="monotone" dataKey={`${selectedProduct}_forecast`} name={`${selectedProduct} (Prediksi)`}
                            stroke={forecastLineColors[produktData.indexOf(selectedProduct) % forecastLineColors.length || 0]}
                            strokeDasharray="5 5" activeDot={{ r: 6 }} strokeWidth={2} connectNulls
                        />
                    )
                ].filter(Boolean) // Filter out null/false values
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {!loading && combinedChartData.length > 0 && ( // Show summary only if there's data
        <div className="max-w-6xl mx-auto mt-6 mb-4">
          <div className="bg-[#F2EEE9] p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-[#00408C] mb-2">Ringkasan Data Historis</h3>
            <p className="text-sm">
              Total Stok Tercatat ({selectedProduct === "all" ? "Semua Produk" : selectedProduct}): <strong>{calculateTotalStock()}</strong> unit
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalisisPenjualan;