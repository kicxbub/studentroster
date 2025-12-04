import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertStudentSchema, type Student, type InsertStudent } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface StudentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student | null;
  onSave: (data: InsertStudent) => void;
  isPending: boolean;
}

export function StudentModal({
  open,
  onOpenChange,
  student,
  onSave,
  isPending,
}: StudentModalProps) {
  const isEditing = !!student;

  const form = useForm<InsertStudent>({
    resolver: zodResolver(insertStudentSchema),
    defaultValues: {
      name: "",
      studentId: "",
      phone: "",
      birthday: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (student) {
        form.reset({
          name: student.name,
          studentId: student.studentId,
          phone: student.phone,
          birthday: student.birthday,
        });
      } else {
        form.reset({
          name: "",
          studentId: "",
          phone: "",
          birthday: "",
        });
      }
    }
  }, [open, student, form]);

  const handleSubmit = (data: InsertStudent) => {
    onSave(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "แก้ไขข้อมูลนักเรียน" : "เพิ่มนักเรียนใหม่"}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? "แก้ไขข้อมูลนักเรียนตามต้องการ แล้วกดบันทึก"
              : "กรอกข้อมูลนักเรียนใหม่ให้ครบถ้วน"
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อ-นามสกุล *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="เช่น นายมาเฟี้ยว เลี้ยวชนตรอก" 
                      {...field} 
                      data-testid="input-student-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รหัสนักเรียน *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="เช่น 36677" 
                      {...field}
                      data-testid="input-student-id" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>เบอร์โทรศัพท์</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="เช่น 0676767676" 
                      {...field}
                      data-testid="input-student-phone" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthday"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>วันเกิด *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="เช่น 1/1/2567" 
                      {...field}
                      data-testid="input-student-birthday" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 sm:gap-0">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isPending}
                data-testid="button-cancel-student"
              >
                ยกเลิก
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
                data-testid="button-save-student"
              >
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isEditing ? "บันทึกการแก้ไข" : "เพิ่มนักเรียน"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
