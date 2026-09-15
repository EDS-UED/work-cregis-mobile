import type { PropsWithChildren } from 'react';
import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
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

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <I18nextProvider i18n={i18n}>
      <AppBootstrap>{children}</AppBootstrap>
    </I18nextProvider>
  );
}
