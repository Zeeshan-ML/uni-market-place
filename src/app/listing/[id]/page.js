// File: src/app/listing/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ImageCarousel from '@/components/ImageCarousel';
import ProductDetails from '@/components/ProductDetails';
import SellerLink from '@/components/SellerLink';
import EmptyState from '@/components/EmptyState';

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://web-production-0077.up.railway.app/api/v1/listings/${id}`
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || 'Failed to fetch listing');
        }
        const data = await res.json();

        setListing({
          id: data.id,
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
          images: data.images || [],
          status: data.status,
          sellerId: data.owner_id,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) return <div className="container mx-auto p-4">Loading...</div>;
  if (error) return <EmptyState title="Error" description={error} action={null} />;

  return (
    <div className="container mx-auto p-4">
      {listing ? (
        <>
          <ImageCarousel images={listing.images} />
          <ProductDetails listing={listing} />
          <SellerLink
            sellerId={listing.sellerId}
            sellerName={`Seller #${listing.sellerId}`}
          />
        </>
      ) : (
        <EmptyState
          title="No Listing"
          description="The requested listing could not be found."
          action={null}
        />
      )}
    </div>
  );
}
