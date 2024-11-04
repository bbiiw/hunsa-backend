import { PutCommand, ScanCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTime } from '../config/timezone';

// เพิ่มช่าง
export const registerEmployee = async (username: string, email: string, password: string) => {
  const employee_id = uuidv4();
  const createdAt = getCurrentTime();
  const updatedAt = createdAt;

  const params = {
    TableName: "employees",
    Item: {
      id: employee_id,
      username: username,
      email: email,
      password: password,
      imgSrc: "",
      status: "available",
      createdAt: createdAt,
      updatedAt: updatedAt
    }
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("ลงทะเบียนสำเร็จ!", data);
    return params.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการลงทะเบียน", error);
    throw new Error(`${error.message}`);
  }
};

// ตรวจสอบการเข้าสู่ระบบของช่าง (email หรือ username)
export const loginEmployee = async (email_username: string, password: string) => {
  let params;
  let data;

  try {
    // ค้นหาผ่าน email
    if (email_username.includes("@")) {
      params = {
        TableName: "employees",
        IndexName: "email-index",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email_username
        }
      };

      data = await ddbDocClient.send(new QueryCommand(params));
    }

    // ค้นหา username
    if (!data?.Items || data.Items.length === 0) {
      params = {
        TableName: "employees",
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": email_username
        }
      };

      data = await ddbDocClient.send(new QueryCommand(params));
    }

    if (!data?.Items || data.Items.length === 0) {
      throw new Error("ไม่พบอีเมลหรือชื่อผู้ใช้ในระบบ");
    }

    const employee = data.Items[0];

    if (employee.password !== password) {
      throw new Error("รหัสผ่านไม่ถูกต้อง");
    }

    return employee;  
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ", error);
    throw new Error(`${error.message}`);
  }
};

// แสดงช่างทั้งหมด
export const getAllEmployees = async () => {
  const params = {
    TableName: "employees"
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));

    if (!data.Items || data.Items.length === 0) {
      throw new Error('ไม่พบช่าง!');
    }

    return data.Items;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
    throw new Error(`${error.message}`);
  }
};

// ดึงข้อมูลช่างตาม ID
export const getEmployeeId = async (id: string) => {
  const params = {
    TableName: "employees",
    Key: { id }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
      throw new Error(`ไม่พบช่าง! ID: ${id}`);
    }

    return data.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
    throw new Error(`${error.message}`);
  }
};

// อัปเดตข้อมูลของช่าง (ชื่อ, อีเมล, รูปโปรไฟล์)
export const updateEmployeeInfo = async (id: string, username: string, email: string, imgSrc: string) => {
  const updatedAt = getCurrentTime();

  const params: any = {
    TableName: "employees",
    Key: { id },
    UpdateExpression: "SET #username = :username, #email = :email, #imgSrc = :imgSrc, #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#username": "username",
      "#email": "email",
      "#imgSrc": "imgSrc",
      "#updatedAt": "updatedAt"
    },
    ExpressionAttributeValues: {
      ":username": username,
      ":email": email,
      ":imgSrc": imgSrc,
      ":updatedAt": updatedAt
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("อัปเดตข้อมูลสำเร็จ!", data.Attributes);
    return data.Attributes;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล", error);
    throw new Error(`${error.message}`);
  }
};

// เปลี่ยนสถานะ 'ว่าง/ไม่ว่าง' ของช่าง
export const updateEmployeeStatus = async (id: string, status: string) => {
  const updatedAt = getCurrentTime();

  const params: any = {
    TableName: "employees",
    Key: { id: id },
    UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { 
      ":status": status,
      ":updatedAt": updatedAt
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("อัปเดตสถานะสำเร็จ!", data.Attributes);
    return data.Attributes;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะ", error);
    throw new Error(`${error.message}`);
  }
};

// เปลี่ยนรหัสผ่านของช่าง
export const changePassword = async (id: string, password: string) => {
  const updatedAt = getCurrentTime();

  const params: any = {
    TableName: "employees",
    Key: { id },
    UpdateExpression: "SET #password = :password, #updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#password": "password",
      "#updatedAt": "updatedAt"
    },
    ExpressionAttributeValues: {
      ":password": password,
      ":updatedAt": updatedAt
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("เปลี่ยนรหัสผ่านสำเร็จ!", data.Attributes);
    return data.Attributes;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน", error);
    throw new Error(`${error.message}`);
  }
};

// ลบข้อมูลช่าง
export const deleteEmployee = async (id: string) => {
  const params = {
    TableName: "employees",
    Key: { id }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.log("ลบช่างสำเร็จ!");
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการลบช่าง", error);
    throw new Error(`${error.message}`);
  }
};