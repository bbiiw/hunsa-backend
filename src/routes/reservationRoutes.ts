import { Router } from 'express';
import { bookReservation, getReservationsByEmployee, cancelBooking, confirmReservation } from '../controllers/ReservationController';

const router = Router();

router.post('/book', bookReservation);
router.get('/:employeeId', getReservationsByEmployee)
router.put('/:reservationId/confirm', confirmReservation);
router.get('/:reservationId/cancel', cancelBooking);

export default router;

