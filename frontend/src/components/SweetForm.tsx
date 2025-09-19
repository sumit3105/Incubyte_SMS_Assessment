import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/client";
import toast from "react-hot-toast";
import type { Sweet } from "../types";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  category: z.string().min(2, "Category required"),
  price: z.number().positive("Price must be positive"),
  quantity: z.number().int().nonnegative("Quantity must be >= 0"),
});
type FormData = z.infer<typeof schema>;

export default function SweetForm({
  existingSweet,
  onSuccess,
}: {
  existingSweet?: Sweet | null;
  onSuccess: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: existingSweet || {
      name: "",
      category: "",
      price: 0,
      quantity: 0,
    },
  });

  async function onSubmit(data: FormData) {
    try {
      if (existingSweet) {
        await api.put(`/sweets/${existingSweet._id}`, data);
        toast.success("Sweet updated ✅");
      } else {
        await api.post("/sweets", data);
        toast.success("Sweet added ✅");
      }
      reset();
      onSuccess();
    } catch (err: any) {
      toast.error(err.response?.data?.msg || "Operation failed ❌");
    }
  }

  return (
    <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">
        {existingSweet ? "Edit Sweet" : "Add New Sweet"}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 max-w-lg">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Sweet Name
          </label>
          <input
            {...register("name")}
            placeholder="Enter sweet name (e.g., Gulab Jamun)"
            className="input"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Category
          </label>
          <input
            {...register("category")}
            placeholder="Enter category (e.g., Traditional, Chocolate)"
            className="input"
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Price (₹)
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            placeholder="Enter price"
            className="input"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Quantity
          </label>
          <input
            type="number"
            {...register("quantity", { valueAsNumber: true })}
            placeholder="Enter quantity in stock"
            className="input"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
          )}
        </div>

        <button className="btn-primary">
          {existingSweet ? "Update Sweet" : "Add Sweet"}
        </button>
      </form>
    </div>
  );
}
