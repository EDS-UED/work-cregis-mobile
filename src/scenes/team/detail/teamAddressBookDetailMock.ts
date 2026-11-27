import { HOME_TODO_MOCK_CURRENCIES_FIRST_10 } from '@/store/useHomeStore';
import { TEAM_MEMBER_NAME_POOL } from '@/scenes/team/detail/teamMemberDetailMock';

export type TeamAddressBookNetworkKey =
  | 'team.addressChainEthereum'
  | 'team.addressChainBnb'
  | 'team.addressChainTon'
  | 'team.addressChainZcash';

export type TeamAddressBookRow = {
  id: string;
  name: string;
  address: string;
  currency: string;
  networkLabelKey: TeamAddressBookNetworkKey;
  /** 第 1 条 · 文本底「★默认收款」彩色杏色。 */
  defaultReceive?: boolean;
  /** 第 1 条 · 文本底「★默认付款」彩色草绿。 */
  defaultPay?: boolean;
};

const ADDRESS_BOOK_ROW_COUNT = 28;

const BASE58ish = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function mockHex40(index: number): string {
  let hex = '';
  for (let i = 0; i < 40; i += 1) {
    hex += ((index * 97 + i * 13) % 16).toString(16);
  }
  return hex;
}

function mockBase58(length: number, index: number): string {
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += BASE58ish[(index * 31 + i * 7) % BASE58ish.length]!;
  }
  return out;
}

/** 各 Ticker 链上地址形态 · Mock 用确定性派生。 */
function mockAddressForCurrency(currency: string, index: number): string {
  switch (currency) {
    case 'TON':
      return `EQ${mockBase58(46, index + 1)}`;
    case 'ZEC':
      return `t1${mockBase58(33, index + 3)}`;
    default:
      return `0x${mockHex40(index + 1)}`;
  }
}

function currencyAt(index: number): string {
  return HOME_TODO_MOCK_CURRENCIES_FIRST_10[index % HOME_TODO_MOCK_CURRENCIES_FIRST_10.length]!;
}

function networkLabelKeyFor(currency: string, index: number): TeamAddressBookNetworkKey {
  if (currency === 'USDT' && index % 3 === 1) {
    return 'team.addressChainBnb';
  }
  if (currency === 'TON') {
    return 'team.addressChainTon';
  }
  if (currency === 'ZEC') {
    return 'team.addressChainZcash';
  }
  return 'team.addressChainEthereum';
}

/** @see `.cursor/rules/work.md` §4.3.1 */
export const TEAM_ADDRESS_BOOK_ROWS: TeamAddressBookRow[] = Array.from(
  { length: ADDRESS_BOOK_ROW_COUNT },
  (_, index) => {
    const currency = currencyAt(index);
    const name = TEAM_MEMBER_NAME_POOL[index] ?? `Member ${index + 1}`;
    return {
      id: `address-${String(index + 1).padStart(2, '0')}`,
      name,
      currency,
      address: mockAddressForCurrency(currency, index),
      networkLabelKey: networkLabelKeyFor(currency, index),
      ...(index === 0
        ? { defaultReceive: true, defaultPay: true }
        : undefined),
    };
  },
);