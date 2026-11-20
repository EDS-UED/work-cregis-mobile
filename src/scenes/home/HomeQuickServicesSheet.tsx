import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useMotionLayoutContentSwitch } from '@/eds/layout-content';
import { EgSheets } from '@/eds/sheets';
import { EgDecorButton } from '@/eds/scene-buttons';
import type { EgSheetsDetent, EgSheetsProps } from '@/eds/sheets';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { QuickEntryEditSlotGrid } from '@/scenes/home/QuickEntryEditSlotGrid';
import { QuickEntryPinnedIconRow } from '@/scenes/home/QuickEntryPinnedIconRow';
import {
  HOME_QUICK_ENTRY_MAX,
  QUICK_SERVICE_SECTIONS,
  resolveQuickServices,
  type QuickServiceDef,
  type QuickServiceId,
} from '@/scenes/home/homeQuickServicesCatalog';
import { QuickServiceHomeIcon } from '@/scenes/home/homeQuickServiceIcons';
import { QuickServiceActionBadge } from '@/scenes/home/quickServiceBadges';
import { useHomeStore } from '@/store';
import { SceneText } from '@/scenes/shared/SceneText';
import { edsPx } from '@/utils/edsTheme';

const GRID_COLUMNS = 4;
const GRID_COLUMN_PERCENT = `${100 / GRID_COLUMNS}%` as const;

type HomeQuickServicesSheetProps = {
  visible: boolean;
  onDismiss: () => void;
};

function QuickServiceSectionTitle({ children }: { children: string }) {
  return <SceneText variant="bodyMediumStrong">{children}</SceneText>;
}

type ServiceTileProps = {
  service?: QuickServiceDef;
  label: string;
  tileSize: number;
  tilePadding: number;
  labelGap: number;
  mode: ReturnType<typeof useEdsTheme>['mode'];
  badge?: 'add' | 'remove' | 'removeDecor' | 'addDisabled';
  onBadgePress?: () => void;
  onPress?: () => void;
};

