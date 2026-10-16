import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  EgDivider,
  EgIconArrowUp,
  EgIconListLatticeMobile,
  EgSymbol,
  EgSystemTag,
  egTabBarScrollContentReserveWithSafeArea,
  mobileTheme,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from "@eds-evergreen/mobile";
import {
  resolveMotionRecipe,
  resolveMotionSpring,
} from "@eds-evergreen/mobile/animations";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useEdsTheme } from "@/hooks/useEdsTheme";
import { useEdsTypography } from "@/hooks/useEdsTypography";
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

const pressMotion = resolveMotionRecipe("press");
const pressSnappySpring = resolveMotionSpring("snappy");
const pressScaleXs = mobileTheme.motion.scale["scale-press-xs"] as number;
const pressScaleMd = mobileTheme.motion.scale["scale-press-md"] as number;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function pressScaleSlack(layoutPx: number, activeScale: number) {
  return Math.max(
    1,
    Math.ceil((layoutPx * Math.abs(activeScale - 1)) / 2) + 1,
  );
}

function usePressScaleMotion(
  activeScale: number,
  springConfig = pressMotion.springConfig,
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

function formatFilterBadge(count: number) {
  if (count >= 100) {
    return "99+";
  }
  return String(count);
}

type QuickActionProps = {
  label: string;
  accessibilityLabel: string;
  icon: ReactNode;
  onPress?: () => void;
};

function HomeQuickAction({
  label,
  accessibilityLabel,
  icon,
  onPress,
}: QuickActionProps) {
  const { colors, spacing } = useEdsTheme();
  const tileSize = edsPx(spacing["capsule-xl"]);
  const tilePadding = edsPx(spacing["spacing-4"]);
  const labelGap = edsPx(spacing["spacing-2"]);
  const { animatedStyle, onPressIn, onPressOut, pressing } = usePressScaleMotion(
    pressScaleMd,
    pressSnappySpring,
  );
  const tileSlack = pressScaleSlack(tileSize, pressScaleMd);

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
            color: String(colors["text-base-primary"]),
          }}
        >
          {label}
        </SceneText>
      </Pressable>
    </View>
  );
}

type TodoFilterChipProps = {
  label: string;
  count: number;
  selected: boolean;
  onPress: () => void;
};

