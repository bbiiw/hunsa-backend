import express, { Application } from "express";
import cors from "cors";
import reservationRoutes from "./routes/reservationRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import serviceRoutes from "./routes/serviceRoutes";

const app: Application = express();

// Middleware
app.use(express.json()); // รับส่งข้อมูลแบบ JSON
app.use(cors()); // frontend เรียกใช้ API ได้

// Base Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/api/services", serviceRoutes);

export default app;
