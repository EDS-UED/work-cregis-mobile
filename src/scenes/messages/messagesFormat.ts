/** `EgMessage` 未读数 · `0` 不展示；`>99` 固定 `99+`。 */
export function formatNotificationCountBadge(count: number): string | undefined {
  if (count <= 0) {
    return undefined;
  }
  if (count > 99) {
    return '99+';
  }
  return String(count);
}

/** 分类内页行尾 · 仅 `HH:mm`（日期由分组小标题承担）。 */
export function formatMessageTimeLabel(timeHm: string): string {
  return timeHm;
}

/** 地址展示 · 前 4 + … + 后 4。 */
export function formatMessageAddressShort(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length <= 11) {
    return trimmed;
  }
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}
