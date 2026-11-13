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

export function useMessagesIosNativeHeaderItems(): Pick<
  NativeStackNavigationOptions,
  'unstable_headerRightItems'
> {
  return useMemo(() => {
    if (!shouldUseEgNavBarNativeStack()) {
      return {};
    }

    return {
      unstable_headerRightItems: (): NativeStackHeaderItem[] => [
        egNavBarNativeStackHeaderGlassItem(<MessagesNavClearButton />),
      ],
    };
  }, []);
}
