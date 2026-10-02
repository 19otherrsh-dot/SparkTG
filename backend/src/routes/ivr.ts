import { FastifyInstance } from 'fastify';
import { prisma } from '../server';

export default async function (fastify: FastifyInstance) {
  fastify.get('/flows', async () => {
    return await prisma.ivrFlow.findMany();
  });

  fastify.post('/flows', async (request, reply) => {
    const { name, description, nodes, edges } = request.body as any;
    
    const flow = await prisma.ivrFlow.create({
      data: {
        name: name || 'Untitled Flow',
        description,
        nodes: JSON.stringify(nodes || []),
        edges: JSON.stringify(edges || [])
      }
    });
    
    return flow;
  });

  fastify.put('/flows/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { name, description, nodes, edges, isActive } = request.body as any;
    
    const flow = await prisma.ivrFlow.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(nodes && { nodes: JSON.stringify(nodes) }),
        ...(edges && { edges: JSON.stringify(edges) }),
        ...(isActive !== undefined && { isActive })
      }
    });
    
    return flow;
  });

  fastify.delete('/flows/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    await prisma.ivrFlow.delete({ where: { id } });
    return { success: true };
  });
}
