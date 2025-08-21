// File: src/app/components/ListingCard.js
// src/app/components/ListingCard.js
"use client";
import Image from "next/image";
import { Heart } from "lucide-react";
import { useState } from "react";

export default function ListingCard({ listing, showFavoriteToggle = false }) {
  const [isFavorite, setIsFavorite] = useState(listing.is_favorite || false);

  const toggleFavorite = async () => {
    try {
      await fetch(
        `https://campus-exchange-fastapi-production.up.railway.app/favorites/${listing.id}`,
        { method: "POST" }
      );
      setIsFavorite((prev) => !prev);
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative">
      {/* Favorite button (optional) */}
      {showFavoriteToggle && (
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 p-1 rounded-full bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-600 transition"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
            }`}
          />
        </button>
      )}

      {/* Image */}
      <div className="relative h-40">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {listing.category}
        </p>
        <p className="text-lg font-bold text-blue-500">${listing.price}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
          {listing.description}
        </p>
      </div>
    </div>
  );
}
