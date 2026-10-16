import type { PropsWithChildren } from 'react';
import { useLayoutEffect, useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  EgNavBar,
  egNavBarScrollContentReserve,
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from '@eds-evergreen/mobile';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EdsGlassScreenShell } from '@/scenes/shared/EdsGlassScreenShell';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPageBackground, edsPx, edsSceneContentInset } from '@/utils/edsTheme';
import { nativeNavScrollSurfaceStyle } from '@/utils/nativeNavScrollSurface';

type SceneScaffoldProps = PropsWithChildren<{
  title: string;
  subtitle?: string;
  showNavBack?: boolean;
}>;

export function SceneScaffold({
  title,
  subtitle,
  showNavBack = false,
  children,
}: SceneScaffoldProps) {
  const { colors, mode, spacing } = useEdsTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();

  const tabBarReserve = nativeNavBar ? 0 : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const topReserve = nativeNavBar ? 0 : egNavBarScrollContentReserve(insets.top);
  const backLabel = t('common.back');

  useLayoutEffect(() => {
    if (!nativeNavBar) {
      navigation.setOptions({ headerShown: false });
      return;
    }
    // 栏背景 / scroll edge 由 Stack `egNavBarNativeStackScreenOptions` 提供；此处只同步标题。
    navigation.setOptions({ title });
  }, [nativeNavBar, title, navigation]);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1 },
        content: {
          padding: edsSceneContentInset(spacing),
          gap: edsPx(spacing['spacing-3']),
        },
        subtitleBlock: {
          marginBottom: edsPx(spacing['spacing-1']),
        },
      }),
    [spacing],
  );

  const body = (
    <>
      {subtitle ? (
        <View style={styles.subtitleBlock}>
          <SceneText variant="footnote">{subtitle}</SceneText>
        </View>
      ) : null}
      {children}
    </>
  );

  const pageStyle = [styles.root, { backgroundColor: edsPageBackground(colors) }];

  if (nativeNavBar) {
    return (
      <ScrollView
        style={nativeNavScrollSurfaceStyle(colors)}
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarReserve }]}
      >
        {body}
      </ScrollView>
    );
  }

  return (
    <EdsGlassScreenShell
      style={pageStyle}
      overlay={
        <EgNavBar
          mode={mode}
          title={title}
          background="auto"
          showLeft={showNavBack}
          left={
            showNavBack
              ? {
                  kind: 'icon',
                  icon: 'eds-arrow-left-ios',
                  accessibilityLabel: backLabel,
                  onPress: () => navigation.goBack(),
                }
              : undefined
          }
          scrollOffset={scrollOffset}
        />
      }
    >
      <ScrollView
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topReserve, paddingBottom: tabBarReserve },
        ]}
      >
        {body}
      </ScrollView>
    </EdsGlassScreenShell>
  );
}
