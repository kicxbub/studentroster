// stats-dashboard.tsx
// แก้ overflow โดยเพิ่ม w-full ให้ grid + min-w-0 ใน Card
// พร้อมคอมเมนต์อธิบายส่วนที่ทำงาน

import { Card } from "@/components/ui/card";
import { Users, UserCheck, Calendar, Cake } from "lucide-react";
import type { Student } from "@shared/schema";
import { thaiMonths } from "@shared/schema";
import { getBirthMonth, isUpcomingBirthday } from "@/lib/utils-date";

interface StatsDashboardProps {
  students: Student[];
}

export function StatsDashboard({ students }: StatsDashboardProps) {
  const totalStudents = students.length;
  
  const maleStudents = students.filter(s => s.name.startsWith("นาย")).length;
  const femaleStudents = students.filter(s => s.name.startsWith("นางสาว")).length;
  
  const monthCounts = new Array(12).fill(0);
  students.forEach(s => {
    const month = getBirthMonth(s.birthday);
    if (month >= 0 && month < 12) {
      monthCounts[month]++;
    }
  });
  
  const maxMonthIndex = monthCounts.indexOf(Math.max(...monthCounts));
  const topBirthdayMonth = thaiMonths[maxMonthIndex];
  const topMonthCount = monthCounts[maxMonthIndex];
  
  const upcomingBirthdays = students.filter(s => isUpcomingBirthday(s.birthday, 30)).length;

  const stats = [
    {
      label: "นักเรียนทั้งหมด",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "นักเรียนชาย / หญิง",
      value: `${maleStudents} / ${femaleStudents}`,
      icon: UserCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "เดือนวันเกิดมากสุด",
      value: topBirthdayMonth,
      subValue: `${topMonthCount} คน`,
      icon: Calendar,
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      label: "วันเกิดใกล้ถึง",
      value: upcomingBirthdays,
      subValue: "ภายใน 30 วัน",
      icon: Cake,
      color: "text-pink-600 dark:text-pink-400",
      bgColor: "bg-pink-50 dark:bg-pink-950/30",
    },
  ];

  return (
    // 🔧 FIX: เพิ่ม w-full เพื่อให้ grid ไม่กว้างเกิน container
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          // 🔧 FIX: min-w-0 ให้เนื้อหาการ์ดยอมถูกบีบ ไม่ดัน grid ล้น
          className="p-4 md:p-6 hover-elevate min-w-0"
        >
          <div className="flex items-start gap-3 min-w-0">
            {/* icon badge */}
            <div className={`p-2 rounded-lg ${stat.bgColor} shrink-0`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>

            {/* ข้อมูลใน card */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{stat.label}</p>
              <p className="text-xl md:text-2xl font-bold mt-1 truncate">{stat.value}</p>
              {stat.subValue && (
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{stat.subValue}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}