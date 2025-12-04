// server/storage.ts
import { type Student, type InsertStudent, students } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getAllStudents(): Promise<Student[]>;
  getStudent(id: string): Promise<Student | undefined>;
  createStudent(student: InsertStudent): Promise<Student>;
  updateStudent(id: string, student: InsertStudent): Promise<Student | undefined>;
  deleteStudent(id: string): Promise<boolean>;
}

export class DbStorage implements IStorage {
  async getAllStudents(): Promise<Student[]> {
    return await db.select().from(students);
  }

  async getStudent(id: string): Promise<Student | undefined> {
    const rows = await db
      .select()
      .from(students)
      .where(eq(students.id, id));
    return rows[0];
  }

  async createStudent(insertStudent: InsertStudent): Promise<Student> {
    const id = randomUUID();
    const [row] = await db
      .insert(students)
      .values({ id, ...insertStudent })
      .returning();
    return row;
  }

  async updateStudent(id: string, insertStudent: InsertStudent): Promise<Student | undefined> {
    const [row] = await db
      .update(students)
      .set(insertStudent)
      .where(eq(students.id, id))
      .returning();
    return row ?? undefined;
  }

  async deleteStudent(id: string): Promise<boolean> {
    const deleted = await db
      .delete(students)
      .where(eq(students.id, id))
      .returning({ id: students.id });

    return deleted.length > 0;
  }
}

export const storage: IStorage = new DbStorage();