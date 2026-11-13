/** 地址展示 · 前 4 + … + 后 4。 */
export function formatMessageAddressShort(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length <= 11) {
    return trimmed;
  }
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`;
}
