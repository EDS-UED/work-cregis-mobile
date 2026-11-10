import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, useWindowDimensions, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EgSheets } from '@/eds/sheets';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const GRID_COLUMNS = 4;
const DEFAULT_PINNED = ['send', 'receive', 'paymentRequest'] as const;

type QuickServiceId =
  | (typeof DEFAULT_PINNED)[number]
  | 'exchange'
  | 'aml'
  | 'bill'
  | 'signMessage'
  | `pool-a-${number}`
  | `pool-b-${number}`;

type QuickServiceDef = {
  id: QuickServiceId;
  icon: string;
  labelKey: string;
};

const TRANSACTION_TOOLS: QuickServiceDef[] = [
  { id: 'send', icon: 'eds-arrow-up', labelKey: 'home.send' },
  { id: 'receive', icon: 'eds-arrow-down', labelKey: 'home.receive' },
  {
    id: 'paymentRequest',
    icon: 'eds-arrow-deposit',
    labelKey: 'home.quickServicePaymentRequest',
  },
  { id: 'exchange', icon: 'eds-square', labelKey: 'home.quickServiceExchange' },
];

const SECURITY_TOOLS: QuickServiceDef[] = [
  { id: 'aml', icon: 'eds-aml-search', labelKey: 'home.quickServiceAml' },
];

const OTHER_TOOLS: QuickServiceDef[] = [
  { id: 'bill', icon: 'eds-square', labelKey: 'home.quickServiceBill' },
  {
    id: 'signMessage',
    icon: 'eds-square',
    labelKey: 'home.quickServiceSignMessage',
  },
];

function buildPoolItems(prefix: 'pool-a' | 'pool-b', count: number): QuickServiceDef[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `${prefix}-${index}` as QuickServiceId,
    icon: 'eds-square',
    labelKey: prefix === 'pool-a' ? 'home.quickServiceListA' : 'home.quickServiceListB',
  }));
}

type HomeQuickServicesSheetProps = {
  visible: boolean;
  onDismiss: () => void;
};

type ServiceTileProps = {
  icon: string;
  label: string;
  tileSize: number;
  tilePadding: number;
  labelGap: number;
  mode: ReturnType<typeof useEdsTheme>['mode'];
  badge?: 'add' | 'remove';
  onBadgePress?: () => void;
  onPress?: () => void;
};

function QuickServiceTile({
  icon,
  label,
  tileSize,
  tilePadding,
  labelGap,
  mode,
  badge,
  onBadgePress,
  onPress,
}: ServiceTileProps) {
  const { colors, spacing } = useEdsTheme();
  const badgeSize = edsPx(spacing['spacing-5']);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress && !onBadgePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{
        width: tileSize,
        alignItems: 'center',
      }}
    >
      <View style={{ width: tileSize, alignItems: 'center' }}>
        <View
          style={{
            width: tileSize,
            height: tileSize,
            borderRadius: edsPx(spacing['radius-full']),
            backgroundColor: String(colors['material-card-moderate']),
            alignItems: 'center',
            justifyContent: 'center',
            padding: tilePadding,
          }}
        >
          <EgSymbol name={icon} size="md" mode={mode} fillTone="primary" />
        </View>
        {badge ? (
          <Pressable
            onPress={onBadgePress}
            accessibilityRole="button"
            accessibilityLabel={
              badge === 'add' ? label : label
            }
            hitSlop={8}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: badgeSize,
              height: badgeSize,
              borderRadius: edsPx(spacing['radius-full']),
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: String(
                badge === 'add'
                  ? colors['text-base-primary']
                  : colors['text-base-tertiary'],
              ),
            }}
          >
            <SceneText
              variant="bodySmallSemibold"
              style={{ color: colors['box-page'] }}
            >
              {badge === 'add' ? '+' : '−'}
            </SceneText>
          </Pressable>
        ) : null}
      </View>
      <SceneText
        variant="bodySmall"
        numberOfLines={1}
        style={{
          marginTop: labelGap,
          textAlign: 'center',
          width: tileSize,
        }}
      >
        {label}
      </SceneText>
    </Pressable>
  );
}

function SectionBlock({
  title,
  children,
  gap,
}: {
  title: string;
  children: ReactNode;
  gap: number;
}) {
  return (
    <View style={{ gap, alignSelf: 'stretch' }}>
      <SceneText variant="title">{title}</SceneText>
      {children}
    </View>
  );
}

