import { Router } from 'express';
import { createResponseService, deleteReponseService, getReponseAllServices, getResponseServiceId, updateResponseService } from '../controllers/ServiceController';


const router = Router();

router.post('/create', createResponseService);
router.get('/', getReponseAllServices);
router.get('/:id', getResponseServiceId);
router.put('/:id/edit', updateResponseService);
router.delete('/:id', deleteReponseService);

export default router;
