import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EgDataList } from '@/eds/data-list';
import { EgTag } from '@/eds/tag';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import { TeamCenterDetailDataListRow } from '@/scenes/team/detail/TeamCenterDetailDataListRow';
import { TeamSecurityLeadIcon } from '@/scenes/team/detail/TeamSecurityLeadIcon';
import {
  TEAM_SECURITY_ROW_ORDER,
  type TeamSecurityRowId,
} from '@/scenes/team/detail/teamCenterDetailMock';
import { teamCenterDataListRowGap } from '@/scenes/team/teamCenterDataListLayout';
import { edsSceneContentInset } from '@/utils/edsTheme';

function SecurityStatusTag({
  status,
}: {
  status: 'uncertified' | 'off' | 'unset' | 'set';
}) {
  const { mode } = useEdsTheme();
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

  return (
    <EgTag
      family="status"
      status={status === 'set' ? 'success' : 'danger'}
      variant="subtle"
      size="sm"
      rowAlign
      mode={mode}
      label={label}
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
    status: 'uncertified',
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
    status: 'unset',
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
            tag={<SecurityStatusTag status={meta.status} />}
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