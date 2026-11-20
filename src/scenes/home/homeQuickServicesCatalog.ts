/** 首页快捷入口 + 服务 Sheet 共用服务目录（最多 7 项同步至首页）。 */

export const HOME_QUICK_ENTRY_MAX = 7;
/** 首页快捷区每行最多格数（含「更多」顺序排在已选入口后）。 */
export const HOME_QUICK_ENTRY_PER_ROW = 4;
export const HOME_QUICK_ENTRY_WRAP_AFTER = HOME_QUICK_ENTRY_PER_ROW;

export type QuickServiceId =
  | 'send'
  | 'receive'
  | 'subAddressManage'
  | 'withdrawRecord'
  | 'callbackRecord'
  | 'projectSettings'
  | 'amlAutoRule'
  | 'amlQueryRecord'
  | 'strategy'
  | 'log'
  | 'automation'
  | 'whitelist'
  | 'blacklist'
  | 'subscription'
  | 'teamAccount'
  | 'order'
  | 'member'
  | 'role'
  | 'teamApi'
  | 'webhook'
  | 'appMarketTeamRole'
  | 'remittance'
  | 'swap'
  /** @deprecated 旧版目录项，仅用于解析已保存的快捷入口 */
  | 'todoList'
  | 'walletWithdraw'
  | 'subAddressWithdraw'
  | 'developer'
  | 'ipWhitelist'
  | 'callbackSettings'
  | 'notificationSettings'
  | 'paymentRequest'
  | 'exchange'
  | 'aml'
  | 'bill'
  | 'signMessage';

export type QuickServiceDef = {
  id: QuickServiceId;
  icon: string;
  labelKey: `home.${string}`;
};

export type QuickServiceSectionId =
  | 'transfer'
  | 'waas'
  | 'risk'
  | 'admin'
  | 'appMarket';

export type QuickServiceSection = {
  id: QuickServiceSectionId;
  titleKey: `home.${string}`;
  items: QuickServiceDef[];
};

export const DEFAULT_QUICK_ENTRY_IDS: QuickServiceId[] = [
  'send',
  'receive',
  'whitelist',
];

const icon = (name = 'eds-pentagram') => name;

export const QUICK_SERVICE_SECTIONS: QuickServiceSection[] = [
  {
    id: 'transfer',
    titleKey: 'home.quickServiceSectionTransfer',
    items: [
      { id: 'send', icon: icon(), labelKey: 'home.send' },
      { id: 'receive', icon: icon(), labelKey: 'home.receive' },
    ],
  },
  {
    id: 'waas',
    titleKey: 'home.quickServiceSectionWaas',
    items: [
      { id: 'subAddressManage', icon: icon(), labelKey: 'home.quickServiceSubAddressManage' },
      { id: 'withdrawRecord', icon: icon(), labelKey: 'home.quickServiceWithdrawRecord' },
      { id: 'callbackRecord', icon: icon(), labelKey: 'home.quickServiceCallbackRecord' },
      { id: 'projectSettings', icon: icon(), labelKey: 'home.quickServiceProjectSettings' },
    ],
  },
  {
    id: 'risk',
    titleKey: 'home.quickServiceSectionRisk',
    items: [
      { id: 'amlAutoRule', icon: icon(), labelKey: 'home.quickServiceAmlAutoRule' },
      { id: 'amlQueryRecord', icon: icon(), labelKey: 'home.quickServiceAmlQueryRecord' },
      { id: 'strategy', icon: icon(), labelKey: 'home.quickServiceStrategy' },
      { id: 'log', icon: icon(), labelKey: 'home.quickServiceLog' },
      { id: 'automation', icon: icon(), labelKey: 'home.quickServiceAutomation' },
      { id: 'whitelist', icon: icon(), labelKey: 'home.whitelist' },
      { id: 'blacklist', icon: icon(), labelKey: 'home.blacklist' },
    ],
  },
  {
    id: 'admin',
    titleKey: 'home.quickServiceSectionAdmin',
    items: [
      { id: 'subscription', icon: icon(), labelKey: 'home.quickServiceSubscription' },
      { id: 'teamAccount', icon: icon(), labelKey: 'home.quickServiceTeamAccount' },
      { id: 'order', icon: icon(), labelKey: 'home.quickServiceOrder' },
      { id: 'member', icon: icon(), labelKey: 'home.quickServiceMember' },
      { id: 'role', icon: icon(), labelKey: 'home.quickServiceRole' },
      { id: 'teamApi', icon: icon(), labelKey: 'home.quickServiceTeamApi' },
      { id: 'webhook', icon: icon(), labelKey: 'home.quickServiceWebhook' },
    ],
  },
  {
    id: 'appMarket',
    titleKey: 'home.quickServiceSectionAppMarket',
    items: [
      { id: 'appMarketTeamRole', icon: icon(), labelKey: 'home.quickServiceAppMarketTeamRole' },
      { id: 'remittance', icon: icon(), labelKey: 'home.quickServiceRemittance' },
      { id: 'swap', icon: icon(), labelKey: 'home.quickServiceSwap' },
    ],
  },
];

/** 旧版项：不在分区网格展示，仍可解析历史快捷入口 ID。 */
const LEGACY_QUICK_SERVICES: QuickServiceDef[] = [
  { id: 'todoList', icon: icon(), labelKey: 'home.quickServiceTodoList' },
  { id: 'walletWithdraw', icon: icon(), labelKey: 'home.quickServiceWalletWithdraw' },
  { id: 'subAddressWithdraw', icon: icon(), labelKey: 'home.quickServiceSubAddressWithdraw' },
  { id: 'developer', icon: icon(), labelKey: 'home.quickServiceDeveloper' },
  { id: 'ipWhitelist', icon: icon(), labelKey: 'home.quickServiceIpWhitelist' },
  { id: 'callbackSettings', icon: icon(), labelKey: 'home.quickServiceCallbackSettings' },
  { id: 'notificationSettings', icon: icon(), labelKey: 'home.quickServiceNotificationSettings' },
  {
    id: 'paymentRequest',
    icon: 'eds-arrow-deposit',
    labelKey: 'home.quickServicePaymentRequest',
  },
  { id: 'exchange', icon: icon(), labelKey: 'home.quickServiceExchange' },
  { id: 'aml', icon: 'eds-aml-search', labelKey: 'home.quickServiceAml' },
  { id: 'bill', icon: icon(), labelKey: 'home.quickServiceBill' },
  { id: 'signMessage', icon: icon(), labelKey: 'home.quickServiceSignMessage' },
];

export const QUICK_SERVICES_CATALOG: QuickServiceDef[] = [
  ...QUICK_SERVICE_SECTIONS.flatMap((section) => section.items),
  ...LEGACY_QUICK_SERVICES,
];

const catalogById = new Map(
  QUICK_SERVICES_CATALOG.map((item) => [item.id, item] as const),
);

export function resolveQuickService(id: QuickServiceId): QuickServiceDef | undefined {
  return catalogById.get(id);
}

export function resolveQuickServices(ids: readonly QuickServiceId[]): QuickServiceDef[] {
  return ids
    .map((id) => resolveQuickService(id))
    .filter((item): item is QuickServiceDef => item != null);
}
