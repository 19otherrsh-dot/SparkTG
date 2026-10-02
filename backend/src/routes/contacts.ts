import { FastifyInstance } from 'fastify';
import { prisma } from '../server';

export default async function (fastify: FastifyInstance) {
  
  fastify.get('/', async (request, reply) => {
    try {
      const contacts = await prisma.contact.findMany({
        orderBy: { updatedAt: 'desc' },
        include: { interactions: { orderBy: { createdAt: 'desc' } } }
      });
      
      // Map to frontend expected shape
      const mapped = contacts.map(c => ({
        id: c.id,
        name: c.name,
        email: c.email || '',
        phone: c.phone || '',
        company: c.company || '',
        location: c.location || '',
        tags: [],
        lastContact: c.interactions.length > 0 ? c.interactions[0].createdAt.toISOString() : 'Never',
        totalInteractions: c.interactions.length,
        channel: c.interactions.length > 0 ? c.interactions[0].type : 'voice'
      }));
      
      return mapped;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to fetch contacts' });
    }
  });

  fastify.post('/', async (request, reply) => {
    const { name, email, phone, company, location } = request.body as any;
    try {
      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone,
          company,
          location
        }
      });
      return {
        id: contact.id,
        name: contact.name,
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        location: contact.location || '',
        tags: ['New'],
        lastContact: 'Just now',
        totalInteractions: 0,
        channel: 'voice'
      };
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to create contact' });
    }
  });

  fastify.put('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, email, phone, company, location } = request.body as any;
    try {
      const contact = await prisma.contact.update({
        where: { id },
        data: { name, email, phone, company, location }
      });
      return contact;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({ error: 'Failed to update contact' });
    }
  });
}
