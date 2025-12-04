import { Search, X, LayoutGrid, List, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { thaiMonths, sortOptions } from "@shared/schema";
import { cn } from "@/lib/utils";

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  monthFilter: string;
  onMonthFilterChange: (value: string) => void;
  viewMode: "table" | "card";
  onViewModeChange: (mode: "table" | "card") => void;
  resultCount: number;
}

export function SearchFilterBar({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  monthFilter,
  onMonthFilterChange,
  viewMode,
  onViewModeChange,
  resultCount,
}: SearchFilterBarProps) {
  return (
    // 🔧 FIX: ให้ container กว้างไม่เกินหน้าจอ
    <div className="space-y-4 w-full">
      {/* แถวบน: search + ปุ่มสลับ table/card */}
      <div className="flex flex-row flex-wrap gap-3 w-full items-center">
        {/* ช่องค้นหา */}
        <div className="relative flex-1 h-11 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            type="text"
            placeholder="ค้นหาชื่อนักเรียน"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-11 w-full"
            data-testid="input-search"
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground transition-colors z-10"
              onClick={() => onSearchChange("")}
              data-testid="button-clear-search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* ปุ่มสลับมุมมอง */}
        <div className="flex gap-2 shrink-0">
          <div className="inline-flex items-center rounded-md border bg-background h-11 p-0.5 gap-0.5">
  
  <button
    type="button"
    className={cn(
      // ปุ่มใช้ความสูงเต็มพื้นที่ภายใน (h-full) และกว้าง 40px (w-10)
      // ใช้ flex เพื่อจัดไอคอนให้อยู่กลางทั้งแนวตั้งและแนวนอน
      "flex items-center justify-center h-full w-10 rounded-sm transition-colors",
      viewMode === "table"
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
    onClick={() => onViewModeChange("table")}
  >
    <List className="h-4 w-4" />
  </button>

  <button
    type="button"
    className={cn(
      "flex items-center justify-center h-full w-10 rounded-sm transition-colors",
      viewMode === "card"
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:text-foreground hover:bg-muted"
    )}
    onClick={() => onViewModeChange("card")}
  >
    <LayoutGrid className="h-4 w-4" />
  </button>
</div>
        </div>
      </div>

      {/* แถวล่าง: filter เดือน + sort + จำนวนผลลัพธ์ */}
<div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between w-full">
  {/* กลุ่ม filter (อยู่กลางจอเล็ก กว้างเท่ากัน) */}
  <div className="flex w-full sm:w-auto gap-2 justify-center sm:justify-start">
    {/* เลือกเดือนเกิด */}
    <Select value={monthFilter} onValueChange={onMonthFilterChange}>
      <SelectTrigger
        className="flex-1 sm:w-[180px] h-10"
        data-testid="select-month-filter"
      >
        <Filter className="h-4 w-4 mr-2 shrink-0" />
        <SelectValue placeholder="เดือนเกิด" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">ทุกเดือน</SelectItem>
        {thaiMonths.map((month, index) => (
          <SelectItem key={index} value={index.toString()}>
            {month}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>

    {/* เลือกการเรียงลำดับ */}
    <Select value={sortBy} onValueChange={onSortChange}>
      <SelectTrigger
        className="flex-1 sm:w-[180px] h-10"
        data-testid="select-sort"
      >
        <SelectValue placeholder="เรียงลำดับ" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* จำนวนรายการ */}
  <p className="text-sm text-muted-foreground">
    แสดง {resultCount} รายการ
  </p>
</div>
    </div>
  );
}