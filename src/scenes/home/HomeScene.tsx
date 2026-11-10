import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  EgDivider,
  EgIconArrowUp,
  EgIconListLatticeMobile,
  EgSymbol,
  GlassControlShell,
} from "@/eds/home-ui";
import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from "@/eds/nav-bar";
import { resolveEgButtonGlassRenderStack } from "@/eds/runtime";
import mobileTheme from "@/eds/tokens";
import { edsMotionSpring, useEdsTapPressMotion } from "@/utils/edsMotion";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useEdsTheme } from "@/hooks/useEdsTheme";
import { useEdsTypography } from "@/hooks/useEdsTypography";
import { HomeTodoEmptyState } from "@/scenes/home/HomeTodoEmptyState";
import { HomeQuickServicesSheet } from "@/scenes/home/HomeQuickServicesSheet";
import { HomeTodoFilterBar } from "@/scenes/home/HomeTodoFilterBar";
import { HomeTopBar, homeScrollTopReserve } from "@/scenes/home/HomeTopBar";
import { EdsGlassScreenShell } from "@/scenes/shared/EdsGlassScreenShell";
import { SceneText } from "@/scenes/shared/SceneText";
import { useHomeStore, type HomeTodoFilter, type HomeTodoItem } from "@/store";
import {
  edsPageBackground,
  edsPx,
  edsSceneContentInset,
} from "@/utils/edsTheme";
import { nativeNavScrollSurfaceStyle } from "@/utils/nativeNavScrollSurface";
import { edsCryptoSymbolForCurrency } from "@/utils/edsCryptoSymbol";

const pressSnappySpring = edsMotionSpring("snappy");
const pressMotionSpring = edsMotionSpring("press");
const pressScaleMd = mobileTheme.motion.scale["scale-press-md"] as number;
const pressScaleDownXs =
  mobileTheme.motion.scale["scale-press-down-xs"] as number;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function pressScaleSlack(layoutPx: number, activeScale: number) {
  return Math.max(
    1,
    Math.ceil((layoutPx * Math.abs(activeScale - 1)) / 2) + 1,
  );
}

function usePressScaleMotion(
  activeScale: number,
  springConfig = pressMotionSpring,
) {
  const [pressing, setPressing] = useState(false);
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: scale.value }],
    }),
    [scale],
  );
  const onPressIn = useCallback(() => {
    setPressing(true);
    scale.value = withSpring(activeScale, springConfig);
  }, [activeScale, scale, springConfig]);
  const onPressOut = useCallback(() => {
    setPressing(false);
    scale.value = withSpring(1, springConfig);
  }, [scale, springConfig]);
  return { animatedStyle, onPressIn, onPressOut, pressing };
}

/** Token 图标描边 — design token `stroke-sm`（EgSymbol 内建 colorize 为 stroke-lg）。 */
function HomeBalanceVisibilityIcon({
  balanceVisible,
  mode,
}: {
  balanceVisible: boolean;
  mode: "light" | "dark";
}) {
  const { spacing } = useEdsTheme();
  const iconPx = edsPx(spacing["symbol-xs"]);
  const strokeSm = edsPx(spacing["stroke-sm"]);
  const strokeLg = edsPx(spacing["stroke-lg"]);
  const renderPx = iconPx * (strokeLg / strokeSm);

  return (
    <View
      style={{
        width: iconPx,
        height: iconPx,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <EgSymbol
        name={balanceVisible ? "eds-close-eye" : "eds-eye"}
        displayPx={renderPx}
        mode={mode}
        strokeColorToken="text-base-primary"
        style={{ transform: [{ scale: iconPx / renderPx }] }}
      />
    </View>
  );
}

/** 显示/隐藏余额 — 点按范围为标题行 + 金额；无点按缩放动效。 */
function HomeBalanceBlock({
  balanceVisible,
  balanceText,
  estTotalValueLabel,
  mode,
  colors,
  spacing,
  labelToAmountGap,
  onToggle,
  hideBalanceLabel,
  showBalanceLabel,
}: {
  balanceVisible: boolean;
  balanceText: string;
  estTotalValueLabel: string;
  mode: "light" | "dark";
  colors: ReturnType<typeof useEdsTheme>["colors"];
  spacing: ReturnType<typeof useEdsTheme>["spacing"];
  labelToAmountGap: number;
  onToggle: () => void;
  hideBalanceLabel: string;
  showBalanceLabel: string;
}) {
  const labelIconGap = edsPx(spacing["spacing-1"]);

  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityLabel={balanceVisible ? hideBalanceLabel : showBalanceLabel}
    >
      <View style={{ gap: labelToAmountGap }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: labelIconGap,
          }}
        >
          <SceneText variant="body">{estTotalValueLabel}</SceneText>
          <HomeBalanceVisibilityIcon
            balanceVisible={balanceVisible}
            mode={mode}
          />
        </View>
        <SceneText variant="display">{balanceText}</SceneText>
      </View>
    </Pressable>
  );
}