function TodoFilterChip({
  label,
  count,
  selected,
  onPress,
}: TodoFilterChipProps) {
  const { colors, mode, spacing } = useEdsTheme();
  const badgeLabel = formatFilterBadge(count);
  const { animatedStyle, onPressIn, onPressOut, pressing } = usePressScaleMotion(
    pressScaleMd,
    pressSnappySpring,
  );
  const chipPaddingHorizontal = edsPx(spacing["spacing-3"]);
  const chipPaddingVertical = edsPx(spacing["spacing-2"]);
  const chipGap = edsPx(spacing["spacing-1-5"]);
  const chipRadius = edsPx(spacing["radius-full"]);
  const chipBackground = String(
    colors[selected ? "event-focus-brand" : "material-card-moderate"],
  );
  const chipSlack = pressScaleSlack(
    edsPx(spacing["tag-sm"]) + chipPaddingVertical * 2,
    pressScaleMd,
  );

  return (
    <View
      style={{
        alignSelf: "flex-start",
        overflow: "visible",
        zIndex: pressing ? 1 : 0,
        paddingVertical: chipSlack,
      }}
    >
      <AnimatedPressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="tab"
        accessibilityState={{ selected }}
        accessibilityLabel={`${label} ${badgeLabel}`}
        style={[
          {
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            flexGrow: 0,
            flexShrink: 0,
            gap: chipGap,
            paddingHorizontal: chipPaddingHorizontal,
            paddingVertical: chipPaddingVertical,
            borderRadius: chipRadius,
            backgroundColor: chipBackground,
            overflow: "visible",
          },
          animatedStyle,
        ]}
      >
        <SceneText
          variant="bodySmallMedium"
          style={{
            color: String(
              colors[selected ? "text-base-primary" : "text-base-secondary"],
            ),
          }}
        >
          {label}
        </SceneText>
        <EgSystemTag
          size="sm"
          systemType={count > 0 ? "solid" : "subtle"}
          status={count > 0 ? "danger" : undefined}
          label={badgeLabel}
          mode={mode}
        />
      </AnimatedPressable>
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

  const { animatedStyle, onPressIn, onPressOut, pressing } = usePressScaleMotion(
    pressScaleXs,
    pressSnappySpring,
  );

  const rowPaddingVertical = edsPx(spacing["spacing-4"]);
  const rowPaddingHorizontal = edsPx(spacing["spacing-3"]);
  const rowMarginHorizontal = edsPx(spacing["spacing-2"]);
  const rowRadius = edsPx(spacing["radius-md"]);
  const iconToAmountGap = edsPx(spacing["spacing-1-5"]);
  const amountToCurrencyGap = edsPx(spacing["spacing-2"]);
  const amountRowToSubtextGap = edsPx(spacing["spacing-1-5"]);
  const subtextToTimeGap = edsPx(spacing["spacing-05"]);
  const rowBackground = String(
    colors[pressing ? "event-tap" : "material-hide"],
  );
  const rowSlack = pressScaleSlack(72, pressScaleXs);

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
  const toggleBalanceVisible = useHomeStore(
    (state) => state.toggleBalanceVisible,
  );
  const setTodoFilter = useHomeStore((state) => state.setTodoFilter);
  const [quickActionsExpanded, setQuickActionsExpanded] = useState(false);

  const nativeHeader = shouldUseEgNavBarNativeStack();

  const navContentGap = edsPx(spacing["spacing-4"]);
  const sceneContentInset = edsSceneContentInset(spacing);
  const balanceLabelIconGap = edsPx(spacing["spacing-1"]);
  const balanceLabelToAmountGap = edsPx(spacing["spacing-2"]);
  const balanceToQuickActionsGap = edsPx(spacing["spacing-7"]);
  const pageDividerMarginTop = edsPx(spacing["spacing-8"]);
  const pageDividerMarginBottom = edsPx(spacing["spacing-6"]);
  const tabBarReserve = nativeHeader
    ? navContentGap
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const topReserve = nativeHeader
    ? 0
    : homeScrollTopReserve(insets.top, navContentGap);

  const balanceText = balanceVisible ? totalBalanceDisplay : "••••••";
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        content: {
          paddingHorizontal: sceneContentInset,
        },
        balanceSection: {
          gap: balanceLabelToAmountGap,
        },
        balanceLabelRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: balanceLabelIconGap,
        },
        quickActions: {
          gap: edsPx(spacing["spacing-6"]),
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
        },
        filterScroll: {
          marginHorizontal: -sceneContentInset,
          flexGrow: 0,
        },
        filterRowScroll: {
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          gap: edsPx(spacing["spacing-3"]),
          paddingHorizontal: sceneContentInset,
          overflow: "visible",
        },
        navContentLead: {
          height: navContentGap,
        },
        todoList: {
          gap: 0,
          marginHorizontal: -sceneContentInset,
          alignSelf: "stretch",
          overflow: "visible",
        },
      }),
    [
      balanceLabelIconGap,
      balanceLabelToAmountGap,
      balanceToQuickActionsGap,
      colors,
      sceneContentInset,
      navContentGap,
      pageDividerMarginBottom,
      pageDividerMarginTop,
      spacing,
    ],
  );

  const todoFilterOrder = useMemo<HomeTodoFilter[]>(
    () => ["approval", "sign", "errorCallback"],
    [],
  );

  const cycleTodoFilter = useCallback(
    (direction: "left" | "right") => {
      const index = todoFilterOrder.indexOf(todoFilter);
      if (index < 0) {
        return;
      }
      if (direction === "left" && index < todoFilterOrder.length - 1) {
        setTodoFilter(todoFilterOrder[index + 1]!);
      }
      if (direction === "right" && index > 0) {
        setTodoFilter(todoFilterOrder[index - 1]!);
      }
    },
    [setTodoFilter, todoFilter, todoFilterOrder],
  );

  const swipeTodoFilterGesture = useMemo(
    () =>
      Gesture.Pan()
        .activeOffsetX([-28, 28])
        .failOffsetY([-16, 16])
        .onEnd((event) => {
          "worklet";
          if (event.translationX <= -48) {
            runOnJS(cycleTodoFilter)("left");
          } else if (event.translationX >= 48) {
            runOnJS(cycleTodoFilter)("right");
          }
        }),
    [cycleTodoFilter],
  );

  const filterChips = (
    <>
      <TodoFilterChip
        label={t("home.filterApproval")}
        count={filterCounts.approval}
        selected={todoFilter === "approval"}
        onPress={() => setTodoFilter("approval")}
      />
      <TodoFilterChip
        label={t("home.filterSign")}
        count={filterCounts.sign}
        selected={todoFilter === "sign"}
        onPress={() => setTodoFilter("sign")}
      />
      <TodoFilterChip
        label={t("home.filterErrorCallback")}
        count={filterCounts.errorCallback}
        selected={todoFilter === "errorCallback"}
        onPress={() => setTodoFilter("errorCallback")}
      />
    </>
  );

  const scrollBody = (
    <>
      {nativeHeader ? <View style={styles.navContentLead} /> : null}
      <View style={styles.balanceSection}>
        <View style={styles.balanceLabelRow}>
          <SceneText
            variant="bodySmallMedium"
            style={{ color: String(colors["text-base-secondary"]) }}
          >
            {t("home.estTotalValue")}
          </SceneText>
          <Pressable
            onPress={toggleBalanceVisible}
            accessibilityRole="button"
            accessibilityLabel={
              balanceVisible ? t("home.hideBalance") : t("home.showBalance")
            }
            hitSlop={8}
          >
            <EgSymbol
              name={balanceVisible ? "eds-uneye" : "eds-eye"}
              size="xs"
              mode={mode}
              strokeColorToken="text-base-secondary"
            />
          </Pressable>
        </View>
        <SceneText variant="display">{balanceText}</SceneText>
      </View>

      <View style={styles.quickActions}>
        <View style={styles.quickActionsRow}>
          <HomeQuickAction
            label={t("home.send")}
            accessibilityLabel={t("home.send")}
            icon={<EgIconArrowUp mode={mode} size="md" fillTone="primary" />}
          />
          <HomeQuickAction
            label={t("home.receive")}
            accessibilityLabel={t("home.receive")}
            icon={
              <EgSymbol
                name="eds-arrow-down"
                size="md"
                mode={mode}
                fillTone="primary"
              />
            }
          />
          <HomeQuickAction
            label={t("home.whitelist")}
            accessibilityLabel={t("home.whitelist")}
            icon={
              <EgSymbol
                name="eds-white-list"
                size="md"
                mode={mode}
                fillTone="primary"
              />
            }
          />
          <HomeQuickAction
            label={quickActionsExpanded ? t("home.collapse") : t("home.more")}
            accessibilityLabel={
              quickActionsExpanded ? t("home.collapse") : t("home.more")
            }
            onPress={() => setQuickActionsExpanded((value) => !value)}
            icon={
              <EgIconListLatticeMobile
                mode={mode}
                size="md"
                fillTone="primary"
              />
            }
          />
        </View>
        {quickActionsExpanded ? (
          <View style={styles.quickActionsRow}>
            <HomeQuickAction
              label={t("home.customize")}
              accessibilityLabel={t("home.customize")}
              icon={
                <EgSymbol
                  name="eds-square"
                  size="md"
                  mode={mode}
                  fillTone="primary"
                />
              }
            />
            <HomeQuickAction
              label={t("home.customize")}
              accessibilityLabel={t("home.customize")}
              icon={
                <EgSymbol
                  name="eds-square"
                  size="md"
                  mode={mode}
                  fillTone="primary"
                />
              }
            />
            <HomeQuickAction
              label={t("home.customize")}
              accessibilityLabel={t("home.customize")}
              icon={
                <EgSymbol
                  name="eds-square"
                  size="md"
                  mode={mode}
                  fillTone="primary"
                />
              }
            />
            <View style={styles.quickActionSlot} />
          </View>
        ) : null}
      </View>

      <View style={styles.quickActionsToTodoDivider}>
        <EgDivider variant="page" mode={mode} />
      </View>

      <View style={styles.todoSection}>
        <SceneText variant="title">{t("home.todoTitle")}</SceneText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterRowScroll}
        >
          {filterChips}
        </ScrollView>
        <View style={styles.todoList}>
          {todoItems.map((item) => (
            <HomeTodoRow
              key={item.id}
              item={item}
              mode={mode}
              spacing={spacing}
              colors={colors}
              onPress={() => undefined}
            />
          ))}
        </View>
      </View>
    </>
  );

  const scroll = (
    <GestureDetector gesture={swipeTodoFilterGesture}>
      <ScrollView
        style={nativeHeader ? nativeNavScrollSurfaceStyle(colors) : undefined}
        contentInsetAdjustmentBehavior={nativeHeader ? "automatic" : "never"}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topReserve, paddingBottom: tabBarReserve },
        ]}
      >
        {scrollBody}
      </ScrollView>
    </GestureDetector>
  );

  if (nativeHeader) {
    return scroll;
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
