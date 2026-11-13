import type { ImageSourcePropType } from 'react-native';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { EgAvatar } from '@/eds/button-glass';
import { EgReddot } from '@/eds/feedback';
import { EgSymbol } from '@/eds/home-ui';
import { useTranslation } from 'react-i18next';

import { QUICK_SERVICE_DEFAULT_ICON } from '@/scenes/home/homeQuickServiceIcons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx } from '@/utils/edsTheme';

type MessagesListLeadIconProps = {
  unread?: boolean;
  avatarLetter?: string;
  /** 团队/成员全名 · `EgAvatar`。 */
  avatarName?: string;
  avatarSource?: ImageSourcePropType;
  avatarColorIndex?: number;
  leadSymbol?: string;
  /** 系统/公告类 · 灰底 + `eds-pentagram`（`symbol-xs` 16px）。 */
  leadSystemPlaceholder?: boolean;
  /** 移出团队/钱包 · `status-danger` + `eds-arrow-refuses`。 */
  leadDangerRefuse?: boolean;
  /** 交易行 · 币种图（`HOME_TODO_MOCK_CURRENCIES_FIRST_10` 顺序）。 */
  cryptoCurrency?: string;
};

/** 通知 DL 行首 · 五 Tab 统一 `avatar-xl`（与首页待办币种图同尺）。 */
export function MessagesListLeadIcon({
  unread,
  avatarLetter,
  avatarName,
  avatarSource,
  avatarColorIndex,
  leadSymbol,
  leadSystemPlaceholder,
  leadDangerRefuse,
  cryptoCurrency,
}: MessagesListLeadIconProps) {
  const { t } = useTranslation();
  const { mode, colors, spacing } = useEdsTheme();
  const cryptoSymbol = cryptoCurrency
    ? edsCryptoSymbolForCurrency(cryptoCurrency)
    : null;
  const isCryptoLead = cryptoSymbol != null;
  const slot = edsPx(spacing['avatar-xl']);
  const reddotOutset = edsPx(spacing['spacing-05']);
  /** 未读点相对角位向内收 2px（左、下）。 */
  const reddotNudgeIn = edsPx(spacing['spacing-05']);

  const styles = useMemo(
    () =>
      StyleSheet.create({
        host: {
          width: slot,
          height: slot,
          position: 'relative',
          overflow: 'visible',
          alignItems: 'center',
          justifyContent: 'center',
        },
        shell: {
          width: slot,
          height: slot,
          borderRadius: edsPx(spacing['radius-full']),
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: String(colors['material-card-deep']),
        },
        shellUnread: {
          backgroundColor: String(colors['material-brand-weaken']),
        },
        shellAvatar: {
          backgroundColor: 'transparent',
        },
        /** 币种图铺满槽位 · 无灰色圆底。 */
        shellCrypto: {
          backgroundColor: 'transparent',
        },
        shellDanger: {
          backgroundColor: String(colors['status-danger']),
        },
        badge: {
          position: 'absolute',
          top: -reddotOutset + reddotNudgeIn,
          right: -reddotOutset + reddotNudgeIn,
        },
      }),
    [colors, reddotNudgeIn, reddotOutset, slot, spacing],
  );

  const isSystem = leadSystemPlaceholder === true;
  const hasAvatar = avatarName != null || avatarLetter != null;
  if (!hasAvatar && !leadSymbol && !cryptoSymbol && !leadDangerRefuse && !isSystem) {
    return null;
  }

  const isAvatar = hasAvatar;
  const isCrypto = isCryptoLead;
  const isDanger = leadDangerRefuse === true;
  const symbolStroke = unread ? 'stroke-decor' : 'text-base-primary';
  const dangerSymbolPx = edsPx(spacing['symbol-xs']);
  const systemSymbolPx = edsPx(spacing['symbol-xs']);

  const lead = isDanger ? (
    <EgSymbol
      name="eds-arrow-refuses"
      mode={mode}
      displayPx={dangerSymbolPx}
      fillTone="primary"
      strokeColorToken="stroke-same-white"
      accessibilityLabel=""
    />
  ) : isAvatar ? (
    <EgAvatar
      name={avatarName ?? avatarLetter ?? ''}
      size="xl"
      colorIndex={avatarColorIndex}
      source={avatarSource}
      accessibilityLabel=""
    />
  ) : isCrypto ? (
    <EgSymbol
      name={cryptoSymbol}
      mode={mode}
      displayPx={slot}
      accessibilityLabel=""
    />
  ) : isSystem ? (
    <EgSymbol
      name={QUICK_SERVICE_DEFAULT_ICON}
      mode={mode}
      displayPx={systemSymbolPx}
      fillTone={unread ? 'decor' : 'primary'}
      strokeColorToken={symbolStroke}
      accessibilityLabel=""
    />
  ) : (
    <EgSymbol
      name={leadSymbol!}
      mode={mode}
      size="md"
      fillTone={unread ? 'decor' : 'primary'}
      strokeColorToken={symbolStroke}
      accessibilityLabel=""
    />
  );

  const shellStyle = [
    styles.shell,
    isDanger ? styles.shellDanger : null,
    !isDanger && unread ? styles.shellUnread : null,
    (isAvatar || isCrypto) && !unread && !isDanger ? styles.shellAvatar : null,
    isCrypto ? styles.shellCrypto : null,
    /** 系统类已读 · 保留 `material-card-deep`（不设 transparent）。 */
  ];

  return (
    <View style={styles.host}>
      <View style={shellStyle}>{lead}</View>
      {unread ? (
        <View pointerEvents="none" style={styles.badge}>
          <EgReddot mode={mode} accessibilityLabel={t('messages.unreadBadge')} />
        </View>
      ) : null}
    </View>
  );
}
