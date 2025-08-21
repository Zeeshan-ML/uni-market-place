// File: src/app/my-listings/page.js
"use client";
import { useEffect, useState } from "react";
import ListingCard from "@/app/components/ListingCard";

export default function MyListingsPage() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active"); // tab state

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(
          "https://campus-exchange-fastapi-production.up.railway.app/listings/mine"
        );
        const data = await res.json();
        console.log("API response:", data); // ✅ debug the structure

        // Ensure listings is always an array
        if (Array.isArray(data)) {
          setListings(data);
        } else if (data && Array.isArray(data.listings)) {
          setListings(data.listings);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
        setListings([]); // fallback to avoid crash
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) return <p className="text-center">Loading your listings...</p>;

  if (!listings || listings.length === 0)
    return (
      <p className="text-center text-gray-500">
        You haven’t posted any listings yet.
      </p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Listings</h1>

      {/* Tab buttons */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab("active")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "active"
              ? "border-blue-500 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab("sold")}
          className={`px-4 py-2 border-b-2 ${
            activeTab === "sold"
              ? "border-blue-500 font-semibold"
              : "border-transparent text-gray-500"
          }`}
        >
          Sold
        </button>
      </div>

      {/* Tab content */}
      {activeTab === "active" && (
        <div className="grid gap-4 md:grid-cols-3">
          {listings
            .filter((item) => item.status === "active")
            .map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
        </div>
      )}

      {activeTab === "sold" && (
        <div className="grid gap-4 md:grid-cols-3">
          {listings
            .filter((item) => item.status === "sold")
            .map((item) => (
              <ListingCard key={item.id} listing={item} />
            ))}
        </div>
      )}
    </div>
  );
}
