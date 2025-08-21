// File: src/app/admin/page.js
// File: src/app/admin/page.js
"use client";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await fetch(
          "https://campus-exchange-fastapi-production.up.railway.app/api/v1/admin/moderation"
        );
        const data = await res.json();
        setQueue(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching moderation queue:", err);
        setQueue([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  if (loading) return <p className="text-center">Loading moderation queue...</p>;
  if (!queue.length)
    return <p className="text-center text-gray-500">No items pending moderation.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Admin Moderation Queue</h1>
      <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left">Title</th>
            <th className="px-4 py-2 text-left">Category</th>
            <th className="px-4 py-2 text-left">Seller</th>
            <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {queue.map((item) => (
            <tr key={item.id} className="border-t border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2">{item.title}</td>
              <td className="px-4 py-2">{item.category}</td>
              <td className="px-4 py-2">{item.seller_name}</td>
              <td className="px-4 py-2">{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
