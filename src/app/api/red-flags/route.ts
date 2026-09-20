import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RED_FLAG_CATEGORIES } from "@/lib/constants";

const allowed = new Set(RED_FLAG_CATEGORIES.map((c) => c.value));

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.projectId || !body?.title || !body?.body || !body?.category) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  const category = String(body.category);
  if (!allowed.has(category as (typeof RED_FLAG_CATEGORIES)[number]["value"])) {
    return NextResponse.json({ error: "Unknown category" }, { status: 400 });
  }
  const title = String(body.title).trim();
  const text = String(body.body).trim();
  if (title.length < 6 || text.length < 20) {
    return NextResponse.json({ error: "Write a bit more detail" }, { status: 400 });
  }
  const project = await prisma.project.findUnique({ where: { id: String(body.projectId) } });
  if (!project) return NextResponse.json({ error: "Unknown project" }, { status: 404 });

  const flag = await prisma.redFlag.create({
    data: {
      projectId: project.id,
      category,
      title,
      body: text,
      proofLabel: body.proofLabel ? String(body.proofLabel).slice(0, 160) : null,
    },
  });
  return NextResponse.json({ id: flag.id });
}
