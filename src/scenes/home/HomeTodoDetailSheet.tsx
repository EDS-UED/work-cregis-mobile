import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Keyboard, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgDivider, EgSymbol } from '@/eds/home-ui';
import { EgTextarea } from '@/eds/input';
import { egNavBarScrollContentReserve } from '@/eds/nav-bar';
import { PageStackLayer, usePageStack } from '@/eds/page-stack';
import {
  EgSheets,
  type EgSheetsActionsBlankCompensation,
  type EgSheetsDetent,
} from '@/eds/sheets';
import { EgDecorButton, EgOptionButton } from '@/eds/scene-buttons';
import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataList, EgDataListRow } from '@/eds/data-list';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import type { HomeTodoItem } from '@/store';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';
import { formatMobileDateTime } from '@/utils/formatMobileDateTime';
import { maskEmail } from '@/utils/maskEmail';

type HomeTodoDetailSheetProps = {
  visible: boolean;
  item: HomeTodoItem | null;
  onDismiss: () => void;
};

function truncateAddress(address: string): string {
  const trimmed = address.trim();
  if (trimmed.length <= 16) return trimmed;
  return `${trimmed.slice(0, 6)}...${trimmed.slice(-6)}`;
}

function DetailFieldRow({
  label,
  children,
  onPress,
}: {
  label: string;
  children: ReactNode;
  onPress?: () => void;
}) {
  const { mode, spacing } = useEdsTheme();
  const layout = getDataListRowLayout(spacing);
  const rowGap = edsPx(spacing['spacing-3']);

  return (
    <EgDataListRow
      mode={mode}
      layout={layout}
      axis="row"
      gap={rowGap}
      accessibilityLabel={label}
      onPress={onPress}
      interactive={onPress != null}
    >
      <SceneText variant="bodyMediumStrong" style={{ flexShrink: 0 }}>
        {label}
      </SceneText>
      <View style={{ flex: 1, minWidth: 0, alignItems: 'flex-end' }}>{children}</View>
    </EgDataListRow>
  );
}

const TODO_SHEET_REJECT_PAGE = 'reject' as const;

function sheetActionsRow(
  spacing: ReturnType<typeof useEdsTheme>['spacing'],
  keyboardLift: number,
  children: ReactNode,
) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          width: '100%',
          gap: edsPx(spacing['spacing-2']),
        },
        keyboardLift > 0 ? { transform: [{ translateY: -keyboardLift }] } : null,
      ]}
    >
      {children}
    </View>
  );
}

