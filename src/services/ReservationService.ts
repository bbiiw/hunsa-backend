import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from '../config/db';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentTime } from '../config/timezone';
import { unmarshall } from "@aws-sdk/util-dynamodb";

// เพิ่มการจองคิว
export const addReservation = async (customerName: string, customerEmail: string, customerPhone: string, serviceId: string, employeeId: string, reservationDate: string, reservationTime: string) => {
  const reservationId = uuidv4();
  const createdAt = getCurrentTime();
  const updatedAt = createdAt;

  const params = {
    TableName: "reservation",
    Item: {
      id: reservationId,
      customerName: customerName,
      customerEmail: customerEmail,
      customerPhone: customerPhone,
      serviceId: serviceId,
      employeeId: employeeId,
      reservationDate: reservationDate,
      reservationTime: reservationTime,
      status: "pending",
      createdAt: createdAt,
      updatedAt: updatedAt
    }
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("จองคิวสำเร็จ!", data);
    return params.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการจองคิว", error);
    throw new Error(`${error.message}`);
  }
};

// แสดงข้อมูลการจองคิวที่ลูกค้าจองช่างคนนั้น (employeeId)
export const getReservationEmployeeId = async (employeeId: string) => {
    const params: any = {
        TableName: "reservation",
        IndexName: "employeeId-index",
        KeyConditionExpression: "employeeId = :employeeId",
        ExpressionAttributeValues: {
          ":employeeId": employeeId
        }
    };

  try {
    const data = await ddbDocClient.send(new GetCommand(params));

    if (!data.Item) {
      throw new Error(`ว่าง! ไม่มีการจองคิว`);
    }
    return data.Item;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลการจอง", error);
    throw new Error(`${error.message}`);
  }
};

// อัปเดตข้อมูลการจองคิว หลังลูกค้าเข้ารับบริการแล้วเปลี่ยนสถานะการจองเป็น confirm
export const updateReservationStatus = async (id: string, status: string) => {
  const updatedAt = getCurrentTime();

  const params: any = {
    TableName: "reservation",
    Key: { id },
    UpdateExpression: "SET #status = :status, updatedAt = :updatedAt",
    ExpressionAttributeNames: {
      "#status": "status"
    },
    ExpressionAttributeValues: {
      ":status": status,
      ":updatedAt": updatedAt
    },
    ReturnValues: "ALL_NEW"
  };

  try {
    const data = await ddbDocClient.send(new UpdateCommand(params));

    console.log("อัปเดตข้อมูลการจองคิวสำเร็จ!", data.Attributes);
    return data.Attributes;
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตสถานะจองคิว", error);
    throw new Error(`${error.message}`);
  }
};

// ยกเลิกการจองคิว cancel 
export const cancelReservation = async (id: string) => {
  const params = {
    TableName: "reservation",
    Key: { id }
  };

  try {
    await ddbDocClient.send(new DeleteCommand(params));
    console.log("ลบการจองคิวสำเร็จ!");
  } catch (error: any) {
    console.error("เกิดข้อผิดพลาดในการลบ", error);
    throw new Error(`${error.message}`);
  }
};
