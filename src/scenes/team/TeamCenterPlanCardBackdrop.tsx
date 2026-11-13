import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Mask,
  Pattern,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

import mobileTheme from '@/eds/tokens';
import { useThemeColors } from '@/hooks/useEffectiveTheme';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { teamPlanTagColor } from '@/scenes/team/teamPlanTier';
import type { TeamPlanTier } from '@/store';
import { edsPx } from '@/utils/edsTheme';

const OPACITY = mobileTheme.motion.opacity as Record<string, number>;
const O_VISIBLE = OPACITY['opacity-visible'] ?? 1;
const O_HIDDEN = OPACITY['opacity-hidden'] ?? 0;
const O_STRONG = OPACITY['opacity-page-shot-dim'] ?? 0.8;
const O_MEDIUM = OPACITY['opacity-sheets-dim-floating'] ?? 0.4;
const O_SOFT = OPACITY['opacity-page-dim'] ?? 0.2;

type BackdropProps = {
  tier: TeamPlanTier;
  width: number;
  height: number;
};

/** 柔光圆 · 圆心按卡片比例定位，半径按卡片宽度比例。 */
function Glow({
  id,
  color,
  cx,
  cy,
  r,
  opacity,
}: {
  id: string;
  color: string;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
}) {
  return (
    <RadialGradient id={id} cx={cx} cy={cy} r={r} gradientUnits="userSpaceOnUse">
      <Stop offset={0} stopColor={color} stopOpacity={opacity} />
      <Stop offset={1} stopColor={color} stopOpacity={O_HIDDEN} />
    </RadialGradient>
  );
}

/**
 * 套餐卡版本底色 · 铺在扫光 / 线稿之下。
 * - 基础版：沿用卡片 `material-card-moderate`，不绘制
 * - 高级版：白底 → 右上薄荷绿，左下柔蓝
 * - 商业版：浅蓝 → 浅紫斜向渐变
 * - 企业版：暗金（金底叠古铜，左浅右深）+ 右上渐隐网格（不叠线稿）
 */
export function TeamCenterPlanCardBackdrop({ tier, width, height }: BackdropProps) {
  const colors = useThemeColors();
  const { mode, spacing } = useEdsTheme();
  const uid = useId().replace(/:/g, '');

  if (tier === 'basic' || width <= 0 || height <= 0) {
    return null;
  }

  const base = String(colors['material-card-same-white']);
  const blue = teamPlanTagColor('blue', mode);
  const purple = teamPlanTagColor('purple', mode);
  const green = teamPlanTagColor('green', mode);
  const yellow = teamPlanTagColor('yellow', mode);
  const gold = String(colors['status-warning']);
  const id = (name: string) => `team-plan-${tier}-${name}-${uid}`;
  const url = (name: string) => `url(#${id(name)})`;

  const renderAdvanced = () => (
    <>
      <Defs>
        <Glow id={id('mint')} color={green.bg} cx={width} cy={0} r={width * 0.95} opacity={O_VISIBLE} />
        <Glow id={id('blue')} color={blue.bg} cx={0} cy={height} r={width * 0.55} opacity={O_STRONG} />
      </Defs>
      <Rect width={width} height={height} fill={base} />
      <Rect width={width} height={height} fill={url('mint')} />
      <Rect width={width} height={height} fill={url('blue')} />
    </>
  );

  const renderBusiness = () => (
    <>
      <Defs>
        <LinearGradient id={id('wash')} x1="0" y1="0" x2="1" y2="1">
          <Stop offset={0} stopColor={blue.bg} stopOpacity={O_STRONG} />
          <Stop offset={1} stopColor={purple.bg} stopOpacity={O_STRONG} />
        </LinearGradient>
        <Glow id={id('light')} color={base} cx={width * 0.2} cy={0} r={width * 0.7} opacity={O_SOFT} />
      </Defs>
      <Rect width={width} height={height} fill={base} />
      <Rect width={width} height={height} fill={url('wash')} />
      <Rect width={width} height={height} fill={url('light')} />
    </>
  );

  const renderEnterprise = () => {
    const cell = edsPx(spacing['spacing-4']);
    const stroke = edsPx(spacing['stroke-sm']);
    return (
      <>
        <Defs>
          <LinearGradient id={id('bronze')} x1="0" y1="0" x2="1" y2="0.6">
            <Stop offset={0} stopColor={yellow.text} stopOpacity={O_SOFT} />
            <Stop offset={1} stopColor={yellow.text} stopOpacity={O_MEDIUM} />
          </LinearGradient>
          <Glow id={id('core')} color={gold} cx={width} cy={0} r={width * 0.6} opacity={O_SOFT} />
          <Glow id={id('fade')} color={String(colors['text-same-white'])} cx={width} cy={0} r={width * 0.75} opacity={O_VISIBLE} />
          <Mask id={id('mask')} x={0} y={0} width={width} height={height} maskUnits="userSpaceOnUse">
            <Rect width={width} height={height} fill={url('fade')} />
          </Mask>
          <Pattern id={id('grid')} width={cell} height={cell} patternUnits="userSpaceOnUse">
            <Path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke={yellow.text}
              strokeOpacity={O_MEDIUM}
              strokeWidth={stroke}
            />
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill={base} />
        <Rect width={width} height={height} fill={yellow.bg} />
        <Rect width={width} height={height} fill={url('bronze')} />
        <Rect width={width} height={height} fill={url('core')} />
        <Rect width={width} height={height} fill={url('grid')} mask={url('mask')} />
      </>
    );
  };

  return (
    <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
      {tier === 'advanced' ? renderAdvanced() : null}
      {tier === 'business' ? renderBusiness() : null}
      {tier === 'enterprise' ? renderEnterprise() : null}
    </Svg>
  );
}
