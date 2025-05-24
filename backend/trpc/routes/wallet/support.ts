import { publicProcedure, router } from '@/backend/trpc/create-context';
import { z } from 'zod';
import { SupportTicket, SupportMessage } from '@/types/wallet';
import { v4 as uuidv4 } from 'uuid';

// Mock data
let supportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: 'user1',
    subject: 'Cannot withdraw funds',
    status: 'open',
    timestamp: Date.now() - 86400000 * 2, // 2 days ago
    messages: [
      {
        id: '1-1',
        sender: 'user',
        content: 'I am trying to withdraw my funds but I keep getting an error. Can you help?',
        timestamp: Date.now() - 86400000 * 2,
      }
    ]
  },
  {
    id: '2',
    userId: 'user1',
    subject: 'KYC verification issue',
    status: 'in_progress',
    timestamp: Date.now() - 86400000, // 1 day ago
    messages: [
      {
        id: '2-1',
        sender: 'user',
        content: 'My KYC verification has been pending for over a week. Can you check the status?',
        timestamp: Date.now() - 86400000,
      },
      {
        id: '2-2',
        sender: 'admin',
        content: 'We are reviewing your documents. There seems to be an issue with the image quality. Could you please resubmit a clearer photo of your ID?',
        timestamp: Date.now() - 43200000, // 12 hours ago
      }
    ]
  },
  {
    id: '3',
    userId: 'user2',
    subject: 'Account security',
    status: 'closed',
    timestamp: Date.now() - 86400000 * 5, // 5 days ago
    messages: [
      {
        id: '3-1',
        sender: 'user',
        content: 'I want to enable 2FA for my account. How do I do that?',
        timestamp: Date.now() - 86400000 * 5,
      },
      {
        id: '3-2',
        sender: 'admin',
        content: 'You can enable 2FA in your security settings. Go to Profile > Security > Two-Factor Authentication and follow the instructions.',
        timestamp: Date.now() - 86400000 * 4.5,
      },
      {
        id: '3-3',
        sender: 'user',
        content: 'Thank you, I was able to set it up!',
        timestamp: Date.now() - 86400000 * 4,
      }
    ]
  }
];

export const supportRouter = router({
  getAll: publicProcedure.query(() => {
    return supportTickets;
  }),
  
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      const ticket = supportTickets.find(t => t.id === input.id);
      if (!ticket) {
        throw new Error('Support ticket not found');
      }
      return ticket;
    }),
  
  getByUserId: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(({ input }) => {
      return supportTickets.filter(t => t.userId === input.userId);
    }),
  
  create: publicProcedure
    .input(z.object({
      userId: z.string(),
      subject: z.string(),
      message: z.string(),
    }))
    .mutation(({ input }) => {
      const newTicket: SupportTicket = {
        id: uuidv4(),
        userId: input.userId,
        subject: input.subject,
        status: 'open',
        timestamp: Date.now(),
        messages: [
          {
            id: uuidv4(),
            sender: 'user',
            content: input.message,
            timestamp: Date.now(),
          }
        ]
      };
      
      supportTickets.push(newTicket);
      return newTicket;
    }),
  
  addResponse: publicProcedure
    .input(z.object({
      ticketId: z.string(),
      message: z.string(),
      fromAdmin: z.boolean(),
    }))
    .mutation(({ input }) => {
      const ticketIndex = supportTickets.findIndex(t => t.id === input.ticketId);
      if (ticketIndex === -1) {
        throw new Error('Support ticket not found');
      }
      
      const ticket = supportTickets[ticketIndex];
      
      const newMessage: SupportMessage = {
        id: uuidv4(),
        sender: input.fromAdmin ? 'admin' : 'user',
        content: input.message,
        timestamp: Date.now(),
      };
      
      // Update ticket status if admin responds
      if (input.fromAdmin && ticket.status === 'open') {
        ticket.status = 'in_progress';
      }
      
      // Add the new message
      ticket.messages.push(newMessage);
      
      // Update the ticket
      supportTickets[ticketIndex] = ticket;
      
      return ticket;
    }),
  
  close: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const ticketIndex = supportTickets.findIndex(t => t.id === input.id);
      if (ticketIndex === -1) {
        throw new Error('Support ticket not found');
      }
      
      supportTickets[ticketIndex].status = 'closed';
      return supportTickets[ticketIndex];
    }),
});