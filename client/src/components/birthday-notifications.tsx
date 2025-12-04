import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cake, PartyPopper, Gift } from "lucide-react";
import type { Student } from "@shared/schema";
import { getDaysUntilBirthday, isBirthdayToday, formatThaiDate } from "@/lib/utils-date";

interface BirthdayNotificationsProps {
  students: Student[];
}

export function BirthdayNotifications({ students }: BirthdayNotificationsProps) {
  const upcomingBirthdays = students
    .map(student => ({
      ...student,
      daysUntil: getDaysUntilBirthday(student.birthday),
    }))
    .filter(s => s.daysUntil >= 0 && s.daysUntil <= 30)
    .sort((a, b) => a.daysUntil - b.daysUntil);

  if (upcomingBirthdays.length === 0) {
    return null;
  }

  const todayBirthdays = upcomingBirthdays.filter(s => s.daysUntil === 0);
  const otherUpcoming = upcomingBirthdays.filter(s => s.daysUntil > 0);

  return (
    <div className="space-y-4">
      {todayBirthdays.length > 0 && (
        <Card className="p-4 border-pink-200 dark:border-pink-800 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/30 dark:to-purple-950/30" data-testid="birthday-today-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/50">
              <PartyPopper className="h-5 w-5 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="font-semibold text-pink-900 dark:text-pink-100">
                วันนี้วันเกิด!
              </h3>
              <p className="text-sm text-pink-700 dark:text-pink-300">
                มีเพื่อนร่วมชั้นเกิดวันนี้ {todayBirthdays.length} คน
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {todayBirthdays.map(student => (
              <Badge 
                key={student.id} 
                variant="secondary"
                className="bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100"
                data-testid={`birthday-today-${student.studentId}`}
              >
                <Cake className="h-3 w-3 mr-1" />
                {student.name.replace(/^(นาย|นางสาว)/, "")}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      {otherUpcoming.length > 0 && (
        <Card className="p-4" data-testid="birthday-upcoming-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-amber-100 dark:bg-amber-900/50">
              <Gift className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="font-semibold">วันเกิดที่กำลังจะมาถึง</h3>
              <p className="text-sm text-muted-foreground">
                ภายใน 30 วันข้างหน้า ({otherUpcoming.length} คน)
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {otherUpcoming.slice(0, 6).map(student => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                data-testid={`birthday-upcoming-${student.studentId}`}
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">
                    {student.name.replace(/^(นาย|นางสาว)/, "")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatThaiDate(student.birthday)}
                  </p>
                </div>
                <Badge variant="outline" className="ml-2 shrink-0">
                  {student.daysUntil === 1 ? "พรุ่งนี้" : `${student.daysUntil} วัน`}
                </Badge>
              </div>
            ))}
          </div>
          {otherUpcoming.length > 6 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              และอีก {otherUpcoming.length - 6} คน...
            </p>
          )}
        </Card>
      )}
    </div>
  );
}
