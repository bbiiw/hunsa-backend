import { Request, Response } from "express";
import Employee from "../models/Employee";
import { getCurrentTime } from "../config/timezone";

// ช่างลงทะเบียนสร้างบัญชีผู้ใช้
export const registerEmployee = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    const existingEmployee = await Employee.findOne({ email });

    if (existingEmployee) {
      return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
    }

    const employee = new Employee({
      username,
      email,
      password,
      status: "available",
      createAt: getCurrentTime(),
      updatedAt: getCurrentTime(),
    });

    await employee.save();

    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ",
      employee: {
        username: employee.username,
        email: employee.email,
        description: employee.description,
        imgSrc: employee.imgSrc,
        status: employee.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการสมัครสมาชิก", error });
  }
};

// ช่างเข้าสู่ระบบ
export const loginEmployee = async (req: Request, res: Response) => {
  const { email_username, password } = req.body;
  try {
    const employee = await Employee.findOne({
      $or: [{ email: email_username }, { username: email_username }],
    });

    if (!employee) {
      return res
        .status(400)
        .json({ message: "ไม่พบอีเมลหรือชื่อผู้ใช้ในระบบ" });
    }

    if (employee.password !== password) {
      return res.status(400).json({ message: "รหัสผ่านไม่ถูกต้อง" });
    }

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" });
  }
};

// แสดงข้อมูลช่างทุกคน
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await Employee.find();

    res.status(200).json(employees);
  } catch (error) {
    // หากมีข้อผิดพลาด
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error });
  }
};

// ฟังก์ชันเปลี่ยนสถานะ 'ว่าง/ไม่ว่าง' ของช่าง
export const updateEmployeeStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const employeeId = req.params.id;
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
    }

    employee.status = status;
    await employee.save();

    res.status(200).json({ message: "อัปเดตสถานะสำเร็จ", employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
  }
};

// อัปเดตช่าง (ชื่อ,อีเมล,รูปโปรไฟล์)
export const updateEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { username, email, description, imgSrc } = req.body;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
    }

    // ตรวจสอบว่ามีการอัปเดตอีเมล และอีเมลนี้ยังไม่ได้ใช้ในระบบ
    if (email) {
      const emailExists: any = await Employee.findOne({ email });

      if (emailExists && emailExists._id.toString() !== id) {
        return res.status(400).json({ message: "อีเมลนี้ถูกใช้แล้ว" });
      }

      employee.email = email;
    }

    if (username) {
      employee.username = username;
    }

    if (imgSrc) {
      employee.imgSrc = imgSrc;
    }

    if (description !== undefined) {
      employee.description = description;
    }

    employee.updatedAt = getCurrentTime();
    await employee.save();

    res.status(200).json({ message: "อัปเดตข้อมูลสำเร็จ", employee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error });
  }
};

// ฟังก์ชันสำหรับเปลี่ยนรหัสผ่าน
export const changePassword = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).json({ message: "ไม่พบข้อมูลช่าง" });
    }

    employee.password = password;
    employee.updatedAt = getCurrentTime();

    await employee.save();

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน", error });
  }
};
