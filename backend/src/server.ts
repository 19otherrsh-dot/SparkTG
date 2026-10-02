import Fastify from 'fastify';
import cors from '@fastify/cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import authRoutes from './routes/auth';
import ivrRoutes from './routes/ivr';
import simulatorRoutes from './routes/simulator';
import chatRoutes from './routes/chat';
import contactsRoutes from './routes/contacts';
import analyticsRoutes from './routes/analytics';
import usersRoutes from './routes/users';
import { authenticate } from './middleware/auth';
import { Server } from 'socket.io';

export const prisma = new PrismaClient();

const fastify = Fastify({
  logger: true
});

// Socket.io instance — exported for use in routes
export let io: Server;

fastify.register(cors, {
  origin: '*',
});

// Public Routes
fastify.register(authRoutes, { prefix: '/api/auth' });
fastify.register(simulatorRoutes, { prefix: '/api/simulator' }); // Kept public for simulator use

// Protected Routes
fastify.register(async (app) => {
  app.addHook('preHandler', authenticate);
  app.register(ivrRoutes, { prefix: '/ivr' });
  app.register(chatRoutes, { prefix: '/chat' });
  app.register(contactsRoutes, { prefix: '/contacts' });
  app.register(analyticsRoutes, { prefix: '/analytics' });
  app.register(usersRoutes, { prefix: '/users' });
}, { prefix: '/api' });

// Health check
fastify.get('/api/health', async () => {
  return { status: 'ok', timestamp: new Date() };
});

