import dayjs from 'dayjs';
import TimeAgo, { LocaleData } from 'javascript-time-ago';
import { getI18n } from '@/i18n';
import en from 'javascript-time-ago/locale/en';
import zh from 'javascript-time-ago/locale/zh';
import { FormatStyle } from 'javascript-time-ago/style';

TimeAgo.addLocale(en as LocaleData);
TimeAgo.addLocale(zh as LocaleData);

export const getTimeUnitParts = (timeUnit: string) => {
  const groups = timeUnit.match(/(\d+)([a-z])/);
  if (!groups) return {};
  const num = parseInt(groups[1]);
  const unit = groups[2];
  return { num, unit };
};

export const formatTimeAgo = (
  value: string | Date,
  formatStyle?: string | FormatStyle
) => {
  const time = dayjs(value);
  const timeAgo = new TimeAgo(
    getI18n().global.locale.value === 'zh' ? 'zh' : 'en'
  );
  // @ts-ignore
  return timeAgo.format(time.toDate(), formatStyle);
};
