import { useMemo } from 'react';
import type {
  NativeStackHeaderItem,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import {
  egNavBarNativeStackHeaderGlassItem,
  shouldUseEgNavBarNativeStack,
} from '@/eds/nav-bar';

import { MessagesNavClearButton } from '@/scenes/messages/MessagesNavClearButton';
import { useHomeStore } from '@/store';

export function useMessagesIosNativeHeaderItems(): Pick<
  NativeStackNavigationOptions,
  'unstable_headerRightItems'
> {
  const markAllNotificationsRead = useHomeStore((state) => state.markAllNotificationsRead);

  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {};
    }

    return {
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(
          <MessagesNavClearButton onPress={markAllNotificationsRead} />,
        ),
      ],
    };
  }, [markAllNotificationsRead]);
}
