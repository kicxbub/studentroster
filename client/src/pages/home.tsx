// หน้า Home หลักของเว็บ Student Roster
// - ดึงข้อมูลนักเรียนจาก API ด้วย React Query
// - มี Search / Filter / Sort / Stats / Birthday Notifications
// - เปลี่ยนมุมมอง Table <-> Card ได้
// - เปิด Modal เพื่อเพิ่ม/แก้ไขข้อมูลนักเรียน
// - FIX: overflow-x-hidden กันเลื่อนด้านข้างบนมือถือ

import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { StatsDashboard } from "@/components/stats-dashboard";
import { BirthdayNotifications } from "@/components/birthday-notifications";
import { SearchFilterBar } from "@/components/search-filter-bar";
import { StudentTable } from "@/components/student-table";
import { StudentCards } from "@/components/student-card";
import { StudentModal } from "@/components/student-modal";
import { ExportMenu } from "@/components/export-menu";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest, getQueryFn } from "@/lib/queryClient";
import type { Student, InsertStudent } from "@shared/schema";
import { getBirthMonth, parseThaiBirthday } from "@/lib/utils-date";
import { DevNoticeDialog } from "@/components/dev-notice-dialog";

export default function Home() {
  const { toast } = useToast();

  // state สำหรับ search / sort / filter / view mode
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("studentId-asc"); // default เรียงตามรหัสนักเรียน
  const [monthFilter, setMonthFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // ดึงข้อมูลนักเรียนทั้งหมดจาก API ด้วย React Query
  // NOTE: queryFn คืน Student[] | null → เราเลยใส่ generic เป็น Student[] | null
  const {
    data: studentsRaw,
    isLoading,
  } = useQuery<Student[] | null>({
    queryKey: ["api", "students"],
    queryFn: getQueryFn<Student[] | null>({ on401: "throw" }),
  });

  // บังคับให้ students เป็น Student[] เสมอ (ถ้า null ก็ใช้ [])
  const students: Student[] = studentsRaw ?? [];

  // สร้างนักเรียนใหม่
  const createMutation = useMutation({
    mutationFn: (data: InsertStudent) =>
      apiRequest("POST", "/api/students", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "students"] });
      setModalOpen(false);
      toast({
        title: "เพิ่มนักเรียนสำเร็จ",
        description: "ข้อมูลนักเรียนใหม่ถูกบันทึกแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มนักเรียนได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    },
  });

  // แก้ไขข้อมูลนักเรียน
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: InsertStudent }) =>
      apiRequest("PATCH", `/api/students/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "students"] });
      setModalOpen(false);
      setEditingStudent(null);
      toast({
        title: "แก้ไขข้อมูลสำเร็จ",
        description: "ข้อมูลนักเรียนถูกอัพเดตแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถแก้ไขข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    },
  });

  // ลบนักเรียน
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/students/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["api", "students"] });
      toast({
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลนักเรียนถูกลบแล้ว",
      });
    },
    onError: () => {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    },
  });

  // คำนวณรายการนักเรียนที่ผ่านการ search / filter / sort แล้ว
  const filteredAndSortedStudents = useMemo(() => {
    let result = [...students];

    // filter ตาม search (ชื่อ / รหัสนักเรียน)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.studentId.toLowerCase().includes(query)
      );
    }

    // filter ตามเดือนเกิด
    if (monthFilter !== "all") {
      const targetMonth = parseInt(monthFilter, 10);
      result = result.filter((s) => getBirthMonth(s.birthday) === targetMonth);
    }

    // sort ตาม field + direction
    const [field, direction] = sortBy.split("-");
    result.sort((a, b) => {
      let comparison = 0;

      if (field === "name") {
        comparison = a.name.localeCompare(b.name, "th");
      } else if (field === "studentId") {
        comparison = a.studentId.localeCompare(b.studentId, undefined, {
          numeric: true,
        });
      } else if (field === "birthday") {
        const dateA = parseThaiBirthday(a.birthday);
        const dateB = parseThaiBirthday(b.birthday);
        if (dateA && dateB) {
          comparison = dateA.getTime() - dateB.getTime();
        }
      }

      return direction === "desc" ? -comparison : comparison;
    });

    return result;
  }, [students, searchQuery, monthFilter, sortBy]);

  // กดแก้ไข → เปิด modal พร้อมข้อมูลเดิม
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  // ลบ → trigger mutation
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  // กดบันทึกใน modal (ใช้ได้ทั้งเพิ่มใหม่และแก้ไข)
  const handleSave = (data: InsertStudent) => {
    if (editingStudent) {
      updateMutation.mutate({ id: editingStudent.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  // ปิด modal → เคลียร์สถานะ editing
  const handleModalClose = (open: boolean) => {
    if (!open) {
      setEditingStudent(null);
    }
    setModalOpen(open);
  };

  // state กำลังโหลด → skeleton placeholder ทั้งหน้า
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background overflow-x-hidden">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <Skeleton className="h-6 w-40" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-12 w-full rounded-lg" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* popup แจ้งว่าเว็บอยู่ระหว่างการพัฒนา */}
      <DevNoticeDialog />

      {/* header ด้านบน: title + export + ปุ่มเพิ่ม + toggle theme */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">
                รายชื่อนักเรียนม.5/4
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                ครูที่ปรึกษา ครูธัญธร เวชวิทยาขลัง - ครูศิลาภรณ์ อ่ำเอียม
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* ปุ่ม export CSV / PDF / Excel */}
            <ExportMenu students={filteredAndSortedStudents} />
            {/* ปุ่มเพิ่มนักเรียน (desktop) */}
            <Button
              onClick={() => setModalOpen(true)}
              data-testid="button-add-student"
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" />
              <span>เพิ่มนักเรียน</span>
            </Button>
            {/* สลับธีม Dark/Light */}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* เนื้อหาหลักของหน้า */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard แสดงสถิตินักเรียน */}
        <StatsDashboard students={students} />

        {/* การ์ดแจ้งเตือนวันเกิดวันนี้ + ที่จะถึงใน 30 วัน */}
        <BirthdayNotifications students={students} />

        {/* แถบค้นหา / filter / sort / สลับมุมมอง */}
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
          monthFilter={monthFilter}
          onMonthFilterChange={setMonthFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          resultCount={filteredAndSortedStudents.length}
        />

        {/* แสดงรายชื่อนักเรียนแบบ Table หรือ Card ตาม viewMode */}
        {viewMode === "table" ? (
          <StudentTable
            students={filteredAndSortedStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        ) : (
          <StudentCards
            students={filteredAndSortedStudents}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {/* footer */}
        <footer className="border-t border-gray-200 dark:border-gray-800 mt-6 pt-5 text-center text-sm text-muted-foreground">
  <p>© 2025 5/4 Coworking Space</p>
  <p>เว็บนี้จัดทำขึ้นเพื่อใช้งานภายในกลุ่มนักเรียนศิลป์ฝรั่งเศส ม.5/4 เท่านั้น และไม่ได้เป็นเว็บไซต์อย่างเป็นทางการของโรงเรียน</p>
</footer>
      </main>

      {/* Modal สำหรับเพิ่ม/แก้ไขนักเรียน */}
      <StudentModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        student={editingStudent}
        onSave={handleSave}
        isPending={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}