import dayjs from 'dayjs'

export function transDate(time: string | number | Date) {
  if (!time) return ''
  return dayjs(time).format('YYYY-MM-DD')
}

export function transTime(time: string | number | Date) {
  if (!time) return ''
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}
