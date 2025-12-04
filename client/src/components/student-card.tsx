// student-card.tsx
// แก้ overflow บนมือถือโดยเพิ่ม max-w-full + min-w-0
// และมีคอมเมนต์อธิบายโครงสร้างทุกส่วน

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Pencil, 
  Trash2, 
  Phone, 
  Calendar, 
  Hash,
  Cake
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

const SHOW_PHONE = true;

interface StudentCardProps {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export function StudentCards({ students, onEdit, onDelete }: StudentCardProps) {
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);

  // จัดเบอร์โทร
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

  // สร้างอักษรย่อจาก "นาย/นางสาว"
  const getInitials = (name: string) => {
    const cleaned = name.replace(/^(นาย|นางสาว)/, "").trim();
    const parts = cleaned.split(" ");
    if (parts.length >= 2) {
      return parts[0][0] + parts[1][0];
    }
    return cleaned.slice(0, 2);
  };

  // สีพื้นหลัง Avatar แยกชาย/หญิง
  const getGenderColor = (name: string) => {
    if (name.startsWith("นาย")) {
      return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200";
    }
    return "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200";
  };

  const handleConfirmDelete = () => {
    if (deleteStudent) {
      onDelete(deleteStudent.id);
      setDeleteStudent(null);
    }
  };

  if (students.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center" data-testid="empty-state-cards">
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
        กริดของการ์ด:
        🔧 FIX: เพิ่ม w-full และ gap ปกติ → ป้องกันล้น
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {students.map((student) => {
          const isToday = isBirthdayToday(student.birthday);
          const isUpcoming = isUpcomingBirthday(student.birthday, 7);
          const daysUntil = getDaysUntilBirthday(student.birthday);

          return (
            <Card 
              key={student.id} 
              // 🔧 FIX: เพิ่ม max-w-full ป้องกัน card ล้นขวา และ min-w-0 ให้เนื้อหายอมถูกบีบ
              className={`p-4 hover-elevate relative max-w-full min-w-0 ${
                isToday ? "ring-2 ring-pink-300 dark:ring-pink-700" : ""
              }`}
              data-testid={`card-student-${student.studentId}`}
            >
              {/* Badge วันเกิด */}
              {isToday && (
                <div className="absolute -top-2 -right-2">
                  <Badge className="bg-pink-500 text-white">
                    <Cake className="h-3 w-3 mr-1" />
                    วันนี้!
                  </Badge>
                </div>
              )}
              {!isToday && isUpcoming && (
                <div className="absolute -top-2 -right-2">
                  <Badge variant="outline" className="bg-background border-amber-300 text-amber-600">
                    {daysUntil} วัน
                  </Badge>
                </div>
              )}

              {/* ส่วนหัวการ์ด */}
              <div className="flex items-start gap-3 min-w-0">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className={getGenderColor(student.name)}>
                    {getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>

                {/* ข้อมูลนักเรียน */}
                {/* 🔧 FIX: min-w-0 ทำให้ชื่อยอมตัด ไม่ดัน container หลุด */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate" title={student.name}>
                    {student.name}
                  </h3>
                  
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
                      <Hash className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono truncate">{student.studentId}</span>
                    </div>

                    {SHOW_PHONE && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="font-mono">{formatPhone(student.phone)}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                      <span>{formatThaiDate(student.birthday)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ปุ่มแก้ไข/ลบ */}
              <div className="flex items-center justify-end gap-1 mt-4 pt-3 border-t">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onEdit(student)}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  แก้ไข
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => setDeleteStudent(student)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  ลบ
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Popup ยืนยันการลบ */}
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
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              ลบข้อมูล
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}