import { buildCollaborationMockPayload } from '@/scenes/messages/messagesCollaborationMock';
import type { MessageCollaborationMock } from '@/scenes/messages/messagesCollaborationMock';
import {
  buildTeamActivityMockPayload,
  MESSAGE_TEAM_ACTIVITY_PER_SECTION,
} from '@/scenes/messages/messagesTeamActivityMock';
import type { MessageTeamActivityMock } from '@/scenes/messages/messagesTeamActivityMock';
import { HOME_TODO_MOCK_CURRENCIES_FIRST_10 } from '@/store/useHomeStore';

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

/** Mock · 各分类列表条数。 */
export const MESSAGE_MOCK_TARGETS: Record<MessageCategory, number> = {
  transaction: 8,
  teamActivity: 32,
  collaboration: 18,
  announcement: 52,
  amlAlert: 0,
};

/** Mock · 五 Tab 日期分组数量（0 = 无列表 / 空态）。 */
export const MESSAGE_MOCK_SECTION_COUNTS: Record<MessageCategory, number> = {
  transaction: 3,
  teamActivity: 6,
  collaboration: 5,
  announcement: 2,
  amlAlert: 0,
};

/** Mock · 各分类「今天」分区条数；其余均分到更早日期。 */
export const MESSAGE_MOCK_TODAY_TARGETS: Record<MessageCategory, number> = {
  transaction: 3,
  teamActivity: 1,
  collaboration: 2,
  announcement: 3,
  amlAlert: 0,
};

/** Mock · 各分类未读条数（Tab 角标 ↔ 行首 `EgReddot`）。 */
export const MESSAGE_MOCK_UNREAD_TARGETS: Record<MessageCategory, number> = {
  transaction: 2,
  teamActivity: 13,
  collaboration: 8,
  announcement: 3,
  amlAlert: 0,
};

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

/** Mock · 文案在组件内用 i18n key 映射（见 `MessagesCategoryScene`）。 */
export type MessageListItemDef = Omit<MessageListItem, 'title' | 'subtitle'> & {
  titleKey?: `messages.${string}`;
  subtitleKey?: `messages.${string}`;
  transaction?: MessageTransactionMock;
  teamActivity?: MessageTeamActivityMock;
  collaboration?: MessageCollaborationMock;
};

type MessageListItemTemplate = Pick<
  MessageListItemDef,
  'titleKey' | 'subtitleKey' | 'leadSymbol' | 'avatarLetter' | 'avatarColorIndex'
>;

const MESSAGE_TX_MOCK_AMOUNTS = [
  '0.5',
  '2.5',
  '100.00035',
  '5,087.005',
  '2.000000078',
  '0.045',
  '1,280.50',
  '730,650.83',
] as const;

const MESSAGE_TX_MOCK_ADDR_FROM = '0x1a2b3c4d5e6f7890abcdef12345678';
const MESSAGE_TX_MOCK_ADDR_TO = '0x9876fedcba0987654321abcd98765432';
const MESSAGE_TX_MOCK_WALLET_NAME = 'Quant Vault';

const MESSAGE_MOCK_TEMPLATES: Record<
  Exclude<MessageCategory, 'transaction' | 'teamActivity' | 'collaboration'>,
  readonly MessageListItemTemplate[]
> = {
  announcement: [
    {
      titleKey: 'messages.itemSubscriptionExpiring',
      subtitleKey: 'messages.itemSubscriptionExpiringSub',
    },
    {
      titleKey: 'messages.itemRenewal',
      subtitleKey: 'messages.itemRenewalSub',
    },
    {
      titleKey: 'messages.itemUpgrade',
      subtitleKey: 'messages.itemUpgradeSub',
    },
  ],
  amlAlert: [
    {
      titleKey: 'messages.mockAmlTitle',
      subtitleKey: 'messages.mockAmlSub',
      leadSymbol: 'eds-notice',
    },
  ],
};

const MESSAGE_CATEGORY_BUILD_ORDER: MessageCategory[] = [
  'transaction',
  'teamActivity',
  'collaboration',
  'announcement',
  'amlAlert',
];

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

