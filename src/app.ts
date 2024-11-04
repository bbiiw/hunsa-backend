import express, { Application } from 'express';
import cors from 'cors';
import EmployeeRoutes from './routes/EmployeeRoutes';
import ServiceRoutes from './routes/ServiceRoutes';
import ReservationRoutes from './routes/ReservationRoutes';

const app: Application = express();

// Middleware
app.use(express.json()); // รับส่งข้อมูลแบบ JSON
app.use(cors()); // frontend เรียกใช้ API ได้

// Base Routes
app.use('/api/employees', EmployeeRoutes);
app.use('/api/services', ServiceRoutes);
app.use('/api/reservation', ReservationRoutes);

// TEST API
app.get('/api/', (req, res) => {
    res.send('Welcome to API BACKEND');
});

export default app;
