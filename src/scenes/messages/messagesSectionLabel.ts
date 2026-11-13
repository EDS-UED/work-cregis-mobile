import type { TFunction } from 'i18next';

/** 通知列表 · 分组标题：今天 / 月日（无时分）。 */
export function resolveMessagesSectionLabel(
  sectionDayOffset: number,
  t: TFunction,
  language: string,
): string {
  if (sectionDayOffset === 0) {
    return t('messages.sectionToday');
  }

  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() - sectionDayOffset);

  const dateText = language.startsWith('zh')
    ? `${date.getMonth() + 1}月${date.getDate()}日`
    : date.toLocaleDateString(language, { month: 'short', day: 'numeric' });

  return t('messages.sectionPastDate', { date: dateText });
}
