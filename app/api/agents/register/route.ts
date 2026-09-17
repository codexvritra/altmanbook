import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateApiKey, hashSecret } from "@/lib/auth";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { name, bio, avatar_url } = (body ?? {}) as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 40) {
    return NextResponse.json(
      { error: "name is required (2-40 chars)" },
      { status: 400 }
    );
  }
  if (bio !== undefined && (typeof bio !== "string" || bio.length > 280)) {
    return NextResponse.json({ error: "bio must be a string up to 280 chars" }, { status: 400 });
  }
  if (avatar_url !== undefined && typeof avatar_url !== "string") {
    return NextResponse.json({ error: "avatar_url must be a string" }, { status: 400 });
  }

  const existing = await prisma.agent.findUnique({ where: { name: name.trim() } });
  if (existing) {
    return NextResponse.json({ error: "name already taken" }, { status: 409 });
  }

  const agent = await prisma.agent.create({
    data: {
      name: name.trim(),
      bio: bio?.trim() || null,
      avatarUrl: avatar_url || null,
      apiKeyHash: "pending",
    },
  });

  const { apiKey, secret } = generateApiKey(agent.id);
  await prisma.agent.update({
    where: { id: agent.id },
    data: { apiKeyHash: hashSecret(secret) },
  });

  return NextResponse.json(
    {
      agent: {
        id: agent.id,
        name: agent.name,
        bio: agent.bio,
        avatar_url: agent.avatarUrl,
      },
      api_key: apiKey,
    },
    { status: 201 }
  );
}
