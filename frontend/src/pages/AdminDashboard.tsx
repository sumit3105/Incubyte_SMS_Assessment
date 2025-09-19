import { useEffect, useState } from "react";
import api from "../api/client";
import type { Sweet } from "../types";
import toast from "react-hot-toast";
import SweetForm from "../components/SweetForm";

export default function AdminDashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);

  async function fetchSweets() {
    try {
      setLoading(true);
      const res = await api.get("/sweets");
      setSweets(res.data);
    } catch {
      toast.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  }

  async function restockSweet(id: string, qty: number) {
    try {
      const res = await api.post(`/inventory/${id}/restock`, { quantity: qty });
      setSweets((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );
      toast.success("Sweet restocked successfully 🎉");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Restock failed ❌");
    }
  }

  async function deleteSweet(id: string) {
    try {
      await api.delete(`/sweets/${id}`);
      setSweets((prev) => prev.filter((s) => s._id !== id));
      toast.success("Sweet deleted 🗑️");
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Delete failed ❌");
    }
  }

  useEffect(() => {
    fetchSweets();
  }, []);

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

      {/* Add / Edit Sweet Form */}
      <SweetForm
        existingSweet={editingSweet}
        onSuccess={() => {
          setEditingSweet(null);
          fetchSweets();
        }}
      />

      <h3 className="text-xl font-semibold mt-8 mb-4">Inventory</h3>
      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sweets.map((sweet) => (
            <div key={sweet._id} className="border p-4 rounded shadow-sm">
              <h4 className="font-bold">{sweet.name}</h4>
              <p>Category: {sweet.category}</p>
              <p>Price: ₹{sweet.price}</p>
              <p>Stock: {sweet.quantity}</p>

              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => restockSweet(sweet._id, 5)}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Restock +5
                </button>
                <button
                  onClick={() => setEditingSweet(sweet)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSweet(sweet._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
