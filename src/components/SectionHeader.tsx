import CountUp from "react-countup";
import Button from "./buttons/Button";
import { Plus } from "lucide-react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  addBtnText?: string;
  total?: number;
  onAction?: () => void;
  hideAddButton?: boolean;
};

export const SectionHeader = ({
  title,
  subtitle,
  addBtnText,
  total = 0,
  onAction,
  hideAddButton = false,
}: SectionHeaderProps) => {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          {title}
          {total !== 0 && (
            <span className="bg-gray-100 px-3 py-1.5 text-base rounded-lg font-semibold text-gray-700">
              <CountUp end={total} duration={1.5} />
            </span>
          )}
        </h2>
        {subtitle && (
          <p className="text-sm text-gray-600 mt-2">{subtitle}</p>
        )}
      </div>
      {addBtnText && !hideAddButton && (
        <Button onClick={onAction} fullWidth={false}>
          <Plus size={20} />
          <span className="truncate ml-2 text-sm">{addBtnText}</span>
        </Button>
      )}
    </div>
  );
};