function QuickServiceTile({
  service,
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
  const tileBackground = String(colors['material-card-deep']);

  const tileIcon = service ? (
    <QuickServiceHomeIcon id={service.id} icon={service.icon} mode={mode} />
  ) : null;

  return (
    <Pressable
      onPress={onPress ?? onBadgePress}
      disabled={!onPress && !onBadgePress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ alignSelf: 'stretch', alignItems: 'center' }}
    >
      <View style={{ width: tileSize, alignItems: 'center' }}>
        <View style={{ width: tileSize, height: tileSize, position: 'relative' }}>
          <View
            style={{
              width: tileSize,
              height: tileSize,
              borderRadius: edsPx(spacing['radius-full']),
              backgroundColor: tileBackground,
              alignItems: 'center',
              justifyContent: 'center',
              padding: tilePadding,
            }}
          >
            {tileIcon}
          </View>
          {badge ? (
            <QuickServiceActionBadge
              kind={badge}
              mode={mode}
              size={badgeSize}
              onPress={onBadgePress}
              accessibilityLabel={label}
            />
          ) : null}
        </View>
      </View>
      <SceneText
        variant="footnotePrimary"
        style={{
          marginTop: labelGap,
          textAlign: 'center',
          alignSelf: 'stretch',
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
      <QuickServiceSectionTitle>{title}</QuickServiceSectionTitle>
      {children}
    </View>
  );
}

/** 快捷服务 · 浏览 / 编辑；编辑保存后写入 `useHomeStore.quickEntryIds`。 */
export function HomeQuickServicesSheet({
  visible,
  onDismiss,
}: HomeQuickServicesSheetProps) {
  const { t } = useTranslation();
  const { mode, colors, spacing } = useEdsTheme();
  const quickEntryIds = useHomeStore((state) => state.quickEntryIds);
  const setQuickEntryIds = useHomeStore((state) => state.setQuickEntryIds);

  /** 顶栏 browse ↔ edit（layout slot）与正文分轨，避免编辑栅格同帧挂载顶栏动画。 */
  const [navEditing, setNavEditing] = useState(false);
  const [bodyMode, setBodyMode] = useState<'browse' | 'edit'>('browse');
  const { reset: resetLayoutSwitch, switchContent: switchBodyMode } =
    useMotionLayoutContentSwitch();
  const [sheetDetent, setSheetDetent] = useState<EgSheetsDetent>('large');
  const [draftEntryIds, setDraftEntryIds] = useState<QuickServiceId[]>([
    ...quickEntryIds,
  ]);

  const tileSize = edsPx(spacing['capsule-xl']);
  const tilePadding = edsPx(spacing['spacing-4']);
  const labelGap = edsPx(spacing['spacing-2']);
  const sectionGap = edsPx(spacing['spacing-8']);
  const sectionTitleGap = edsPx(spacing['spacing-4']);
  const gridRowGap = edsPx(spacing['spacing-6']);
  const gridColGap = edsPx(spacing['spacing-4']);
  const gridGutterHalf = gridColGap / 2;
  const barPadLeft = edsPx(spacing['spacing-6']);
  const barPadOther = edsPx(spacing['spacing-4']);

  const pinnedBarShellStyle = useMemo(
    () => ({
      borderRadius: edsPx(spacing['radius-md']),
      backgroundColor: String(colors['material-brand-weaken']),
    }),
    [colors, spacing],
  );

  const activeIds = bodyMode === 'edit' ? draftEntryIds : quickEntryIds;
  const pinnedTools = useMemo(
    () => resolveQuickServices(activeIds),
    [activeIds],
  );
  const draftIdSet = useMemo(() => new Set(draftEntryIds), [draftEntryIds]);

  useEffect(() => {
    if (!visible) {
      setNavEditing(false);
      setBodyMode('browse');
      resetLayoutSwitch();
      setSheetDetent('large');
    }
  }, [resetLayoutSwitch, visible]);

  useEffect(() => {
    if (bodyMode === 'browse' && !navEditing) {
      setDraftEntryIds([...quickEntryIds]);
    }
  }, [bodyMode, navEditing, quickEntryIds]);

  const openEdit = useCallback(() => {
    setDraftEntryIds([...quickEntryIds]);
    setNavEditing(true);
    switchBodyMode(() => setBodyMode('edit'));
    setSheetDetent('large');
  }, [quickEntryIds, switchBodyMode]);

  const cancelEdit = useCallback(() => {
    setNavEditing(false);
    switchBodyMode(() => {
      setBodyMode('browse');
      setDraftEntryIds([...quickEntryIds]);
    });
  }, [quickEntryIds, switchBodyMode]);

  const saveAndClose = useCallback(() => {
    setQuickEntryIds(draftEntryIds);
    setNavEditing(false);
    switchBodyMode(() => setBodyMode('browse'));
    onDismiss();
  }, [draftEntryIds, onDismiss, setQuickEntryIds, switchBodyMode]);

  const editRightAction = useMemo((): EgSheetsProps['rightAction'] => {
    if (!navEditing) return undefined;
    const label = t('home.quickServiceSave');
    return {
      kind: 'text',
      label,
      onPress: saveAndClose,
      accessibilityLabel: label,
    };
  }, [navEditing, saveAndClose, t]);

  const addToDraft = useCallback((id: QuickServiceId) => {
    setDraftEntryIds((current) => {
      if (current.length >= HOME_QUICK_ENTRY_MAX || current.includes(id)) {
        return current;
      }
      return [...current, id];
    });
  }, []);

  const removeFromDraft = useCallback((id: QuickServiceId) => {
    setDraftEntryIds((current) => current.filter((entryId) => entryId !== id));
  }, []);

  const renderGrid = (
    items: QuickServiceDef[],
    options?: {
      badge?: 'add' | 'remove';
      canAdd?: boolean;
    },
  ) => (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'stretch',
        marginHorizontal: -gridGutterHalf,
        rowGap: gridRowGap,
      }}
    >
      {items.map((item) => {
        const addMode = options?.badge === 'add' && options.canAdd;
        const slotsFull = draftEntryIds.length >= HOME_QUICK_ENTRY_MAX;
        const inDraft = draftIdSet.has(item.id);
        const showRemoveFromCatalog = addMode && inDraft;
        const showAdd = addMode && !inDraft && !slotsFull;
        const showAddDisabled = addMode && !inDraft && slotsFull;
        const showRemove = options?.badge === 'remove';

        return (
          <View
            key={item.id}
            style={{
              width: GRID_COLUMN_PERCENT,
              paddingHorizontal: gridGutterHalf,
              alignItems: 'center',
            }}
          >
            <QuickServiceTile
              service={item}
              label={t(item.labelKey)}
              tileSize={tileSize}
              tilePadding={tilePadding}
              labelGap={labelGap}
              mode={mode}
              badge={
                showRemoveFromCatalog
                  ? 'removeDecor'
                  : showRemove
                    ? 'remove'
                    : showAdd
                      ? 'add'
                      : showAddDisabled
                        ? 'addDisabled'
                        : undefined
              }
              onBadgePress={
                showRemoveFromCatalog || showRemove
                  ? () => removeFromDraft(item.id)
                  : showAdd
                    ? () => addToDraft(item.id)
                    : undefined
              }
            />
          </View>
        );
      })}
    </View>
  );

  const browseBody = (
    <View style={{ gap: sectionGap, alignSelf: 'stretch' }}>
      <View
        style={{
          gap: edsPx(spacing['spacing-2']),
          alignSelf: 'stretch',
          marginTop: edsPx(spacing['spacing-3']),
        }}
      >
        <QuickServiceSectionTitle>
          {t('home.quickServicePinnedSection')}
        </QuickServiceSectionTitle>
        <View
          style={[
            pinnedBarShellStyle,
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingLeft: barPadLeft,
              paddingRight: barPadOther,
              paddingVertical: barPadOther,
              gap: edsPx(spacing['spacing-3']),
            },
          ]}
        >
          <QuickEntryPinnedIconRow items={pinnedTools} />
          <EgDecorButton
            label={t('home.quickServiceEdit')}
            mode={mode}
            size="sm"
            onPress={openEdit}
            testID="quick-services-edit"
          />
        </View>
      </View>

      {QUICK_SERVICE_SECTIONS.map((section) => (
        <SectionBlock key={section.id} title={t(section.titleKey)} gap={sectionTitleGap}>
          {renderGrid(section.items)}
        </SectionBlock>
      ))}
    </View>
  );

  const editBody = (
    <View style={{ gap: sectionGap, alignSelf: 'stretch' }}>
      <View
        style={{
          gap: edsPx(spacing['spacing-2']),
          alignSelf: 'stretch',
          marginTop: edsPx(spacing['spacing-3']),
        }}
      >
        <QuickServiceSectionTitle>
          {t('home.quickServicePinnedSection')}
        </QuickServiceSectionTitle>
        <QuickEntryEditSlotGrid
          entryIds={draftEntryIds}
          onChange={setDraftEntryIds}
          onRemove={removeFromDraft}
        />
      </View>

      {QUICK_SERVICE_SECTIONS.map((section) => (
        <SectionBlock key={section.id} title={t(section.titleKey)} gap={sectionTitleGap}>
          {renderGrid(section.items, { badge: 'add', canAdd: true })}
        </SectionBlock>
      ))}
    </View>
  );

  return (
    <EgSheets
      visible={visible}
      onDismiss={onDismiss}
      mode={mode}
      detents={['medium', 'large']}
      initialDetent="large"
      detent={sheetDetent}
      onDetentChange={setSheetDetent}
      title={t('home.quickServicesTitle')}
      showTitle
      showLeft={navEditing}
      onBack={cancelEdit}
      showRight
      rightAction={editRightAction}
      dismissible
      showActions={false}
    >
      {bodyMode === 'edit' ? editBody : browseBody}
    </EgSheets>
  );
}
