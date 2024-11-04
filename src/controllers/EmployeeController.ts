import { Request, Response } from 'express';
import { registerEmployee, loginEmployee, changePassword, deleteEmployee, getAllEmployees, getEmployeeId, updateEmployeeInfo, updateEmployeeStatus } from '../services/EmployeeService';

// เพิ่มช่าง
export const registerResponseEmployee = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const employee = await registerEmployee(username, email, password);
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ!', employee });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลงทะเบียน', error: error.message });
  }
};

// เข้าสู่ระบบ
export const loginResponseEmployee = async (req: Request, res: Response) => {
  const { email_username, password } = req.body;

  try {
    const employee = await loginEmployee(email_username, password);
    res.status(200).json({ message: 'เข้าสู่ระบบสำเร็จ!', employee });
  } catch (error: any) {
    res.status(400).json({ message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ', error: error.message });
  }
};

// แสดงช่างทั้งหมด
export const getResponseAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await getAllEmployees();
    res.status(200).json(employees);
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่าง', error: error.message });
  }
};

// ดึงข้อมูลช่างตาม ID
export const getResponseEmployeeId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const employee = await getEmployeeId(id);
    res.status(200).json(employee);
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลช่าง', error: error.message });
  }
};

// อัปเดตช่าง (ชื่อ, อีเมล, รูปโปรไฟล์)
export const updateReponseEmployeeInfo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, imgSrc } = req.body;

  try {
    const updatedEmployee = await updateEmployeeInfo(id, username, email, imgSrc);
    res.status(200).json({ message: 'อัปเดตข้อมูลช่างสำเร็จ!', updatedEmployee });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลช่าง', error: error.message });
  }
};

// อัปเดตสถานะว่าง/ไม่ว่างของช่าง
export const updateResponseEmployeeStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updatedEmployee = await updateEmployeeStatus(id, status);
    res.status(200).json({ message: 'อัปเดตสถานะสำเร็จ!', updatedEmployee });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตสถานะช่าง', error: error.message });
  }
};

// เปลี่ยนรหัสผ่านของช่าง
export const updateResponsePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const updatedEmployee = await changePassword(id, password);
    res.status(200).json({ message: 'เปลี่ยนรหัสผ่านสำเร็จ!', updatedEmployee });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน', error: error.message });
  }
};

// ลบช่างตาม ID
export const deleteReponseEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteEmployee(id);
    res.status(200).json({ message: 'ลบช่างสำเร็จ!' });
  } catch (error) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบช่าง', error });
  }
};