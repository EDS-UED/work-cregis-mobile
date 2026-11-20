import type { TFunction } from 'i18next';

import {
  type MessageCategory,
  type MessageListItemDef,
  MESSAGE_MOCK_ITEMS,
  groupMessageItemsByDateSection,
} from '@/scenes/messages/messagesMock';
import { resolveTeamActivityCopy } from '@/scenes/messages/messagesTeamActivityCopy';

/** 前置页五类顺序（与 Tab 旧序不同）。 */
export const MESSAGE_HUB_CATEGORY_ORDER: MessageCategory[] = [
  'transaction',
  'collaboration',
  'amlAlert',
  'teamActivity',
  'announcement',
];

export const messageCategoryLabelKey: Record<MessageCategory, `messages.${string}`> = {
  transaction: 'messages.categoryTransaction',
  teamActivity: 'messages.categoryTeamActivity',
  collaboration: 'messages.categoryCollaboration',
  announcement: 'messages.categoryAnnouncement',
  amlAlert: 'messages.categoryAmlAlert',
};

/** 内页列表首条（最新分组的第一行）。 */
export function getLeadingMessageForCategory(
  category: MessageCategory,
  items: readonly MessageListItemDef[] = MESSAGE_MOCK_ITEMS,
): MessageListItemDef | undefined {
  const buckets = groupMessageItemsByDateSection(items, category);
  for (const bucket of buckets) {
    if (bucket.length > 0) {
      return bucket[0];
    }
  }
  return undefined;
}

export type CategoryHubSubtitleSegments = {
  segmentA: string;
  segmentB?: string;
  boldSegmentA?: boolean;
};

const hubEmptySubtitle = (t: TFunction): CategoryHubSubtitleSegments => ({
  segmentA: t('messages.hubNoNotifications'),
  boldSegmentA: false,
});

/** 前置页副文本 · 字段 A 加粗（`EgDataListSubText.boldSegmentA`）。 */
export function formatCategoryHubSubtitleSegments(
  category: MessageCategory,
  item: MessageListItemDef | undefined,
  t: TFunction,
): CategoryHubSubtitleSegments {
  if (!item) {
    return hubEmptySubtitle(t);
  }

  switch (category) {
    case 'transaction': {
      const tx = item.transaction;
      if (!tx) {
        return hubEmptySubtitle(t);
      }
      const action =
        tx.direction === 'receive' ? t('messages.txReceive') : t('messages.txSend');
      return {
        segmentA: action,
        segmentB: ` ${tx.amount} ${tx.currency}`,
        boldSegmentA: true,
      };
    }
    case 'collaboration': {
      const collab = item.collaboration;
      if (!collab) {
        return hubEmptySubtitle(t);
      }
      return {
        segmentA: collab.memberName,
        segmentB: ` ${t('messages.collabPaymentRequest')} ${collab.amount} ${collab.currency}`,
        boldSegmentA: true,
      };
    }
    case 'amlAlert':
      if (item.titleKey && item.subtitleKey) {
        return {
          segmentA: t(item.titleKey),
          segmentB: ` ${t(item.subtitleKey)}`,
          boldSegmentA: true,
        };
      }
      if (item.subtitleKey) {
        return { segmentA: t(item.subtitleKey), boldSegmentA: false };
      }
      return hubEmptySubtitle(t);
    case 'teamActivity': {
      const activity = item.teamActivity;
      if (!activity) {
        return hubEmptySubtitle(t);
      }
      const { title, subtitle } = resolveTeamActivityCopy(activity, t);
      switch (activity.kind) {
        case 'removedFromTeam':
        case 'removedFromWallet':
          return { segmentA: subtitle, boldSegmentA: true };
        default:
          return {
            segmentA: title,
            segmentB: subtitle ? ` ${subtitle}` : '',
            boldSegmentA: true,
          };
      }
    }
    case 'announcement':
      if (item.subtitleKey) {
        return { segmentA: t(item.subtitleKey), boldSegmentA: false };
      }
      return hubEmptySubtitle(t);
    default:
      return hubEmptySubtitle(t);
  }
}

/** 前置页 · 首条通知时间 · 仅 `HH:mm`。 */
export function formatCategoryHubTimeLabel(
  item: MessageListItemDef | undefined,
): string | undefined {
  return item?.timeHm;
}