type QuickActionProps = {
  label: string;
  accessibilityLabel: string;
  /** EDS symbol 名。 */
  iconName?: string;
  /** 非 symbol 图标（如 `EgIcon*`）— `iconSlot`。 */
  iconSlot?: ReactNode;
  onPress?: () => void;
};

function HomeQuickAction({
  label,
  accessibilityLabel,
  iconName,
  iconSlot,
  onPress,
}: QuickActionProps) {
  const { colors, mode, spacing } = useEdsTheme();
  const tileSize = edsPx(spacing["capsule-xl"]);
  const tilePadding = edsPx(spacing["spacing-4"]);
  const labelGap = edsPx(spacing["spacing-2"]);
  const useNativeLiquidGlass = resolveEgButtonGlassRenderStack() === "native";
  const { animatedStyle, onPressIn, onPressOut, pressing } = usePressScaleMotion(
    pressScaleMd,
    pressSnappySpring,
  );
  const tileSlack = pressScaleSlack(tileSize, pressScaleMd);

  const labelNode = (
    <SceneText
      variant="bodySmall"
      numberOfLines={1}
      style={{
        marginTop: labelGap,
        textAlign: "center",
        width: tileSize,
      }}
    >
      {label}
    </SceneText>
  );

  if (useNativeLiquidGlass) {
    const icon = iconSlot ?? (
      iconName ? (
        <EgSymbol name={iconName} size="md" mode={mode} fillTone="primary" />
      ) : null
    );

    return (
      <View
        style={{
          width: tileSize,
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <GlassControlShell
          shape="circle"
          variant="regular"
          mode={mode}
          onPress={onPress}
          accessibilityLabel={accessibilityLabel}
          testID="home-quick-action-glass"
          style={{
            width: tileSize,
            height: tileSize,
            borderRadius: edsPx(spacing["radius-full"]),
          }}
          contentStyle={{
            padding: tilePadding,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </GlassControlShell>
        {onPress ? (
          <Pressable
            onPress={onPress}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            {labelNode}
          </Pressable>
        ) : (
          labelNode
        )}
      </View>
    );
  }

  const icon = iconSlot ?? (
    iconName ? (
      <EgSymbol name={iconName} size="md" mode={mode} fillTone="primary" />
    ) : null
  );

  return (
    <View
      style={{
        width: tileSize,
        alignItems: "center",
        overflow: "visible",
        zIndex: pressing ? 1 : 0,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={{
          width: tileSize,
          alignItems: "center",
          overflow: "visible",
        }}
      >
        <View
          style={{
            paddingTop: tileSlack,
            overflow: "visible",
          }}
        >
          <Animated.View
            style={[
              {
                width: tileSize,
                height: tileSize,
                padding: tilePadding,
                borderRadius: edsPx(spacing["radius-full"]),
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: String(colors["material-card-moderate"]),
              },
              animatedStyle,
            ]}
          >
            {icon}
          </Animated.View>
        </View>
        <SceneText
          variant="bodySmall"
          numberOfLines={1}
          style={{
            marginTop: labelGap,
            textAlign: "center",
            width: tileSize,
          }}
        >
          {label}
        </SceneText>
      </Pressable>
    </View>
  );
}

type HomeTodoRowProps = {
  item: HomeTodoItem;
  mode: ReturnType<typeof useEdsTheme>["mode"];
  spacing: ReturnType<typeof useEdsTheme>["spacing"];
  colors: ReturnType<typeof useEdsTheme>["colors"];
  onPress?: () => void;
};

function HomeTodoRow({
  item,
  mode,
  spacing,
  colors,
  onPress,
}: HomeTodoRowProps) {
  const text = useEdsTypography();
  const cryptoSymbol = edsCryptoSymbolForCurrency(item.currency);
  const amountA11y = `${item.amount} ${item.currency}`;

  const { animatedStyle, onPressIn, onPressOut, pressing } =
    useEdsTapPressMotion("xs");

  const pageInset = edsSceneContentInset(spacing);
  const rowPaddingVertical = edsPx(spacing["spacing-4"]);
  const rowPaddingHorizontal = edsPx(spacing["spacing-3"]);
  /** 列表区抵消 scene 水平 padding 后，外 margin + 行内 padding = 20px 内容边距。 */
  const rowMarginHorizontal = pageInset - rowPaddingHorizontal;
  const rowRadius = edsPx(spacing["radius-md"]);
  const iconToAmountGap = edsPx(spacing["spacing-1-5"]);
  const amountToCurrencyGap = edsPx(spacing["spacing-2"]);
  const amountRowToSubtextGap = edsPx(spacing["spacing-1-5"]);
  const subtextToTimeGap = edsPx(spacing["spacing-05"]);
  const rowBackground = String(
    colors[pressing ? "event-tap" : "material-hide"],
  );
  const rowSlack = pressScaleSlack(72, pressScaleDownXs);

  return (
    <View
      style={{
        marginHorizontal: rowMarginHorizontal,
        alignSelf: "stretch",
        overflow: "visible",
        zIndex: pressing ? 1 : 0,
        paddingVertical: rowSlack,
      }}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={amountA11y}
        style={[
          {
            gap: amountRowToSubtextGap,
            alignSelf: "stretch",
            paddingVertical: rowPaddingVertical,
            paddingHorizontal: rowPaddingHorizontal,
            borderRadius: rowRadius,
            backgroundColor: rowBackground,
            overflow: "visible",
          },
          animatedStyle,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: iconToAmountGap,
            alignSelf: "stretch",
          }}
        >
          {cryptoSymbol ? (
            <EgSymbol
              name={cryptoSymbol}
              mode={mode}
              displayPx={28}
              accessibilityLabel={item.currency}
            />
          ) : null}
          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: amountToCurrencyGap,
              flexShrink: 1,
              minWidth: 0,
            }}
          >
            <SceneText variant="bodySemibold">{item.amount}</SceneText>
            <SceneText variant="bodySemibold">{item.currency}</SceneText>
          </View>
        </View>
        <View style={{ gap: subtextToTimeGap, alignSelf: "stretch" }}>
          <Text style={[text.body, { textAlign: "left" }]}>
            <Text style={text.bodyMedium}>{item.descriptionHighlight}</Text>
            <Text style={text.body}>{item.descriptionRest}</Text>
          </Text>
          <SceneText variant="bodySmallSecondary" style={{ textAlign: "left" }}>
            {item.timestamp}
          </SceneText>
        </View>
      </AnimatedPressable>
    </View>
  );
}

export function HomeScene() {
  const { t } = useTranslation();
  const { colors, mode, spacing } = useEdsTheme();
  const insets = useSafeAreaInsets();
  const { scrollOffset, onScroll, scrollEventThrottle } = useEgNavBarScroll();
  const balanceVisible = useHomeStore((state) => state.balanceVisible);
  const totalBalanceDisplay = useHomeStore(
    (state) => state.totalBalanceDisplay,
  );
  const todoFilter = useHomeStore((state) => state.todoFilter);
  const filterCounts = useHomeStore((state) => state.filterCounts);
  const todoItems = useHomeStore((state) => state.todoItems);
  const visibleTodoItems = useMemo(
    () => todoItems.filter((item) => item.category === todoFilter),
    [todoFilter, todoItems],
  );
  const toggleBalanceVisible = useHomeStore(
    (state) => state.toggleBalanceVisible,
  );
  const setTodoFilter = useHomeStore((state) => state.setTodoFilter);
  const [quickServicesVisible, setQuickServicesVisible] = useState(false);

  const navContentGap = edsPx(spacing["spacing-4"]);
  const sceneContentInset = edsSceneContentInset(spacing);
  const balanceLabelToAmountGap = edsPx(spacing["spacing-2"]);
  const balanceToQuickActionsGap = edsPx(spacing["spacing-5"]);
  const pageDividerMarginTop = edsPx(spacing["spacing-8"]);
  const pageDividerMarginBottom = edsPx(spacing["spacing-6"]);
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const tabBarReserve = nativeNavBar
    ? 0
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const topReserve = nativeNavBar
    ? edsPx(spacing["spacing-4"])
    : homeScrollTopReserve(insets.top, navContentGap);

  const balanceText = balanceVisible ? totalBalanceDisplay : "**********";
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        content: {
          paddingHorizontal: sceneContentInset,
        },
        balanceSection: {},
        quickActions: {
          gap: edsPx(spacing["spacing-4"]),
          alignSelf: "stretch",
          marginTop: balanceToQuickActionsGap,
        },
        quickActionsRow: {
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "space-between",
          alignSelf: "stretch",
          overflow: "visible",
        },
        quickActionSlot: {
          width: edsPx(spacing["capsule-xl"]),
          overflow: "visible",
        },
        quickActionsToTodoDivider: {
          marginTop: pageDividerMarginTop,
          marginBottom: pageDividerMarginBottom,
          marginHorizontal: -sceneContentInset,
          alignSelf: "stretch",
        },
        todoSection: {
          gap: edsPx(spacing["spacing-3"]),
          alignSelf: "stretch",
        },
        todoList: {
          gap: 0,
          marginHorizontal: -sceneContentInset,
          alignSelf: "stretch",
          overflow: "visible",
        },
      }),
    [
      balanceToQuickActionsGap,
      colors,
      sceneContentInset,
      pageDividerMarginBottom,
      pageDividerMarginTop,
      spacing,
    ],
  );

  const todoFilterOptions = useMemo(
    () => [
      {
        id: "approval" as const,
        label: t("home.filterApproval"),
        count: filterCounts.approval,
      },
      {
        id: "sign" as const,
        label: t("home.filterSign"),
        count: filterCounts.sign,
      },
      {
        id: "errorCallback" as const,
        label: t("home.filterErrorCallback"),
        count: filterCounts.errorCallback,
      },
    ],
    [filterCounts, t],
  );

  const scrollBody = (
    <>
      <View style={styles.balanceSection}>
        <HomeBalanceBlock
          balanceVisible={balanceVisible}
          balanceText={balanceText}
          estTotalValueLabel={t("home.estTotalValue")}
          mode={mode}
          colors={colors}
          spacing={spacing}
          labelToAmountGap={balanceLabelToAmountGap}
          onToggle={toggleBalanceVisible}
          hideBalanceLabel={t("home.hideBalance")}
          showBalanceLabel={t("home.showBalance")}
        />
      </View>

      <View style={styles.quickActions}>
        <View style={styles.quickActionsRow}>
          <HomeQuickAction
            label={t("home.send")}
            accessibilityLabel={t("home.send")}
            iconSlot={
              <EgIconArrowUp mode={mode} size="md" fillTone="primary" />
            }
          />
          <HomeQuickAction
            label={t("home.receive")}
            accessibilityLabel={t("home.receive")}
            iconName="eds-arrow-down"
          />
          <HomeQuickAction
            label={t("home.whitelist")}
            accessibilityLabel={t("home.whitelist")}
            iconName="eds-white-list"
          />
          <HomeQuickAction
            label={t("home.more")}
            accessibilityLabel={t("home.more")}
            onPress={() => setQuickServicesVisible(true)}
            iconSlot={
              <EgIconListLatticeMobile
                mode={mode}
                size="md"
                fillTone="primary"
              />
            }
          />
        </View>
      </View>

      <HomeQuickServicesSheet
        visible={quickServicesVisible}
        onDismiss={() => setQuickServicesVisible(false)}
      />

      <View style={styles.quickActionsToTodoDivider}>
        <EgDivider variant="page" mode={mode} />
      </View>

      <View style={styles.todoSection}>
        <SceneText variant="title">{t("home.todoTitle")}</SceneText>
        <HomeTodoFilterBar
          options={todoFilterOptions}
          selectedId={todoFilter}
          onSelect={setTodoFilter}
        />
        <View style={styles.todoList}>
          {visibleTodoItems.length === 0 ? (
            <HomeTodoEmptyState />
          ) : (
            visibleTodoItems.map((item) => (
              <HomeTodoRow
                key={item.id}
                item={item}
                mode={mode}
                spacing={spacing}
                colors={colors}
                onPress={() => undefined}
              />
            ))
          )}
        </View>
      </View>
    </>
  );

  const scroll = (
    <ScrollView
      style={nativeNavBar ? nativeNavScrollSurfaceStyle(colors) : undefined}
      contentInsetAdjustmentBehavior={nativeNavBar ? "automatic" : "never"}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topReserve, paddingBottom: tabBarReserve },
      ]}
    >
      {scrollBody}
    </ScrollView>
  );

  if (nativeNavBar) {
    return <View style={styles.root}>{scroll}</View>;
  }

  return (
    <EdsGlassScreenShell
      style={styles.root}
      overlay={<HomeTopBar scrollOffset={scrollOffset} />}
    >
      {scroll}
    </EdsGlassScreenShell>
  );
}
