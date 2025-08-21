// File: src/app/favorites/page.js
"use client";
import { useEffect, useState } from "react";
import ListingCard from "@/app/components/ListingCard";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // Step 1: Fetch favorites (just IDs)
        const res = await fetch(
          "https://campus-exchange-fastapi-production.up.railway.app/api/v1/favorites/"
        );
        const favs = await res.json();
        console.log("Favorites API response:", favs);

        // Step 2: Ensure the response is an array
        if (!Array.isArray(favs)) {
          console.error("Favorites API did not return an array:", favs);
          setFavorites([]);
          return;
        }

        // Step 3: Fetch full listing details for each favorite
        const listings = await Promise.all(
          favs.map(async (fav) => {
            try {
              const resListing = await fetch(
                `https://campus-exchange-fastapi-production.up.railway.app/api/v1/listings/${fav.listing_id}`
              );
              return await resListing.json();
            } catch (err) {
              console.error("Error fetching listing details:", err);
              return null;
            }
          })
        );

        // Step 4: Filter out any null responses
        setFavorites(listings.filter(Boolean));
      } catch (err) {
        console.error("Error fetching favorites:", err);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <p className="text-center">Loading your favorites...</p>;

  if (!favorites || favorites.length === 0)
    return (
      <p className="text-center text-gray-500">
        No favorites yet. Add items to wishlist!
      </p>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Favorites</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {favorites.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            showFavoriteToggle
          />
        ))}
      </div>
    </div>
  );
}
