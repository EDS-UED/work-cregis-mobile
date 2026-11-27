import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useTranslation } from 'react-i18next';

import { EgSymbol, EgSystemTag } from '@/eds/home-ui';
import { EgOptionButton } from '@/eds/scene-buttons';
import { EgTab, type EgTabItem } from '@/eds/tab';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneScaffold } from '@/scenes/shared/SceneScaffold';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

type PeriodId = '7d' | '30d' | '90d' | '180d';
type SegmentId = 'wallet' | 'coin';
type Tone =
  | 'status-warning'
  | 'material-brand'
  | 'material-decor'
  | 'text-brand'
  | 'status-danger';

const TREND = [0.38, 0.52, 0.46, 0.6, 0.55, 0.74, 0.9, 0.86];
const TOTAL = '$24,730.47';

const BREAKDOWN: {
  id: string;
  labelKey: `home.${string}`;
  share: string;
  amount: string;
  tone: Tone;
  flex: number;
}[] = [
  { id: 'available', labelKey: 'home.assetAvailable', share: '82.4%', amount: '$20,377.91', tone: 'material-brand', flex: 824 },
  { id: 'processing', labelKey: 'home.assetProcessing', share: '11.8%', amount: '$2,918.20', tone: 'status-warning', flex: 118 },
  { id: 'sweepable', labelKey: 'home.assetSweepable', share: '5.8%', amount: '$1,434.37', tone: 'material-decor', flex: 58 },
];

const COINS: {
  id: string;
  symbol: string;
  ticker: string;
  name: string;
  share: string;
  bar: number;
  quantity: string;
  fiat: string;
  tone: Tone;
}[] = [
  { id: 'btc', symbol: 'eds-btc-bitcoin', ticker: 'BTC', name: 'Bitcoin', share: '2478.3%', bar: 0.85, quantity: '5.8214 BTC', fiat: '≈ $612,901.44', tone: 'status-warning' },
  { id: 'usdt', symbol: 'eds-usdt-tether usd', ticker: 'USDT', name: 'TRC20', share: '1705.8%', bar: 0.65, quantity: '421,860.5 USDT', fiat: '≈ $421,860.50', tone: 'material-brand' },
  { id: 'eth', symbol: 'eds-eth-ethereum', ticker: 'ETH', name: 'Ethereum', share: '538.1%', bar: 0.4, quantity: '38.436 ETH', fiat: '≈ $133,072.35', tone: 'material-decor' },
  { id: 'usdc', symbol: 'eds-usdc-usdcoin', ticker: 'USDC', name: 'ERC20', share: '362.4%', bar: 0.28, quantity: '89,633.55 USDC', fiat: '≈ $89,633.55', tone: 'text-brand' },
  { id: 'trx', symbol: 'eds-trx-tron', ticker: 'TRX', name: 'TRON', share: '109.6%', bar: 0.14, quantity: '82,450 TRX', fiat: '≈ $27,093.07', tone: 'status-danger' },
];

function TrendChart({
  stroke,
  fill,
  height,
  inset,
  strokeWidth,
}: {
  stroke: string;
  fill: string;
  height: number;
  inset: number;
  strokeWidth: number;
}) {
  const [width, setWidth] = useState(0);
  const line = useMemo(() => {
    if (width <= 0) return '';
    const step = width / (TREND.length - 1);
    return TREND.map((point, index) => {
      const x = index * step;
      const y = height - point * (height - inset);
      return `${index === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  }, [height, inset, width]);

  return (
    <View style={{ height }} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
      {width > 0 && line ? (
        <Svg width={width} height={height}>
          <Path d={`${line} L${width},${height} L0,${height} Z`} fill={fill} />
          <Path d={line} stroke={stroke} strokeWidth={strokeWidth} fill="none" />
        </Svg>
      ) : null}
    </View>
  );
}

function Donut({
  size,
  strokeWidth,
  track,
  slices,
}: {
  size: number;
  strokeWidth: number;
  track: string;
  slices: { color: string; value: number }[];
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  let cursor = 0;

  return (
    <Svg width={size} height={size}>
      <Circle cx={size / 2} cy={size / 2} r={radius} stroke={track} strokeWidth={strokeWidth} fill="none" />
      {slices.map((slice) => {
        const length = (slice.value / total) * circumference;
        const node = (
          <Circle
            key={`${slice.color}-${slice.value}`}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={slice.color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${length} ${circumference - length}`}
            strokeDashoffset={-cursor}
            rotation={-90}
            origin={`${size / 2}, ${size / 2}`}
          />
        );
        cursor += length;
        return node;
      })}
    </Svg>
  );
}

