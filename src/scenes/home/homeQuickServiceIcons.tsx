import type { ReactNode } from 'react';

import { EgSymbol } from '@/eds/home-ui';

import type { QuickServiceDef, QuickServiceId } from '@/scenes/home/homeQuickServicesCatalog';

export const QUICK_SERVICE_DEFAULT_ICON = 'eds-pentagram';

type QuickServiceIconProps = {
  id: QuickServiceId;
  icon: string;
  mode: 'light' | 'dark';
  size?: 'md' | 'lg';
};

/** 首页圆底 / Sheet / 编辑格 · 与目录 `icon` 一致（默认五角星）。 */
export function QuickServiceHomeIcon({
  icon,
  mode,
  size = 'md',
}: QuickServiceIconProps): ReactNode {
  const asset = icon || QUICK_SERVICE_DEFAULT_ICON;
  return (
    <EgSymbol name={asset} mode={mode} size={size} fillTone="primary" accessibilityLabel="" />
  );
}

/** 快捷入口绿条 · `symbol-lg`。 */
export function QuickServicePinnedBarIcon({ id, icon, mode }: QuickServiceIconProps) {
  return <QuickServiceHomeIcon id={id} icon={icon} mode={mode} size="lg" />;
}

export function quickServiceAccessibilityLabel(
  item: QuickServiceDef,
  t: (key: QuickServiceDef['labelKey']) => string,
) {
  return t(item.labelKey);
}
