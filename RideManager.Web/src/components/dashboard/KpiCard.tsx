import { Card } from '../ui/card'
interface KpiCardProps {
  icon: string
  label: string
  value: number
  trend: 'up' | 'down'
  color: 'blue' | 'green' | 'teal' | 'red'
}

const COLOR_MAP = {
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
  teal: 'bg-teal-500/10',
  red: 'bg-red-500/10',
}

const TREND_MAP = {
  up: { icon: '↗', color: 'text-green-400' },
  down: { icon: '↘', color: 'text-red-400' },
}

export default function KpiCard({
  icon,
  label,
  value,
  trend,
  color,
}: KpiCardProps) {
  return (
    <Card className="flex flex-row items-center gap-4 border-[#2a2d3a] bg-[#181b26] p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${COLOR_MAP[color]} text-sm`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="mb-1 text-xs text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
      <span className={`text-lg ${TREND_MAP[trend].color}`}>
        {TREND_MAP[trend].icon}
      </span>
    </Card>
  )
}
