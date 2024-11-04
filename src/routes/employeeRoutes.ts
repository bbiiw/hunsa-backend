import { Router } from 'express';
import { 
    deleteReponseEmployee, 
    getResponseAllEmployees, 
    getResponseEmployeeId, 
    loginResponseEmployee, 
    registerResponseEmployee, 
    updateReponseEmployeeInfo, 
    updateResponseEmployeeStatus, 
    updateResponsePassword 
} from '../controllers/EmployeeController';

const router = Router();

router.post('/register', registerResponseEmployee);
router.post('/login', loginResponseEmployee);
router.get('/', getResponseAllEmployees);
router.get('/:id', getResponseEmployeeId)
router.put('/:id/edit', updateReponseEmployeeInfo);
router.put('/:id/status', updateResponseEmployeeStatus);
router.put('/:id/password', updateResponsePassword);
router.delete('/:id', deleteReponseEmployee);

export default router;
