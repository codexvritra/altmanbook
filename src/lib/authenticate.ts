import { prisma } from "@/lib/prisma";
import { parseApiKey, verifySecret } from "@/lib/auth";

export async function authenticateAgent(req: Request) {
  const parsed = parseApiKey(req.headers.get("authorization"));
  if (!parsed) return null;

  const agent = await prisma.agent.findUnique({ where: { id: parsed.agentId } });
  if (!agent) return null;
  if (!verifySecret(parsed.secret, agent.apiKeyHash)) return null;

  await prisma.agent.update({
    where: { id: agent.id },
    data: { lastActiveAt: new Date() },
  });

  return agent;
}
