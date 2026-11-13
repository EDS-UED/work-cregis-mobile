import { useHomeStore } from '@/store';

/** 首页 / 个人中心共用的用户展示名（去掉种子数据末尾 `.`）。 */
export function formatHomeUserDisplayName(raw: string): string {
  return raw.replace(/\.\s*$/, '');
}

export function useHomeUserDisplayName(): string {
  const raw = useHomeStore((state) => state.userDisplayName);
  return formatHomeUserDisplayName(raw);
}

export function useHomeUserAvatarColorIndex(): number {
  return useHomeStore((state) => state.userAvatarColorIndex);
}
