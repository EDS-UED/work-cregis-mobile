import type { ImageSourcePropType } from 'react-native';

import { useHomeStore } from '@/store';

/** 个人资料展示邮箱 · 与设置页账户行同一 Mock。 */
export const PROFILE_ACCOUNT_EMAIL = 'testo@gmail.com';

export function useAccountEmail(): string {
  return useHomeStore((state) => state.accountEmail);
}

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

/** 用户更换后的头像；未设置时返回 undefined，由 `EgAvatar` 画首字母。 */
export function useHomeUserAvatarSource(): ImageSourcePropType | undefined {
  const uri = useHomeStore((state) => state.userAvatarUri);
  return uri ? { uri } : undefined;
}
