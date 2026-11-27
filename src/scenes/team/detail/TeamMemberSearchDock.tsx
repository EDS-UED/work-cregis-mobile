import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { EdsSemanticAnima } from '@/eds/animations';
import { EgSearch, type EgSearchHandle } from '@/eds/search';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  teamMemberSearchDockFocusedEdgeInset,
  teamMemberSearchDockRestEdgeInset,
  teamMemberSearchEgSearchChromeStyle,
} from '@/scenes/team/detail/teamMemberSearchDockLayout';

type TeamMemberSearchDockProps = {
  query: string;
  onChangeQuery: (value: string) => void;
};

/**
 * 成员底栏搜索 · 与 Showcase `ShowcaseSearchDemoView` 同源：
 * dock `padding` + `searchChromeReset`，键盘 `offset` 弹簧。
 */
export function TeamMemberSearchDock({ query, onChangeQuery }: TeamMemberSearchDockProps) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const searchRef = useRef<EgSearchHandle>(null);

  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const restEdge = teamMemberSearchDockRestEdgeInset(spacing);
  const inputEdge = teamMemberSearchDockFocusedEdgeInset(spacing);
  const idleBottom = Math.max(insets.bottom, restEdge);
  const offsetSpring = useMemo(() => EdsSemanticAnima('offset').springConfig, []);
  const translateY = useSharedValue(0);
  const appliedShift = useRef<number | null>(null);
  const raster = useSharedValue(false);

  const searchChromeStyle = useMemo(() => teamMemberSearchEgSearchChromeStyle(), []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const shift = useMemo(() => {
    if (!inputFocused || keyboardHeight <= 0) return 0;
    return idleBottom - keyboardHeight - inputEdge;
  }, [idleBottom, inputEdge, inputFocused, keyboardHeight]);

  useEffect(() => {
    if (appliedShift.current === shift) return;
    const first = appliedShift.current === null;
    appliedShift.current = shift;
    if (first) {
      translateY.value = shift;
      return;
    }
    raster.value = true;
    translateY.value = withSpring(shift, offsetSpring, (finished) => {
      if (finished) raster.value = false;
    });
  }, [offsetSpring, raster, shift, translateY]);

  const dockMotionStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    shouldRasterizeIOS: raster.value,
    renderToHardwareTextureAndroid: raster.value,
  }));

  return (
    <Animated.View
      collapsable={false}
      style={[
        styles.dock,
        {
          paddingBottom: idleBottom,
          paddingHorizontal: inputFocused ? inputEdge : restEdge,
        },
        dockMotionStyle,
      ]}
    >
      <EgSearch
        ref={searchRef}
        mode={mode}
        value={query}
        onChangeText={onChangeQuery}
        placeholder={t('team.searchPlaceholder')}
        onFocus={() => setInputFocused(true)}
        onBlur={() => setInputFocused(false)}
        style={searchChromeStyle}
        testID="team-member-search"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    overflow: 'visible',
    alignSelf: 'stretch',
  },
});