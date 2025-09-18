import Sweet from "../models/Sweet";
import { AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";

export const addSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.json(sweet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
}

export const getAllSweets = async (req: AuthRequest, res: Response) => {
  const sweets = await Sweet.find();
  res.json(sweets);
}

export const searchSweets = async (req: AuthRequest, res: Response) => {
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
}

export const updateSweet = async (req: AuthRequest, res: Response) => {
  const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(sweet);
}

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  await Sweet.findByIdAndDelete(req.params.id);
  res.json({ msg: "Sweet deleted" });
}