import { useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgAvatar } from '@/eds/button-glass';
import { EgDivider, EgSymbol } from '@/eds/home-ui';
import { egNavBarScrollContentReserve } from '@/eds/nav-bar';
import { EgSheets } from '@/eds/sheets';
import { EgDecorButton, EgOptionButton } from '@/eds/scene-buttons';
import { EgLink } from '@/eds/link-button';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { EgDataList, EgDataListRow } from '@/eds/data-list';
import { getDataListRowLayout } from '@/scenes/shared/dataListLayout';
import { SceneText } from '@/scenes/shared/SceneText';
import type { HomeTodoItem } from '@/store';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';
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

/** 首页待办 · 付款/审批详情 Sheet。 */
export function HomeTodoDetailSheet({ visible, item, onDismiss }: HomeTodoDetailSheetProps) {
  const { t } = useTranslation();
  const { mode, spacing, colors } = useEdsTheme();

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
              {detail.occurredAt}
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

  const actions = useMemo(
    () => (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          width: '100%',
          gap: edsPx(spacing['spacing-2']),
        }}
      >
        <EgOptionButton
          label={t('home.todoSheetReject')}
          mode={mode}
          size="lg"
          figmaType="primary"
          labelStyle="danger"
          onPress={onDismiss}
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
      </View>
    ),
    [mode, onDismiss, spacing, t],
  );

  return (
    <EgSheets
      visible={visible && item !== null}
      onDismiss={onDismiss}
      mode={mode}
      showTitle={false}
      showLeft={false}
      showRight
      dismissible
      detents={['adaptive', 'large']}
      initialDetent="adaptive"
      actions={actions}
    >
      {sheetBody}
    </EgSheets>
  );
}
