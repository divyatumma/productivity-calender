import { useMemo, useState } from "react"
import PropTypes from "prop-types"

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function CalendarGrid({ setActiveDate }) {
  const [viewDate, setViewDate] = useState(new Date())
  const [range, setRange] = useState({ start: null, end: null })
  const [statusMap, setStatusMap] = useState({})

  const monthData = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const totalDays = new Date(year, month + 1, 0).getDate()
    const leadingEmptyDays = firstDay.getDay()

    const cells = []

    for (let day = 0; day < leadingEmptyDays; day += 1) {
      cells.push({ key: `empty-${year}-${month}-${day}`, date: null })
    }

    for (let day = 1; day <= totalDays; day += 1) {
      const date = new Date(year, month, day)
      cells.push({ key: formatDate(date), date })
    }

    return {
      monthName: firstDay.toLocaleString("en-US", { month: "long" }),
      year,
      cells,
    }
  }, [viewDate])

  const handleDateClick = (date) => {
    if (!date) return

    setActiveDate(formatDate(date))

    if (range.start === null) {
      setRange({ start: date, end: null })
      return
    }

    if (range.end === null) {
      if (date < range.start) {
        setRange({ start: date, end: range.start })
      } else {
        setRange({ start: range.start, end: date })
      }
      return
    }

    setRange({ start: date, end: null })
  }

  const isInRange = (date) => {
    if (!date || range.start === null || range.end === null) return false
    return date >= range.start && date <= range.end
  }

  const updateStatus = (date, value) => {
    if (!date) return

    setStatusMap((prev) => ({
      ...prev,
      [formatDate(date)]: value,
    }))
  }

  const getStatus = (date) => {
    if (!date) return null
    return statusMap[formatDate(date)]
  }

  const getColor = (date) => {
    if (!date) return "opacity-0"

    const status = getStatus(date)

    if (status === "done") return "bg-green-500 text-white"
    if (status === "partial") return "bg-yellow-400"
    if (status === "missed") return "bg-red-500 text-white"
    if (isInRange(date)) return "bg-blue-200"

    return "hover:bg-black hover:text-white"
  }

  const selectedDates =
    range.start && range.end
      ? Array.from(
          { length: (range.end - range.start) / (1000 * 60 * 60 * 24) + 1 },
          (_, index) => {
            const nextDate = new Date(range.start)
            nextDate.setDate(nextDate.getDate() + index)
            return nextDate
          }
        )
      : []

  const totalDays = selectedDates.length
  const completedDays = selectedDates.filter((date) => getStatus(date) === "done").length
  const progress = totalDays > 0 ? (completedDays / totalDays) * 100 : 0

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {monthData.monthName} {monthData.year}
        </h1>

        <div className="flex gap-2">
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
            className="rounded border px-2 py-1 text-sm"
          >
            Prev
          </button>
          <button
            onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
            className="rounded border px-2 py-1 text-sm"
          >
            Next
          </button>
        </div>
      </div>

      {totalDays > 0 && (
        <div className="mb-4">
          <p className="mb-1 text-sm text-gray-700">
            You completed {completedDays}/{totalDays} days
          </p>

          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-green-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-2 grid grid-cols-7 text-center text-sm font-semibold">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday}>{weekday}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-x-2 gap-y-6 sm:gap-x-3 sm:gap-y-8">
        {monthData.cells.map((cell) => (
          <div key={cell.key} className="flex min-h-17.5 flex-col items-center">
            <button
              disabled={cell.date === null}
              onClick={() => {
                const date = cell.date

                handleDateClick(date)

                if (isInRange(date)) {
                  const current = getStatus(date)

                  if (!current) updateStatus(date, "done")
                  else if (current === "done") updateStatus(date, "partial")
                  else if (current === "partial") updateStatus(date, "missed")
                  else updateStatus(date, null)
                }
              }}
              className={`h-10 w-10 rounded-full ${getColor(cell.date)}`}
            >
              {cell.date?.getDate()}
            </button>

            {cell.date && isInRange(cell.date) && (
              <div className="mt-2 flex flex-wrap justify-center gap-1 text-xs">
                <button
                  className="px-1 py-0.5 text-[10px] sm:text-xs"
                  onClick={() => updateStatus(cell.date, "done")}
                >
                  ✅
                </button>
                <button
                  className="px-1 py-0.5 text-[10px] sm:text-xs"
                  onClick={() => updateStatus(cell.date, "partial")}
                >
                  ⚠️
                </button>
                <button
                  className="px-1 py-0.5 text-[10px] sm:text-xs"
                  onClick={() => updateStatus(cell.date, "missed")}
                >
                  ❌
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

CalendarGrid.propTypes = {
  setActiveDate: PropTypes.func.isRequired,
}
export default CalendarGrid
