/** 成员列表字母索引 · 拉丁首字母大写，其余归 `#`。 */
export function teamMemberLocateKey(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '#';
  const first = trimmed[0];
  if (first && /[a-zA-Z]/.test(first)) {
    return first.toUpperCase();
  }
  return '#';
}