/** 按段顺序产出 slot（不做全表重排）· 供团队动态等需固定「第 N 日 M 条」场景。 */
function buildMockScheduleSlotsFixedSections(
  perSectionCounts: readonly number[],
): MockScheduleSlot[] {
  const slots: MockScheduleSlot[] = [];
  let seq = 0;

  for (let dayOffset = 0; dayOffset < perSectionCounts.length; dayOffset += 1) {
    const dayCount = perSectionCounts[dayOffset] ?? 0;
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

  return slots;
}

function compareMessagesDisplayOrder(
  a: Pick<MessageListItemDef, 'sectionDayOffset' | 'sortKey'>,
  b: Pick<MessageListItemDef, 'sectionDayOffset' | 'sortKey'>,
): number {
  if (a.sectionDayOffset !== b.sectionDayOffset) {
    return a.sectionDayOffset - b.sectionDayOffset;
  }
  return b.sortKey - a.sortKey;
}

function assignTeamActivityByListOrder(drafts: MessageListItemDef[]): void {
  const ordered = [...drafts].sort(compareMessagesDisplayOrder);
  ordered.forEach((item, displayIndex) => {
    item.teamActivity = buildTeamActivityMockPayload(displayIndex);
  });
}

function buildMessageMockItems(): MessageListItemDef[] {
  const items: MessageListItemDef[] = [];
  let seq = 0;

  for (const category of MESSAGE_CATEGORY_BUILD_ORDER) {
    const total = MESSAGE_MOCK_TARGETS[category];
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

    if (category === 'transaction') {
      for (let i = 0; i < total; i += 1) {
        seq += 1;
        const slot = schedule[i]!;
        const currency =
          HOME_TODO_MOCK_CURRENCIES_FIRST_10[i % HOME_TODO_MOCK_CURRENCIES_FIRST_10.length]!;
        const direction: MessageTxDirection = i % 2 === 0 ? 'send' : 'receive';
        items.push({
          id: `msg-${category}-${seq}`,
          category,
          sectionDayOffset: slot.sectionDayOffset,
          timeHm: slot.timeHm,
          sortKey: slot.sortKey,
          unread: i < unreadCap,
          transaction: {
            amount: MESSAGE_TX_MOCK_AMOUNTS[i % MESSAGE_TX_MOCK_AMOUNTS.length]!,
            currency,
            direction,
            ...(direction === 'send'
              ? {
                  addressFrom: MESSAGE_TX_MOCK_ADDR_FROM,
                  addressTo: MESSAGE_TX_MOCK_ADDR_TO,
                }
              : {
                  walletName: MESSAGE_TX_MOCK_WALLET_NAME,
                  walletAddress: MESSAGE_TX_MOCK_ADDR_FROM,
                }),
          },
        });
      }
      continue;
    }

    if (category === 'teamActivity') {
      const teamSlots = buildMockScheduleSlotsFixedSections(MESSAGE_TEAM_ACTIVITY_PER_SECTION);
      const teamDrafts: MessageListItemDef[] = teamSlots.map((slot, i) => {
        seq += 1;
        return {
          id: `msg-${category}-${seq}`,
          category,
          sectionDayOffset: slot.sectionDayOffset,
          timeHm: slot.timeHm,
          sortKey: slot.sortKey,
          unread: i < unreadCap,
        };
      });
      assignTeamActivityByListOrder(teamDrafts);
      items.push(...teamDrafts);
      continue;
    }

    if (category === 'collaboration') {
      for (let i = 0; i < total; i += 1) {
        seq += 1;
        const slot = schedule[i]!;
        items.push({
          id: `msg-${category}-${seq}`,
          category,
          sectionDayOffset: slot.sectionDayOffset,
          timeHm: slot.timeHm,
          sortKey: slot.sortKey,
          unread: i < unreadCap,
          collaboration: buildCollaborationMockPayload(i),
        });
      }
      continue;
    }

    const templates = MESSAGE_MOCK_TEMPLATES[category];
    if (templates.length === 0) {
      continue;
    }

    for (let i = 0; i < total; i += 1) {
      seq += 1;
      const slot = schedule[i]!;
      const template = templates[i % templates.length]!;
      items.push({
        id: `msg-${category}-${seq}`,
        category,
        sectionDayOffset: slot.sectionDayOffset,
        timeHm: slot.timeHm,
        sortKey: slot.sortKey,
        titleKey: template.titleKey,
        subtitleKey: template.subtitleKey,
        unread: i < unreadCap,
        ...(template.leadSymbol ? { leadSymbol: template.leadSymbol } : {}),
        ...(template.avatarLetter != null
          ? {
              avatarLetter: template.avatarLetter,
              avatarColorIndex: template.avatarColorIndex,
            }
          : {}),
      });
    }
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