/** 快捷服务 · 更多入口 EgSheets（浏览 / 编辑两态，稿面 1 / 2）。 */
export function HomeQuickServicesSheet({
  visible,
  onDismiss,
}: HomeQuickServicesSheetProps) {
  const { t } = useTranslation();
  const { mode, colors, spacing } = useEdsTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [editing, setEditing] = useState(false);
  const [pinnedIds, setPinnedIds] = useState<QuickServiceId[]>([...DEFAULT_PINNED]);

  const tileSize = edsPx(spacing['capsule-xl']);
  const tilePadding = edsPx(spacing['spacing-4']);
  const labelGap = edsPx(spacing['spacing-2']);
  const sectionGap = edsPx(spacing['spacing-6']);
  const gridRowGap = edsPx(spacing['spacing-5']);
  const gridColGap = edsPx(spacing['spacing-4']);
  const cardRadius = edsPx(spacing['radius-md']);
  const contentInset = edsPx(spacing['spacing-5']);

  const contentWidth = windowWidth - contentInset * 2;
  const gridItemStride =
    (contentWidth - gridColGap * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

  const poolA = useMemo(() => buildPoolItems('pool-a', 8), []);
  const poolB = useMemo(() => buildPoolItems('pool-b', 8), []);

  const allCatalog = useMemo(
    () => [...TRANSACTION_TOOLS, ...SECURITY_TOOLS, ...OTHER_TOOLS],
    [],
  );

  const pinnedTools = useMemo(
    () =>
      pinnedIds
        .map((id) => allCatalog.find((item) => item.id === id))
        .filter((item): item is QuickServiceDef => item != null),
    [allCatalog, pinnedIds],
  );

  useEffect(() => {
    if (!visible) {
      setEditing(false);
    }
  }, [visible]);

  const resetPinned = useCallback(() => {
    setPinnedIds([...DEFAULT_PINNED]);
    setEditing(false);
  }, []);

  const renderGrid = (items: QuickServiceDef[], badge?: 'add' | 'remove') => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        columnGap: gridColGap,
        rowGap: gridRowGap,
      }}
    >
      {items.map((item) => (
        <View key={item.id} style={{ width: gridItemStride, alignItems: 'center' }}>
          <QuickServiceTile
            icon={item.icon}
            label={t(item.labelKey)}
            tileSize={tileSize}
            tilePadding={tilePadding}
            labelGap={labelGap}
            mode={mode}
            badge={badge}
            onBadgePress={
              badge === 'remove'
                ? () =>
                    setPinnedIds((current) =>
                      current.filter((id) => id !== item.id),
                    )
                : undefined
            }
          />
        </View>
      ))}
    </View>
  );

  const browseBody = (
    <View style={{ gap: sectionGap, alignSelf: 'stretch' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: edsPx(spacing['spacing-4']),
          borderRadius: cardRadius,
          backgroundColor: String(colors['material-card-moderate']),
          gap: edsPx(spacing['spacing-3']),
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: edsPx(spacing['spacing-3']),
          }}
        >
          {pinnedTools.map((item) => (
            <View
              key={item.id}
              style={{
                width: edsPx(spacing['spacing-10']),
                height: edsPx(spacing['spacing-10']),
                borderRadius: edsPx(spacing['radius-full']),
                backgroundColor: String(colors['material-hide']),
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <EgSymbol
                name={item.icon}
                displayPx={edsPx(spacing['avatar-sm'])}
                mode={mode}
                fillTone="primary"
              />
            </View>
          ))}
        </View>
        <Pressable
          onPress={() => setEditing(true)}
          accessibilityRole="button"
          accessibilityLabel={t('home.quickServiceEdit')}
          style={{
            paddingHorizontal: edsPx(spacing['spacing-5']),
            paddingVertical: edsPx(spacing['spacing-2']),
            borderRadius: edsPx(spacing['radius-full']),
            backgroundColor: String(colors['text-base-primary']),
          }}
        >
          <SceneText variant="bodySmallMedium" style={{ color: colors['box-page'] }}>
            {t('home.quickServiceEdit')}
          </SceneText>
        </Pressable>
      </View>

      <SectionBlock title={t('home.quickServiceSectionTransaction')} gap={gridRowGap}>
        {renderGrid(TRANSACTION_TOOLS)}
      </SectionBlock>
      <SectionBlock title={t('home.quickServiceSectionSecurity')} gap={gridRowGap}>
        {renderGrid(SECURITY_TOOLS)}
      </SectionBlock>
      <SectionBlock title={t('home.quickServiceSectionOther')} gap={gridRowGap}>
        {renderGrid(OTHER_TOOLS)}
      </SectionBlock>
    </View>
  );

  const editBody = (
    <View style={{ gap: sectionGap, alignSelf: 'stretch' }}>
      <View
        style={{
          padding: edsPx(spacing['spacing-4']),
          borderRadius: cardRadius,
          backgroundColor: String(colors['material-card-moderate']),
          gap: edsPx(spacing['spacing-4']),
        }}
      >
        <SceneText variant="bodySmallTertiary">
          {t('home.quickServiceEditHint')}
        </SceneText>
        {renderGrid(pinnedTools, 'remove')}
      </View>

      <SectionBlock title={t('home.quickServiceListA')} gap={gridRowGap}>
        {renderGrid(poolA, 'add')}
      </SectionBlock>
      <SectionBlock title={t('home.quickServiceListB')} gap={gridRowGap}>
        {renderGrid(poolB, 'add')}
      </SectionBlock>
    </View>
  );

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      detents={['small', 'medium', 'large']}
      initialDetent="medium"
      title={t('home.quickServicesTitle')}
      showTitle
      showLeft={false}
      showRight
      dismissible
      right={{
        kind: 'text',
        icon: 'eds-arrow-refresh',
        label: t('home.quickServiceReset'),
        onPress: resetPinned,
        accessibilityLabel: t('home.quickServiceReset'),
      }}
    >
      {editing ? editBody : browseBody}
    </EgSheets>
  );
}
