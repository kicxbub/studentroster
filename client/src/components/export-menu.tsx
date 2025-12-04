import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Loader2 } from "lucide-react";
import type { Student } from "@shared/schema";
import { formatThaiDate } from "@/lib/utils-date";
import { useToast } from "@/hooks/use-toast";

interface ExportMenuProps {
  students: Student[];
}

export function ExportMenu({ students }: ExportMenuProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const { toast } = useToast();

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

  const exportToCSV = async () => {
    setIsExporting("csv");
    try {
      const headers = ["ลำดับ", "ชื่อ-นามสกุล", "รหัสนักเรียน", "เบอร์โทรศัพท์", "วันเกิด"];
      const rows = students.map((student, index) => [
        index + 1,
        student.name,
        student.studentId,
        formatPhone(student.phone),
        formatThaiDate(student.birthday),
      ]);

      const BOM = "\uFEFF";
      const csvContent = BOM + [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `รายชื่อนักเรียน_${new Date().toLocaleDateString("th-TH")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "ส่งออกสำเร็จ",
        description: "ดาวน์โหลดไฟล์ CSV เรียบร้อยแล้ว",
      });
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกไฟล์ได้",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportToPDF = async () => {
    setIsExporting("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Student Roster", 14, 15);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Total: ${students.length} students | Exported: ${new Date().toLocaleDateString()}`, 14, 22);

      const headers = [["#", "Name", "Student ID", "Phone", "Birthday"]];
      const rows = students.map((student, index) => [
        index + 1,
        student.name,
        student.studentId,
        formatPhone(student.phone),
        student.birthday,
      ]);

      autoTable(doc, {
        head: headers,
        body: rows,
        startY: 28,
        styles: { 
          fontSize: 9,
          cellPadding: 3,
        },
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { 
          fillColor: [248, 250, 252] 
        },
        columnStyles: {
          0: { cellWidth: 12, halign: "center" },
          1: { cellWidth: 60 },
          2: { cellWidth: 25, halign: "center" },
          3: { cellWidth: 35 },
          4: { cellWidth: 30 },
        },
      });

      doc.save(`student_roster_${new Date().toISOString().split("T")[0]}.pdf`);

      toast({
        title: "ส่งออกสำเร็จ",
        description: "ดาวน์โหลดไฟล์ PDF เรียบร้อยแล้ว",
      });
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกไฟล์ PDF ได้",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  const exportToExcel = async () => {
    setIsExporting("excel");
    try {
      const XLSX = await import("xlsx");

      const worksheetData = [
        ["รายชื่อนักเรียน"],
        [`ส่งออกเมื่อ: ${new Date().toLocaleDateString("th-TH")}`],
        [],
        ["ลำดับ", "ชื่อ-นามสกุล", "รหัสนักเรียน", "เบอร์โทรศัพท์", "วันเกิด"],
        ...students.map((student, index) => [
          index + 1,
          student.name,
          student.studentId,
          formatPhone(student.phone),
          formatThaiDate(student.birthday),
        ]),
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      
      worksheet["!cols"] = [
        { wch: 8 },
        { wch: 35 },
        { wch: 15 },
        { wch: 18 },
        { wch: 25 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "รายชื่อนักเรียน");

      XLSX.writeFile(workbook, `รายชื่อนักเรียน_${new Date().toLocaleDateString("th-TH")}.xlsx`);

      toast({
        title: "ส่งออกสำเร็จ",
        description: "ดาวน์โหลดไฟล์ Excel เรียบร้อยแล้ว",
      });
    } catch {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งออกไฟล์ Excel ได้",
        variant: "destructive",
      });
    } finally {
      setIsExporting(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!!isExporting} data-testid="button-export">
          {isExporting ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          ส่งออก
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={exportToCSV} disabled={!!isExporting} data-testid="menu-export-csv">
          <FileText className="h-4 w-4 mr-2" />
          <span>CSV (.csv)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToPDF} disabled={!!isExporting} data-testid="menu-export-pdf">
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          <span>PDF (.pdf)</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportToExcel} disabled={!!isExporting} data-testid="menu-export-excel">
          <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
          <span>Excel (.xlsx)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
