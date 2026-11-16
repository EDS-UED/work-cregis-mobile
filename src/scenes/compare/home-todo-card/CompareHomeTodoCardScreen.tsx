import { useLayoutEffect } from 'react';
import type { StackScreenProps } from '@react-navigation/stack';

import { CompareHomeTodoCardPageShotHost } from '@/scenes/compare/home-todo-card/CompareHomeTodoCardPageShotHost';
import { CompareHomeTodoCardScene } from '@/scenes/compare/home-todo-card/CompareHomeTodoCardScene';
import { useCompareHomeTodoCardScreenOptions } from '@/scenes/compare/home-todo-card/useCompareHomeTodoCardScreenOptions';
import type { TransactionRecordsStackParamList } from '@/navigation/types';

type Props = StackScreenProps<TransactionRecordsStackParamList, 'CompareHomeTodoCard'>;

/** 对比 · 主页-待办卡片（栈顶选项 + page-shot 宿主）。 */
export function CompareHomeTodoCardScreen({ navigation }: Props) {
  const screenOptions = useCompareHomeTodoCardScreenOptions();

  useLayoutEffect(() => {
    navigation.setOptions(screenOptions);
  }, [navigation, screenOptions]);

  return (
    <CompareHomeTodoCardPageShotHost>
      <CompareHomeTodoCardScene />
    </CompareHomeTodoCardPageShotHost>
  );
}