import { FastifyInstance } from 'fastify';
import { prisma, io } from '../server';

export default async function chatRoutes(fastify: FastifyInstance) {
  
  // Get chat history for an interaction
  fastify.get('/:interactionId', async (request, reply) => {
    const { interactionId } = request.params as { interactionId: string };
    
    try {
      const messages = await prisma.message.findMany({
        where: { interactionId },
        orderBy: { createdAt: 'asc' }
      });
      return messages;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch messages' });
    }
  });

  // Simulator endpoint to inject a customer message into an active interaction
  fastify.post('/simulator', async (request, reply) => {
    const { interactionId, text } = request.body as { interactionId: string, text: string };
    
    try {
      const interaction = await prisma.interaction.findUnique({
        where: { id: interactionId }
      });

      if (!interaction) {
        return reply.status(404).send({ error: 'Interaction not found' });
      }

      const now = new Date();
      const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;

      const message = await prisma.message.create({
        data: {
          interactionId,
          sender: 'customer',
          text,
          time
        }
      });

      // Broadcast via WebSockets
      io.emit('chat:receive_message', message);

      return message;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to simulate message' });
    }
  });
}
