import { StyleSheet } from 'react-native';

import { EgSymbol } from '@/eds/home-ui';
import { getThemeColors } from '@/eds/theme';
import mobileTheme from '@/eds/tokens';
import { EgEdsAnimaPress } from '@eds/internal/dist/components/shared/motion/EgEdsAnimaPress.js';
import { resolveEgSymbolActionAppearance } from '@eds/internal/dist/components/molecules/button/button-symbol/resolveEgSymbolActionAppearance.js';
import {
  resolveEgSymbolActionContainerPx,
  resolveEgSymbolActionSymbolSize,
} from '@eds/internal/dist/components/molecules/button/button-symbol/resolveEgSymbolActionMetrics.js';
import type { ThemeMode } from '@eds/internal/dist/components/theme/index.js';

type TeamInfoTeamIdCopySymbolActionProps = {
  mode: ThemeMode;
  copied: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

/**
 * 团队编号复制 · `EgSymbolAction` 等价 `xs` + `plain`（无描边 token 入参，故本地复刻度量）。
 */
export function TeamInfoTeamIdCopySymbolAction({
  mode,
  copied,
  onPress,
  accessibilityLabel,
}: TeamInfoTeamIdCopySymbolActionProps) {
  const colors = getThemeColors(mode);
  const dimension = resolveEgSymbolActionContainerPx('xs');
  const symbolSize = resolveEgSymbolActionSymbolSize('xs');
  const icon = copied ? 'eds-enable-fill' : 'eds-copy';

  return (
    <EgEdsAnimaPress
      accessibilityLabel={accessibilityLabel}
      disabled={false}
      onPress={onPress}
      pressScaleDirection="down"
      pressIntensity="lg"
      style={({ pressed }) => {
        const appearance = resolveEgSymbolActionAppearance(colors, 'plain', pressed);
        return [
          styles.base,
          {
            width: dimension,
            height: dimension,
            borderRadius: mobileTheme.spacing['radius-full'] as number,
            backgroundColor: appearance.backgroundColor,
          },
        ];
      }}
    >
      {() => (
        <EgSymbol
          name={icon}
          size={symbolSize}
          mode={mode}
          strokeColorToken={copied ? 'status-success' : 'text-base-secondary'}
          strokeScaleToken={copied ? undefined : 'stroke-lg'}
          accessibilityLabel=""
        />
      )}
    </EgEdsAnimaPress>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});