/** 资产分布 — 由首页总额旁的饼图按钮进入。 */
export function AssetDistributionScene() {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const [period, setPeriod] = useState<PeriodId>('7d');
  const [segment, setSegment] = useState<SegmentId>('coin');

  const gap = edsPx(spacing['spacing-2']);
  const cardRadius = edsPx(spacing['radius-sm']);
  const pillRadius = edsPx(spacing['radius-full']);
  const chartHeight = edsPx(spacing['spacing-20']);
  const donutSize = edsPx(spacing['spacing-20']) + edsPx(spacing['spacing-14']) + edsPx(spacing['spacing-1']);
  const barHeight = edsPx(spacing['spacing-2-5']);
  const iconSize = edsPx(spacing['spacing-9']);
  const tone = useCallback((key: Tone) => String(colors[key]), [colors]);

  const periods: { id: PeriodId; label: string }[] = [
    { id: '7d', label: t('home.assetPeriod7d') },
    { id: '30d', label: t('home.assetPeriod30d') },
    { id: '90d', label: t('home.assetPeriod90d') },
    { id: '180d', label: t('home.assetPeriod180d') },
  ];

  const tabs: EgTabItem[] = [
    { id: 'wallet', label: t('home.assetByWallet') },
    { id: 'coin', label: t('home.assetByCoin') },
  ];

  const headerTitle = useCallback(
    () => (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
        <SceneText variant="title">{t('home.assetDistribution')}</SceneText>
        <EgSystemTag
          mode={mode}
          size="sm"
          systemType="strokeSubtle"
          status="success"
          label={t('home.assetDistributionBadge')}
        />
      </View>
    ),
    [gap, mode, t],
  );

  const card = {
    backgroundColor: String(colors['box-flotation']),
    borderRadius: cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: String(colors['stroke-base-quaternary']),
    paddingHorizontal: edsPx(spacing['spacing-4']),
    paddingVertical: edsPx(spacing['spacing-3']),
  } as const;

  return (
    <SceneScaffold title={t('home.assetDistribution')} showNavBack customHeaderTitle={headerTitle}>
      <View style={{ gap: edsPx(spacing['spacing-1']) }}>
        <SceneText variant="footnoteStrong" style={{ textTransform: 'uppercase' }}>
          {t('home.assetTotal')}
        </SceneText>
        <SceneText variant="display">{TOTAL}</SceneText>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
        {periods.map((item) => (
          <EgOptionButton
            key={item.id}
            mode={mode}
            size="sm"
            active={period === item.id}
            labelStyle={period === item.id ? 'brand' : undefined}
            label={item.label}
            accessibilityLabel={item.label}
            onPress={() => setPeriod(item.id)}
          />
        ))}
      </View>

      <View style={{ ...card, gap: edsPx(spacing['spacing-3']) }}>
        <TrendChart
          stroke={tone('material-brand')}
          fill={String(colors['material-brand-weaken'])}
          height={chartHeight}
          inset={gap}
          strokeWidth={edsPx(spacing['stroke-xl'])}
        />
        <View
          style={{
            flexDirection: 'row',
            height: barHeight,
            borderRadius: pillRadius,
            overflow: 'hidden',
            backgroundColor: String(colors['material-card-shallow']),
          }}
        >
          {BREAKDOWN.map((item) => (
            <View key={item.id} style={{ flex: item.flex, backgroundColor: tone(item.tone) }} />
          ))}
        </View>
        <View>
          {BREAKDOWN.map((item, index) => (
            <View
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: edsPx(spacing['spacing-1-5']),
                borderTopWidth: index === 0 ? 0 : StyleSheet.hairlineWidth,
                borderTopColor: String(colors['stroke-base-quaternary']),
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap }}>
                <View
                  style={{
                    width: barHeight,
                    height: barHeight,
                    borderRadius: pillRadius,
                    backgroundColor: tone(item.tone),
                  }}
                />
                <SceneText variant="bodySmall">{t(item.labelKey)}</SceneText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-1-5']) }}>
                <SceneText variant="bodySmallSemibold">{item.share}</SceneText>
                <SceneText variant="footnote">{item.amount}</SceneText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <EgTab
        mode={mode}
        items={tabs}
        selectedId={segment}
        onSelect={(id) => setSegment(id as SegmentId)}
        swipeToSwitch={false}
        accessibilityLabel={t('home.assetDistribution')}
      >
        {segment === 'coin' ? (
          <View style={{ gap: edsPx(spacing['spacing-3']), paddingTop: edsPx(spacing['spacing-3']) }}>
            <View style={[card, { alignItems: 'center', justifyContent: 'center' }]}>
              <View style={{ width: donutSize, height: donutSize, alignItems: 'center', justifyContent: 'center' }}>
                <Donut
                  size={donutSize}
                  strokeWidth={edsPx(spacing['spacing-5'])}
                  track={String(colors['material-card-shallow'])}
                  slices={COINS.map((coin) => ({ color: tone(coin.tone), value: coin.bar }))}
                />
                <View style={{ position: 'absolute', alignItems: 'center' }}>
                  <SceneText variant="bodySmallSemibold">{t('home.assetCoinCount')}</SceneText>
                  <SceneText variant="footnote">{t('home.assetCoins')}</SceneText>
                </View>
              </View>
            </View>
            {COINS.map((coin) => (
              <View
                key={coin.id}
                style={{
                  gap,
                  paddingVertical: edsPx(spacing['spacing-2-5']),
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: String(colors['stroke-base-quaternary']),
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: edsPx(spacing['spacing-3']) }}>
                    <View
                      style={{
                        width: iconSize,
                        height: iconSize,
                        borderRadius: pillRadius,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: String(colors['material-card-shallow']),
                      }}
                    >
                      <EgSymbol name={coin.symbol} mode={mode} size="md" accessibilityLabel={coin.ticker} />
                    </View>
                    <SceneText variant="bodySemibold">{coin.ticker}</SceneText>
                    <SceneText variant="footnote">{coin.name}</SceneText>
                  </View>
                  <SceneText variant="bodySmallSemibold">{coin.share}</SceneText>
                </View>
                <View
                  style={{
                    height: edsPx(spacing['spacing-1']),
                    borderRadius: pillRadius,
                    backgroundColor: String(colors['material-card-shallow']),
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${coin.bar * 100}%`,
                      height: '100%',
                      borderRadius: pillRadius,
                      backgroundColor: tone(coin.tone),
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SceneText variant="footnote">{coin.quantity}</SceneText>
                  <SceneText variant="footnote">{coin.fiat}</SceneText>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ paddingTop: edsPx(spacing['spacing-3']), gap }}>
            {BREAKDOWN.map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: edsPx(spacing['spacing-2']),
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: String(colors['stroke-base-quaternary']),
                }}
              >
                <SceneText variant="bodySemibold">{t(item.labelKey)}</SceneText>
                <SceneText variant="bodySmallSemibold">{item.amount}</SceneText>
              </View>
            ))}
          </View>
        )}
      </EgTab>
    </SceneScaffold>
  );
}
