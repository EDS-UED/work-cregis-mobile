import { useLayoutEffect } from 'react';
import type { StackScreenProps } from '@react-navigation/stack';

import { CompareHomeTodoDividerPageShotHost } from '@/scenes/compare/home-todo-divider/CompareHomeTodoDividerPageShotHost';
import { CompareHomeTodoDividerScene } from '@/scenes/compare/home-todo-divider/CompareHomeTodoDividerScene';
import { useCompareHomeTodoDividerScreenOptions } from '@/scenes/compare/home-todo-divider/useCompareHomeTodoDividerScreenOptions';
import type { TransactionRecordsStackParamList } from '@/navigation/types';

type Props = StackScreenProps<TransactionRecordsStackParamList, 'CompareHomeTodoDivider'>;

/** 对比 · 主页-待办-分割线（栈顶选项 + page-shot 宿主）。 */
export function CompareHomeTodoDividerScreen({ navigation }: Props) {
  const screenOptions = useCompareHomeTodoDividerScreenOptions();

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions);
  }, [navigation, screenOptions]);

  return (
    <CompareHomeTodoDividerPageShotHost>
      <CompareHomeTodoDividerScene />
    </CompareHomeTodoDividerPageShotHost>
  );
}