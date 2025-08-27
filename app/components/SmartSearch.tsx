"use client";
import axios from "axios";
import Image from "next/image";
import React, { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  color: string;
  image: string;
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
            placeholder="Search naturally e.g. cheap blue shoes under 5000"
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
            ? results.map((rslt) => (
                <div
                  key={rslt.id}
                  className="border rounded-lg p-3 shadow hover:shadow-lg transition"
                >
                  <Image
                    src={rslt.image}
                    alt={rslt.name}
                    width={100}
                    height={100}
                    className="w-full h-40 object-cover rounded-md mb-2"
                  />
                  <h2 className="font-semibold">{rslt.name}</h2>
                  <p className="text-sm text-gray-500">{rslt.category}</p>
                  <p className="text-blue-600 font-bold">Rs. {rslt.price}</p>
                </div>
              ))
            : !loading && <p className="text-gray-500">No results found</p>}
        </div>
      </div>
    </div>
  );
};

export default SmartSearch;
