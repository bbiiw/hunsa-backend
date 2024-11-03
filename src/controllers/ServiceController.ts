import { Request, Response } from "express";
import Service from "../models/Service";
import { getCurrentTime } from "../config/timezone";

// สร้างบริการใหม่
export const createService = async (req: Request, res: Response) => {
  const { title, description, price, category, imgSrc } = req.body;

  try {
    if (!title || !description || !price || !category || !imgSrc) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    const service = new Service({
      title,
      description,
      price,
      category,
      imgSrc,
      createdAt: getCurrentTime(),
      updatedAt: getCurrentTime(),
    });
    await service.save();

    res.status(201).json({ message: "สร้างบริการสำเร็จ", service: service });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถสร้างบริการได้", error });
  }
};

// ดึงข้อมูลบริการทั้งหมด
export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await Service.find();

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลบริการได้", error });
  }
};

// ดึงข้อมูลบริการตาม ID
export const getServiceById = async (req: Request, res: Response) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "ไม่พบบริการนี้" });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลบริการได้", error });
  }
};

// อัปเดตข้อมูลบริการ
export const updateService = async (req: Request, res: Response) => {
  try {
    const updatedData = {
      ...req.body,
      updatedAt: getCurrentTime(),
    };

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true },
    );

    if (!updatedService) {
      return res.status(404).json({ message: "ไม่พบบริการนี้" });
    }

    res
      .status(200)
      .json({ message: "อัปเดตข้อมูลบริการสำเร็จ", updatedService });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถอัปเดตข้อมูลบริการได้", error });
  }
};

// ลบบริการ
export const deleteService = async (req: Request, res: Response) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);

    if (!deletedService) {
      return res.status(404).json({ message: "ไม่พบบริการนี้" });
    }

    res.status(200).json({ message: "ลบบริการสำเร็จ" });
  } catch (error) {
    res.status(500).json({ message: "ไม่สามารถลบบริการได้", error });
  }
};
