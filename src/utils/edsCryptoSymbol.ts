/** EDS crypto `EgSymbol` name — 与 `cryptoAssetNames.generated` 一致（按 ticker 查）。 */
const CURRENCY_TO_EDS_CRYPTO_SYMBOL: Record<string, string> = {
  AVAX: 'eds-avax-avalanche',
  BCH: 'eds-bch-bitcoin cash',
  BTC: 'eds-btc-bitcoin',
  ETH: 'eds-eth-ethereum',
  LTC: 'eds-ltc-litecoin',
  USDT: 'eds-usdt-tether usd',
};

export function edsCryptoSymbolForCurrency(currency: string): string | null {
  const key = currency.trim().toUpperCase();
  return CURRENCY_TO_EDS_CRYPTO_SYMBOL[key] ?? null;
}
