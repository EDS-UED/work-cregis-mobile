import { useTranslation } from 'react-i18next';

import { WalletNavTitleRow } from '@/scenes/assets/WalletNavTitleRow';
import { useAssetsStore } from '@/store';

type WalletNavTitleProps = {
  onOpenSwitcher: () => void;
};

export function WalletNavTitle({ onOpenSwitcher }: WalletNavTitleProps) {
  const { t } = useTranslation();
  const walletName = useAssetsStore((s) => s.walletName);

  return (
    <WalletNavTitleRow
      showChevron
      interactive
      onPress={onOpenSwitcher}
      accessibilityLabel={t('scenes.walletOpenSwitcher', { name: walletName })}
    />
  );
}