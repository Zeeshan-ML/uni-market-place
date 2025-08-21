"use client";
import { useEffect, useState } from "react";
import { Bell, MessageSquare, CheckCircle, Tag } from "lucide-react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token"); // 🔑 get saved token

        const res = await fetch(
          "https://campus-exchange-fastapi-production.up.railway.app/api/v1/notifications/?skip=0&limit=50&unread_only=false",
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }

        const data = await res.json();
        console.log("Notifications API response:", data);

        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to load notifications.");
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <p className="text-center">Loading notifications...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!notifications.length)
    return <p className="text-center text-gray-500">No notifications yet.</p>;

  const iconMap = {
    message: <MessageSquare className="w-5 h-5 text-blue-500" />,
    offer: <Tag className="w-5 h-5 text-green-500" />,
    verification: <CheckCircle className="w-5 h-5 text-purple-500" />,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {notifications.map((n) => (
          <li key={n.id} className="flex items-center gap-3 py-3">
            {iconMap[n.type] || <Bell className="w-5 h-5 text-gray-500" />}
            <div>
              <p className="font-medium">{n.title}</p>
              <p className="text-sm text-gray-500">{n.message}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
