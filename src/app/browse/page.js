'use client';

import { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import CategoryTabs from '../components/CategoryTabs';
import ListingGrid from '../components/ListingGrid';
import Pagination from '../components/Pagination';

// Dummy data with free Unsplash images (optimized for smaller file sizes)
const dummyListings = [
  {
    id: 1,
    title: 'Calculus Textbook',
    category: 'Textbooks',
    price: 50,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80',
    description: 'Gently used, 3rd edition.',
  },
  {
    id: 2,
    title: 'Gaming Laptop',
    category: 'Electronics',
    price: 800,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    description: 'High-performance laptop.',
  },
  {
    id: 3,
    title: 'Dorm Sofa',
    category: 'Furniture',
    price: 150,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    description: 'Comfortable, like new.',
  },
  {
    id: 4,
    title: 'Physics 101 Book',
    category: 'Textbooks',
    price: 40,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
    description: 'Required for Physics 101.',
  },
  {
    id: 5,
    title: 'Wireless Headphones',
    category: 'Electronics',
    price: 120,
    image: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=400&q=80',
    description: 'Noise-canceling, barely used.',
  },
  {
    id: 6,
    title: 'Desk Chair',
    category: 'Furniture',
    price: 75,
    image: 'https://images.unsplash.com/photo-1616627562706-0c4d5eaa8b80?w=400&q=80',
    description: 'Ergonomic chair, good condition.',
  },
  {
    id: 7,
    title: 'Chemistry Textbook',
    category: 'Textbooks',
    price: 60,
    image: 'https://images.unsplash.com/photo-1526318472351-bc6f236f519d?w=400&q=80',
    description: 'Latest edition, no markings.',
  },
  {
    id: 8,
    title: 'Smartphone',
    category: 'Electronics',
    price: 300,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    description: 'Unlocked, great condition.',
  },
];

export default function Browse() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState('');
  const [query, setQuery] = useState('');
  const pageSize = 6;

  const fetchListings = () => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      let filteredListings = dummyListings;
      if (category) {
        filteredListings = filteredListings.filter(
          (listing) => listing.category === category
        );
      }
      if (query) {
        filteredListings = filteredListings.filter((listing) =>
          listing.title.toLowerCase().includes(query.toLowerCase())
        );
      }

      const start = (currentPage - 1) * pageSize;
      const paginatedListings = filteredListings.slice(start, start + pageSize);

      setListings(paginatedListings);
      setTotalPages(Math.ceil(filteredListings.length / pageSize));
      setIsLoading(false);
    }, 500);
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
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Browse Listings</h1>
      <SearchBar onSearch={handleSearch} />
      <CategoryTabs activeCategory={category} onCategoryChange={handleCategoryChange} />
      <ListingGrid listings={listings} isLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
