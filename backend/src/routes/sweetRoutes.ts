import { Router } from "express";
import Sweet from "../models/Sweet";
import { authMiddleware, adminMiddleware, AuthRequest } from "../middleware/authMiddleware";
import { addSweet, getAllSweets, searchSweets, updateSweet, deleteSweet } from "../controllers/sweetController";

const router = Router();

// Add sweet (Admin only)
router.post("/", authMiddleware, adminMiddleware, addSweet);

// Get all sweets
router.get("/", authMiddleware, getAllSweets);

// Search sweets
router.get("/search", authMiddleware, searchSweets);

// Update sweet (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateSweet);

// Delete sweet (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteSweet);

export default router;
