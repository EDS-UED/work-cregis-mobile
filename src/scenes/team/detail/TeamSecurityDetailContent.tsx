import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { EgSymbol } from '@/eds/home-ui';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { edsPx } from '@/utils/edsTheme';
import { TeamCenterDetailDataListRow } from '@/scenes/team/detail/TeamCenterDetailDataListRow';
import { TeamSecurityLeadIcon } from '@/scenes/team/detail/TeamSecurityLeadIcon';
import {
  TEAM_SECURITY_ROW_ORDER,
  type TeamSecurityRowId,
} from '@/scenes/team/detail/teamCenterDetailMock';
import { teamCenterDataListRowGap } from '@/scenes/team/teamCenterDataListLayout';
import { edsSceneContentInset } from '@/utils/edsTheme';

/**
 * 行内状态标 · 两档：
 * - 未设置 / 未开启 / 未认证 → `eds-warning-fill` + `status-danger`
 * - 已设置 / 已完成 → `eds-enable-fill` + `status-success`
 */
function SecurityStatusIcon({
  status,
}: {
  status: 'uncertified' | 'off' | 'unset' | 'set';
}) {
  const { mode, spacing } = useEdsTheme();
  const { t } = useTranslation();
  const label = t(
    status === 'set'
      ? 'team.securityTagSet'
      : status === 'off'
        ? 'team.securityTagOff'
        : status === 'unset'
          ? 'team.securityTagUnset'
          : 'team.securityTagUncertified',
  );
  const settled = status === 'set';

  return (
    <EgSymbol
      name={settled ? 'eds-enable-fill' : 'eds-warning-fill'}
      mode={mode}
      size="xs"
      displayPx={edsPx(spacing['symbol-xs'])}
      fillTone="primary"
      strokeColorToken={settled ? 'status-success' : 'status-danger'}
      accessibilityLabel={label}
    />
  );
}

const ROW_META: Record<
  TeamSecurityRowId,
  {
    titleKey: `team.${string}`;
    subtitleKey: `team.${string}`;
    status: 'uncertified' | 'off' | 'unset' | 'set';
    trailing: 'chevron' | 'switch';
  }
> = {
  enterpriseVerification: {
    titleKey: 'team.securityEnterpriseTitle',
    subtitleKey: 'team.securityEnterpriseSub',
    status: 'set',
    trailing: 'chevron',
  },
  addressBookVerification: {
    titleKey: 'team.securityAddressBookTitle',
    subtitleKey: 'team.securityAddressBookSub',
    status: 'off',
    trailing: 'switch',
  },
  riskControl: {
    titleKey: 'team.securityRiskTitle',
    subtitleKey: 'team.securityRiskSub',
    status: 'set',
    trailing: 'chevron',
  },
  inviteMembers: {
    titleKey: 'team.securityInviteTitle',
    subtitleKey: 'team.securityInviteSub',
    status: 'set',
    trailing: 'chevron',
  },
};

/** 团队安全 · Hue 行首 · EgDataList。 */
export function TeamSecurityDetailContent() {
  const { t } = useTranslation();
  const { spacing } = useEdsTheme();
  const sceneInset = edsSceneContentInset(spacing);
  const [addressVerify, setAddressVerify] = useState(false);

  const rows = useMemo(
    () =>
      TEAM_SECURITY_ROW_ORDER.map((id) => {
        const meta = ROW_META[id];
        const title = t(meta.titleKey);
        return (
          <TeamCenterDetailDataListRow
            key={id}
            testID={`team-security-row-${id}`}
            accessibilityLabel={title}
            lead={<TeamSecurityLeadIcon rowId={id} />}
            primary={title}
            tag={<SecurityStatusIcon status={meta.status} />}
            subSegmentB={t(meta.subtitleKey)}
            trailing={meta.trailing}
            switchValue={addressVerify}
            onSwitchChange={meta.trailing === 'switch' ? setAddressVerify : undefined}
            onPress={meta.trailing === 'chevron' ? () => undefined : undefined}
          />
        );
      }),
    [addressVerify, t],
  );

  return (
    <EgDataList sceneContentInset={sceneInset} rowGap={teamCenterDataListRowGap(spacing)}>
      {rows}
    </EgDataList>
  );
}