import { Router } from "express";
import { purchaseSweet, restockSweet } from "../controllers/inventoryController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/:id/purchase", authMiddleware, purchaseSweet);
router.post("/:id/restock", authMiddleware, adminMiddleware, restockSweet);

export default router;
