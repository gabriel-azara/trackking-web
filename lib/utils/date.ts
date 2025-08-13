import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import customParseFormat from "dayjs/plugin/customParseFormat"
import relativeTime from "dayjs/plugin/relativeTime"
import "dayjs/locale/pt-br"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.extend(relativeTime)
dayjs.locale("pt-br")

export const formatDate = (date: string | Date, format = "DD/MM/YYYY") => {
  return dayjs(date).format(format)
}

export const formatDateTime = (date: string | Date) => {
  return dayjs(date).format("DD/MM/YYYY HH:mm")
}

export const getToday = (timezone?: string) => {
  const tz = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  return dayjs().tz(tz).format("YYYY-MM-DD")
}

export const isToday = (date: string, timezone?: string) => {
  return date === getToday(timezone)
}

export const getDaysUntil = (date: string) => {
  return dayjs(date).diff(dayjs(), "day")
}

export const isOverdue = (date: string) => {
  return dayjs(date).isBefore(dayjs(), "day")
}

export const getRelativeTime = (date: string | Date) => {
  return dayjs(date).fromNow()
}

export const getWeekDays = () => {
  return [
    { value: 0, label: "Dom", fullLabel: "Domingo" },
    { value: 1, label: "Seg", fullLabel: "Segunda" },
    { value: 2, label: "Ter", fullLabel: "Terça" },
    { value: 3, label: "Qua", fullLabel: "Quarta" },
    { value: 4, label: "Qui", fullLabel: "Quinta" },
    { value: 5, label: "Sex", fullLabel: "Sexta" },
    { value: 6, label: "Sáb", fullLabel: "Sábado" },
  ]
}
