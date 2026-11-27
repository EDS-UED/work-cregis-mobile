import type { MessageCollaborationMock } from '@/scenes/messages/messagesCollaborationMock';
import type { MessageTeamActivityMock } from '@/scenes/messages/messagesTeamActivityMock';
import { ANNOUNCEMENTS } from '@/scenes/messages/announcements';
import {
  NOTIFICATION_EXAMPLES,
  type NotificationExample,
} from '@/scenes/messages/notificationExamples';

export type MessageTxDirection = 'send' | 'receive';

export type MessageTransactionMock = {
  amount: string;
  currency: string;
  direction: MessageTxDirection;
  addressFrom?: string;
  addressTo?: string;
  walletName?: string;
  walletAddress?: string;
};

export type MessageCategory =
  | 'transaction'
  | 'teamActivity'
  | 'collaboration'
  | 'announcement'
  | 'amlAlert';

export type MessageListItem = {
  id: string;
  category: MessageCategory;
  /** 0 = 今天 · 递增为更早日期。 */
  sectionDayOffset: number;
  title: string;
  subtitle: string;
  /** 行尾时分 · `HH:mm`。 */
  timeHm: string;
  /** Mock 排序 · 越大越新（列表自上而下递减）。 */
  sortKey: number;
  unread: boolean;
  avatarLetter?: string;
  avatarColorIndex?: number;
  leadSymbol?: string;
};

const MESSAGE_CATEGORIES: MessageCategory[] = [
  'transaction',
  'teamActivity',
  'collaboration',
  'announcement',
  'amlAlert',
];

function exampleCount(category: MessageCategory): number {
  if (category === 'announcement') {
    return ANNOUNCEMENTS.length;
  }
  return NOTIFICATION_EXAMPLES.filter((item) => item.category === category).length;
}

function sectionCountFor(total: number): number {
  if (total <= 0) {
    return 0;
  }
  if (total === 1) {
    return 1;
  }
  if (total <= 8) {
    return 2;
  }
  return 3;
}

function todayCountFor(total: number, sectionCount: number): number {
  if (sectionCount <= 1) {
    return total;
  }
  return Math.max(1, Math.ceil(total / sectionCount));
}

function unreadCountFor(total: number): number {
  if (total <= 1) {
    return total;
  }
  return 2;
}

function countRecord(
  valueFor: (category: MessageCategory) => number,
): Record<MessageCategory, number> {
  return {
    transaction: valueFor('transaction'),
    teamActivity: valueFor('teamActivity'),
    collaboration: valueFor('collaboration'),
    announcement: valueFor('announcement'),
    amlAlert: valueFor('amlAlert'),
  };
}

/** 各分类列表条数 · 与通知模板表一一对应。 */
export const MESSAGE_MOCK_TARGETS: Record<MessageCategory, number> = countRecord(exampleCount);

/** 日期分组数量（0 = 无列表 / 空态）。 */
export const MESSAGE_MOCK_SECTION_COUNTS: Record<MessageCategory, number> = countRecord(
  (category) => sectionCountFor(exampleCount(category)),
);

/** 各分类「今天」分区条数；其余均分到更早日期。 */
export const MESSAGE_MOCK_TODAY_TARGETS: Record<MessageCategory, number> = countRecord(
  (category) => todayCountFor(exampleCount(category), sectionCountFor(exampleCount(category))),
);

/** 各分类未读条数（分类角标 ↔ 行上 `EgReddot`）。 */
export const MESSAGE_MOCK_UNREAD_TARGETS: Record<MessageCategory, number> = countRecord(
  (category) => unreadCountFor(exampleCount(category)),
);

/** 通知前置 / 首页胶囊 · 各分类未读之和（与 hub 行 `EgMessage` 数字合计一致）。 */
export function messageTotalUnreadCount(
  items: readonly { category: MessageCategory; unread: boolean }[] = MESSAGE_MOCK_ITEMS,
): number {
  const counts = messageCategoryUnreadCounts(items);
  return (
    counts.transaction +
    counts.teamActivity +
    counts.collaboration +
    counts.announcement +
    counts.amlAlert
  );
}

/** 通知分段角标 · 各分类未读条数。 */
export function messageCategoryUnreadCounts(
  items: readonly { category: MessageCategory; unread: boolean }[],
): Record<MessageCategory, number> {
  const counts: Record<MessageCategory, number> = {
    transaction: 0,
    teamActivity: 0,
    collaboration: 0,
    announcement: 0,
    amlAlert: 0,
  };
  for (const item of items) {
    if (item.unread) {
      counts[item.category] += 1;
    }
  }
  return counts;
}

export type MessageNoticeMock = {
  templateKey: string;
  /** 模板 Landing Page 可进入。 */
  canRedirect: boolean;
  copy: NotificationExample['copy'];
};

/** 列表文案来自通知模板表；旧 payload 仍保留给未迁移行。 */
export type MessageListItemDef = Omit<MessageListItem, 'title' | 'subtitle'> & {
  titleKey?: `messages.${string}`;
  subtitleKey?: `messages.${string}`;
  transaction?: MessageTransactionMock;
  teamActivity?: MessageTeamActivityMock;
  collaboration?: MessageCollaborationMock;
  notice?: MessageNoticeMock;
};

