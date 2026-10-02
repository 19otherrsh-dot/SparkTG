import { FastifyInstance } from 'fastify';
import { io } from '../server';
import { randomUUID } from 'crypto';

export default async function (fastify: FastifyInstance) {
  // POST /api/simulator/interaction — push a simulated incoming interaction to all connected agents
  fastify.post('/interaction', async (request, reply) => {
    const body = request.body as any;

    const interaction = {
      id: `int_${randomUUID().slice(0, 8)}`,
      type: body.type || 'voice',
      customerName: body.customerName || 'Unknown Caller',
      customerNumber: body.customerNumber || '+91 00000 00000',
      status: 'waiting' as const,
      duration: '00:00',
      intent: body.intent || 'New incoming interaction',
      action: body.action || 'Awaiting agent triage',
      tags: body.tags || [],
      timestamp: new Date().toISOString(),
    };

    // Broadcast to all connected WebSocket clients
    if (io) {
      io.emit('incoming_interaction', interaction);
      fastify.log.info(`Broadcasted interaction ${interaction.id} to all agents`);
    }

    return { success: true, interaction };
  });

  // POST /api/simulator/bulk — push multiple test interactions at once
  fastify.post('/bulk', async (request, reply) => {
    const testInteractions = [
      { type: 'voice', customerName: 'Priya Sharma', customerNumber: '+91 87654 32100', intent: 'Internet speed complaint', action: 'Run speed diagnostics', tags: ['Standard', 'Pune'] },
      { type: 'chat', customerName: 'Deepak Verma', customerNumber: 'deepak.v@corp.in', intent: 'Password reset for enterprise portal', action: 'Verify via OTP, trigger reset', tags: ['Enterprise', 'Chennai'] },
      { type: 'email', customerName: 'Sneha Patel', customerNumber: 'Ticket #9934', intent: 'Refund request for cancelled service', action: 'Check eligibility, process if valid', tags: ['Premium', 'Ahmedabad'] },
    ];

    const results = [];
    for (const item of testInteractions) {
      const interaction = {
        id: `int_${randomUUID().slice(0, 8)}`,
        ...item,
        status: 'waiting' as const,
        duration: '00:00',
        timestamp: new Date().toISOString(),
      };
      if (io) io.emit('incoming_interaction', interaction);
      results.push(interaction);
    }

    return { success: true, count: results.length, interactions: results };
  });
}
