import { FastifyInstance } from 'fastify';
import { prisma } from '../server';

export default async function (fastify: FastifyInstance) {
  
  // GET /api/analytics/history
  fastify.get('/history', async (request, reply) => {
    try {
      const interactions = await prisma.interaction.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          contact: true
        }
      });
      
      const mappedHistory = interactions.map(int => {
        // Parse the duration string (e.g. "04:23") or calculate if missing
        let dur = int.duration || '00:00';
        
        // Mocking the agent name for now, in a real system we'd link to User
        const agentName = 'Agent User'; 
        
        const dateObj = new Date(int.createdAt);
        const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        
        return {
          id: int.id,
          direction: int.type === 'voice' ? 'inbound' : int.type, // Map 'chat' as inbound for simplicity, or keep as is. Actually frontend expects 'inbound', 'outbound', 'missed'
          callerName: int.customerName || 'Unknown',
          callerNumber: int.customerNumber || 'Unknown',
          agent: agentName,
          queue: int.tags || 'General',
          duration: dur,
          waitTime: '00:15', // Mocked wait time
          disposition: int.status === 'closed' ? 'Resolved' : 'Active',
          timestamp: timeStr,
          date: dateStr,
          recording: int.type === 'voice'
        };
      });

      return mappedHistory;
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to fetch history' });
    }
  });

  // GET /api/analytics/reports
  fastify.get('/reports', async (request, reply) => {
    try {
      const totalCalls = await prisma.interaction.count();
      
      // Calculate average duration
      const interactions = await prisma.interaction.findMany({
        select: { duration: true, type: true, status: true }
      });
      
      let totalSeconds = 0;
      let durCount = 0;
      
      const channelCounts: Record<string, number> = {
        'voice': 0,
        'chat': 0,
        'email': 0
      };

      let resolvedCount = 0;
      let activeCount = 0;

      interactions.forEach(int => {
        if (int.duration) {
          const parts = int.duration.split(':');
          if (parts.length === 2) {
            totalSeconds += (parseInt(parts[0]) * 60) + parseInt(parts[1]);
            durCount++;
          }
        }
        
        if (channelCounts[int.type] !== undefined) {
          channelCounts[int.type]++;
        } else {
          channelCounts[int.type] = 1;
        }

        if (int.status === 'closed') {
          resolvedCount++;
        } else {
          activeCount++;
        }
      });
      
      const avgSeconds = durCount > 0 ? Math.floor(totalSeconds / durCount) : 0;
      const avgMins = Math.floor(avgSeconds / 60);
      const avgSecsRemainder = avgSeconds % 60;
      const avgDurationStr = `${String(avgMins).padStart(2, '0')}:${String(avgSecsRemainder).padStart(2, '0')}`;
      
      return {
        totalCalls,
        avgDuration: avgDurationStr,
        channelDistribution: [
          channelCounts['voice'] || 0,
          channelCounts['chat'] || 0,
          channelCounts['email'] || 0,
          0 // WhatsApp mock
        ],
        statusCounts: {
          resolved: resolvedCount,
          active: activeCount
        }
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: 'Failed to generate reports' });
    }
  });
}
