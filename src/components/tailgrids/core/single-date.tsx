"use client"

import { cn } from "@/utils/cn";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { createPortal } from "react-dom";

type PropsType = {
  value?: Date | null;
  onChange?: (date: Date) => void;
  placeholder?: string;
  className?: string;
};

export function DatePicker({
  value = null,
  onChange,
  placeholder = "Selecionar data",
  className = ""
}: PropsType) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value);
  const [tempSelected, setTempSelected] = useState<Date | null>(value);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClose = () => setIsOpen(false);

    window.addEventListener("resize", handleClose);
    window.addEventListener("scroll", handleClose, true);

    return () => {
      window.removeEventListener("resize", handleClose);
      window.removeEventListener("scroll", handleClose, true);
    };
  }, [isOpen]);

  useEffect(() => {
    setSelectedDate(value || null);
  }, [value]);

  const togglePicker = () => {
    if (pickerRef.current) {
      const rect = pickerRef.current.getBoundingClientRect();
      const bottomSpace = window.innerHeight - rect.bottom;

      setDropdownPosition({
        top: bottomSpace > 300
          ? rect.bottom + 4
          : rect.top - 230,
        left: rect.left
      });
    }

    setTempSelected(selectedDate);
    setIsOpen(prev => !prev);
  };

  const handleApply = () => {
    if (tempSelected) {
      setSelectedDate(tempSelected);
      onChange?.(tempSelected);
    }
    setIsOpen(false);
  };

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  return (
    <div ref={pickerRef} className={`relative w-full ${className}`}>
      <button
        type="button"
        onClick={togglePicker}
        className={`input-styled flex items-center justify-between w-full text-left font-normal px-3 ${!selectedDate && (isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-400')
          }`}
      >
        <span className="truncate text-md">
          {selectedDate ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
        </span>
        <Calendar size={18} className={isDark ? "text-[rgb(187,225,250)]/60" : "text-gray-400"} />
      </button>

      {isOpen && mounted && createPortal(
        <div
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          className={`fixed z-[9999] w-80 rounded-lg border shadow-xl animate-in fade-in zoom-in-95 overflow-hidden ${isDark ? 'bg-[rgb(27,38,44)] border-[rgb(50,130,184)]/40' : 'bg-white border-gray-200'
            }`}
          ref={dropdownRef}
        >
          <div className="p-2">
            <div className="mb-2 flex items-center justify-between">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className={`p-0.5 rounded hover:bg-white/10 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <ChevronLeft size={14} />
              </button>
              <h2 className={`text-[10px] font-bold uppercase ${isDark ? 'text-[rgb(187,225,250)]' : 'text-gray-900'}`}>
                {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
              </h2>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className={`p-0.5 rounded hover:bg-white/10 ${isDark ? 'text-white' : 'text-gray-600'}`}>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((d, index) => (
                <span key={index} className={`text-[8px] font-bold uppercase ${isDark ? 'text-[rgb(187,225,250)]/40' : 'text-gray-400'}`}>{d}</span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {days.map(day => {
                const isSel = tempSelected && isSameDay(day, tempSelected);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => isCurrentMonth && setTempSelected(day)}
                    className={cn(
                      "h-6 w-full rounded text-[9px] font-medium transition-all flex items-center justify-center",
                      !isCurrentMonth && "opacity-0 pointer-events-none",
                      isSel
                        ? (isDark ? "bg-[rgb(50,130,184)] text-white" : "bg-blue-600 text-white")
                        : (isDark ? "text-[rgb(187,225,250)] hover:bg-[rgb(50,130,184)]/20" : "text-gray-700 hover:bg-gray-100"),
                      isToday(day) && !isSel && (isDark ? "border border-[rgb(50,130,184)] text-[rgb(50,130,184)]" : "border border-blue-600 text-blue-600")
                    )}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={`flex gap-2 p-1.5 border-t ${isDark ? 'border-[rgb(50,130,184)]/20 bg-[rgb(15,76,117)]/10' : 'border-gray-100 bg-gray-50'}`}>
            <button onClick={() => setIsOpen(false)} className={`flex-1 py-1 text-[9px] font-bold uppercase rounded hover:bg-white/5 ${isDark ? 'text-[rgb(187,225,250)]/60' : 'text-gray-500'}`}>
              Cancelar
            </button>
            <button onClick={handleApply} className="btn-primary flex-1 py-1 text-[9px] h-auto min-h-0">
              Aplicar
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}