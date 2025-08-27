"use client";
import axios from "axios";
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
const SmartSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    const res = await axios.post("/api/search", { query });
    console.log(res);
    setResults(res.data.results);
    setLoading(false);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔍 Smart Product Search
        </h1>

        {/* Search bar */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search products naturally..."
            className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-medium"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-center text-gray-500">Searching...</p>}

        {/* Results */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {results.length > 0
            ? results.map((p) => (
                <div
                  key={p.id}
                  className="p-4 border rounded-xl shadow-sm bg-gray-50 hover:shadow-md transition"
                >
                  <h2 className="font-semibold text-lg">{p.name}</h2>
                  <p className="text-sm text-gray-500">{p.category}</p>
                  <p className="font-bold text-blue-600 mt-2">Rs {p.price}</p>
                </div>
              ))
            : !loading && (
                <p className="text-center col-span-full text-gray-500">
                  No results found
                </p>
              )}
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
