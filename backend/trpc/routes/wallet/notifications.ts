import { publicProcedure, router } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { Notification } from '@/types/wallet';
import { v4 as uuidv4 } from 'uuid';

// In a real app, this would be in a database
let notifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'user1',
    title: 'Welcome to Agile Wallet',
    message: 'Thank you for joining Agile Wallet. Start by adding funds to your wallet.',
    timestamp: Date.now() - 86400000 * 3, // 3 days ago
    read: true,
    type: 'system'
  },
  {
    id: 'notif2',
    userId: 'user1',
    title: 'Complete Your KYC',
    message: 'Please complete your KYC verification to unlock all features.',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    read: false,
    type: 'kyc'
  },
  {
    id: 'notif3',
    userId: 'user1',
    title: 'Transaction Completed',
    message: 'Your transaction of 0.5 BTC has been completed.',
    timestamp: Date.now() - 86400000, // 1 day ago
    read: false,
    type: 'transaction',
    transactionId: 'tx1'
  }
];

export const notificationsRouter = router({
  getAll: publicProcedure.query(() => {
    return notifications;
  }),
  
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return notifications.filter(n => n.userId === input.userId)
        .sort((a, b) => b.timestamp - a.timestamp); // Sort by timestamp, newest first
    }),
  
  getUnreadCount: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return notifications.filter(n => n.userId === input.userId && !n.read).length;
    }),
  
  create: publicProcedure
    .input(z.object({
      userId: z.string(),
      title: z.string(),
      message: z.string(),
      type: z.enum(['system', 'transaction', 'kyc', 'support', 'security', 'admin']),
      transactionId: z.string().optional()
    }))
    .mutation(({ input }) => {
      const newNotification: Notification = {
        id: uuidv4(),
        userId: input.userId,
        title: input.title,
        message: input.message,
        timestamp: Date.now(),
        read: false,
        type: input.type,
        transactionId: input.transactionId
      };
      
      notifications.push(newNotification);
      return newNotification;
    }),
  
  markAsRead: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const notificationIndex = notifications.findIndex(n => n.id === input.id);
      if (notificationIndex === -1) {
        throw new Error('Notification not found');
      }
      
      notifications[notificationIndex].read = true;
      return notifications[notificationIndex];
    }),
  
  markAllAsRead: publicProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(({ input }) => {
      notifications = notifications.map(n => 
        n.userId === input.userId ? { ...n, read: true } : n
      );
      
      return notifications.filter(n => n.userId === input.userId);
    }),
});