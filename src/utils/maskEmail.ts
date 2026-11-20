/** 邮箱脱敏 · `x******x@domain`。展示用，非加密存储。 */
export function maskEmail(email: string): string {
  const trimmed = email.trim();
  const at = trimmed.indexOf('@');
  if (at <= 0) return trimmed;
  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at);
  if (local.length === 1) return `*${domain}`;
  if (local.length === 2) return `${local[0]}*${domain}`;
  const innerStars = '*'.repeat(Math.max(local.length - 2, 6));
  return `${local[0]}${innerStars}${local[local.length - 1]}${domain}`;
}