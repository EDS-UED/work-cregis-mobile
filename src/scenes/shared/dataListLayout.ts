import type { ViewStyle } from 'react-native';

import {
  EG_DATA_LIST_PRESS_INTENSITY,
  egDataListRowGap,
  egDataListSectionStyle,
  getEgDataListRowLayout,
  type EgDataListRowLayout,
} from '@/eds/data-list';
import mobileTheme from '@/eds/tokens';
import { edsSceneContentInset } from '@/utils/edsTheme';

export const DL_PRESS_INTENSITY = EG_DATA_LIST_PRESS_INTENSITY;

export type DataListRowLayout = EgDataListRowLayout;

export function getDataListRowLayout(
  spacing: typeof mobileTheme.spacing,
): DataListRowLayout {
  return getEgDataListRowLayout(edsSceneContentInset(spacing));
}

export function dataListRowShellInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return getDataListRowLayout(spacing).marginH;
}

export function dataListScreenInset(
  spacing: typeof mobileTheme.spacing,
): number {
  return getDataListRowLayout(spacing).contentInsetFromScreen;
}

export function dataListRowGap(
  spacing: typeof mobileTheme.spacing,
): number {
  void spacing;
  return egDataListRowGap();
}

export function dataListSectionStyle(
  spacing: typeof mobileTheme.spacing,
): ViewStyle {
  return egDataListSectionStyle(
    edsSceneContentInset(spacing),
    egDataListRowGap(),
  );
}