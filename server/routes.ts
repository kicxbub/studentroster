import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStudentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get("/api/students", async (_req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลนักเรียนได้" });
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "ไม่พบข้อมูลนักเรียน" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "ไม่สามารถดึงข้อมูลนักเรียนได้" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "ข้อมูลไม่ถูกต้อง", 
          details: error.errors 
        });
      }
      console.error("Error creating student:", error);
      res.status(500).json({ error: "ไม่สามารถเพิ่มนักเรียนได้" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.updateStudent(req.params.id, validatedData);
      if (!student) {
        return res.status(404).json({ error: "ไม่พบข้อมูลนักเรียน" });
      }
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "ข้อมูลไม่ถูกต้อง", 
          details: error.errors 
        });
      }
      console.error("Error updating student:", error);
      res.status(500).json({ error: "ไม่สามารถแก้ไขข้อมูลได้" });
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteStudent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "ไม่พบข้อมูลนักเรียน" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "ไม่สามารถลบข้อมูลได้" });
    }
  });

  return httpServer;
}
