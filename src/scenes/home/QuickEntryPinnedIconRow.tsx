import { View } from 'react-native';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import type { QuickServiceDef } from '@/scenes/home/homeQuickServicesCatalog';
import { QuickServicePinnedBarIcon } from '@/scenes/home/homeQuickServiceIcons';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

/** 绿条最多展示 icon 数 · 超出在末尾展示 `5+`。 */
export const QUICK_ENTRY_PINNED_BAR_VISIBLE_ICONS = 4;

type QuickEntryPinnedIconRowProps = {
  items: QuickServiceDef[];
};

/** 快捷入口条内 icon · 固定 gap `spacing-5`；>4 时展示前 4 个 + `5+`。 */
export function QuickEntryPinnedIconRow({ items }: QuickEntryPinnedIconRowProps) {
  const { mode, colors, spacing } = useEdsTheme();
  const gap = edsPx(spacing['spacing-5']);
  const visible = items.slice(0, QUICK_ENTRY_PINNED_BAR_VISIBLE_ICONS);
  const showOverflow = items.length > QUICK_ENTRY_PINNED_BAR_VISIBLE_ICONS;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 0,
        gap,
      }}
    >
      {visible.map((item) => (
        <QuickServicePinnedBarIcon key={item.id} id={item.id} icon={item.icon} mode={mode} />
      ))}
      {showOverflow ? (
        <SceneText variant="bodySemibold" style={{ color: String(colors['material-decor']) }}>
          5+
        </SceneText>
      ) : null}
    </View>
  );
}
