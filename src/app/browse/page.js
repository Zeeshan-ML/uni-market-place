// File: src/app/browse/page.js
'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ListingGrid from '../components/ListingGrid';
import Pagination from '../components/Pagination';

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const pageSize = 6; // how many results per page

  const fetchListings = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        page_size: pageSize.toString(),
        sort_by: 'created_at',
        sort_order: 'desc',
      });

      if (query) params.append('q', query);
      if (category) params.append('category', category);

      const res = await fetch(
        `https://web-production-0077.up.railway.app/api/v1/listings/search?${params.toString()}`
      );

      if (!res.ok) throw new Error('Failed to fetch listings');
      const data = await res.json();

      // Assuming API returns:
      // {
      //   items: [...],
      //   total: number,
      //   page: number,
      //   page_size: number
      // }

      setListings(data.items || []);
      setTotalPages(Math.ceil((data.total || 0) / pageSize));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [currentPage, category, query]);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Browse Listings
      </h1>

      <SearchBar onSearch={handleSearch} />
      <CategoryTabs
        activeCategory={category}
        onCategoryChange={handleCategoryChange}
      />

      {error && <p className="text-red-500">{error}</p>}

      <ListingGrid listings={listings} isLoading={isLoading} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
