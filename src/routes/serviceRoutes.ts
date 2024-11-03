import { Router } from "express";
import {
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/ServiceController";

const router = Router();

router.post("/create", createService);
router.get("/", getAllServices);
router.get("/:id", getServiceById);
router.put("/edit/:id", updateService);
router.delete("/:id", deleteService);

export default router;
