// src/app/components/ListingCard.js
import Image from 'next/image';

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{listing.category}</p>
        <p className="text-lg font-bold text-blue-500">${listing.price}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{listing.description}</p>
      </div>
    </div>
  );
}