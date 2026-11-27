function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/** 业务展示 · 日历日 `yyyy/MM/dd`（月日零填充）。 */
export function formatMobileDateYmd(year: number, month: number, day: number): string {
  return `${year}/${pad2(month)}/${pad2(day)}`;
}

const YMD = /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})$/;
const YMD_TIME = /^(\d{4})[./-](\d{1,2})[./-](\d{1,2})\s+(.+)$/;

/**
 * 将 ISO / 点号 / 横线等存储形态规范为 Mobile 展示日 `yyyy/MM/dd`。
 * 无法解析时原样返回。
 */
export function formatMobileDate(value: string): string {
  const trimmed = value.trim();
  const withTime = YMD_TIME.exec(trimmed);
  if (withTime) {
    return formatMobileDateYmd(
      Number(withTime[1]),
      Number(withTime[2]),
      Number(withTime[3]),
    );
  }
  const dateOnly = YMD.exec(trimmed);
  if (dateOnly) {
    return formatMobileDateYmd(
      Number(dateOnly[1]),
      Number(dateOnly[2]),
      Number(dateOnly[3]),
    );
  }
  return trimmed;
}

/** 日历日 + 保留原时分秒 · 日期段为 `yyyy/MM/dd`。 */
export function formatMobileDateTime(value: string): string {
  const trimmed = value.trim();
  const match = YMD_TIME.exec(trimmed);
  if (!match) {
    return formatMobileDate(trimmed);
  }
  const date = formatMobileDateYmd(Number(match[1]), Number(match[2]), Number(match[3]));
  return `${date} ${match[4]}`;
}