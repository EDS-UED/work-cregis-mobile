/** EDS crypto `EgSymbol` name — 与 `cryptoAssetNames.generated` 一致（按 ticker 查）。 */
const CURRENCY_TO_EDS_CRYPTO_SYMBOL: Record<string, string> = {
  '1INCH': 'eds-1inch-1inch network',
  APT: 'eds-apt-aptos',
  AAVE: 'eds-aave-aave',
  AVAX: 'eds-avax-avalanche',
  BCH: 'eds-bch-bitcoin cash',
  BTC: 'eds-btc-bitcoin',
  DEEP: 'eds-deep-deepbook protocol',
  ETH: 'eds-eth-ethereum',
  /** Mock ticker `GBG` → EDS Bitget Token icon */
  GBG: 'eds-bgb-bitget token',
  HYPE: 'eds-hype-hyperliquid',
  LTC: 'eds-ltc-litecoin',
  MNT: 'eds-mnt-mantle',
  TON: 'eds-ton-toncoin',
  USDT: 'eds-usdt-tether usd',
  ZEC: 'eds-zec-zcash',
  SOL: 'eds-sol-solana',
};

export function edsCryptoSymbolForCurrency(currency: string): string | null {
  const key = currency.trim().toUpperCase();
  return CURRENCY_TO_EDS_CRYPTO_SYMBOL[key] ?? null;
}
