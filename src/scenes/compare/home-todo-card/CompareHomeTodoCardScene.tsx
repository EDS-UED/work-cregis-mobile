import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  EgDivider,
  EgIconListLatticeMobile,
  EgSymbol,
} from "@/eds/home-ui";
import {
  egTabBarScrollContentReserveWithSafeArea,
  shouldUseEgNavBarNativeStack,
  useEgNavBarScroll,
} from "@/eds/nav-bar";
import { shouldUseEgTabBarNativeStack } from "@/eds/runtime";
import mobileTheme from "@/eds/tokens";
import { edsMotionSpring } from "@/utils/edsMotion";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useEdsTheme } from "@/hooks/useEdsTheme";
import { useEdsTypography } from "@/hooks/useEdsTypography";
import { HomeTodoEmptyState } from "@/scenes/home/HomeTodoEmptyState";
import { HomeQuickServicesSheet } from "@/scenes/home/HomeQuickServicesSheet";
import {
  HOME_QUICK_ENTRY_PER_ROW,
  resolveQuickServices,
  type QuickServiceDef,
} from "@/scenes/home/homeQuickServicesCatalog";
import { QuickServiceHomeIcon } from "@/scenes/home/homeQuickServiceIcons";
import { HomeTodoDetailSheet } from "@/scenes/home/HomeTodoDetailSheet";
import { HomeTodoFilterBar } from "@/scenes/home/HomeTodoFilterBar";
import { homeScrollTopReserve } from "@/scenes/home/HomeTopBar";
import { CompareHomeSnapshotTopBar } from "@/scenes/compare/shared/CompareHomeSnapshotTopBar";
import { EdsGlassScreenShell } from "@/scenes/shared/EdsGlassScreenShell";
import { SceneText } from "@/scenes/shared/SceneText";
import { useHomeStore, type HomeTodoFilter, type HomeTodoItem } from "@/store";
import { nativeNavScrollSurfaceStyle } from "@/utils/nativeNavScrollSurface";
import { EgDataList, EgDataListRow } from "@/eds/data-list";
import { getDataListRowLayout } from "@/scenes/shared/dataListLayout";
import {
  edsNavContentGap,
  edsPageBackground,
  edsPx,
  edsSceneContentInset,
} from "@/utils/edsTheme";
import { edsCryptoSymbolForCurrency } from "@/utils/edsCryptoSymbol";
import { overlayNavScrollSurfaceStyle } from "@/utils/nativeNavScrollSurface";

const pressSnappySpring = edsMotionSpring("snappy");
const pressMotionSpring = edsMotionSpring("press");

/** 快捷入口点按缩小 · `scale-press-down-lg`。 */
const quickActionPressScale =
  mobileTheme.motion.scale["scale-press-down-lg"] as number;
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
        displayPx={iconPx}
        mode={mode}
        strokeColorToken="text-base-secondary"
        strokeScaleToken="stroke-xl"
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
          <SceneText
            variant="bodyMediumStrong"
            style={{ color: String(colors["text-base-secondary"]) }}
          >
            {estTotalValueLabel}
          </SceneText>
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

/** 快捷入口 — 全平台 RN 圆底（`material-card-deep`），iOS 26+ 不走原生 Liquid Glass。 */
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
  const { animatedStyle, onPressIn, onPressOut, pressing } = usePressScaleMotion(
    quickActionPressScale,
    pressSnappySpring,
  );
  const tileSlack = pressScaleSlack(tileSize, quickActionPressScale);

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
                backgroundColor: String(colors["material-card-deep"]),
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
  onPress?: () => void;
};

