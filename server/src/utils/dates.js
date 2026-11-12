// All dates are handled in UTC; the client sends YYYY-MM-DD strings.
const monthRange = (month) => {
  const [y, m] = (month || '').split('-').map(Number)
  const now = new Date()
  const year = y || now.getUTCFullYear()
  const mon = m || now.getUTCMonth() + 1
  return {
    year,
    month: mon,
    start: new Date(Date.UTC(year, mon - 1, 1)),
    end: new Date(Date.UTC(year, mon, 1)),
    daysInMonth: new Date(Date.UTC(year, mon, 0)).getUTCDate(),
  }
}

const monthKey = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

const addMonths = (date, n, anchorDay = date.getUTCDate()) => {
  const y = date.getUTCFullYear()
  const m = date.getUTCMonth() + n
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate()
  return new Date(Date.UTC(y, m, Math.min(anchorDay, last)))
}

const advance = (date, frequency, anchorDay) => {
  if (frequency === 'weekly') return new Date(date.getTime() + 7 * 86400000)
  if (frequency === 'yearly') return addMonths(date, 12, anchorDay)
  return addMonths(date, 1, anchorDay)
}

const startOfToday = () => {
  const n = new Date()
  return new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()))
}

module.exports = { monthRange, monthKey, addMonths, advance, startOfToday }
