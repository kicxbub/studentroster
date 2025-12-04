import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // หลัง build แล้ว __dirname จะอยู่ใน dist/
  // และ client ถูก build ไปไว้ใน dist/client
  const distPath = path.resolve(__dirname, "client");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // ถ้า path ไหนไม่มีไฟล์ ให้ส่ง index.html กลับไปให้ React จัดการ route ต่อ
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}