//Under Development

interface CodeQualityBarProps {
  label: string;
  value: number;
  color: string;
}

export function CodeQualityBar({ label, value, color }: CodeQualityBarProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-600 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-medium text-gray-700">{value}%</span>
    </div>
  );
}