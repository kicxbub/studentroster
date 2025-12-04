import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const STORAGE_KEY = "studentroster_dev_notice_dismissed";

export function DevNoticeDialog() {
  const [open, setOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // เปิด popup แค่ตอนที่ยังไม่เคยติ๊ก "ไม่ต้องแสดงอีก"
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setOpen(true);
      }
    } catch {
      // ถ้ามีปัญหากับ localStorage ก็ให้ขึ้น popup ไปเลย
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY, "true");
      } catch {
        // ignore
      }
    }
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // ป้องกันเคสกดปิดตรง backdrop / ปุ่ม X
        if (!nextOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
  className="
    sm:max-w-[480px]
    w-[90%]
    rounded-2xl
    px-6 py-6
  "
>
        <DialogHeader>
          <DialogTitle>เว็บไซต์นี้อยู่ระหว่างการพัฒนา</DialogTitle>
          <DialogDescription>
            ข้อมูลและฟีเจอร์อาจมีการแสดงผลผิดปกติ<br />
            <br />
            Update ล่าสุด 4/12/68<br />
            - แก้ไขปุ่ม Theme<br />
            - แก้ไขขนาดเว็บไซต์สำหรับมือถือ<br />
            - รายละเอียดยิบย่อย
            - แก้ไขชื่อนักเรียนให้ถูกต้อง
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-start space-x-2 py-2">
          <Checkbox
            id="dev-notice-hide"
            checked={dontShowAgain}
            onCheckedChange={(checked) => setDontShowAgain(!!checked)}
          />
          <Label
            htmlFor="dev-notice-hide"
            className="text-sm cursor-pointer select-none"
          >
            ไม่ต้องแสดงอีกในครั้งถัดไป
          </Label>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>
            เข้าใจแล้ว
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}