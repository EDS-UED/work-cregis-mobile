import { useMemo } from 'react';

import type { TeamCenterDetailId } from '@/scenes/team/teamCenterDetail';
import { TeamCenterDetailNavTrailing } from '@/scenes/team/detail/TeamCenterDetailNavParts';

/** 团队中心子页 overlay 顶栏右区（iOS 26+ 系统栏见 {@link useTeamCenterDetailIosNativeHeaderItems}）。 */
export function useTeamCenterDetailNavExtras(detailId: TeamCenterDetailId) {
  return useMemo(
    () => <TeamCenterDetailNavTrailing detailId={detailId} />,
    [detailId],
  );
}