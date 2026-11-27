import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { EgTag } from '@/eds/tag';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { WalletCryptoListLead } from '@/scenes/assets/WalletCryptoListLead';
import type { WalletAssetNetworkTag } from '@/scenes/assets/walletAssetNetwork';
import { TeamCenterDetailDataListRow } from '@/scenes/team/detail/TeamCenterDetailDataListRow';
import type { WalletAssetItem } from '@/store/useAssetsStore';

type WalletAssetRowProps = {
  item: WalletAssetItem;
  balanceVisible: boolean;
  onPress?: () => void;
};

function walletAssetNetworkRowTag(
  networkTag: WalletAssetNetworkTag,
  mode: 'light' | 'dark',
  multichainLabel: string,
  networkLabel: string,
) {
  if (networkTag.kind === 'none') {
    return undefined;
  }
  const label = networkTag.kind === 'multichain' ? multichainLabel : networkLabel;
  return (
    <EgTag
      family="system"
      variant="subtle"
      size="sm"
      rowAlign
      mode={mode}
      label={label}
      accessibilityLabel={label}
    />
  );
}

export function WalletAssetRow({
  item,
  balanceVisible,
  onPress,
}: WalletAssetRowProps) {
  const { t } = useTranslation();
  const { mode } = useEdsTheme();
  const amountSegment = balanceVisible ? item.balance : '****';
  const handlePress = onPress ?? (() => undefined);

  const networkLabel =
    item.networkTag.kind === 'single' ? t(item.networkTag.networkLabelKey) : '';
  const multichainLabel = t('scenes.walletMultichain');

  const tag = useMemo(
    () =>
      walletAssetNetworkRowTag(item.networkTag, mode, multichainLabel, networkLabel),
    [item.networkTag, mode, multichainLabel, networkLabel],
  );

  const a11yNetwork =
    item.networkTag.kind === 'multichain'
      ? multichainLabel
      : item.networkTag.kind === 'single'
        ? networkLabel
        : '';

  return (
    <TeamCenterDetailDataListRow
      accessibilityLabel={`${item.name} ${a11yNetwork} ${amountSegment} ${item.symbol}`.trim()}
      primary={item.name}
      tag={tag}
      subSegmentA={amountSegment}
      subSegmentB={` ${item.symbol}`}
      boldSubA
      lead={<WalletCryptoListLead currency={item.symbol} />}
      trailing={null}
      onPress={handlePress}
    />
  );
}