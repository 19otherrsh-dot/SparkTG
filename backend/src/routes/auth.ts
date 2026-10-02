import { FastifyInstance } from 'fastify';
import { prisma } from '../server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-for-sparktg-mvp';

export default async function (fastify: FastifyInstance) {
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as any;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Don't send password hash back
    const { password: _, ...safeUser } = user;
    return { token, user: safeUser };
  });

  fastify.get('/profile', async (request, reply) => {
    // Basic profile fallback if not using middleware directly on this endpoint
    const users = await prisma.user.findMany();
    return users[0] || { error: 'No users found' };
  });
}
