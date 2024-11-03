import { Router } from "express";
import {
  registerEmployee,
  loginEmployee,
  getAllEmployees,
  updateEmployeeStatus,
  updateEmployee,
  changePassword,
} from "../controllers/EmployeeController";

const router = Router();

router.post("/register", registerEmployee);
router.post("/login", loginEmployee);
router.get("/", getAllEmployees);
router.put("/:id/status", updateEmployeeStatus);
router.put("/:id/edit", updateEmployee);
router.put("/:id/password", changePassword);

export default router;
