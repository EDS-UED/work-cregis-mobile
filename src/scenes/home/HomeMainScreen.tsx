import { useLayoutEffect } from 'react';

import { HomePageShotHost } from '@/scenes/home/HomePageShotHost';
import { HomeScene } from '@/scenes/home/HomeScene';
import { useHomeMainScreenOptions } from '@/scenes/home/useHomeMainScreenOptions';
import { useHomeStackNavigation } from '@/scenes/home/useHomeStackNavigation';

/** HomeMain · page-shot 宿主须包住屏内树；栈选项在宿主内结算（便于 header 与 trigger 同上下文）。 */
export function HomeMainScreen() {
  const navigation = useHomeStackNavigation();
  const screenOptions = useHomeMainScreenOptions();

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions);
  }, [navigation, screenOptions]);

  return (
    <HomePageShotHost>
      <HomeScene />
    </HomePageShotHost>
  );
}
