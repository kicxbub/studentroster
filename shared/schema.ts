import { z } from "zod";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";

// === Drizzle table สำหรับ PostgreSQL ===
export const students = pgTable("students", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name").notNull(),
  studentId: varchar("studentId", { length: 20 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  birthday: varchar("birthday", { length: 20 }).notNull(),
});

// === Zod schema ที่ใช้ฝั่ง client + server ===
export const studentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "กรุณากรอกชื่อ-นามสกุล"),
  studentId: z.string().min(1, "กรุณากรอกรหัสนักเรียน"),
  phone: z.string(), // จะใส่ "-" หรือเว้นว่างไว้ก็ได้
  birthday: z.string().min(1, "กรุณากรอกวันเกิด"),
});

export const insertStudentSchema = studentSchema.omit({ id: true });

export type Student = z.infer<typeof studentSchema>;
export type InsertStudent = z.infer<typeof insertStudentSchema>;

// ของเดิมที่หน้าเว็บใช้ (เดือน + options)
export const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน",
  "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม",
  "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
] as const;

export const sortOptions = [
  { value: "name-asc", label: "ชื่อ (ก-ฮ)" },
  { value: "name-desc", label: "ชื่อ (ฮ-ก)" },
  { value: "studentId-asc", label: "รหัส (น้อย-มาก)" },
  { value: "studentId-desc", label: "รหัส (มาก-น้อย)" },
  { value: "birthday-asc", label: "วันเกิด (เก่า-ใหม่)" },
  { value: "birthday-desc", label: "วันเกิด (ใหม่-เก่า)" },
] as const;