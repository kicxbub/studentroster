// แก้ student-table.tsx ป้องกันหน้าจอเลื่อนซ้าย-ขวาบนมือถือ
// - เพิ่ม wrapper ที่มี overflow-x-auto รอบ Table
// - ใส่ className="min-w-full" ให้ Table
// พร้อมคอมเมนต์อธิบายแต่ละส่วน

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Pencil, 
  Trash2, 
  Phone, 
  Cake, 
  ChevronUp, 
  ChevronDown,
  ArrowUpDown
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Student } from "@shared/schema";
import { formatThaiDate, isBirthdayToday, isUpcomingBirthday, getDaysUntilBirthday } from "@/lib/utils-date";

interface StudentTableProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
}

// type ของ field ที่ใช้ sort
type SortField = "name" | "studentId" | "birthday";

// toggle ตรงนี้ถ้าอยากแสดงเบอร์โทรในตาราง
const SHOW_PHONE = true;

export function StudentTable({ 
  students, 
  onEdit, 
  onDelete,
  sortBy,
  onSortChange 
}: StudentTableProps) {
  // state เก็บ "นักเรียนที่กำลังจะถูกลบ" สำหรับใช้ใน AlertDialog
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  // ฟังก์ชันเปลี่ยนค่า sort ตามหัวตารางที่คลิก
  const handleSort = (field: SortField) => {
    const currentField = sortBy.split("-")[0];
    const currentDir = sortBy.split("-")[1];
    
    if (currentField === field) {
      onSortChange(`${field}-${currentDir === "asc" ? "desc" : "asc"}`);
    } else {
      onSortChange(`${field}-asc`);
    }
  };

  // เลือกไอคอนให้ตรงกับสถานะ sort ปัจจุบัน (asc / desc / none)
  const getSortIcon = (field: SortField) => {
    const currentField = sortBy.split("-")[0];
    const currentDir = sortBy.split("-")[1];
    
    if (currentField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-1 opacity-50" />;
    }
    return currentDir === "asc" 
      ? <ChevronUp className="h-4 w-4 ml-1" />
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  // จัดรูปแบบเบอร์โทร (ยังไม่ใช้ ถ้า SHOW_PHONE = false)
  const formatPhone = (phone: string) => {
    if (phone === "-" || !phone) return "-";
    if (phone.length === 9) {
      return `0${phone.slice(0, 2)}-${phone.slice(2, 5)}-${phone.slice(5)}`;
    }
    if (phone.length === 10) {
      return `${phone.slice(0, 3)}-${phone.slice(3, 6)}-${phone.slice(6)}`;
    }
    return phone;
  };

  // ยืนยันลบข้อมูลจริง ๆ หลังจากกดตกลงใน AlertDialog
  const handleConfirmDelete = () => {
    if (deleteStudent) {
      onDelete(deleteStudent.id);
      setDeleteStudent(null);
    }
  };

  // ถ้าไม่มีนักเรียนเลย แสดง empty state
  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">ไม่พบข้อมูลนักเรียน</h3>
        <p className="text-muted-foreground text-sm">
          ลองค้นหาด้วยคำอื่น หรือเปลี่ยนตัวกรอง
        </p>
      </div>
    );
  }

  return (
    <>
      {/* 
        กล่องหลักของตาราง
        - border รอบตาราง
      */}
      <div className="rounded-lg border">
        {/* 
          🔧 FIX: กันหน้าจอเลื่อนซ้าย-ขวาบนมือถือ
          - ใช้ overflow-x-auto ที่ wrapper ชั้นนี้
          - ให้ Table กินความกว้างอย่างน้อยเท่ากับ container (min-w-full)
          แบบนี้ถ้า column เยอะ ตารางจะ scroll ในกล่องตัวเองแทนดันทั้งหน้า
        */}
        <div className="w-full overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">#</TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-primary transition-colors"
                    onClick={() => handleSort("name")}
                    data-testid="sort-name"
                  >
                    ชื่อ-นามสกุล
                    {getSortIcon("name")}
                  </button>
                </TableHead>
                <TableHead>
                  <button 
                    className="flex items-center font-semibold hover:text-primary transition-colors"
                    onClick={() => handleSort("studentId")}
                    data-testid="sort-studentId"
                  >
                    รหัสนักเรียน
                    {getSortIcon("studentId")}
                  </button>
                </TableHead>
                {SHOW_PHONE && (
                  <TableHead className="hidden md:table-cell">เบอร์โทรศัพท์</TableHead>
                )}
                <TableHead className="hidden sm:table-cell">
                  <button 
                    className="flex items-center font-semibold hover:text-primary transition-colors"
                    onClick={() => handleSort("birthday")}
                    data-testid="sort-birthday"
                  >
                    วันเกิด
                    {getSortIcon("birthday")}
                  </button>
                </TableHead>
                <TableHead className="w-24 text-center">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student, index) => {
                // เช็คสถานะวันเกิดเพื่อนำไปแสดง Badge
                const isToday = isBirthdayToday(student.birthday);
                const isUpcoming = isUpcomingBirthday(student.birthday, 7);
                const daysUntil = getDaysUntilBirthday(student.birthday);
                
                return (
                  <TableRow 
                    key={student.id}
                    className={`hover-elevate ${isToday ? "bg-pink-50/50 dark:bg-pink-950/20" : ""}`}
                    data-testid={`row-student-${student.studentId}`}
                  >
                    {/* ลำดับที่ */}
                    <TableCell className="text-center text-muted-foreground text-sm tabular-nums">
  {index + 1}
</TableCell>

                    {/* ชื่อ + badge วันเกิดถ้าเกี่ยวข้อง */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{student.name}</span>
                        {isToday && (
                          <Badge variant="secondary" className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100">
                            <Cake className="h-3 w-3 mr-1" />
                            วันนี้!
                          </Badge>
                        )}
                        {!isToday && isUpcoming && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300">
                            {daysUntil} วัน
                          </Badge>
                        )}
                      </div>
                    </TableCell>

                    {/* รหัสนักเรียน */}
                    <TableCell>
                      <span className="text-sm tabular-nums">{student.studentId}</span>
                    </TableCell>

                    {/* เบอร์โทร (ถ้าเปิดใช้ SHOW_PHONE) */}
                    {SHOW_PHONE && (
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
                          <span className="text-sm tabular-nums">{formatPhone(student.phone)}</span>
                        </div>
                      </TableCell>
                    )}

                    {/* วันเกิด (ซ่อนในจอเล็กมาก) */}
                    <TableCell className="hidden sm:table-cell">
                      <span className="text-sm tabular-nums">{formatThaiDate(student.birthday)}</span>
                    </TableCell>

                    {/* ปุ่มจัดการ: แก้ไข / ลบ */}
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(student)}
                          data-testid={`button-edit-${student.studentId}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteStudent(student)}
                          data-testid={`button-delete-${student.studentId}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Dialog ยืนยันการลบ */}
      <AlertDialog open={!!deleteStudent} onOpenChange={() => setDeleteStudent(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการลบข้อมูลของ "{deleteStudent?.name}" หรือไม่?
              การดำเนินการนี้ไม่สามารถยกเลิกได้
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">ยกเลิก</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              ลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}