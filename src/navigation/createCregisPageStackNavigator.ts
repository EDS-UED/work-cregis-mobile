import type { ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { createEgEdsAnimaPageNavigator } from '@/eds/page-motion';

/**
 * EDS `createEgEdsAnimaPageNavigator` 运行时按平台切栈；
 * 类型侧统一按 `@react-navigation/stack` 收敛（与 Showcase `as object` 扩展 options 同思路）。
 */
export function createCregisPageStackNavigator<ParamList extends ParamListBase>() {
  return createEgEdsAnimaPageNavigator<ParamList>() as ReturnType<
    typeof createStackNavigator<ParamList>
  >;
}
