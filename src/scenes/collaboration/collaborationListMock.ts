import type { CollaborationItem } from '@/store/useCollaborationStore';

const SAMPLE_ROWS: Omit<CollaborationItem, 'id'>[] = [
  {
    amount: '20.77',
    currency: 'AVAX',
    initiatorName: '皮诺曹',
    actionKey: 'paymentRequest',
    timestamp: '2023.3.23 10:45:40',
    signKind: 'single',
    avatarLetter: 'P',
    avatarColorIndex: 2,
    chainSymbol: 'eds-avax-avalanche',
  },
  {
    amount: '23.021',
    currency: 'USDT',
    initiatorName: 'Cooper',
    actionKey: 'paymentRequest',
    timestamp: '2023.3.23 10:42:18',
    signKind: 'multi',
    avatarLetter: 'C',
    avatarColorIndex: 4,
    chainSymbol: 'eds-usdt-tether usd',
  },
  {
    amount: '2.574',
    currency: 'TON',
    initiatorName: 'Alex Mah.',
    actionKey: 'withdrawal',
    timestamp: '2023.3.23 10:38:02',
    signKind: 'approval',
    avatarLetter: 'A',
    avatarColorIndex: 1,
    chainSymbol: 'eds-ton-toncoin',
  },
  {
    amount: '100.00035',
    currency: 'HYPE',
    initiatorName: 'Project Name',
    actionKey: 'contractSign',
    timestamp: '2023.3.22 18:12:11',
    signKind: 'single',
    avatarLetter: 'H',
    avatarColorIndex: 3,
  },
  {
    amount: '5,087.005',
    currency: 'ZEC',
    initiatorName: 'Name',
    actionKey: 'withdrawal',
    timestamp: '2023.3.22 16:07:54',
    signKind: 'multi',
    avatarLetter: 'Z',
    avatarColorIndex: 5,
    chainSymbol: 'eds-zec-zcash',
  },
];

export const mockCollaborationItems: CollaborationItem[] = Array.from(
  { length: 24 },
  (_, index) => {
    const base = SAMPLE_ROWS[index % SAMPLE_ROWS.length]!;
    return {
      ...base,
      id: `TODO-${String(index + 1).padStart(6, '0')}`,
    };
  },
);
