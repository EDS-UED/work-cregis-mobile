import { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import { EgOdometer } from '@/eds/animations';
import { EgSymbol } from '@/eds/home-ui';
import { EgSymbolAction } from '@/eds/scene-buttons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { useEdsTypography } from '@/hooks/useEdsTypography';
import { SceneText } from '@/scenes/shared/SceneText';
import type { EdsTextVariant } from '@/utils/edsTheme';
import { edsPx } from '@/utils/edsTheme';

function BalanceVisibilityIcon({
  balanceVisible,
  mode,
}: {
  balanceVisible: boolean;
  mode: 'light' | 'dark';
}) {
  const { spacing } = useEdsTheme();
  const iconPx = edsPx(spacing['symbol-xs']);

  return (
    <View
      style={{
        width: iconPx,
        height: iconPx,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <EgSymbol
        name={balanceVisible ? 'eds-eye' : 'eds-close-eye'}
        displayPx={iconPx}
        mode={mode}
        strokeColorToken="text-base-secondary"
      />
    </View>
  );
}

/** 首页 / 钱包 · 资产折合区：标题行 + 金额（EgOdometer）+ 可选右侧图表钮。 */
export function BalanceHeroBlock({
  balanceVisible,
  balanceText,
  balanceOdometerIntroKey,
  balanceLabel,
  mode,
  colors,
  spacing,
  labelToAmountGap,
  onToggle,
  hideBalanceLabel,
  showBalanceLabel,
  assetChartLabel,
  onAssetChartPress,
  showAssetChart = true,
  amountTestID = 'balance-amount',
  assetChartTestID = 'balance-asset-chart',
  labelVariant = 'bodyMediumStrong' as EdsTextVariant,
  amountVariant = 'display' as EdsTextVariant,
  labelColorToken = 'text-base-secondary' as const,
  animateAmountIntro = true,
}: {
  balanceVisible: boolean;
  balanceText: string;
  balanceOdometerIntroKey?: number;
  balanceLabel: string;
  mode: 'light' | 'dark';
  colors: ReturnType<typeof useEdsTheme>['colors'];
  spacing: ReturnType<typeof useEdsTheme>['spacing'];
  labelToAmountGap: number;
  onToggle: () => void;
  hideBalanceLabel: string;
  showBalanceLabel: string;
  assetChartLabel: string;
  onAssetChartPress?: () => void;
  showAssetChart?: boolean;
  amountTestID?: string;
  assetChartTestID?: string;
  labelVariant?: EdsTextVariant;
  amountVariant?: EdsTextVariant;
  labelColorToken?: 'text-base-primary' | 'text-base-secondary';
  /** 打开时数字滚动 intro · 切换 Sheet 等场景可关。 */
  animateAmountIntro?: boolean;
}) {
  const odometerIntroKey = balanceOdometerIntroKey ?? 0;
  const typography = useEdsTypography();
  const labelIconGap = edsPx(spacing['spacing-1']);
  const assetChartGap = edsPx(spacing['spacing-3']);
  const balanceAmountTextStyle = useMemo(
    () => [typography[amountVariant], { color: String(colors['text-base-primary']) }],
    [amountVariant, colors, typography],
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: showAssetChart ? assetChartGap : 0,
        alignSelf: 'stretch',
      }}
    >
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityLabel={balanceVisible ? hideBalanceLabel : showBalanceLabel}
        style={{ flex: 1, flexShrink: 1, minWidth: 0, alignSelf: 'stretch' }}
      >
        <View style={{ gap: labelToAmountGap }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: labelIconGap,
            }}
          >
            <SceneText
              variant={labelVariant}
              style={{ color: String(colors[labelColorToken]) }}
            >
              {balanceLabel}
            </SceneText>
            <BalanceVisibilityIcon balanceVisible={balanceVisible} mode={mode} />
          </View>
          {balanceVisible ? (
            animateAmountIntro ? (
              <EgOdometer
                key={`${balanceText}-${odometerIntroKey}`}
                value={balanceText}
                animateIntro
                textStyle={balanceAmountTextStyle}
                testID={amountTestID}
              />
            ) : (
              <SceneText
                variant={amountVariant}
                style={{ color: String(colors['text-base-primary']) }}
                testID={amountTestID}
              >
                {balanceText}
              </SceneText>
            )
          ) : (
            <SceneText variant={amountVariant}>{balanceText}</SceneText>
          )}
        </View>
      </Pressable>
      {showAssetChart ? (
        <EgSymbolAction
          size="xl"
          tone="plain"
          icon="eds-pie-chart-color"
          mode={mode}
          onPress={onAssetChartPress}
          accessibilityLabel={assetChartLabel}
          testID={assetChartTestID}
        />
      ) : null}
    </View>
  );
}