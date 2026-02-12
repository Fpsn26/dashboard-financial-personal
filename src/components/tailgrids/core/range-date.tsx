"use client"

import { cn } from "@/utils/cn";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isWithinInterval,
  startOfMonth,
  subMonths
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";

type PropsType = {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export function RangeDatePicker({
  defaultStartDate,
  defaultEndDate,
  onDateChange
}: PropsType) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tempStartDate, setTempStartDate] = useState<Date | null>(defaultStartDate || null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(defaultEndDate || null);

  const handleDateClick = (date: Date) => {
    if (!tempStartDate || (tempStartDate && tempEndDate)) {
      setTempStartDate(date);
      setTempEndDate(null);
    } else {
      if (date < tempStartDate) {
        setTempEndDate(tempStartDate);
        setTempStartDate(date);
      } else {
        setTempEndDate(date);
      }
    }
  };

  const handleOk = () => {
    onDateChange?.(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  useEffect(() => {
    setTempStartDate(defaultStartDate || null);
    setTempEndDate(defaultEndDate || null);
  }, [defaultStartDate, defaultEndDate]);

  const renderCalendar = (monthDate: Date) => {
    const days = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate)
    });

    return (
      <div className="grid grid-cols-7 gap-1">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((d, index) => (
          <div key={index} className={`text-[10px] font-bold py-1 ${isDark ? 'text-[rgb(187,225,250)]/30' : 'text-gray-400'}`}>{d}</div>
        ))}
        {days.map((day, idx) => {
          const isStart = tempStartDate && isSameDay(day, tempStartDate);
          const isEnd = tempEndDate && isSameDay(day, tempEndDate);
          const isInRange = tempStartDate && tempEndDate && isWithinInterval(day, { start: tempStartDate, end: tempEndDate });

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={cn(
                "h-8 w-full text-xs font-medium transition-all rounded-md flex items-center justify-center",
                isInRange && (isDark ? "bg-[rgb(50,130,184)]/20" : "bg-blue-50"),
                (isStart || isEnd) && (isDark ? "bg-[rgb(50,130,184)] text-white" : "bg-blue-600 text-white"),
                !isStart && !isEnd && !isInRange && (isDark ? "text-[rgb(187,225,250)] hover:bg-white/5" : "text-gray-700 hover:bg-gray-100")
              )}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "input-styled w-full flex items-center gap-2 text-[11px] font-medium transition-all",
          isDark ? "text-[rgb(187,225,250)]" : "text-gray-700"
        )}
      >
        <Calendar size={14} className="shrink-0 opacity-60" />
        <span className="truncate">
          {tempStartDate ? `${format(tempStartDate, "dd/MM/yy")} - ${tempEndDate ? format(tempEndDate, "dd/MM/yy") : '...'}` : 'Selecionar intervalo de datas'}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 z-50 mt-2 w-72 sm:w-80 rounded-xl border shadow-2xl overflow-hidden ${isDark ? 'bg-[rgb(27,38,44)]/95 border-[rgb(50,130,184)]/95' : 'bg-white border-gray-200'
          }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className={isDark ? "text-white hover:bg-white/5 rounded-sm" : "text-gray-600 hover:bg-gray-200 rounded-sm"}>
                <ChevronLeft size={18} />
              </button>
              <span className={`text-sm font-bold ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'}`}>
                {format(currentDate, "MMMM yyyy", { locale: ptBR })}
              </span>
              <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className={isDark ? "text-white hover:bg-white/5 rounded-sm" : "text-gray-600 hover:bg-gray-200 rounded-sm"}>
                <ChevronRight size={18} />
              </button>
            </div>
            {renderCalendar(currentDate)}
          </div>
          <div className={`p-3 border-t flex gap-2 ${isDark ? 'border-[rgb(50,130,184)]/20' : 'border-gray-100'}`}>
            <button onClick={() => setIsOpen(false)} className={`flex-1 text-[10px] font-bold uppercase py-2 ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-200'} rounded-lg text-gray-500`}>Cancelar</button>
            <button onClick={handleOk} className="btn-primary flex-1 py-2 text-[10px]">Selecionar</button>
          </div>
        </div>
      )}
    </div>
  );
}