function distributeAcrossSections(
  total: number,
  sectionCount: number,
  firstSectionCount: number,
): number[] {
  const counts = Array.from({ length: sectionCount }, () => 0);
  if (sectionCount === 0 || total === 0) {
    return counts;
  }
  counts[0] = Math.min(firstSectionCount, total);
  let remaining = total - counts[0];
  for (let s = 1; s < sectionCount && remaining > 0; s += 1) {
    const sectionsLeft = sectionCount - s;
    const share = Math.ceil(remaining / sectionsLeft);
    counts[s] = share;
    remaining -= share;
  }
  return counts;
}

type MockScheduleSlot = Pick<MessageListItem, 'sectionDayOffset' | 'timeHm' | 'sortKey'>;

/** 按日分组生成时分 · 全局时间递增；展示时按 `sortKey` 降序（新在上）。 */
function buildMockScheduleSlots(
  perSectionCounts: number[],
): MockScheduleSlot[] {
  const slots: MockScheduleSlot[] = [];
  let seq = 0;

  for (let dayOffset = 0; dayOffset < perSectionCounts.length; dayOffset += 1) {
    const dayCount = perSectionCounts[dayOffset]!;
    for (let j = 0; j < dayCount; j += 1) {
      const minuteOfDay = 8 * 60 + seq * 23 + j * 11;
      const hours = Math.floor((minuteOfDay % (24 * 60)) / 60);
      const minutes = minuteOfDay % 60;
      const timeHm = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      const sortKey = dayOffset * 24 * 60 * 60 + minuteOfDay * 60 + j;
      slots.push({ sectionDayOffset: dayOffset, timeHm, sortKey });
      seq += 1;
    }
  }

  return slots.sort((a, b) => b.sortKey - a.sortKey);
}

function buildMessageMockItems(): MessageListItemDef[] {
  const items: MessageListItemDef[] = [];

  for (const category of MESSAGE_CATEGORIES) {
    if (category === 'announcement') {
      const total = ANNOUNCEMENTS.length;
      const perSection = distributeAcrossSections(
        total,
        MESSAGE_MOCK_SECTION_COUNTS[category],
        MESSAGE_MOCK_TODAY_TARGETS[category],
      );
      const schedule = buildMockScheduleSlots(perSection);
      ANNOUNCEMENTS.forEach((article, index) => {
        const slot = schedule[index];
        if (!slot) {
          return;
        }
        items.push({
          id: `msg-announcement-${article.id}`,
          category,
          sectionDayOffset: slot.sectionDayOffset,
          timeHm: slot.timeHm,
          sortKey: slot.sortKey,
          unread: index < MESSAGE_MOCK_UNREAD_TARGETS.announcement,
          notice: {
            templateKey: article.id,
            canRedirect: false,
            copy: {
              'zh-CN': { title: article.title['zh-CN'], body: '' },
              'en-US': { title: article.title['en-US'], body: '' },
              'zh-TW': { title: article.title['zh-TW'], body: '' },
            },
          },
        });
      });
      continue;
    }

    const examples = NOTIFICATION_EXAMPLES.filter((item) => item.category === category);
    const total = examples.length;
    const sectionCount = MESSAGE_MOCK_SECTION_COUNTS[category];
    if (total === 0 || sectionCount === 0) {
      continue;
    }

    const perSection = distributeAcrossSections(
      total,
      sectionCount,
      MESSAGE_MOCK_TODAY_TARGETS[category],
    );
    const schedule = buildMockScheduleSlots(perSection);
    const unreadCap = Math.min(MESSAGE_MOCK_UNREAD_TARGETS[category], total);

    examples.forEach((example, index) => {
      const slot = schedule[index];
      if (!slot) {
        return;
      }
      items.push({
        id: `msg-${example.templateKey}`,
        category,
        sectionDayOffset: slot.sectionDayOffset,
        timeHm: slot.timeHm,
        sortKey: slot.sortKey,
        unread: index < unreadCap,
        notice: {
          templateKey: example.templateKey,
          canRedirect: example.canRedirect,
          copy: example.copy,
        },
      });
    });
  }

  return items;
}

export const MESSAGE_MOCK_ITEMS: MessageListItemDef[] = buildMessageMockItems();

export function groupMessageItemsByDateSection(
  items: readonly MessageListItemDef[],
  category: MessageCategory,
): MessageListItemDef[][] {
  const sectionCount = MESSAGE_MOCK_SECTION_COUNTS[category];
  if (sectionCount === 0) {
    return [];
  }

  const buckets: MessageListItemDef[][] = Array.from({ length: sectionCount }, () => []);
  for (const item of items) {
    if (item.category !== category) {
      continue;
    }
    const bucket = buckets[item.sectionDayOffset];
    if (bucket) {
      bucket.push(item);
    }
  }

  for (const bucket of buckets) {
    bucket.sort((a, b) => b.sortKey - a.sortKey);
  }

  return buckets;
}