const seedDatabaseIfNeeded = async () => {
  // Seed Users
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    fastify.log.info('Seeding initial users...');
    const hashedAdmin = await bcrypt.hash('password123', 10);
    const hashedAgent = await bcrypt.hash('password123', 10);
    
    await prisma.user.create({
      data: { name: 'Admin User', email: 'admin@sparktg.com', password: hashedAdmin, role: 'SUPERVISOR' }
    });
    await prisma.user.create({
      data: { name: 'Agent User', email: 'agent@sparktg.com', password: hashedAgent, role: 'AGENT' }
    });
  }

  // Seed Contacts
  const contactCount = await prisma.contact.count();
  if (contactCount === 0) {
    fastify.log.info('Seeding initial contacts...');
    const mockContacts = [
      { id: 'c1', name: 'Ramesh Kumar', email: 'ramesh.k@techcorp.in', phone: '+91 98765 43210', company: 'TechCorp India', location: 'Delhi/NCR' },
      { id: 'c2', name: 'Anita Singh', email: 'anita.s@globalfin.com', phone: '+91 87654 32109', company: 'GlobalFin Services', location: 'Mumbai' },
      { id: 'c3', name: 'Vikram Mehta', email: 'vikram.m@retailplus.in', phone: '+91 76543 21098', company: 'RetailPlus', location: 'Bangalore' },
    ];
    for (const c of mockContacts) {
      await prisma.contact.create({ data: c });
    }
  }

  // Seed Interactions
  const count = await prisma.interaction.count();
  if (count === 0) {
    fastify.log.info('Seeding initial interactions into database...');
    const seeds = getSeedInteractions();
    for (const seed of seeds) {
      await prisma.interaction.create({
        data: {
          id: seed.id,
          type: seed.type,
          status: seed.status,
          duration: seed.duration,
          intent: seed.intent,
          action: seed.action,
          tags: seed.tags?.join(','),
          customerName: seed.customerName,
          customerNumber: seed.customerNumber,
        }
      });
      // Add initial greeting message
      const now = new Date();
      await prisma.message.create({
        data: {
          interactionId: seed.id,
          sender: 'customer',
          text: `Hello, I'm having trouble with my ${seed.type === 'chat' ? 'connection' : 'account upgrade'}. Can you help?`,
          time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`,
        }
      });
    }
  }
};

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.HOST || '0.0.0.0';
    await fastify.listen({ port, host });
    
    await seedDatabaseIfNeeded();

    // Initialize Socket.io on the fastify server instance
    io = new Server(fastify.server, {
      cors: { origin: '*' }
    });

    io.on('connection', async (socket) => {
      fastify.log.info(`Agent connected: ${socket.id}`);

      // When an agent joins, send them seed interactions so the desktop isn't empty
      const dbInteractions = await prisma.interaction.findMany({
        where: { status: { in: ['waiting', 'active'] } }
      });
      const formattedInteractions = dbInteractions.map(i => ({
        ...i,
        tags: i.tags ? i.tags.split(',') : []
      }));
      socket.emit('seed_interactions', formattedInteractions);
      
      socket.on('agent:accept_interaction', (interactionId: string) => {
        fastify.log.info(`Agent ${socket.id} accepted interaction ${interactionId}`);
        socket.emit('interaction_accepted', { interactionId, status: 'active' });
      });

      socket.on('agent:end_interaction', (interactionId: string) => {
        fastify.log.info(`Agent ${socket.id} ended interaction ${interactionId}`);
        socket.emit('interaction_ended', { interactionId });
      });

      socket.on('chat:send_message', async (data: { interactionId: string, text: string }) => {
        const now = new Date();
        const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
        try {
          const message = await prisma.message.create({
            data: {
              interactionId: data.interactionId,
              sender: 'agent',
              text: data.text,
              time
            }
          });
          // Broadcast message back so all clients see it
          io.emit('chat:receive_message', message);
        } catch (err) {
          fastify.log.error('Failed to save chat message:', err);
        }
      });

      socket.on('disconnect', () => {
        fastify.log.info(`Agent disconnected: ${socket.id}`);
      });
    });

    // Broadcast live wallboard metrics every 3 seconds
    setInterval(() => {
      const metrics = generateWallboardMetrics();
      io.emit('wallboard_update', metrics);
    }, 3000);

    console.log(`Server listening on http://localhost:3001`);
    console.log(`WebSocket server ready on ws://localhost:3001`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

function getSeedInteractions() {
  return [
    {
      id: 'int_seed_1',
      type: 'voice' as const,
      customerName: 'Ramesh Kumar',
      customerNumber: '+91 98765 43210',
      status: 'active' as const,
      duration: '04:23',
      intent: 'Billing enquiry regarding latest invoice.',
      action: 'Verify identity, explain pro-rated charges.',
      tags: ['Premium Customer', 'Delhi/NCR'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 'int_seed_2',
      type: 'chat' as const,
      customerName: 'Anita Singh',
      customerNumber: 'anita.s@example.com',
      status: 'active' as const,
      duration: '02:15',
      intent: 'Cannot connect to Wi-Fi network.',
      action: 'Send router restart instructions.',
      tags: ['Standard', 'Mumbai'],
      timestamp: new Date().toISOString(),
    },
    {
      id: 'int_seed_3',
      type: 'email' as const,
      customerName: 'Vikram Mehta',
      customerNumber: 'Support Ticket #8821',
      status: 'waiting' as const,
      duration: '15m',
      intent: 'Upgrade enterprise plan request.',
      action: 'Review usage history before replying.',
      tags: ['Enterprise', 'Bangalore'],
      timestamp: new Date().toISOString(),
    },
  ];
}

function generateWallboardMetrics() {
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  
  return {
    activeCalls: rand(35, 55),
    agentsOnline: rand(15, 22),
    agentsTotal: 25,
    avgWaitTime: `${rand(0, 2)}:${String(rand(10, 59)).padStart(2, '0')}`,
    abandonRate: (Math.random() * 3 + 0.5).toFixed(1),
    queues: [
      { name: 'Tier 1 Support', waiting: rand(5, 18), active: rand(15, 28), sla: rand(88, 99), status: rand(0, 10) > 7 ? 'critical' : rand(0, 10) > 4 ? 'warning' : 'good' },
      { name: 'Enterprise Sales', waiting: rand(0, 5), active: rand(5, 12), sla: rand(95, 100), status: 'good' },
      { name: 'Billing Enquiries', waiting: rand(8, 22), active: rand(6, 14), sla: rand(78, 95), status: rand(0, 10) > 5 ? 'critical' : 'warning' },
      { name: 'Technical Support', waiting: rand(2, 10), active: rand(8, 18), sla: rand(85, 98), status: rand(0, 10) > 6 ? 'warning' : 'good' },
    ],
    agents: [
      { name: 'Deepak Sharma', status: 'on-call', queue: 'Tier 1 Support', duration: `${rand(1, 15)}:${String(rand(0, 59)).padStart(2, '0')}` },
      { name: 'Priya Reddy', status: 'available', queue: 'Enterprise Sales', duration: '—' },
      { name: 'Amit Joshi', status: 'on-call', queue: 'Billing Enquiries', duration: `${rand(1, 10)}:${String(rand(0, 59)).padStart(2, '0')}` },
      { name: 'Sneha Kapoor', status: 'wrap-up', queue: 'Technical Support', duration: `${rand(0, 3)}:${String(rand(0, 59)).padStart(2, '0')}` },
      { name: 'Rahul Verma', status: 'on-call', queue: 'Tier 1 Support', duration: `${rand(1, 20)}:${String(rand(0, 59)).padStart(2, '0')}` },
      { name: 'Kavita Nair', status: 'break', queue: 'Enterprise Sales', duration: `${rand(5, 15)}:${String(rand(0, 59)).padStart(2, '0')}` },
    ],
    timestamp: new Date().toISOString(),
  };
}

start();
