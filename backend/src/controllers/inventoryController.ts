import { Response } from "express";
import Sweet from "../models/Sweet";
import { AuthRequest } from "../middleware/authMiddleware";

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) return res.status(404).json({ msg: "Sweet not found" });

    if (sweet.quantity < quantity) {
      return res.status(400).json({ msg: "Not enough stock available" });
    }

    sweet.quantity -= quantity;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const sweet = await Sweet.findById(req.params.id);

    if (!sweet) return res.status(404).json({ msg: "Sweet not found" });

    sweet.quantity += quantity;
    await sweet.save();

    res.json(sweet);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};
