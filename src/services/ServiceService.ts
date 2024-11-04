import { PutCommand, UpdateCommand, DeleteCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { ddbDocClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTime } from '../config/timezone';
import { ScanCommand } from "@aws-sdk/client-dynamodb";

// เพิ่ม Service
export const addService = async (title: string, description: string, price: number, category: string, imgSrc: string) => {
  const service_id = uuidv4();
  const createdAt = getCurrentTime();
  const updatedAt = createdAt;

  const params = {
    TableName: "services",
    Item: {
      id: service_id,
      title: title,
      description: description,
      price: price,
      category: category,
      imgSrc: imgSrc,
      createdAt: createdAt,
      updatedAt: updatedAt
    }
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("เพิ่มบริการสำเร็จ!", data)
    return params.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการเพิ่มบริการ", error);
    throw new Error(`${error.message}`);
  }
};

// แสดง Service ทั้งหมด
export const getAllServices = async () => {
  const params = {
    TableName: "services"
  };

  try {
    const data = await ddbDocClient.send(new ScanCommand(params));

    if (!data.Items || data.Items.length === 0) {
        throw new Error('ไม่พบบริการ!');
    }

    const services = data.Items.map((item) => unmarshall(item));
    return services;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
    throw new Error(`${error.message}`);
  }
};

// ดึงข้อมูล Service ตาม ID
export const getServiceId = async (id: string) => {
  const params = {
    TableName: "services",
    Key: { id }
  };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
      throw new Error(`ไม่พบบริการนี้! ID: ${id}`);
    }

    return data.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูล", error);
    throw new Error(`${error.message}`);
  }
};

// อัปเดต Service
export const updateService = async (id: string, title: string, description: string, price: number, category: string, imgSrc: string) => {
  const updatedAt = getCurrentTime();

  const params: any = {
    TableName: "services",
    Key: { id },
    UpdateExpression: "SET title = :title, description = :description, price = :price, category = :category, imgSrc = :imgSrc, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":title": title,
      ":description": description,
      ":price": price,
      ":category": category,
      ":imgSrc": imgSrc,
      ":updatedAt": updatedAt
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));
    console.log("อัปเดตข้อมูลบริการสำเร็จ!", data.Attributes);
    return data.Attributes;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูลบริการ", error);
    throw new Error(`${error.message}`);
  }
};

// ลบข้อมูล Service
export const deleteService = async (id: string) => {
  const params = {
    TableName: "services",
    Key: { id }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.log("ลบบริการสำเร็จ!");
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการลบบริการ", error);
    throw new Error(`${error.message}`);
  }
};
