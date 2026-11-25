import { View } from 'react-native';

import { EgDivider } from '@/eds/team-icons';
import { useEdsTheme } from '@/hooks/useEdsTheme';
import {
  messagesHubRowDividerInsets,
  messagesListRowDividerInsets,
} from '@/scenes/messages/messagesDataListLayout';

type MessagesListRowDividerProps = {
  /** 前置五类行 — `capsule-md` 对齐；默认内页 `avatar-xl`。 */
  variant?: 'hub' | 'list';
};

/** 通知 DL · 行间 `EgDivider`（左缘对齐主标题）。 */
export function MessagesListRowDivider({ variant = 'list' }: MessagesListRowDividerProps) {
  const { mode, spacing } = useEdsTheme();
  const insets =
    variant === 'hub'
      ? messagesHubRowDividerInsets(spacing)
      : messagesListRowDividerInsets(spacing);

  return (
    <View style={{ paddingLeft: insets.paddingLeft, paddingRight: insets.paddingRight }}>
      <EgDivider variant="module" mode={mode} />
    </View>
  );
}