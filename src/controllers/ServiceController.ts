import { Request, Response } from 'express';
import { addService, getAllServices, getServiceId, updateService, deleteService } from '../services/ServiceService';

// เพิ่มบริการใหม่
export const createResponseService = async (req: Request, res: Response) => {
  const { title, description, price, category, imgSrc } = req.body;

  try {
    const service = await addService(title, description, price, category, imgSrc);
    res.status(201).json({ message: 'เพิ่มบริการสำเร็จ!', service });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มบริการ', error: error.message });
  }
};

// แสดงบริการทั้งหมด
export const getReponseAllServices = async (req: Request, res: Response) => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริการ', error: error.message });
  }
};

// ดึงข้อมูลบริการตาม ID
export const getResponseServiceId = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const service = await getServiceId(id);
    res.status(200).json(service);
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลบริการ', error: error.message });
  }
};

// อัปเดตข้อมูลบริการ
export const updateResponseService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, price, category, imgSrc } = req.body;

  try {
    const updatedService = await updateService(id, title, description, price, category, imgSrc);
    res.status(200).json({ message: 'อัปเดตข้อมูลบริการสำเร็จ!', updatedService });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลบริการ', error: error.message });
  }
};

// ลบบริการตาม ID
export const deleteReponseService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deleteService(id);
    res.status(200).json({ message: 'ลบบริการสำเร็จ!' });
  } catch (error: any) {
    res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบบริการ', error: error.message });
  }
};
