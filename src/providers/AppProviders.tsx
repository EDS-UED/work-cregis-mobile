import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { useEdsFontsLoaded } from '@/hooks/useEdsFontsLoaded';
import { useReducedMotionListener } from '@/hooks/useReducedMotionListener';
import { useAppStore } from '@/store';

function AppBootstrap({ children }: PropsWithChildren) {
  const hydratePreferences = useAppStore((state) => state.hydratePreferences);

  useReducedMotionListener();

  useEffect(() => {
    void hydratePreferences().then(() => {
      const locale = useAppStore.getState().locale;
      void i18n.changeLanguage(locale);
    });
  }, [hydratePreferences]);

  return children;
}

/** 后台加载字体，不挡首屏；bundle 就绪即可进导航（字体就绪后自动重绘）。 */
function EdsFontGate({ children }: PropsWithChildren) {
  const { error } = useEdsFontsLoaded();

  useEffect(() => {
    if (error) {
      console.warn('[EDS] font load failed', error);
    }
  }, [error]);

  return children;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <AppBootstrap>
        <EdsFontGate>{children}</EdsFontGate>
      </AppBootstrap>
    </I18nextProvider>
  );
}
