import { useMemo } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import {
  EgDataList,
  EG_DATA_LIST_SUB_TEXT_MAX_LINES,
  EG_DATA_LIST_TEXT_BOTTOM_TAG_GAP,
  EG_DATA_LIST_TEXT_BOTTOM_TAGS_GAP,
  EgDataListPrimaryRow,
  EgDataListRow,
  EgDataListSubText,
} from '@/eds/data-list';
import { EgTag } from '@/eds/tag';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TEAM_ADDRESS_BOOK_ROWS } from '@/scenes/team/detail/teamAddressBookDetailMock';
import {
  getTeamCenterDataListRowLayout,
  teamCenterDataListMediaGap,
} from '@/scenes/team/teamCenterDataListLayout';
import { edsCryptoSymbolForCurrency } from '@/utils/edsCryptoSymbol';
import { edsPx, edsSceneContentInset } from '@/utils/edsTheme';

function AddressBookCryptoLead({ currency }: { currency: string }) {
  const { mode, spacing } = useEdsTheme();
  const iconPx = edsPx(spacing['avatar-xl']);
  const symbol = edsCryptoSymbolForCurrency(currency) ?? 'eds-eth-ethereum';

  return (
    <EgSymbol
      name={symbol}
      mode={mode}
      displayPx={iconPx}
      accessibilityLabel={currency}
    />
  );
}

function AddressBookRow({
  name,
  address,
  currency,
  networkLabel,
  defaultReceive,
  defaultPay,
}: {
  name: string;
  address: string;
  currency: string;
  networkLabel: string;
  defaultReceive?: boolean;
  defaultPay?: boolean;
}) {
  const { t } = useTranslation();
  const { mode, spacing } = useEdsTheme();
  const layout = getTeamCenterDataListRowLayout(spacing);
  const mediaGap = teamCenterDataListMediaGap(spacing);
  const bottomTagGap = edsPx(EG_DATA_LIST_TEXT_BOTTOM_TAGS_GAP);

  return (
    <EgDataListRow
      mode={mode}
      axis="row"
      gap={mediaGap}
      layout={layout}
      accessibilityLabel={`${name} ${networkLabel} ${address}`}
      onPress={() => undefined}
    >
      <AddressBookCryptoLead currency={currency} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ gap: layout.titleSubGap }}>
          <EgDataListPrimaryRow mode={mode} weight="heavy">
            {name}
          </EgDataListPrimaryRow>
          <EgDataListSubText
            mode={mode}
            segmentA={address}
            segmentB=""
            numberOfLines={EG_DATA_LIST_SUB_TEXT_MAX_LINES}
            ellipsizeMode="tail"
          />
        </View>
        <View
          style={{
            marginTop: edsPx(EG_DATA_LIST_TEXT_BOTTOM_TAG_GAP),
            alignSelf: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: bottomTagGap,
          }}
        >
          {defaultReceive ? (
            <EgTag
              family="colorful"
              colorfulStyle="apricot"
              size="sm"
              rowAlign
              mode={mode}
              label={t('team.addressTagDefaultReceive')}
              accessibilityLabel={t('team.addressTagDefaultReceive')}
            />
          ) : null}
          {defaultPay ? (
            <EgTag
              family="colorful"
              colorfulStyle="grass"
              size="sm"
              rowAlign
              mode={mode}
              label={t('team.addressTagDefaultPay')}
              accessibilityLabel={t('team.addressTagDefaultPay')}
            />
          ) : null}
          <EgTag
            family="system"
            variant="subtle"
            size="sm"
            rowAlign
            mode={mode}
            label={networkLabel}
            accessibilityLabel={networkLabel}
          />
        </View>
      </View>
    </EgDataListRow>
  );
}

type TeamAddressBookDetailContentProps = {
  query?: string;
};

/** 地址簿 · 主文名称 · 副文地址 · 文本底网络 Tag（Showcase `textBottomTagEnabled`）。 */
export function TeamAddressBookDetailContent({
  query = '',
}: TeamAddressBookDetailContentProps) {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TEAM_ADDRESS_BOOK_ROWS;
    return TEAM_ADDRESS_BOOK_ROWS.filter((row) => {
      const network = t(row.networkLabelKey).toLowerCase();
      return (
        row.name.toLowerCase().includes(q) ||
        row.address.toLowerCase().includes(q) ||
        row.currency.toLowerCase().includes(q) ||
        network.includes(q)
      );
    });
  }, [query, t]);

  return (
    <EgDataList sceneContentInset={sceneInset} rowGap={0}>
      {filtered.map((row) => (
        <AddressBookRow
          key={row.id}
          name={row.name}
          address={row.address}
          currency={row.currency}
          networkLabel={t(row.networkLabelKey)}
          defaultReceive={row.defaultReceive}
          defaultPay={row.defaultPay}
        />
      ))}
    </EgDataList>
  );
}