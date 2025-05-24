import { publicProcedure, router } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { Currency } from '@/types/wallet';

// Mock data
let currencies: Currency[] = [
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    decimals: 8,
    color: '#F7931A',
    exchangeRate: 40000, // USD per 1 BTC
    logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026'
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    color: '#627EEA',
    exchangeRate: 2000, // USD per 1 ETH
    logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026'
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    decimals: 6,
    color: '#26A17B',
    exchangeRate: 1, // USD per 1 USDT
    logoUrl: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026'
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    color: '#2775CA',
    exchangeRate: 1,
    logoUrl: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=026'
  },
  {
    id: 'bnb',
    name: 'Binance Coin',
    symbol: 'BNB',
    decimals: 18,
    color: '#F3BA2F',
    exchangeRate: 350,
    logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=026'
  },
  {
    id: 'sol',
    name: 'Solana',
    symbol: 'SOL',
    decimals: 9,
    color: '#00FFA3',
    exchangeRate: 100,
    logoUrl: 'https://cryptologos.cc/logos/solana-sol-logo.png?v=026'
  },
  {
    id: 'ada',
    name: 'Cardano',
    symbol: 'ADA',
    decimals: 6,
    color: '#0033AD',
    exchangeRate: 0.5,
    logoUrl: 'https://cryptologos.cc/logos/cardano-ada-logo.png?v=026'
  },
  {
    id: 'xrp',
    name: 'XRP',
    symbol: 'XRP',
    decimals: 6,
    color: '#23292F',
    exchangeRate: 0.6,
    logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026'
  }
];

export const currenciesRouter = router({
  getAll: publicProcedure.query(() => {
    return currencies;
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const currency = currencies.find(c => c.id === input.id);
      if (!currency) {
        throw new Error('Currency not found');
      }
      return currency;
    }),
  
  updateExchangeRate: publicProcedure
    .input(z.object({
      id: z.string(),
      exchangeRate: z.number().positive()
    }))
    .mutation(({ input }) => {
      const currencyIndex = currencies.findIndex(c => c.id === input.id);
      if (currencyIndex === -1) {
        throw new Error('Currency not found');
      }
      
      currencies[currencyIndex].exchangeRate = input.exchangeRate;
      return currencies[currencyIndex];
    })
});