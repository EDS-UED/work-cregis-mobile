export type MessageCategory = 'team' | 'transaction' | 'system';

export type MessageListItem = {
  id: string;
  category: MessageCategory;
  sectionKey: 'today' | 'yesterday';
  title: string;
  subtitle: string;
  timeLabel: string;
  unread: boolean;
  avatarLetter?: string;
  avatarColorIndex?: number;
  leadSymbol?: string;
};

export const MESSAGE_CATEGORY_BADGE: Record<MessageCategory, number> = {
  team: 32,
  transaction: 7,
  system: 80,
};

/** Mock · 文案在组件内用 i18n key 映射（见 `MessagesListSection`）。 */
export type MessageListItemDef = Omit<MessageListItem, 'title' | 'subtitle' | 'timeLabel'> & {
  titleKey: `messages.${string}`;
  subtitleKey: `messages.${string}`;
  timeLabelKey: `messages.${string}`;
};

export const MESSAGE_MOCK_ITEMS: MessageListItemDef[] = [
  {
    id: 'msg-1',
    category: 'team',
    sectionKey: 'today',
    titleKey: 'messages.mockAlexTitle',
    subtitleKey: 'messages.mockAlexSub',
    timeLabelKey: 'messages.mockTime1023',
    unread: true,
    avatarLetter: 'R',
    avatarColorIndex: 6,
  },
  {
    id: 'msg-2',
    category: 'team',
    sectionKey: 'today',
    titleKey: 'messages.mockCooperTitle',
    subtitleKey: 'messages.mockCooperSub',
    timeLabelKey: 'messages.mockTime1023',
    unread: false,
    avatarLetter: 'R',
    avatarColorIndex: 3,
  },
  {
    id: 'msg-3',
    category: 'system',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemSubscriptionExpiring',
    subtitleKey: 'messages.itemSubscriptionExpiringSub',
    timeLabelKey: 'messages.weekdayMon',
    unread: true,
    leadSymbol: 'eds-diamond',
  },
  {
    id: 'msg-4',
    category: 'system',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemRenewal',
    subtitleKey: 'messages.itemRenewalSub',
    timeLabelKey: 'messages.weekdayThu',
    unread: true,
    leadSymbol: 'eds-bill',
  },
  {
    id: 'msg-5',
    category: 'system',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemUpgrade',
    subtitleKey: 'messages.itemUpgradeSub',
    timeLabelKey: 'messages.weekdaySat',
    unread: false,
    leadSymbol: 'eds-arrow-up',
  },
];