function HomeTodoRow({
  item,
  mode,
  spacing,
  onPress,
}: HomeTodoRowProps) {
  const text = useEdsTypography();
  const { colors } = useEdsTheme();
  const secondaryColor = String(colors["text-base-secondary"]);
  const cryptoSymbol = edsCryptoSymbolForCurrency(item.currency);
  const amountA11y = `${item.amount} ${item.currency}`;

  const mediaGap = edsPx(spacing["spacing-3"]);
  const avatarSize = edsPx(spacing["avatar-xl"]);
  const amountToCurrencyGap = edsPx(spacing["spacing-2"]);
  const textStackGap = edsPx(spacing["spacing-05"]);
  const layout = getDataListRowLayout(spacing);

  return (
    <EgDataListRow
      mode={mode}
      layout={layout}
      axis="row"
      gap={mediaGap}
      onPress={onPress}
      accessibilityLabel={amountA11y}
    >
      {cryptoSymbol ? (
        <View
          style={{
            width: avatarSize,
            height: avatarSize,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <EgSymbol
            name={cryptoSymbol}
            mode={mode}
            displayPx={avatarSize}
            accessibilityLabel={item.currency}
          />
        </View>
      ) : (
        <View style={{ width: avatarSize, height: avatarSize }} />
      )}
      <View
        style={{
          flex: 1,
          minWidth: 0,
          gap: textStackGap,
          alignSelf: "stretch",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: amountToCurrencyGap,
            alignSelf: "stretch",
          }}
        >
          <SceneText variant="bodySemibold">{item.amount}</SceneText>
          <SceneText variant="bodySemibold">{item.currency}</SceneText>
        </View>
        <Text style={[text.body, { textAlign: "left", color: secondaryColor }]}>
          <Text style={[text.bodyMediumStrong, { color: secondaryColor }]}>
            {item.descriptionHighlight}
          </Text>
          <Text style={[text.body, { color: secondaryColor }]}>
            {item.descriptionRest}
          </Text>
        </Text>
        <SceneText variant="bodySmallSecondary" style={{ textAlign: "left" }}>
          {item.timestamp}
        </SceneText>
      </View>
    </EgDataListRow>
  );
}

/** 对比页 · 主页快照（改此文件不影响 `HomeScene`）。 */
export function CompareHomeTodoCardScene() {
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
  const quickEntryIds = useHomeStore((state) => state.quickEntryIds);
  const [quickServicesVisible, setQuickServicesVisible] = useState(false);
  const [todoSheetItem, setTodoSheetItem] = useState<HomeTodoItem | null>(null);
  const [todoSheetVisible, setTodoSheetVisible] = useState(false);

  const quickEntryServices = useMemo(
    () => resolveQuickServices(quickEntryIds),
    [quickEntryIds],
  );
  const quickActionTileSize = edsPx(spacing["capsule-xl"]);
  const [quickActionsTrackWidth, setQuickActionsTrackWidth] = useState(0);
  const quickActionColumnGap = useMemo(() => {
    if (quickActionsTrackWidth <= 0) {
      return edsPx(spacing["spacing-4"]);
    }
    const free =
      quickActionsTrackWidth -
      HOME_QUICK_ENTRY_PER_ROW * quickActionTileSize;
    return Math.max(0, free / (HOME_QUICK_ENTRY_PER_ROW - 1));
  }, [quickActionTileSize, quickActionsTrackWidth, spacing]);

  const quickActionRows = useMemo(() => {
    type QuickActionCell =
      | { kind: "service"; service: QuickServiceDef }
      | { kind: "more" };
    const cells: QuickActionCell[] = quickEntryServices.map((service) => ({
      kind: "service",
      service,
    }));
    cells.push({ kind: "more" });
    const rows: QuickActionCell[][] = [];
    for (let index = 0; index < cells.length; index += HOME_QUICK_ENTRY_PER_ROW) {
      rows.push(cells.slice(index, index + HOME_QUICK_ENTRY_PER_ROW));
    }
    return rows;
  }, [quickEntryServices]);

  const navContentGap = edsNavContentGap(spacing);
  const sceneContentInset = edsSceneContentInset(spacing);
  const balanceLabelToAmountGap = edsPx(spacing["spacing-2"]);
  const balanceToQuickActionsGap = edsPx(spacing["spacing-5"]);
  const pageDividerMarginTop = edsPx(spacing["spacing-8"]);
  const pageDividerMarginBottom = edsPx(spacing["spacing-6"]);
  const nativeNavBar = shouldUseEgNavBarNativeStack();
  const nativeTabBar = shouldUseEgTabBarNativeStack();
  const tabBarReserve = nativeTabBar
    ? 0
    : egTabBarScrollContentReserveWithSafeArea(insets.bottom);
  const topReserve = homeScrollTopReserve(insets.top, navContentGap);

  const balanceText = balanceVisible ? totalBalanceDisplay : "**********";
  const styles = useMemo(
    () =>
      StyleSheet.create({
        root: { flex: 1, backgroundColor: edsPageBackground(colors) },
        content: {
          flexGrow: 1,
          paddingHorizontal: sceneContentInset,
        },
        balanceSection: {},
        quickActions: {
          gap: edsPx(spacing["spacing-5"]),
          alignSelf: "stretch",
          marginTop: balanceToQuickActionsGap,
        },
        quickActionsRow: {
          flexDirection: "row",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          alignSelf: "stretch",
          overflow: "visible",
        },
        quickActionsToTodoDivider: {
          marginTop: pageDividerMarginTop,
          marginBottom: pageDividerMarginBottom,
          marginHorizontal: -sceneContentInset,
          alignSelf: "stretch",
        },
        todoSection: {
          flexGrow: 1,
          gap: edsPx(spacing["spacing-3"]),
          alignSelf: "stretch",
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

      <View
        style={styles.quickActions}
        onLayout={(event) => setQuickActionsTrackWidth(event.nativeEvent.layout.width)}
      >
        {quickActionRows.map((row, rowIndex) => (
          <View
            key={`home-quick-row-${rowIndex}`}
            style={[styles.quickActionsRow, { gap: quickActionColumnGap }]}
          >
            {row.map((cell) =>
              cell.kind === "service" ? (
                <HomeQuickAction
                  key={cell.service.id}
                  label={t(cell.service.labelKey)}
                  accessibilityLabel={t(cell.service.labelKey)}
                  iconSlot={
                    <QuickServiceHomeIcon
                      id={cell.service.id}
                      icon={cell.service.icon}
                      mode={mode}
                    />
                  }
                />
              ) : (
                <HomeQuickAction
                  key={`home-quick-more-${rowIndex}`}
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
              ),
            )}
          </View>
        ))}
      </View>

      <HomeQuickServicesSheet
        visible={quickServicesVisible}
        onDismiss={() => setQuickServicesVisible(false)}
      />

      <HomeTodoDetailSheet
        visible={todoSheetVisible}
        item={todoSheetItem}
        onDismiss={() => {
          setTodoSheetVisible(false);
          setTodoSheetItem(null);
        }}
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
          contentKey={todoFilter}
        >
          <EgDataList sceneContentInset={sceneContentInset}>
            {visibleTodoItems.length === 0 ? (
              <HomeTodoEmptyState />
            ) : (
              visibleTodoItems.map((item) => (
                <HomeTodoRow
                  key={item.id}
                  item={item}
                  mode={mode}
                  spacing={spacing}
                  onPress={() => {
                    setTodoSheetItem(item);
                    setTodoSheetVisible(true);
                  }}
                />
              ))
            )}
          </EgDataList>
        </HomeTodoFilterBar>
      </View>
    </>
  );

  if (nativeNavBar) {
    return (
      <ScrollView
        style={[nativeNavScrollSurfaceStyle(colors), styles.root]}
        contentInsetAdjustmentBehavior="automatic"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: navContentGap, paddingBottom: tabBarReserve },
        ]}
      >
        {scrollBody}
      </ScrollView>
    );
  }

  return (
    <EdsGlassScreenShell
      style={styles.root}
      overlay={<CompareHomeSnapshotTopBar scrollOffset={scrollOffset} showBack />}
    >
      <ScrollView
        style={overlayNavScrollSurfaceStyle()}
        nestedScrollEnabled
        contentInsetAdjustmentBehavior="never"
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[
          styles.content,
          { paddingTop: topReserve, paddingBottom: tabBarReserve },
        ]}
      >
        {scrollBody}
      </ScrollView>
    </EdsGlassScreenShell>
  );
}
