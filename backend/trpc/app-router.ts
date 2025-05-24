import { router } from './create-context';
import hiProcedure from './routes/example/hi/route';
import { usersRouter } from './routes/wallet/users';
import { currenciesRouter } from './routes/wallet/currencies';
import { transactionsRouter } from './routes/wallet/transactions';
import { notificationsRouter } from './routes/wallet/notifications';
import { supportRouter } from './routes/wallet/support';

export const appRouter = router({
  example: router({
    hi: hiProcedure,
  }),
  users: usersRouter,
  currencies: currenciesRouter,
  transactions: transactionsRouter,
  notifications: notificationsRouter,
  support: supportRouter,
});

export type AppRouter = typeof appRouter;