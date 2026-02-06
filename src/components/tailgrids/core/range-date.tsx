import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isWithinInterval,
} from 'date-fns';

type PropsType = {
  defaultStartDate?: Date;
  defaultEndDate?: Date;
  onDateChange?: (startDate: Date | null, endDate: Date | null) => void;
};

export function RangeDatePicker({
  defaultStartDate = new Date(2028, 7, 25),
  defaultEndDate = new Date(2028, 8, 9),
  onDateChange,
}: PropsType) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2028, 7, 1));
  const [startDate, setStartDate] = useState<Date | null>(defaultStartDate);
  const [endDate, setEndDate] = useState<Date | null>(defaultEndDate);
  const [tempStartDate, setTempStartDate] = useState<Date | null>(
    defaultStartDate,
  );
  const [tempEndDate, setTempEndDate] = useState<Date | null>(defaultEndDate);

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

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
  };

  const handleOk = () => {
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
    onDateChange?.(tempStartDate, tempEndDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const renderCalendar = (monthDate: Date) => {
    const monthStart = startOfMonth(monthDate);
    const monthEnd = endOfMonth(monthDate);
    const startDay = monthStart.getDay();

    const prevMonthEnd = endOfMonth(subMonths(monthDate, 1));
    const prevMonthDays = eachDayOfInterval({
      start: new Date(
        prevMonthEnd.getFullYear(),
        prevMonthEnd.getMonth(),
        prevMonthEnd.getDate() - startDay + 1,
      ),
      end: prevMonthEnd,
    });

    const currentMonthDays = eachDayOfInterval({
      start: monthStart,
      end: monthEnd,
    });

    const totalCells = prevMonthDays.length + currentMonthDays.length;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonthDays = Array.from({ length: remainingCells }, (_, i) => {
      const nextMonth = addMonths(monthDate, 1);
      return new Date(nextMonth.getFullYear(), nextMonth.getMonth(), i + 1);
    });

    const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];

    return (
      <div className="grid grid-cols-7">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div
            key={day}
            className="py-2 text-center text-xs font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
        {allDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthDate);
          const isStart = tempStartDate && isSameDay(day, tempStartDate);
          const isEnd = tempEndDate && isSameDay(day, tempEndDate);
          const isInRange =
            tempStartDate &&
            tempEndDate &&
            isWithinInterval(day, { start: tempStartDate, end: tempEndDate }) &&
            !isStart &&
            !isEnd;

          let classes =
            'text-center inline-flex items-center justify-center text-sm size-12 font-medium rounded-full';

          if (!isCurrentMonth) {
            classes += ' text-gray-400';
          } else {
            classes +=
              ' text-gray-800 dark:text-white/90 cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10';

            if (isStart && isEnd) {
              classes =
                'text-center inline-flex items-center justify-center size-12 cursor-pointer bg-primary-500 text-white font-medium rounded-full';
            } else if (isStart) {
              classes =
                'text-center inline-flex items-center justify-center size-12 cursor-pointer bg-primary-500 text-white font-medium rounded-l-full';
            } else if (isEnd) {
              classes =
                'text-center inline-flex items-center justify-center size-12 cursor-pointer bg-primary-500 text-white font-medium rounded-r-full';
            } else if (isInRange) {
              classes =
                'text-center -mx-px border-l-transparent inline-flex items-center justify-center size-12 cursor-pointer bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-white/90 font-medium rounded-none';
            }
          }

          return (
            <div
              key={index}
              className={classes}
              onClick={() => isCurrentMonth && handleDateClick(day)}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    );
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM d, yyyy')} - ${format(
        endDate,
        'MMM d, yyyy',
      )}`;
    }
    return 'Select date';
  };

  return (
    <div className="relative mx-auto">
      {/* Date Input */}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:ring-primary-500 flex min-w-sm cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-left text-sm text-gray-800 focus:ring-2 focus:outline-none dark:border-gray-800 dark:bg-white/5 dark:text-white/90"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M15.9163 8.24969H4.08331V15.8337C4.08349 16.1097 4.30728 16.3337 4.58331 16.3337H15.4163C15.6924 16.3337 15.9161 16.1097 15.9163 15.8337V8.24969ZM15.9163 4.99969C15.9161 4.7237 15.6924 4.49969 15.4163 4.49969H4.58331C4.30728 4.49969 4.08349 4.7237 4.08331 4.99969V6.74969H15.9163V4.99969ZM17.4163 15.8337C17.4161 16.9381 16.5208 17.8337 15.4163 17.8337H4.58331C3.47885 17.8337 2.58349 16.9381 2.58331 15.8337V4.99969C2.58349 3.89528 3.47885 2.99969 4.58331 2.99969H5.91632V2.29169C5.91632 1.87758 6.25226 1.54186 6.66632 1.54169C7.08053 1.54169 7.41632 1.87747 7.41632 2.29169V2.99969H12.5833V2.29169C12.5833 1.87747 12.9191 1.54169 13.3333 1.54169C13.7475 1.54169 14.0833 1.87747 14.0833 2.29169V2.99969H15.4163C16.5208 2.99969 17.4161 3.89528 17.4163 4.99969V15.8337Z"
            fill="currentColor"
          />
        </svg>
        <span>{formatDateRange()}</span>
      </button>

      {/* Calendar Container */}
      {isOpen && (
        <div className="absolute z-50 min-w-3xl translate-y-4 rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
          {/* Two Month View */}
          <div className="flex flex-col divide-y divide-gray-200 md:flex-row md:divide-x md:divide-y-0 dark:divide-gray-800">
            {/* First Month */}
            <div className="p-5 md:w-1/2">
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="cursor-pointer rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  {format(currentDate, 'MMMM yyyy')}
                </h3>
                <div className="w-9" />
              </div>
              {renderCalendar(currentDate)}
            </div>

            {/* Second Month */}
            <div className="p-5 md:w-1/2">
              <div className="mb-4 flex items-center justify-between">
                <div className="w-9" />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white/90">
                  {format(addMonths(currentDate, 1), 'MMMM yyyy')}
                </h3>
                <button
                  onClick={handleNextMonth}
                  className="cursor-pointer rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              {renderCalendar(addMonths(currentDate, 1))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 divide-x divide-gray-200 border-t border-gray-200 dark:divide-gray-800 dark:border-gray-800">
            <div className="p-4">
              <button
                onClick={handleCancel}
                className="w-full flex-1 cursor-pointer rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
            <div className="p-4">
              <button
                onClick={handleOk}
                className="bg-primary-600 hover:bg-primary-700 w-full flex-1 cursor-pointer rounded-lg px-6 py-3 font-medium text-white"
              >
                Ok
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
