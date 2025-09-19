import { useEffect, useState } from "react";
import api from "../api/client";
import type { Sweet } from "../types";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [purchaseQty, setPurchaseQty] = useState<{ [key: string]: number }>({});

  async function fetchSweets() {
    try {
      setLoading(true);
      const res = await api.get("/sweets");
      setSweets(res.data);
    } catch {
      toast.error("Failed to load sweets ❌");
    } finally {
      setLoading(false);
    }
  }

  async function purchaseSweet(id: string) {
    const qty = purchaseQty[id] || 1;

    if (qty <= 0) {
      toast.error("Quantity must be at least 1 ❌");
      return;
    }

    try {
      const res = await api.post(`/inventory/${id}/purchase`, { quantity: qty });
      setSweets((prev) =>
        prev.map((s) => (s._id === id ? res.data : s))
      );
      toast.success(`Purchased ${qty} sweet(s) 🎉`);
      setPurchaseQty((prev) => ({ ...prev, [id]: 1 })); // reset qty
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Purchase failed ❌");
    }
  }

  useEffect(() => {
    fetchSweets();
  }, []);

  const filtered = sweets.filter((s) =>
    [s.name, s.category].some((field) =>
      field.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Customer Dashboard</h2>

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search sweets by name or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
        />
      </div>

      {loading ? (
        <p>Loading sweets...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((sweet) => (
            <div
              key={sweet._id}
              className="border p-4 rounded-lg shadow hover:shadow-md transition"
            >
              <h4 className="text-lg font-bold mb-2">{sweet.name}</h4>
              <p className="text-gray-600">Category: {sweet.category}</p>
              <p className="text-gray-600">Price: ₹{sweet.price}</p>
              <p
                className={`${
                  sweet.quantity > 0 ? "text-green-600" : "text-red-600"
                } font-medium`}
              >
                Stock: {sweet.quantity}
              </p>

              {sweet.quantity > 0 && (
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    max={sweet.quantity}
                    value={purchaseQty[sweet._id] || 1}
                    onChange={(e) =>
                      setPurchaseQty((prev) => ({
                        ...prev,
                        [sweet._id]: Number(e.target.value),
                      }))
                    }
                    className="w-16 border rounded px-2 py-1"
                  />
                  <button
                    onClick={() => purchaseSweet(sweet._id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Buy
                  </button>
                </div>
              )}

              {sweet.quantity === 0 && (
                <button
                  disabled
                  className="mt-3 w-full px-3 py-2 rounded bg-gray-400 text-gray-200 cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