/** 首页待办 Sheet · 详情 + `motion-page` 推入驳回页（`usePageStack`）。 */
export function HomeTodoDetailSheet({ visible, item, onDismiss }: HomeTodoDetailSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing, colors } = useEdsTheme();
  const { width: stackWidth } = useWindowDimensions();
  const pageStack = usePageStack(false);
  const { stack, enters, leaves, coverOf, coverLeavingOf } = pageStack;
  const pageStackRef = useRef(pageStack);
  pageStackRef.current = pageStack;
  const isRejectOpen = stack.length > 0;
  const [rejectReason, setRejectReason] = useState('');
  const [sheetDetent, setSheetDetent] = useState<EgSheetsDetent>('adaptive');
  const [keyboardLift, setKeyboardLift] = useState(0);
  const pageBg = String(colors['box-flotation']);

  useEffect(() => {
    if (!visible) {
      pageStackRef.current.reset();
      setRejectReason('');
      setSheetDetent('adaptive');
      setKeyboardLift(0);
    }
  }, [visible]);

  useEffect(() => {
    if (!isRejectOpen) {
      setKeyboardLift(0);
      setSheetDetent('adaptive');
    }
  }, [isRejectOpen]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates.height;
      setKeyboardLift(height);
      if (isRejectOpen) {
        setSheetDetent('large');
      }
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardLift(0);
      if (isRejectOpen) {
        setSheetDetent('adaptive');
      }
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [isRejectOpen]);

  const handleDismiss = useCallback(() => {
    Keyboard.dismiss();
    pageStackRef.current.reset();
    setRejectReason('');
    setSheetDetent('adaptive');
    onDismiss();
  }, [onDismiss]);

  const backToDetail = useCallback(() => {
    Keyboard.dismiss();
    pageStackRef.current.back();
    setSheetDetent('adaptive');
  }, []);

  const openReject = useCallback(() => {
    pageStackRef.current.push(TODO_SHEET_REJECT_PAGE);
    setSheetDetent('adaptive');
  }, []);

  /** 内容顶距卡片顶 `spacing-9` · 与 EgSheets 顶栏占位对齐后上拉。 */
  const sheetContentMarginTop = useMemo(() => {
    const sheetsChrome = egNavBarScrollContentReserve(
      0,
      edsPx(spacing['spacing-4']),
      edsPx(spacing['spacing-2']),
    );
    return edsPx(spacing['spacing-9']) - sheetsChrome;
  }, [spacing]);

  const sheetBody = useMemo(() => {
    if (!item) {
      return null;
    }

    const { detail } = item;
    const cryptoSymbol = edsCryptoSymbolForCurrency(item.currency);
    const iconPx = edsPx(spacing['avatar-3xl']);
    const businessLabel =
      detail.businessType === 'paymentRequest'
        ? t('home.todoSheetBusinessPaymentRequest')
        : t('home.todoSheetBusinessWithdrawal');
    const remarkText = detail.remark?.trim() ? detail.remark : t('home.todoSheetRemarkEmpty');

    const styles = StyleSheet.create({
      hero: {
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      iconBelow: {
        marginBottom: edsPx(spacing['spacing-4']),
      },
      amountRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: edsPx(spacing['spacing-2']),
      },
      payAmount: {
        marginTop: edsPx(spacing['spacing-1']),
        textAlign: 'center',
      },
      dividerWrap: {
        marginTop: edsPx(spacing['spacing-7']),
        marginBottom: edsPx(spacing['spacing-4']),
        alignSelf: 'stretch',
      },
      initiatorValue: {
        alignItems: 'flex-end',
        gap: edsPx(spacing['spacing-0']),
        maxWidth: '100%',
      },
      viewDetails: {
        marginTop: edsPx(spacing['spacing-5']),
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      viewDetailsLink: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: edsPx(spacing['spacing-05']),
      },
      initiatorTop: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: edsPx(spacing['spacing-1']),
        maxWidth: '100%',
      },
    });

    return (
      <View style={{ alignSelf: 'stretch', marginTop: sheetContentMarginTop }}>
        <View style={styles.hero}>
          <View style={styles.iconBelow}>
            {cryptoSymbol ? (
              <EgSymbol
                name={cryptoSymbol}
                mode={mode}
                displayPx={iconPx}
                accessibilityLabel={item.currency}
              />
            ) : (
              <View
                style={{
                  width: iconPx,
                  height: iconPx,
                  borderRadius: edsPx(spacing['radius-full']),
                  backgroundColor: String(colors['material-card-deep']),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SceneText variant="bodySemibold">{item.currency.slice(0, 1)}</SceneText>
              </View>
            )}
          </View>
          <View style={styles.amountRow}>
            <SceneText variant="headline">{item.amount}</SceneText>
            <SceneText variant="headline">{item.currency}</SceneText>
          </View>
          <SceneText variant="secondary" style={styles.payAmount}>
            {t('home.todoSheetPayAmount')}
          </SceneText>
        </View>

        <View style={styles.dividerWrap}>
          <EgDivider variant="module" mode={mode} />
        </View>

        <EgDataList
          sceneContentInset={edsSceneContentInset(spacing)}
          rowGap={edsPx(spacing['spacing-0'])}
        >
          <DetailFieldRow label={t('home.todoSheetInitiator')}>
            <View style={styles.initiatorValue}>
              <View style={styles.initiatorTop}>
                <EgAvatar
                  name={detail.initiatorName}
                  size="xs"
                  colorIndex={detail.initiatorColorIndex}
                  accessibilityLabel={detail.initiatorName}
                />
                <SceneText variant="bodyMedium" numberOfLines={1}>
                  {detail.initiatorName}
                </SceneText>
              </View>
              <SceneText variant="bodySmallSecondary" numberOfLines={1}>
                {maskEmail(detail.initiatorEmail)}
              </SceneText>
            </View>
          </DetailFieldRow>

          <DetailFieldRow label={t('home.todoSheetTo')}>
            <SceneText variant="body" numberOfLines={1} style={{ textAlign: 'right' }}>
              {truncateAddress(detail.recipientAddress)}
            </SceneText>
          </DetailFieldRow>

          <DetailFieldRow label={t('home.todoSheetBusiness')}>
            <SceneText variant="body" style={{ textAlign: 'right' }}>
              {businessLabel}
            </SceneText>
          </DetailFieldRow>

          <DetailFieldRow label={t('home.todoSheetTime')}>
            <SceneText variant="body" style={{ textAlign: 'right' }}>
              {formatMobileDateTime(detail.occurredAt)}
            </SceneText>
          </DetailFieldRow>

          <DetailFieldRow label={t('home.todoSheetRemark')}>
            <SceneText variant="body" style={{ textAlign: 'right' }}>
              {remarkText}
            </SceneText>
          </DetailFieldRow>
        </EgDataList>

        <View style={styles.viewDetails}>
          <View style={styles.viewDetailsLink}>
            <EgLink
              mode={mode}
              size="md"
              tone="brand"
              label={t('home.todoSheetViewDetails')}
              onPress={() => undefined}
            />
            <View style={{ marginTop: -1 }}>
              <EgSymbol
                name="eds-arrow-right-ios"
                mode={mode}
                displayPx={12}
                strokeColorToken="stroke-color-brand"
                accessibilityLabel=""
              />
            </View>
          </View>
        </View>
      </View>
    );
  }, [colors, item, mode, sheetContentMarginTop, spacing, t]);

  const rejectPage = (
    <View
      style={{
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: pageBg,
        paddingTop: edsPx(spacing['spacing-3']),
        minHeight: edsPx(spacing['spacing-20']),
      }}
    >
      <EgTextarea
        mode={mode}
        size="md"
        value={rejectReason}
        onChangeText={setRejectReason}
        placeholder={t('home.todoSheetRejectReasonPlaceholder')}
        showClear={false}
        autoFocus={isRejectOpen && visible}
        accessibilityLabel={t('home.todoSheetRejectReasonPlaceholder')}
        style={{ alignSelf: 'stretch', width: '100%' }}
      />
    </View>
  );

  const detailActions = useMemo(
    () =>
      sheetActionsRow(
        spacing,
        0,
        <>
          <EgOptionButton
            label={t('home.todoSheetReject')}
            mode={mode}
            size="lg"
            figmaType="primary"
            labelStyle="danger"
            onPress={openReject}
            style={{ flex: 1 }}
          />
          <EgDecorButton
            label={t('home.todoSheetApprove')}
            mode={mode}
            size="lg"
            figmaType="primary"
            onPress={() => undefined}
            style={{ flex: 1 }}
          />
        </>,
      ),
    [mode, openReject, spacing, t],
  );

  const rejectActions = useMemo(
    () =>
      sheetActionsRow(
        spacing,
        keyboardLift,
        <>
          <EgOptionButton
            label={t('home.todoSheetRejectIgnore')}
            mode={mode}
            size="lg"
            figmaType="primary"
            onPress={handleDismiss}
            style={{ flex: 1 }}
          />
          <EgDecorButton
            label={t('home.todoSheetRejectConfirm')}
            mode={mode}
            size="lg"
            figmaType="primary"
            onPress={handleDismiss}
            style={{ flex: 1 }}
          />
        </>,
      ),
    [handleDismiss, keyboardLift, mode, spacing, t],
  );

  const handleRejectSwipeEnd = useCallback((commit: boolean, velocity: number) => {
    pageStackRef.current.finishSwipe(commit, velocity);
    if (commit) {
      Keyboard.dismiss();
      setSheetDetent('adaptive');
    }
  }, []);

  const sheetContentPaddingBottom = useMemo(
    () => (isRejectOpen && keyboardLift > 0 ? keyboardLift : 0),
    [isRejectOpen, keyboardLift],
  );

  const sheetContent = (
    <View
      style={{
        alignSelf: 'stretch',
        position: 'relative',
      }}
    >
      {sheetBody}
      {stack.map((pageKey, index) =>
        pageKey === TODO_SHEET_REJECT_PAGE ? (
          <PageStackLayer
            key={`todo-sheet-${pageKey}-${index}`}
            enter={enters[index]!}
            cover={coverOf(index)}
            coverLeaving={coverLeavingOf(index)}
            leaving={leaves[index]!}
            width={stackWidth}
            isTop={index === stack.length - 1}
            edgeSwipe
            reduceMotion={false}
            background={pageBg}
            dimColor={pageBg}
            onSwipeEnd={handleRejectSwipeEnd}
          >
            {rejectPage}
          </PageStackLayer>
        ) : null,
      )}
    </View>
  );

  const actions = isRejectOpen ? rejectActions : detailActions;

  return (
    <EgSheets
      visible={visible && item !== null}
      onDismiss={handleDismiss}
      mode={mode}
      title={isRejectOpen ? t('home.todoSheetRejectReasonTitle') : undefined}
      showTitle={isRejectOpen}
      showLeft={isRejectOpen}
      onBack={backToDetail}
      showRight
      dismissible
      detents={['adaptive', 'large']}
      initialDetent="adaptive"
      detent={sheetDetent}
      onDetentChange={setSheetDetent}
      actionsBlankCompensation={'spacing-14' as EgSheetsActionsBlankCompensation}
      contentStyle={
        sheetContentPaddingBottom > 0 ? { paddingBottom: sheetContentPaddingBottom } : null
      }
      actions={actions}
    >
      {sheetContent}
    </EgSheets>
  );
}