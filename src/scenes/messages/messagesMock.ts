export type MessageCategory =
  | 'transaction'
  | 'teamActivity'
  | 'collaboration'
  | 'announcement'
  | 'amlAlert';

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
  transaction: 7,
  teamActivity: 32,
  collaboration: 5,
  announcement: 80,
  amlAlert: 3,
};

/** Mock · 文案在组件内用 i18n key 映射（见 `MessagesScene`）。 */
export type MessageListItemDef = Omit<MessageListItem, 'title' | 'subtitle' | 'timeLabel'> & {
  titleKey: `messages.${string}`;
  subtitleKey: `messages.${string}`;
  timeLabelKey: `messages.${string}`;
};

export const MESSAGE_MOCK_ITEMS: MessageListItemDef[] = [
  {
    id: 'msg-1',
    category: 'teamActivity',
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
    category: 'teamActivity',
    sectionKey: 'today',
    titleKey: 'messages.mockCooperTitle',
    subtitleKey: 'messages.mockCooperSub',
    timeLabelKey: 'messages.mockTime1023',
    unread: false,
    avatarLetter: 'R',
    avatarColorIndex: 3,
  },
  {
    id: 'msg-tx-1',
    category: 'transaction',
    sectionKey: 'today',
    titleKey: 'messages.mockTxTitle',
    subtitleKey: 'messages.mockTxSub',
    timeLabelKey: 'messages.mockTime1023',
    unread: true,
    leadSymbol: 'eds-scan-code',
  },
  {
    id: 'msg-col-1',
    category: 'collaboration',
    sectionKey: 'today',
    titleKey: 'messages.mockCollabTitle',
    subtitleKey: 'messages.mockCollabSub',
    timeLabelKey: 'messages.mockTime1023',
    unread: false,
    avatarLetter: 'A',
    avatarColorIndex: 1,
  },
  {
    id: 'msg-3',
    category: 'announcement',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemSubscriptionExpiring',
    subtitleKey: 'messages.itemSubscriptionExpiringSub',
    timeLabelKey: 'messages.weekdayMon',
    unread: true,
    leadSymbol: 'eds-diamond',
  },
  {
    id: 'msg-4',
    category: 'announcement',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemRenewal',
    subtitleKey: 'messages.itemRenewalSub',
    timeLabelKey: 'messages.weekdayThu',
    unread: true,
    leadSymbol: 'eds-bill',
  },
  {
    id: 'msg-5',
    category: 'announcement',
    sectionKey: 'yesterday',
    titleKey: 'messages.itemUpgrade',
    subtitleKey: 'messages.itemUpgradeSub',
    timeLabelKey: 'messages.weekdaySat',
    unread: false,
    leadSymbol: 'eds-arrow-up',
  },
  {
    id: 'msg-aml-1',
    category: 'amlAlert',
    sectionKey: 'yesterday',
    titleKey: 'messages.mockAmlTitle',
    subtitleKey: 'messages.mockAmlSub',
    timeLabelKey: 'messages.weekdayMon',
    unread: true,
    leadSymbol: 'eds-notice',
  },
];
