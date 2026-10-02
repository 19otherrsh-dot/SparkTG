import { FastifyInstance } from 'fastify';
import { prisma } from '../server';
import bcrypt from 'bcrypt';

export default async function (fastify: FastifyInstance) {
  
  // GET /api/users - List all users
  fastify.get('/', async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: { createdAt: 'desc' }
      });
      return users;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch users' });
    }
  });

  // POST /api/users - Create a new user
  fastify.post<{ Body: { email: string; name: string; role: string } }>('/', async (request, reply) => {
    try {
      const { email, name, role } = request.body;
      
      if (!email || !name || !role) {
        return reply.status(400).send({ error: 'Missing required fields' });
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return reply.status(400).send({ error: 'User with this email already exists' });
      }

      // Default password for MVP: password123
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      const newUser = await prisma.user.create({
        data: {
          email,
          name,
          role,
          password: hashedPassword
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true
        }
      });

      return reply.status(201).send(newUser);
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to create user' });
    }
  });
}
