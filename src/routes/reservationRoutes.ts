import { Router } from "express";
import {
  bookReservation,
  getReservationsByEmployee,
  cancelReservation,
  updateReservationStatus,
} from "../controllers/ReservationController";

const router = Router();

router.post("/book", bookReservation);
router.get("/:employeeId", getReservationsByEmployee);
router.put("/:reservationId/confirm", updateReservationStatus);
router.put("/:reservationId/cancel", cancelReservation);

export default router;
