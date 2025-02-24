import { useTimeAgo, type UseTimeAgoMessages, type UseTimeAgoUnitNamesDefault } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

const INVALID_DATE_MSG = ''
export default function formatLocaleTimeAgo(date: Date | string | undefined | null) {
  if (date === undefined || date === null) {
    return INVALID_DATE_MSG
  }

  if (typeof date === 'string') {
    date = new Date(date)
  }

  const { t } = useI18n()

  const pf = (past: boolean) => (past ? '.past' : '.future')
  const messages: UseTimeAgoMessages<UseTimeAgoUnitNamesDefault> = {
    justNow: t('timeAgo.just-now'),
    past: (n) => (n.match(/\d/) ? t('timeAgo.ago', [n]) : n),
    future: (n) => (n.match(/\d/) ? t('timeAgo.in', [n]) : n),
    month: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-month')
          : t('timeAgo.next-month')
        : `${n} ${t(`timeAgo.month` + pf(past), n)}`,
    year: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-year')
          : t('timeAgo.next-year')
        : `${n} ${t(`timeAgo.year` + pf(past), n)}`,
    day: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.yesterday')
          : t('timeAgo.tomorrow')
        : `${n} ${t(`timeAgo.day` + pf(past), n)}`,
    week: (n, past) =>
      n === 1
        ? past
          ? t('timeAgo.last-week')
          : t('timeAgo.next-week')
        : `${n} ${t(`timeAgo.week` + pf(past), n)}`,
    hour: (n, past) => `${n} ${t('timeAgo.hour' + pf(past), n)}`,
    minute: (n, past) => `${n} ${t('timeAgo.minute' + pf(past), n)}`,
    second: (n, past) => `${n} ${t(`timeAgo.second` + pf(past), n)}`,
    invalid: INVALID_DATE_MSG,
  }

  return useTimeAgo(date, {
    fullDateFormatter: (date) => date.toLocaleString(),
    messages,
  })
}
