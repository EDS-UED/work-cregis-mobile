import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { EG_LOCATE_DEFAULT_KEYS, EgLocate } from '@/eds/locate';
import { useEdsTheme } from '@/hooks/useEdsTheme';

type TeamMemberLocateRailProps = {
  scrollRef: React.RefObject<ComponentRef<typeof ScrollView> | null>;
  locateOffsetsRef: React.RefObject<Record<string, number>>;
  /** 正文 `ScrollView` `paddingTop` · 竖向居中区间上沿（Showcase 同源）。 */
  insetTop: number;
  /** 底栏搜索等固定区高度 · 索引不侵入（Showcase 同源 `top`/`bottom` 约束）。 */
  insetBottom: number;
};

/**
 * 成员管理 · 右侧 `EgLocate` · 浮在正文上（`position: 'absolute'` · 不占滚动宽度）。
 * 对齐 Showcase `ShowcaseLocateDemoView` · 无 `scrollContentPaddingRight` 让位。
 */
export function TeamMemberLocateRail({
  scrollRef,
  locateOffsetsRef,
  insetTop,
  insetBottom,
}: TeamMemberLocateRailProps) {
  const { mode } = useEdsTheme();
  const [activeKey, setActiveKey] = useState<string>(EG_LOCATE_DEFAULT_KEYS[0]);
  const lastScrollY = useRef(0);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill} collapsable={false}>
      <EgLocate
        mode={mode}
        keys={EG_LOCATE_DEFAULT_KEYS}
        activeKey={activeKey}
        testID="team-member-locate"
        style={{ top: insetTop, bottom: insetBottom }}
        onActiveKeyChange={(key) => {
          setActiveKey(key);
          lastScrollY.current = locateOffsetsRef.current[key] ?? lastScrollY.current;
          scrollRef.current?.scrollTo({
            y: lastScrollY.current,
            animated: false,
          });
        }}
      />
    </View>
  );
}