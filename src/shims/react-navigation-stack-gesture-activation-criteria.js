/**
 * `@react-navigation/stack` 7.12 卡片手势判定 · RNGH 3 版。
 *
 * 上游仍传 `minOffsetX` / `maxDeltaY` / `maxDeltaX` / `minOffsetY`，RNGH 3 的 `PanGestureHandler`
 * 已不在白名单内而被丢弃 → 卡片 Pan 失去方向约束，配合 EDS 整页拖拽返回（`gestureResponseDistance`）
 * 会抢走纵向滚动（Android · iOS ≤25 RN 栈页面均无法滚动）。此处换成等价的 `activeOffset*` / `failOffset*`。
 */
function getInvertedMultiplier(gestureDirection, isRTL) {
  switch (gestureDirection) {
    case 'vertical':
      return 1;
    case 'vertical-inverted':
      return -1;
    case 'horizontal':
      return isRTL ? -1 : 1;
    case 'horizontal-inverted':
      return isRTL ? 1 : -1;
  }
}

const GESTURE_RESPONSE_DISTANCE_HORIZONTAL = 50;
const GESTURE_RESPONSE_DISTANCE_VERTICAL = 135;

export const gestureActivationCriteria = ({
  direction,
  gestureDirection,
  gestureResponseDistance,
  layout,
}) => {
  const enableTrackpadTwoFingerGesture = true;
  const distance =
    gestureResponseDistance !== undefined
      ? gestureResponseDistance
      : gestureDirection === 'vertical' || gestureDirection === 'vertical-inverted'
        ? GESTURE_RESPONSE_DISTANCE_VERTICAL
        : GESTURE_RESPONSE_DISTANCE_HORIZONTAL;

  if (gestureDirection === 'vertical') {
    return {
      failOffsetX: [-15, 15],
      activeOffsetY: 5,
      hitSlop: { bottom: -layout.height + distance },
      enableTrackpadTwoFingerGesture,
    };
  }
  if (gestureDirection === 'vertical-inverted') {
    return {
      failOffsetX: [-15, 15],
      activeOffsetY: -5,
      hitSlop: { top: -layout.height + distance },
      enableTrackpadTwoFingerGesture,
    };
  }

  const hitSlop = -layout.width + distance;
  const invertedMultiplier = getInvertedMultiplier(gestureDirection, direction === 'rtl');
  /**
   * 整页拖拽返回（EDS `gestureResponseDistance` 超出屏宽）：先于 Android ScrollView 拖动阈值（≈8dp）判失败，
   * 否则 ScrollView 已 `requestDisallowInterceptTouchEvent`、卡片 Pan 仍激活 → 滚动与卡片横移并发（NavBar 左右晃）。
   */
  const fullPage = distance >= layout.width;
  const activeOffset = fullPage ? 15 : 5;
  const failOffsetY = fullPage ? [-8, 8] : [-20, 20];

  if (invertedMultiplier === 1) {
    return {
      activeOffsetX: activeOffset,
      failOffsetY,
      hitSlop: { right: hitSlop },
      enableTrackpadTwoFingerGesture,
    };
  }
  return {
    activeOffsetX: -activeOffset,
    failOffsetY,
    hitSlop: { left: hitSlop },
    enableTrackpadTwoFingerGesture,
  };
};
