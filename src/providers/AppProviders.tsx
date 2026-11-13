import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { EdsFontEpochProvider } from '@/hooks/EdsFontEpochContext';
import { useEdsFontsLoaded } from '@/hooks/useEdsFontsLoaded';
import { useReducedMotionListener } from '@/hooks/useReducedMotionListener';
import { useAppStore } from '@/store';

function AppBootstrap({ children }: PropsWithChildren) {
  const hydratePreferences = useAppStore((state) => state.hydratePreferences);
  const locale = useAppStore((state) => state.locale);

  useReducedMotionListener();

  useEffect(() => {
    void hydratePreferences();
  }, [hydratePreferences]);

  useEffect(() => {
    void i18n.changeLanguage(locale);
  }, [locale]);

  return children;
}

/** 字体后台加载，不挡首屏；就绪后 bump epoch 触发 typography 重绘。 */
function EdsFontGate({ children }: PropsWithChildren) {
  const { loaded, error } = useEdsFontsLoaded();
  const fontEpoch = loaded || error ? 1 : 0;

  useEffect(() => {
    if (error) {
      console.warn('[EDS] font load failed', error);
    }
  }, [error]);

  return (
    <EdsFontEpochProvider epoch={fontEpoch}>
      <View style={styles.fontRoot}>{children}</View>
    </EdsFontEpochProvider>
  );
}

const styles = StyleSheet.create({
  fontRoot: { flex: 1 },
});

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <AppBootstrap>
        <EdsFontGate>{children}</EdsFontGate>
      </AppBootstrap>
    </I18nextProvider>
  );
}
