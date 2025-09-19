import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const schema = z.object({
  name: z.string().min(2, "Name too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});
type FormData = z.infer<typeof schema>;

export default function Register() {
  const { register: signup, user } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    try {
      await signup(data.name, data.email, data.password);
      toast.success("Signup successful 🎉");
      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.msg) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <input {...register("name")} placeholder="Name" className="input w-full" />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register("email")} placeholder="Email" className="input w-full" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div>
          <input {...register("password")} type="password" placeholder="Password" className="input w-full" />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <button className="btn-primary w-full">Register</button>
      </form>
    </div>
  );
}
