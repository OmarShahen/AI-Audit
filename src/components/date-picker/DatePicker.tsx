"use client";

import { useState } from "react";
import { DateRange, Range } from "react-date-range";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (range: { startDate: Date; endDate: Date }) => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);

  const [tempRange, setTempRange] = useState<Range>({
    startDate,
    endDate,
    key: "selection",
  });

  const [appliedRange, setAppliedRange] = useState<Range>(tempRange);

  const handleSelect = (ranges: any) => {
    setTempRange(ranges.selection);
  };

  const handleApply = () => {
    setAppliedRange(tempRange);
    onChange({
      startDate: tempRange.startDate as Date,
      endDate: tempRange.endDate as Date,
    });
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-sm shadow bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <Calendar className="h-4 w-4 text-gray-500" />
        {format(appliedRange.startDate || new Date(), "MMM d, yyyy")} -{" "}
        {format(appliedRange.endDate || new Date(), "MMM d, yyyy")}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50 rounded-sm border border-gray-200 bg-white shadow-lg">
          <DateRange
            ranges={[tempRange]}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            rangeColors={["#4F46E5"]}
            showDateDisplay={false}
          />
          <div className="p-2 flex justify-end border-t border-gray-100">
            <button
              className="px-4 py-1 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
              onClick={handleApply}
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
