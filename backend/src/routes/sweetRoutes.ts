import { Router } from "express";
import Sweet from "../models/Sweet";
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// Add sweet (Admin only)
router.post("/", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all sweets
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const sweets = await Sweet.find();
  res.json(sweets);
});

// Search sweets
router.get("/search", authMiddleware, async (req: AuthRequest, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  const query: any = {};

  if (name) query.name = { $regex: name as string, $options: "i" };
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const sweets = await Sweet.find(query);
  res.json(sweets);
});

// Update sweet (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sweet);
});

// Delete sweet (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req: AuthRequest, res) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ msg: "Sweet deleted" });
});

export default router;
